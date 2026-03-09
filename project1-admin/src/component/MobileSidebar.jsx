import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { RiMenu2Fill, RiSecurePaymentLine, RiSettings5Fill, RiUserSettingsFill } from 'react-icons/ri';
import { AiFillHome } from 'react-icons/ai';
import { VscGraph } from 'react-icons/vsc';
import { FaUsers, FaUserCheck, FaPiggyBank, FaUser } from 'react-icons/fa';
import { MdHdrAuto, MdOutlineCalendarMonth, MdOutlineSportsCricket, MdReport, MdSportsEsports } from 'react-icons/md';
import { GiCardJackHearts, GiCardKingClubs } from 'react-icons/gi';
import { RiLuggageDepositFill } from 'react-icons/ri';
import { BiMoneyWithdraw } from 'react-icons/bi';
import { PiCubeTransparentFill } from 'react-icons/pi';
import logo from '../assets/logo.png'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IoLogoXbox, IoSettings, IoShareSocial } from 'react-icons/io5';
import { BsBank2, BsFillBagCheckFill, BsFillCalendar2DateFill } from 'react-icons/bs';
import { SiCoinmarketcap, SiGoogletagmanager, SiMapbox } from 'react-icons/si';
import { GoBlocked } from 'react-icons/go';
import { IoMdSwap } from 'react-icons/io';
import { IoIosPersonAdd } from "react-icons/io";
import { TbReport } from 'react-icons/tb';
import { fetchGetRequest } from '../api/api';
import { useTranslation } from 'react-i18next';
function MobileSidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hoveredId, setHoveredId] = useState(null)
  const [active, setActive] = useState(1);
  const [websiteDetails, setWebsiteDetails] = useState({})
  const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};
  const btnRef = React.useRef();
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

  const adminPermission = adminData?.permissions || [];

  const navigate = useNavigate()
  const hasPermission = (name) => {
    const permission = permissionDetails?.find(permission => permission.name === name);
    return permission ? permission.value : false;
  };

  // Filter sidebarData based on permissions
  const permissionDetails = user?.user?.permissions
  const sidebarData = [

    {
      id: 2,
      title: "Manage",
      icon: <VscGraph fontSize={"25px"} />,
      icon1: <VscGraph fontSize={"20px"} color="gray" />,

      subTitle: [
        {
          type: "separator",
          title: "User",
        },
        {
          id: 15,
          title: "User Manage",
          icon1: <FaUsers fontSize={"20px"} />,
          route: "/usermanage",
          name: "userView"
        },
        {
          id: 151,
          title: "New User",
          icon1: <IoIosPersonAdd fontSize={"20px"} />,
          route: "/new-user",
          name: "userView"
        },
        {
          id: 171,
          title: "All User",
          icon1: <FaUsers fontSize={"20px"} />,
          route: "/all-user",
          name: "allUserView",

        },
        {
          type: "separator",
          title: "Login History",
        },
        {
          id: 411,
          title: "User Login History",
          icon1: <FaUsers fontSize={"20px"} />,
          route: "/player-login-history",
          name: "userView",
        },
        {
          id: 410,
          title: "Admin Login History",
          icon1: <FaUsers fontSize={"20px"} />,
          route: "/login-history",
          name: "adminView",
        },
        {
          type: "separator",
          title: "Game Manage",
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
      ]
    },
    {
      id: 104,
      title: "Sports",
      icon: <MdOutlineSportsCricket fontSize={"25px"} />,
      icon1: <MdOutlineSportsCricket fontSize={"20px"} color="gray" />,
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
    // {
    //   id: 7,
    //   title: "Admin Bank",
    //   icon: <RiLuggageDepositFill fontSize={"25px"} />,
    //   icon1: <RiLuggageDepositFill fontSize={"20px"} />,
    //   subTitle: [
    //     {
    //       id: 19,
    //       title: "Upline  Deposit Manage",
    //       icon1: <RiLuggageDepositFill fontSize={"20px"} />,
    //       route: "/admin-upline-deposit",
    //       name:"uplineDepositView"
    //     },
    //     {
    //       id: 190,
    //       title: "Downline Deposit Manage",
    //       icon1: <RiLuggageDepositFill fontSize={"20px"} />,
    //       route: "/admin-downline-deposit",
    //       name:"downlineDepositView"

    //     },
    //     {
    //       id: 20,
    //       title: "Upline Withdraw Manage",
    //       icon1: <BiMoneyWithdraw fontSize={"20px"} />,
    //       route: "/admin-upline-withdrawal",
    //       name:"uplineWithdrawView"

    //     },
    //     {
    //       id: 209,

    //       title: "Downline Withdrawal Manage",
    //       icon1: <BiMoneyWithdraw fontSize={"20px"} />,
    //       route: "/admin-downline-withdrawal",
    //       name:"downlineWithdrawView"

    //     },
    //     {
    //       id: 21,
    //       title: "Admin Transaction",
    //       icon1: <IoMdSwap fontSize={"20px"} />,
    //       route: "/admin-transaction",
    //       name:"adminTransactionView"

    //     },
    //   ].filter(
    //     (item) =>
    //       adminData?.role_type !== "owneradmin" ||
    //       (item.title !== "Upline  Deposit Manage" &&
    //         item.title !== "Upline Withdraw Manage")
    //   ),
    // },
    {
      id: 4,
      title: "Bet Details",
      icon: <BiMoneyWithdraw fontSize={"25px"} />,
      icon1: <BiMoneyWithdraw fontSize={"20px"} />,
      subTitle: [
        {
          id: 23,
          title: "Bet History",
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
          id: 24,
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
          name: "playerReportView"
        },
        {
          id: 28,
          title: "Game Wise Report",
          icon1: <SiCoinmarketcap fontSize={"20px"} />,

          route: "game-wise-report",
          name: "gameReportView"

        },
        {
          id: 29,
          title: "GGR Wise Report",
          icon1: <MdOutlineSportsCricket fontSize={"20px"} />,

          route: "/ggr-wise-report",
          name: "ggrReportView"

        },
        {
          id: 33,
          title: "Generate Amount Report",
          icon1: <TbReport fontSize={"20px"} />,
          route: "/generate-amount-report",
          name: "generateAmountView"

        },
      ]
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
          name: "manualDepositView"
        },
        {
          id: 202,

          title: "Auto Deposit Getway",
          icon1: <MdHdrAuto fontSize={"20px"} />,
          route: "/auto-deposit-getway",
          name: "autoDepositView"

        },
        {
          id: 203,
          title: "Manual Withdrawal Getway",
          icon1: <BsBank2 fontSize={"20px"} />,
          route: "/manual-withdrawal-getway",
          name: "manualWithdrawView"
        },
        {
          id: 204,
          title: "Auto Withdrawal Getway",
          icon1: <BiMoneyWithdraw fontSize={"20px"} />,
          route: "/auto-withdrawal-getway",
          name: "autoWithdrawView"
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
          name: "bonusHistoryView"
        },
        {
          id: 406,

          title: "Bonus Manage",
          icon1: <BsFillBagCheckFill fontSize={"20px"} />,
          route: "/bonus-manage",
          name: "bonusView"

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

          title: "social Media",
          icon1: <IoShareSocial fontSize={"20px"} />,
          route: "/social-setting",
          name: "socialMediaView"

        },
        {
          id: 403,

          title: "Layer Manage",
          icon1: <RiUserSettingsFill fontSize={"20px"} />,
          route: "/layer-manage",
          name: "layerManageView"
        },

        {
          id: 406,

          title: "Logo & Banner",
          icon1: <IoLogoXbox fontSize={"20px"} />,
          route: "/logo-banner",
          name: "logoBannerView"
        },
        {
          id: 407,

          title: "Footer Content",
          icon1: <SiMapbox fontSize={"20px"} />,
          route: "/footer-data",
          name: "footerContentView"

        },
        {
          id: 408,
          title: "Seo Manage",
          icon1: <RiUserSettingsFill fontSize={"20px"} />,
          route: "/seo-manage",
          name: "seoView"

        },
        {
          id: 409,

          title: "Site Manage",
          icon1: <SiGoogletagmanager fontSize={"20px"} />,
          route: "/site-manage",
          name: "siteView"

        },

      ]
    },
  ];

  const filteredSidebarData = sidebarData.filter(item => {
    if (item.subTitle) {
      const filteredSubTitle = item.subTitle.filter(subItem => subItem.type === "separator" || hasPermission(subItem.name));
      return filteredSubTitle.length > 0;
    } else {
      return hasPermission(item.name);
    }
  });
  const isOwnerAdmin = adminData?.role_type === 'owneradmin';

  const finalSidebarData = isOwnerAdmin ? sidebarData : filteredSidebarData




  const handleNavigate = (route) => {
    if (route) {
      navigate(route)
      onClose()
    }

  }

  const getSocailData = async () => {
    let url = `${import.meta.env.VITE_API_URL}/api/setting/get-setting/6532c132ed5efb8183a66703`;
    try {
      let response = await fetchGetRequest(url);
      setWebsiteDetails(response.data);

    } catch (error) {
      // toast({
      //   description: `${error?.data?.message}`,
      //   status: "error",
      //   duration: 4000,
      //   position: "top",
      //   isClosable: true,
      // });
    }
  };

  useEffect(() => {
    getSocailData()
  }, [])
  return (
    <>
      <div ref={btnRef} className="lg:hidden" onClick={onOpen}>
        <RiMenu2Fill
          color={iconColor}
          fontSize={'30px'}
        />
      </div>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader padding="0">
            <div style={{ backgroundColor: iconColor }} className="p-6 text-white pb-10 rounded-b-[2rem]">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-white/20 backdrop-blur-sm rounded-full p-1 border-2 border-white/50">
                  <img src={adminData?.profile_picture || "https://bit.ly/dan-abramov"} alt="Profile" className="w-full h-full rounded-full object-cover" />
                </div>
                <div>
                  <p className="text-lg font-bold tracking-wide">{adminData?.username || "Admin"}</p>
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] uppercase tracking-wider font-semibold">
                    {adminData?.role_type || "Owner"}
                  </span>
                </div>
              </div>
            </div>
          </DrawerHeader>

          <DrawerBody className="bg-gray-50 px-4 pt-4">
            {/* Dashboard Link - Card Style */}
            <div className="mb-4 -mt-6 mx-2">
              <div
                onClick={() => { navigate('/'); onClose(); }}
                className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex items-center justify-between cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <div style={{ backgroundColor: `${iconColor}1a`, color: iconColor }} className="p-2 rounded-lg">
                    <AiFillHome fontSize={"22px"} />
                  </div>
                  <span className="font-bold text-gray-700 text-sm tracking-wide">{t('Dashboard')}</span>
                </div>
                <RiMenu2Fill className="text-gray-300" />
              </div>
            </div>
            {finalSidebarData?.map((item) => (
              <Accordion key={item.id} allowToggle className="mb-3">
                <AccordionItem className='border-none bg-white rounded-xl shadow-sm overflow-hidden mb-2'>
                  <h2>
                    <AccordionButton className="py-3 px-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-1 items-center gap-3 text-left">
                        <div
                          style={{
                            backgroundColor: item.id === active ? `${iconColor}1a` : '#f3f4f6',
                            color: item.id === active ? iconColor : '#6b7280'
                          }}
                          className="p-2 rounded-lg"
                        >
                          {/* Clone element to enforce size if needed, layout handled by parent */}
                          {React.cloneElement(item.icon1, { fontSize: "18px" })}
                        </div>
                        <span className="font-semibold text-sm text-gray-700">{t(item.title)}</span>
                      </div>
                      {item?.subTitle?.length > 0 && <AccordionIcon color="gray.400" />}
                    </AccordionButton>
                  </h2>

                  {item?.subTitle?.length > 0 && (
                    <AccordionPanel pb={3} pt={0} className="bg-gray-50/50">
                      <div className="flex flex-col gap-1 mt-2 pl-3 border-l-2 border-gray-200 ml-4">
                        {item.subTitle.map((subItem) => (
                          subItem.type === "separator" ? (
                            <div
                              key={subItem.title}
                              className="text-gray-500 text-[10px] font-bold mt-3 mb-1 uppercase tracking-wider pl-2"
                            >
                              {t(subItem.title)}
                            </div>
                          ) : (
                            <div
                              key={subItem.id}
                              onClick={() => handleNavigate(subItem.route)}
                              style={{
                                backgroundColor: hoveredId === subItem.id ? 'white' : 'transparent',
                                color: hoveredId === subItem.id ? iconColor : '#6b7280',
                                boxShadow: hoveredId === subItem.id ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none',
                                transform: hoveredId === subItem.id ? 'translateX(4px)' : 'none'
                              }}
                              className={`
                              flex items-center gap-3 p-2 rounded-lg cursor-pointer text-sm font-medium transition-all
                              ${hoveredId === subItem.id ? '' : 'text-gray-500 hover:text-gray-700'}
                            `}
                              onMouseEnter={() => setHoveredId(subItem.id)}
                              onMouseLeave={() => setHoveredId(null)}
                            >
                              <span style={{ opacity: 0.7 }}>●</span>
                              <span>{t(subItem.title)}</span>
                            </div>
                          )
                        ))}
                      </div>
                    </AccordionPanel>
                  )}
                </AccordionItem>
              </Accordion>
            ))}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default MobileSidebar;