import React, { useEffect, useState } from 'react'
import { FaUser } from 'react-icons/fa';
import { IoSearchOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import coin from '../assets/rupees.png'
import logo from '../assets/logo.png'
import { MdOutlineSportsCricket } from 'react-icons/md';
import { TbReport } from 'react-icons/tb';
import { fetchGetRequest } from '../api/api';
import { Progress, useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../../utils/utils';
import ReactQuill from 'react-quill';
import LoadingSpinner from '../component/loading/LoadingSpinner';
import medal from '../assets/medal.png'
import pending from '../assets/pending.png'


import check from '../assets/check.png'
import { IoMdCloudDownload } from 'react-icons/io';
const ReferAndEarn = () => {
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
      const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [totalGenerateAmount, setTotalGenerateAmount] = useState(0);
  const [lastAfterGenerateAmount, setLastAfterGenerateAmount] = useState(0);
  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };
  const { t, i18n } = useTranslation();

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
    setCurrentPage(1)
  };

  const [search, setSearch] = useState("");

  const [currentPage,setCurrentPage]=useState(1)
const [loading,setLoading]=useState(false)
const [referralData,setReferralData]=useState([])
const toast =useToast()
const [pagination, setPagination] = useState({});
const totalPages = pagination.totalPages;
const [limit,setLimit]=useState(20)
const [bonusCount, setBonusCount] = useState({});
const [bonusAmount, setBonusAmount] = useState({});
const [category,setCategory]=useState('')
const [subCategory,setSubCategory]=useState('')
const [status, setStatus] = useState(0);
const [promotionData, setPromotionData] = useState({});
const [promotionLoading,setPromotionLoading]=useState(false)
const [referalDetails,setReferralDetails]=useState({})
const getBonusHistory = async () => {
  setLoading(true);
  const formattedFromDate = fromDate ? new Date(fromDate).toISOString().split('T')[0] : '';
  const formattedToDate = toDate ? new Date(toDate).toISOString().split('T')[0] : '';


  let url = `${
    import.meta.env.VITE_API_URL
  }/api/referral/get-all-referral-by-admin?`;

  // if (formattedFromDate && formattedToDate) {
  //   url += `&from=${formattedFromDate}&to=${formattedToDate}`;
  // }
if(status){
    url += `status=${status}`;
}
  if (search) {
    url += `&search=${search}`;
  }
 
  try {
    let response = await fetchGetRequest(url);
    const data = response.data;
    const receivedData = response.data;
    setReferralData(receivedData);
    setPagination(response.pagination);
    setBonusCount(response.bonusCount);
    setBonusAmount(response.bonusAmount);
    setReferralDetails(response?.referralData)
    setLoading(false);
  } catch (error) {
    toast({
      description: `${error?.data?.message||error?.response?.data?.message}`,
      status: "error",
      duration: 4000,
      position: "top",
      isClosable: true,
    });
    console.log(error);
    setLoading(false);
  }
};


const getAllPromotion = async () => {
  setPromotionLoading(true);
  let url = `${import.meta.env.VITE_API_URL}/api/promotion/get-all-promotion`;
  try {
    let response = await fetchGetRequest(url);
    const data = response.promotions;
    setPromotionLoading(false);
    
    // Filter the data to find the object with category "referral_bonus"
    const referralBonusPromotion = data.find(promo => promo.category === "referral_bonus");
    
    // Set the promotion data with the found object or an empty object if not found
    setPromotionData(referralBonusPromotion || {});
    
    console.log(referralBonusPromotion, "filtered promotion data");
  } catch (error) {
    setPromotionLoading(false);
    // toast({
    //   description: `${error?.data?.message || error?.message}`,
    //   status: "error",
    //   duration: 4000,
    //   position: "top",
    //   isClosable: true,
    // });
    console.log(error);
  }
};

  
useEffect(()=>{
  let id;
  id = setTimeout(() => {
    getBonusHistory();

  }, 400);

  return () => clearTimeout(id);
  

},[currentPage,limit,category,subCategory,status,search])

useEffect(()=>{
  getAllPromotion()
},[])

const handlePrevPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};

const handleNextPage = () => {
  if (currentPage < totalPages) {
    setCurrentPage(currentPage + 1);
  }
};


const bonusAmounts = {
  Total_Referral_User: "$50",
  Total_Referral_Bonus: "$20",
  Pending_Referral_User: "$30",
  Reject_Referral_User: "$30",


};



const borders = "#CCCCCC"; 
const bonusColors = {
  Bet: '#1d4ed8',
  Deposit: 'green',
  Failed: 'red',
  NewUser: 'purple',
  Success: '#ca8a04',
};
  // const subCategories = [...new Set(bonusHistoryData?.map(item => item.sub_category))];
  // const statuses = [...new Set(bonusHistoryData?.map(item => item.status))];
  return (
    <div>
         <div>

<p style={{color:iconColor}} className={`font-bold   w-[100%] mt-5 ml-2    flex items-center gap-2 rounded-[6px]  text-lg`}>
    <TbReport style={{color:iconColor}} fontSize={"15px"} />
     {t(`Refer`)} {t(`Earn`)}
  </p>
</div>

<div className='flex flex-col lg:flex-row gap-6 p-1 lg:mt-6'>
  <div style={{border:`1px solid ${border}`}} className=' p-3 flex flex-col   bg-white rounded-lg  w-[100%] lg:w-[30%]' >
  <div className='flex  flex-col justify-between w-[100%]  '>
      <p className='font-medium text-sm text-left flex-nowrap'>Bonus Image </p>
     

      {/* <input type='file' style={{border:`1px solid ${border}`}} className='p-2 w-[100%] rounded-md outline-none text-xs '  placeholder='enter ' /> */}

    </div>
    <div>
      <img src={promotionData?.image} className='rounded-md' />
    </div>
    <div className='flex justify-between w-[100%] mt-3 items-center '>
      <p className='font-medium text-lg flex-nowrap'>First Deposit</p>
      <p>:</p>
      <input value={promotionData?.min_deposit} style={{border:`1px solid ${border}`}} className='p-2 w-[60%] rounded-md outline-none text-xs '  placeholder='enter ' />

    </div>
    <div className='flex justify-between w-[100%] mt-3 items-center '>
      <p className='font-medium text-lg flex-nowrap'>Turnover</p>
      <p>:</p>

      <input value={promotionData?.reward_amount*promotionData?.wager_required} style={{border:`1px solid ${border}`}} className='p-2 w-[60%] rounded-md outline-none text-xs '  placeholder='enter ' />

    </div>
    <div className='flex justify-between w-[100%] mt-3 items-center '>
      <p className='font-medium text-lg flex-nowrap'>Rewards</p>
      <p>:</p>

      <input value={promotionData?.reward_amount} style={{border:`1px solid ${border}`}} className='p-2 w-[60%] rounded-md outline-none text-xs '  placeholder='enter ' />

    </div>
    <div className="mt-4">
                {/* Input for Rules */}
                <label className="block text-sm font-bold text-gray-700">
                  {t(`Description`)}
                </label>

                
               <ul className='text-xs' dangerouslySetInnerHTML={{ __html: promotionData?.description }} />
              </div>

              <div className="mt-4">
                {/* Input for Rules */}
                <label className="block text-sm font-bold text-gray-700">
                  {t(`Eligibility`)}
                </label>

                
               <ul className='text-xs' dangerouslySetInnerHTML={{ __html: promotionData?.eligibility }} />
              </div>

    <div className="mt-4">
                {/* Input for Rules */}
                <label className="block text-sm font-bold text-gray-700">
                  {t(`Rules`)}
                </label>

                {/* <ReactQuill
                  theme="snow"
                  value={''}
                  // onChange={(value) =>
                  //   setFormData({ ...formData, rules: value })
                  // }
                /> */}
               <ul className='text-xs' dangerouslySetInnerHTML={{ __html: promotionData?.rules }} />
              </div>
            
            
              {/* <div className="flex gap-4 mt-8 w-[100%]">
                    <button
                      style={{ backgroundColor: bg }}
                      type="submit"
                      className={`  text-white font-semibold p-1 w-[100%] px-4 rounded-[6px]  `}
                      mr={3}
                    >
                      {loading ? (
                        <LoadingSpinner
                          color="white"
                          size="sm"
                          thickness={"2px"}
                        />
                      ) : (
                        `${t(`Submit`)}` 
                      )}
                    </button>
                    </div> */}

  </div>
  <div className=' w-[100%] lg:w-[70%]'>
  <div className=''>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
     
         <div
              className={`flex flex-col bg-white  p-1 pl-3 rounded-md`}
              style={{border:`1px solid ${border}` }}
            >
              <span className="text-blue-950 text-xs md:text-[16px] font-semibold">Total Referral User</span>
              <span className="text-xl font-bold">{referalDetails?.totalReferralUser}</span>
            </div>
            <div
              className={`flex flex-col bg-white  p-1 pl-3 rounded-md`}
              style={{border:`1px solid ${border}` }}
            >
              <span className="text-blue-950 text-xs md:text-[16px] font-semibold">Total Refer Bonus</span>
              <span className="text-xl font-bold">{referalDetails?.totalReferBonus}</span>
            </div>
            <div
              className={`flex flex-col bg-white  p-1 pl-3 rounded-md`}
              style={{border:`1px solid ${border}` }}
            >
              <span className="text-blue-950 text-xs md:text-[16px] font-semibold">Pending Referral User</span>
              <span className="text-xl font-bold">{referalDetails?.pendingReferlUser}</span>
            </div>
            <div
              className={`flex flex-col bg-white  p-1 pl-3 rounded-md`}
              style={{border:`1px solid ${border}` }}
            >
              <span className="text-blue-950 text-xs md:text-[16px] font-semibold">Reject Referral User</span>
              <span className="text-xl font-bold">{referalDetails?.rejectReferlUser}</span>
            </div>
      </div>
      
</div>





<div className='flex mt-12 mr-6 flex-col gap-4 md:flex-row justify-between md:items-center'>

{/* <div className="flex gap-2   items-center">
      <div className='flex items-center gap-2'>
        <p>{t(`From`)}</p>
        <input
          type="date"
          style={{border:`1px solid ${border}`}}

          className={` outline-none  rounded px-3 text-xs py-1`}
          value={fromDate}
          onChange={handleFromDateChange}
        />
      </div>
      <div className='flex items-center ml-2 gap-2'>
        <p>{t(`to`)}</p>
        <input
          type="date"
          style={{border:`1px solid ${border}`}}

          className={` ml-2 outline-none rounded px-3 py-1 text-xs `}
          value={toDate}
          onChange={handleToDateChange}
        />
      </div>
    </div> */}

 
   
        </div>


    
    <div className=" mt-2 ">
      <div className='flex justify-between items-center px-2'>
      <div className="flex justify-start  items-center gap-2 text-sm">
       
        <div style={{border:`1px solid ${border}`,backgroundColor:primaryBg}} className={` justify-between rounded-[8px] pl-1 flex items-center gap-2 w-[200px]`}>
            <input
              placeholder={`${t(`Search here`)}...`}
              className=" outline-none rounded-[8px] p-[4px]  text-black text-xs md:text-sm  w-[70%]"
           onChange={(e)=>{
            setSearch(e.target.value)
          setCurrentPage(1)
          }}
           />
            <span style={{backgroundColor:bg}} className={`p-[4px] border rounded-r-[8px] cursor-pointer`}>
              <IoSearchOutline fontSize={"22px"} color="white" />
            </span>
          </div>
          <span
                style={{ backgroundColor: bg }}
                className="px-1 py-[2px] rounded-md cursor-pointer"
              >
                <IoMdCloudDownload
                  // onClick={handleDownloadReport}
                  fontSize={"25px"}
                  color="white"
                />
              </span>
              
        </div>
        <div className='flex items-center gap-4'>
       
      <div className='flex items-center gap-1'>
      {t(`Show`)} 
        <select onChange={(e)=>setLimit(e.target.value)} style={{border:`1px solid ${border}`}} className={`text-xs   outline-none p-2 rounded-md`} value={limit}>
        <option value="20">20</option>

          <option value="50">50</option>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="500">500</option>
          <option value="1000">1000</option>

        </select>
      </div>
      <select onChange={(e)=>{
        setStatus(e.target.value)
        }} style={{border:`1px solid ${border}`}} className=" rounded-[6px] outline-none text-xs md:text-sm px-2 md:px-4 py-[6px] ">
        <option value={0}>Status</option>
          <option  value={1}>{t(`Bonus Credited`)}</option>
          <option  value={2}>{t(`Bonus Not Credited`)}</option>
      </select>

        </div>
      

        </div>

   


      


        <div
         
          className={`h-[100%] overflow-scroll rounded-[8px] md:rounded-[12px] bg-white p-3   w-[100%]  mt-2 `}
        >
          {loading && (
            <Progress size="xs" isIndeterminate colorScheme="#e91e63" />
          )}
         


         <div className="overflow-x-auto">
      <table className="w-full  whitespace-no-wrap border border-red-600">
        <thead>
          <tr className='text-[14px] whitespace-nowrap'>
            <th className="border px-4 py-2">{t(`Username`)}</th>
            <th className="border px-4 py-2">{t(`Timestamp`)}</th>
            <th className="border px-4 py-2">{t(`Refer By`)}</th>
            <th className="border px-4 py-2">{t(`Sign Up`)}</th>
            <th className="border px-4 py-2">{t(`First`)} {t(`Deposit`)}</th>
            <th className="border px-4 py-2">{t(`Bonus Added`)}</th>

           
            <th className="border px-4 py-2">{t(`Status`)}</th>
            <th className="border px-4 py-2">{t(`Referral Code`)}</th>
            <th className="border px-4 py-2">{t(`Bonus Amount`)}</th>

          </tr>
        </thead>
        <tbody>
          {referralData.length>0&&referralData?.map((item, index) => (
            <tr key={index} className="bg-gray-100 text-sm">
              <td className="border px-4 py-2">{item.referred_user.username}</td>
              <td className="border px-4 py-2">
                <div>
                  <p> {formatDate(item.updated_at.split(" ")[0])}</p>
                </div>
               </td>
              <td className="border px-4 py-2">{item.refer_by}</td>
              <td className="border px-4 py-2"><div className='flex items-center justify-center'>
                {item?.steps_completed?.is_registered?<img className='w-[20px] ' src={check} alt=""/>:<img className='w-[20px] ' src={pending} alt=""/>}
                </div></td>
              <td className="border text-green-700 text-center font-bold px-4 py-2">
              <div className='flex items-center justify-center'>
              {item?.is_deposited?.is_registered?<img className='w-[20px] ' src={check} alt=""/>:<img className='w-[20px] ' src={pending} alt=""/>}

                </div>

              </td>
              <td className="border text-green-700 text-center font-bold px-4 py-2">
              <div className='flex items-center justify-center'>
              {item?.bonus_awarded?<img className='w-[20px] ' src={check} alt=""/>:<img className='w-[20px] ' src={pending} alt=""/>}

                </div>

              </td>

             
              <td className={`border font-bold text-center px-4 py-2 ${item.bonus_awarded?"text-green-600":"text-red-600"}`}>
                
              {item?.bonus_awarded?<p>Completed</p>:<p>Pending</p>}
                
                </td>
              <td className="border px-4 py-2 font-bold text-blue-500 text-center">
                
                <div className='flex items-center justify-center gap-2'>
                {/* <img className='w-[20px] ' src={medal} alt=""/> */}
                  <badge>{item?.referral_code}</badge>
                </div>
                </td>
                <td className={`border font-bold text-center px-4 py-2 ${item.bonus_awarded?"text-green-600":"text-red-600"}`}>
                <div className='flex items-center justify-center gap-1'>
                {item?.bonus_awarded?<div className='flex items-center gap-1'> <img className='w-[20px] ' src={medal} alt=""/> <span>{item?.bonus_amount} INR</span> </div>
                :<img className='w-[20px] ' src={pending} alt=""/>}
                </div>

                  
                  </td>

              {/* <td className="border px-4 py-2" dangerouslySetInnerHTML={{ __html: item.rules }}></td> */}

            </tr>
          ))}
        </tbody>
      </table>
    </div>
        </div>
      </div>


    
      <div className="flex justify-between items-center">
        <p style={{color:iconColor}} className="text-xs font-semibold ">{t(`Showing`)} 1 {t(`to`)} {limit} {t(`of`)} {referralData.length} {t(`Entries`)}</p>
      <div
          className={`text-[16px]   text-sm font-semibold flex  mt-5 mr-5 justify-end gap-3 align-middle items-center`}
        >
          <button
            type="button"
            style={{
              backgroundColor: bg,
              border: `1px solid ${border}`,
              color: "white",
              fontSize: "12px",
            }}
            className={`ml-1 px-2 py-[4px] cursor-pointer  rounded-[5px] text-[20px]`}
            onClick={() => handlePrevPage()}
            disabled={currentPage == 1}
          >
            {"<"}
          </button>
          {t(`Page`)} <span>{currentPage}</span> {t(`of`)}{" "}
          <span>{pagination?.totalPages}</span>
          <button
            onClick={() => handleNextPage()}
            type="button"
            className={`ml-1 px-2 py-[4px] cursor-pointer rounded-[5px] text-[20px]`}
            style={{
              backgroundColor: bg,
              border: `1px solid ${border}`,
              color: "white",
              fontSize: "12px",
            }}
            disabled={currentPage == pagination?.totalPages}
          >
            {">"}
          </button>
        </div>
        </div>
  </div>
</div>


    </div>
  )
}

export default ReferAndEarn