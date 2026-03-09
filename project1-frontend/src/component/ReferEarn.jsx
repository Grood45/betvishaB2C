import React, { useEffect, useState } from 'react';
import img1 from '../assets/newbg.jpeg';
import refer from '../assets/referEarn.png';
import { BsQuestionCircleFill } from 'react-icons/bs';
import { IoCopy } from 'react-icons/io5';
import reward from '../assets/medal.png';
import pending from '../assets/pending.png';
import { IoIosCopy } from 'react-icons/io';
import check from '../assets/check.png'


import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
  TelegramIcon
} from 'react-share';

import { FaUsers } from 'react-icons/fa';
import refer1 from '../assets/earning.png'
import connection from '../assets/connections.png'
import ReferEarnStatusModal from '../modal/ReferEarnStatusModal';
import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { formatDate } from '../api/api';
const ReferEarn = () => {
  const [isActive, setIsActive] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);


  const [referrals, setReferrals] = useState([]);
  const [error, setError] = useState(null);
  const [promotionLoading,setPromotionLoading]=useState("")
const toast=useToast()
  const toggleSwitch = () => {
    setIsActive(!isActive);
  };
  const [promotions,setPromotions]=useState({})
  const userTokenDetails = useSelector((state) => state?.auth);
  const singleUserDetails = useSelector((state) => state?.auth);

  const data=userTokenDetails?.user?.data
const [paginationData,setPaginationData]=useState({})
  // /api/referral/get-all-referral-by-user

  const handleShareClick = () => {
    setShowShareOptions(!showShareOptions);
  };
const {t} =useTranslation()


  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // setCopiedItem(text);
        toast({
          title: ` ${text} has been copied`,
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      })
      .catch((err) => console.error("Failed to copy: ", err));
  };

  const fetchReferrals = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/referral/get-all-referral-by-user`, {
        headers: {
          token:data?.token,
          usernametoken: data?.usernameToken
        },
      });
      setReferrals(response.data.data);
      setPaginationData(response.data.pagination);

    } catch (err) {
      setError(err.message);
    }
  };

  const getPromotionData = async () => {
    setPromotionLoading(true);
    try {
      // Make GET request to the API endpoint using Axios
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/promotion/get-all-promotion-user`, {
        params: {
          site_auth_key: import.meta.env.VITE_API_SITE_AUTH_KEY ,
          status: true,
        },
      });
      // Parse the response data
      const responseData = response?.data?.promotions;

      // Save the retrieved user data
      const referralBonusPromotion = responseData.find(promo => promo.category === "referral_bonus");
      setPromotions(referralBonusPromotion);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
        setPromotionLoading(false);
    }
  };


  useEffect(() => {
  

    fetchReferrals();
    getPromotionData();

  }, []);

  const referralCode = singleUserDetails?.singleUserData?.referral_code;
  const shareUrl = `https://royaldeltin.com?refer_code=${referralCode}`;
  
  return (
    <div className='bg-white  lg:bg-[#F2F2F2] min-h-[700px] w-[100%] lg:w-[40%] m-auto rounded-2xl mx-2 mb-5 mt-[70px] md:mt-[150px]'>
      <div className="flex items-center justify-center pt-5">
        <div
          onClick={toggleSwitch}
          className="relative cursor-pointer w-[250px] h-10 rounded-sm flex items-center overflow-hidden"
        >
            
          <div
            className={`absolute w-1/2 h-full rounded-l-2xl ${
              isActive ? 'bg-white border-2 border-[#ffaa00]' : 'bg-[#ffaa00]'
            } transition-colors duration-300`}
          ></div>
          <div
            className={`absolute w-1/2 h-full right-0 rounded-r-2xl ${
              isActive ? 'bg-[#ffaa00]' : 'bg-white border-2 border-[#ffaa00]'
            }  transition-colors duration-300`}
          ></div>
          <span
            className={`absolute left-5 flex gap-4 items-center  text-xs font-bold ${
              isActive ? 'text-black' : 'text-black'
            } transition-colors duration-300`}
          >
            {t(`Refer`)} <FaUsers fontSize={"22px"} />
          </span>
          <span
            className={`absolute right-5 text-xs font-bold ${
              isActive ? 'text-black' : 'text-black'
            } transition-colors duration-300`}
          >
            {t(`Refer history`)}
          </span>
        </div>
      </div>

{!isActive?<div className='w-[100%]'>


      <div className='w-[90%] m-auto mt-8'>
        <div className='w-[100%]'>
          <img src={promotions?.image} alt="" className='rounded-[8px] w-[100%] h-[150px]' />
        </div>

        <div className='mt-6'>
          <p className='text-[#ffaa00] flex items-center gap-2 font-semibold'>
            <BsQuestionCircleFill fontSize="20px" /> {t(`How It works`)}?
          </p>
        </div>
        <div className='flex flex-col gap-4 mt-5'>
          <div className='flex items-center gap-10'>
            <p className='h-[40px] w-[40px] bg-[#FFFFFF] flex items-center font-bold text-[#ffaa00] justify-center rounded-[50%] shadow-xl'>1</p>
            <div>
              <p className='font-bold sm'>{t(`Invite your Friends`)}</p>
              <p className='text-xs'> {t(`Just Share your link.`)}</p>
            </div>
          </div>
          <div className='flex items-center gap-10'>
            <p className='h-[40px] w-[40px] bg-[#FFFFFF] flex items-center font-bold text-orange-600 justify-center rounded-[50%] shadow-xl'>2</p>
            <div>
              <p className='font-bold sm'>{t(`Sign up and first deposit`)}</p>
              <p className='text-xs'> {t(`Minimum first deposit`)} <span className='text-green-600 font-semibold'> {promotions?.min_deposit}</span>.</p>
            </div>
          </div>
          <div className='flex items-center gap-10'>
            <p className='h-[40px] w-[40px] bg-[#FFFFFF] flex items-center font-bold text-blue-600 justify-center rounded-[50%] shadow-xl'>3</p>
            <div>
              <p className='font-bold sm'>{t(`Complete your turnover`)} </p>
              <p className='text-xs'> {t(`Turnover amount will be`)} <span className='text-green-600 font-semibold'>{promotions?.reward_amount*promotions?.wager_required} INR</span>.</p>
            </div>
          </div>
          <div className='flex items-center gap-10'>
            <p className='h-[40px] w-[40px] bg-[#FFFFFF] flex items-center font-bold text-green-600 justify-center rounded-[50%] shadow-xl'><img src={reward} className='h-[30px] w-[30px]' /></p>
            <div>
              <p className='font-bold sm flex items-center gap-2'>Get your rewards <img src={reward} className='h-[20px] w-[20px]' /> </p>
              <p className='text-xs'> {t(`You`)} {t(`get`)} <span className='font-semibold text-green-600'>{promotions?.reward_amount} INR</span> {t(`cash bonus.`)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-[#ffaa00] mt-5 p-5 w-[100%]'>
        <div className='w-[100%] flex items-center justify-between bg-white outline-none rounded-lg p-2'>
          <p   className='text-sm'>https://royaldeltin.com?refer_code={singleUserDetails?.singleUserData?.referral_code}</p>
          <span><IoIosCopy cursor="pointer" color="#33DF72" onClick={() => 
          copyToClipboard(`https://royaldeltin.com?refer_code=${singleUserDetails?.singleUserData?.referral_code}`)} /></span>
        </div>
        
        <button
          // onClick={handleShareClick}
          className='p-[6px] w-[100%] bg-[100] font-semibold bg-[#33DF72] rounded-lg text-white mt-3'
        >
          Copy the referral Link
        </button>

        <div className='mt-8 flex justify-around'>
          <FacebookShareButton url={shareUrl}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <TwitterShareButton url={shareUrl}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <WhatsappShareButton url={shareUrl}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
          <LinkedinShareButton url={shareUrl}>
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
          <TelegramShareButton url={shareUrl}>
            <TelegramIcon size={32} round />
          </TelegramShareButton>
        </div>
      </div>
      <div className='mt-6 px-5 '>
        <p className='text-[#ffaa00] flex items-center gap-2 font-semibold'>
          <BsQuestionCircleFill fontSize="20px" /> Description 
        </p>
        <div className='p-2 text-sm flex flex-col gap-1'>
         {/* <p>{promotions?.Rules}</p> */}
              <p className="" dangerouslySetInnerHTML={{ __html: promotions.description }}></p> 

        </div>
      </div>
      <div className='mt-6 px-5 '>
        <p className='text-[#ffaa00] flex items-center gap-2 font-semibold'>
          <BsQuestionCircleFill fontSize="20px" /> Eligibility 
        </p>
        <div className='p-2 text-sm flex flex-col gap-1'>
         {/* <p>{promotions?.Rules}</p> */}
              <p className="" dangerouslySetInnerHTML={{ __html: promotions.eligibility }}></p> 

        </div>
      </div>

      <div className='mt-6 px-5 pb-[100px]'>
        <p className='text-[#ffaa00] flex items-center gap-2 font-semibold'>
          <BsQuestionCircleFill fontSize="20px" /> Rules ?
        </p>
        <div className='p-2 text-sm flex flex-col gap-1'>
         {/* <p>{promotions?.Rules}</p> */}
              <p className="" dangerouslySetInnerHTML={{ __html: promotions.rules }}></p> 

        </div>
      </div>
      
      </div>
      :
      <div className='p-4 w-[100%] mt-4 '>
        <p className='font-semibold font-serif text-xl'>Refferal Wallet</p>
        <p className='text-[9px]'>Exlpore all your refferal</p>

        <div className='flex  gap-3'>
        <div className='w-[100%] mt-3 flex items-center  justify-between p-3 border border-yellow-500 rounded-lg shadow-xl '>
        <div>
        <img src={refer1} alt=""  className='h-[30px] w-[30px] md:h-[60px]  md:w-[60px]'/>

        </div>
        <div>
          <p className='  text-xs md:text-sm font-medium'>You Reffered</p>
          <p className=' text-xl md:text-3xl font-bold'>0</p>
          <span className='text-[9px]  md:text-xs font-semibold'>Lorem, ipsum dolor.</span>


        </div>
        <div> </div>

         
        </div>
        <div className='w-[100%] mt-3 flex  justify-between items-center p-3 border border-yellow-500 rounded-lg shadow-xl '>
        <div>
        <img src={connection} alt=""  className='h-[30px] w-[30px] md:h-[60px]  md:w-[60px]'/>

        </div>
        <div>
          <p className='text-xs md:text-sm font-medium'>Your Refferal</p>
          <p className=' text-xl md:text-3xl font-bold'>{paginationData?.totalItems}</p>
          <span className=' text-[9px]  md:text-xs font-semibold'>Lorem, ipsum dolor.</span>


        </div>
        <div> </div>

         
        </div>

        </div>

        <div>
        <p className='font-semibold font-serif text-lg mt-8'>Refferal History</p>
        <div className='flex flex-col gap-4 mt-2'>
          {referrals?.map((item)=>{
            return <div className='flex justify-between p-2 items-center rounded-lg border border-pink-300'>
              <div className='flex item-center gap-5'>
              <p className='h-[50px] text-lg font-bold flex items-center bg-pink-100 justify-center rounded-[8px] w-[50px]'>AB</p>
              <div className='flex flex-col item-center'>
                <p className='font-semibold text-[16px'>{item?.referred_user?.username}</p>
                 <p className='text-xs'>{formatDate(item?.created_at)}</p>
              </div>
              </div>

              <div className='flex flex-col items-center'>
                <p className=''><img  src={item?.bonus_awarded?check:pending} className='w-[30px] h-[30px]'/></p>
                <ReferEarnStatusModal   refferData={item}/>
              </div>
             
              
            </div>
          })}

        </div>

        </div>
       
      </div>
      }
    </div>
  );
}

export default ReferEarn;
