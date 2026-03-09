import React, { useState, useRef, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


import p1 from '../assets/p2.jpeg'
import p2 from '../assets/p2.jpeg'
import p3 from '../assets/p3.jpeg'
import p4 from '../assets/p4.jpeg'
import { MdDelete } from 'react-icons/md';
import { useSelector } from 'react-redux';
import LoadingSpinner from './loading/LoadingSpinner';
import { sendPatchRequest } from '../api/api';
import { useToast } from '@chakra-ui/react';
import { checkPermission } from '../../utils/utils';

const Carousel = ({data,logoBannerData,setLogoBannerData}) => {
  // const images = [p1, p2, p3, p4];
  const [sliderdata, setSliderData] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const toast=useToast()
const [deleteLoading,setDeleteLoading]=useState(false)
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

  const settings = {
    centerMode: false,
    infinite: true,
    centerPadding: '0%', // Adjust this value to control how much of the adjacent images are visible
    slidesToShow: 1, // Show only one slide at a time on all devices
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 5000,
    dots: false,
    arrows: true,
    afterChange: (index) => setCurrentSlide(index),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
    centerMode: false,

        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const goToSlide = (index) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  };


  const handleDelete = async(index) => {
    const updatedData = data.filter((_, i) => i !== index);
    setDeleteLoading(true)
    let url = `${import.meta.env.VITE_API_URL}/api/setting/update-setting/6532c132ed5efb8183a66703`;
    try {
      let response = await sendPatchRequest(url, {...logoBannerData,carousels:updatedData});
      setLogoBannerData(response.data);
      toast({
        description: `Delete Successfully`,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setDeleteLoading(false);
  
    } catch (error) {
      // toast({
      //   description: `${error?.data?.message}`,
      //   status: "error",
      //   duration: 4000,
      //   position: "top",
      //   isClosable: true,
      // });
      setDeleteLoading(false);
    }

  };


  const user = useSelector((state) => state.authReducer);

const adminData = user.user || {};
const isOwnerAdmin = adminData?.role_type === 'owneradmin';

const permissionDetails=user?.user?.permissions


let hasPermission=checkPermission(permissionDetails,"logoBannerManage")
let check=!isOwnerAdmin?hasPermission:true

  return (
    <div className="custom-carousel w-[100%]   mt-0 ">
      <Slider ref={sliderRef} {...settings}>
        {data?.map((item, index) => {
          return (
            <div key={index} className="w-[100%] md:w-[100%] flex flex-col gap-2">
             {check&& <div className=' flex justify-end pb-2 '>
             {deleteLoading?<LoadingSpinner color="red" size="sm" thickness={"2px"}/>: <MdDelete onClick={()=>handleDelete(index)} className=' cursor-pointer   ' fontSize={"35px"} cursor={"pointer"} color={iconColor} />}

              </div>}
            <div key={index} className="w-[100%] md:w-[100%] relative">
              <img src={item} className="w-[100%] md:w-[100%] h-[200px] lg:h-[300px] rounded-[8px] lg:rounded-[10px]" alt="" />
              </div>
            </div>
          );
        })}
      </Slider>

      <ul className="slick-dots absolute top-4 left-1/2 transform -translate-x-1/2 flex">
        {sliderdata?.map((item, index) => {
          const dotStyle = {
            width: index === currentSlide ? '20px' : '10px',
            height: '10px',
            background: index === currentSlide ? '#FBC032' : '#FBC032',
            borderRadius: index === currentSlide ? '20%' : '50%',
            marginLeft: '0px',
          };

          return (
            <li key={index} style={dotStyle} onClick={() => goToSlide(index)}></li>
          );
        })}
      </ul>
    </div>
  );
};

export default Carousel;
