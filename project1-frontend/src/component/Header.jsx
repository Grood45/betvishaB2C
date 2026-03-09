import React, { useEffect, useState } from 'react';
import { RiHome4Line } from 'react-icons/ri';
import { MdOutlineSportsSoccer } from 'react-icons/md';
import { MdCasino } from 'react-icons/md';
import { IoRocketOutline } from 'react-icons/io5';
import { TbBrandAppleArcade } from 'react-icons/tb';
import { IoGiftOutline } from 'react-icons/io5';
import { LiaCrownSolid } from 'react-icons/lia';
import { CgGames } from 'react-icons/cg';
import { AiOutlineAim } from 'react-icons/ai';
import '../assets/css/style.css';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useLocation } from 'react-router-dom';
import RightSidebar from '../modal/RightSidebar';
import Login from '../page/Login';
import img1 from '../assets/logo.svg';
import MobileLeftSideBar from '../modal/MobileLeftSideBar';

import { Menu, MenuButton, Image, Box, useToast } from '@chakra-ui/react';
// import Language from "./Language";
import ChangeLanguage from '../modal/ChangeLanguage';
import axios from 'axios';
import { getProviderGroupName } from '../redux/switch-web/action';
import football from '../assets/football.png'
function Header() {
  const { bgColor1, bgGray } = useSelector((state) => state.theme);
  const settings = useSelector((state) => state?.auth?.settings); 
const dispatch=useDispatch()

  const { t } = useTranslation();
  const isActive = (path) => {
    return location.pathname === path;
  };

  const userData  = useSelector((state) => state?.auth);
  const data=userData?.user?.data
  const location = useLocation();
const [loading,setLoading]=useState(false)

  const [gameCategory, setGameCategory] = useState([]);
  const [error, setError] = useState(null);
  const toast=useToast()
console.log(settings?.site_logo,"settings2")
  
  const getCategoryList = async () => {
    setLoading(true);
        try {
            let response = await axios.get( `${import.meta.env.VITE_API_URL}/api/game-navigation/get-all-game-navigation?site_auth_key=${import.meta.env.VITE_API_SITE_AUTH_KEY}`);

      setGameCategory(response?.data?.data?.reverse())
      setLoading(false);
    } catch (error) {
      console.error("Error getting payment data:", error.message);
      // toast({
      //   title: error.message || 'Somthing went wrong !',
      //   status: "error",
      //   duration: 2000,
      //   isClosable: true,
      //   position: "top",
      // });
      
      setLoading(false);
    }
  };

 

  useEffect(() => {
    getCategoryList();
  }, []);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: '0',
          zIndex: '999',
          backgroundColor: bgColor1,
          width: '100%',
        }}
      >
        <div
          className="flex justify-between items-center lg:mr-3"
        >
          <Box className="" display={{ base: 'block', xl: 'none' }}>
            <MobileLeftSideBar
              maxW={{ base: '100px', xl: '170px' }}
              height={{ base: '22px', xl: '42px' }}
            />
          </Box>
          <Link to="/" className="">
            <Image
            className='ml-3 w-[140px] lg:w-[150px]'
              src={settings?.site_logo}
              alt="Logo"
            />
          </Link>
          <Box
            className="w-full flex justify-end items-center"
            height={{ base: '55px', xl: '85px' }}
            gap={{ base: '0', xl: '5px' }}
          >
            <Login></Login>
            <ChangeLanguage></ChangeLanguage>
            <RightSidebar
              display={{ base: 'none', xl: 'block' }}
            ></RightSidebar>
          </Box>
        </div>
        <div
    className="sub_Header justify-between overflow-auto whitespace-nowrap hidden xl:flex"
    style={{
      backgroundColor: bgGray,
      gap: '8px',
      msOverflowStyle: 'none',
      scrollbarWidth: 'none',
      height: '50px',
    }}
  >
    <div className="flex items-center gap-4 overflow-scroll">
      <NavLink
        className={`text-base font-bold w-[100%] text-uppercase p-3 inline-block ${
          isActive('/') ? 'active-menu' : ''
        }`}
        to="/"
      >
        <RiHome4Line size={28} />
      </NavLink>

      <NavLink
        className={` font-bold text-uppercase  w-[100%] pr-8  text-[15px]  flex gap-1  items-center p-3  ${
          isActive('/Sports') ? 'active-menu' : ''
        }`}
        to="/Sports"
      >
       <img src={football} alt="" className="h-[22px] w-[22px] " />
        {t('sports')}
      </NavLink>

     
      {gameCategory?.map((item) => (
        <NavLink
          key={item?._id}
          className={`text-base font-bold text-uppercase  w-[100%] flex text-[15px] pr-8  gap-1 items-center  p-3 ${
            isActive(item?.link) ? 'active-menu' : ''
          }`}
          to={{
            pathname: item?.link,
            
          }}
          onClick={()=>{
               dispatch(getProviderGroupName(item?.name))
          }}
        >
          <img src={item?.icon} alt="" className="h-[22px] w-[22px] " />
          {t(item?.name)}
        </NavLink>
      ))}

      <NavLink
        className={`text-[15px] flex items-center gap-1 font-bold text-uppercase p-3  ${
          isActive('/Promotion') ? 'active-menu' : ''
        }`}
        to="/Promotion"
      >
        <IoGiftOutline size={26} />
        {t('promotion')}
      </NavLink>

      {/* <NavLink
        className={`text-[15px] font-bold text-uppercase flex items-center p-3 gap-1 ${
          isActive('/VIP') ? 'active-menu' : ''
        }`}
        to="/VIP"
      >
        <LiaCrownSolid size={26} />
        {t('vip')}
      </NavLink> */}
    </div>
  </div>
      </div>
    </>
  );
}

export default Header;
