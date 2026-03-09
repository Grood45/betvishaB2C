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
const BetRecords = () => {
  const { bgColor1, bgGray, greenBtn, PrimaryText, whiteText } = useSelector(
    (state) => state.theme
  );
  const {t} =useTranslation()
  const userData = useSelector((state) => state?.auth.user.user);
  const { data } = useSelector((state) => state.auth.user);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactionData, setTransactionData] = useState([]);
  const [sportData, setSportData] = useState([]);
const [sportLoading,setSportLoading]=useState(false)
  const [depositType, setDepositType] = useState("all");
  const toast = useToast();
  const [category,setCategoery]=useState()

  const [reportType, setReportType] = useState('0');
  const [betStatus, setBetStatus] = useState('-1');
  
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
        }/api/bet/get-all-bet-user?status=${depositType}&page=1&limit=50&site_auth_key=${
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


  const [currentDate, setCurrentDate] = useState(new Date());
  const formatDate = (date, isStart) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      // Handle invalid date or date not provided
      return 'Invalid date';
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const time = isStart ? '00:00' : '23:59';
    return `${year}-${month}-${day} ${time}`;
  };

  // Use `formatDate` to get the formatted start and end dates
  const formattedStartDate = formatDate(selectedDateRange[0].startDate, true);
  const formattedEndDate = formatDate(selectedDateRange[0].endDate, false);
  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
  };
  
  const handleBetStatusChange = (event) => {
    setBetStatus(event.target.value);
  };

  const getSportsBet = async () => {
    setSportLoading(true);
    let url = `${import.meta.env.VITE_API_URL}/api/sport/get-all-sport-bet-history`;
    try {
        const payload={
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          reportType:reportType,
            betStatus:betStatus
        }
      let response = await axios.post(url,payload, {
        headers: {
          token: data?.token,
          usernametoken: data?.usernameToken,
        },
      });
      const receivedData = response.data;
      setSportData(response?.data?.data)
      setSportLoading(false);
    } catch (error) {
      
      toast({
        description: `${error?.data?.message||error?.response?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      console.log(error);
      setSportLoading(false);
    }
  };

  useEffect(() => {
    getAllTransaction();
  }, [depositType]);


  useEffect(()=>{
    getSportsBet()
  },[selectedDateRange,betStatus,reportType])



  const handleCategory=(e)=>{

    setCategoery(e.target.value)
  }

  return (
    <div
      style={{ backgroundColor: bgColor1 }}
      className=" lg:mt-[155px] md:ml-2"
    >
      <Box>
        <Flex>
          <InfoAndPayment />
          <div
            style={{ backgroundColor: bgGray }}
            className="md:ml-4 mb-3 md:mb-0 border rounded-md w-[99%] lg:w-[50%] p-2 md:p-4 "
          >
            <div className="w-[100%] flex flex-col gap-4">

              <div className="w-[100%]">
                <div className="w-[100%] flex flex-wrap md:flex-nowrap md:flex-row gap-3 items-center">
                  <Select
                    focusBorderColor="yellow.500"
                    fontSize={{ base: "12px", md: "16px" }}
                    placeholder={t(`Transaction Type`)}
                    style={{ width: "100%", backgroundColor: "white" }}
                    onChange={(e)=>handleCategory(e)}
                  >
                    <option value="casino">{t(`Casino`)}</option>
                    <option value="sport">{t(`Sport`)}</option>
                   
                  </Select>
                 { category!=="sport"&& <Select
                    fontSize={{ base: "12px", md: "16px" }}
                    onChange={(e) => setDepositType(e.target.value)}
                    focusBorderColor="yellow.500"
                    placeholder={t(`Bet Type`)}
                    style={{ width: "100%", backgroundColor: "white" }}
                  >
                    <option value="lose">{t(`Lose`)}</option>
                    <option value="win">{t(`Win`)}</option>
                    <option value="pending">{t(`Pending`)}</option>
                    <option value="refund">{t(`RefundBet`)}</option>
                    <option value="all">{t(`AllBet`)}</option>

                  </Select>}
                  { category=="sport"&&  <Button
                    fontSize={{ base: "12px", md: "16px" }}
                    bg={greenBtn}
                    color={whiteText}
                    style={{ width: "100%" }}
                    onClick={handleToggleCalendar}
                  >
                    {isCalendarOpen ? "Close Calendar" : "Open Calendar"}
                  </Button>}
                </div>
                { category=="sport"&&isCalendarOpen && (
                  <DateRangePicker
                    ranges={selectedDateRange}
                    onChange={handleSelectDateRange}
                  />
                )}
              </div>
              { category=="sport"&& <div className="flex w-[100%] gap-4">
      {/* Report Type Filter */}
      <div className="text-sm flex flex-col gap-1 w-[100%] items-start">
      {/* <label  htmlFor="reportType">Report Type:</label> */}
      <select id="reportType"  className="p-[10px] outline-none w-[100%] font-semibold rounded-md text-xs" value={reportType} onChange={handleReportTypeChange}>
        <option value="0">EXCHANGE (default)</option>
        <option value="2">SPORTSBOOK</option>
        <option value="3">BOOKMAKER</option>
        <option value="7">FANCY BET</option>
      </select>
      </div>
      {/* Bet Status Filter */}
      <div  className="text-sm flex flex-col gap-1 w-[100%] items-start">
      {/* <label htmlFor="betStatus">Bet Status:</label> */}
      <select  id="betStatus" className="p-[10px] font-semibold w-[100%] outline-none rounded-md text-xs" value={betStatus} onChange={handleBetStatusChange}>
        <option value="-1">ALL</option>
        <option value="2">SETTLED</option>
        <option value="3">CANCELLED</option>
        <option value="4">VOIDED</option>
      </select>
      </div>

    </div>}
              {category=="sport"?<div
                className={`w-[100%]  flex flex-col overflow-scroll h-[80vh]  md:h-[600px] gap-[2px] `}
              >
                
               {(sportLoading)?
          Array.from({ length: 6}).map((_, index) => (
            <RecordSkeleton key={index} height={'60px'}  />
          )):
        
          // <td
          //                   className={`font-bold  ${
          //                     item.profitLoss>="running"
          //                       ? "text-orange-400"
          //                       : item.profitLoss> 0
          //                       ? "text-green-600"
          //                       : "text-red-600"
          //                   }`}
          //                 >
          //                   {" "}
          //                   {item.betStatus !== "void" &&
          //                     (item.profitLoss> 0 ? "+" : "-")}
          //                   {item.betStatus == "void"
          //                     ? "0"
          //                     : item.profitLoss > 0
          //                     ? item.profitLoss
          //                     : item.matchStake?.toFixed(2)}
          //                 </td>
          //                 <td className=" ">
          //                   <Badge
          //                     colorScheme={
          //                       item.betStatus == "void"
          //                         ? "orange"
          //                         : item?.profitLoss> 0
          //                         ? "green"
          //                         : "red"
          //                     }
          //                   >
          //                     {item.betStatus == "void"
          //                       ? "refund"
          //                       : item.profitLoss>0
          //                       ? "Win"
          //                       : "lose"} {item?.currency}
          //                   </Badge>
          //                 </td>

                sportData?.map((item) => {
                  return (
                    <div
                      key={item._id}
                      className="bg-white flex  w-[100%] flex-col gap-0 px-4  py-1 rounded-[2px]"
                    >
                      <div className="flex flex-col md:flex-row text-sm sm:text-sm justify-between  w-[100%]">
                        <p className={`flex items-start  gap-2`}>
                        {item?.eventName} 
                          <span
                            className={`font-bold ${
                              item.betStatus == "void"
                                                      ? "text-orange-400"
                                                      : item?.profitLoss> 0
                                                      ? "text-green-400"
                                                      : "text-red-400"
                            } `}
                          >
                                                 {item.betStatus == "void"
                                ? "refund"
                                : item.profitLoss>0
                                ? "Win"
                                : "lose"}

                          </span>
                        </p>
                        <p className={`flex text-blue-600 font-bold gap-1  items-center`}>
                        <span className="font-semibold text-xs  text-blue-950">Bet Amount:  </span>   {item?.matchStake} INR
                        </p>
                      </div>
                    
                      <div className="flex flex-col md:flex-row text-xs sm:text-sm justify-between  w-[100%]">
                        
                        <p className={`flex ${item.profitLoss>="running"
                                ? "text-orange-400"
                                : item.profitLoss> 0
                                ? "text-green-600"
                                : "text-red-600"
                            } font-bold  items-center`}>
                        {item.betStatus !== "void" &&
                              (item.profitLoss> 0 ? "+ ₹" : "- ₹")}
                            {item.betStatus == "void"
                              ? "0"
                              : item.profitLoss > 0
                              ? item.profitLoss
                              : item.matchStake?.toFixed(2)}  
                        </p>
                        <p className="flex gap-2 items-center">
                          {item?.betPlaced}
                        </p>
                      </div>
                      <div className="flex flex-col md:flex-row text-xs sm:text-sm justify-between  w-[100%]">
                        
                        <p className={`flex  font-bold  items-center`}>
                        {item?.marketName}
                        </p>
                        <p className="flex gap-2 font-semibold  text-blue-600 items-center">
                         <span className="font-semibold text-xs text-blue-950">Bet Select: </span> {item?.selectionName}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {!sportLoading &&
                (!sportData || sportData.length == 0) ? (
                  <div className="flex flex-col items-center mt-8 justify-center">
                    <MdInfo style={{ fontSize: "50px" }} />
                    <p className="text-lg">Sorry, No Records found!</p>
                  </div>
                ) : (
                  ""
                )}
              </div>:


<div
                className={`w-[100%]  flex flex-col overflow-scroll h-[80vh]  md:h-[600px] gap-[2px] `}
              >
                
               {(loading)?
          Array.from({ length: 6}).map((_, index) => (
            <RecordSkeleton key={index} height={'60px'}  />
          )):
        
                transactionData?.map((item) => {
                  return (
                    <div
                      key={item._id}
                      className="bg-white flex  w-[100%] flex-col gap-0 px-4  py-1 rounded-[2px]"
                    >
                      <div className="flex text-sm sm:text-sm justify-between  w-[100%]">
                        <p className={`flex items-start  gap-2`}>
                        {item?.GameName} 
                          <span
                            className={`font-bold ${
                                item?.WinLoss == "0"
                                ? "text-red-600"
                                :  "text-green-500"
                            } `}
                          >
 {item?.WinLoss=="0"?"Lose":"Win"}
                          </span>
                        </p>
                        <p className={`flex text-blue-600 font-bold  items-center`}>
                        INR {item?.Amount}   <span className="text-xs  font-bold">
                            (bet)
                          
                          </span>
                        </p>
                      </div>
                      <div className="flex text-xs sm:text-sm justify-between  w-[100%]">
                        <p className={`flex ${item?.WinLoss=="0"?"text-red-600":"text-green-600"} items-start  gap-2`}>
                       {item?.WinLoss=="0"?"-":"+"} ₹{item?.WinLoss=="0"?item?.Amount:item?.WinLoss}
                        </p>
                        <p className="flex gap-2 items-center">
                        {formatDateTime(item?.BetTime)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {!loading &&
                (!transactionData || transactionData.length == 0) ? (
                  <div className="flex flex-col items-center mt-8 justify-center">
                    <MdInfo style={{ fontSize: "50px" }} />
                    <p className="text-lg">Sorry, No Records found!</p>
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

export default BetRecords;
