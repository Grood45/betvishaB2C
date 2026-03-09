import React, { useEffect, useState } from 'react';
import { AiOutlineHistory, AiOutlineShareAlt, AiOutlineTransaction } from 'react-icons/ai';
import { BiMoneyWithdraw } from 'react-icons/bi';
import { RiLuggageDepositLine, RiCloseLine } from 'react-icons/ri';
import { CgProfile } from "react-icons/cg";
import { Avatar, Badge, Switch, useToast, Progress } from '@chakra-ui/react';
import AddBalance from '../component/usermanageComponent/AddBalance';
import SubtractBalance from '../component/usermanageComponent/SubtractBalance';
import SendMail from '../component/usermanageComponent/SendMail';
import logo from '../assets/logo.png';
import Profile from '../component/usermanageComponent/Profile';
import Deposit from '../component/usermanageComponent/Deposit';
import WithDrawl from '../component/usermanageComponent/WithDrawl';
import Transaction from '../component/usermanageComponent/Transaction';
import BetHistory from '../component/usermanageComponent/BetHistory';
import { useSelector } from 'react-redux';
import Walltet from '../component/usermanageComponent/Walltet';
import Referral from '../component/usermanageComponent/Referral';
import { MdOutlineAccountBalanceWallet } from 'react-icons/md';
import UserBonus from '../component/usermanageComponent/UserBonus';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchGetRequest, sendPatchRequest } from '../api/api';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../../utils/utils';
import SingleLoginHistory from '../component/usermanageComponent/SingleLoginHistory';
import moment from "moment";
import SportBetHistory from '../component/usermanageComponent/SportBetHistory';
import { FaWallet, FaGamepad, FaChartLine, FaExclamationTriangle } from 'react-icons/fa';
import { IoShieldCheckmarkOutline } from 'react-icons/io5';

const SingleUserManage = () => {
  const { color, primaryBg, iconColor, secondaryBg, bg, hoverColor, hover, text, font, border } = useSelector(state => state.theme);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [active, setActive] = useState(1);
  const [userData, setUserData] = useState();
  const [plData, setPlData] = useState({});
  const param = useParams();
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const toast = useToast();
  const [statusLoading, setStatusLoading] = useState(false);

  const data = [
    { id: 1, title: "Profile", icon: <CgProfile size={18} /> },
    { id: 5, title: "Wallet", icon: <MdOutlineAccountBalanceWallet size={18} /> },
    { id: 2, title: "Deposit History", icon: <RiLuggageDepositLine size={18} /> },
    { id: 3, title: "Withdrawal History", icon: <BiMoneyWithdraw size={18} /> },
    { id: 10, title: "Sport Bet History", icon: <AiOutlineHistory size={18} /> },
    { id: 7, title: "Casino Bet History", icon: <AiOutlineHistory size={18} /> },
    { id: 8, title: "Bonus History", icon: <AiOutlineHistory size={18} /> },
    { id: 6, title: "Referral History", icon: <AiOutlineShareAlt size={18} /> },
    { id: 4, title: "Device & IP Logs", icon: <AiOutlineTransaction size={18} /> },
    { id: 9, title: "Login/Logout History", icon: <AiOutlineHistory size={18} /> },
  ];

  const getUserData = async () => {
    setLoading(true);
    let url = `${import.meta.env.VITE_API_URL}/api/admin/get-single-user/${param.id}`;
    try {
      let response = await fetchGetRequest(url);
      setLoading(false);
      const receivedData = response.data;
      if (receivedData) {
        setUserData(receivedData);
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

  const profitLossData = async () => {
    if (!userData || !userData?.user_id) {
      return;
    }
    setLoading1(true);
    let url = `${import.meta.env.VITE_API_URL}/api/transaction/get-transaction-pl/${userData?.user_id}?username=${userData?.username}&type=user`;

    try {
      let response = await fetchGetRequest(url);
      setLoading1(false);
      if (response) {
        setPlData(response);
      }
    } catch (error) {
      setLoading1(false);
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

  useEffect(() => {
    getUserData();
  }, [param.id]);

  useEffect(() => {
    profitLossData();
  }, [userData]);

  const handleActive = (id) => {
    setActive(id);
  };

  const handleStatusChange = async (name) => {
    setStatusLoading(true);
    let url = `${import.meta.env.VITE_API_URL}/api/admin/toggle-user-status/${param.id}`;

    try {
      let response = await sendPatchRequest(url, { name });
      getUserData();

      toast({
        description: `${response.message}`,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setStatusLoading(false);
    } catch (error) {
      toast({
        description: `${error.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      console.log(error);
      setStatusLoading(false);
    }
  };

  if (!userData && loading) {
    return <div className="w-full h-screen flex justify-center items-center bg-gray-50"><p>Loading...</p></div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f7fe] font-sans">

      {/* Top Header */}
      <div className="bg-white px-6 py-4 flex justify-between items-center shadow-sm z-10 sticky top-0 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Avatar size="lg" name={userData?.username} src="https://bit.ly/dan-abramov" bg="blue.500" border="2px solid #e2e8f0" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-bold text-gray-800 tracking-tight leading-none">{userData?.username}</h1>
              {userData?.updated_at && moment().diff(moment(userData.updated_at, "YYYY-MM-DD hh:mm:ss A"), "minutes") < 5 ? (
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>Online
                </span>
              ) : (
                <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>Offline
                </span>
              )}
            </div>
            <p className="text-[13px] text-gray-500 font-medium mt-1">Complete User Profile & Management</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">ID: {userData?.user_id}</span>
              <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{userData?.currency}</span>
            </div>
          </div>
        </div>
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
          <RiCloseLine size={24} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-[260px] bg-white border-r border-gray-100 flex flex-col h-[calc(100vh-84px)] sticky top-[84px] shadow-sm overflow-y-auto">
          <div className="flex-1 py-4">
            {data.map((item) => (
              <div
                key={item.id}
                onClick={() => handleActive(item.id)}
                className={`flex cursor-pointer items-center gap-3 px-6 py-3.5 text-[13px] font-bold transition-all border-l-4 ${active === item.id
                  ? "text-[#2e62ff] bg-[#2e62ff]/5 border-[#2e62ff]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent"
                  }`}
              >
                <div className={`${active === item.id ? "text-[#2e62ff]" : "text-gray-400"}`}>
                  {item.icon}
                </div>
                <span>{item.title}</span>
              </div>
            ))}
          </div>

          <div className="p-5 flex flex-col gap-3 bg-gray-50/50 border-t border-gray-100">
            <AddBalance userData={userData} getData={getUserData} title="user" />
            <SubtractBalance userData={userData} getData={getUserData} title="user" />

            <button className="w-full bg-[#3b82f6] hover:bg-blue-600 text-white font-bold text-[13px] py-3 rounded-xl shadow-sm transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
              <span>Transfer Funds</span>
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto w-full h-[calc(100vh-84px)]">

          {/* Top 4 Cards (Always visible on Profile tab, maybe hide on others? The image shows them on Profile) */}
          {active === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

              <div className="bg-gradient-to-br from-[#3b82f6] to-[#2563eb] rounded-2xl p-5 shadow-lg shadow-blue-500/30 text-white relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 opacity-10 transform group-hover:scale-110 transition-transform duration-300">
                  <FaWallet size={120} />
                </div>
                <div className="flex justify-center mb-3 text-white/90">
                  <MdOutlineAccountBalanceWallet size={28} />
                </div>
                <div className="text-center relative z-10">
                  <h3 className="text-3xl font-black mb-1">₹{userData?.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</h3>
                  <p className="text-xs font-bold text-white/80 uppercase tracking-widest">Main Wallet</p>
                  <p className="text-[10px] text-white/60 mt-1 font-medium">Available Balance</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#10b981] to-[#059669] rounded-2xl p-5 shadow-lg shadow-green-500/30 text-white relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 opacity-10 transform group-hover:scale-110 transition-transform duration-300">
                  <FaChartLine size={120} />
                </div>
                <div className="flex justify-center mb-3 text-white/90">
                  <FaChartLine size={28} />
                </div>
                <div className="text-center relative z-10">
                  <h3 className="text-3xl font-black mb-1">₹{userData?.exposure_limit?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</h3>
                  <p className="text-xs font-bold text-white/80 uppercase tracking-widest">Exposure</p>
                  <p className="text-[10px] text-white/60 mt-1 font-medium">Current Exposure</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] rounded-2xl p-5 shadow-lg shadow-purple-500/30 text-white relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 opacity-10 transform group-hover:scale-110 transition-transform duration-300">
                  <FaChartLine size={120} />
                </div>
                <div className="flex justify-center mb-3 text-white/90">
                  <FaChartLine size={28} />
                </div>
                <div className="text-center relative z-10">
                  <h3 className="text-3xl font-black mb-1">₹{plData?.totalAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</h3>
                  <p className="text-xs font-bold text-white/80 uppercase tracking-widest">P&L</p>
                  <p className="text-[10px] text-white/60 mt-1 font-medium">Profit & Loss</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-2xl p-5 shadow-lg shadow-orange-500/30 text-white relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 opacity-10 transform group-hover:scale-110 transition-transform duration-300">
                  <FaGamepad size={120} />
                </div>
                <div className="flex justify-center mb-3 text-white/90">
                  <FaGamepad size={28} />
                </div>
                <div className="text-center relative z-10">
                  <h3 className="text-3xl font-black mb-1">{plData?.totalBets || '0'}</h3>
                  <p className="text-xs font-bold text-white/80 uppercase tracking-widest">Total Bets</p>
                  <p className="text-[10px] text-white/60 mt-1 font-medium">All Time</p>
                </div>
              </div>

            </div>
          )}

          {/* Account Status / Toggles (Shown alongside profile but moved out of profile tab for structural clarity, or keep it dynamically swapped) */}
          {active === 1 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full pb-8">
              <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-6 w-full">
                <Profile type={"user"} userData={userData} id={param.id} />
              </div>

              {/* Right Side Settings Column for Profile Tab */}
              <div className="lg:col-span-12 xl:col-span-4 flex flex-col gap-6 w-full">

                {/* Account Status Card (Toggles) */}
                <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
                  <h2 className="text-[16px] font-bold text-gray-800 flex items-center gap-2 mb-6">
                    <IoShieldCheckmarkOutline size={20} className="text-gray-600" /> Account Status
                  </h2>

                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <span className="text-[13px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">Account Status</span>
                      <div className="flex items-center gap-2">
                        {userData?.is_blocked ? (
                          <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded uppercase">Blocked</span>
                        ) : (
                          <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded uppercase">Active</span>
                        )}
                        <Switch size="sm" colorScheme="green" isChecked={!userData?.is_blocked} onChange={() => handleStatusChange("is_blocked")} />
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <span className="text-[13px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">Bet Status</span>
                      <div className="flex items-center gap-2">
                        {!userData?.bet_supported ? (
                          <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded uppercase">Suspended</span>
                        ) : (
                          <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded uppercase">Enabled</span>
                        )}
                        <Switch size="sm" colorScheme="green" isChecked={userData?.bet_supported} onChange={() => handleStatusChange("bet_supported")} />
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <span className="text-[13px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">Withdrawal Status</span>
                      <div className="flex items-center gap-2">
                        {userData?.is_withdraw_suspend ? (
                          <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded uppercase">Suspended</span>
                        ) : (
                          <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded uppercase">Enabled</span>
                        )}
                        <Switch size="sm" colorScheme="green" isChecked={!userData?.is_withdraw_suspend} onChange={() => handleStatusChange("is_withdraw_suspend")} />
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <span className="text-[13px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">Email Verification</span>
                      <div className="flex items-center gap-2">
                        {userData?.email_verified ? (
                          <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded uppercase">Verified</span>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase">Pending</span>
                        )}
                        <Switch size="sm" colorScheme="green" isChecked={userData?.email_verified} onChange={() => handleStatusChange("email_verified")} />
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <span className="text-[13px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">SMS Verification</span>
                      <div className="flex items-center gap-2">
                        {userData?.sms_verified ? (
                          <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded uppercase">Verified</span>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase">Pending</span>
                        )}
                        <Switch size="sm" colorScheme="green" isChecked={userData?.sms_verified} onChange={() => handleStatusChange("sms_verified")} />
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <span className="text-[13px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">KYC Verification</span>
                      <div className="flex items-center gap-2">
                        {userData?.kyc_verified ? (
                          <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded uppercase">Verified</span>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase">Pending</span>
                        )}
                        <Switch size="sm" colorScheme="green" isChecked={userData?.kyc_verified} onChange={() => handleStatusChange("kyc_verified")} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Score Card */}
                <div className="bg-[#ef4444] rounded-[20px] p-6 shadow-sm text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <h2 className="text-[15px] font-bold mb-1 flex items-center gap-2">
                        <FaExclamationTriangle /> Risk Score
                      </h2>
                      <p className="text-xl font-black mt-2">Medium</p>
                      <p className="text-[11px] text-white/80 mt-1">Regular monitoring</p>
                    </div>
                    <div className="w-14 h-14 rounded-full border-[3px] border-white flex items-center justify-center font-black text-xl bg-white/20">
                      65
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 w-full overflow-hidden">
              {active === 2 && <Deposit id={userData?.user_id} />}
              {active === 3 && <WithDrawl id={userData?.user_id} />}
              {active === 4 && <Transaction id={userData?.user_id} />}
              {active === 5 && <Walltet userData={userData} plData={plData} getData={getUserData} />}
              {active === 6 && <Referral id={param.id} />}
              {active === 7 && <BetHistory userData={userData} type="user" />}
              {active === 8 && <UserBonus />}
              {active === 10 && <SportBetHistory userData={userData} type="user" />}
              {active === 9 && <SingleLoginHistory userData={userData} role="user" />}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default SingleUserManage;