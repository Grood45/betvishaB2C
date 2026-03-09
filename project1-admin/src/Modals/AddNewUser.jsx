import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  Switch,
} from "@chakra-ui/react";
import {
  UserPlus,
  Lock,
  Settings,
  Wallet,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import { sendPostRequest } from "../api/api";
import countryList from "react-select-country-list";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useTranslation } from "react-i18next";

import ReactCountryFlag from "react-country-flag";

import { countryCurrencyMap, initialState } from "./AddNewUserComponents/constants";
import BasicInfo from "./AddNewUserComponents/BasicInfo";
import SecurityInfo from "./AddNewUserComponents/SecurityInfo";
import LimitsSettings from "./AddNewUserComponents/LimitsSettings";
import InitialDeposit from "./AddNewUserComponents/InitialDeposit";




function AddNewUser({ setAllUserData, allUserData, variant = "button" }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const toast = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [userExist, setUserExist] = useState(false);
  const [validUsername, setValidUsername] = useState(true);

  // UI states
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const { bg, iconColor } = useSelector((state) => state.theme);
  const user = useSelector((state) => state.authReducer);
  const adminData = user?.user || {};

  // Auto-map currency and reset phone when country changes
  useEffect(() => {
    if (formData.country) {
      setFormData(prev => ({
        ...prev,
        currency: countryCurrencyMap[formData.country].currency,
        phone: "" // Clear phone when country changes to avoid mismatched dial codes
      }));
    }
  }, [formData.country]);

  // Helper to generate Alphanumeric strings
  const generateRandomString = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleGenerateUsername = () => {
    // Generate a random string that guarantees at least one letter and one number
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    let randomUser = '';
    // ensure at least 3 letters
    for (let i = 0; i < 3; i++) randomUser += letters.charAt(Math.floor(Math.random() * letters.length));
    // ensure at least 3 numbers
    for (let i = 0; i < 3; i++) randomUser += numbers.charAt(Math.floor(Math.random() * numbers.length));
    // Shuffle the result
    randomUser = randomUser.split('').sort(() => 0.5 - Math.random()).join('');

    setFormData(prev => ({ ...prev, username: randomUser }));
    setFormErrors(prev => ({ ...prev, username: null }));
  };

  const handleGeneratePassword = () => {
    const randomPass = generateRandomString(10) + "!@#";
    setFormData(prev => ({ ...prev, password: randomPass, confirm_password: randomPass }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };



  const handlePhoneInput = (e) => {
    // Allow only numbers
    const val = e.target.value.replace(/\D/g, "");
    setFormData(prev => ({ ...prev, phone: val }));
  }

  // Username validation and debouncing block
  function checkUsername(username) {
    let hasAlpha = false;
    let hasNum = false;
    for (let char of username) {
      if (!isNaN(char)) hasNum = true;
      else hasAlpha = true;
      if (hasAlpha && hasNum) return true;
    }
    return false;
  }

  const checkUsernameExistence = async () => {
    if (!formData.username) return;
    try {
      let url = `${import.meta.env.VITE_API_URL}/api/admin/exist-or-not`;
      let response = await sendPostRequest(url, { username: formData.username, type: "user" });
      setUserExist(response?.exists || response?.data?.exists);
    } catch (error) {
      setUserExist(error?.exists || error?.data?.exists);
      console.log(error);
    }
  };

  useEffect(() => {
    const validateUsername = () => {
      if (formData.username.length > 3 && checkUsername(formData.username)) {
        setValidUsername(true);
        checkUsernameExistence();
      } else if (formData.username.length > 0) {
        setValidUsername(false);
      }
    };
    let timer;
    if (formData.username.length > 3) {
      timer = setTimeout(validateUsername, 700);
    } else {
      setValidUsername(true); // default to true until typing to not show red error immediately
    }
    return () => clearTimeout(timer);
  }, [formData.username]);

  const handleNextStep = async () => {
    // Basic validations before proceeding
    let errors = {};
    if (currentStep === 1) {
      if (!formData.username) errors.username = "Username is required";
      else if (!validUsername) errors.username = "Username must contain alphabets and numbers";
      else if (userExist) errors.username = "Username already exists";

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email || !emailRegex.test(formData.email)) {
        errors.email = "Email is invalid";
      }

      if (!formData.phone || formData.phone.length < 10) {
        errors.phone = "Phone number must be at least 10 digits";
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      // Real-time existence check for all fields before moving to step 2
      try {
        setLoading(true);
        const url = `${import.meta.env.VITE_API_URL}/api/admin/exist-or-not`;
        const response = await sendPostRequest(url, {
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          type: "user"
        });
        setLoading(false);

        // If we get here with success response, it means no conflicts (exists: false)
      } catch (error) {
        setLoading(false);
        if (error?.exists || error?.data?.exists) {
          const conflicts = error?.conflicts || error?.data?.conflicts || [];
          const newErrors = { ...errors };
          conflicts.forEach(field => {
            newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
          });
          setFormErrors(newErrors);
          return;
        }
        // Generic error handling
        toast({ description: error?.data?.message || "Validation failed. Please try again.", status: "error", duration: 3000 });
        return;
      }
    }

    if (currentStep === 2) {
      if (!formData.password || formData.password !== formData.confirm_password) {
        toast({ description: "Passwords do not match or are empty.", status: "warning", duration: 3000 });
        return;
      }
    }

    setFormErrors({});
    if (currentStep < totalSteps) setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const CreateUser = async (e) => {
    e.preventDefault();
    if (formData.initial_deposit < 1) {
      toast({ description: "Initial deposit must be at least 1 INR.", status: "warning", duration: 3000 });
      return;
    }

    const payload = {
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      currency: formData.currency,
      user_type: formData.user_type,
      password: formData.password,
      kyc_required: formData.kyc_required,
      official_user: formData.official_user,
      exposure_limit: formData.exposure_limit,
      daily_max_deposit_limit: formData.daily_max_deposit_limit,
      daily_max_withdrawal_limit: formData.daily_max_withdrawal_limit,
      welcome_bonus: formData.welcome_bonus,
      referral_code: formData.referral_code,
      admin_notes: formData.admin_notes,
      amount: formData.initial_deposit, // Matches backend "amount" for initial deposit
      deposit_method: formData.deposit_method, // Backend to be modified to accept this
      deposit_notes: formData.deposit_notes, // Additional
      role_type: "user",
      parent_admin_id: adminData?.admin_id,
    };

    const url = `${import.meta.env.VITE_API_URL}/api/admin/create-admin-user`;
    try {
      setLoading(true);
      let response = await sendPostRequest(url, payload);
      setLoading(false);
      setCreationSuccess(true);
      if (response.data) {
        setAllUserData((prev) => [response.data, ...prev]);
      }
      setTimeout(() => {
        onCloseModal();
      }, 3000);
    } catch (error) {
      console.log(error);
      toast({ description: `${error?.data?.message || error?.message}`, status: "error", duration: 4000, isClosable: true });
      setLoading(false);
    }
  };

  const onCloseModal = () => {
    setFormData(initialState);
    setCurrentStep(1);
    setUserExist(false);
    setIsCountryDropdownOpen(false);
    setCreationSuccess(false);
    onClose();
  }

  const renderStepper = () => (
    <div className="flex justify-between items-center py-5">
      {[
        { id: 1, label: "Basic Info", icon: UserPlus },
        { id: 2, label: "Security", icon: Lock },
        { id: 3, label: "Limits & Settings", icon: Settings },
        { id: 4, label: "Initial Deposit", icon: Wallet }
      ].map((step) => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        return (
          <div key={step.id} className={`flex flex-col items-center sm:flex-row sm:gap-3 ${isActive || isCompleted ? "text-blue-600" : "text-gray-400"}`}>
            <div className={`p-2 rounded-full w-8 h-8 flex items-center justify-center ${isActive || isCompleted ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
              {isCompleted ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> : <Icon size={16} />}
            </div>
            <span className="text-sm font-semibold hidden md:block whitespace-pre-wrap text-center sm:text-left leading-4">{step.label.replace(' ', '\n')}</span>
            {step.id !== 4 && <div className={`h-1 w-8 sm:w-16 md:w-24 mx-2 sm:mx-4 rounded ${isCompleted ? "bg-blue-600" : "bg-gray-200"}`}></div>}
          </div>
        );
      })}
    </div>
  );




  return (
    <>
      {variant === "card" ? (
        <div
          onClick={onOpen}
          className="min-w-[140px] md:min-w-[170px] snap-center cursor-pointer group bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300"
          style={{ borderBottom: `3px solid ${iconColor}` }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-sm group-hover:bg-white group-hover:scale-110 transition-all duration-300"
            style={{ backgroundColor: `${iconColor}10`, color: iconColor }}
          >
            <UserPlus size={28} />
          </div>
          <span className="font-bold text-gray-700 text-sm text-center group-hover:text-gray-900 line-clamp-2">
            {t('Add')} {t('New')} {t('User')}
          </span>
        </div>
      ) : (
        <div onClick={onOpen}>
          <button
            style={{ backgroundColor: bg }}
            className={`flex items-center p-2 gap-2 rounded-[6px] text-xs md:text-sm text-white font-bold `}
          >
            <UserPlus size={18} />
            {t(`Add`)} {t(`New`)} {t(`User`)}
          </button>
        </div>
      )}

      <Modal size="4xl" isOpen={isOpen} onClose={onCloseModal} scrollBehavior="inside">
        <ModalOverlay backdropFilter="blur(3px)" />
        <ModalContent className="bg-transparent overflow-hidden rounded-lg">
          {creationSuccess ? (
            <div className="bg-white flex flex-col items-center justify-center p-8 text-center min-h-[450px]">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-[0_4px_14px_0_rgba(74,222,128,0.39)]">
                <CheckCircle className="text-green-500" size={48} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight mb-2">User Created Successfully!</h2>
              <p className="text-[14px] text-gray-500 font-medium mb-8">
                The new user <span className="text-blue-600 font-bold px-2 py-1 bg-blue-50 rounded-md border border-blue-100">{formData.username}</span> has been added to the platform.
              </p>
              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-400 mb-2">Closing automatically...</p>
                <div className="w-32 h-1 bg-gray-100 rounded-full mx-auto overflow-hidden">
                  <div className="h-full bg-green-500 w-full" style={{ animation: "shrink 3s linear forwards" }}></div>
                </div>
              </div>
              <style>
                {`
                  @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                  }
                `}
              </style>
            </div>
          ) : (
            <>
              <ModalCloseButton className="mt-2 z-40" />

              <div className="bg-white shadow-sm border-b z-30">
                <div className="px-6 py-5 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <UserPlus size={24} />
                    </div>
                    <div>
                      <h2 className="text-[22px] font-bold text-gray-900 tracking-tight leading-6">Create New User</h2>
                      <p className="text-[14px] text-gray-500 font-medium">Add a new user to the sports & casino platform</p>
                    </div>
                  </div>
                </div>

                <div className="px-8">
                  {renderStepper()}
                </div>
              </div>

              <ModalBody className="p-0 bg-white relative custom-scrollbar">
                <style>
                  {`
                .custom-scrollbar::-webkit-scrollbar {
                  width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: #f1f5f9;
                  border-radius: 8px;
                  margin-top: 4px;
                  margin-bottom: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background-color: #3b82f6;
                  border-radius: 20px;
                  border: 2px solid #f1f5f9;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background-color: #2563eb;
                }
              `}
                </style>
                <div className="px-8 pb-8 pt-6">
                  <div className="min-h-[350px]">
                    {currentStep === 1 && <BasicInfo formData={formData} setFormData={setFormData} handleChange={handleChange} handlePhoneInput={handlePhoneInput} handleGenerateUsername={handleGenerateUsername} formErrors={formErrors} setFormErrors={setFormErrors} validUsername={validUsername} userExist={userExist} />}
                    {currentStep === 2 && <SecurityInfo formData={formData} setFormData={setFormData} handleChange={handleChange} handleGeneratePassword={handleGeneratePassword} />}
                    {currentStep === 3 && <LimitsSettings formData={formData} handleChange={handleChange} />}
                    {currentStep === 4 && <InitialDeposit formData={formData} setFormData={setFormData} handleChange={handleChange} />}
                  </div>
                </div>
              </ModalBody>

              <div className="px-6 py-4 border-t flex justify-between items-center bg-white z-30 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] mt-auto">
                {currentStep > 1 ? (
                  <button onClick={handlePrevStep} className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Previous
                  </button>
                ) : <div></div>}

                <div className="flex gap-6 items-center">
                  <button onClick={onCloseModal} className="text-gray-500 hover:text-gray-800 font-medium text-[15px]">
                    Cancel
                  </button>
                  {currentStep < totalSteps ? (
                    <button onClick={handleNextStep} className="px-6 py-2.5 bg-[#2563eb] text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      Next Step
                    </button>
                  ) : (
                    <button onClick={CreateUser} disabled={loading} className="px-6 py-2.5 bg-[#2563eb] text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
                      {loading ? <LoadingSpinner color="white" size="sm" thickness="2px" /> : <><UserPlus size={18} /> Create User</>}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddNewUser;
