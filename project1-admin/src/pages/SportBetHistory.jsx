import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import coin from "../assets/rupees.png";
import { useSelector } from "react-redux";
import {
  Progress,
  Radio,
  RadioGroup,
  Stack,
  useToast,
  Badge,
} from "@chakra-ui/react";
import { FaUserCheck } from "react-icons/fa";
import { MdWorkHistory } from "react-icons/md";
import { fetchGetRequest, sendPostRequest } from "../api/api";
import nodatafound from "../assets/emptydata.png";
import { useTranslation } from "react-i18next";
import {formatDate, getGameProvider} from '../../utils/utils'
const SportBetHistory = () => {
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


  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const handleDateChange = (event) => {
    setCurrentDate(new Date(event.target.value));
  };

  const getStartDate = () => {
    const startDate = new Date(currentDate);
    return `${startDate.toISOString().split('T')[0]} 00:00`;
  };

  const getEndDate = () => {
    const endDate = new Date(currentDate);
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
    let url = `${import.meta.env.VITE_API_URL}/api/sport/get-last-one-day-bet-history?`;
    // if (reportType) {
    //   url += `reportType=${reportType}`;
    // }
    // if (betStatus) {
    //   url += `&betStatus=${betStatus}`;
    // }
    
    try {
        const payload={
            startDate: getStartDate(),
            endDate: getEndDate(),
            reportType:reportType,
            betStatus:betStatus
        
        }
      let response = await sendPostRequest(url,payload);
      const data = response.data;
      const receivedData = response.data;
      setSportData(response?.data)
      setLoading(false);
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
  }, [currentPage, limit, , currentDate,reportType,betStatus]);

const data=[
  {
    "eventTypeName": "S/R CRICKET",
    "eventName": "Chennai Super Kings v Sunrisers Hyderabad",
    "eventId": 30440519,
    "site": 44,
    "currencyType": 2,
    "eventType": 4,
    "selectionId": 605000588,
    "categoryType": 4,
    "ip": "10.10.100.55",
    "matchOddsReq": 2,
    "userId": "105vmb120",
    "betId": 115173683,
    "oddsType": 0,
    "updateDate": 1619631598988,
    "agentId": "testwg681ma",
    "betPlaced": "2021-04-28 11:52:12",
    "matchSettledDate": "2021-04-29 01:39:33",
    "marketSettledDate": "2021-04-29 01:39:43",
    "marketName": "Winner (incl. super over)",
    "selectionName": "Sunrisers Hyderabad",
    "matchType": "Back",
    "marketId": "39262204",
    "fancyBetRuns": null,
    "extension1": null,
    "transactionData": [
      {
        "betTaken": "2020-03-06T08:02:55.558+05:30",
        "txStake": 1000,
        "txOddsMatched": 2,
        "actualOdds": 2,
        "txFancyBetRuns": null
      }
    ],
    "matchAvgOdds": 2,
    "betStatus": "Settled",
    "reduction": 0,
    "matchStake": 1000,
    "profitLoss": -1000
  }
]





  return (
    <div>
      <div>
        {/* table */}

        <div>

        </div>

        <div className="flex justify-between flex-col gap-4 sm:flex-row  mt-6  pr-5 sm:items-center">
          <p
            style={{ color: iconColor }}
            className={`font-bold mt-6  w-[100%]    flex items-center gap-2 rounded-[6px]  text-lg`}
          >
            <MdWorkHistory fontSize={"30px"} style={{ color: iconColor }} />
            {t(`Sport`)} {t(`Bet`)} {t(`History`)} <span className={`text-green-600`}></span>
          </p>
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
      <div className="text-sm flex gap-1 items-center">
      <label  htmlFor="reportType">Report Type:</label>
      <select id="reportType" style={{border:`1px solid ${border}`}} className="p-2 font-semibold rounded-md text-xs" value={reportType} onChange={handleReportTypeChange}>
        <option value="0">EXCHANGE (default)</option>
        <option value="2">SPORTSBOOK</option>
        <option value="3">BOOKMAKER</option>
        <option value="7">FANCY BET</option>
      </select>
      </div>
      {/* Bet Status Filter */}
      <div  className="text-sm flex gap-1 items-center">
      <label htmlFor="betStatus">Bet Status:</label>
      <select style={{border:`1px solid ${border}`}} id="betStatus" className="p-2 font-semibold rounded-md text-xs" value={betStatus} onChange={handleBetStatusChange}>
        <option value="-1">ALL</option>
        <option value="2">SETTLED</option>
        <option value="3">CANCELLED</option>
        <option value="4">VOIDED</option>
      </select>
      </div>

    </div>
    <div className="flex  justify-center  gap-4">
      <button onClick={handlePrevDay} style={{border:`1px solid ${border}`,backgroundColor:bg}} className="px-4 text-white  rounded">
        &lt;
      </button>
      
      <div className=" text-center">
        <input
          type="date"
          value={currentDate.toISOString().split('T')[0]}
          onChange={handleDateChange}
          style={{border:`1px solid ${border}`}}
          className=" rounded p-1"
        />
        {/* <p>{`Start Date: ${getStartDate()}`}</p>
        <p>{`End Date: ${getEndDate()}`}</p> */}
      </div>

      <button onClick={handleNextDay} style={{border:`1px solid ${border}`,backgroundColor:bg}} className="px-4 text-white  rounded">
        &gt;
      </button>
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
            <div className="overflow-auto">
              <table className={`w-full`}>
                <thead>
                  <tr
                    style={{ borderBottom: `1px solid ${border}` }}
                    className={`text-center p-2 rounded-md h-[30px] text-[10px] font-bold`}
                  >
                    <th className="text-left min-w-[150px] ">
                      {t(`Username`)} / {t(`User`)} {t(`id`)}
                    </th>
                    <th className="w-[120px] ">{t(`Event`)} {t(`Type`)} </th>

                    <th className="min-w-[120px] ">{t(`MatchType`)}</th>

                    <th className="min-w-[120px] ">{t(`Selection`)} {t(`Name`)}</th>
                    <th className="min-w-[120px] ">{t(`Bet`)} {t(`Time`)}</th>

                    <th className="min-w-[120px] ">{t(`Event`)} {t(`Name`)}</th>
                    <th className="min-w-[120px] ">{t(`Amount`)}</th>
                    <th className="min-w-[120px] ">{t(`Win`)}/{t(`Loss`)}</th>
                    <th className=" min-w-[120px] ">{t(`Result`)}</th>
                    <th className="text-right min-w-[120px] ">{t(`Status`)}</th>
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
                            <div className="flex items-center gap-1">
                              <p>{ item?.eventName||"N/A" }</p>

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
          {data?.length > 0 && (
            <p style={{ color: iconColor }} className="text-xs font-semibold ">
              {t(`Showing`)} 1 {t(`to`)} {limit} {t(`of`)} 12 {t(`Entries`)}
            </p>
          )}
            {!loading && sportData.length == 0 ? (
                <div className="flex justify-center items-center">
                  <img src={nodatafound} className="w-[300px]" />
                </div>
              ) : (
                ""
              )}
          {data && data.length > 0 && (
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
              {t(`Page`)} <span>{currentPage}</span> {t(`of`)}{" "}
              <span>{pagination?.totalPages}</span>
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
