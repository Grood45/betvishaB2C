import React, { useEffect, useState } from "react";
import { CircularProgress, useToast } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { sendPatchRequest } from "../../api/api";
import { useTranslation } from "react-i18next";
import { MdFileCopy, MdEmail, MdPhone, MdLocationOn, MdAccountBalance } from "react-icons/md";
import { RiVipCrownLine } from "react-icons/ri";

const Profile = ({ type, userData, id }) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    _id: "", first_name: "", last_name: "", username: "", password: "",
    user_id: "", email: "", state: "", phone: "", city: "", country: "",
    bank_name: "", bank_holder: "", account_number: "", ifsc_code: "",
    joined_at: "", updated_at: "", status: true, bet_supported: true,
    is_blocked: true, is_online: true, last_seen: "", profile_picture: "",
    referral_code: "", amount: 0, exposure_limit: 0, max_limit: 0, min_limit: 0,
    daily_max_deposit_limit: 0, daily_max_withdrawal_limit: 0,
    sms_verified: true, kyc_verified: true,
  });
  const { t } = useTranslation();
  const toast = useToast();
  const { bg, border } = useSelector(state => state.theme);

  const handleUpdate = async () => {
    setLoading(true);
    let url = type === "user"
      ? `${import.meta.env.VITE_API_URL}/api/admin/update-single-user/${id}`
      : `${import.meta.env.VITE_API_URL}/api/admin/update-single-admin/${id}`;

    try {
      let response = await sendPatchRequest(url, formData);
      setData(response.data);
      toast({
        description: `${response?.message}`,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
    } catch (error) {
      toast({
        description: `${error?.message || 'Error occurred'}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (userData) {
      setFormData(userData);
    }
  }, [id, userData]);

  // Utility to calculate percentage for progress bars
  const calculatePercentage = (current, min, max) => {
    if (!max) return 0;
    return Math.min(100, Math.max(0, ((current - min) / (max - min)) * 100));
  };

  return (
    <div className="flex flex-col gap-6 w-full font-sans">

      {/* Row 1: Personal Info & Limits Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

        {/* Personal Information */}
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 h-full">
          <h2 className="text-[16px] font-bold text-gray-800 flex items-center gap-2 mb-6">
            <CgProfileIcon /> Personal Information
          </h2>

          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-gray-50 text-gray-400 rounded-xl mt-1"><MdEmail size={20} /></div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[12px] font-semibold text-gray-500">{t(`Email`)}</label>
                  {userData?.email_verified && <span className="text-[10px] text-green-600 font-bold flex items-center gap-1"><CheckIcon /> Verified</span>}
                </div>
                <input
                  name="email" value={formData?.email || ''} onChange={handleChange} readOnly
                  className="w-full text-[14px] font-bold text-gray-800 bg-transparent border-b border-gray-200 focus:border-blue-500 outline-none pb-1 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-gray-50 text-gray-400 rounded-xl mt-1"><MdPhone size={20} /></div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[12px] font-semibold text-gray-500">{t(`Phone`)}</label>
                  {userData?.sms_verified && <span className="text-[10px] text-green-600 font-bold flex items-center gap-1"><CheckIcon /> Verified</span>}
                </div>
                <input
                  name="phone" value={formData?.phone || ''} onChange={handleChange} readOnly
                  className="w-full text-[14px] font-bold text-gray-800 bg-transparent border-b border-gray-200 focus:border-blue-500 outline-none pb-1 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-gray-50 text-gray-400 rounded-xl mt-1"><MdLocationOn size={20} /></div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] font-semibold text-gray-500 block mb-1">{t(`Country`)}</label>
                  <div className="flex items-center gap-2 border-b border-gray-200 pb-1">
                    <span className="text-lg">🌍</span>
                    <input
                      name="country" value={formData?.country || ''} onChange={handleChange}
                      className="w-full text-[14px] font-bold text-gray-800 bg-transparent outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-gray-500 block mb-1">{t(`Currency`)}</label>
                  <div className="flex items-center gap-2 border-b border-gray-200 pb-1">
                    <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{formData?.currency || 'INR'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-gray-50 text-gray-400 rounded-xl mt-1"><CgProfileIcon /></div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] font-semibold text-gray-500 block mb-1">{t(`Username`)}</label>
                  <input name="username" value={formData?.username || ''} readOnly className="w-full text-[14px] font-bold text-gray-800 bg-transparent border-b border-gray-200 outline-none pb-1" />
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-gray-500 block mb-1">{t(`DOB`)}</label>
                  <input name="birthday" value={formData?.birthday || ''} onChange={handleChange} placeholder="DD/MM/YYYY" className="w-full text-[13px] font-bold text-gray-800 bg-transparent border-b border-gray-200 outline-none pb-1" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Daily Limits & VIP Card wrapper */}
        <div className="flex flex-col gap-6">
          {/* Daily Limits & Usage */}
          <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex-1">
            <h2 className="text-[16px] font-bold text-gray-800 flex items-center gap-2 mb-6">
              <FiSettingsIcon /> Daily Limits & Usage
            </h2>

            <div className="flex flex-col gap-5">

              {/* Withdrawal Limit */}
              {userData?.role_type === "user" && (
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex justify-between items-end mb-1">
                      <label className="text-[13px] font-semibold text-gray-700">Withdrawal Limit Range</label>
                      <span className="text-[11px] font-bold text-gray-800">{formData?.min_limit || 0} / {formData?.max_limit || 0}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
                      <div className="h-full bg-orange-500 rounded-full w-[35%]"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Min Limit</label>
                        <input name="min_limit" type="number" value={formData?.min_limit || ''} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-700 outline-none focus:border-orange-400" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Max Limit</label>
                        <input name="max_limit" type="number" value={formData?.max_limit || ''} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-700 outline-none focus:border-orange-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Daily Max Withdrawal Limit</label>
                    <input name="daily_max_withdrawal_limit" type="number" value={formData?.daily_max_withdrawal_limit || ''} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-700 outline-none focus:border-blue-400" />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Daily Max Deposit Limit</label>
                    <input name="daily_max_deposit_limit" type="number" value={formData?.daily_max_deposit_limit || ''} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-700 outline-none focus:border-green-400" />
                  </div>
                </div>
              )}

              {/* Exposure Limit Visualization & Edit */}
              <div className="mt-2 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-end mb-1">
                  <label className="text-[13px] font-semibold text-gray-700">Exposure Limit</label>
                  <span className="text-[11px] font-bold text-gray-800">Total: {formData?.exposure_limit || 0}</span>
                </div>

                {userData?.totalBetAmount > 0 ? (
                  <>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${calculatePercentage(userData?.totalBetAmount || 0, 0, formData?.exposure_limit) > 80 ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${calculatePercentage(userData?.totalBetAmount || 0, 0, formData?.exposure_limit)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-1.5">
                      <p className="text-[10px] font-bold text-gray-500">Used: {userData?.totalBetAmount || 0}</p>
                      {calculatePercentage(userData?.totalBetAmount || 0, 0, formData?.exposure_limit) > 80 && (
                        <p className="text-[10px] text-red-500 font-bold animate-pulse">Warning: High exposure usage!</p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="py-2 px-3 bg-blue-50/50 rounded-lg border border-blue-100/50 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <p className="text-[10px] font-bold text-blue-600">No active exposure found. Account is clean.</p>
                  </div>
                )}

                <div className="mt-4">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Edit Exposure Limit</label>
                  <input name="exposure_limit" type="number" value={formData?.exposure_limit || ''} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-700 outline-none focus:border-red-400" />
                </div>
              </div>

            </div>
          </div>

          {/* VIP Level Card */}
          <div className="bg-gradient-to-r from-yellow-500 to-orange-400 rounded-[20px] p-6 shadow-sm text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-widest text-white/80">VIP Level</p>
                <h3 className="text-2xl font-black mt-1 flex items-center gap-2"><RiVipCrownLine size={28} /> Gold <span className="text-sm">✩</span></h3>
                <p className="text-[11px] text-white/90 mt-2">Premium member benefits available</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-white/80">Next Level</p>
                <p className="text-sm font-bold mt-0.5">Platinum</p>
                <p className="text-[10px] text-white/80 mt-1">₹50,000 more required</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Row 2: Bank Details */}
      <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 w-full">
        <h2 className="text-[16px] font-bold text-gray-800 flex items-center gap-2 mb-6">
          <MdAccountBalance size={20} className="text-gray-500" /> Bank Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="relative">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">{t(`Bank Name`)}</label>
            <div className="relative">
              <input name="bank_name" value={formData?.bank_name || ''} onChange={handleChange} readOnly className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] font-bold text-gray-800 outline-none" />
              <MdFileCopy className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-green-500 transition-colors" />
            </div>
          </div>

          <div className="relative">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">{t(`Bank Holder`)}</label>
            <div className="relative">
              <input name="bank_holder" value={formData?.bank_holder || ''} onChange={handleChange} readOnly className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] font-bold text-gray-800 outline-none" />
              <MdFileCopy className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-green-500 transition-colors" />
            </div>
          </div>

          <div className="relative">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">{t(`Account Number`)}</label>
            <div className="relative">
              <input name="account_number" value={formData?.account_number || ''} onChange={handleChange} readOnly className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] font-bold text-gray-800 outline-none" />
              <MdFileCopy className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-green-500 transition-colors" />
            </div>
          </div>

          <div className="relative">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">{t(`IFSC Code`)}</label>
            <div className="relative">
              <input name="ifsc_code" value={formData?.ifsc_code || ''} onChange={handleChange} readOnly className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] font-bold text-gray-800 outline-none" />
              <MdFileCopy className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-green-500 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="w-full flex justify-end">
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="bg-[#d90429] hover:bg-[#b0021f] text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center min-w-[200px]"
        >
          {loading ? <CircularProgress size="20px" color="white" /> : `${t(`Save`)} ${t(`Changes`)}`}
        </button>
      </div>

    </div>
  );
};

// Mini Icons
const CgProfileIcon = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const FiSettingsIcon = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
);
const CheckIcon = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="3" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="12" width="12" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg>
);

export default Profile;