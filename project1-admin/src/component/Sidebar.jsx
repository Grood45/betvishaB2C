import React, { useEffect, useState } from "react";
import { AiFillHome, AiFillSetting, AiOutlineMenuUnfold } from "react-icons/ai";
import { VscGraph } from "react-icons/vsc";
import { BiMoneyWithdraw, BiSolidWalletAlt } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { LiaSignInAltSolid } from "react-icons/lia";
import { HiOutlineLogin } from "react-icons/hi";
import { AiFillQuestionCircle } from "react-icons/ai";
import { GrSettingsOption } from "react-icons/gr";
import {
  SiCoinmarketcap,
  SiGoogletagmanager,
  SiPrometheus,
} from "react-icons/si";
import {
  MdOutlineCalendarMonth,
  MdOutlineSportsCricket,
  MdReport,
  MdSportsVolleyball,
} from "react-icons/md";
import { PiCubeTransparentFill, PiShoppingBagFill } from "react-icons/pi";

import { SiMapbox } from "react-icons/si";
import {
  RiExpandLeftFill,
  RiFileUserFill,
  RiLuggageDepositFill,
  RiSettings5Fill,
  RiUserSettingsFill,
  RiVipCrown2Fill,
  RiVipLine,
} from "react-icons/ri";
import {
  FaUser,
  FaUserCheck,
  FaUserShield,
  FaUserTie,
  FaUserTimes,
  FaVimeo,
  FaUserSlash,
} from "react-icons/fa";
import logo from "../assets/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa6";
import { MdSportsEsports } from "react-icons/md";
import { GiCardJackHearts, GiCardKingClubs, GiFamilyTree } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { RiSecurePaymentLine } from "react-icons/ri";
import { FaPiggyBank } from "react-icons/fa";
import { MdHdrAuto } from "react-icons/md";
import { IoLogoXbox, IoSettings, IoShareSocial } from "react-icons/io5";
import { IoIosPersonAdd } from "react-icons/io";
import {
  BsBank2,
  BsFillBagCheckFill,
  BsFillCalendar2DateFill,
} from "react-icons/bs";
import { GoBlocked } from "react-icons/go";
import { IoMdSwap } from "react-icons/io";
import { TbReport } from "react-icons/tb";
import { setSidebarVisibility } from "../redux/action";
import { useTranslation } from "react-i18next";

export const Sidebar = () => {
  const [active, setActive] = useState(1);
  const [active1, setActive1] = useState(1);
  const navigate = useNavigate();
  const { color, bg, hoverColor, hover, text, font, border, iconColor } =
    useSelector((state) => state.theme);
  const sidebarVisible = useSelector((state) => state.theme.sidebarVisible);
  const sidebarVisibleAlways = useSelector(
    (state) => state.theme.sidebarVisibleAlways
  );
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};
  const [hoveredId, setHoveredId] = useState(null);
  const [title, setTitle] = useState("Overview");
  const adminPermission = adminData?.permissions || [];
  const location = useLocation()
  const permissionDetails = user?.user?.permissions;
  const [secondSidebarData, setSecondSidebarData] = useState([
    {
      id: 15,
      title: t("User Manage"),
      icon1: <FaUsers fontSize={"20px"} />,
      route: "/usermanage",
    },
    {
      id: 16,
      title: t("Admin Manage"),
      icon1: <FaUserCheck fontSize={"20px"} />,
      route: "/adminmanage",
    },
    {
      id: 17,
      title: t("Sport Manage"),
      icon1: <MdSportsEsports fontSize={"20px"} />,
      route: "/sportmanage",
    },
    {
      id: 170,
      title: t("Casino Manage"),
      icon1: <GiCardKingClubs fontSize={"20px"} />,
      route: "/casinomanage",
    },
  ]);

  const hasPermission = (name) => {
    const permission = permissionDetails?.find(
      (permission) => permission.name === name
    );
    return permission ? permission.value : false;
  };

  // Filter sidebarData based on permissions
  const sidebarData = [
    {
      id: 2,
      title: t("Manage"),
      icon: <VscGraph fontSize={"25px"} />,
      icon1: <VscGraph fontSize={"20px"} color="gray" />,

      subTitle: [
        {
          type: "separator",
          title: t("User"),
        },
        {
          id: 171,
          title: t("All User"),
          icon1: <FaUsers fontSize={"20px"} />,
          route: "/all-user",
          name: "allUserView",
        },
        {
          id: 15,
          title: t("User Manage"),
          icon1: <FaUsers fontSize={"20px"} />,
          route: "/usermanage",
          name: "userView",
        },
        {
          id: 151,
          title: t("New User"),
          icon1: <IoIosPersonAdd fontSize={"20px"} />,
          route: "/new-user",
          name: "userView",
        },
        {
          id: 152,
          title: t("Manual User"),
          icon1: <FaUserTie fontSize={"20px"} />,
          route: "/manual-user",
          name: "userView",
        },
        {
          id: 153,
          title: t("No Deposit User"),
          icon1: <FaUserTie fontSize={"20px"} />,
          route: "/no-deposit-user",
          name: "userView",
        },
        {
          id: 172,
          title: t("Deleted User Manage"),
          icon1: <FaUserSlash fontSize={"20px"} />,
          route: "/deleted-user-manage",
          name: "userView",
        },
        {
          type: "separator",
          title: t("Login History"),
        },
        {
          id: 411,
          title: t("User Login History"),
          icon1: <RiFileUserFill fontSize={"20px"} />,
          route: "/player-login-history",
          name: "userView",
        },
        {
          id: 410,
          title: t("Admin Login History"),
          icon1: <FaUserTie fontSize={"20px"} />,
          route: "/login-history",
          name: "adminView",
        },
        {
          type: "separator",
          title: t("Game Manage"),
        },
        // {
        //   id: 17,
        //   title: "Sport Manage",
        //   icon1: <MdSportsEsports fontSize={"20px"} />,
        //   route: "/sportmanage",
        // },
        {
          id: 170,
          title: "Casino Manage",
          icon1: <GiCardKingClubs fontSize={"20px"} />,
          route: "/casinomanage",
          name: "providerView",
        },
        {
          type: "separator",
          title: "Others",
        },
        {
          id: 16,
          title: "Admin Manage",
          icon1: <FaUserCheck fontSize={"20px"} />,
          route: "/adminmanage",
          name: "adminView",
        },
        // {
        //   id: 172,
        //   title: "All Admin",
        //   icon1: <FaUsers fontSize={"20px"} />,
        //   route: "/all-admin",
        //   name: "allAdminView",
        // },
      ],
    },
    {
      id: 104,
      title: "Sports",
      icon: <MdOutlineSportsCricket fontSize={"25px"} />,
      icon1: <MdOutlineSportsCricket fontSize={"20px"} />,
      subTitle: [
        {
          id: 1041,
          title: "Sports Provider Manage",
          icon1: <MdSportsEsports fontSize={"20px"} />,
          route: "/sportmanage",
          name: "providerView",
        },
        {
          id: 1042,
          title: "9Wicket",
          icon1: <MdOutlineSportsCricket fontSize={"20px"} />,
          route: "/9wicket",
          name: "providerView",
        },
        {
          id: 1043,
          title: "Power Sport",
          icon1: <MdOutlineSportsCricket fontSize={"20px"} />,
          route: "/powersport",
          name: "providerView",
        },
        {
          id: 1044,
          title: "LuckySport",
          icon1: <MdOutlineSportsCricket fontSize={"20px"} />,
          route: "/luckysport",
          name: "providerView",
        }
      ]
    },
    {
      id: 3,
      title: "User Bank",
      icon: <RiLuggageDepositFill fontSize={"25px"} />,
      icon1: <RiLuggageDepositFill fontSize={"20px"} />,

      subTitle: [
        {
          id: 189,
          title: "User Deposit Manage",
          icon1: <RiLuggageDepositFill fontSize={"20px"} />,
          route: "/user-deposit",
          name: "userDepositView",
        },
        {
          id: 2090,
          title: "User Withdrawal Manage",
          icon1: <BiMoneyWithdraw fontSize={"20px"} />,
          route: "/user-withdrawal",
          name: "userWithdrawView",
        },
        {
          id: 2100,
          title: "User Transaction",
          icon1: <IoMdSwap fontSize={"20px"} />,
          route: "/user-transaction",
          name: "userTransactionView",
        },
      ],
    },
    {
      id: 7,
      title: "Admin Bank",
      icon: <RiLuggageDepositFill fontSize={"25px"} />,
      icon1: <RiLuggageDepositFill fontSize={"20px"} />,
      subTitle: [
        {
          id: 19,
          title: "Upline  Deposit Manage",
          icon1: <RiLuggageDepositFill fontSize={"20px"} />,
          route: "/admin-upline-deposit",
          name: "uplineDepositView",
        },
        {
          id: 190,
          title: "Downline Deposit Manage",
          icon1: <RiLuggageDepositFill fontSize={"20px"} />,
          route: "/admin-downline-deposit",
          name: "downlineDepositView",
        },
        {
          id: 20,
          title: "Upline Withdraw Manage",
          icon1: <BiMoneyWithdraw fontSize={"20px"} />,
          route: "/admin-upline-withdrawal",
          name: "uplineWithdrawView",
        },
        {
          id: 209,

          title: "Downline Withdrawal Manage",
          icon1: <BiMoneyWithdraw fontSize={"20px"} />,
          route: "/admin-downline-withdrawal",
          name: "downlineWithdrawView",
        },
        {
          id: 21,
          title: "Admin Transaction",
          icon1: <IoMdSwap fontSize={"20px"} />,
          route: "/admin-transaction",
          name: "adminTransactionView",
        },
      ].filter(
        (item) =>
          adminData?.role_type !== import.meta.env.VITE_ROLE_SUPER ||
          (item.title !== "Upline  Deposit Manage" &&
            item.title !== "Upline Withdraw Manage")
      ),
    },
    {
      id: 4,
      title: "Bet Details",
      icon: <BiMoneyWithdraw fontSize={"25px"} />,
      icon1: <BiMoneyWithdraw fontSize={"20px"} />,
      subTitle: [
        {
          id: 23,
          title: "Casino Bet History",
          icon1: <BiMoneyWithdraw fontSize={"20px"} />,
          route: "/bet-history",
          name: "betHistoryView",
        },
        {
          id: 203,
          title: "Sport Bet History",
          icon1: <BiMoneyWithdraw fontSize={"20px"} />,
          route: "/sport-bet-history",
          name: "betHistoryView",
        },
        {
          id: 204,
          title: "LuckySport Bet History",
          icon1: <BiMoneyWithdraw fontSize={"20px"} />,
          route: "/luckysport-history",
          name: "betHistoryView",
        },

        {
          id: 25,
          title: "Live Bet",
          icon1: <BiMoneyWithdraw fontSize={"20px"} />,
          route: "/live-report",
          name: "liveBetView",
        },
      ],
    },
    {
      id: 5,
      title: "Report",
      icon: <MdReport fontSize={"25px"} />,
      icon1: <MdReport fontSize={"20px"} color="gray" />,
      subTitle: [
        {
          id: 27,
          title: "Player Wise Report",
          icon1: <FaUser fontSize={"20px"} />,

          route: "player-wise-report",
          name: "playerReportView",
        },
        {
          id: 28,
          title: "Game Wise Report",
          icon1: <SiCoinmarketcap fontSize={"20px"} />,

          route: "game-wise-report",
          name: "gameReportView",
        },
        {
          id: 29,
          title: "GGR Wise Report",
          icon1: <MdOutlineSportsCricket fontSize={"20px"} />,
          route: "/ggr-wise-report",
          name: "ggrReportView",
        },
        {
          id: 33,
          title: "Generate Amount Report",
          icon1: <TbReport fontSize={"20px"} />,
          route: "/generate-amount-report",
          name: "generateAmountView",
        },

      ],
    },

    {
      id: 101,
      title: "Gateway",
      icon: <RiSecurePaymentLine fontSize={"25px"} />,
      icon1: <RiSecurePaymentLine fontSize={"20px"} />,
      subTitle: [
        {
          id: 201,
          title: "Manual Deposit Getway",
          icon1: <FaPiggyBank fontSize={"20px"} />,
          route: "/manual-deposit-getway",
          name: "manualDepositView",
        },
        {
          id: 202,

          title: "Auto Deposit Getway",
          icon1: <MdHdrAuto fontSize={"20px"} />,
          route: "/auto-deposit-getway",
          name: "autoDepositView",
        },
        {
          id: 203,
          title: "Manual Withdrawal Getway",
          icon1: <BsBank2 fontSize={"20px"} />,
          route: "/manual-withdrawal-getway",
          name: "manualWithdrawView",
        },
        {
          id: 204,
          title: "Auto Withdrawal Getway",
          icon1: <BiMoneyWithdraw fontSize={"20px"} />,
          route: "/auto-withdrawal-getway",
          name: "autoWithdrawView",
        },
      ],
    },
    {
      id: 1002,
      title: "Bonus",
      icon: <IoLogoXbox fontSize={"25px"} />,
      icon1: <IoLogoXbox fontSize={"20px"} color="gray" />,
      subTitle: [
        {
          id: 405,

          title: "Bonus History",
          icon1: <BsFillBagCheckFill fontSize={"20px"} />,
          route: "/bonus-history",
          name: "bonusHistoryView",
        },
        {
          id: 406,

          title: "Bonus Manage",
          icon1: <PiShoppingBagFill fontSize={"20px"} />,
          route: "/bonus-manage",
          name: "bonusView",
        },
        {
          id: 4006,

          title: "Refer Earn",
          icon1: <FaUsers fontSize={"20px"} />,
          route: "/refer-earn",
          name: "bonusView",
        },
        {
          id: 4007,

          title: "Vip Level",
          icon1: <RiVipLine fontSize={"20px"} />,
          route: "/vip-level",
          name: "bonusView",
        },
      ],
    },
    {
      id: 1022,
      title: "Affilate Manage",
      icon: <GiFamilyTree fontSize={"25px"} />,
      icon1: <GiFamilyTree fontSize={"20px"} color="gray" />,
      subTitle: [
        {
          id: 405,

          title: "Affilate Admin Manage",
          icon1: <BsFillBagCheckFill fontSize={"20px"} />,
          route: "/affilate-admin-manage",
          name: "bonusHistoryView",
        },
        {
          id: 406,

          title: "Affilate Transaction",
          icon1: <PiShoppingBagFill fontSize={"20px"} />,
          route: "/affilate-transaction",
          name: "bonusView",
        },
        {
          id: 4006,

          title: "Upload",
          icon1: <FaUsers fontSize={"20px"} />,
          route: "/upload-affilate",
          name: "bonusView",
        },

      ],
    },
    {
      id: 103,
      title: "Graph",
      icon: <VscGraph fontSize={"25px"} />,
      icon1: <VscGraph fontSize={"20px"} color="gray" />,
      subTitle: [
        {
          id: 1031,
          title: "User Graph",
          icon1: <VscGraph fontSize={"20px"} />,
          route: "/user-graph",
          name: "userView",
        },
        {
          id: 1032,
          title: "User Join Graph",
          icon1: <VscGraph fontSize={"20px"} />,
          route: "/user-join-graph",
          name: "userView",
        }
      ],
    },
    {
      id: 102,
      title: "Setting",
      icon: <IoSettings fontSize={"25px"} />,
      icon1: <IoSettings fontSize={"20px"} color="gray" />,
      subTitle: [
        {
          id: 402,

          title: "Social Media",
          icon1: <IoShareSocial fontSize={"20px"} />,
          route: "/social-setting",
          name: "socialMediaView",
        },
        // {
        //   id: 403,

        //   title: "Layer Manage",
        //   icon1: <RiUserSettingsFill fontSize={"20px"} />,
        //   route: "/layer-manage",
        //   name: "layerManageView",
        // },

        {
          id: 406,

          title: "Logo & Banner",
          icon1: <IoLogoXbox fontSize={"20px"} />,
          route: "/logo-banner",
          name: "logoBannerView",
        },
        {
          id: 407,

          title: "Footer Content",
          icon1: <SiMapbox fontSize={"20px"} />,
          route: "/footer-data",
          name: "footerContentView",
        },
        {
          id: 408,
          title: "Seo Manage",
          icon1: <RiUserSettingsFill fontSize={"20px"} />,
          route: "/seo-manage",
          name: "seoView",
        },
        {
          id: 412,
          title: "Quick Links",
          icon1: <IoSettings fontSize={"20px"} />,
          route: "/quick-links",
          name: "seoView",
        },
        // {
        //   id: 409,

        //   title: "Site Manage",
        //   icon1: <SiGoogletagmanager fontSize={"20px"} />,
        //   route: "/site-manage",
        //   name: "siteView",
        // },


      ],
    },
  ];

  const filteredSidebarData = sidebarData.map((item) => {
    if (item.subTitle) {
      const filteredSubTitle = item.subTitle.filter((subItem) => {
        return (
          subItem.type === "separator" || hasPermission(subItem.name)
        );
      });

      // Ensure that the item is only included if there are valid subtitle items
      if (filteredSubTitle.length > 0) {
        // Return a new item with the filtered subtitles
        return { ...item, subTitle: filteredSubTitle };
      } else {
        return { ...item, subTitle: [] };;
      }
    } else {
      return { ...item }
    }
  });

  const isOwnerAdmin = adminData?.role_type === import.meta.env.VITE_ROLE_SUPER;
  const finalSidebarData = filteredSidebarData;



  const handleActive = (id, route, subtitle, title) => {
    setActive(id);
    if (id !== 1) {
      dispatch(setSidebarVisibility(true));
    }
    if (id === 1 || id === 1900) {
      setActive1(1);
      dispatch(setSidebarVisibility(false));
    }
    navigate(route);
    setSecondSidebarData(subtitle);
    setTitle(title);
  };

  const handleActive1 = (id, route) => {
    setActive1(id);
    navigate(route);
    if (sidebarVisibleAlways === true) {
      dispatch(setSidebarVisibility(true));
    } else {
      dispatch(setSidebarVisibility(false));
    }
  };

  const handleToggleSidebar = (value) => {
    if (active !== 1) {
      dispatch(setSidebarVisibility(value))(1);
    }
  };
  return (
    <div className="flex min-h-[100vh] ">
      <div
        style={{ backgroundColor: bg, border: border }}
        className={` p-0 
      duration-500 ease-in-out w-[100px] 
           text-white  `}
      >
        <div className=" w-[100%]">
          <div className={`  flex items-center  p-4 justify-center`}>
            {sidebarVisible ? (
              <AiOutlineMenuUnfold
                cursor={"pointer"}
                fontSize={"30px"}
                onClick={() => handleToggleSidebar(false)}
              />
            ) : (
              <AiOutlineMenuUnfold
                cursor={"pointer"}
                onClick={() => handleToggleSidebar(true)}
                fontSize={"30px"}
                className="rotate-180"
              />
            )}
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="90%"
            height="1"
            viewBox="0 0 234 1"
            fill="none"
          >
            <path d="M0 0.5H233.25" stroke="url(#paint0_linear_2_23558)" />
            <defs>
              <linearGradient
                id="paint0_linear_2_23558"
                x1="0"
                y1="0.5"
                x2="231"
                y2="0.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#E0E1E2" stopOpacity="0" />
                <stop offset="0.5" stopColor="#E0E1E2" />
                <stop offset="1" stopColor="#E0E1E2" stopOpacity="0.15625" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className={`overflow-scroll  h-[90vh] pb-[15px]`}>
          <div className={`flex flex-col mt-6 gap-8  p-2`}>
            <div
              style={{
                backgroundColor:
                  location.pathname === "/" ? hoverColor
                    : "",
                // Add other styles as needed
              }}
              onClick={() => navigate("/")}
              className={`flex flex-col cursor-pointer   rounded-lg  duration-500 ease-in-out  items-center gap-1 p-[6px] text-xs `}
            >
              <span className={`rounded-[40%] p-[6px] `}>
                {" "}
                <AiFillHome fontSize={"25px"} />
              </span>
              <p className="font-medium  text-[12px] text-center ">
                {t("Dashboard")}
              </p>
            </div>
            {finalSidebarData?.map((item) => {
              return (
                <div
                  style={{
                    backgroundColor:
                      hoveredId === item.id && location.pathname !== "/"
                        ? hoverColor
                        : item.id == active && location.pathname !== "/"
                          ? hover
                          : "",
                    // Add other styles as needed
                  }}
                  key={item.id}
                  onClick={() =>
                    handleActive(item.id, item.route, item.subTitle, item.title)
                  }
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`flex flex-col cursor-pointer   rounded-lg  duration-500 ease-in-out  items-center gap-1 p-[6px] text-xs `}
                >
                  <span className={`rounded-[40%] p-[6px] `}>{item.icon}</span>
                  <p className="font-medium  text-[12px] text-center ">
                    {t(item.title)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {secondSidebarData && sidebarVisible && (
        <div
          className={`min-h-[100vh] mt-[80px] bg-white  duration-500 ease-in-out w-[250px]    `}
        >
          <div className=" w-[100%]">
            <div className="flex p-2 pt-6 w-[100%]  justify-start items-start">
              <p
                style={{ color: iconColor }}
                className="text-sm   pl-2 font-bold "
              >
                {t(title)}
              </p>
              <div className={` `}>
                {!sidebarVisible && (
                  <RiExpandLeftFill
                    cursor="pointer"
                    onClick={() => dispatch(setSidebarVisibility(false))}
                    fontSize={"25px"}
                  />
                )}
              </div>
            </div>
          </div>
          <div className={`overflow-scroll  h-[80vh] pb-[15px]`}>
            <div
              className={`flex flex-col items-start justify-start gap-3   px-3 mt-2`}
            >
              {secondSidebarData.map((item) => {
                if (item.type === "separator") {
                  return (
                    <div
                      key={item.title}
                      className="text-gray-500 text-[10px] font-bold mt-4 mb-2 px-3 uppercase tracking-wider"
                    >
                      {t(item.title)}
                    </div>
                  );
                }
                return (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor:
                        hoveredId === item.id
                          ? hoverColor
                          : item.id === active1
                            ? hover
                            : "",
                      color:
                        hoveredId === item.id
                          ? "white"
                          : item.id === active1
                            ? "white"
                            : bg,

                      // Add other styles as needed
                    }}
                    onClick={() => handleActive1(item.id, item.route)}
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`flex cursor-pointer hover:border ${item.id === active1 ? ` text-white` : ""
                      }   hover:text-white opacity-[0.8] duration-500 ease-in-out w-[100%] items-center px-3 gap-3 h-[40px] rounded-[8px]  text-xs `}
                  >
                    <span className={`rounded-[40%]   `}>{item.icon1}</span>
                    <p className=" font-semibold text-xs">{t(item.title)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
