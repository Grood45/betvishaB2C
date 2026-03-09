import React, { useEffect, useState } from 'react'
import { FaUser } from 'react-icons/fa';
import { IoSearchOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import coin from '../../assets/rupees.png'
import logo from '../../assets/logo.png'
import { MdOutlineSportsCricket } from 'react-icons/md';
import { TbReport } from 'react-icons/tb';
import { fetchGetRequest } from '../../api/api';
import { Progress, useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { convertToUniversalTime, formatDate } from '../../../utils/utils';
import { IoMdCloudDownload } from 'react-icons/io';

const GenerateAmountReport = () => {
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

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  const [currentPage,setCurrentPage]=useState(1)
const [loading,setLoading]=useState(false)
const [chipData,setChipData]=useState([])
const toast =useToast()
const [pagination, setPagination] = useState({});
const totalPages = pagination.totalPages;
const [limit,setLimit]=useState(20)
const { t, i18n } = useTranslation();

const getGenerateChipData = async () => {
  setLoading(true);
  
  // Format dates to YYYY-MM-DD format
  
  const formattedFromDate = fromDate ? new Date(fromDate).toISOString().split('T')[0] : '';
  const formattedToDate = toDate ? new Date(toDate).toISOString().split('T')[0] : '';

  let url = `${import.meta.env.VITE_API_URL}/api/transaction/get-generate-chip-transaction?page=${currentPage}&limit=${limit}`;

  // Add "from" and "to" dates to the API request URL if they are provided
  if (formattedFromDate && formattedToDate) {
    url += `&from=${formattedFromDate}&to=${formattedToDate}`;
  }

  try {
    let response = await fetchGetRequest(url);
    setLoading(false);
    if (response) {
      setChipData(response.data);
      setPagination(response.pagination);
    }
  } catch (error) {
    setLoading(false);
    toast({
      description: `${error?.data?.message || error?.message}`,
      status: "error",
      duration: 4000,
      position: "top",
      isClosable: true,
    });
    console.log(error);
  }
};

  
useEffect(()=>{
  getGenerateChipData();
},[currentPage,toDate,limit])



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

useEffect(() => {
  // Calculate total generate amount when chipData changes
  let total = 0;
  chipData.forEach(item => {
    total += item.deposit_amount;
  });
  setTotalGenerateAmount(total);
  if (chipData.length > 0) {
    setLastAfterGenerateAmount(chipData[chipData.length - 1].after_deposit);
  }
}, [chipData]);

  return (
    <div>
         <div>

<p style={{color:iconColor}} className={`font-bold   w-[100%]    flex items-center gap-2 rounded-[6px]  text-md`}>
    <TbReport style={{color:iconColor}} fontSize={"15px"} />
     {t(`Generate`)} {t(`Amount`)} {t(`Report`)}
  </p>
</div>
<div className='flex mt-12 mr-6 justify-between items-center'>

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
    <div className="flex items-center gap-2 text-sm">{t(`Show`)} 
        <select onChange={(e)=>setLimit(e.target.value)} className="text-xs outline-none p-1 rounded-md" value={limit}>
        <option value="20">20</option>

          <option value="50">50</option>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="500">500</option>
          <option value="1000">1000</option>

        </select>{t(`Entries`)}</div>
        </div>


    
    <div className="  ">
        <div
         
          className={`h-[100%] overflow-scroll rounded-[8px] md:rounded-[16px] bg-white p-3   w-[100%]  mt-8 `}
        >
          {loading && (
            <Progress size="xs" isIndeterminate colorScheme="#e91e63" />
          )}
         
          <table className={`w-[100%]  `}>
            <tr 
          style={{borderBottom:`1px solid ${border}`}}
            
            className={`text-center p-2 rounded-md   h-[30px]  text-[10px] font-bold `}>
              <th className="text-left min-w-[100px]">{t(`Date`)}</th>
              <th className='min-w-[60px]'>{t(`Wallet`)} {t(`Balance`)} </th>
              <th className='min-w-[90px]'>	{t(`Generate`)} {t(`Amount`)}</th>
              <th className='min-w-[90px]'>{(t(`After`))} {t(`Generate`)} {t(`Amount`)}</th>
              <th className='text-right min-w-[50px]'>{t(`Remarks`)}.</th>
          
            </tr>
            <tbody className=" ">
            {chipData &&
    chipData?.map((item) => {
      const timePart = item.initiated_at.split(' ')[1];
      const seccondPart=item.initiated_at.split(' ')[2]
      const time12Hour = `${timePart} ${seccondPart}`;
      const time24Hour = convertToUniversalTime(time12Hour);
                  return (
                    <tr
                      key={item?._id}
          style={{borderBottom:`1px solid ${border}`}}

                      className={`text-center  h-[60px] m-auto text-xs `}
                    >
                      <td className="">
                        <div className="flex text-left flex-col ">
                          <p>{formatDate(item?.initiated_at.split(" ")[0])}</p>
                          <p className='text-[9px] font-semibold'>({time24Hour} )</p>

                          
                        </div>
                      </td>

                      <td className='text-green-600'>
                      {item?.wallet_amount?.toFixed(2)} <span className='font-semibold '>{item?.currency}</span>
                      </td>

                      <td className={` text-blue-500 font-semibold `}>
                        {item?.deposit_amount?.toFixed(2)} <span className='font-semibold '>{item?.currency}</span>
                        </td>

                      <td className={` text-green-500 font-semibold`}>
                         {item?.after_deposit?.toFixed(2)} <span className='font-semibold '>{item?.currency}</span>
                        </td>

                     
                      <td className='text-right font-semibold text-xs'>
                        {item?.admin_response}
                        </td>

                     
                     


                    </tr>
                  );
                })}
            </tbody>
            <tfoot>
      <tr>
        <th className='text-left'>{t(`Total`)}</th>
        <th></th>
        <th className='font-bold'>+{totalGenerateAmount}</th>
        <th className='font-bold'>+{lastAfterGenerateAmount}</th>
       
      </tr>
    </tfoot>
          </table>
        </div>
      </div>


    
      <div className="flex justify-between items-center">
        <p style={{color:iconColor}} className="text-xs font-semibold ">{t(`Showing`)} 1 {t(`to`)} {limit} {t(`of`)} {chipData.length} {t(`Entries`)}</p>
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
          {t(`Page`)} <span>{currentPage}</span> of{" "}
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

export default GenerateAmountReport