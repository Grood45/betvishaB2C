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
const UserTransaction = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { t, i18n } = useTranslation();
 
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
    }/api/transaction/get-all-transaction?transaction_type=${transactionType}&user_type=admin&page=${currentPage}&limit=15`;

    if (search) {
      url += `&search=${search}`;
    }
    try {
      let response = await fetchGetRequest(url);
      setAllTransaction(response.data);
    //   setTransactionCount(response.transactionsCount);
      setPagination(response.pagination);
      setLoading(false);
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
  const getTransactionGraph = async () => {
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/transaction/get-all-transaction-amount-for-graph?user_type=admin`;
  
    
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
  
  return (
    <div className="lg:px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  justify-between  gap-6 w-[100%]">
        <div
          style={{ backgroundColor: bg }}
          className={` flex flex-col justify-between z-[1] w-[100%] rounded-2xl p-2 h-[240px] top-7 left-1 md:left-2`}
        >
          <div className="w-[100%] flex justify-between">
            <div className="flex flex-col ">
              <p className="text-2xl font-bold  text-white">VISA</p>
              <p className="text-sm font-medium text-white">{t(`PREMIUM`)} {t(`ACCOUNT`)}</p>
            </div>
            <svg
              width="116"
              height="71"
              viewBox="0 0 116 71"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                opacity="0.25"
                cx="35.5"
                cy="35.5007"
                r="35.5"
                fill="white"
              />
              <circle
                opacity="0.5"
                cx="79.5195"
                cy="35.5007"
                r="35.5"
                fill="white"
              />
            </svg>
          </div>
          <div className="flex justify-evenly mt-4 w-[90%] m-auto">
            <p className="font-semibold text-xl text-white w-[100%]">XXXX </p>
            <p className="font-semibold text-xl text-white w-[100%]"> ***** </p>
            <p className="font-semibold text-xl text-white w-[100%]"> ***** </p>
            <p className="font-semibold text-xl text-white w-[100%]">XXXX </p>
          </div>
          <div className="flex justify-between w-[100%] p-2">
            <div className="flex flex-col ">
              <p className="text-xs font-semibold text-white"> {t(`Card Holder`)}</p>
              <p className="text-[17px] font-medium text-white"> {adminData?.username}</p>
            </div>
            <div className="flex flex-col ">
              <p className="text-xs font-semibold text-white"> {t(`Joined`)} {t(`Date`)}</p>
              <p className="text-[14px] font-medium text-white">{formatDate(adminData?.joined_at)}</p>
            </div>
          </div>
        </div>

        <div className=" bg-white  p-3  flex flex-col justify-between z-[1] w-[100%] rounded-2xl h-[240px] top-7 left-1 md:left-2">
          <div className="w-[100%] flex justify-between">
            <div className="flex flex-col ">
              <p className="text-sm font-medium ">{t(`Total`)} {t(`Transaction`)} {t(`Count`)}</p>
              <p className="text-lg font-semibold ">{allTransaction?.length}</p>
            </div>
            <svg
              width="116"
              height="71"
              viewBox="0 0 116 71"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                opacity="0.25"
                cx="35.5"
                cy="35.5007"
                r="35.5"
                fill="white"
              />
              <circle
                opacity="0.5"
                cx="79.5195"
                cy="35.5007"
                r="35.5"
                fill="white"
              />
            </svg>
          </div>
          <div className="flex justify-between mt-4 w-[90%] m-auto">
            <div>
              <p className="font-normal text-sm  ">{t(`Card Holder`)}</p>
              <p className="font-semibold text-lg ">{adminData?.username}</p>
            </div>
            <div>
              <p className="font-normal text-sm  ">{t(`Joined`)} {t(`Date`)}</p>
              <p className="font-semibold text-sm ">{formatDate(adminData?.joined_at)}</p>
            </div>
          </div>
          <div className="flex justify-evenly mt-4 w-[90%] m-auto">
            <p className="font-semibold text-xl  w-[100%]">XXXX </p>
            <p className="font-semibold text-xl  w-[100%]"> ***** </p>
            <p className="font-semibold text-xl w-[100%]"> ***** </p>
            <p className="font-semibold text-xl  w-[100%]">XXXX </p>
          </div>
        </div>

        <div className=" bg-white  p-3 overflow-scroll  flex flex-col justify-between z-[1] w-[100%] rounded-2xl h-[240px] top-7 left-1 md:left-2">
          <Barchart
            title={`${t(`Transaction`)} ${t(`Overview`)}`}
            type={"bar"}
            deposits={transactionGraphData?.lastTwelveMonthsDepositAmount}
            withdrawals={transactionGraphData?.lastTwelveMonthsWithdrawAmount}
          />
        </div>
      </div>{" "}
      <p
        style={{ color: iconColor }}
        className={`font-bold mt-8  w-[100%]    flex items-center gap-2 rounded-[6px]  text-lg`}
      >
        <PiCubeTransparentFill style={{ color: iconColor }} fontSize={"30px"} />
       {t(`Admin`)} {t(`Recent`)} {t(`Transaction`)}
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
            {t(`All`)} {t(`Transaction`)}
          </p>
          <p
            style={{
              borderBottom:
                activeTab === "withdraw" ? `1px solid ${border}` : "",
              color: activeTab === "withdraw" ? iconColor : "gray",
            }}
            className={`rounded-sm px-1 cursor-pointer  pb-1 `}
            onClick={() => handleClick("withdraw")}
          >
            {t(`Withdraw`)} {t(`Transaction`)}
          </p>
          <p
            style={{
              borderBottom:
                activeTab === "deposit" ? `1px solid ${border}` : "",
              color: activeTab === "deposit" ? iconColor : "gray",
            }}
            className={` rounded-sm px-1 cursor-pointer pb-1 `}
            onClick={() => handleClick("deposit")}
          >
            {t(`Deposit`)} {t(`Transaction`)}
          </p>
        </div>
        <div
          style={{ border: `1px solid ${border}`, backgroundColor: primaryBg }}
          className={` justify-between  mt-3 rounded-[8px] pl-1 flex items-center gap-2`}
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
              <th className="text-left">{t(`Trx`)}</th>
              <th>{t(`Method`)}/{t(`Gateway`)}</th>
              <th>{t(`Date`)}/{t(`Time`)}</th>
              <th>{(`User`)}/{t(`UserId`)}</th>
              <th>{t(`Transaction`)} {t(`Amount`)}</th>
              <th>{t(`Wallet`)} {t(`Balance`)}</th>
              <th>{t(`Status`)}</th>
              <th className="text-right">{t(`Action`)}</th>
            </tr>
            {allTransaction.length > 0 &&
  allTransaction
    .filter(item => item.status!== "pending") 
    .map(item => {
      const timePart = item.initiated_at.split(' ')[1];
      const seccondPart=item.initiated_at.split(' ')[2]
      const time12Hour = `${timePart} ${seccondPart}`;
      const time24Hour = convertToUniversalTime(time12Hour);
               return <tr
                  key={item._id}
                  className="text-left font-semibold h-[60px] m-auto  border-b border-gray-600 text-xs "
                >
                  <td className="max-w-[120px]">
                    <div className="flex  flex-col gap-[2px]  ">
                      <p className="text-[10px]   ">{item.transaction_id}</p>
                    </div>
                  </td>
                  <td>
                    <div className="flex justify-center items-center">
                      <Badge>{item.method}</Badge>
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
                  <td>
                    <div className="flex flex-col text-center gap-[2px] ">
                      <p>{item.username}</p>
                      <p className="text-[10px] font-bold   ">
                        ({item.user_id})
                      </p>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col text-center gap-[2px]">
                      <p
                        className={`text-[16px] ${
                          item.type == "withdraw"
                            ? "text-red-600"
                            : "text-green-500"
                        } `}
                      >
                        {item.type == "withdraw"
                          ? item.withdraw_amount?.toFixed(2)
                          : item.deposit_amount?.toFixed(2)}{" "}
                        +<span className="text-xs  ">{item.bonus}%</span>
                      </p>
                      {item.type === "withdraw" ? (
                        <p className="text-xs    ">
                          {item.withdraw_amount?.toFixed(2) + item.bonus} {item?.currency}
                        </p>
                      ) : (
                        <p className="text-xs    ">
                          {item.deposit_amount?.toFixed(2) + item.bonus} {item?.currency}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="">
                    <div className="flex   justify-center text-center items-center gap-2">
                      {/* <img src={coin} alt="" className="h-[15px] w-[15px]" /> */}
                      <span>{item.wallet_amount?.toFixed(2)} {item?.currency}</span>
                    </div>
                  </td>

                  <td>
                    <div className="flex flex-col items-center justify-between gap-[4px]  ">
                      <button
                        className={` px-2 p-1 rounded-md w-[100px] text-white text-[10px] ${
                          item.status == "approved"
                            ? "bg-[#01B574]"
                            : item.status == "reject"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        } `}
                      >
                        {item.status}
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className=" flex justify-end">
                      <SlipModal data={item} type="user" handleRender={handleRender} />
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

export default UserTransaction;
