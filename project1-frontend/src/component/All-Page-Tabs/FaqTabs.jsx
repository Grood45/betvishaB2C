// import React from 'react';
import { RiHome4Line } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { PiSpinnerBallBold } from "react-icons/pi";
import { MdOutlineStarBorder } from "react-icons/md";
import { GiPokerHand } from "react-icons/gi";
import { IoFlashOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
// Images
import img1 from "../../assets/images/crash/10008.png";
import img2 from "../../assets/images/crash/10002.png";
import img3 from "../../assets/images/crash/10003.png";
import img4 from "../../assets/images/crash/10004.png";
import img5 from "../../assets/images/crash/10005.png";
import img6 from "../../assets/images/crash/10006.png";
import img7 from "../../assets/images/crash/10007.png";

import { Box, HStack, Center, border } from "@chakra-ui/react";

function FaqTabs() {
  const {
    bgColor1,
    bgGray,
    PrimaryText,
    secondaryText,
    hoverColor,
    ClickActiveColor,
    activeTabsBorder,
  } = useSelector((state) => state.theme);
const [active,setActive]=useState(1)
  const { t, i18n } = useTranslation();
  const TabsStyle = {
    minWidth: "100px",
    height: "100px",
    width: "auto",
    borderRadius: "5px",
    border: "1px solid #fff",
  };
  const location = useLocation();
  const currentPath = location.pathname;

  const navigate = useNavigate();

  const FaqData = [
    {
      id: 1,
      title: "Faq",
      route: "/faq",
      img: img1,
    },
    {
      id: 2,
      title: "Terms & Conditions",
      route: "/terms-and-conditions",
      img: img1,
    },
    {
      id: 3,
      title: "Privacy Policy",
      route: "/PrivacyPolicy",
      img: img2,
    },
    // {
    //   id: 4,
    //   title: "Disconnection Policy",
    //   route: "/Disconnection-Policy",
    //   img: img3,
    // },
    {
      id: 5,
      title: "Responsible Gambling",
      route: "/Responsible-Gambling",
      img: img4,
    },
  ];


  const handleNavigate = (route,id) => {
    setActive(id)

    navigate(route)
  };
  return (
    <>
      <div className="home-tabs-section all-tabs m-2">
        <div
          className="p-3 overflow-scroll"
          overflowX="scroll"
          css={{ "&::-webkit-scrollbar": { display: "none" } }}
        >
          <div className="text-base flex flex-nowrap  gap-5 font-bold">
            {FaqData?.map((item) => {
              return <div
              key={item?.id}
               
                className={`p-3 ${item.route===location?.pathname?"border-2 border-yellow-500":""} min-w-[140px] sm:min-w-[120px] text-center cursor-pointer flex flex-col items-center justify-center rounded-md bg-[#F2F2F2]`}
                onClick={() => handleNavigate(item?.route,item.id)}
              >
                <img
                  src={item?.img}
                  alt="terms-conditions"
                  style={{ width: "50px" }}
                />

                <p className="text-sm text-nowrap">{t(item?.title)}</p>
              </div>;
            })}

           
          </div>
        </div>
      </div>
    </>
  );
}

export default FaqTabs;
