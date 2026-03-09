
import React, { useEffect, useState } from "react";

import { BsSearch } from "react-icons/bs";

import { RxCross2 } from "react-icons/rx";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import BankDetails from "../component/withdrawalGetway/BankDetails";
import { CircularProgress, Switch, useToast } from "@chakra-ui/react";
// import {
//   fetchGetRequest,
//   sendDeleteRequest,
//   sendPatchRequest,
//   sendPostRequest,
// } from "@/api/api";
import { FaArrowLeftLong } from "react-icons/fa6";
import logo from '../assets/logo.png'
import UserDetails from "../component/withdrawalGetway/UserDetails";
import { useSelector } from "react-redux";
import { IoSearchOutline } from "react-icons/io5";
// import DepositUpdateModel from "../component/depositgetway/DepositUpdateModel";
import { MdModeEdit } from "react-icons/md";
import { BiMoneyWithdraw, BiSolidBank } from "react-icons/bi";
import { fetchGetRequest, sendDeleteRequest, sendPatchRequest, sendPostRequest } from "../api/api";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import { useTranslation } from "react-i18next";

const initialFormData = {
  gateway: "",
  currency: "",
  processing_time: "",
  image: "",
  max_limit: 0,
  min_limit: 0,
  instruction: "",
  admin_details: [],
  user_details: [],
  bonus: 0,
  type: "deposit",
};
const initialField = {
  name: "",
  type: "",
  required: "",
};

const ManualWithdrawal = () => {
    const [show, setShowWithdral] = useState(false);
    const [gateways, setGateways] = useState(initialFormData.admin_details);
    const [selectedImage, setSelectedImage] = useState(null);
    const [formData, setFormData] = useState(initialFormData);
    const [formFields, setFormFields] = useState(initialFormData.user_details);
    const [paymentData, setPaymentData] = useState([]);
    const [statusLoading, setStatusLoading] = useState(true);
    const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};
const { t, i18n } = useTranslation();

    const toast = useToast();
    const [getLoading, setGetLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateId, setUpdateId] = useState("");
  const [showUpdateButton,setShowUpdateButton]=useState(false)
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
  
    const handleGetway = () => {
      setFormData(initialFormData)
      setGateways(initialFormData.admin_details)
      setFormFields(initialFormData.user_details)
      setShowWithdral(true);
      setShowUpdateButton(true)
      setSelectedImage(null);
    };
  
    const handleImageChange = (event) => {
      const file = event.target.files[0];
      handleImageUpload(file);
    };
  
    const handleFormChange = (e) => {
      const { value, name } = e.target;
      setFormData({ ...formData, [name]: value });
    };
    // handle status update here
  
    const handleUpdateStatus = async (id) => {
      setStatusLoading(true);
      try {
        const response = await sendPatchRequest(
          `${import.meta.env.VITE_API_URL}/api/payment/update_payment_method_status/${id}`
        );
        let updated_data = paymentData.map((ele) => {
          if (ele._id == id) {
            ele = response.data;
            return ele;
          } else {
            return ele;
          }
        });
        setPaymentData(updated_data);
        toast({
          title: response.message,
          status: "success",
          duration: 2000,
          position: "top",
          isClosable: true,
        });
        setStatusLoading(false);
      } catch (error) {
        console.error("Error uploading image:", error.message);
        toast({
          title: error.message,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
      setStatusLoading(false);
    };
    const deletePaymentGateway = async (id) => {
      try {
        const response = await sendDeleteRequest(
          `${import.meta.env.VITE_API_URL}/api/payment/delete-payment-method/${id}`
        );
        let updated_data = paymentData.filter((ele) => ele._id !== id);
        setPaymentData(updated_data);
        toast({
          title: response.message,
          status: "success",
          duration: 2000,
          position: "top",
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: error?.data?.message || error?.message,
          status: "error",
          duration: 2000,
          position: "top",
          isClosable: true,
        });
      }
    };
    const getPaymentGateway = async () => {
      setGetLoading(true)
      try {
        const response = await fetchGetRequest(
          `${import.meta.env.VITE_API_URL}/api/payment/get-payment-method-admin?type=withdraw`
        );
        setPaymentData(response.data);
      setGetLoading(false)

      } catch (error) {
        toast({
          title: error?.data?.message || error?.message,
          status: "error",
          duration: 2000,
          position: "top",
          isClosable: true,
        });
      setGetLoading(false)

      }
    };
  
    const handleImageUpload = async (file) => {
      setLoading(true);
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
          setSelectedImage(response.url);
      setLoading(false);
        }
      } catch (error) {
        toast({
          title: "Error uploading image",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      setLoading(false);

      }
    };
  
    const handleSubmitGateway = async () => {
      const payload = {
        ...formData,
        admin_details: gateways,
        user_details: formFields,
        image: selectedImage,
        type: "withdraw",
        admin_id: adminData.admin_id,
      };
     
      setAddLoading(true);
      try {
        const response = await sendPostRequest(
          `${import.meta.env.VITE_API_URL}/api/payment/add-method`,
          payload
        );
        toast({
          title: response.message,
          status: "success",
          duration: 2000,
          position: "top",
          isClosable: true,
        });
        setAddLoading(false);
        setFormData(initialFormData);
        getPaymentGateway()
        setShowWithdral(false)
        setTimeout(() => {
          window.location.reload();
        }, 700);
      } catch (error) {
        toast({
          title: error?.data?.message,
          status: "error",
          position: "top",
          duration: 2000,
          isClosable: true,
        });
        setAddLoading(false);
      }
    };
    const handleUpdate = async () => {
      setUpdateLoading(true)
      const payload = {
        ...formData,
        admin_details: gateways,
        user_details: formFields,
        image: selectedImage,
        type: "withdraw",
        admin_id: adminData.admin_id,
      };
     
      try {

        const response = await sendPatchRequest(
          `${import.meta.env.VITE_API_URL}/api/payment/update-payment-method/${updateId}`,
          payload
        );
        toast({
          title: response.message,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        getPaymentGateway()
        setUpdateLoading(false)
      setShowUpdateButton(false)
  
        setShowWithdral(false)
      } catch (error) {
        setUpdateLoading(true)
  
        toast({
          title: error?.data?.message || error?.message,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    };
    useEffect(() => {
      getPaymentGateway();
    }, []);
  
  
    const handleUpdateData = (data) => {
      setFormData(data);
    
      
  setGateways(data.admin_details)
  setFormFields(data.user_details)
  setUpdateId(data._id)
      setShowWithdral(true);
      setSelectedImage(data.image);
    };
 

  return (
    <div className=" mt-8">
         {!show&&<p 
         style={{color:iconColor}}
         className={`font-bold mt-5 ml-3 md:ml-10 w-[100%]    flex items-center gap-2 rounded-[6px]  text-lg`}>
        <BiMoneyWithdraw
         style={{color:iconColor}}
        
        fontSize={"30px"}  />
        {t(`Manual`)} {t(`Withdraw`)}
      </p>}
      {!show ? (
        <div>
          <div className={`flex justify-between md:px- mt-10   w-[90%]  m-auto items-center`}>

          <div 
          style={{border:`1px solid ${border}`}}
          className={`    bg-white justify-between rounded-[8px] pl-1 flex items-center gap-2 w-[100%] lg:w-[30%] `}>
            <input
              placeholder={`${t(`Search here`)}...`}
              className={`outline-none rounded-[8px] p-[6px]  text-black text-xs md:text-sm  w-[70%]`}
            />
            <span 
            style={{backgroundColor:bg}}
            className={`p-[6px] border  rounded-r-[8px] cursor-pointer `}>
              <IoSearchOutline fontSize={"22px"} color="white" />
            </span>
          </div>           
           <div className={` flex items-end justify-end  w-[100%]  lg:w-[30%]  gap-4  `}>
              <button
                onClick={handleGetway}
                style={{backgroundColor:bg}}
                className={`  px-3 flex gap-3 text-xs items-center  text-white  font-semibold rounded-[10px] pl-3 py-3 md:py-4`}
              >
                <span>
                  <AiOutlinePlus color="white" />
                </span>{" "}
                {t(`Add`)} {t(`new`)} {t(`Gateway`)}
              </button>
            </div>

          
          </div>

          <div className="p-4 mt-5 ml-10">

{getLoading?<LoadingSpinner size="xl" color="green" thickness="4px"/>:""}
</div>
<div className="grid grid-cols-1 md:grid-cols-2 text-white lg:grid-cols-3 justify-center w-[100%]  m-auto lg:w-[90%] gap-5 sm:gap-10 mt-5 ">
{paymentData&&paymentData?.map((item) => {
 return (
                <div
                  key={item.id}
                  style={{backgroundColor:bg}}
                  className={` p-3 flex flex-col  justify-between h-[230px] w-[100%] rounded-2xl`}
                >
                  <div className="flex justify-between w-[100%]">
                    <div className="flex  gap-3 items-center">
                      <img
                        src={item.image}
                        className="w-[50px] h-[50px] rounded-[50%]"
                        alt={"logo"}
                        width={50}
                        height={50}
                      />
                      <div>
                        <p className=" text-sm font-bold ">
                          {item.gateway}
                        </p>
                        <p className="text-green-800 text-sm font-bold ">
                          + {item.bonus}
                        </p>
                      </div>
                    </div>
                    <div onClick={() => deletePaymentGateway(item._id)}>
                      <RxCross2
                        cursor="pointer"
                        color="white"
                        fontSize="25px"
                      />
                    </div>
                  </div>
                  <div className="flex items-end justify-end px-2">
                  <button
                      className={` text-xs w-[70px] rounded-md ${
                        !item.status ? "bg-red-500" : "bg-green-500"
                      }  p-[4px] px-2`}
                    >
                      {item.status ? "Enabled" : "Disabled"}
                    </button>

                  </div>
                
                  <div className="flex justify-between px-2">
                   
                    
                    <p className=" text-sm font-bold flex gap-2 ">
                      {" "}
                      <Switch
                        colorScheme="blue"
                        size="md"
                        defaultChecked={item.status}
                        onChange={() => handleUpdateStatus(item._id)}
                      />{" "}
                      {t(`Status`)}
                    </p>
                    <button
                    className={`text-xs w-[40%] flex items-center justify-center font-bold gap-2 rounded-lg p-1 px-2 bg-white text-black border`}
                    onClick={() => handleUpdateData(item)}
                  >
                    <MdModeEdit 
                    style={{color:iconColor}}
                    fontSize={"20px"}/>
                    {t(`Edit`)}
                  </button>
                  </div>
                 
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          {/* first layer */}
          <FaArrowLeftLong onClick={()=>{
            setShowWithdral(false)
            setShowUpdateButton(false)
            setFormData(initialFormData)
            }}
            style={{color:iconColor}}
            
            className={`ml-10 cursor-pointer `} fontSize={"20px"}/>

          <div className=" w-[95%] md:w-[85%] m-auto gap-4 flex flex-col md:flex-row justify-between">
            <div
          style={{border:`1px solid ${border}`}}
             
              className={`w-[55%] sm:w-[35% \]  bg-white m-auto md:w-[20%] flex flex-col relative items-center justify-center rounded-[12px] h-[190px]`}
            >
               
              {selectedImage ? (
                <img
                  src={selectedImage}
                  className="w-[110px] rounded-[50%] h-[110px]"
                  alt="Selected"
                />
              ) : (
                <img
                  src="https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png"
                  className="w-[140px]"
                />
              )}
              {loading &&
                <LoadingSpinner
                 
                  size={"sm"}
                  color="orange.400"
                  thickness="2px"
                />
               }
              <label htmlFor="file-upload" className="cursor-pointer">
                <span
                  className={`rounded-[30%] p-2 absolute right-[30px] bottom-[50px] bg-[#0075FF] flex items-center justify-center`}
                >
                  <MdEdit color="white" fontSize="20px" />
                </span>
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </div>
            
            <div
          style={{border:`1px solid ${border}`}}

            
              className={` w-[95%] md:w-[85%]  bg-white font-semibold flex m-auto justify-between items-center p-4 rounded-[12px] h-[100%] md:h-[190px]`}
            >
              <div className="w-[100%] flex px-2 flex-col md:flex-row   gap-3 justify-between ">
                <div className={`text-xs w-[100%] md:w-[60%]  flex flex-col gap-2`}>
                  <label>{t(`Gateway`)} {t(`Name`)}</label>
                  <input
          style={{border:`1px solid ${border}`}}
                    
                    name="gateway"
                    value={formData.gateway}
                    onChange={(e) => handleFormChange(e)}
                    placeholder="Enter Getway Name"
                    className={`w-[100%] text-xs   outline-none rounded-[12px] p-2`}
                  />
                </div>
                <div className="text-xs  w-[100%] md:w-[40%]  flex flex-col gap-2">
                  <label>{t(`Currency`)}</label>
                  <input
          style={{border:`1px solid ${border}`}}
                    
                    name="currency"
                    value={formData.currency}
                    onChange={(e) => handleFormChange(e)}
                    placeholder="Enter Currency"
                    className={`w-[100%]  text-xs   border outline-none  rounded-[12px] p-2`}
                  />
                </div>
                <div className="text-xs  w-[100%] md:w-[40%]  flex flex-col gap-2">
                  <label>{t(`Processing`)} {t(`Time`)}</label>
                  <input
          style={{border:`1px solid ${border}`}}
                   type="number"
                    name="processing_time"
                    value={formData.processing_time}
                    onChange={(e) => handleFormChange(e)}
                    placeholder="Enter Processing Time"
                    className={`w-[100%]  text-xs   border outline-none  rounded-[12px] p-2`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* secondlayer */}
          {/* <BankDetails   gateways={gateways} setGateways={setGateways} /> */}

{/* thirdlayer */}

<UserDetails formFields={formFields} setFormFields={setFormFields} />

          {/* fourthlayer */}
          <div className=" w-[95%] md:w-[85%] mt-5 m-auto gap-4 flex flex-col md:flex-row justify-between">
            <div
          style={{border:`1px solid ${border}`}}

             
              className={`w-[100%%] md:w-[85%]  bg-white border font-semibold rounded-[12px] h-[280px]`}
            >
              <div className="w-[100%] flex flex-col pl-3 mt-5 px-2   gap-3 justify-between ">
                <p className=" text-sm font-bold ">
                  {t(`Deposit`)} {t(`Instruction`)}
                </p>
                <textarea
          style={{border:`1px solid ${border}`}}
                  
                  value={formData?.instruction}
                  onChange={(e) => handleFormChange(e)}
                  name="instruction"
                  placeholder="Instruction"
                  className={`min-h-[170px] outline-none p-4  rounded-[12px]  bg-[none] `}
                ></textarea>
              </div>
            </div>

            <div
          style={{border:`1px solid ${border}`}}
            
              className={`w-[100%]  bg-white md:w-[60%] rounded-[12px] h-[280px]`}
            >
              <div className="w-[100%] flex flex-col pl-3 mt-5 px-2   gap-3 justify-between ">
                <p className=" text-sm font-bold ">{t(`Deposit`)} {t(`Range`)}</p>
                <div className="text-xs w-[90%]  flex flex-col gap-2">
                  <label>{t(`Min`)} {t(`Limit`)}</label>
                  <input
                  
                    placeholder="Enter Min"
                    name="min_limit"
                    value={formData.min_limit}
                    onChange={(e) => handleFormChange(e)}
          style={{border:`1px solid ${border}`}}
          type="number"

                    className={`w-[100%] text-xs   outline-none rounded-[12px] p-2`}
                  />
                </div>
                <div className="text-xs w-[90%]  flex flex-col gap-2">
                  <label>{t(`Max`)} {t(`Limit`)}</label>
                  <input
          style={{border:`1px solid ${border}`}}

          type="number"
                   
                    name="max_limit"
                    value={formData.max_limit}
                    onChange={(e) => handleFormChange(e)}
                    placeholder="Enter Max"
                    className={`w-[100%] text-xs    outline-none  rounded-[12px] p-2`}
                  />
                </div>
                {/* <div className="text-xs w-[90%]  flex flex-col gap-2">
                  <label>Bonus</label>
                  <input
          style={{border:`1px solid ${border}`}}
                    
                    name="bonus"
                    type="number"
                    value={formData.bonus}
                    onChange={(e) => handleFormChange(e)}
                    placeholder="Enter Bonus"
                    className={`w-[100%] text-xs  outline-none  rounded-[12px] p-2`}

                  />
                </div> */}
              </div>
            </div>
          </div>
          {/* button */}
          {showUpdateButton? <div className="w-[85%]  mt-6 m-auto">
            <button
             
              onClick={() => handleSubmitGateway()}
              style={{backgroundColor:bg}}
              className={`p-3 text-white text-xs font-semibold w-[100%] rounded-[5px]  `}
            >
              {!addLoading ? (
                `${t(`Add`)} ${t(`Gateway`)}`
              ) : (
                <div className="flex justify-center items-center">
                  <div className="w-5 h-5 border-4 border-blue-500 rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          </div>:<div className="w-[85%]  mt-6 m-auto">
            <button
             
              onClick={()=>handleUpdate(formData.id)}
              style={{backgroundColor:bg}}
              className={`p-3 text-white text-xs font-semibold w-[100%] rounded-[5px]  `}

            >
              {!updateLoading ? (
                `${t(`Update`)}`
              ) : (
                <div className="flex justify-center items-center">
                  <div className="w-5 h-5 border-4 border-blue-500 rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          </div>}
        </div>
      )}
    </div>
  );
};

export default ManualWithdrawal;
