
import React, { useEffect, useState } from "react";
import wallet from "../../assets/wallet.png";
import watch from "../../assets/Watch.png";
import cross from "../../assets/BookmarkX.png";
import coin from "../../assets/rupees.png";
import logo from "../../assets/logo.png";

import { SlScreenDesktop } from "react-icons/sl";
import { Badge, Progress, useToast } from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchGetRequest } from "../../api/api";
import { useTranslation } from "react-i18next";
import { convertToUniversalTime, formatDate } from "../../../utils/utils";
import { IoSearchOutline } from "react-icons/io5";
import { IoMdCloudDownload } from "react-icons/io";

const WithDrawl = ({id}) => {
  const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};
  const [currentPage, setCurrentPage] = useState(1);
  const [allWithdraw, aetallWithdraw] = useState();
  const [loading, setLoading] = useState(false);
  const [transactionType, setTransactionType] = useState("approved");
  const [transactionCount, setTransactionCount] = useState();
  const [allAmount,setAllAmount]=useState(0)
  const [limit,setLimit]=useState(10)
  const [pagination, setPagination] = useState({});
  const totalPages = pagination.totalPages;
  const toast = useToast();
  
const { t, i18n } = useTranslation();
 
const { color,primaryBg,secondaryBg, iconColor,bg,hoverColor,hover,text, font, border } = useSelector(state => state.theme);

const getAlldashboardDetails = async () => {
  setLoading(true);
  let url = `${import.meta.env.VITE_API_URL}/api/transaction/get-all-withdraw-single/${id}?page=${currentPage}&limit=${limit}&status=${transactionType}`;
  try {
    let response = await fetchGetRequest(url);
    setAllAmount(response?.transactionAmount)
    const data = response.data;
    const receivedData = response.data;
    setPagination(response.pagination);
    if (receivedData) {
      aetallWithdraw(receivedData);
    }
    setTransactionCount(response.transactionsCount);
    setLoading(false);
  } catch (error) {
    toast({
      description: `${error?.data?.message}`,
      status: "error",
      duration: 4000,
      position: "top",
      isClosable: true,
    });
    console.log(error);
  }
};

useEffect(() => {
  getAlldashboardDetails();
}, [currentPage, transactionType,limit]);

const handleFilter = (name) => {
  setCurrentPage(1)
  setTransactionType(name);
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
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
  return (
    <div className="flex flex-col mt-5 gap-6">
      {/* first */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div
          onClick={() => handleFilter("approved")}
          style={{
            background: "linear-gradient(96deg, #46F209 0%, #01B574 64.37%)",
          }}
          className="flex items-center cursor-pointer text-white w-[100%] p-3 gap-2 py-6 rounded-[12px] justify-between"
        >
          <div>
            <p className="font-semibold text-md ">
              {t(`Successful`)} {t(`Withdraw`)}
            </p>
            <p className="font-semibold text-lg "> {transactionCount?.approvedTransaction}</p>
          </div>
          <img src={wallet} className="h-[70px] w-[70px]" alt="" />
        </div>

        {/* <div
          onClick={() => handleFilter("pending")}
          style={{
            background: "linear-gradient(96deg,  #CEB352 0%,  #FFA800 64.37%)",
          }}
          className="flex cursor-pointer items-center p-3 text-white gap-2 py-6 w-[100%] rounded-[12px] justify-between"
        >
          <div>
            <p className="font-semibold text-md  ">
              {t(`Pending`)} {t(`Withdraw`)}
            </p>
            <p className="font-semibold text-lg ">{transactionCount?.pendingTransaction}</p>
          </div>
          <img src={watch} className="h-[70px] w-[70px]" alt="" />
        </div> */}

        <div
          onClick={() => handleFilter("reject")}
          style={{
            background: "linear-gradient(100deg, #FF6A6A 35.51%, #F00 103.54%)",
          }}
          className="flex cursor-pointer items-center text-white p-3 gap-2 py-6 w-[100%] rounded-[12px] justify-between"
        >
          <div>
            <p className="font-semibold text-md ">
              {t(`Reject`)} {t(`Withdraw`)}
            </p>
            <p className="font-semibold text-lg ">{transactionCount?.rejectTransaction}</p>
          </div>
          <img src={cross} className="h-[70px] w-[70px]" alt="" />
        </div>
      </div>
      
      
      <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm">{t(`Show`)} 
        <select onChange={(e)=>setLimit(e.target.value)} style={{border:`1px solid ${border}`}} className="text-xs outline-none p-1 rounded-md" value={limit}>
        <option value="10">10</option>
      
        <option value="20">20</option>

          <option value="50">50</option>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="500">500</option>
          <option value="1000">1000</option>

        </select>{t(`Entries`)}</div>
      <div className="flex items-center gap-2 justify-end">
     
<span
                style={{ backgroundColor: bg }}
                className="px-2 py-[6px] rounded-md cursor-pointer"
              >
                <IoMdCloudDownload
                  // onClick={handleDownloadReport}
                  fontSize={"25px"}
                  color="white"
                />
              </span>
      <div
               style={{border:`1px solid ${border}`,backgroundColor:primaryBg}}
            className={` justify-between rounded-[8px] pl-1 flex items-center gap-2 `}>
            <input
           
                          placeholder={`${t(`Search here`)}...`}

              className=" outline-none rounded-[8px] p-[6px]  text-black text-xs md:text-sm  w-[70%]"
            />
            <span
               style={{backgroundColor:bg}}
            
            className={`p-[6px] border rounded-r-[8px] cursor-pointer `}>
              <IoSearchOutline fontSize={"22px"} color="white" />
            </span>
          </div>
</div>
</div>

      {/* second table-div */}
      <div className="lg:contents hidden">
        <div
          
          className="h-[100%] bg-white rounded-[12px] p-3  w-[100%]   "
        >
          {loading && (
            <Progress size="xs" isIndeterminate colorScheme="#e91e63" />
          )}
          <p style={{color:iconColor}} className=" font-semibold text-sm pb-2 pt-2 text-left">
            {t(`All`)} {t(`Withdraw`)} {t(`Details`)}
          </p>
          <table className="w-[100%] ">
            <tr className="text-center p-2   border-b h-[30px] border-gray-600 text-[10px] font-bold ">
              <th className="text-left"> {t(`Trx`)}</th>
              <th className="">{t(`Gateway`)}/{t(`Method`)}</th>

              <th>{t(`Date`)}/{t(`Time`)}</th>
              <th>{t(`User`)}/{t(`UserId`)}</th>
              <th>{t(`Withdraw`)} {t(`Amount`)}</th>
              <th>{t(`Wallet`)} {t(`Balance`)}</th>
              <th>{t(`Approved By`)}</th>

              <th>{t(`Status`)}</th>
              {/* <th className="text-right">Action</th> */}
            </tr>
            {allWithdraw &&
              allWithdraw.map((item) => {
                const timePart = item.initiated_at.split(' ')[1];
                const seccondPart=item.initiated_at.split(' ')[2]
                const time12Hour = `${timePart} ${seccondPart}`;
                const time24Hour = convertToUniversalTime(time12Hour);
                return (
                  <tr
                    key={item.user_id}
                    className="text-left  h-[60px]  m-auto  border-b border-gray-600 text-xs"
                  >
                    <td className="w-[150px]">
                      <div className="flex flex-col gap-[2px]  ">
                        
                        <p className="text-[9px]   ">
                          {item.transaction_id}
                        </p>
                      </div>
                    </td>
                    <td>
                    <div className=" flex justify-center items-center"><Badge style={{fontSize:'9px'}}>{item?.method}</Badge></div>

                    </td>
                    <td>
                      <div className="flex flex-col text-center gap-[2px] ">
                        <p>{formatDate(item.initiated_at.split(" ")[0])}</p>
                        <p className="text-[9px] font-bold">({time24Hour})</p>

                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col text-center gap-[2px] ">
                        <p>{item.username}</p>
                        <p className="text-[9px]   ">
                         ( {item.user_id})
                        </p>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col text-center gap-[2px]">
                        <p className="text-[14px] ">
                           {item.withdraw_amount?.toFixed(2)} +{" "}
                          <span className="text-xs text-red-500 ">
                            {item.bonus}
                          </span>
                        </p>
                        <p className="text-xs   ">
                          {item.withdraw_amount?.toFixed(2) + item.bonus} {item.currency}
                        </p>
                      </div>
                    </td>
                    <td className="">
                      <div className="flex font-semibold   justify-center text-center items-center gap-2">
                       
                        <span>{item.wallet_amount?.toFixed(2)}</span> {item?.currency}
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col items-center justify-between gap-[4px]  ">
                        <button
                        style={{ backgroundColor: item?.status === "pending" ? "orange" : getRandomColor() }} 
                          className={`py-[4px] text-white font-bold w-[80%] text-[11px] m-auto rounded-[4px]`}
                        >
                      {item?.status==="pending"?"pending":item?.approved_by_username}

                        </button>
                       
                        
                      </div>
                    </td>

                    <td>
                      <div className="flex flex-col items-center justify-between gap-[4px]  ">
                        <button
                          className={`py-[4px] w-[100%] text-[9px] m-auto rounded-[4px]   ${
                            item.status == "approved"
                              ? "bg-[#01B574]"
                              : "bg-red-500"
                          } `}
                        >
                          {item.status}
                        </button>
                        
                      </div>
                    </td>
                    {/* <td>
                      <div className=" flex justify-end">
                        <Link
                          key={item.user_id}
                          to=""
                        >
                          <SlScreenDesktop
                            cursor="pointer"
                            color={iconColor}
                            fontSize="15px"
                          />
                        </Link>
                      </div>
                    </td> */}
                  </tr>
                );
              })}
          </table>
        </div>
      </div>

      {/* showing card instead of table */}
      <div className="contents lg:hidden pb-4">
  <p className="font-bold text-md mt-8">{t(`All`)} {t(`Withdraw`)} {t(`Details`)}</p>
  {loading && (
    <Progress size="xs" isIndeterminate colorScheme="#e91e63" />
  )}
  <div className="flex flex-col gap-4 mt-2">
    {allWithdraw && allWithdraw.map((item) => {
       const timePart = item.initiated_at.split(' ')[1];
       const seccondPart=item.initiated_at.split(' ')[2]
       const time12Hour = `${timePart} ${seccondPart}`;
       const time24Hour = convertToUniversalTime(time12Hour);
     return <div key={item.user_id} className="p-2 bg-white flex flex-col gap-3 rounded-lg w-full">
        <div className="flex items-center justify-between w-full">
          <p className="text-xs font-bold">{t(`Withdraw`)} {t(`Details`)}</p>
          <button className={`py-1 px-2 text-xs rounded bg-${item.status === "approved" ? "green-500" : "red-500"} text-white`}>
            {item.status}
          </button>
        </div>
        <div className="flex items-center gap-5 sm:gap-10">
         <p className="text-xs font-bold ">{t(`Username`)}:</p>
          <div className="flex items-center gap-2">
            <p>{item.username}</p>
            <p className="text-[9px] font-bold">({item.user_id})</p>
          </div>
        </div>
        <div className="flex flex-col">
        <div className="flex gap-8 w-full items-center p-3">
            <p className="font-bold text-xs">{t(`Trx`)}:</p>
            <p style={{fontSize:'9px'}} className=" font-bold text-xs">{item.transaction_id} </p>
          </div>
          <div className="flex gap-8 w-full p-3">
            <p className=" text-xs font-bold">{t(`Gateway`)}/{t(`Method`)}:</p>
            <Badge style={{fontSize:'9px'}} className="font-medium text-xs">{item.method} </Badge>
          </div>

          <div className="flex gap-3 w-full p-3">
            <p className="font-bold text-xs">{t(`Date`)}/{t(`Time`)}:</p>
            <p className="font-medium text-xs">{formatDate(item.initiated_at.split(" ")[0])} <span className="text-[9px] font-bold">({time24Hour})</span></p>
          </div>
          <div className="flex gap-3 w-full p-3">
            <p className="font-bold text-xs">{t(`Withdraw`)} {t(`Amount`)}:</p>
            <p className="font-medium text-xs">{item?.withdraw_amount?.toFixed(2)}{item.currency}</p>
          </div>
          <div className="flex gap-3 w-full p-3">
            <p className="font-medium text-xs">{t(`Balance`)}:</p>
            <div className="flex items-center gap-2">
             
              <p className="text-xs">{item?.wallet_amount?.toFixed(2)}{item.currency}</p>
            </div>
          </div>
          {/* <div className="flex justify-end p-3">
          <Link
                          key={item.user_id}
                          to=""
                        >
                          <SlScreenDesktop
                            cursor="pointer"
                            color={iconColor}
                            fontSize="20px"
                          />
                        </Link>
          </div> */}
        </div>
      </div>
})}
  </div>
</div>

{allWithdraw && allWithdraw.length > 0 && (
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

export default WithDrawl;
