import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Progress,
  useToast,
  Badge,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { SlScreenDesktop } from "react-icons/sl";
import { Link, useParams } from "react-router-dom";
import coin from ".././assets/rupees.png";
import { RiLuggageDepositFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { PiCubeTransparentFill } from "react-icons/pi";
import { IoSearchOutline } from "react-icons/io5";
import SlipModal from "../Modals/SlipModal";
import Barchart from "../component/Barchart";
import { fetchGetRequest } from "../api/api";
import { useTranslation } from "react-i18next";
import { convertToUniversalTime, formatDate } from "../../utils/utils";
import pdfIcon from '../assets/pdfIcon.webp';
import excelIcon from '../assets/excelIcon.webp'
const AffilateTransaction = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { t, i18n } = useTranslation();
 const [limit,setLimit]=useState()
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
  const [currentPage, setCurrentPage] = useState(1);
  const [allTransaction, setAllTransaction] = useState([]);
  const [totatSettlementAmount, setTotatSettlementAmount] = useState(0); 
  const [transactionType, setTransactionType] = useState("");
  const [search, setSearch] = useState("");
//   const [transactionCount, setTransactionCount] = useState({
//     approvedTransaction: 0,
//     pendingTransaction: 0,
//     rejectTransaction: 0,
//     allTransaction: 0,
//   });
  const toast = useToast();
  const [pagination, setPagination] = useState({});
  const totalPages = pagination.totalPages;
  const params = useParams();
  const [showLower, setShowlower] = useState(1);
  const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};
const [transactionGraphData,setTransactionGraphData]=useState({})

  const getAllTransactionDetails = async () => {
    setLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/transaction/get-all-transaction?transaction_type=${transactionType}&user_type=user&page=${currentPage}&limit=15`;

    if (search) {
      url += `&search=${search}`;
    }
    try {
      let response = await fetchGetRequest(url);
      setAllTransaction(response.data);
    //   setTransactionCount(response.transactionsCount);
      setPagination(response.pagination);
      if (response.data.length > 0) {
        const totalWithdrawAmount = response.data.reduce((acc, transaction) => {
          return acc + (transaction.withdraw_amount || 0); // Safely adding withdraw_amount
        }, 0);
        setTotatSettlementAmount(totalWithdrawAmount); 
      setLoading(false);
      }
    } catch (error) {
      toast({
        description: error?.message || error?.data?.message||error?.response?.data?.message,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      console.log(error);
      setLoading(false);
    }
  };
  const [transactionData,setTransactionData]=useState({})

  const transactionDetails = async () => {
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/transaction/get-admin-pl-details`;

    try {
      let response = await fetchGetRequest(url);
      setTransactionData(response);
      // setAdminPlLoading(false);
    } catch (error) {
      toast({
        description: error?.message || error?.data?.message,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      console.log(error);
      // setAdminPlLoading(false);
    }
  };
  
  useEffect(() => {
    let id;
    id = setTimeout(() => {
      transactionDetails()
    }, 100);
    return () => clearTimeout(id);
  }, []);
  const getTransactionGraph = async () => {
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/transaction/get-all-transaction-amount-for-graph?user_type=user`;
  
    
    try {
      let response = await fetchGetRequest(url);
      setTransactionGraphData(response)
    } catch (error) {
      toast({
        description: error?.message || error?.data?.message||error?.response?.data?.message,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      console.log(error);
    }
  };
  useEffect(() => {

    let id;
    id = setTimeout(() => {
      getAllTransactionDetails();
      getTransactionGraph()
    }, 100);
    return () => clearTimeout(id);
  }, [currentPage, transactionType, search]);
  const handleClick = (tab) => {
    setCurrentPage(1)
    setActiveTab(tab);
    if (tab == "all") {
      setTransactionType("");
    } else {
      setTransactionType(tab);
    }
  };
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
  const handleRender=()=>{
    getAllTransactionDetails()
  }
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  return (
    <div className="lg:px-4">
    
      <p
        style={{ color: iconColor }}
        className={`font-bold mt-8  w-[100%]    flex items-center gap-2 rounded-[6px]  text-lg`}
      >
        <PiCubeTransparentFill style={{ color: iconColor }} fontSize={"30px"} />
       {t(`Affilate`)} {t(`Recent`)} {t(`Transaction`)}
      </p>
      <div className="flex justify-between items-center">
        <div className="flex mt-6 items-center font-semibold text-xs md:text-sm gap-4">
          <p
            style={{
              borderBottom: activeTab === "all" ? `1px solid ${border}` : "",
              color: activeTab === "all" ? iconColor : "gray",
            }}
            className={` rounded-sm px-1  cursor-pointer  pb-1 `}
            onClick={() => handleClick("all")}
          >
            {t(`All`)} {t(`Affiliate`)} {t(`Settlement`)}
          </p>
        
        
        </div>
        <p className="font-semibold">Total Settlement : <span className="text-red-600">-{totatSettlementAmount} INR</span></p>

        <div className="flex items-center gap-2">
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
        <div
          style={{ border: `1px solid ${border}`, backgroundColor: primaryBg }}
          className={` justify-between   rounded-[8px] pl-1 flex items-center gap-2`}
        >
          <input
                       placeholder={`${t(`Search here`)}...`}

            className=" outline-none rounded-[8px] p-[6px]  text-black text-xs md:text-sm  w-[90%]"
          value={search}
          onChange={(e)=>{
            setSearch(e.target.value)
          setCurrentPage(1)
          }}
          />
          <span
            style={{ backgroundColor: bg }}
            className={`p-[6px] border rounded-r-[8px] cursor-pointer  `}
          >
            <IoSearchOutline fontSize={"22px"} color="white" />
          </span>
        </div>
        </div>
       
      </div>
      {/* table */}
      <div className="hidden md:contents">
        <div className="h-[100%] bg-white rounded-[12px] p-3  w-[100%]  mt-3">
          {loading && (
            <Progress size="xs" isIndeterminate colorScheme="#e91e63" />
          )}
          <p className=" font-semibold text-sm pb-2 pt-2 text-left">
          {t(`All`)} {t(transactionType) || `${t(`Transaction`)}`} {t(`Details`)}

          </p>
          <table className="w-[100%] ">
            <tr className="text-center p-2   border-b h-[30px]  border-gray-600 text-[10px] font-bold ">
            <th className="text-left">{(`User`)}/{t(`UserId`)}</th>

              <th className="">{t(`Trx`)}</th>
              <th>{t(`Method`)}/{t(`Gateway`)}</th>
              <th>{t(`Date`)}/{t(`Time`)}</th>
              <th>{t(`Settlement`)} {t(`Amount`)}</th>
              
              <th className="text-right">{t(`Action`)}</th>
            </tr>
            {allTransaction.length > 0 &&
  allTransaction
    .filter(item => item.role_type!== "affiliate") 
    .map(item => {
      const timePart = item.initiated_at.split(' ')[1];
      const seccondPart=item.initiated_at.split(' ')[2]
      const time12Hour = `${timePart} ${seccondPart}`;
      const time24Hour = convertToUniversalTime(time12Hour);
               return <tr
                  key={item._id}
                  className="text-left font-semibold h-[60px] m-auto  border-b border-gray-600 text-xs "
                >
                   <td>
                    <div className="flex flex-col  gap-[2px] ">
                      <p>{item.username}</p>
                      <p className="text-[10px] font-bold   ">
                        ({item.user_id})
                      </p>
                    </div>
                  </td>
                  <td className="max-w-[120px] text-center">
                    <div className="flex  flex-col gap-[2px]  ">
                      <p className="text-[10px]   ">{item.transaction_id}</p>
                    </div>
                  </td>
                  <td>
                    <div className="flex justify-center items-center">
                      <Badge>Manual</Badge>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col text-center gap-[2px] ">
                      <p>{formatDate(item.initiated_at.split(" ")[0])}</p>
                      <p className="text-[10px] font-bold   ">
                        ({time24Hour})
                      </p>
                    </div>
                  </td>
                 
                  <td className="text-center">
                    <p className="text-red-600 font-bold text-sm">-{item?.withdraw_amount}</p>
                  </td>
                 
                

                 
                  <td>
                    <div className=" flex justify-end">
                     <p>{item?.admin_response}</p>
                    </div>
                  </td>
                </tr>
})}
          </table>
        </div>
      </div>
      {/* card show instead of table    */}
      <div className=" contents lg:hidden pb-4 ">
        <p className=" font-bold text-md mt-8">{(`All`)} {t(`Transaction`)} {t(`Details`)}</p>
        <div className="flex flex-col gap-4 mt-2">
        {allTransaction.length > 0 &&
  allTransaction
    .filter(item => item.status!== "pending") 
    .map(item => {
      const timePart = item.initiated_at.split(' ')[1];
      const seccondPart=item.initiated_at.split(' ')[2]
      const time12Hour = `${timePart} ${seccondPart}`;
      const time24Hour = convertToUniversalTime(time12Hour);
               return <div
                  key={item._id}
                  className=" p-2 flex bg-white flex-col gap-3 rounded-[12px] w-[100%]"
                >
                  <div className="flex items-center justify-between  w-[100%] ">
                    {/* <button className="text-[#fff] h-[20px] px-2 p-1 rounded-lg bg-green-600 font-medium text-[10px]">
                  Online
                  </button> */}
                  </div>
                  <div className="flex items-center gap-5 sm:gap-10">
                    <p className="text-xs font-bold pl-3 ">{t(`Username`)}:</p>
                    <div className="flex items-center gap-2">
                      <p>{item.username}</p>
                      <p className="text-[9px] font-bold">({item.user_id})</p>
                    </div>
                  </div>
                  <div className="flex flex-col  ">
                    <div className="flex gap-3 w-[100%] p-3 ">
                      <p className="  text-xs font-bold">{t(`Trx`)} {t(`id`)} :-</p>
                      <p className=" font-medium text-xs">
                        {item.transaction_id}{" "}
                        <span className=" text-[10px] font-bold">
                          {/* {item.userid} */}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-8 w-full p-3">
                      <p className=" text-xs font-bold">{t(`Gateway`)}/{t(`Method`)}:</p>
                      <Badge
                        style={{ fontSize: "9px" }}
                        className="font-medium text-xs"
                      >
                        {item.method}{" "}
                      </Badge>
                    </div>
                    <div className="flex gap-4 w-[100%] items-center p-3">
                      <p className="text-xs font-bold">{t(`Amount`)}:-</p>
                      {item.type == "deposit" ? (
                        <p className="text-green-600 font-semibold">
                          {" "}
                          + {item.deposit_amount?.toFixed(2)} {item?.currency}
                        </p>
                      ) : (
                        <p className="text-red-600 font-semibold">
                          - {item.withdraw_amount?.toFixed(2)} {item?.currency}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-4 w-[100%] p-3 ">
                      <p className="  font-bold text-xs">{t(`Date`)}/{t(`Time`)}-</p>
                      <p className=" font-medium text-xs">
                        {formatDate(item.initiated_at.split(" ")[0])}
                        <span className="pl-1 font-semibold text-[10px]">
                          ({time24Hour})
                        </span>
                      </p>
                    </div>

                    <div className="flex gap-4 w-[100%] p-3">
                      <p className=" font-bold text-xs">{t(`Balance`)}:-</p>
                      <div className="flex justify-center items-center gap-2">
                        <p className=" text-xs">{item.wallet_amount?.toFixed(2)} {item.currency}</p>
                      </div>
                    </div>

                    <div className="flex gap-4 w-[100%] p-3 ">
                      <p className="font-bold text-xs">{t(`Details`)}:-</p>
                      <p className="font-medium text-xs">
                        {item.admin_response}
                      </p>
                    </div>

                    {/* <div className="flex justify-end p-3">
                    
                        <button className="p-[6px] px-2 text-xs text-white rounded-[4px] bg-none border ">View All</button>

                      </div> */}
                  </div>
                </div>
})}
        </div>
      </div>
      {allTransaction && allTransaction.length > 0 && (
        <div
          className={`text-[16px]   text-sm font-semibold flex m-auto mb-8 mr-5 justify-end gap-3 align-middle items-center mt-2`}
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
      )}
    </div>
  );
};



export default AffilateTransaction