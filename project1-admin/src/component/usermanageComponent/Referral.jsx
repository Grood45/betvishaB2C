
import React, { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import coin from "../../assets/rupees.png";
import logo from "../../assets/logo.png";
import { Progress, useToast } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import check from '../../assets/check.png'
import pending from '../../assets/pending.png'
import medal from '../../assets/medal.png'
import { IoSearchOutline } from "react-icons/io5";
import { IoMdCloudDownload } from "react-icons/io";
import { fetchGetRequest } from "../../api/api";
import { formatDate } from "../../../utils/utils";

const Referral = ({ id }) => {
  const [loading1, setLoading1] = useState(false);
  const toast = useToast();
  const { color, primaryBg, iconColor, secondaryBg, bg, hoverColor, hover, text, font, border } = useSelector(state => state.theme);
  const { t, i18n } = useTranslation();
  const [limit, setLimit] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [referralData, setReferralData] = useState([])
  const [pagination, setPagination] = useState({});
  const [category, setCategory] = useState('')
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [subCategory, setSubCategory] = useState('')
  const [status, setStatus] = useState(0);
  const [promotionData, setPromotionData] = useState({});

  const totalPages = pagination.totalPages;
  const [loading, setLoading] = useState()

  const getBonusHistory = async () => {
    setLoading(true);
    const formattedFromDate = fromDate ? new Date(fromDate).toISOString().split('T')[0] : '';
    const formattedToDate = toDate ? new Date(toDate).toISOString().split('T')[0] : '';


    let url = `${import.meta.env.VITE_API_URL
      }/api/referral/get-all-referral-by-admin?refer_by=${id}`;

    // if (formattedFromDate && formattedToDate) {
    //   url += `&from=${formattedFromDate}&to=${formattedToDate}`;
    // }
    if (status) {
      url += `&status=${status}`;
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
      // setBonusAmount(response.bonusAmount);
      setLoading(false);
    } catch (error) {
      toast({
        description: `${error?.data?.message || error?.response?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    let id;
    id = setTimeout(() => {
      getBonusHistory();

    }, 400);

    return () => clearTimeout(id);


  }, [currentPage, limit, category, subCategory, status, search])
  const transactionData = [
    {
      _id: "1",
      username: "Total Referral",
      user_id: "9:00PM",
      transaction_id: "ABC123XYZ",
      initiated_at: "Refferal bonus",
      withdraw_amount: 200,
      wallet_amount: 500,
      admin_response: "john  reffer to  rocky",
    },
    {
      _id: "2",
      username: "Total Referral Reward",
      user_id: "10:00PM",
      transaction_id: "DEF456UVW",
      initiated_at: "Cashback bonus",
      withdraw_amount: 150,
      wallet_amount: 300,
      admin_response: "john  reffer to  rocky",
    },
    {
      _id: "3",
      username: "Reject Referral",
      user_id: "10:00PM",
      transaction_id: "DEF456UVW",
      initiated_at: "Promotion bonus",
      withdraw_amount: 150,
      wallet_amount: 300,
      admin_response: "john  reffer to  rocky",
    },
    {
      _id: "4",
      username: "New Referral",
      user_id: "10:00PM",
      transaction_id: "DEF456UVW",
      initiated_at: "Promotion bonus",
      withdraw_amount: 150,
      wallet_amount: 300,
      admin_response: "john  reffer to  rocky",
    },

    // Add more dummy data as needed
  ];

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
  return (
    <div className="mt-8 flex flex-col gap-2">
      <div className="flex flex-col justify-between  ">
        <p style={{ color: iconColor }} className="font-bold text-[17px]">Referral Details </p>
        {/* <div className="grid w-[100%] grid-cols-2 mt-5 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {transactionData.map((item) => {
          return (
            <div
              key={item.id}
              className={`flex flex-col bg-white  p-2 pl-3 rounded-md`}
              style={{border:`1px solid ${border}` }}
            >
              <span className="text-blue-950 text-xs md:text-[16px] font-semibold">{item?.username}</span>
              <span className="text-xl font-bold">{item?.wallet_amount}</span>
            </div>
          );
        })}
      </div> */}
      </div>

      {/* table */}
      <div className=" mt-2 ">
        <div className='flex justify-between items-center px-2'>
          <div className="flex justify-start  items-center gap-2 text-sm">

            <div style={{ border: `1px solid ${border}`, backgroundColor: primaryBg }} className={` justify-between rounded-[8px] pl-1 flex items-center gap-2 w-[200px]`}>
              <input
                placeholder={`${t(`Search here`)}...`}
                className=" outline-none rounded-[8px] p-[4px]  text-black text-xs md:text-sm  w-[70%]"
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
              />
              <span style={{ backgroundColor: bg }} className={`p-[4px] border rounded-r-[8px] cursor-pointer`}>
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
              <select onChange={(e) => setLimit(e.target.value)} style={{ border: `1px solid ${border}` }} className={`text-xs   outline-none p-2 rounded-md`} value={limit}>
                <option value="20">20</option>

                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="500">500</option>
                <option value="1000">1000</option>

              </select>
            </div>
            <select onChange={(e) => {
              setStatus(e.target.value)
            }} style={{ border: `1px solid ${border}` }} className=" rounded-[6px] outline-none text-xs md:text-sm px-2 md:px-4 py-[6px] ">
              <option value={0}>Status</option>
              <option value={1}>{t(`Bonus Credited`)}</option>
              <option value={2}>{t(`Bonus Not Credited`)}</option>
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
                {referralData.length > 0 && referralData?.map((item, index) => (
                  <tr key={index} className="bg-gray-100 text-sm">
                    <td className="border px-4 py-2">{item.referred_user.username}</td>
                    <td className="border px-4 py-2">
                      <div>
                        <p> {formatDate(item.updated_at.split(" ")[0])}</p>
                      </div>
                    </td>
                    <td className="border px-4 py-2">{item.refer_by}</td>
                    <td className="border px-4 py-2"><div className='flex items-center justify-center'>
                      {item?.steps_completed?.is_registered ? <img className='w-[20px] ' src={check} alt="" /> : <img className='w-[20px] ' src={pending} alt="" />}
                    </div></td>
                    <td className="border text-green-700 text-center font-bold px-4 py-2">
                      <div className='flex items-center justify-center'>
                        {item?.is_deposited?.is_registered ? <img className='w-[20px] ' src={check} alt="" /> : <img className='w-[20px] ' src={pending} alt="" />}

                      </div>

                    </td>
                    <td className="border text-green-700 text-center font-bold px-4 py-2">
                      <div className='flex items-center justify-center'>
                        {item?.bonus_awarded ? <img className='w-[20px] ' src={check} alt="" /> : <img className='w-[20px] ' src={pending} alt="" />}

                      </div>

                    </td>


                    <td className={`border font-bold text-center px-4 py-2 ${item.bonus_awarded ? "text-green-600" : "text-red-600"}`}>

                      {item?.bonus_awarded ? <p>Completed</p> : <p>Pending</p>}

                    </td>
                    <td className="border px-4 py-2 font-bold text-blue-500 text-center">

                      <div className='flex items-center justify-center gap-2'>
                        {/* <img className='w-[20px] ' src={medal} alt=""/> */}
                        <badge>{item?.referral_code}</badge>
                      </div>
                    </td>

                    <td className={`border font-bold text-center px-4 py-2 ${item.bonus_awarded ? "text-green-600" : "text-red-600"}`}>
                      <div className='flex items-center justify-center gap-1'>
                        {item?.bonus_awarded ? <div className='flex items-center gap-1'> <img className='w-[20px] ' src={medal} alt="" /> <span>{item?.bonus_amount} INR</span> </div>
                          : <img className='w-[20px] ' src={pending} alt="" />}
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
        <p style={{ color: iconColor }} className="text-xs font-semibold ">{t(`Showing`)} 1 {t(`to`)} {limit} {t(`of`)} {referralData.length} {t(`Entries`)}</p>
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
  );
};


export default Referral