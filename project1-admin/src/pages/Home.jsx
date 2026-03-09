import React, { useEffect, useState, useRef } from "react";
import { motion, useSpring, useTransform, AnimatePresence } from "framer-motion";
import user from "../assets/users.png";
import { BiDotsHorizontalRounded, BiSolidWalletAlt } from "react-icons/bi";
import {
  BsFillClockFill,
  BsArrowRightShort,
  BsFillRocketTakeoffFill,
  BsCartFill,
  BsCheckCircleFill,
  BsArrowDownCircle,
  BsArrowUpCircle,
  BsCalendarDateFill,
} from "react-icons/bs";
import { RiBankFill, RiLuggageDepositLine, RiNumbersFill, RiExchangeDollarFill, RiPieChart2Fill, RiUserAddLine, RiGameLine, RiEyeLine } from "react-icons/ri";
import { FiRefreshCw } from "react-icons/fi";
import Chart from "../component/Chart";
import { HiCurrencyDollar, HiOutlineDotsVertical, HiOutlineEye } from "react-icons/hi";
import { VscGraph } from 'react-icons/vsc';
import { IoSettings } from 'react-icons/io5';
import { BsBank2 } from 'react-icons/bs';
import { TbCoin, TbMoneybag } from "react-icons/tb";
import { GoDotFill } from "react-icons/go";
import dash from "../assets/dash1.png";
import d2 from "../assets/d2.png";
import coin from "../assets/rupees.png";
import plbg from '../assets/plbg.jpeg'
import Carousel from "../component/Carousel";
import BetCards from "../component/BetCards";
import { LuImport } from "react-icons/lu";
import deposit from "../assets/deposit.png";
import withdraw from "../assets/Vector.png";
import icon from "../assets/icon.png";
import { useDispatch, useSelector } from "react-redux";
import { HiMiniUsers } from "react-icons/hi2";
import { Avatar, Badge, Progress, Spinner, Switch, useToast } from "@chakra-ui/react";
import { FaRegCreditCard, FaUsers, FaUser, FaMoneyBillAlt, FaGamepad, FaLink } from "react-icons/fa";
import { MdOutlineAccountBalance, MdPendingActions } from "react-icons/md";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

import Barchart from "../component/Barchart";
import { fetchGetRequest } from "../api/api";
import { retrieveUserDetails } from "../redux/middleware/localstorageconfig";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import bankIcon from '../assets/bank.png'

import {
  getAdminFailure,
  getAdminRequest,
  getAdminSuccess,
} from "../redux/auth-redux/actions";
import nouser from "../assets/not.png";
import notbetimg from "../assets/notbet.png";

import { useNavigate } from "react-router-dom";
import { convertToUniversalTime, formatDate, getGameProvider } from "../../utils/utils";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import DashboardSkeleton from "../component/loading/DashboardSkeleton";
import { GiDiamondTrophy } from "react-icons/gi";

import QuickPaymentModal from "../Modals/QuickPaymentModal";
import AddNewUser from "../Modals/AddNewUser";
import AddBalance from "../component/usermanageComponent/AddBalance";
import SubtractBalance from "../component/usermanageComponent/SubtractBalance";

const ValueCounter = ({ value }) => {
  const spring = useSpring(0, { mass: 1, stiffness: 45, damping: 30 });
  const display = useTransform(spring, (current) => current.toFixed(2));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span className="premium-number">{display}</motion.span>;
};

const Home = () => {
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
  const navigate = useNavigate();
  const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};
  const getAdminDetails = JSON.parse(localStorage.getItem("adminauth"));

  const adminLayer = user.adminLayer;
  const [loading, setLoading] = useState(false);
  const [graphDeposit, setGraphDeposit] = useState([]);
  const [graphWithdraw, setGraphWithDraw] = useState([]);
  const [graphLabels, setGraphLabels] = useState([]);
  const [filteredTotals, setFilteredTotals] = useState({ deposit: 0, withdrawal: 0 });
  const [allUserData, setAllUserData] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [newUserData, setNewUsers] = useState([]);
  const [transactionData, setAllTransaction] = useState([]);
  const toast = useToast();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [adminPldata, setAdminPlData] = useState({});
  const [adminPlLoading, setAdminPlLoading] = useState(false);
  const [casinoBetData, setCasinoBetData] = useState([])
  const [casinoBetloading, setCasinoBetLoading] = useState(false)
  const [dateCategory, setDateCategory] = useState('day')
  const [adminDetailsCount, setAdminDetailsCount] = useState({})
  const [ggrData, setGGRData] = useState({})
  const [ggrDataLoading, setggrDataLoading] = useState(false)
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [cardRefreshLoading, setCardRefreshLoading] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentTargetUser, setPaymentTargetUser] = useState(null);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const getShortcuts = async () => {
    try {
      let url = `${import.meta.env.VITE_API_URL}/api/admin/get-shortcuts`;
      let response = await fetchGetRequest(url);
      setShortcuts(response.data?.filter(s => s.status) || []);
    } catch (error) {
      console.log("Error fetching shortcuts", error);
    }
  };

  const getIcon = (iconName) => {
    const icons = {
      FaUser: <FaUser />,
      FaMoneyBillAlt: <FaMoneyBillAlt />,
      VscGraph: <VscGraph />,
      IoSettings: <IoSettings />,
      FaGamepad: <FaGamepad />,
      BsBank2: <BsBank2 />,
      FaLink: <FaLink />
    };
    return icons[iconName] || <FaLink />;
  };

  const { selectedWebsite, siteDetails } = useSelector(
    (state) => state.websiteReducer
  );
  let filteredSite = siteDetails.filter((item) => item.selected === true);

  if (!getAdminDetails || !getAdminDetails.token) {
    navigate("/login");
    return
  }
  const dispatch = useDispatch();
  const [adminCount, setAdminCount] = useState({});

  const getAllAdmin = async () => {
    setLoading(true);
    let url = `${import.meta.env.VITE_API_URL}/api/admin/get-all-admin`;

    try {
      let response = await fetchGetRequest(url);
      const data = response.data;
      const receivedData = response.data;
      setAdminCount(response.additionalCounts);
      setAdminDetailsCount(response.adminDetailsCount)
      setLoading(false);
    } catch (error) {
      // toast({
      //   description: `${error?.data?.message}`,
      //   status: "error",
      //   duration: 4000,
      //   position: "top",
      //   isClosable: true,
      // });
      console.log(error);
      setLoading(false);
    }
  };
  const getGraphDetails = async () => {
    setLoading(true);
    let url = `${import.meta.env.VITE_API_URL
      }/api/transaction/get-all-transaction-amount-for-graph?time_frame=${dateCategory}`;

    if (fromDate && toDate) {
      url += `&start_date=${fromDate}&end_date=${toDate}`;
    }

    try {
      let response = await fetchGetRequest(url);
      setGraphDeposit(response?.deposits || []);
      setGraphWithDraw(response?.withdrawals || []);
      setGraphLabels(response?.labels || []);
      setFilteredTotals({
        deposit: response?.totalDeposit || 0,
        withdrawal: response?.totalWithdrawal || 0
      });
      setLoading(false);
    } catch (error) {
      toast({
        description: error?.message || error?.data?.message,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
    }
  };
  const getAllUser = async () => {
    setUserLoading(true);
    let url = `${import.meta.env.VITE_API_URL}/api/admin/get-all-user`;

    try {
      let response = await fetchGetRequest(url);
      const data = response.data;
      const receivedData = response.data;
      setAllUserData(receivedData);

      setUserLoading(false);
    } catch (error) {
      toast({
        description: `${error?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      console.log(error);
      setUserLoading(false);
    }
  };
  const getTransactionDetails = async () => {
    setLoading(true);
    let url = `${import.meta.env.VITE_API_URL
      }/api/transaction/get-all-transaction?transaction_type=all&user_type=all&page=1&limit=20`;

    try {
      let response = await fetchGetRequest(url);
      setAllTransaction(response.data);
      setLoading(false);
    } catch (error) {
      toast({
        description: error?.message || error?.data?.message,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      console.log(error);
      setLoading(false);
    }
  };

  const getCasinoBetHistory = async () => {
    setCasinoBetLoading(true);
    let url = `${import.meta.env.VITE_API_URL}/api/bet/get-all-bet?status=all&limit=20`;
    try {
      let response = await fetchGetRequest(url);
      const data = response.data;
      const receivedData = response.data;
      setCasinoBetData(receivedData);
      setCasinoBetLoading(false);
    } catch (error) {
      toast({
        description: `${error?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      console.log(error);
      setCasinoBetLoading(false);
    }
  };
  const getGGRReport = async () => {
    setggrDataLoading(true)
    const formattedFromDate = fromDate
      ? new Date(fromDate).toISOString().split("T")[0]
      : "";
    const formattedToDate = toDate
      ? new Date(toDate).toISOString().split("T")[0]
      : "";
    let url = `${import.meta.env.VITE_API_URL
      }/api/bet/get-data-overview?`;

    if (formattedFromDate && formattedToDate) {
      url += `start_date=${formattedFromDate}&end_date=${formattedToDate}`;
    }
    else {
      url += `&filter=${dateCategory}`
    }

    try {
      let response = await fetchGetRequest(url);
      if (response) {
        setGGRData(response);
      }
      setggrDataLoading(false)

    } catch (error) {
      toast({
        description: `${error?.data?.message || error?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      console.log(error);
    }
    setggrDataLoading(false)

  };

  useEffect(() => {
    getAllAdmin();
    getGraphDetails();
    getCasinoBetHistory()
    getAllUser();
    getGGRReport();
    getTransactionDetails();
    getShortcuts();
  }, []);

  useEffect(() => {
    getGGRReport();
    getGraphDetails();
  }, [dateCategory, toDate]);

  const getAdmin = async () => {
    setRefreshLoading(true);
    dispatch(getAdminRequest());
    let url = `${import.meta.env.VITE_API_URL}/api/admin/get-single-admin/${adminData.admin_id
      }`;
    try {
      let adminData = await fetchGetRequest(url);
      dispatch(getAdminSuccess(adminData.data));
    } catch (error) {
      console.log(error, "erororo");
      dispatch(getAdminFailure(error?.message));
    } finally {
      setRefreshLoading(false);
    }
  };

  const getAdminPlDetails = async () => {
    setCardRefreshLoading(true);
    let url = `${import.meta.env.VITE_API_URL
      }/api/transaction/get-admin-pl-details`;

    try {
      let response = await fetchGetRequest(url);
      setAdminPlData(response);

      setCardRefreshLoading(false);
    } catch (error) {
      toast({
        description: error?.message || error?.data?.message,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      console.log(error);
      setCardRefreshLoading(false);
    } finally {
      setCardRefreshLoading(false);
    }
  };
  //   const getTotalWager = async () => {
  //     let url = `${
  //       import.meta.env.VITE_API_URL
  //     }/api/user/get-total-wager`;
  //     try {
  //       let response = await fetchGetRequest(url);
  // console.log(response,"wager response")


  //     } catch (error) {
  //       toast({
  //         description: error?.message || error?.data?.message,
  //         status: "error",
  //         duration: 4000,
  //         position: "top",
  //         isClosable: true,
  //       });
  //       console.log(error);
  //     }
  //   };

  useEffect(() => {
    getAdmin();
    getAdminPlDetails();
    // getTotalWager()
  }, []);

  useEffect(() => {
    const newUsersData = allUserData.filter((user) =>
      isNewUser(user.joined_at)
    );
    setNewUsers(newUsersData);
  }, [allUserData]);

  const isNewUser = (joinedAt) => {
    const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const joinedDate = new Date(joinedAt);
    const currentDate = new Date();
    return currentDate - joinedDate <= twentyFourHoursInMilliseconds;
  };

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  const handleSetCatgory = (e) => {
    setDateCategory(e.target.value)
    setFromDate('')
    // setToDateDate('')
  }


  const data = Object.entries(adminCount).filter(([name]) => name !== 'totalAdminCount').map(([name, value]) => ({ name, value }));

  const currentTime = new Date();
  // Calculate the time 24 hours ago
  const twentyFourHoursAgo = new Date(currentTime.getTime() - (24 * 60 * 60 * 1000));

  // Filter the data based on the condition that BetTime is within the last 24 hours
  const filteredData = casinoBetData.filter(item => {
    // Convert BetTime string to a Date object
    const betTime = new Date(item.BetTime);
    // Check if BetTime is greater than or equal to twentyFourHoursAgo and less than or equal to currentTime
    return betTime >= twentyFourHoursAgo && betTime <= currentTime;
  });




  return (
    <div className="sm:px-2  mb-5">
      <div className="relative">
        <div
          style={{ backgroundColor: bg }}
          className={`w-[100%] h-[200px] rounded-[8px]`}
        ></div>
        <div className="overflow-scroll -mt-20 px-5  flex gap-4 justify-between   ">
          <div className=" absolute top-8 flex justify-between w-[100%] text-white text-xl">
            <div>
              <p className="font-bold ">{t('Hello')} {adminData.username}</p>
              {/* <p className="font-semibold ">{filteredSite[0]?.site_name}</p> */}
              <p className="font-semibold ">LuckyDaddy</p>

            </div>
            <div className="font-bold flex items-center gap-4 text-3xl pr-12 ">
              <div className="flex items-center gap-1 relative">
                <img src={bankIcon} alt="" className=" h-[35px] w-[35px]" />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className={`premium-number ${refreshLoading ? "opacity-70" : ""} transition-all duration-300`}>
                      <ValueCounter value={adminData?.amount || 0} />
                    </span>
                    <span className="premium-currency text-sm opacity-80 tracking-tighter self-end mb-1">
                      {adminData?.currency}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={getAdmin}
                disabled={refreshLoading}
                className={`h-[45px] w-[45px] flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-lg ${refreshLoading ? 'cursor-not-allowed opacity-80' : 'cursor-pointer hover:scale-110 active:scale-95'}`}
                title={t('Refresh Balance')}
              >
                <motion.div
                  animate={{ rotate: refreshLoading ? 360 : 0 }}
                  transition={{ repeat: refreshLoading ? Infinity : 0, duration: 1, ease: "linear" }}
                  className="flex items-center justify-center"
                >
                  <FiRefreshCw className="text-xl text-white" />
                </motion.div>
              </button>
            </div>
          </div>
          <div className=" flex gap-3">
            {Object.entries(adminCount).map(([key, value], index) => {
              if (key !== "ownerAdminCount") {
                return (
                  <div key={index} className="  p-[1px]  rounded-lg">
                    <div
                      className="flex    bg-white  rounded-lg  p-2 items-center gap-3"
                    >
                      <div
                        style={{ border: `1px solid ${border}` }}
                        className={`rounded-[100%] h-[70px] w-[70px] flex justify-center items-center `}
                      >
                        <HiMiniUsers
                          style={{ color: iconColor }}
                          fontSize="40px"
                        />
                      </div>
                      <div className="min-w-[120px] flex flex-col gap-2 text-center">
                        <p className="text-sm font-semibold">{t(key)}</p>
                        <p className="text-sm font-bold">{value}</p>
                      </div>
                    </div>
                  </div>
                );
              }
            })}

            {Object.entries(adminDetailsCount).filter(([name]) => name !== 'activeAdminCount').map(([key, value], index) => {
              if (key !== "ownerAdminCount") {
                return (
                  <div key={index} className="  p-[1px]  rounded-lg">
                    <div
                      className="flex    bg-white  rounded-lg  p-2 items-center gap-3"
                    >
                      <div
                        style={{ border: `1px solid ${border}` }}
                        className={`rounded-[100%] h-[70px] w-[70px] flex justify-center items-center `}
                      >
                        <HiMiniUsers
                          style={{ color: iconColor }}
                          fontSize="40px"
                        />
                      </div>
                      <div className="min-w-[120px] flex flex-col gap-2 text-center">
                        <p className="text-sm font-semibold">{t(key)}</p>
                        <p className="text-sm font-bold">{value}</p>
                      </div>
                    </div>
                  </div>
                );
              }
            })}

          </div>

        </div>
      </div>

      {/* QUICK LINKS SECTION */}
      {shortcuts.length > 0 && (
        <div className="mt-6 mb-4 px-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2">
              <span className="p-1.5 rounded-lg" style={{ backgroundColor: `${iconColor}20`, color: iconColor }}>
                <BsFillRocketTakeoffFill size={18} />
              </span>
              {t('Quick')} {t('Access')}
            </h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar -mx-2 px-2 snap-x">
            {/* Quick Payment Static Button */}
            <div
              onClick={() => setPaymentModalOpen(true)}
              className="min-w-[140px] md:min-w-[170px] snap-center cursor-pointer group bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300"
              style={{ borderBottom: `3px solid ${iconColor}` }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-sm group-hover:bg-white group-hover:scale-110 transition-all duration-300"
                style={{ backgroundColor: `${iconColor}10`, color: iconColor }}
              >
                <RiExchangeDollarFill />
              </div>
              <span className="font-bold text-gray-700 text-sm text-center group-hover:text-gray-900 line-clamp-2">
                {t('Quick')} {t('Payment')}
              </span>
            </div>

            {/* Quick Access Add User Card */}
            <AddNewUser
              variant="card"
              setAllUserData={setAllUserData}
              allUserData={allUserData}
            />

            {shortcuts.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(item.path)}
                className="min-w-[140px] md:min-w-[170px] snap-center cursor-pointer group bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300"
                style={{ borderBottom: `3px solid ${iconColor}` }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-sm group-hover:bg-white group-hover:scale-110 transition-all duration-300"
                  style={{ backgroundColor: `${iconColor}10`, color: iconColor }}
                >
                  {getIcon(item.icon)}
                </div>
                <span className="font-bold text-gray-700 text-sm text-center group-hover:text-gray-900 line-clamp-2">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {adminData?.role_type === "owneradmin" && (
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 p-6 mt-8 rounded-2xl shadow-xl border border-white/5">
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <p className="font-black text-xl text-white tracking-tight italic uppercase drop-shadow-md">
                {t(`Live`)} {t(`Overview`)}
              </p>
              <Badge colorScheme="indigo" variant="solid" px={3} py={1} borderRadius="full" fontSize="10px">
                OWNER ADMIN PORTAL
              </Badge>
            </div>

            <div className="flex mt-8 flex-col sm:flex-row justify-between items-center gap-6">
              <select onChange={(e) => handleSetCatgory(e)} style={{ border: `1px solid ${border}` }} className="outline-none p-1 w-[150px] rounded-lg">
                {/* <option value={""}>{t(`select`)}</option> */}

                <option value="day">{t(`day`)}</option>
                <option value="week">{t(`week`)}</option>
                <option value="this_month">{t(`this`)} {t(`month`)}</option>
                <option value="last_month">{t(`Last`)} {(`month`)}</option>


              </select>
              <p style={{ backgroundColor: bg }} className="font-bold border px-4 min-w-[100px] rounded-lg p-1 text-white text-sm">{t(`GGR`)} : <span className="text-sm">{ggrData?.gameGGR}</span></p>
              <div className="flex gap-2  items-center">
                <div className="flex  items-center gap-2">
                  <p className="text-white">{t(`From`)}</p>
                  <input
                    type="date"
                    style={{ border: `1px solid ${border}` }}
                    // min={today}
                    className={` outline-none  rounded px-3 text-xs py-1`}
                    value={fromDate}
                    onChange={handleFromDateChange}
                  />
                </div>
                <div className="flex  items-center ml-2 gap-2">
                  <p className="text-white">{t(`to`)}</p>
                  <input
                    type="date"
                    style={{ border: `1px solid ${border}` }}
                    // min={today}
                    className={` ml-2 outline-none rounded px-3 py-1 text-xs `}
                    value={toDate}
                    onChange={handleToDateChange}
                  />
                </div>
              </div>
            </div>



          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 justify-between items-center gap-3 mt-6">
            <div style={{ border: `1px solid ${border}`, backgroundColor: "white" }} className="flex pr-5 p-1 px-2 w-[100%] items-center justify-between font-bold rounded-lg   ">
              <div>
                {ggrDataLoading ? <LoadingSpinner /> : ggrData?.approvedWithdrawAmount?.toFixed(2)}
                <p className="font-medium text-gray-500 text-[10px]">{t(`Withdrawal`)} {t(`Amount`)}</p>
              </div>

              <RiBankFill color={iconColor} fontSize={"25px"} />
            </div>

            <div style={{ border: `1px solid ${border}`, backgroundColor: "white" }} className="flex pr-5 p-1 px-2 w-[100%] items-center justify-between font-bold rounded-lg   ">
              <div>
                {ggrDataLoading ? <LoadingSpinner /> : ggrData?.depositAmount?.toFixed(2)}
                <p className="font-medium text-gray-500 text-[10px]">{t(`Deposit`)} {t(`Amount`)}</p>
              </div>


              <TbMoneybag color={iconColor} fontSize={'25px'} />
            </div>

            <div style={{ border: `1px solid ${border}`, backgroundColor: "white" }} className="flex pr-5 p-1 px-2 w-[100%] items-center justify-between font-bold rounded-lg   ">

              <div>
                {ggrDataLoading ? <LoadingSpinner /> : ggrData?.userAmount?.toFixed(2)}
                <p className="font-medium text-gray-500 text-[10px]">{t(`User`)} {t(`Amount`)}</p>

              </div>
              <FaUsers color={iconColor} fontSize={'25px'} />
            </div>
            <div style={{ border: `1px solid ${border}`, backgroundColor: "white" }} className="flex pr-5 p-1 px-2 w-[100%] items-center justify-between font-bold rounded-lg   ">

              <div>
                {ggrDataLoading ? <LoadingSpinner /> : ggrData?.winsAmount?.toFixed(2)}
                <p className="font-medium text-gray-500 text-[10px]">{t(`Wins`)} {t(`Amount`)}</p>

              </div>


              <GiDiamondTrophy color={iconColor} fontSize={'25px'} />
            </div>
            <div style={{ border: `1px solid ${border}`, backgroundColor: "white" }} className="flex pr-5 p-1 px-2 w-[100%] items-center justify-between font-bold rounded-lg   ">


              <div>
                {ggrDataLoading ? <LoadingSpinner /> : ggrData?.depositCount}
                <p className="font-medium text-gray-500 text-[10px]">{t(`Deposit`)} {t(`Count`)}</p>
              </div>

              <RiNumbersFill color={iconColor} fontSize={'25px'} />
            </div>
            <div style={{ border: `1px solid ${border}`, backgroundColor: "white" }} className="flex pr-5 p-1 px-2 w-[100%] items-center justify-between font-bold rounded-lg   ">
              <div>
                {ggrDataLoading ? <LoadingSpinner /> : ggrData?.pendingWithdrawAmount?.toFixed(2)}
                <p className="font-medium text-gray-500 text-[10px]">{t(`Pending`)} {t(`Withdraw`)} {t(`Amount`)}</p>
              </div>
              <MdPendingActions color={iconColor} fontSize={'25px'} />

            </div>

          </div>
        </div>
      )}
      <div className="flex mt-8 gap-8 flex-col lg:flex-row w-full items-start px-1">
        {/* Left Column: Graphs and Lists */}
        <div className="w-full lg:w-[65%] flex flex-col gap-6">
          <div className="w-full pt-5 px-4 bg-white rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
            {/* Header: Filters & Date Range */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              {/* Timeframe Buttons */}
              <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                {['day', 'week', 'month'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setDateCategory(cat); setFromDate(''); setToDate(''); }}
                    style={{
                      backgroundColor: dateCategory === cat ? (bg === 'white' ? 'black' : bg) : 'transparent',
                      color: dateCategory === cat ? 'white' : 'gray',
                    }}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 capitalize ${dateCategory === cat ? 'shadow-sm' : 'hover:text-gray-800'}`}
                  >
                    {t(cat)}
                  </button>
                ))}
              </div>

              {/* Date Range Picker */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                  <span className="text-xs font-semibold text-gray-500 uppercase">{t('From')}</span>
                  <input
                    type="date"
                    className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 cursor-pointer"
                    value={fromDate}
                    onChange={handleFromDateChange}
                  />
                </div>
                <span className="text-gray-400 font-medium">-</span>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                  <span className="text-xs font-semibold text-gray-500 uppercase">{t('To')}</span>
                  <input
                    type="date"
                    className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 cursor-pointer"
                    value={toDate}
                    onChange={handleToDateChange}
                  />
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="relative overflow-hidden p-5 rounded-2xl bg-green-50 border border-green-100 transition-transform hover:scale-[1.01] duration-300">
                <div className="flex justify-between items-start z-10 relative">
                  <div>
                    <p className="text-xs font-bold text-green-600 uppercase tracking-widest opacity-80 mb-1">{t('Total Deposit')}</p>
                    <h3 className="text-3xl font-extrabold text-green-700">₹{filteredTotals.deposit?.toLocaleString()}</h3>
                  </div>
                  <div className="p-3 bg-white bg-opacity-60 rounded-xl shadow-sm">
                    <RiLuggageDepositLine className="text-3xl text-green-600" />
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden p-5 rounded-2xl bg-red-50 border border-red-100 transition-transform hover:scale-[1.01] duration-300">
                <div className="flex justify-between items-start z-10 relative">
                  <div>
                    <p className="text-xs font-bold text-red-600 uppercase tracking-widest opacity-80 mb-1">{t('Total Withdrawal')}</p>
                    <h3 className="text-3xl font-extrabold text-red-700">₹{filteredTotals.withdrawal?.toLocaleString()}</h3>
                  </div>
                  <div className="p-3 bg-white bg-opacity-60 rounded-xl shadow-sm">
                    <RiBankFill className="text-3xl text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Section */}
            <div className="w-full">
              <div className="text-center mb-4">
                <h2 className="text-lg font-bold text-gray-700">{t('Transaction')} {t('Details')}</h2>
              </div>
              <Barchart
                title=""
                width={"100%"}
                id="first"
                height={"400px"}
                type="bar"
                deposits={graphDeposit}
                withdrawals={graphWithdraw}
                labels={graphLabels}
              />
            </div>
          </div>

          {/* recetnlr user added */}
          <div className={` bg-white pb-6 rounded-[12px] mt-2  `}>
            <div className="h-[100%] rounded-[16px] px-4  pt-4 w-[100%]  ">
              {loading && (
                <Progress size="xs" isIndeterminate colorScheme="#e91e63" />
              )}
              <div className="flex justify-between items-center pb-2 border-b border-gray-100 mb-2">
                <div className="">
                  <p className="text-lg font-bold text-gray-800 tracking-tight flex items-center gap-2">
                    <span className="p-2 rounded-full bg-gray-50 border border-gray-100">
                      <RiUserAddLine style={{ color: iconColor }} className="text-xl" />
                    </span>
                    {t(`New`)} {t(`Registered`)} {t(`Members`)} <span className="text-sm font-medium text-gray-400">({t(`Last`)} 24 {t(`Hours`)})</span>
                  </p>
                </div>
              </div>

              <div
                className={`flex items-center   overflow-scroll h-[340px] pb-5 mt-3 flex-col gap-3`}
              >
                {userLoading ? (
                  <DashboardSkeleton type="user" count={5} />
                ) : newUserData.length > 0 ? (
                  newUserData?.map((item) => {
                    const timePart = item.joined_at.split(' ')[1];
                    const seccondPart = item.joined_at.split(' ')[2]
                    const time12Hour = `${timePart} ${seccondPart}`;
                    const time24Hour = convertToUniversalTime(time12Hour);
                    return (
                      <div
                        style={{ border: `1px solid ${border}`, transition: 'all 0.3s ease' }}
                        key={item._id || item.id}
                        className={` rounded-[12px] w-[100%] hover:shadow-md group bg-white`}
                      >
                        <div className="rounded-[12px] flex justify-between items-center gap-4 p-3 w-[100%]">
                          <div className="flex items-center flex-1 min-w-[150px] gap-3">
                            <Avatar
                              size="md"
                              name={item.username}
                              src={item.profile_picture || "https://bit.ly/dan-abramov"}
                              border={`2px solid ${border}`}
                            />
                            <div className="flex flex-col">
                              <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                {item.username}
                              </p>
                              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                                {item.role_type || 'User'}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-1 justify-center items-center flex-col gap-1 border-x border-gray-50 px-2">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight flex items-center gap-1">
                              <BiSolidWalletAlt style={{ color: iconColor }} />
                              {t(`Balance`)}
                            </p>
                            <p className="text-sm font-extrabold text-gray-700">
                              {item?.amount?.toFixed(2)}
                              <span className="text-[10px] ml-1 text-gray-400 font-bold">
                                {adminData?.currency}
                              </span>
                            </p>
                          </div>

                          <div className="hidden md:flex flex-1 justify-center items-center flex-col gap-1 border-r border-gray-50 px-2">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight flex items-center gap-1">
                              <BsCalendarDateFill style={{ color: iconColor }} />
                              {t(`Joined`)}
                            </p>
                            <div className="text-center">
                              <p className="text-[11px] font-bold text-gray-700">
                                {formatDate(item.joined_at.split(" ")[0])}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                {time24Hour}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-3 px-2">
                            <button
                              onClick={() => navigate(`/usermanage/${item.username}`)}
                              className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm"
                              title="View Details"
                            >
                              <RiEyeLine fontSize="20px" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center h-[100%] justify-center gap-1">
                    <img
                      src={nouser}
                      className="w-[100px]  rounded-lg"
                      alt=""
                    />
                    <p
                      style={{ color: iconColor }}
                      className="font-semibold text-sm"
                    >
                      {t(`No`)} {t(`New`)} {t(`User`)} {t(`Found`)}!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* recentl bets added */}

          <div
            className={`h-[100%] rounded-[16px] bg-white p-3   w-[100%]  mt-2 `}
          >
            {loading && (
              <Progress size="xs" isIndeterminate colorScheme="#e91e63" />
            )}
            <div className="pb-2 border-b border-gray-100 mb-2 pt-2">
              <p className="text-lg font-bold text-gray-800 tracking-tight flex items-center gap-2">
                <span className="p-2 rounded-full bg-gray-50 border border-gray-100">
                  <RiGameLine style={{ color: iconColor }} className="text-xl" />
                </span>
                {t(`Recently`)} {t(`Bet`)} {t(`Placed`)} <span className="text-sm font-medium text-gray-400">({t(`Last`)} 24 {t(`Hours`)})</span>
              </p>
            </div>
            {casinoBetloading ? (
              <div className="h-[420px] overflow-y-auto pr-2 mt-4 custom-scrollbar">
                <DashboardSkeleton type="bet" count={3} />
              </div>
            ) : filteredData.length !== 0 ? (
              <div className="h-[420px] overflow-y-auto pr-2 mt-4 custom-scrollbar">
                <BetCards data={filteredData} border={border} iconColor={iconColor} />
                {/* Legacy Table Bypassed */}
                {false && (
                  <table className={`w-[100%] mt-5`}>
                    <tr
                      style={{ borderBottom: `1px solid ${border}` }}
                      className={`text-center p-2 rounded-md   h-[30px]  text-[10px] font-bold `}
                    >
                      <th className="text-left">{t(`Username`)} / {t(`User`)} {t(`id`)}</th>
                      <th>{t(`Bet`)} {t(`Placed`)}</th>
                      <th className=" ">{t(`Provider`)} {t(`Name`)}</th>
                      <th className=" ">{t(`Game`)} {t(`Name`)}</th>
                      <th >{t(`Amount`)}</th>

                      <th>{t(`Win`)}/{t(`Loss`)}</th>
                      <th className="text-right ">Result</th>
                      {/* <th className="text-right">Settelment</th> */}
                    </tr>
                    <tbody className=" text-xs">
                      {filteredData &&
                        filteredData.map((item) => {

                          return (
                            <tr
                              key={item?._id}
                              style={{ borderBottom: `1px solid ${border}`, transition: 'all 0.2s ease' }}
                              className={`text-center h-[70px] m-auto text-xs hover:bg-gray-50/50 group`}
                            >
                              <td className="pl-2">
                                <div className="flex text-left flex-col gap-0.5">
                                  <p className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                    {item?.Username}
                                  </p>
                                  <p className="text-[10px] text-gray-400 font-medium">
                                    ID: {item?.UserId}
                                  </p>
                                </div>
                              </td>

                              <td className="text-gray-600 font-medium">
                                {formatDate(item?.BetTime?.split(" ")[0])}
                              </td>

                              <td className="">
                                <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 font-bold text-[10px] uppercase tracking-wider">
                                  {item?.Provider}
                                </span>
                              </td>
                              <td className="text-gray-700 font-semibold italic text-[11px]">
                                {item?.GameName?.slice(0, 20) || "N/A"}
                              </td>
                              <td className="">
                                <div className="flex items-center justify-center">
                                  <span className="font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs shadow-sm">
                                    {item.Amount?.toFixed(2)}
                                  </span>
                                </div>
                              </td>

                              <td
                                className={`font-black text-sm ${item?.Status == "running"
                                  ? "text-orange-400"
                                  : item.WinLoss !== "0"
                                    ? "text-emerald-600"
                                    : "text-rose-600"
                                  }`}
                              >
                                {item.Status !== "running" && (
                                  <span className="mr-0.5">
                                    {item.WinLoss !== "0" ? "+" : "-"}
                                  </span>
                                )}
                                {item.Status == "running"
                                  ? "0"
                                  : item.WinLoss !== "0"
                                    ? item.WinLoss
                                    : item.Amount?.toFixed(2)}
                              </td>
                              <td className="pr-2">
                                <div className="flex justify-end items-center">
                                  <Badge
                                    variant="subtle"
                                    px={3}
                                    py={1}
                                    borderRadius="full"
                                    fontSize="10px"
                                    fontWeight="bold"
                                    textTransform="uppercase"
                                    colorScheme={
                                      item.Status == "running"
                                        ? "orange"
                                        : item?.WinLoss !== "0"
                                          ? "green"
                                          : "red"
                                    }
                                    className="shadow-sm"
                                  >
                                    {item.Status == "running"
                                      ? "Pending"
                                      : item.WinLoss !== "0"
                                        ? "Win"
                                        : "Loss"}
                                  </Badge>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center min-h-[310px] justify-center gap-1">
                <img
                  src={notbetimg}
                  className="w-[100px]  rounded-lg"
                  alt=""
                />
                <p
                  style={{ color: iconColor }}
                  className="font-semibold mt-3 text-sm"
                >
                  {t(`Recent`)} {t(`Bet`)} {t(`Not`)} {t(`Found`)}!
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-[33%] flex flex-col gap-6">
          {/* card */}
          {/* Admin Card */}
          <div className="w-full border relative shadow-2xl bg-white rounded-2xl overflow-hidden pb-6 border-gray-100">
            <img src={d2} alt="" className="w-full rounded-2xl h-[310px] object-cover" />
            <div className="absolute inset-x-2 top-7 bg-indigo-950/40 backdrop-blur-xl flex flex-col justify-between z-[1] rounded-3xl p-6 h-[240px] border border-white/20 shadow-2xl">
              <div className="w-full flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <p className="text-3xl font-black text-white italic tracking-tighter">
                    {t(adminData?.role_type)}
                  </p>
                  <p className="text-xs font-bold text-indigo-100 uppercase tracking-widest opacity-80">
                    {t(`Profit`)} {t(`By`)} {t(`User`)}
                  </p>
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
              <div className="flex justify-center items-center mt-2 w-full gap-3">
                <p className={` ${adminPldata?.totalPL > 0
                  ? "text-emerald-400"
                  : "text-rose-400"
                  } flex font-black items-center gap-2 text-4xl tracking-tighter drop-shadow-lg`}>

                  {adminPldata?.totalPL > 0 ? "+" : "-"}
                  <span className="premium-number">
                    <ValueCounter value={Math.abs(adminPldata?.totalPL || 0)} />
                  </span>
                  <span className="premium-currency text-xl text-white/70">{adminData?.currency}</span>
                </p>

                <button
                  onClick={getAdminPlDetails}
                  disabled={cardRefreshLoading}
                  className={`h-[35px] w-[35px] flex items-center justify-center rounded-lg bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-lg ${cardRefreshLoading ? 'cursor-not-allowed opacity-80' : 'cursor-pointer hover:scale-110 active:scale-95'}`}
                  title={t('Refresh Profit')}
                >
                  <motion.div
                    animate={{ rotate: cardRefreshLoading ? 360 : 0 }}
                    transition={{ repeat: cardRefreshLoading ? Infinity : 0, duration: 1, ease: "linear" }}
                    className="flex items-center justify-center"
                  >
                    <FiRefreshCw className="text-lg text-white" />
                  </motion.div>
                </button>
              </div>
              <div className="flex justify-between w-[100%] px-1">
                <div className="flex flex-col ">
                  <p className="text-xs font-semibold text-white"> {t(`Username`)}</p>
                  <p className="text-[17px] font-medium text-white">
                    {" "}
                    {adminData?.username}
                  </p>
                </div>
                <div className="flex flex-col ">
                  <p className="text-xs font-semibold text-white"> {t(`LayerName`)}</p>
                  <p className="text-[16px] font-semibold text-white">
                    {" "}
                    {t(adminData?.role_type)}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-[100%]  mt-3  p-2">
              <div className="flex gap-10 px-3 items-center w-[100%]">
                <div className="flex gap-2">
                  <span className="rounded-[6px] bg-purple-200 h-[35px] w-[35px] flex items-center justify-center">
                    <img src={deposit} alt="" className="w-[20px]" />
                  </span>
                  <div className="flex flex-col items-start">
                    <p className="text-sm font-bold ">
                      {adminPldata?.totalDepositAmount?.toFixed(2)}{" "}
                      <span className="font-semibold text-xs">
                        {adminData?.currency}
                      </span>
                    </p>
                    <p className="text-xs font-medium ">{(`Total`)} {t(`Deposit`)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="rounded-[6px] bg-green-200 h-[35px] w-[35px] flex items-center justify-center">
                    <img src={withdraw} alt="" className="w-[20px]" />
                  </span>
                  <div className="flex flex-col items-start">
                    <p className="text-sm font-bold ">
                      {adminPldata?.totalWithdrawAmount?.toFixed(2)}{" "}
                      <span className="font-semibold text-xs">
                        {adminData?.currency}
                      </span>
                    </p>

                    <p className="text-xs font-medium ">{(`Total`)} {t(`Withdraw`)}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-10 mt-6 px-3 justify-between items-center w-[100%]">
                <div className="flex gap-2">
                  <span className="rounded-[6px] bg-purple-200 h-[35px] w-[35px] flex items-center justify-center">
                    <img src={icon} alt="" className="w-[20px]" />
                  </span>
                  <div className="flex flex-col items-start">
                    <p className="text-sm font-bold ">
                      {adminPldata?.pendingDepositAmount?.toFixed(2)}
                    </p>
                    <p className="text-xs font-medium ">{t(`Pending`)} {t(`Deposit`)}</p>
                  </div>
                </div>
                {/* <div className="flex items-center font-bold text-2xl gap-2">
                  <span>P/L</span>
                  <p
                    className={`font-medium ${
                      adminPldata?.totalPL > 0
                        ? "text-green-500"
                        : "text-red-400"
                    } text-xl`}
                  >
                    {adminPldata?.totalPL > 0 ? "+" : "-"}{" "}
                    {adminPldata?.totalPL?.toFixed(2)}{" "}
                    <span className="font-semibold text-xs">
                      {adminData?.currency}
                    </span>
                  </p>
                </div> */}
              </div>

              <div className="flex justify-between px-3 pt-5 gap-5">
                <button
                  onClick={() => navigate("/user-deposit")}
                  className="text-white font-semibold bg-[#2463EB] text-sm p-2 rounded-[6px] w-[100%]"
                >
                  {t(`View`)} {t(`Deposit`)}
                </button>
                <button
                  onClick={() => navigate("/user-withdrawal")}
                  className="text-white font-semibold bg-red-400 text-sm p-2 rounded-[6px] w-[100%]"
                >
                  {t(`View`)} {t(`Withdraw`)}
                </button>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[650px]">
            <div className="p-5 border-b border-gray-100">
              <p className="text-lg font-bold text-gray-800 tracking-tight flex items-center gap-2">
                <span className="p-2 rounded-full bg-gray-50 border border-gray-100">
                  <RiExchangeDollarFill style={{ color: iconColor }} className="text-xl" />
                </span>
                {t(`Recent`)} {t(`Transaction`)}
              </p>
            </div>

            <div className="overflow-y-auto flex-1 p-2 custom-scrollbar">
              <div className="flex flex-col">
                {transactionData.length > 0 ? (
                  transactionData?.map((item) => {
                    const timePart = item.initiated_at.split(' ')[1];
                    const seccondPart = item.initiated_at.split(' ')[2]
                    const time12Hour = `${timePart} ${seccondPart}`;
                    const time24Hour = convertToUniversalTime(time12Hour);
                    const isDeposit = item.type === "deposit";

                    return (
                      <div
                        key={item._id}
                        className="group flex justify-between items-center p-3 mb-1 rounded-lg hover:bg-gray-50 transition-all duration-200 border-b border-gray-50 last:border-none"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm border border-white/10 ${isDeposit ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-rose-50 text-rose-600 group-hover:bg-rose-500 group-hover:text-white'
                            }`}>
                            {isDeposit ? (
                              <RiLuggageDepositLine className="text-2xl" />
                            ) : (
                              <RiBankFill className="text-2xl" />
                            )}
                          </div>

                          <div className="flex flex-col gap-0.5">
                            <p className="text-sm font-bold text-gray-700 group-hover:text-gray-900">
                              {item?.username}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <span>{formatDate(item?.initiated_at.split(" ")[0])}</span>
                              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                              <span>{time24Hour}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className={`text-sm font-bold ${isDeposit ? "text-green-600" : "text-red-500"
                            }`}>
                            {isDeposit ? "+" : "-"} {isDeposit ? item.deposit_amount?.toFixed(2) : item.withdraw_amount?.toFixed(2)}
                            <span className="text-xs ml-1 text-gray-400 font-medium">{adminData?.currency}</span>
                          </p>
                          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                            {isDeposit ? t('Received') : t('Sent')}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                    <div className="bg-gray-50 p-4 rounded-full">
                      <MdOutlineAccountBalance className="text-2xl opacity-50" />
                    </div>
                    <p className="text-sm">No recent transactions</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Layer Overview Chart */}
          {/* Layer Overview Chart */}
          <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="p-5 border-b border-gray-100">
              <p className="text-lg font-bold text-gray-800 tracking-tight flex items-center gap-2">
                <span className="p-2 rounded-full bg-gray-50 border border-gray-100">
                  <RiPieChart2Fill style={{ color: iconColor }} className="text-xl" />
                </span>
                {t(`Layer`)} {t(`Overview`)}
              </p>
            </div>
            <div className="p-5">
              <Barchart
                title=""
                type="pie"
                id="second"
                height={"350px"}
                data={data}
              />
            </div>
          </div>
        </div>
      </div>
      <QuickPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onConfirm={(user, type) => {
          setPaymentTargetUser(user);
          setPaymentModalOpen(false);
          // Small delay to ensure clean transition
          setTimeout(() => {
            if (type === 'deposit') setDepositOpen(true);
            else setWithdrawOpen(true);
          }, 100);
        }}
      />

      {paymentTargetUser && (
        <>
          <AddBalance
            userData={paymentTargetUser}
            title="user"
            getData={() => { }}
            externalIsOpen={depositOpen}
            externalOnClose={() => setDepositOpen(false)}
          />
          <SubtractBalance
            userData={paymentTargetUser}
            title="user"
            getData={() => { }}
            externalIsOpen={withdrawOpen}
            externalOnClose={() => setWithdrawOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default Home;
