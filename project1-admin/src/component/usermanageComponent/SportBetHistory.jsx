import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import coin from "../../assets/rupees.png";
import { useSelector } from "react-redux";
import {
  Progress,
  Radio,
  RadioGroup,
  Stack,
  useToast,
  Badge,
  Tooltip,
} from "@chakra-ui/react";
import { FaUserCheck } from "react-icons/fa";
import { MdWorkHistory } from "react-icons/md";
import { fetchGetRequest, sendPostRequest } from "../../api/api";
import nodatafound from "../../assets/emptydata.png";
import { useTranslation } from "react-i18next";
import {formatDate, getGameProvider} from '../../../utils/utils'
const SportBetHistory = ({userData}) => {
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

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const toast = useToast();
  const [pagination, setPagination] = useState({});
  const totalPages = pagination.totalPages;
  const [limit, setLimit] = useState(20);
  const [betsCount, setBetsCount] = useState({});
  const [betAmount, setBetsAmount] = useState({});
  const [casinoBetData, setCasinoBetData] = useState([]);

const [reportType, setReportType] = useState('0');
const [betStatus, setBetStatus] = useState('-1');

const { t, i18n } = useTranslation();
  
 const [sportData,setSportData]=useState([])

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };


  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleStartDateChange = (event) => {
    setStartDate(new Date(event.target.value));
  };

  const handleEndDateChange = (event) => {
    setEndDate(new Date(event.target.value));
  };

  const getStartDate = () => {
    return `${startDate.toISOString().split('T')[0]} 00:00`;
  };

  const getEndDate = () => {
    return `${endDate.toISOString().split('T')[0]} 23:59`;
  };

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
    console.log(`Selected Report Type: ${event.target.value}`);
  };
  
  const handleBetStatusChange = (event) => {
    setBetStatus(event.target.value);
    console.log(`Selected Bet Status: ${event.target.value}`);
  };

  const getSportBetHistory = async () => {
    setLoading(true);
    let url = `${import.meta.env.VITE_API_URL}/api/sport/get-all-sport-bet-history-user-by-admin?page=${currentPage}`;
  
    
    try {
        const payload={
            startDate: getStartDate(),
            endDate: getEndDate(),
            reportType:reportType,
            betStatus:betStatus,
            username:userData?.username
        
        }
      let response = await sendPostRequest(url,payload);
      const data = response.data;
      const receivedData = response.data;
      setSportData(response?.data)
      setLoading(false);
      setPagination(response?.pagination)
    } catch (error) {
      toast({
        description: `${error?.data?.message||error?.response?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    let id;
    id = setTimeout(() => {
        getSportBetHistory();
    }, 100);

    return () => clearTimeout(id);
  }, [currentPage, limit, , startDate,endDate,reportType,betStatus]);




  return (
    <div>
      <div>
        {/* table */}

      

        <div className="flex justify-between flex-col gap-4 sm:flex-row  mt-6  pr-5 sm:items-center">
         
          <div className="flex items-center gap-2 text-sm">
            {t(`Show`)}
            <select
              onChange={(e) => setLimit(e.target.value)}
              style={{ border: `1px solid ${border}` }}
              className="text-xs outline-none p-1 rounded-md"
              value={limit}
            >
              <option value="20">20</option>

              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="500">500</option>
              <option value="1000">1000</option>
            </select>
            {t(`Entries`)}
          </div>
        </div>
<div className="mt-10 flex items-center px-2 justify-between">
<div className="flex gap-8">
      {/* Report Type Filter */}
      <div className="text-xs flex gap-1 items-center">
      <label  htmlFor="reportType">Report Type:</label>
      <select id="reportType" style={{border:`1px solid ${border}`}} className="p-1 font-semibold rounded-[4px] text-xs" value={reportType} onChange={handleReportTypeChange}>
        <option value="0">EXCHANGE (default)</option>
        <option value="2">SPORTSBOOK</option>
        <option value="3">BOOKMAKER</option>
        <option value="7">FANCY BET</option>
      </select>
      </div>
      {/* Bet Status Filter */}
      <div  className="text-xs flex gap-1 items-center">
      <label htmlFor="betStatus">Bet Status:</label>
      <select style={{border:`1px solid ${border}`}} id="betStatus" className="p-1 font-semibold rounded-[4px] text-xs" value={betStatus} onChange={handleBetStatusChange}>
        <option value="-1">ALL</option>
        <option value="2">SETTLED</option>
        <option value="3">CANCELLED</option>
        <option value="4">VOIDED</option>
      </select>
      </div>

    </div>
    <div className="flex justify-center gap-4">
      <div className="text-center text-xs">
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate.toISOString().split('T')[0]}
          onChange={handleStartDateChange}
          style={{ border: `1px solid ${border}` }}
          className="rounded p-1"
        />
      </div>

      <div className="text-center text-xs">
        <label>End Date:</label>
        <input
          type="date"
          value={endDate.toISOString().split('T')[0]}
          onChange={handleEndDateChange}
          style={{ border: `1px solid ${border}` }}
          className="rounded p-1"
        />
      </div>
    </div>
</div>
       
        <div>
          <div
            className={`h-[100%] rounded-[16px] bg-white p-3  w-[100%]  mt-2 `}
          >
            {loading && (
              <Progress size="xs" isIndeterminate colorScheme="#e91e63" />
            )}
            <p
              style={{ color: iconColor }}
              className={`font-semibold text-sm  pt-2 text-left`}
            >
              {t(`All`)} {t(`Bet`)} {t(`Details`)}
            </p>
            <div className="overflow-scroll">
              <table className={`w-full`}>
                <thead>
                  <tr
                    style={{ borderBottom: `1px solid ${border}` }}
                    className={`text-center p-2 rounded-md h-[30px] text-[10px] font-bold`}
                  >
                    <th className="text-left min-w-[100px] ">
                      {t(`Username`)} / {t(`User`)} {t(`id`)}
                    </th>
                    <th className="w-[100px] ">{t(`Event`)} {t(`Type`)} </th>

                    <th className="min-w-[100px] ">{t(`MatchType`)}</th>

                    <th className="min-w-[100px] ">{t(`Selection`)} {t(`Name`)}</th>
                    <th className="min-w-[100px] ">{t(`Bet`)} {t(`Time`)}</th>

                    <th className="min-w-[100px] ">{t(`Event`)} {t(`Name`)}</th>
                     <th className="min-w-[100px] ">{t(`Amount`)}</th>
                    <th className="min-w-[100px] ">{t(`Win`)}/{t(`Loss`)}</th>
                    <th className=" min-w-[100px] ">{t(`Result`)}</th>
                    <th className="text-right min-w-[100px] ">{t(`Status`)}</th> 
                  </tr>
                </thead>
                <tbody>
                  {sportData &&
                    sportData?.map((item) => {
                      return (
                        <tr
                          key={item?._id}
                          style={{ borderBottom: `1px solid ${border}` }}
                          className={`text-center h-[60px] m-auto text-xs`}
                        >
                          <td className="">
                            <div className="flex text-left flex-col ">
                              <p>{item.Username}</p>
                              <b className="text-[10px] ">
                                ({item?.userId?.slice(0, 16)})<span>..</span>
                              </b>
                            </div>
                          </td>
                          <td className="">
                            <div className="flex items-center text-nowrap justify-center">
                              <button className={`p-[6px] rounded-md w-[60px]`}>
                                {item.eventTypeName}
                              </button>
                            </div>
                          </td>
                          
                          <td className="">
                            <Badge>{item.matchType}</Badge>
                          </td>
                          <td className="">{item.selectionName}</td>

                          

                          <td className="">
                            
                          <div className="flex items-center text-xs flex-col gap-1">
                              <p> {item.betPlaced.split(" ")[0]}</p>
                              <p className="text-[10px]"> ({item.betPlaced.split(" ")[1]})</p>

            
                              
                            </div>
                           </td>
                          <td className="">
                            <div className="flex items-center text-[10px] gap-1">
                            <Tooltip label={item?.eventName} aria-label='A tooltip'>
                            { item?.eventName.slice(0,20)||"N/A" }
</Tooltip>

                            </div>
                            </td>

                          <td className="">
                            <Badge colorScheme="blue">{item.matchStake}</Badge>
                          </td>
                          
                          <td
                            className={`font-bold  ${
                              item.profitLoss>="running"
                                ? "text-orange-400"
                                : item.profitLoss> 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {" "}
                            {item.betStatus !== "void" &&
                              (item.profitLoss> 0 ? "+" : "-")}
                            {item.betStatus == "void"
                              ? "0"
                              : item.profitLoss > 0
                              ? item.profitLoss
                              : item.matchStake?.toFixed(2)}
                          </td>
                          <td className=" ">
                            <Badge
                              colorScheme={
                                item.betStatus == "void"
                                  ? "orange"
                                  : item?.profitLoss> 0
                                  ? "green"
                                  : "red"
                              }
                            >
                              {item.betStatus == "void"
                                ? "refund"
                                : item.profitLoss>0
                                ? "Win"
                                : "lose"} {item?.currency}
                            </Badge>
                          </td>
                          <td className={`font-bold text-right   `}>
                            <Badge> {item.betStatus}</Badge>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          {sportData?.length > 0 && (
            <p style={{ color: iconColor }} className="text-xs font-semibold ">
              {t(`Showing`)} 1 {t(`to`)} {limit} {t(`of`)} 12 {t(`Entries`)}
            </p>
          )}
            {!loading && sportData.length == 0 ? (
                <div className="flex justify-center w-[100%] items-center">
                  <img src={nodatafound} className="w-[300px]" />
                </div>
              ) : (
                ""
              )}
          {sportData && sportData.length > 0 && (
            <div
              className={`text-[16px]   text-sm font-semibold flex  mt-5 mr-5 justify-end gap-3 align-middle items-center`}
            >
              <button
                type="button"
                style={{
                  backgroundColor: bg,
                  border: `1px solid ${border}`,
                  color: "white",
                  fontSize: "12px",
                }}
                className={`ml-1 px-2 py-[4px] cursor-pointer  rounded-[5px] text-[20px]`}
                onClick={() => handlePrevPage()}
                disabled={currentPage == 1}
              >
                {"<"}
              </button>
              {t(`Page`)} <span>{currentPage}</span> {t(`of`)}
              <span>{totalPages}</span>
              <button
                onClick={() => handleNextPage()}
                type="button"
                className={`ml-1 px-2 py-[4px] cursor-pointer rounded-[5px] text-[20px]`}
                style={{
                  backgroundColor: bg,
                  border: `1px solid ${border}`,
                  color: "white",
                  fontSize: "12px",
                }}
                disabled={currentPage == pagination?.totalPages}
              >
                {">"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SportBetHistory;
