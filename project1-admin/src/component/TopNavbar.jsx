import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AiFillSetting } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import NotificationModal from "./NotificationModal";
import logo from "../assets/logo.png";
import { IoSearchOutline } from "react-icons/io5";

import { IoIosArrowBack, IoMdArrowDropleftCircle, IoMdSettings } from "react-icons/io";
import { TiArrowBack, TiMessages } from "react-icons/ti";
import RightSidebar from "./RightSidebar";
import userLogo from "../assets/user-logo.png";
import LiveCount from '../assets/LiveUser.png'
import bankIcon from '../assets/bank.png'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  useToast,
  useDisclosure,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button
} from "@chakra-ui/react";
import { RiMenu2Fill, RiRefreshLine } from "react-icons/ri";
import MobileSidebar from "./MobileSidebar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminChangePassword from "./AdminChangePassword";
import AddAdminBalance from "../Modals/AddAdminBalance";
import LiveUserListModal from "../Modals/LiveUserListModal";
import { removeFromLocalStorage, retrieveUserDetails } from "../redux/middleware/localstorageconfig";
import { useTranslation } from "react-i18next";
import { fetchGetRequest } from "../api/api";
import userlogo from '../assets/user-logo.png'
import { FaCircleArrowLeft } from "react-icons/fa6";
import { checkPermission } from "../../utils/utils";
const TopNavbar = ({ onRefresh }) => {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const { color, primaryBg, secondaryBg, iconColor, bg, hoverColor, hover, text, font, border } = useSelector(state => state.theme);
  const { isOpen: isLiveModalOpen, onOpen: onOpenLiveModal, onClose: onCloseLiveModal } = useDisclosure();
  const naviagte = useNavigate()
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const goBack = () => {
    navigate(-1); // Navigate back one step in history
  };
  const handleChange = (e) => {
    const lang = e.target.value;
    localStorage.setItem("adminDashLanguage", lang);

    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
  };
  const [websiteDetails, setWebsiteDetails] = useState({})
  const [hoveredId, setHoveredId] = useState(false);
  const toast = useToast()
  const [globalLoad, setGlbalLoading] = useState(false)
  const navigate = useNavigate()
  const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};
  const isOwnerAdmin = adminData?.role_type === 'owneradmin';
  const permissionDetails = user?.user?.permissions
  const [userLiveCount, setLiveUserCount] = useState(0)

  let hasPermission = checkPermission(permissionDetails, "generateAmountManage")
  let check = !isOwnerAdmin ? hasPermission : true

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      // Adjust the scroll limit to your desired value
      const scrollLimit = 5;

      // Hide the navbar if the scroll position exceeds the limit
      setIsNavbarVisible(scrollPosition < scrollLimit);
    };

    // Attach the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  const handleLogout = () => {
    navigate("/login")

    removeFromLocalStorage("adminauth")
    toast({
      title: "Logout Successfully",
      status: "success",
      duration: 2000,
      position: "top",
      isClosable: true,
    });
  }
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
  };
  const [adminLoading, setAdminLoading] = useState()
  const [admin, setAdmin] = useState({});
  // const { selectedWebsite, siteDetails } = useSelector(
  //   (state) => state.websiteReducer
  // );
  // let filteredSite = siteDetails?.filter((item) => item.selected === true);
  const getAdmin = async () => {
    setAdminLoading(true);
    try {
      const response = await fetchGetRequest(
        `${import.meta.env.VITE_API_URL}/api/admin/get-single-admin/${adminData.admin_id}`
      );

      setAdminLoading(false);

      setAdmin(response.data);
    } catch (error) {
      // toast({
      //   title: error?.data?.message || error?.message,
      //   status: "error",
      //   duration: 2000,
      //   position: "top",
      //   isClosable: true,
      // });
    }
    setAdminLoading(false);
  };
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

  const onlineLiveUser = async () => {
    let url = `${import.meta.env.VITE_API_URL}/api/admin/get-recent-online-user-count`;
    try {
      let response = await fetchGetRequest(url);
      setLiveUserCount(response?.data)
    } catch (error) {
      console.log(error?.message, "error")
    }
  }

  useEffect(() => {
    getSocailData()
    onlineLiveUser()
  }, [])

  const [rotationCount, setRotationCount] = useState(0);

  const handleIconClick = () => {
    setRotationCount(prevCount => prevCount + 1);

    // Trigger Smart Refresh
    if (onRefresh) {
      onRefresh();
    }

    // Refresh Live User Count
    onlineLiveUser();

    // Refresh Admin Data
    getAdmin();
  };

  const handleAnimationEnd = () => {
    setRotationCount(0);
  };

  return (
    <div
      className={`flex gap-5   ${!isNavbarVisible ? "shadow-md" : ""
        } h-[60px] lg:h-[80px]  px-2 lg:px-5 justify-between w-[100%]items-center`}
    >
      <div className="flex items-center justify-between gap-3 w-30%] sm:w-[100%]  ">
        <div className="lg:hidden"><MobileSidebar /></div>
        <div className="flex md:gap-4 items-center">
          <div onClick={goBack} className=" cursor-pointer">
            <FaCircleArrowLeft style={{ color: iconColor }} fontSize={"20px"} />

          </div>

          <img onClick={() => naviagte("/")} src={websiteDetails?.logo} alt="" className="w-[100px]  cursor-pointer" />
        </div>

        {/* <p style={{color:iconColor}} className={`text-[16px] hidden lg:contents  font-bold `}>Website Name</p> */}

      </div>

      <div className="w-[100%] flex justify-end items-center gap-2 md:gap-4">
        <button
          style={{ backgroundColor: bg }}
          onClick={handleIconClick}
          onAnimationEnd={handleAnimationEnd}
          className="border rounded-md p-1 flex items-center justify-center w-[35px] h-[35px] text-white transition-all duration-300 active:scale-95"
        >
          <RiRefreshLine
            style={{
              transform: `rotate(${rotationCount * 360}deg)`,
              transition: 'transform 0.6s ease-in-out',
            }}
            fontSize={"20px"}
          />
        </button>

        <div className="hidden md:contents">
          <div onClick={onOpenLiveModal} style={{ border: `1px solid ${border}`, backgroundColor: bg, cursor: "pointer" }} className="flex items-center gap-2 px-3 py-1 rounded-full shadow-sm transition hover:opacity-80">
            <div className="relative flex items-center justify-center">
              <span className="absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </div>
            <motion.div
              key={userLiveCount}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex items-center gap-2 font-bold text-green-600"
            >
              <BiUser fontSize={18} />
              <span>{userLiveCount}</span>
            </motion.div>
            <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Live</span>
          </div>
        </div>


        <Menu>
          <MenuButton
            as={Button}
            style={{
              border: `1px solid ${border}`,
              backgroundColor: "white",
              color: "black",
              boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
            }}
            className="sm:ml-5 flex items-center justify-center w-[38px] h-[38px] rounded-full transition-all duration-300 active:scale-95 p-0 overflow-hidden"
            _hover={{ opacity: 0.8 }}
            _active={{ opacity: 1 }}
          >
            <span className="text-xl flex items-center justify-center w-full h-full">
              {[{ code: "en", flag: "🇺🇸" }, { code: "de", flag: "🇩🇪" }, { code: "fr", flag: "🇫🇷" }, { code: "tr", flag: "🇹🇷" }, { code: "pt", flag: "🇵🇹" }, { code: "tn", flag: "🇹🇳" }, { code: "ru", flag: "🇷🇺" }, { code: "hi", flag: "🇮🇳" }, { code: "bn", flag: "🇧🇩" }].find(l => l.code === selectedLanguage)?.flag}
            </span>
          </MenuButton>
          <MenuList className="p-2 shadow-lg rounded-xl border border-gray-100">
            {[
              { code: "en", name: "English", flag: "🇺🇸" },
              { code: "de", name: "German", flag: "🇩🇪" },
              { code: "fr", name: "French", flag: "🇫🇷" },
              { code: "tr", name: "Turkish", flag: "🇹🇷" },
              { code: "pt", name: "Portuguese", flag: "🇵🇹" },
              { code: "tn", name: "Tunisian", flag: "🇹🇳" },
              { code: "ru", name: "Russian", flag: "🇷🇺" },
              { code: "hi", name: "Hindi", flag: "🇮🇳" },
              { code: "bn", name: "Bengali", flag: "🇧🇩" }
            ].map((lang) => (
              <MenuItem
                key={lang.code}
                onClick={() => handleChange({ target: { value: lang.code } })}
                _hover={{ bg: "gray.100" }}
                className={`rounded-lg mb-1 ${selectedLanguage === lang.code ? "bg-gray-50 font-semibold" : ""}`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">{lang.flag}</span>
                  <span className="text-sm">{lang.name}</span>
                </span>
                {selectedLanguage === lang.code && <span className="ml-auto text-green-500">●</span>}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <NotificationModal />
        <RightSidebar globalLoad={globalLoad} setGlbalLoading={setGlbalLoading} />
        {/* <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ... p-[1px]   rounded-[4px] lg:rounded-[6px]"> */}
        {/* <div
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
              border:`1px solid ${border}`,
              backgroundColor:primaryBg
          }}
          className={`lg:p-2 p-1 px-[4px] lg:px-[9px]  cursor-pointer  rounded-[4px] lg:rounded-[6px] `}
        >
          <TiMessages
            cursor="pointer"
            fontSize="20px"
            color={iconColor}
            className={`${text}  duration-500 ease-in-out`}
          />
        </div> */}
        {/* </div> */}


        <Popover>
          <PopoverTrigger>
            <div style={{ border: `1px solid ${border}` }} className={` rounded-[50%]`}>

              <img
                className={` w-[40px] h-[40px] lg:w-[40px] lg:h-[40px] cursor-pointer rounded-full`}
                src={adminData?.profile_picture || userlogo}
                alt=""
              />
            </div>
          </PopoverTrigger>
          <PopoverContent
            style={{
              boxShadow:
                "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
            }}
            className=" "
          >
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>
              <div className="flex items-center p-3 gap-4">
                <img
                  className="w-[40px] h-[40px] cursor-pointer rounded-full"
                  src={adminData?.profile_picture || userLogo}
                  alt=""
                />
                <div>
                  <p style={{ color: iconColor }} className={`font-bold `}>{adminData?.username}</p>
                  <p className="font-medium text-xs ">{adminData?.email}</p>
                </div>
              </div>
            </PopoverHeader>
            <PopoverBody>
              <div className="p-3 flex flex-col ">
                <p onClick={() => naviagte('/my-profile')}
                  onMouseEnter={() => setHoveredId(true)}
                  onMouseLeave={() => setHoveredId(false)}
                  style={{
                    backgroundColor: hoveredId ? hoverColor : "",
                    // Add other styles as needed
                  }}
                  className={`w-[100%] cursor-pointer duration-500  ease-in-out  hover:text-white rounded-lg p-3  text-sm font-semibold`}>
                  {t(`My`)} {t(`Profile`)}
                </p>
                {check && <AddAdminBalance code="1" getAdmin={getAdmin} />}
                <AdminChangePassword code="1" />

              </div>

            </PopoverBody>
            <PopoverFooter>
              <div className="p-3 pl-6 flex flex-col gap-4">

                <p
                  style={{ color: iconColor }}

                  onClick={handleLogout}
                  className={` text-sm cursor-pointer hover:underline duration-500 ease-in-out font-semibold`}>
                  {t(`Sign`)} {t(`Out`)}                </p></div>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      </div>
      {globalLoad && <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }} className="fixed w-[100%] h-[100vh] flex  ">
        <div className="w-[85%] flex  items-center justify-center">
          <svg class="pl" width="240" height="240" viewBox="0 0 240 240">
            <circle class="pl__ring pl__ring--a" cx="120" cy="120" r="105" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 660" stroke-dashoffset="-330" stroke-linecap="round"></circle>
            <circle class="pl__ring pl__ring--b" cx="120" cy="120" r="35" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 220" stroke-dashoffset="-110" stroke-linecap="round"></circle>
            <circle class="pl__ring pl__ring--c" cx="85" cy="120" r="70" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round"></circle>
            <circle class="pl__ring pl__ring--d" cx="155" cy="120" r="70" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round"></circle>
          </svg>
        </div>
      </div>}

      <LiveUserListModal
        isOpen={isLiveModalOpen}
        onClose={onCloseLiveModal}
        country=""
        state=""
      />
    </div>
  );
};

export default TopNavbar;
