import React, { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosPersonAdd } from "react-icons/io";

import {  MdSportsEsports } from "react-icons/md";

import { Switch } from "@chakra-ui/react";

import { useSelector } from "react-redux";
import coin from "../assets/rupees.png";
import logo from "../assets/logo.png";
import { useTranslation } from "react-i18next";
const SportManage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [matchodds, setMatchOdds] = useState(false);
  const [otherOdds, setotherOdds] = useState(false);
  const [premium, setPremium] = useState(false);
  const { t, i18n } = useTranslation();

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

  const allBet = [
    {
      id: 1,

      betId: "BET001",
      betPlaced: "2024-02-26 10:30:15",
      market: "Football",
      selection: "Team A to win",
      betType: "Single",
      oddsReq: 2.5,
      stake: 50,
      liability: 125,
      settlement: "win",
      status: true,
    },
    {
      id: 2,
      username: "exampleUser2",
      userId: "67890",
      betId: "BET002",
      betPlaced: "2024-02-26 11:45:20",
      market: "Tennis",
      selection: "Player B to win",
      betType: "Single",
      oddsReq: 1.8,
      stake: 100,
      liability: 80,
      settlement: "lose",
      status: false,
    },
    // Add more objects as needed...
  ];

  const handlePrevPage = () => {};
  const handleNextPage = () => {};

  const handleClickMatch=(id)=>{
    setMatchOdds(!matchodds)
  }

  const handleClickOther=(id)=>{
    setotherOdds(!otherOdds)
  }

  const handleClickPremium=(id)=>{
    setPremium(!premium)
    
  }
  return (
    <div>
      <div className="flex flex-col items-end gap-3 md:flex-row justify-between px-2">
        <div className="flex items-center md:w-[60%] gap-2">
          <div
          style={{border:`1px solid ${border}`}}
          
          className={` bg-white justify-between rounded-[8px] pl-1 flex items-center gap-2 w-[100%]`}>
            <input
              placeholder={`${t(`Search here`)}...`}
              className={`outline-none rounded-[8px] p-[6px]  text-black text-xs md:text-sm  w-[70%]`}
            />
            <span style={{backgroundColor:bg}} className={`p-[6px] border rounded-r-[8px] cursor-pointer `}>
              <IoSearchOutline fontSize={"22px"} color="white" />
            </span>
          </div>
          <select
           style={{border:`1px solid ${border}`}}
          className={` p-[8px]  bg-white w-[100%] rounded-[6px] text-xs md:text-sm font-semibold border outline-none `}>
            <option>
              {" "}
              <IoSearchOutline fontSize={"22px"} color="black" />
              Select Layer
            </option>
            <option>Super admin</option>
            <option>Master Admin</option>
            <option>Owner Admin</option>
            <option>Agent</option>
            <option>Sub Agent</option>
          </select>
          <select 
           style={{border:`1px solid ${border}`}}
          className={` p-[8px]  bg-white w-[100%] rounded-[6px] text-xs md:text-sm font-semibold border outline-none `}>
            <option>
              <IoSearchOutline fontSize={"22px"} color="black" />
              Select Status
            </option>
            <option>Super admin</option>
            <option>Master Admin</option>
            <option>Owner Admin</option>
            <option>Agent</option>
            <option>Sub Agent</option>
          </select>
        </div>
      </div>

      <p style={{color:iconColor}} className={`font-bold mt-6  w-[100%]    flex items-center gap-2 rounded-[6px]  text-lg`}>
        <MdSportsEsports style={{color:iconColor}} fontSize={"30px"}  />
        SportMange
      </p>
      <div className=" contents">
        <div
          className={`h-[100%]  overflow-scroll rounded-[8px] md:rounded-[16px] bg-white p-3  w-[100%]  mt-2 `}
        >
          {loading && (
            <Progress size="xs" isIndeterminate colorScheme="#e91e63" />
          )}
          <p tyle={{color:iconColor}} className={`font-semibold text-sm  pt-2 text-left`}>
            All Bet Details
          </p>
          <table className={` w-[100%] overflow-scroll `}>
            <tr
            style={{borderBottom:`1px solid ${border}`}}
              className={`text-center p-2 rounded-md   h-[30px]  text-xs md:text-[15px] font-bold `}
            >
              <th className="text-left min-w-[50px]">S.N</th>
              <th  className=" min-w-[80px]">Event ID </th>
              <th  className=" min-w-[100px]">Sport Name</th>
              <th  className=" min-w-[40px]">Status</th>

              <th className="text-right">Market</th>
            </tr>
            <tbody className=" ">
              {allBet &&
                allBet.map((item) => {
                  return (
                    <tr
                      key={item?._id}
            style={{borderBottom:`1px solid ${border}`}}

                      className={`text-center font-bold  h-[60px] m-auto   text-xs `}
                    >
                      <td className="text-left">{item.id}</td>

                      <td>{item.betId}</td>

                      <td>{item.market}</td>

                      <td>
                        <Switch size="md" />
                      </td>
                      <td className=" flex justify-end  items-center text-right">
                        <div className="flex flex-row  font-bold justify-center mt-3 items-center gap-2">
                          <button onClick={()=>handleClickMatch(item.id)} className={`flex p-1  md:p-2 text-[9px] md:text-xs font-bold text-white  ${matchodds?"bg-red-600":"bg-[#459D44]"}  rounded-[6px]`}>
                            match_odds
                          </button>
                          <button onClick={()=>handleClickOther(item.id)} className={`flex p-1 md:p-2 text-[9px] md:text-xs font-bold text-white ${otherOdds?"bg-red-600":"bg-[#459D44]"} rounded-[6px]`}>
                            other_odds
                          </button>
                          <button onClick={()=>handleClickPremium(item.id)} className={`flex p-1 md:p-2 text-[9px] md:text-xs font-bold text-white ${premium?"bg-red-600":"bg-[#459D44]"} rounded-[6px]`}>
                            premium
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* card show instead of table    */}

      {/* <div className=" contents md:hidden pb-4 ">
        <p className=" font-bold text-md mt-8">All Bet details</p>
        <div className="flex flex-col gap-4 mt-2">
          {allBet.map((item) => {
            return (
              <div
                key={item._id}
                className=" p-2 flex bg-white flex-col gap-3 rounded-[20px] w-[100%]"
              >
                <div className="flex items-center justify-between  w-[100%] ">
                  <p className=" p-3  text-xs font-bold ">Bet Details</p>
                  <button className=" h-[20px] px-2 p-1 rounded-lg bg-green-600 font-medium text-[10px]">
                    Online
                  </button>
                </div>
                <div className="flex  justify-start gap-4">
                  <img
                    src={logo}
                    alt="logo"
                    className="h-[50px] rounded-[50%] border border-[#A0AEC0]  w-[50px]"
                  />
                  <div className="flex gap-[2px] flex-col ">
                    <p className="">{item.username}</p>
                    <p className="text-xs   ">{item.userId}</p>
                  </div>
                </div>

                <div className="flex flex-col  ">
                  <div className="flex gap-3 w-[100%] p-3 ">
                    <p className=" font-medium text-xs">Market:-</p>
                    <p className=" font-medium text-xs">{item.market}</p>
                  </div>
                  <div className="flex gap-4 w-[100%] p-3">
                    <p className=" font-medium text-xs">Selection:-</p>
                    <p className=" font-medium text-xs">{item.selection}</p>
                  </div>
                  <div className="flex gap-4 w-[100%] p-3 ">
                    <p className=" font-medium text-xs">Bet Placed :-</p>
                    <div className="flex gap-[4px] items-center ">
                      <p className="">{item.betPlaced}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 w-[100%] p-3">
                    <p className=" font-medium text-xs">Liablity:-</p>
                    <div className="flex justify-center items-center gap-2">
                      <img src={coin} alt="" className="h-[15px] w-[15px]" />
                      <p className=" text-xs">{item.stake}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 w-[100%] p-3">
                    <p className=" font-medium text-xs">Odds Req:-</p>
                    <p className=" font-medium text-xs">{item.oddsReq}</p>
                  </div>

                  <div className="flex justify-between w-[100%] p-3">
                    <button
                      className={`p-[6px] rounded-[8px] w-[60px]   ${
                        item.betType == "back" ? "bg-blue-300" : "bg-pink-300"
                      } `}
                    >
                      {item.betType}
                    </button>
                    <button
                      className={`p-[4px] px-5  rounded-[8px]   ${
                        item.settlement === "win"
                          ? "bg-[#01B574]"
                          : item.settlement === "lose"
                          ? "bg-[#E31A1A]"
                          : item.settlement === "pending" ||
                            item.result_type == "pending"
                          ? "bg-[#CEB352]"
                          : item.settlement === "refund"
                          ? "bg-[#BD5DEB]"
                          : item.settlement === "running"
                          ? "bg-[#CEB352]"
                          : ""
                      }`}
                    >
                      {item.settlement}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div> */}

      <div
        className={`text-[16px]   text-sm font-semibold flex m-auto mb-8 mr-5 justify-end gap-3 align-middle items-center mt-2`}
      >
        <button
          type="button"
          
          className={`ml-1 px-2 py-[4px] cursor-pointer  rounded-[5px] text-[20px]`}
          // ref="btPrevious"
          onClick={() => handlePrevPage()}
          disabled={currentPage == 1}
          style={{backgroundColor:bg,border:`1px solid ${border}`,color: "white",fontSize:'12px' }}
        >
          {"<"}
        </button>
        Page <span>1</span> of <span>23</span>
        <button
          onClick={() => handleNextPage()}
          type="button"
          className={`ml-1 px-2 py-[4px] cursor-pointer  rounded-[5px] text-[20px]`}
          style={{backgroundColor:bg,border:`1px solid ${border}`,color: "white",fontSize:'12px' }}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default SportManage;
