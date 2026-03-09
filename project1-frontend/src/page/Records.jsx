import React, { useEffect, useState } from "react";
import {
  Flex,
  Box,
  Divider,
  Text,
  Select,
  Button,
  HStack,
  VStack,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import InfoAndPayment from "./InfoAndPayment";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

import axios from "axios";
import { MdInfo } from "react-icons/md";
import Skeleton from "../component/Skeleton/Skeleton";
import RecordSkeleton from "../component/Skeleton/RecordSkeleton";
import { useTranslation } from "react-i18next";
import formatDateTime from "../utils/utils";
const Records = () => {
  const { bgColor1, bgGray, greenBtn, PrimaryText, whiteText } = useSelector(
    (state) => state.theme
  );
  const userData = useSelector((state) => state?.auth.user.user);
  const { data } = useSelector((state) => state.auth.user);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bonusLoading, setBonusLoading] = useState(false);

  const [transactionData, setTransactionData] = useState([]);
  const [bonusData, setBonusTransaction] = useState([]);
const [transactionType,setTransactionType]=useState("payment")
  const [promotionCategory,setPromotionCategory]=useState('')
  const [depositType, setDepositType] = useState("all");
  const toast = useToast();
  const {t} =useTranslation()
  const [selectedDateRange, setSelectedDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleToggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleSelectDateRange = (ranges) => {
    setSelectedDateRange([ranges.selection]);
  };

  const getAllTransaction = async () => {
    setLoading(true);
    try {
      let response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/transaction/get-all-transaction-by-user?type=${depositType}&site_auth_key=${
          import.meta.env.VITE_API_SITE_AUTH_KEY
        }`,
        {
          headers: {
            token: data?.token,
            usernametoken: data?.usernameToken,
          },
        }
      );
      setTransactionData(response?.data?.data);
      setLoading(false);
    } catch (error) {
      console.error("Error getting payment data:", error);
      //   toast.error(error?.response?.data?.message);

      setLoading(false);
    }
  };
  const getBonusTransaction = async () => {
    setBonusLoading(true);
    try {
      const categoryQuery = promotionCategory ? `&category=${promotionCategory}` : "";
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bonus-history/get-all-bonus-history-for-user?status=all${categoryQuery}&site_auth_key=${import.meta.env.VITE_API_SITE_AUTH_KEY}`,
        {
          headers: {
            token: data?.token,
            usernametoken: data?.usernameToken,
          },
        }
      );
      setBonusTransaction(response?.data?.data);
      setBonusLoading(false);
    } catch (error) {
      console.error("Error getting payment data:", error);
      //   toast.error(error?.response?.data?.message);
  
      setBonusLoading(false);
    }
  };
  

  useEffect(() => {
    getAllTransaction();
    getBonusTransaction()
  }, [depositType,promotionCategory]);

  return (
    <div
      style={{ backgroundColor: bgColor1 }}
      className="  lg:mt-[155px] md:ml-2"
    >
      <Box>
        <Flex>
          <InfoAndPayment />
          <div
            style={{ backgroundColor: bgGray }}
            className="md:ml-4 mb-3 md:mb-0 border rounded-md w-[99%] lg:w-[50%] p-2 md:p-4 "
          >
            <div className="w-[100%] flex flex-col gap-4">
              {/* <p className="text-center mt-2 font-bold md:hidden"> Records</p> */}

              <div className="w-[100%]">
                <div className="w-[100%] flex flex-wrap md:flex-nowrap md:flex-row gap-3 items-center">
                  <Select
                    focusBorderColor="yellow.500"
                    fontSize={{ base: "12px", md: "16px" }}
                    placeholder={t(`Transaction Type`)}
                    style={{ width: "100%", backgroundColor: "white" }}
                    onChange={(e) => setTransactionType(e.target.value)}

                  >
                    <option value="payment">{t(`Payment`)}</option>
                    <option value="promotion">{t(`Promotion`)}</option>
                  </Select>
                 {transactionType=="payment"&& <Select
                    fontSize={{ base: "12px", md: "16px" }}
                    onChange={(e) => setDepositType(e.target.value)}
                    focusBorderColor="yellow.500"
                    placeholder={t(`Record Type`)}
                    style={{ width: "100%", backgroundColor: "white" }}
                  >
                    <option value="deposit">{t(`Debit`)}</option>
                    <option value="withdraw">{t(`Withdraw`)}</option>
                  </Select>}
                  {transactionType=="promotion"&& <Select
                    fontSize={{ base: "12px", md: "16px" }}
                    onChange={(e) => setPromotionCategory(e.target.value)}
                    focusBorderColor="yellow.500"
                    placeholder={t(`Record Type`)}
                    style={{ width: "100%", backgroundColor: "white" }}
                  >
                   <option  value={"user_bonus"}>{t(`User`)} {t(`Bonus`)}</option>
          <option  value={"deposit_bonus"}>{t(`Deposit`)} {t(`Bonus`)}</option>
          <option  value={"bet_bonus"}>{t(`Bet`)} {t(`Bonus`)}</option>
                  </Select>}
                  <Button
                    fontSize={{ base: "12px", md: "16px" }}
                    bg={greenBtn}
                    color={whiteText}
                    style={{ width: "100%" }}
                    onClick={handleToggleCalendar}
                  >
                    {isCalendarOpen ? t(`Close Calendar`) : t(`Open Calendar`)}
                  </Button>
                </div>
                {isCalendarOpen && (
                  <DateRangePicker
                    ranges={selectedDateRange}
                    onChange={handleSelectDateRange}
                  />
                )}
              </div>

             {transactionType=="payment"?
              <div
                className={`w-[100%] flex flex-col overflow-scroll  md:h-[600px] gap-[2px] `}
              >
                
               {loading?
          Array.from({ length: 6}).map((_, index) => (
            <RecordSkeleton key={index} height={'60px'}  />
          ))
        
               : transactionData?.map((item) => {
                  return (
                    <div
                      key={item._id}
                      className="bg-white flex w-[100%] flex-col gap-0 px-4 py-1 rounded-[2px]"
                    >
                      <div className="flex text-sm sm:text-sm justify-between  w-[100%]">
                        <p className={`flex items-start  gap-2`}>
                          {t(`Online`)} {t(`Payment`)}{" "}
                          <span
                            className={`font-bold ${
                              item?.status == "pending"
                                ? "text-orange-400"
                                : item?.status == "reject"
                                ? "text-red-500"
                                : "text-green-500"
                            } uppercase normal-case`}
                          >
                            {item?.status}
                          </span>
                        </p>
                        <p className={`flex ${item?.type === "deposit"?"text-green-600":"text-red-600"} font-bold gap-2 items-center`}>
                          {item.currency}
                          <span className={``}>
                            {item?.type === "deposit"
                              ? parseFloat(item?.deposit_amount || 0).toFixed(2)
                              : parseFloat(item?.withdraw_amount || 0).toFixed(
                                  2
                                )}
                          </span>
                        </p>
                      </div>
                      <div className="flex text-xs sm:text-sm justify-between  w-[100%]">
                        <p className={`flex items-start  gap-2`}>
                          {item?.transaction_id}
                        </p>
                        <p className="flex gap-2 items-center">
                          {item?.initiated_at}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {!loading &&
                (!transactionData || transactionData.length == 0) ? (
                  <div className="flex flex-col items-center mt-8 justify-center">
                    <MdInfo style={{ fontSize: "50px" }} />
                    <p className="text-lg">{t(`Sorry, No Records found!`)}</p>
                  </div>
                ) : (
                  ""
                )}
              </div>:
               <div
               className={`w-[100%] flex flex-col overflow-scroll  md:h-[600px] gap-[2px] `}
             >
               
              {bonusLoading?
         Array.from({ length: 6}).map((_, index) => (
           <RecordSkeleton key={index} height={'60px'}  />
         ))
       
              : bonusData?.map((item) => {
                 return (
                   <div
                     key={item._id}
                     className="bg-white flex w-[100%] flex-col gap-0 px-4 py-1 rounded-[2px]"
                   >
                     <div className="flex text-sm sm:text-sm justify-between  w-[100%]">
                       <p className={`flex items-start  gap-2`}>
                        {item?.category}
                         <span
                           className={`font-bold ${
                             item?.bonus_added_to_user
                               ? "text-green-500"
                              : "text-orange-500"
                           } uppercase normal-case`}
                         >
                           {item?.bonus_added_to_user?"success":"pending"}
                         </span>
                       </p>
                       <p className="flex gap-2 items-center">
                         {item.currency}
                         <span >
                           {item?.bonus_amount} <span>INR</span>
                         </span>
                       </p>
                     </div>
                     <div className="flex text-xs sm:text-sm justify-between  w-[100%]">
                       <p className={`flex items-start  gap-2`}>
                        on {item?.sub_category}
                       </p>
                       <p className="flex gap-2 items-center">
                         {formatDateTime(item?.timestamp)}
                       </p>
                     </div>
                   </div>
                 );
               })}
               {!bonusLoading &&
               (!bonusData || bonusData.length == 0) ? (
                 <div className="flex flex-col items-center mt-8 justify-center">
                   <MdInfo style={{ fontSize: "50px" }} />
                   <p className="text-lg">{t(`Sorry, No Records found!`)}</p>
                 </div>
               ) : (
                 ""
               )}
             </div>}
            </div>
          </div>
        </Flex>
      </Box>
    </div>
  );
};

export default Records;
