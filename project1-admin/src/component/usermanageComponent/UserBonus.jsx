import React, { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import coin from "../../assets/rupees.png";
import logo from "../../assets/logo.png";
import { Progress, useToast } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../../utils/utils";
import { fetchGetRequest } from "../../api/api";

const UserBonus = () => {
  const [loading1, setLoading1] = useState(false);
  const toast = useToast();
  const params = useParams();
  const { color,primaryBg,iconColor,secondaryBg, bg,hoverColor,hover,text, font, border } = useSelector(state => state.theme);
  const { t, i18n } = useTranslation();
const [transactionData,setTransactionData]=useState([])
console.log(params,"params23")
const [category,setCategory]=useState('')
const [subCategory,setSubCategory]=useState('')
const [status, setStatus] = useState("all");
const [limit,setLimit]=useState(10)
  const getBonusTransaction = async () => {
    setLoading1(true);
    let url = `${import.meta.env.VITE_API_URL}/api/bonus-history/get-all-bonus-history-for-user-by-admin?status=${status}&limit=${limit}&username=${params?.id}`;
    if (category) {
      url += `&category=${category}`;
    }
    if (subCategory) {
      url += `&sub_category=${subCategory}`;
    }
    try {
      let response = await fetchGetRequest(url);
      const data = response.data;
      const receivedData= response.data;
      if (receivedData) {
        setTransactionData(receivedData);
      }
      setLoading1(false);
    } catch (error) {
      toast({
        description: `${error?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    getBonusTransaction();
  }, [category,subCategory,status,limit]);


  return (
    <div className="mt-8 flex flex-col gap-2">
      <div className="flex justify-between items-center">
      <p style={{color:iconColor}} className="font-bold text-[15px]">{t(`Bonus`)} {t(`Details`)} </p>
      <div className='flex items-center gap-4'>
      <select onChange={(e)=>{
        setCategory(e.target.value)
        }} style={{border:`1px solid ${border}`}} className=" rounded-[6px] outline-none text-xs md:text-sm px-2 md:px-4 py-2">
        <option value=""> {t(`Categories`)}</option>
        
          <option  value={"user_bonus"}>{t(`User`)} {t(`Bonus`)}</option>
          <option  value={"deposit_bonus"}>{t(`Deposit`)} {t(`Bonus`)}</option>
          <option  value={"bet_bonus"}>{t(`Bet`)} {t(`Bonus`)}</option>

      </select>

     
      {/* <select onChange={(e)=>{
        setSubCategory(e.target.value)
        }} style={{border:`1px solid ${border}`}} className=" rounded-[6px] outline-none text-xs md:text-sm px-2 md:px-4 py-2">
        <option value=""> {t(`Sub`)} {t(`Categories`)}</option>
        <option  value={"first_user"}>{t(`First`)} {t(`User`)}</option>
          <option  value={"first_bet"}>{t(`First`)} {t(`Bet`)}</option>
      </select> */}

      <select onChange={(e)=>{
        setStatus(e.target.value)
        }} style={{border:`1px solid ${border}`}} className=" rounded-[6px] outline-none text-xs md:text-sm px-2 md:px-4 py-2 ">
        <option value="">Status</option>
          <option  value={"success"}>{t(`Success`)}</option>
          <option  value={"failed"}>{t(`Failed`)}</option>
      </select>
      <div className='flex items-center gap-1'>
      {t(`Show`)} 
        <select onChange={(e)=>setLimit(e.target.value)} style={{border:`1px solid ${border}`}} className={`text-xs   outline-none p-2 rounded-md`} value={limit}>
        <option value="10">10</option>
       
        <option value="20">20</option>

          <option value="50">50</option>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="500">500</option>
          <option value="1000">1000</option>

        </select>
      </div>
    </div>
      </div>

      {/* table */}
      {loading1 && (
            <Progress size="xs" isIndeterminate colorScheme="#e91e63" />
          )}
      <div className="overflow-scroll bg-white p-3  pr-5 rounded-[12px] ">
        <div  className="h-[100%]   w-[100%] ">
          <p style={{color:iconColor}} className=" font-medium text-sm  pt-2 text-left">
            {t(`User`)} {t(`Bonus`)} {t(`Details`)}
          </p>
          <table className="w-[100%] ">
            <tr className="text-center p-2   border-b h-[30px] border-gray-600 text-[10px] font-bold ">
              <th className="text-left min-w-[100px]">{t(`Date`)} / {t(`Time`)}</th>
              <th className="text-center min-w-[100px]">{t(`Username`)}</th>

              <th className="min-w-[100px]">{t(`Categoey`)} </th>
              <th>{t(`Sub Categoey`)} </th>


              <th className="min-w-[100px]">{t(`Bonus`)} {t(`Amount`)}</th>
              <th className="text-right min-w-[100px]">{t(`Status`)}</th>
            </tr>
            {transactionData?.map((item) => {
              return (
                <tr
                  key={item._id}

                  className="text-center  h-[60px] m-auto  border-b border-gray-600 text-xs"
                >
                    {/* <p>{item.username}</p> */}
                  <td className="">
                    <div className="flex text-left flex-col ">
                    
                      <p className="text-xs  ">{item.timestamp}</p>
                    </div>
                  </td>
                  <td className="">
                    
                      <p className="text-xs  ">{item.username}</p>
                  </td>
                  <td>{item.category}</td>
                  <td className="">
                    <div className="flex text-center flex-col ">
                      <p>{item.sub_category}</p>
                      {/* <p className="text-xs  text-[#A0AEC0] ">{item.userid}</p> */}
                    </div>
                  </td>
                  <td className="text-green-600 font-semibold">
                    {" "}
                      {item.bonus_amount?.toFixed(2)} INR
                  </td>
                 

                  <td className={`text-right font-semibold ${item.status=="success"?"text-green-500":"text-red-500"}`}>{item.status}</td>
                </tr>
              );
            })}
          </table>
        </div>
      </div>
     
    </div>
  );
};

export default UserBonus;
