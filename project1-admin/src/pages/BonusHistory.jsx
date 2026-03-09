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

const BonusHistory = () => {
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
const [bonusHistoryData,setBonusHistoryData]=useState([])
const toast =useToast()
const [pagination, setPagination] = useState({});
const totalPages = pagination.totalPages;
const [limit,setLimit]=useState(20)
const [bonusCount, setBonusCount] = useState({});
const [bonusAmount, setBonusAmount] = useState({});
const [category,setCategory]=useState('')
const [subCategory,setSubCategory]=useState('')
const [status, setStatus] = useState("all");

const getBonusHistory = async () => {
  setLoading(true);
  const formattedFromDate = fromDate ? new Date(fromDate).toISOString().split('T')[0] : '';
  const formattedToDate = toDate ? new Date(toDate).toISOString().split('T')[0] : '';


  let url = `${
    import.meta.env.VITE_API_URL
  }/api/bonus-history/get-all-bonus-history?status=${status}&page=${currentPage}&limit=${limit}`;

  if (formattedFromDate && formattedToDate) {
    url += `&from=${formattedFromDate}&to=${formattedToDate}`;
  }

  if (search) {
    url += `&search=${search}`;
  }
  if (category) {
    url += `&category=${category}`;
  }
  if (subCategory) {
    url += `&sub_category=${subCategory}`;
  }

  try {
    let response = await fetchGetRequest(url);
    const data = response.data;
    const receivedData = response.data;
    setBonusHistoryData(receivedData);
    setPagination(response.pagination);
    setBonusCount(response.bonusCount);
    setBonusAmount(response.bonusAmount);
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

  
useEffect(()=>{
  let id;
  id = setTimeout(() => {
    getBonusHistory();
  }, 100);

  return () => clearTimeout(id);
  

},[currentPage,toDate,limit,category,subCategory,status,search])



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
     {t(`Bonus`)} {t(`History`)}
  </p>
</div>

<div className='mt-10'>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {Object.entries(bonusAmount)?.map(([bonusType, bonusValue], index) => {
          const category = bonusType.replace(/Bonus.*$/, '');
          return (
            <div
              key={index}
              className={`flex flex-col bg-white  p-1 pl-3 rounded-md`}
              style={{ color: bonusColors[category],border:`1px solid ${border}` }}
            >
              <span className="text-blue-950 text-xs md:text-[16px] font-semibold">{bonusType}</span>
              <span className="text-xl font-bold">{bonusValue}</span>
            </div>
          );
        })}
      </div>
      <div className="grid  mt-2 grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {Object.entries(bonusCount)?.map(([bonusType, bonusValue], index) => {
          // Extract bonus category from bonusType
          const category = bonusType.replace(/Bonus.*$/, '');
          return (
            <div
              key={index}
              className={`flex flex-col bg-white  p-1 pl-3 rounded-md`}
              style={{ color: bonusColors[category],border:`1px solid ${border}` }}
            > 
              <span className="text-blue-950 text-xs md:text-[16px] font-semibold">{bonusType}</span>
              <span className="text-xl font-bold">{bonusValue}</span>
            </div>
          );
        })}
      </div>
</div>





<div className='flex mt-12 mr-6 flex-col gap-4 md:flex-row justify-between md:items-center'>

<div className="flex gap-2   items-center">
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
    </div>

    <div className='flex items-center gap-4'>
      <select onChange={(e)=>{
        setCategory(e.target.value)
        setCurrentPage(1)
        }} style={{border:`1px solid ${border}`}} className=" rounded-[6px] outline-none text-xs md:text-sm px-2 md:px-4 py-2">
        <option value=""> {t(`Categories`)}</option>
        
          <option  value={"user_bonus"}>{t(`User`)} {t(`Bonus`)}</option>
          <option  value={"deposit_bonus"}>{t(`Deposit`)} {t(`Bonus`)}</option>
          <option  value={"bet_bonus"}>{t(`Bet`)} {t(`Bonus`)}</option>

      </select>

      <select onChange={(e)=>{
        setSubCategory(e.target.value)
        setCurrentPage(1)
        }} style={{border:`1px solid ${border}`}} className=" rounded-[6px] outline-none text-xs md:text-sm px-2 md:px-4 py-2">
        <option value=""> {t(`Sub`)} {t(`Categories`)}</option>
        <option  value={"first_user"}>{t(`First`)} {t(`User`)}</option>
          <option  value={"first_bet"}>{t(`First`)} {t(`Bet`)}</option>
      </select>

      <select onChange={(e)=>{
        setStatus(e.target.value)
        setCurrentPage(1)
        }} style={{border:`1px solid ${border}`}} className=" rounded-[6px] outline-none text-xs md:text-sm px-2 md:px-4 py-2 ">
        <option value="">Status</option>
          <option  value={"success"}>{t(`Success`)}</option>
          <option  value={"failed"}>{t(`Failed`)}</option>
      </select>
    </div>
   
        </div>


    
    <div className=" mt-10 ">
    <div className="flex justify-start  items-center gap-2 text-sm">{t(`Show`)} 
        <select onChange={(e)=>setLimit(e.target.value)} style={{border:`1px solid ${border}`}} className={`text-xs   outline-none p-1 rounded-md`} value={limit}>
        <option value="20">20</option>

          <option value="50">50</option>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="500">500</option>
          <option value="1000">1000</option>

        </select>
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
            <th className="border px-4 py-2">{t(`Category`)}</th>
            <th className="border px-4 py-2">{t(`Sub Category`)}</th>
            <th className="border px-4 py-2">{t(`Reward`)} {t(`Amount`)}</th>
            <th className="border px-4 py-2">{t(`Bonus`)} {t(`Amount`)}</th>

            <th className="border px-4 py-2">{t(`Reward`)} {t(`Type`)}</th>
            <th className="border px-4 py-2">{t(`Description`)}</th>
            <th className="border px-4 py-2">{t(`Status`)}</th>
            {/* <th className="border px-4 py-2">{t(`Rules`)}</th> */}
          </tr>
        </thead>
        <tbody>
          {bonusHistoryData.length>0&&bonusHistoryData?.map((item, index) => (
            <tr key={index} className="bg-gray-100 text-sm">
              <td className="border px-4 py-2">{item.username}</td>
              <td className="border px-4 py-2">{formatDate(item.timestamp)}</td>
              <td className="border px-4 py-2">{item.category}</td>
              <td className="border px-4 py-2">{item.sub_category}</td>
              <td className="border text-green-700 font-bold px-4 py-2">{item.reward_amount?.toFixed(2)} {item?.currency}</td>
              <td className="border text-green-700 font-bold px-4 py-2">{item.bonus_amount?.toFixed(2)}</td>

              <td className="border px-4 py-2">{item.reward_type}</td>

              <td className="border px-4 py-2">{item.description}</td>
              <td className="border px-4 py-2">{item.status}</td>
              {/* <td className="border px-4 py-2" dangerouslySetInnerHTML={{ __html: item.rules }}></td> */}

            </tr>
          ))}
        </tbody>
      </table>
    </div>
        </div>
      </div>


    
      <div className="flex justify-between items-center">
        <p style={{color:iconColor}} className="text-xs font-semibold ">{t(`Showing`)} 1 {t(`to`)} {limit} {t(`of`)} {bonusHistoryData.length} {t(`Entries`)}</p>
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
  )
}

export default BonusHistory