import React, { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import coin from "../../assets/rupees.png";
import logo from "../../assets/logo.png";
import { Badge, Progress, useToast } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchGetRequest } from "../../api/api";
import { useTranslation } from "react-i18next";
import { convertToUniversalTime, formatDate } from "../../../utils/utils";
import { IoSearchOutline } from "react-icons/io5";
import { IoMdCloudDownload } from "react-icons/io";

const Transaction = ({id}) => {

  const { color,primaryBg,iconColor,secondaryBg, bg,hoverColor,hover,text, font, border } = useSelector(state => state.theme);
  const { t, i18n } = useTranslation();
const [limit,setLimit]=useState(10)
  const [loading1,setLoading1]=useState(false)
  const [transactionData,setTransactionData]=useState([])
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};
  const totalPages = pagination.totalPages;
  const toast =useToast()
      const getAllTransaction = async () => {
        setLoading1(true);
        let url = `${import.meta.env.VITE_API_URL}/api/transaction/get-all-transaction-single/${id}?page=${currentPage}&limit=${limit}`;
        try {
          let response = await fetchGetRequest(url);
          const data = response.data;
          const receivedData= response.data;
      setPagination(response.pagination);

          if (receivedData) {
            setTransactionData(receivedData);
          }
          setLoading1(false);
        } catch (error) {
          toast({
            description: `${error?.data?.message||error?.response?.data?.message}`,
            status: "error",
            duration: 4000,
            position: "top",
            isClosable: true,
          });
          console.log(error);
        }
      };
      
      useEffect(() => {
        getAllTransaction();
      }, [limit]);
      

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
    <div className="mt-8 flex flex-col gap-2">
      <div className="flex justify-between   items-center">
      <p style={{color:iconColor}} className="font-bold text-[15px]">{t(`Transaction`)} </p>
          {/* <input
            type="email"
            style={{border:`1px solid ${border}`}}
            className={`input p-2 rounded-lg  outline-none text-sm`}
            id="Email"
            name="Email"
            placeholder={`${t(`Search here`)}...`}
          /> */}
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
      {/* table */}
      <div className="lg:contents hidden">
      {loading1 && (
            <Progress size="xs" isIndeterminate colorScheme="#e91e63" />
          )}
        <div  className="h-[100%] bg-white rounded-[12px] p-3  w-[100%] ">
          <p style={{color:iconColor}} className=" font-medium text-sm  pt-2 text-left">
            {t(`User`)} {t(`Transaction`)} {t(`Details`)}
          </p>
          <table className="w-[100%] ">
            <tr className="text-center p-2   border-b h-[30px] border-gray-600 text-[10px] font-bold ">
              <th className="text-left max-w-[70px]">{t(`Username`)} / {t(`User`)} {t(`id`)}</th>
              <th className="">{t(`Gateway`)}/{t(`Method`)}</th>

              <th>{t(`Trx`)} {t(`id`)}</th>
              <th>{t(`Date`)}/{t(`Time`)}</th>
              <th>{t(`Approved By`)}</th>
              <th>{t(`Amount`)}</th>
              <th>{t(`Wallet`)} {t(`Balance`)}</th>
              <th className="text-right">{t(`Details`)}</th>
            </tr>
            {transactionData?.map((item) => {
               const timePart = item.initiated_at.split(' ')[1];
               const seccondPart=item.initiated_at.split(' ')[2]
               const time12Hour = `${timePart} ${seccondPart}`;
               const time24Hour = convertToUniversalTime(time12Hour);
              return (
                <tr
                  key={item._id}
                  className="text-center  h-[60px] m-auto  border-b border-gray-600 text-xs"
                >
                  <td className="max-w-[90px] ">
                    <div className="flex text-left flex-col ">
                      <p>{item.username}</p>
                      <p className="text-[9px] font-bold ">({item.user_id})</p>
                    </div>
                  </td>
                  <td>
                    <div className=" flex justify-center items-center"><Badge style={{fontSize:'9px'}}>{item?.method}</Badge></div>

                    </td>
                  <td className="max-w-[80px]  text-[10px]">{item.transaction_id}</td>
                  <td className="">
                    <div className="flex text-center flex-col ">
                      <p>{formatDate(item.initiated_at.split(" ")[0])}</p>
                      <p className="text-[9px]  font-bold ">({time24Hour})</p>
                    </div>
                  </td>
                  <td>
                      <div className="flex flex-col items-center justify-between gap-[4px]  ">
                        <button
                         style={{ backgroundColor: item?.status === "pending" ? "orange" : getRandomColor() }} 
                          className={`py-[4px] bg-blue-500 text-white font-bold w-[80%] text-[11px] m-auto rounded-[4px]`}
                        >
 {item?.status==="pending"?"pending":item?.approved_by_username}
                        </button>
                       
                        
                      </div>
                    </td>
                  {item.type=="deposit"? <td className="text-green-600 font-semibold"> +  {((item?.deposit_amount + (item?.deposit_amount * (item?.bonus / 100)))?.toFixed(2))}{item.currency}</td>:
                  <td className="text-red-600 font-semibold">
                   
                    -  {item?.withdraw_amount?.toFixed(2)} {item.currency}
                    </td>}
                  <td>
                    <div className="flex justify-center font-semibold text-center items-center gap-2">
                      {/* <img src={coin} alt="" className="h-[15px] w-[15px]" /> */}
                      <p>{item?.wallet_amount?.toFixed(2)}{item.currency}</p>
                    </div>
                  </td>

                  <td style={{fontSize:"10px"}} className="text-right max-w-[80px] font-semibold">{item.admin_response}</td>
                </tr>
              );
            })}
          </table>
        </div>
      </div>
      {/* showing card instead of table */}
      <div className=" contents lg:hidden pb-4 ">
        <p className=" font-bold text-md mt-8">{t(`All`)} {t(`Transactions`)} {t(`Details`)}</p>
        <div className="flex flex-col gap-4 mt-2">
          {transactionData &&
            transactionData?.map((item) => {
              const timePart = item.initiated_at.split(' ')[1];
              const seccondPart=item.initiated_at.split(' ')[2]
              const time12Hour = `${timePart} ${seccondPart}`;
              const time24Hour = convertToUniversalTime(time12Hour);
              return (
                <div
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
            <Badge style={{fontSize:'9px'}} className="font-medium text-xs">{item.method} </Badge>
          </div>
                    <div className="flex gap-4 w-[100%] items-center p-3">
                      <p className="text-xs font-bold">{t(`Amount`)}:-</p>
                      {item.type=="deposit"? <p className="text-green-600 font-semibold"> + {item.deposit_amount?.toFixed(2)} {item.currency}</p>:
                  <p className="text-red-600 font-semibold">
                   
                    -  {item.withdraw_amount?.toFixed(2)} {item.currency}
                    </p>}
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
                        {/* <img src={coin} alt="" className="h-[15px] w-[15px]" /> */}
                        <p className=" text-xs">{item?.wallet_amount?.toFixed(2)}{item.currency}</p>
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
              );
            })}
        </div>
      </div>

      {transactionData && transactionData.length > 0 && (
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

export default Transaction;
