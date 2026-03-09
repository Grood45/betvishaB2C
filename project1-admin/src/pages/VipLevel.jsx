import React, { useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa6";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import AddNewPromotion from "../Modals/AddNewPromotion";
import AddNewBonus from "../Modals/AddNewBonus";
import { fetchGetRequest, sendDeleteRequest, sendPatchRequest } from "../api/api";
import { Badge, Switch, useToast } from "@chakra-ui/react";
import ConfirmPromotionDelete from "../Modals/ConfirmPromotionDelete";
import { useTranslation } from "react-i18next";
import { checkPermission, formatDate } from "../../utils/utils";
import AddNewVipLevel from "../Modals/AddNewVipLevel";
import { RiVipCrownFill } from "react-icons/ri";

const VipLevel = () => {
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
          {t(`Vip Level`)}
        </h1>
        {/* {check&&<AddNewVipLevel id="1" getAllPromotion={getAllPromotion}  data={promotionData}/>} */}
      </div>
      {/* <div className="grid grid-cols-1 w-[100%] mt-3 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotionData?.map((data) => (
            <div
            style={{ border: `1px solid ${border}` }}
            className="bg-white shadow-md rounded-md p-4 w-[100%]"
          >
            <div style={{border:`2px solid ${border}`}} className="border rounded-[50%] w-[100px] m-auto  h-[100px] ">
            <img
              src={data?.image}
              alt="Avatar"
              className="w-[100%] m-auto   h-[100%] rounded-md mb-4"
            />
            </div>
            <div className="flex justify-center items-center">
            <p className="text-center text-xl flex gap-2 items-center m-auto font-bold mt-1"><span className="text-purple-500"><RiVipCrownFill /></span>Vip 1<span><RiVipCrownFill color="#FFD700" /></span></p>

            </div>
           
           <div style={{border:`1px solid ${border}`}} className="w-[100%] rounded-lg pt-2 pb-2  mt-5  m-auto">


            <div  className="flex border-b px-2  justify-between w-[100%] mt-2 ">
              <h2 className="text-lg font-semibold mb-2">{t(`Category`)}</h2>
      
              <h2 className="text-lg font-semibold mb-2">{data?.category}</h2>
            </div>
            <div className="flex border-b p-2 justify-between w-[100%]  ">
              <h2 className="text-sm font-semibold "> {t(`Sub`)}{t(`Category`)}</h2>
      
              <h2 className="text-sm font-semibold ">{data?.sub_category}</h2>
            </div>
            <div className="flex border-b p-2 items-center justify-between w-[100%]  ">
              <h2 className="text-sm font-semibold"> {t(`Wagered`)}</h2>
      
              <h2 className="text-sm font-semibold">{data?.wager_required||0}</h2>
            </div>
            
          
            
            <div className="flex p-2 justify-between  ">
              <p className="text-[15px] font-bold text-gray-600 ">
              {data?.category!=="Bet Bonus"?`${t(`Min deposit amount`)}`:`${t(`Min Bet`)}`}
              </p>
                <p className="font-bold">({data?.category!=="Bet Bonus"?data?.min_deposit:data?.min_bet})</p>
            </div>
            </div>
      
           
           
      
            <div className="flex w-[100%] p-2 m-auto justify-between mt-2 items-center mb-4">
              <div className="font-bold w-[100%] " style={{ color: iconColor }}>
                {" "}
                <Switch   onChange={()=>UpdateStatus(data?._id, !data?.status)}  colorScheme={"green"} isChecked={data?.status} /> <span className={`${data?.status?"text-green-500":"text-red-500"}`}>{data?.status?"Active":'InActive'}</span>
              </div>
      
      <div className="flex items-center gap-5"> 
      <AddNewVipLevel id="2" data={data} getAllPromotion={getAllPromotion} />
              <ConfirmPromotionDelete data={data}  getAllPromotion={getAllPromotion} />
      </div>
              
             
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default VipLevel;
