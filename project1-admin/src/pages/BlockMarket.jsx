import { Progress, Switch } from "@chakra-ui/react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { GiCardKingClubs } from "react-icons/gi";
import { MdSportsEsports } from "react-icons/md";
import { useSelector } from "react-redux";

const BlockMarket = () => {
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
  const [loading, setLoading] = useState(false);
const { t, i18n } = useTranslation();

  const provider = [
    {
      gpId: 101,
      gpName: "Ae Sexy",
      platform: "SEXYBCRT",
      gameName: "Live",
      status: true,
      _id: "123456789", // Some unique ID for the item
    },
    {
      gpId: 102,
      gpName: "Sicbo",
      platform: "KINGMAKER",

      gameName: "TABLE",
      status: false,
      _id: "987654321", // Some unique ID for the item
    },
    // Add
  ];

  const SportListing = [
    {
      gpId: 1,
      betfairId: "3",
      gpName: "Cricket",
      platform: "SEXYBCRT",
      gameName: "Live",
      status: true,
      _id: "123456789", // Some unique ID for the item
    },
    {
      gpId: 2,
      betfairId: "5",

      gpName: "Tennis",
      platform: "KINGMAKER",

      gameName: "TABLE",
      status: false,
      _id: "987654321", // Some unique ID for the item
    },
    {
      gpId: 3,
      betfairId: "7",

      gpName: "Soccer",
      platform: "KINGMAKER",

      gameName: "TABLE",
      status: false,
      _id: "987654321", // Some unique ID for the item
    },
    // Add
  ];

  const GameListing = [
    {
      id: "1",
      seriesname: "India Premiour League",
      date: "	06/11/2023, 08:20:02",
    },
    {
      id: "2",
      seriesname: "Test Match",
      date: "	08/11/2023, 08:20:02",
    },
    {
      id: "3",
      seriesname: "Ranji Trophy",
      date: "	07/11/2023, 08:20:02",
    },
  ];
  return (
    <div>
      <div>
        <p
        style={{color:iconColor}}
          className={`font-bold mt-6  w-[100%]    flex items-center gap-2 rounded-[6px] text-lg`}
        >
          <MdSportsEsports 
          
        style={{color:iconColor}}
          
          fontSize={"30px"}  />
          Sport Listing
        </p>

        <div className={` bg-white pb-6 rounded-[6px] mt-6  `}>
          <div className="h-[100%] rounded-[16px] px-4  pt-4 w-[100%]  ">
            {loading && (
              <Progress size="xs" isIndeterminate colorScheme="#e91e63" />
            )}
            <div className="flex justify-between items-center">
              <div className=""></div>
              {/* <div className="flex items-center gap-3">

           
            <div
          className={`border  ${border} ${primaryBg} justify-between  rounded-[8px] pl-1 flex items-center gap-2`}
        >
          <select
            className=" outline-none rounded-[6px] p-[6px]  text-black text-xs md:text-sm  md:w-[200px]"
          >
            <option value="all">All Provider</option>
            <option value="active">Active Provider</option>
            <option value="inactive">In Provider</option>

            </select>
         
        </div>
          <div
          className={`border  ${border} ${primaryBg} justify-between  rounded-[8px] pl-1 flex items-center gap-2`}
        >
          <input
            placeholder="Search here..."
            className=" outline-none rounded-[8px] p-[6px]  text-black text-xs md:text-sm  w-[90%]"
          />
          <span
            className={`p-[6px] border rounded-r-[8px] cursor-pointer  ${bg}`}
          >
            <IoSearchOutline fontSize={"22px"} color="white" />
          </span>
        </div>
          </div> */}
            </div>

            <table className="w-[100%] font-bold   mt-5  ">
              <tr
        style={{borderBottom:`1px solid ${border}`}}

                className={`text-center p-2    h-[30px]  text-[14px] font-bold `}
              >
                <th className="text-left">S. No</th>
                <th>Betfair Id</th>
                <th>Name</th>

                <th className="text-right">Status</th>
              </tr>
              <tbody className=" font-medium">
                {SportListing &&
                  SportListing.map((item, dex) => {
                    return (
                      <tr
                        key={item.gpId}
        style={{borderBottom:`1px solid ${border}`}}

                        className={`text-center   h-[60px] m-auto   text-xs `}
                      >
                        <td className="text-left">{item.gpId}</td>
                        <td>{item.betfairId}</td>
                        <td className="">
                          <div className="flex flex-col ">
                            <p>{item.gpName}</p>
                          </div>
                        </td>

                        <td className="text-right">
                          <Switch size="md" />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex  items-center gap-6">
        <p
        style={{color:iconColor}}
          className={`font-bold    flex items-center gap-2 rounded-[6px] ${iconColor} text-lg`}
        >
          <MdSportsEsports 
        style={{color:iconColor}}
          
          fontSize={"30px"}  />
          Game Listing
        </p>
        
          <select
          style={{border:`1px solid ${border}`}}
            className={`outline-none rounded-[6px] p-[6px]  text-black text-xs md:text-sm  md:w-[200px] `}
          >
            <option value="cricket">Cricket</option>
            <option value="tennis">Tennis</option>
            <option value="soccer">Soccer</option>

            </select>
         
        </div>
       

        <div className={` bg-white pb-6 rounded-[6px] mt-6  `}>
          <div className="h-[100%] rounded-[16px] px-4  pt-4 w-[100%]  ">
            {loading && (
              <Progress size="xs" isIndeterminate colorScheme="#e91e63" />
            )}
            <div className="flex justify-between items-center">
              <div className=""></div>
              {/* <div className="flex items-center gap-3">

           
            <div
          className={`border  ${border} ${primaryBg} justify-between  rounded-[8px] pl-1 flex items-center gap-2`}
        >
          <select
            className=" outline-none rounded-[6px] p-[6px]  text-black text-xs md:text-sm  md:w-[200px]"
          >
            <option value="all">All Provider</option>
            <option value="active">Active Provider</option>
            <option value="inactive">In Provider</option>

            </select>
         
        </div>
          <div
          className={`border  ${border} ${primaryBg} justify-between  rounded-[8px] pl-1 flex items-center gap-2`}
        >
          <input
            placeholder="Search here..."
            className=" outline-none rounded-[8px] p-[6px]  text-black text-xs md:text-sm  w-[90%]"
          />
          <span
            className={`p-[6px] border rounded-r-[8px] cursor-pointer  ${bg}`}
          >
            <IoSearchOutline fontSize={"22px"} color="white" />
          </span>
        </div>
          </div> */}
            </div>
<div className="   md:w-[100%] font-bold overflow-scroll    mt-5  ">
<table className="w-[100%]" >
              <tr
              style={{borderBottom:`1px solid ${border}`}}
                className={`text-center p-2   h-[30px]  text-[14px] font-bold `}
              >
                <th className="text-left min-w-[50px]">S .No</th>
                <th className="min-w-[100px]">Series Name</th>
                <th className="min-w-[100px]">Date</th>
                <th className="min-w-[100px]">Match Odds</th>
                <th className="min-w-[100px]">Book Maker</th>
                <th className="min-w-[100px]">Fancy</th>

                <th className="text-right min-w-[100px]">Premium Fancy</th>
              </tr>
              <tbody className="font-medium ">
                {GameListing &&
                  GameListing.map((item, dex) => {
                    return (
                      <tr
                        key={item.gpId}

              style={{borderBottom:`1px solid ${border}`}}

                        className={`text-center   h-[60px] m-auto  text-xs `}
                      >
                        <td className="text-left">{item.id}</td>
                        <td className="">
                          <div className="flex flex-col ">
                            <p>{item.seriesname}</p>
                          </div>
                        </td>
                        <td className="">{item.date}</td>

                        <td className="">
                          <Switch size="md" />
                        </td>

                        <td className="">
                          <Switch size="md" />
                        </td>
                        <td className="">
                          <Switch size="md" />
                        </td>

                        <td className="text-right">
                          <Switch size="md" />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
</div>
           
          </div>
        </div>
      </div>

      <div className="mt-8">
        <p
        style={{color:iconColor}}
          className={`font-bold mt-6  w-[100%]    flex items-center gap-2 rounded-[6px]  text-lg`}
        >
          <GiCardKingClubs 
        style={{color:iconColor}}
          
          fontSize={"30px"}  />
          Casino Listing
        </p>

        <div className={` bg-white pb-6 rounded-[6px] mt-6  `}>
          <div className="h-[100%] rounded-[16px] px-4  pt-4 w-[100%]  ">
            {loading && (
              <Progress size="xs" isIndeterminate colorScheme="#e91e63" />
            )}
            <div className="flex justify-between items-center">
              <div className=""></div>
              {/* <div className="flex items-center gap-3">

           
            <div
          className={`border  ${border} ${primaryBg} justify-between  rounded-[8px] pl-1 flex items-center gap-2`}
        >
          <select
            className=" outline-none rounded-[6px] p-[6px]  text-black text-xs md:text-sm  md:w-[200px]"
          >
            <option value="all">All Provider</option>
            <option value="active">Active Provider</option>
            <option value="inactive">In Provider</option>

            </select>
         
        </div>
          <div
          className={`border  ${border} ${primaryBg} justify-between  rounded-[8px] pl-1 flex items-center gap-2`}
        >
          <input
            placeholder="Search here..."
            className=" outline-none rounded-[8px] p-[6px]  text-black text-xs md:text-sm  w-[90%]"
          />
          <span
            className={`p-[6px] border rounded-r-[8px] cursor-pointer  ${bg}`}
          >
            <IoSearchOutline fontSize={"22px"} color="white" />
          </span>
        </div>
          </div> */}
            </div>

            <div className="   md:w-[100%] font-bold overflow-scroll    mt-5  ">
<table className="w-[100%]" >
              <tr
              style={{borderBottom:`1px solid ${border}`}}

                className={`text-center p-2    h-[30px]  text-[14px] font-bold `}
              >
                <th className="text-left min-w-[40px]">S .No</th>
                <th className="min-w-[100px]">Casino Name</th>
                <th className="min-w-[100px]">Platform</th>
                <th className="min-w-[100px]">Game Type</th>

                <th className="text-right min-w-[50px]">Status</th>
              </tr>
              <tbody className="font-medium ">
                {provider &&
                  provider.map((item, dex) => {
                    return (
                      <tr

              style={{borderBottom:`1px solid ${border}`}}

                        key={item.gpId}
                        className={`text-center   h-[60px] m-auto  text-xs `}
                      >
                        <td className="text-left">{item.gpId}</td>
                        <td className="">
                          <div className="flex flex-col ">
                            <p>{item.gpName}</p>
                          </div>
                        </td>
                        <td>{item.platform}</td>

                        <td>{item.gameName}</td>

                        <td className="text-right">
                          <Switch size="md" />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockMarket;
