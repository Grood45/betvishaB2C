import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RiLuggageDepositFill } from 'react-icons/ri';
import { CgProfile } from 'react-icons/cg';
import { Avatar, useEditable, useToast } from "@chakra-ui/react";
import logo from '../assets/user-logo.png';
import AdminChangePassword from '../component/AdminChangePassword';
import AddAdminBalance from '../Modals/AddAdminBalance';
import { fetchGetRequest, sendPatchRequest, sendPostRequest } from '../api/api';
import LoadingSpinner from '../component/loading/LoadingSpinner';
import { updateAdminSuccess } from '../redux/auth-redux/actions';
import { useTranslation } from 'react-i18next';
import { checkPermission } from '../../utils/utils';

const MyProfile = () => {
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

  const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};
  // const [adminData,setProfileData]=useState(adminData)
  const isOwnerAdmin = adminData?.role_type === 'owneradmin';
  const permissionDetails = user?.user?.permissions

  let hasPermission = checkPermission(permissionDetails, "generateAmountManage")
  let check = !isOwnerAdmin ? hasPermission : true

  const dispatch = useDispatch()
  const toast = useToast()
  const [formData, setFormData] = useState({
    email: adminData?.email,
    profile_picture: adminData?.profile_picture,
    phone: adminData?.phone,
    country: adminData?.country
  });
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [adminSelfPldata, setSelfAdminPlData] = useState({});
  const [adminPlLoading, setAdminPlLoading] = useState(false);
  const { t, i18n } = useTranslation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

  };
  const handleImageUpload = async (file) => {
    setImageLoading(true);
    const formData = new FormData();
    formData.append("post_img", file);
    try {
      const response = await sendPostRequest(
        `${import.meta.env.VITE_API_URL}/api/payment/image-url`,
        formData
      );
      if (response.url) {
        toast({
          title: "Image uploaded successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        setFormData({ ...formData, profile_picture: response.url });

      }
      setImageLoading(false)
    } catch (error) {
      console.error("Error uploading image:", error.message);
      toast({
        title: "Error uploading image",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      setImageLoading(false);

    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    handleImageUpload(file);
  };


  const handleUpdateProfile = async () => {
    setLoading(true)
    let url = `${import.meta.env.VITE_API_URL
      }/api/admin/update-single-admin/${adminData.admin_id}`;
    try {
      let response = await sendPatchRequest(url, formData);
      const data = response.data;
      setLoading(false)
      dispatch(updateAdminSuccess(response.data))

      toast({
        description: `Updated Succesfully`,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    } catch (error) {
      toast({
        description: `${error?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      console.log(error);
      setLoading(false)
    }
  };
  const getAdminPlDetails = async () => {
    setAdminPlLoading(true);
    let url = `${import.meta.env.VITE_API_URL
      }/api/transaction/get-admin-pl-details-self`;

    try {
      let response = await fetchGetRequest(url);
      setSelfAdminPlData(response);

      setAdminPlLoading(false);
    } catch (error) {
      toast({
        description: error?.message || error?.data?.message,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      console.log(error);
      setAdminPlLoading(false);
    }
  };

  useEffect(() => {
    getAdminPlDetails();
  }, []);


  return (
    <div className='w-full min-h-screen px-4 md:px-8 pb-12 font-sans bg-[#f4f5f7] pt-6'>

      {/* Top Header Card */}
      <div className='w-full flex flex-col md:flex-row justify-between items-start md:items-center py-5 mb-6 transition-all'>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full flex items-center justify-center transition-all bg-[#ff0d39] text-white">
            <CgProfile fontSize="24px" />
          </div>
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-gray-800">{t(`My`)} {t(`Profile`)}</h1>
            <p className="text-xs font-medium text-gray-500 mt-0.5">Manage your account settings and preferences.</p>
          </div>
        </div>

        <div className='flex gap-2 mt-4 md:mt-0'>
          <AdminChangePassword code="2" />
          {check && <AddAdminBalance code="2" />}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: User Card & Stats (Col Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">

          {/* Profile Card */}
          <div className="rounded-2xl flex flex-col items-center text-center relative overflow-hidden transition-all bg-[#eaedf0] border border-gray-100">
            {/* Background decoration */}
            <div className="w-full h-32 bg-[#ebd9dc] absolute top-0 left-0"></div>

            <div className="relative mt-12 mb-4">
              <img src={adminData?.profile_picture || logo} className="w-28 h-28 rounded-full border-4 border-[#eaedf0] shadow-sm object-cover relative z-10" alt="Profile" />
            </div>

            <h2 className="text-xl font-bold tracking-tight text-gray-900">{adminData?.username}</h2>

            <span className={`mt-2 mb-8 px-4 py-1 rounded-[4px] text-[10px] font-bold uppercase tracking-wider ${adminData?.role_type === 'owneradmin' ? 'bg-[#ffedef] text-[#ff0d39]' : 'bg-blue-100 text-blue-600'}`}>
              {adminData?.role_type}
            </span>

            <div className="w-full pb-4 flex flex-col gap-0 border-none bg-transparent">
              <div className="flex justify-between items-center text-[12px] px-6 py-2.5">
                <span className="font-semibold text-gray-500">{t(`Email`)}</span>
                <span className="font-bold text-gray-900 truncate max-w-[180px]" title={adminData?.email}>{adminData?.email}</span>
              </div>
              <div className="flex justify-between items-center text-[12px] px-6 py-2.5">
                <span className="font-semibold text-gray-500">{t(`Country`)}</span>
                <span className="font-bold text-gray-900">{adminData?.country || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center text-[12px] px-6 py-2.5">
                <span className="font-semibold text-gray-500">{t(`Phone`)}</span>
                <span className="font-bold text-gray-900">{adminData?.phone || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Financial Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 mt-2">

            {/* Balance Card */}
            <div className="rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between transition-all bg-[#eaedf0]">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-0 text-gray-500">{t(`Balance`)}</p>
                <h3 className="text-2xl font-black tracking-tight text-gray-900">{adminData?.amount?.toFixed(2)}</h3>
              </div>
              <div className="p-3 bg-[#ff0d39] text-white rounded-xl shadow-sm">
                <RiLuggageDepositFill size={22} />
              </div>
            </div>

            {/* Deposit Card */}
            <div className="rounded-2xl p-5 shadow-sm border border-gray-100 transition-all border-l-4 border-l-[#00c950] bg-[#eaedf0] mt-2">
              <p className="text-[10px] font-bold uppercase tracking-wider mb-0 text-gray-500">{t(`Total Deposit`)}</p>
              <h3 className="text-xl font-bold text-[#00c950]">{adminSelfPldata?.totalDepositAmount?.toFixed(2)} <span className="text-[10px] font-bold text-gray-500">{adminData?.currency}</span></h3>
            </div>

            {/* Withdrawal Card */}
            <div className="rounded-2xl p-5 shadow-sm border border-gray-100 transition-all border-l-4 border-l-[#ff0d39] bg-[#eaedf0]">
              <p className="text-[10px] font-bold uppercase tracking-wider mb-0 text-gray-500">{t(`Total Withdrawal`)}</p>
              <h3 className="text-xl font-bold text-gray-500">{adminSelfPldata?.totalWithdrawAmount?.toFixed(2)} <span className="text-[10px] font-bold text-gray-500">{adminData?.currency}</span></h3>
            </div>

            {/* Profit / Loss Card */}
            <div className={`rounded-2xl p-5 shadow-sm border border-gray-100 transition-all border-l-4 ${(adminSelfPldata?.totalPL > 0) ? "border-l-indigo-500" : "border-l-[#ff0d39]"} bg-[#eaedf0]`}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-0 text-gray-500">{t(`Profit / Loss`)}</p>
              <h3 className={`text-xl font-bold ${(adminSelfPldata?.totalPL > 0) ? "text-indigo-600" : "text-[#ff0d39]"}`}>
                {(adminSelfPldata?.totalPL > 0 ? "+" : "")}{adminSelfPldata?.totalPL?.toFixed(2) || 0} <span className="text-[10px] font-bold text-gray-500">{adminData?.currency}</span>
              </h3>
            </div>
          </div>
        </div>

        {/* Right Column: Update Settings (Col Span 8) */}
        <div className="lg:col-span-8">
          <div className="rounded-xl p-6 shadow-sm transition-all border border-gray-100 bg-[#eaedf0]">
            <div className="pb-3 mb-6">
              <h2 className="text-[17px] font-bold tracking-tight text-gray-900">{t(`Update Details`)}</h2>
              <p className="text-[12px] mt-1 text-gray-500">Change your profile picture and contact details.</p>
            </div>

            <div className="flex flex-col gap-6">
              {/* Profile Picture Upload Area */}
              <div className="flex items-center gap-5 p-4 rounded-xl shadow-sm border border-gray-100 bg-white">
                <div className="relative">
                  <img src={formData?.profile_picture || logo} className="w-[64px] h-[64px] rounded-full object-cover shadow-sm bg-white" alt="Avatar" />
                  {imageLoading && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-full">
                      <LoadingSpinner size="sm" color="white" thickness="2px" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-gray-900">Profile Picture</label>
                  <div className="text-[10px] text-gray-500 font-medium">JPG, GIF or PNG. 2MB max.</div>
                  <label htmlFor="profilePicture" className="cursor-pointer border border-gray-200 mt-1 bg-white px-3 py-1.5 rounded-[6px] text-[11px] font-semibold hover:bg-gray-50 transition w-max text-gray-700 shadow-sm">
                    Choose New File
                  </label>
                  <input type="file" id="profilePicture" name="profilePicture" accept="image/*" onChange={handleImageChange} className="hidden" />
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">{t(`Email Address`)}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    readOnly={adminData?.role_type !== "owneradmin"}
                    className={`py-3 px-4 rounded-lg text-[13px] font-medium transition-all shadow-sm border border-gray-100 ${adminData?.role_type !== "owneradmin" ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white text-gray-800 outline-none focus:ring-1 focus:ring-gray-300"}`}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">{t(`Country`)}</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    readOnly={adminData?.role_type !== "owneradmin"}
                    className={`py-3 px-4 rounded-lg text-[13px] font-medium transition-all shadow-sm border border-gray-100 ${adminData?.role_type !== "owneradmin" ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white text-gray-800 outline-none focus:ring-1 focus:ring-gray-300"}`}
                  />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">{t(`Phone Number`)}</label>
                  <input
                    type="number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    readOnly={adminData?.role_type !== "owneradmin"}
                    className={`py-3 px-4 rounded-lg text-[13px] font-medium transition-all shadow-sm border border-gray-100 ${adminData?.role_type !== "owneradmin" ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white text-gray-800 outline-none focus:ring-1 focus:ring-gray-300"}`}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="bg-[#d90429] text-white font-bold py-2.5 px-6 rounded-lg shadow-sm transition-all active:scale-95 hover:bg-[#b0021f] disabled:opacity-70 flex items-center justify-center min-w-[150px] uppercase text-[11px] tracking-widest"
                >
                  {loading ? <LoadingSpinner size="sm" thickness="2px" color="white" /> : t('Save Changes')}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default MyProfile;
