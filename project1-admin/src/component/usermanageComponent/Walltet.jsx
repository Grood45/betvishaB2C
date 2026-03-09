import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaWallet, FaGift, FaGamepad, FaTrophy, FaBullseye, FaUserFriends, FaRegEyeSlash, FaArrowDown, FaArrowUp, FaChartBar, FaPlus, FaMinus, FaExchangeAlt } from 'react-icons/fa';
import AddBalance from './AddBalance';
import SubtractBalance from './SubtractBalance';

const Walltet = ({ userData, plData, getData }) => {
  const { t } = useTranslation();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: userData?.currency || 'INR', minimumFractionDigits: 0 }).format(amount || 0);
  };

  return (
    <div className="w-full bg-white rounded-2xl p-6 sm:p-8 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[22px] font-bold text-gray-800 tracking-tight">Wallet Overview</h2>
        <button className="text-sm font-medium text-gray-500 hover:text-gray-800 flex items-center gap-2 transition-colors">
          <FaRegEyeSlash /> Hide Balance
        </button>
      </div>

      {/* Top Main Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">

        {/* Main Wallet */}
        <div className="bg-[#3b82f6] rounded-[14px] p-5 text-white relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <FaWallet size={24} className="text-white/90" />
            <span className="text-xs font-medium text-white/90 tracking-wide">Main Wallet</span>
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-bold tracking-tight mb-1">{formatCurrency(userData?.amount)}</h3>
            <p className="text-[11px] text-blue-100/90 font-medium">Available Balance</p>
          </div>
        </div>

        {/* Bonus Wallet */}
        <div className="bg-[#8b5cf6] rounded-[14px] p-5 text-white relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <FaGift size={24} className="text-white/90" />
            <span className="text-xs font-medium text-white/90 tracking-wide">Bonus Wallet</span>
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-bold tracking-tight mb-1">{formatCurrency(userData?.bonus_amount || 0)}</h3>
            <p className="text-[11px] text-purple-100/90 font-medium">Bonus Balance</p>
          </div>
        </div>

        {/* Casino P&L Wallet */}
        <div className="bg-[#ef4444] rounded-[14px] p-5 text-white relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <FaGamepad size={24} className="text-white/90" />
            <span className="text-xs font-medium text-white/90 tracking-wide">Casino P&L Wallet</span>
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-bold tracking-tight mb-1">{formatCurrency(plData?.casino_pl || 0)}</h3>
            <p className="text-[11px] text-red-100/90 font-medium">Casino P&L Balance</p>
          </div>
        </div>

        {/* Sports P&L Wallet */}
        <div className="bg-[#10b981] rounded-[14px] p-5 text-white relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <FaTrophy size={24} className="text-white/90" />
            <span className="text-xs font-medium text-white/90 tracking-wide">Sports P&L Wallet</span>
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-bold tracking-tight mb-1">{formatCurrency(plData?.totalAmount || 0)}</h3>
            <p className="text-[11px] text-green-100/90 font-medium">Sports P&L Balance</p>
          </div>
        </div>

        {/* Exposure Wallet */}
        <div className="bg-[#f59e0b] rounded-[14px] p-5 text-white relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <FaBullseye size={24} className="text-white/90" />
            <span className="text-xs font-medium text-white/90 tracking-wide">Exposure Wallet</span>
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-bold tracking-tight mb-1">{formatCurrency(userData?.exposure_limit || 0)}</h3>
            <p className="text-[11px] text-orange-100/90 font-medium">Current Exposure</p>
          </div>
        </div>

        {/* Referral Bonus */}
        <div className="bg-[#ec4899] rounded-[14px] p-5 text-white relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <FaUserFriends size={24} className="text-white/90" />
            <span className="text-xs font-medium text-white/90 tracking-wide">Referral Bonus</span>
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-bold tracking-tight mb-1">{formatCurrency(userData?.referral_bonus || 0)}</h3>
            <p className="text-[11px] text-pink-100/90 font-medium">Referral Earnings</p>
          </div>
        </div>

        {/* Withdrawal Balance */}
        <div className="bg-[#06b6d4] rounded-[14px] p-5 text-white relative overflow-hidden shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1 border border-[#06b6d4]">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="transform rotate-45"><FaArrowDown size={20} className="text-white/90" /></div>
            <span className="text-xs font-medium text-white/90 tracking-wide">Withdrawal Balance</span>
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-bold tracking-tight mb-1">{formatCurrency(userData?.amount || 0)}</h3>
            <p className="text-[11px] text-cyan-100/90 font-medium">Available for Withdrawal</p>
          </div>
        </div>
      </div>

      {/* Breakline */}
      <div className="w-full h-px bg-gray-100 my-8"></div>

      {/* Bottom Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 text-center sm:text-left">
        <div className="flex flex-col items-center sm:items-start">
          <p className="text-[14px] text-gray-800 font-bold flex items-center gap-2 mb-2">
            <FaArrowUp className="text-[#10b981]" size={14} /> Total Deposits
          </p>
          <p className="text-2xl font-black text-[#10b981]">{formatCurrency(plData?.totalDeposit || 0)}</p>
        </div>

        <div className="flex flex-col items-center sm:items-start sm:border-l sm:border-gray-100 sm:pl-8">
          <p className="text-[14px] text-gray-800 font-bold flex items-center gap-2 mb-2">
            <FaArrowDown className="text-[#ef4444]" size={14} /> Total Withdrawals
          </p>
          <p className="text-2xl font-black text-[#ef4444]">{formatCurrency(plData?.totalWithdraw || 0)}</p>
        </div>

        <div className="flex flex-col items-center sm:items-start sm:border-l sm:border-gray-100 sm:pl-8">
          <p className="text-[14px] text-gray-800 font-bold flex items-center gap-2 mb-2">
            <FaChartBar className="text-[#3b82f6]" size={14} /> Net P&L
          </p>
          <p className={`text-2xl font-black ${(plData?.totalAmount || 0) >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>{formatCurrency(plData?.totalAmount || 0)}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <AddBalance
          userData={userData}
          getData={getData}
          title="user"
          customButton={
            <button className="w-full sm:flex-none min-w-[120px] bg-[#10b981] hover:bg-[#059669] text-white text-[13px] font-bold py-3 px-6 rounded-[10px] shadow-sm transition-colors flex items-center justify-center gap-2">
              <FaPlus size={12} /> Add Funds
            </button>
          }
        />
        <SubtractBalance
          userData={userData}
          getData={getData}
          title="user"
          customButton={
            <button className="w-full sm:flex-none min-w-[120px] bg-[#ef4444] hover:bg-[#dc2626] text-white text-[13px] font-bold py-3 px-6 rounded-[10px] shadow-sm transition-colors flex items-center justify-center gap-2">
              <FaMinus size={12} /> Withdraw
            </button>
          }
        />
        <button className="flex-1 sm:flex-none min-w-[120px] bg-[#3b82f6] hover:bg-[#2563eb] text-white text-[13px] font-bold py-3 px-6 rounded-[10px] shadow-sm transition-colors flex items-center justify-center gap-2">
          <FaExchangeAlt size={12} /> Transfer
        </button>
      </div>

    </div>
  );
};

export default Walltet;
