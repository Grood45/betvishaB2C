import React, { useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa6";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import AddNewPromotion from "../Modals/AddNewPromotion";
import AddNewBonus from "../Modals/AddNewBonus";
import AddNewContribution from "../Modals/AddNewContribution";
import { fetchGetRequest, sendDeleteRequest, sendPatchRequest } from "../api/api";
import { Badge, Switch, useToast } from "@chakra-ui/react";
import ConfirmPromotionDelete from "../Modals/ConfirmPromotionDelete";
import { useTranslation } from "react-i18next";
import { checkPermission, formatDate } from "../../utils/utils";

const BonusContribution = () => {
  const {
    color,
    primaryBg,
    iconColor,
    secondaryBg,
    bg,
    hoverColor,
    hover,
    text,
    font,
    border,
  } = useSelector((state) => state.theme);
  const { t, i18n } = useTranslation();

  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [promotionData, setPromotionData] = useState();

  const getAllPromotion = async () => {
    setLoading(true);
    let url = `${import.meta.env.VITE_API_URL}/api/promotion/get-all-promotion`;
    try {
      let response = await fetchGetRequest(url);
      const data = response.data;
      setLoading(false);
      console.log(response,"response data")
      setPromotionData(response.promotions);
    } catch (error) {
      setLoading(false);
      toast({
        description: `${error?.data?.message || error?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      console.log(error);
    }
  };

  const [updateLoading,setUpdateLoading]=useState(false)
  const UpdateStatus = async (updateId, newStatus) => {
    setUpdateLoading(true);
    try {
  
      const response = await sendPatchRequest(
        `${import.meta.env.VITE_API_URL}/api/promotion/update-promotion-status/${updateId}`,
        {status:newStatus}
      );
      toast({
        title: ` ${newStatus?"promotion activated ":"promotion diactivated "} `,
        status: newStatus?"success":"error",
        duration: 2000,
        isClosable: true,
      });
      setUpdateLoading(false);
      getAllPromotion(); 
    } catch (error) {
      setUpdateLoading(false);
  
      toast({
        title: error?.data?.message || error?.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    onClose();
  };

  useEffect(() => {
    getAllPromotion();
  }, []);

  const toggleSwitch = () => {
    setIsEnabled((prev) => !prev);

  };

  const user = useSelector((state) => state.authReducer);

  const adminData = user.user || {};
  const isOwnerAdmin = adminData?.role_type === 'owneradmin';
  
  const permissionDetails=user?.user?.permissions
  
  
  let hasPermission=checkPermission(permissionDetails,"bonusManage")
  let check=!isOwnerAdmin?hasPermission:true
  

 
  return (
    <div className="w-[100%] mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        <h1
          style={{ color: iconColor }}
          className={`text-sm md:text-2xl font-bold mb-4 `}
        >
          {" "}
          {t(`Bonus`)} {t(`Contribution`)}
        </h1>
        {check&&<AddNewContribution id="1" getAllPromotion={getAllPromotion}  data={promotionData}/>}
      </div>
      <div className="grid grid-cols-1 w-[100%] mt-3 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotionData?.map((data) => (
            <div
            style={{ border: `1px solid ${border}` }}
            className="bg-white shadow-md rounded-md p-4 w-[100%]"
          >
            <img
              src={data?.image}
              alt="Avatar"
              className="w-[100%] h-[200px] rounded-md mb-4"
            />
            <div className="flex justify-between w-[100%] mt-2 ">
              <h2 className="text-lg font-semibold mb-2">{t(`Category`)}</h2>
      
              <h2 className="text-lg font-semibold mb-2">{data?.category}</h2>
            </div>
            <div className="flex justify-between w-[100%]  ">
              <h2 className="text-sm font-semibold mb-2"> {t(`Sub`)}{t(`Category`)}</h2>
      
              <h2 className="text-sm font-semibold mb-2">{data?.sub_category}</h2>
            </div>
            <div className="flex justify-between w-[100%]  ">
              <h2 className="text-sm font-semibold mb-2"> {t(`Wagered`)}</h2>
      
              <h2 className="text-sm font-semibold mb-2">{data?.wager_required||0}</h2>
            </div>
            
            <div className="flex justify-between ">
              <h2 className="text-lg font-semibold mb-2">{t(`Type`)}</h2>
      
              {data?.reward_type !== "fixed" ? (
                <Badge  className="text-lg  font-semibold mb-2">
                  {data?.reward_type}({data?.reward_amount?.toFixed(2)})
                </Badge>
              ) : (
                <Badge className="text-lg font-semibold mb-2">
                  {data?.reward_type}
                </Badge>
              )}
            </div>
            <div className="flex justify-between ">
              <p className="text-[15px] font-bold text-gray-600 mb-2">
                {t(`Min`)} {t(`to`)} {t(`Max`)} {t(`Reward`)}
              </p>
              {data?.reward_type !== "fixed" ? (
                <p className="font-bold">
                  ({data?.min_reward||"null"} to {data?.max_reward||"null"})
                </p>
              ) : (
                <p className="font-bold">({data?.reward_amount?.toFixed(2)})</p>
              )}
            </div>
            <div className="flex justify-between  ">
              <p className="text-[15px] font-bold text-gray-600 mb-2">
              {data?.category!=="Bet Bonus"?"Min deposit amount":"Min Bet"}
              </p>
                <p className="font-bold">({data?.category!=="Bet Bonus"?data?.min_deposit:data?.min_bet})</p>
            </div>
      
            <p className="text-sm font-semibold mt-2 flex justify-between text-green-600 mb-2">
              <span>{t(`Start`)} {t(`Date`)}:{formatDate(data?.start_date)}</span>{" "}
            </p>
            <p className="text-sm font-semibold  mt-2 flex justify-between text-red-600 mb-2">
              <span>{t(`End`)} {t(`Date`)}: {formatDate(data?.end_date)}</span>{" "}
            </p>
      
            <marquee
              className="text-sm text-gray-600 mb-2"
              behavior="scroll"
              direction="center"
            >
              {data?.description}
            </marquee>
            <marquee
              className="text-sm text-gray-600 mb-2"
              behavior="scroll"
              direction="right"
            >
              {data?.eligibility}
            </marquee>
      
            <div className="flex justify-between mt-2 items-center mb-4">
              <div className="font-bold w-[100%] " style={{ color: iconColor }}>
                {" "}
                <Switch   onChange={()=>UpdateStatus(data?._id, !data?.status)}  colorScheme={"green"} isChecked={data?.status} /> <span className={`${data?.status?"text-green-500":"text-red-500"}`}>{data?.status?"Active":'InActive'}</span>
              </div>
      
      <div className="flex items-center gap-5"> 
      <AddNewContribution id="2" data={data} getAllPromotion={getAllPromotion} />
              {/* <ConfirmPromotionDelete data={data}  getAllPromotion={getAllPromotion} /> */}
      </div>
              
             
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BonusContribution;
