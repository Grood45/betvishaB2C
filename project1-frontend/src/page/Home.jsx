import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { IoMenu } from "react-icons/io5";
import Carousel from "../component/Carousel";
import HomeCards from "../component/HomeCards";
import HomeTabs from "../component/HomeTabs";
import MobileHeader from "../component/MobileHeader";
import { getSetting } from "../APIServices/APIServices";
import { getSettingRequest,getSettingFailure, getSettingSuccess } from "../redux/auth-redux/actions";
import Casino from "./Casino";
import CasinoHome from "../component/Home/CasinoHome";

const Home = () => {
  const {
    bgColor1,
  } = useSelector((state) => state.theme);
  const [homeData , setHomeData] = useState('')
  const dispatch = useDispatch();
  const [active,setActive]=useState(0)

  useEffect(() => {
    fetchSettings();
  }, []);

  const singleUserDetails=useSelector((state)=>state?.auth)
  const fetchSettings = async () => {
    dispatch(getSettingRequest());
    try {
      const response = await getSetting();
      if (response.status === 200) {
        setHomeData(response.data)
        dispatch(getSettingSuccess(response.data));
      } else {
        dispatch(getSettingFailure(response.message));
      }
    } catch (error) {
      dispatch(getSettingFailure(error.message));
    }
  };

  const { t, i18n } = useTranslation();

  return (
    <div style={{ backgroundColor: bgColor1 }} className="main_page">

      <div className="flex justify-end ">
      </div>  
      <Carousel></Carousel>
      <HomeTabs active={active} setActive={setActive}></HomeTabs>
      <MobileHeader></MobileHeader>
      <CasinoHome active={active} />
    </div>
  );
};

export default Home;
