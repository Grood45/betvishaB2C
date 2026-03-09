import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { sendPostRequest } from "../../api/api";
import LoadingSpinner from "../loading/LoadingSpinner";
import { useTranslation } from "react-i18next";
import { FaMoneyBillWave, FaRupeeSign, FaTimes, FaRegMoneyBillAlt, FaUniversity, FaMobileAlt, FaBitcoin, FaShieldAlt, FaBolt, FaBell, FaArrowDown, FaCheckCircle } from "react-icons/fa";

function SubtractBalance({ userData, getData, title, customButton, externalIsOpen, externalOnClose }) {
  const { bg } = useSelector(state => state.theme);
  const [withdrawResponse, setWithdrawResponse] = useState("");
  const internalDisclosure = useDisclosure();
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalDisclosure.isOpen;
  const onOpen = internalDisclosure.onOpen;
  const onClose = externalOnClose !== undefined ? externalOnClose : internalDisclosure.onClose;
  const [step, setStep] = useState(1);
  const [transactionId, setTransactionId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};
  const { t } = useTranslation();
  const toast = useToast();

  React.useEffect(() => {
    if (isOpen) {
      setStep(1);
      setTransactionId(`WIT${Date.now()}`);
      setAmount("");
      setWithdrawResponse("");
    }
  }, [isOpen]);

  // Static UI State
  const [selectedMethod, setSelectedMethod] = useState("Bank Transfer");

  const subtractBalance = async () => {
    if (!amount || Number(amount) <= 0) {
      toast({ description: "Please enter a valid amount", status: "error", duration: 3000, position: "top", isClosable: true });
      return;
    }

    setLoading(true);
    try {
      let url;
      let userKey;
      if (title === "user") {
        url = `${import.meta.env.VITE_API_URL}/api/admin/withdraw-amount-user`;
        userKey = "user_id";
      } else if (title === "admin") {
        url = `${import.meta.env.VITE_API_URL}/api/admin/withdraw-amount`;
        userKey = "admin_id";
      } else {
        throw new Error("Invalid title provided");
      }

      const requestData = {
        username: userData?.username,
        withdraw_amount: Number(amount),
        admin_response: withdrawResponse,
        parent_admin_id: adminData.admin_id,
        [userKey]: userData[userKey],
        user_type: title,
        currency: userData?.currency,
        approved_by_username: adminData?.username,
        approved_by_role_type: adminData?.role_type,
        approved_by_admin_id: adminData?.admin_id
      };

      await sendPostRequest(url, requestData);

      toast({
        description: `₹${amount} withdrawal successfully`,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });

      setAmount("");
      setWithdrawResponse("");
      setLoading(false);
      getData();
      onClose();
    } catch (error) {
      console.error("Error abstracting balance:", error);
      setLoading(false);
      toast({
        description: `${error?.data?.message || "An error occurred"}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    }
  };

  const handleReview = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      toast({ description: "Please enter a valid amount", status: "error", duration: 3000, position: "top", isClosable: true });
      return;
    }
    if (Number(amount) > (userData?.amount || 0)) {
      toast({ description: "Insufficient balance", status: "error", duration: 3000, position: "top", isClosable: true });
      return;
    }
    setStep(2);
  };

  const handleQuickAmount = (val) => {
    setAmount(val);
  };

  return (
    <>
      {customButton ? (
        <div onClick={onOpen} className="flex-1 sm:flex-none cursor-pointer">
          {customButton}
        </div>
      ) : (
        <button
          onClick={onOpen}
          style={{ backgroundColor: bg }}
          className="w-[100%] font-semibold text-white text-xs rounded-[5px] p-[7px]"
        >
          {t(`Withdraw`)} {t(`Balance`)}
        </button>
      )}

      <Modal size="4xl" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.600" />
        <ModalContent className="rounded-2xl overflow-hidden shadow-2xl bg-gray-50 font-sans" style={{ maxWidth: "900px", margin: "1rem" }}>

          {/* Header */}
          <div className="bg-white px-6 py-5 border-b border-gray-100 flex justify-between items-center sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-lg">
                <FaArrowDown />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 leading-tight">Admin Withdraw</h2>
                <p className="text-[13px] text-gray-500 font-medium">Deduct funds from user wallet - {userData?.username}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors">
              <FaTimes size={18} />
            </button>
          </div>

          <ModalBody className="p-0">

            {/* User Info Bar */}
            <div className="bg-white px-6 py-4 flex flex-wrap justify-between items-center border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl uppercase shadow-sm">
                  {userData?.username?.charAt(0) || "U"}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 leading-tight">{userData?.username}</h3>
                  <p className="text-[12px] text-gray-500 font-medium mt-0.5">ID: {userData?.user_id} • {userData?.country || "Pakistan"} 🇵🇰</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 mt-3 sm:mt-0 text-right">
                <div>
                  <p className="text-[11px] text-gray-500 font-semibold mb-0.5">Current Wallet</p>
                  <p className="text-[15px] font-black text-gray-800">₹{(userData?.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 font-semibold mb-0.5">Daily Limit</p>
                  <p className="text-[15px] font-black text-red-600">₹100,000</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 font-semibold mb-0.5">Status</p>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">enabled</span>
                </div>
              </div>
            </div>

            {step === 1 ? (
              <form onSubmit={handleReview} className="p-6">
                <div className="flex flex-col md:flex-row gap-8">

                  {/* Left Column */}
                  <div className="flex-1 space-y-6">

                    {/* Amount Input */}
                    <div>
                      <label className="text-[13px] font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <FaRupeeSign className="text-gray-400" /> Withdrawal Amount *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <span className="text-gray-500 font-medium text-lg">₹</span>
                        </div>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 text-lg font-bold text-gray-800 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all shadow-sm placeholder:text-gray-300 placeholder:font-normal"
                          placeholder="Enter amount"
                          required
                          min="100"
                          max={userData?.amount || 0}
                        />
                      </div>
                      <div className="flex justify-between mt-2 px-1 text-[11px] font-medium text-gray-500">
                        <span>Min: ₹100</span>
                        <span>Available: ₹{(userData?.amount || 0).toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Payment Method (Static UI) */}
                    <div>
                      <label className="text-[13px] font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <FaRegMoneyBillAlt className="text-gray-400" /> Payout Method *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                        {/* Method 1 */}
                        <div
                          onClick={() => setSelectedMethod("Bank Transfer")}
                          className={`cursor-pointer rounded-xl p-3 border-2 transition-all ${selectedMethod === 'Bank Transfer' ? 'border-red-500 bg-red-500 text-white shadow-md shadow-red-500/20' : 'border-gray-200 bg-white hover:border-red-300'}`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <FaUniversity size={16} className={selectedMethod === 'Bank Transfer' ? 'text-white' : 'text-gray-600'} />
                            <h4 className={`text-[14px] font-bold ${selectedMethod === 'Bank Transfer' ? 'text-white' : 'text-gray-800'}`}>Bank Transfer</h4>
                          </div>
                          <p className={`text-[11px] mb-2 ${selectedMethod === 'Bank Transfer' ? 'text-red-50' : 'text-gray-500'}`}>Direct bank transfer - Most secure</p>
                          <div className={`text-[10px] font-medium flex items-center gap-1.5 ${selectedMethod === 'Bank Transfer' ? 'text-red-100' : 'text-gray-400'}`}>
                            <span>🕒 Up to 24hrs</span> • <span>Fees: Free</span>
                          </div>
                        </div>

                        {/* Method 2 */}
                        <div
                          onClick={() => setSelectedMethod("UPI")}
                          className={`cursor-pointer rounded-xl p-3 border-2 transition-all ${selectedMethod === 'UPI' ? 'border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'border-gray-200 bg-white hover:border-orange-300'}`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <FaMobileAlt size={16} className={selectedMethod === 'UPI' ? 'text-white' : 'text-gray-600'} />
                            <h4 className={`text-[14px] font-bold ${selectedMethod === 'UPI' ? 'text-white' : 'text-gray-800'}`}>UPI Payment</h4>
                          </div>
                          <p className={`text-[11px] mb-2 ${selectedMethod === 'UPI' ? 'text-orange-50' : 'text-gray-500'}`}>Fast payout via UPI ID</p>
                          <div className={`text-[10px] font-medium flex items-center gap-1.5 ${selectedMethod === 'UPI' ? 'text-orange-100' : 'text-gray-400'}`}>
                            <span>🕒 1-4 hours</span> • <span>Fees: Free</span>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>

                  {/* Right Column */}
                  <div className="flex-1 space-y-6">

                    {/* Quick Amounts */}
                    <div>
                      <label className="text-[13px] font-bold text-gray-700 mb-2 flex items-center gap-2">
                        Quick Amounts
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[1000, 5000, 10000, 25000, 50000, 100000].map((amt) => {
                          const isAvailable = amt <= (userData?.amount || 0);
                          return (
                            <button
                              key={amt}
                              type="button"
                              disabled={!isAvailable}
                              onClick={() => handleQuickAmount(amt)}
                              className={`py-2 px-1 rounded-xl font-bold text-[13px] transition-all border 
                              ${!isAvailable ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400' :
                                  Number(amount) === amt
                                    ? 'bg-red-50 border-red-500 text-red-700 shadow-sm'
                                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                                }`}
                            >
                              ₹{amt.toLocaleString('en-IN')}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Transaction ID & Auth Code */}
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="text-[13px] font-bold text-gray-700 mb-2 flex items-center gap-2">
                          Transaction ID
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={transactionId}
                          className="w-full px-4 py-2.5 text-[13px] font-bold text-gray-600 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-[13px] font-bold text-gray-700 mb-2 flex items-center gap-2">
                          Approval Token <span className="text-gray-400 font-medium">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter token"
                          className="w-full px-4 py-2.5 text-[13px] font-bold text-gray-800 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder:font-normal placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    {/* Notes / Remarks */}
                    <div>
                      <label className="text-[13px] font-bold text-gray-700 mb-2 flex items-center gap-2">
                        Notes
                      </label>
                      <textarea
                        value={withdrawResponse}
                        onChange={(e) => setWithdrawResponse(e.target.value)}
                        placeholder="Add any internal notes about this withdrawal..."
                        rows="3"
                        className="w-full px-4 py-3 text-[13px] text-gray-800 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all shadow-sm placeholder:text-gray-400 resize-none"
                      />
                    </div>

                  </div>
                </div>

                {/* Bottom Actions Area */}
                <div className="mt-8 pt-5 border-t border-gray-100 flex flex-wrap flex-col-reverse sm:flex-row items-center justify-between gap-4">

                  {/* Badges */}
                  <div className="flex gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-[11px] font-bold whitespace-nowrap border border-green-100">
                      <FaShieldAlt /> Secure Verification
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-[11px] font-bold whitespace-nowrap border border-red-100">
                      <FaBolt /> Priority Processing
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button
                      onClick={onClose}
                      type="button"
                      className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold text-[13px] rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 sm:flex-none px-8 py-2.5 bg-red-600 text-white font-bold text-[13px] rounded-xl hover:bg-red-700 shadow-md shadow-red-600/20 transition-all flex items-center justify-center min-w-[170px]"
                    >
                      Review Withdraw
                    </button>
                  </div>

                </div>
              </form>
            ) : (
              <div className="p-6 sm:p-8 flex flex-col items-center">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
                  <FaCheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Confirm Withdraw</h2>
                <p className="text-sm text-gray-500 mb-8 text-center">Please review the withdrawal details before processing</p>

                <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6">
                    <div>
                      <p className="text-[12px] text-gray-500 mb-1">User</p>
                      <p className="font-bold text-gray-800">{userData?.username}</p>
                    </div>
                    <div>
                      <p className="text-[12px] text-gray-500 mb-1">Amount</p>
                      <p className="text-2xl font-bold text-red-600">₹{Number(amount).toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-[12px] text-gray-500 mb-1">Payment Method</p>
                      <p className="font-bold text-gray-800">{selectedMethod}</p>
                    </div>
                    <div>
                      <p className="text-[12px] text-gray-500 mb-1">Processing Time</p>
                      <p className="font-bold text-orange-600">Pending</p>
                    </div>
                    <div>
                      <p className="text-[12px] text-gray-500 mb-1">Transaction ID</p>
                      <p className="font-bold text-gray-800">{transactionId}</p>
                    </div>
                    <div>
                      <p className="text-[12px] text-gray-500 mb-1">Fees</p>
                      <p className="font-bold text-gray-800">Free</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center mb-3">
                    <span className="text-[13px] text-gray-600">Current Wallet Balance</span>
                    <span className="font-bold text-gray-800">₹{(userData?.amount || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="text-[14px] font-bold text-gray-700">After Withdraw</span>
                    <span className="text-xl font-black text-red-600">₹{((userData?.amount || 0) - Number(amount)).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="w-full max-w-2xl grid grid-cols-2 gap-3 mb-8">
                  <div className="bg-green-50 text-green-700 py-3 rounded-xl flex flex-col items-center justify-center border border-green-100">
                    <FaShieldAlt className="mb-1.5" size={18} />
                    <span className="text-[11px] font-bold">Secure Verification</span>
                  </div>
                  <div className="bg-red-50 text-red-700 py-3 rounded-xl flex flex-col items-center justify-center border border-red-100">
                    <FaBolt className="mb-1.5" size={18} />
                    <span className="text-[11px] font-bold">Priority Processing</span>
                  </div>
                </div>

                <div className="w-full max-w-2xl flex justify-between items-center pt-2">
                  <button type="button" onClick={() => setStep(1)} className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold text-[13px] hover:bg-gray-50 transition-colors">Back</button>
                  <div className="flex gap-3">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 text-gray-500 font-bold text-[13px] hover:text-gray-800 transition-colors">Cancel</button>
                    <button type="button" disabled={loading} onClick={subtractBalance} className="px-8 py-2.5 bg-red-600 text-white font-bold text-[13px] rounded-xl hover:bg-red-700 shadow-md shadow-red-600/20 transition-all flex items-center justify-center min-w-[170px]">
                      {loading ? <LoadingSpinner color="white" size="sm" thickness="2px" /> : "Confirm Withdraw"}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default SubtractBalance;