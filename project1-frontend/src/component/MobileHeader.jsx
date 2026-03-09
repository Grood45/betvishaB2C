// import React from 'react';
import { RiHome4Line } from "react-icons/ri";
import { MdOutlineSportsSoccer } from "react-icons/md";
import { MdCasino } from "react-icons/md";
import { IoRocketOutline } from "react-icons/io5";
import { TbBrandAppleArcade } from "react-icons/tb";
import { MdOutlineLocalFireDepartment } from "react-icons/md";
import { IoGiftOutline } from "react-icons/io5";
import { LiaCrownSolid } from "react-icons/lia";
import { CgGames } from "react-icons/cg";
import { AiOutlineAim } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import RightSidebar from "../modal/RightSidebar";
import Login from "../page/Login";
import img1 from "../assets/logo.svg";
import sport from '../assets/bingo/1.png'
import casino from '../assets/bingo/2.png'

import {
    Menu,
    MenuButton,
    Box,
    useToast,
} from '@chakra-ui/react'
import axios from "axios";
import HomeCards from "./HomeCards";
import { getProviderGroupName, setSideBarOption } from "../redux/switch-web/action";
import football from '../assets/football.png'
import SportCards from "./sport/SportCards";

function MobileHeader() {
    const {
        bgColor1,
        bgGray,
    } = useSelector((state) => state.theme);

    const { t, i18n } = useTranslation();
    const location = useLocation();
    const isActive = (path) => {
        return location.pathname === path;
    };
    const ProviderCategoryGroup = useSelector((state) => state?.website);

const dispatch=useDispatch()
  const [searchQuery, setSearchQuery] = useState("");
  const providerCategory = ProviderCategoryGroup?.providerGroupName;
  const sidebarActive=ProviderCategoryGroup?.sidebarActionOption
    const IconStyle={
        width:"55px",
        height:'55px',
        padding:'13px',
        borderRadius: "8px",
    }
    const TextStyle={
        fontSize:"14px"
    }
const [loading,setLoading]=useState(false)
    const [gameCategory, setGameCategory] = useState([]);
    const [error, setError] = useState(null);
    const [limit,setLimit]=useState(100)
    // const [isCasinoMode,setIsCasinoMode]=useState(0)
    const toast=useToast()


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
  
    const [active,setActive]=useState(sidebarActive)
const [provider,setProviders]=useState([])

  const fetchProviders = async () => {
    setLoading(true)
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/casinoprovider/get-provider?limit=${limit}&status=true&site_auth_key=${import.meta.env.VITE_API_SITE_AUTH_KEY}`;
      const headers = {
        'Content-Type': 'application/json',
      };

      const response = await axios.get(url, { headers });

      if (response.status !== 200) {
    setLoading(false)

        throw new Error('Network response was not ok');
      }

      
      const providerData = response.data.data;
    //   setProviders(providerData);
      const filteredProviders = providerData.filter(provider => 
        provider.category.some(cat => cat.toLowerCase() === providerCategory.toLowerCase())
      );
  if(active=="66b5088406f8406a6bc7848e"){
    setProviders(providerData);
  }   
  else{
    setProviders(filteredProviders);

  }
    setLoading(false)

    } catch (error) {
      console.error('Error fetching provider data:', error);
    setLoading(false)

    }
  };
   
  
  const getFetchGameByProvider=(item)=>{
    dispatch(getProviderGroupName(item?.name))
    setActive(item?._id)
    dispatch(setSideBarOption(item?._id))
    
    
  }

   
    useEffect(() => {
      getCategoryList();
    }, []);




    useEffect(()=>{
        fetchProviders()
    },[providerCategory,active,sidebarActive])



    const handleSport=()=>{
      setActive("1")
      dispatch(setSideBarOption("1"))
    }


    return (
        <Box>
            <Box padding="0 10px">
                <Box style={{ gap: '20px', 'msOverflowStyle': 'none', 'scrollbarWidth': 'none', height: "50px,", }} 
                className='sub_Header_mobile overflow-auto whitespace-nowrap' 
                display={{base:"flex",xl:"none"}}>
                    <Menu className="flex items-center">
                      
                        <MenuButton
                            className={`text-uppercase flex items-center `}
                            as={NavLink} style={TextStyle}
                            key="3"
                            onClick={()=>handleSport()}


                        >
                            <div style={{backgroundColor:sidebarActive==1?"#ffaa00":bgGray}} className={`flex  w-[55px] h-[55px] p-[13px] rounded-[8px]  items-center justify-center` }>
                            <img src={football} alt="" className="h-[25px] w-[25px]  " />
                            </div>
                            
                           
                            <p className={`text-sm -mt-0 ${sidebarActive===1?"font-semibold":"font-normal"}`}>{t(`sports`)}</p>
                        </MenuButton>
                        {gameCategory?.map((item) => (
                        <MenuButton
                        key={item?._id}
                          className={`text-uppercase flex mt-0 items-center `}
                            as={NavLink} style={TextStyle}
                            onClick={()=>
                            getFetchGameByProvider(item)

                            }
                             // to={item?.link}
                        >
 
                            <div style={{backgroundColor:sidebarActive==item?._id?"#ffaa00":bgGray}} className={`flex  w-[55px] h-[55px] p-[13px] rounded-[8px]  items-center justify-center` }>
                            <img src={item?.icon} alt="" className="h-[25px] w-[25px]  " />
                            </div>
                            
                           
                            <p className={`text-sm -mt-0 ${sidebarActive===item._id?"font-semibold":"font-normal"}`}>{t(item?.name)}</p>
                        </MenuButton>
      ))}

                    </Menu>
                </Box>
            </Box>
            <div className="xl:hidden">
          {sidebarActive!=='1'? <HomeCards provider={provider} loading={loading}/>:
              <SportCards/>}
                    
            </div>
            


        </Box>
    )
}


export default MobileHeader