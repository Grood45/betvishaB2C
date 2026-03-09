import React, {
    ChangeEvent,
    ChangeEventHandler,
    useEffect,
    useState,
  } from "react";
  // import logo from "../../assets/logo.png";
  import { AiOutlinePlus } from "react-icons/ai";
  import { CircularProgress, Progress, useToast } from "@chakra-ui/react";
  import { useParams } from "react-router-dom";
  import { useSelector } from "react-redux";
  import { sendPatchRequest } from "../../api/api";
  import { useTranslation } from "react-i18next";
  import { MdFileCopy } from "react-icons/md";
  
  
  
  
  
  const AffilateProfile = ({type, userData }) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
      _id: "",
      first_name: "",
      last_name: "",
      username: "",
      password: "",
      user_id: "",
      email: "",
      state: "",
      phone: "",
      city: "",
      country: "",
      account_number: "",
      bank_details:{
        bank_name:"",
        bank_holder:"",
        account_number:"",
        ifsc_code:""
      },
      whatsapp_no:"",
      joined_at: "",
      updated_at: "",
      status: true,
      bet_supported: true,
      is_blocked: true,
      is_online: true,
      last_seen: "",
      profile_picture: "",
      referral_code: "",
      amount: 0,
      exposure_limit: 0,
      max_limit: 0,
      min_limit: 0,
      sms_verified: true,
      kyc_verified: true,
    });
    const param = useParams();
    const { t, i18n } = useTranslation();
  
    const toast = useToast();
    const { color,primaryBg,secondaryBg, bg,iconColor,hoverColor,hover,text, font, border } = useSelector(state => state.theme);
    const handleUpdate = async () => {
      setLoading(true);
      let url;
      if(type==="user"){
         url = `${import.meta.env.VITE_API_URL}/api/admin/update-single-user/${param.id}`
      }
      else{
        url = `${import.meta.env.VITE_API_URL}/api/admin/update-single-admin/${param.id}`
      }
      try {
        let response = await sendPatchRequest(url, formData);
        const data = response.data;
        setData(data);
        toast({
          description: `${response?.message}`,
          status: "success",
          duration: 4000,
          position: "top",
          isClosable: true,
        });
        setLoading(false);
  
      } catch (error) {
        console.log(error,"error")
        toast({
          description: `${error?.message}`,
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
console.log(name,value,"nam value")
if(name=="bank_name"||name=="bank_holder"||name=="ifsc_code"||name=="account_number"){
  setFormData((prev) => ({ ...prev, bank_details:{...formData.bank_details, [name]:value }}));

}
else{
  setFormData((prev) => ({...prev, [name]: value }));
}
    };
  
    useEffect(() => {
      setFormData(userData);
    }, [param.id]);
    return (
      <div className="flex gap-4">
        <div className="flex flex-col w-[100%] gap-6">
        
  
          <div
          style={{border:`1px solid ${border}`}}
            className={`w-[100%] flex bg-white text-black flex-col  justify-between m-auto mt-5  p-5 rounded-[20px] `}
          >
            <p className=" text-sm  font-bold ">{t(`Basic`)} {t(`Info`)}</p>
  
            <div className="w-[100%]  grid grid-cols-2   mt-4   gap-3 justify-between ">
              <div className="text-xs w-[90%]  flex flex-col gap-2">
                <label className="font-bold">{t(`Username`)}</label>
                <input
                  value={formData?.username}
                  name="first_name"
                  onChange={handleChange}
                  readOnly
                  placeholder="First Name"
                  style={{border:`1px solid ${border}`}}
                  className={`w-[100%] text-xs border  bg-[#E9ECEF]   outline-none rounded-[10px] p-2`}
                />
              </div>
  
              <div className="text-xs w-[90%] flex flex-col gap-1">
                <label className="font-bold">{t(`Email`)}</label>
                <input
                  name="email"
                  value={formData?.email}
                  onChange={handleChange}
                  style={{border:`1px solid ${border}`}}
                  placeholder="Email"
                  // readOnly
                  className={`w-[100%] text-xs   border  bg-[#E9ECEF]   outline-none  rounded-[10px] p-2`}
                />
              </div>
              <div className="text-xs w-[90%]  flex flex-col gap-1">
                <label className="font-bold">{t(`Phone`)}</label>
                <input
                  value={formData?.phone}
                  name="phone"
                  onChange={handleChange}
                  style={{border:`1px solid ${border}`}}
                  placeholder="Phone Number"
                  className={`w-[100%] text-xs   border bg-[#E9ECEF]     outline-none  rounded-[10px] p-2`}
                />
              </div>
              <div className="text-xs w-[90%]  flex flex-col gap-1">
                <label className="font-bold">{t(`Whatsapp Number`)}</label>
                <input
                  name="whatsapp_no"
                  
                  value={formData?.whatsapp_no}
                  onChange={handleChange}
                  style={{border:`1px solid ${border}`}}
                  placeholder="Entere your whatsapp number"
                  className={`w-[100%] text-xs border bg-[#E9ECEF]    outline-none rounded-[10px] p-2`}
                />
              </div>
            </div>
  
            <div className=" flex   w-[100%] mt-4  justify-between">
           
  
              {/* <div className="text-xs w-[90%] flex flex-col gap-1">
                <label className="font-bold">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData?.state}
                  onChange={handleChange}
                  style={{border:`1px solid ${border}`}}
                  placeholder="State"
                  className={`w-[100%] text-xs border bg-[#E9ECEF]   outline-none rounded-[10px] p-2`}
                />
              </div> */}
  
              <div className="text-xs w-[90%]  flex flex-col gap-1">
                <label className="font-bold">{t(`Country`)}</label>
                <input
                  name="country"
                  value={formData?.country}
                  onChange={handleChange}
                  style={{border:`1px solid ${border}`}}
                  placeholder="Country"
                  className={`w-[90%] text-xs border  bg-[#E9ECEF]    outline-none rounded-[10px] p-2`}
                />
              </div>
              <div className="text-xs w-[90%]  flex flex-col gap-1">
                <label className="font-bold">{t(`Currency`)}</label>
                <input
                  name="country"
                  value={formData?.currency}
                  onChange={handleChange}
                  readOnly
                  style={{border:`1px solid ${border}`}}
                  placeholder="Country"
                  className={`w-[90%] text-xs border  bg-[#E9ECEF]    outline-none rounded-[10px] p-2`}
                />
              </div>
            </div>
          </div>
  
          {/* Bank Details */}
          {/* { type==='user'&&  type=="affilate"*/}
          <div
            style={{border:`1px solid ${border}`}}
            className={`w-[100%] bg-white flex flex-col justify-between m-auto mt-3  p-5 rounded-[20px] `}
          >
            <p className=" text-sm  font-bold ">{t(`Bank`)} {t(`Details`)}</p>
  
            <div className="w-[100%]  grid grid-cols-2   mt-4  pb-8  gap-3 justify-between ">
              <div className="text-xs w-[90%] relative  flex flex-col gap-2">
                <label className="font-bold">{t(`Bank`)} {t(`Name`)}</label>
                
                <input
                  name="bank_name"
                  value={formData?.bank_details?.bank_name}
                  onChange={handleChange}
                  placeholder="Bank Name"
                  style={{border:`1px solid ${border}`}}
                  className={`w-[100%] text-xs  bg-[#E9ECEF]    outline-none rounded-[10px] p-2`}
                />
                <span className="absolute top-8 right-4"><MdFileCopy cursor={'pointer'} color="green" fontSize={"18px"} /></span>
              </div>
              <div className="text-xs w-[90%] relative flex flex-col gap-1">
                <label className="font-bold">{t(`Bank`)} {t(`Holder`)}</label>
                <input
                  name="bank_holder"
                  value={formData?.bank_details?.bank_holder}
                  onChange={handleChange}
  
                  style={{border:`1px solid ${border}`}}
                  placeholder="Bank Holder"
                  className={`w-[100%] text-xs    bg-[#E9ECEF]    outline-none  rounded-[10px] p-2`}
                />
                <span className="absolute top-7 right-4"><MdFileCopy cursor={'pointer'} color="green" fontSize={"18px"} /></span>
  
              </div>
              <div className="text-xs w-[90%]  relative flex flex-col gap-1">
                <label className="font-bold">{t(`Account`)} {t(`Number`)}</label>
                <input
                  name="account_number"
                  value={formData?.bank_details?.account_number}
                  onChange={handleChange}
                  placeholder="Account Number"
                  style={{border:`1px solid ${border}`}}
                  className={`w-[100%] text-xs    bg-[#E9ECEF]   outline-none  rounded-[10px] p-2`}
                />
                <span className="absolute top-7 right-4"><MdFileCopy cursor={'pointer'} color="green" fontSize={"18px"} /></span>
  
              </div>
              <div className="text-xs w-[90%] relative flex flex-col gap-1">
                <label className="font-bold"> {t(`Code`)}</label>
                <input
                  value={formData?.bank_details?.ifsc_code}
                  onChange={handleChange}
                  name="ifsc_code"
                  placeholder="IFSC Code"
                  style={{border:`1px solid ${border}`}}
                  className={`w-[100%] text-xs    bg-[#E9ECEF]     outline-none  rounded-[10px] p-2`}
                />
                <span className="absolute top-7 right-4"><MdFileCopy cursor={'pointer'} color="green" fontSize={"18px"} /></span>
  
              </div>
            </div>
          </div>
  
  
          {/* User withdraw Limit */}
  
  
          {userData.role_type=="user"&&<div
            style={{border:`1px solid ${border}`}}
            className={`w-[100%] flex flex-col bg-white justify-between m-auto mt-3  p-5 rounded-[20px] `}
          >
            <p className=" text-sm  font-bold ">{t(`Withdraw`)} {t(`Limit`)}</p>
  
            <div className="w-[100%]  grid grid-cols-2   mt-4  pb-8  gap-3 justify-between ">
              <div className="text-xs w-[90%]  flex flex-col gap-2">
                <label className="font-bold">{t(`Min`)} {t(`Limit`)}</label>
                <input
                  name="min_limit"
                  value={formData?.min_limit}
                  onChange={handleChange}
                 
                  placeholder="Bank Name"
                  style={{border:`1px solid ${border}`}}
                  className={`w-[100%] text-xs border bg-[#E9ECEF]    outline-none rounded-[10px] p-2`}
                />
              </div>
              <div className="text-xs w-[90%]  flex flex-col gap-1">
                <label className="font-bold">{t(`Max`)} {t(`Limit`)}</label>
                <input
                  name="max_limit"
                  value={formData?.max_limit}
                  onChange={handleChange}
                  
                  placeholder="Bank Holder"
                  style={{border:`1px solid ${border}`}}
                  className={`w-[100%] text-xs   border bg-[#E9ECEF]   outline-none  rounded-[10px] p-2`}
                />
              </div>
             
            </div>
          </div>}
  
  
          {/* button */}
          <div className="w-[100%] mb-10  m-auto">
            <button
              onClick={handleUpdate}
              disabled={loading}
              style={{backgroundColor:bg}}
              className={`p-3 text-white  text-xs font-semibold w-[100%] rounded-[5px]`}
            >
              {loading ? <CircularProgress size={"15px"} /> : `${t(`Save`)} ${t(`Changes`)}`}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default AffilateProfile;
  
  
  
  
  // const socket = io('${process.env.NEXT_PUBLIC_BASE_URL}');
  
  // const sendNotification = () => {
  //   socket.emit('sendNotification', { message: notificationMessage });
  //   setNotificationMessage(''); // Clear the input field after sending the notification
  // };
  
  // useEffect(() => {
  //   // Listen for 'adminNotification' event
  //   socket.on('adminNotification', (data) => {
  //     // Update notifications in the state when a new notification is received
  //     setNotifications([...notifications, data.message]);
  //   });
  
  //   // Clean up event listener on component unmount
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);