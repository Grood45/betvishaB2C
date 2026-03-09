// PaymentPage.js
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import { Badge, Spinner, useToast } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import tricks from '../assets/tricks.png'
import { HiInformationCircle } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
const Payment = () => {
  const navigate=useNavigate()
    const params = new URLSearchParams(window.location.search);
    const singleDepositDataString = params.get('singleDepositData');
  const [copiedItem, setCopiedItem] = useState(null);
    const [depositLoading,setDepositLoading]=useState(false)
    // Parse the nested object back into an object
    const singleDepositData = JSON.parse(singleDepositDataString);
    const amount = params.get('amount');
  const singleUserDetails = useSelector((state) => state?.auth); 
  const userData=singleUserDetails?.singleUserData
  const { data } = useSelector((state) => state.auth.user);
  const [imageUploadLoading,setImageUploadLoading]=useState(false)
 const toast=useToast()
    const copyToClipboard = (text) => {
        navigator.clipboard
          .writeText(text)
          .then(() => {
            setCopiedItem(text);
            toast({
              title: ` ${text} has been copied`,
              status: "success",
              duration: 2000,
              isClosable: true,
              position: "top",
            });
          })
          .catch((err) => console.error("Failed to copy: ", err));
      };
      const [depositSucces,setDepsoitSucces]=useState(false)
      const [formData, setFormData] = useState({});
      const [fileData, setFileData] = useState({});
    const [selectedImage,setSelectedImage]=useState('')

      const MakeDepositRequest = async () => {
      
        const payload = {
          method: singleDepositData.gateway,
          method_url: singleDepositData.image,
          username: userData?.username,
          method_id:singleDepositData._id,
          user_id: userData?.user_id,
          user_type: "user",
          payable:"20",
          deposit_amount: amount,
          bonus: singleDepositData?.bonus,
          after_deposit: Number(userData?.amount) + Number(amount),
          wallet_amount: userData?.amount,
          admin_response: "",
          user_details: formData, // Ensure correct property name
          admin_details: singleDepositData.admin_details,
          utr_no: "486",
          currency: userData?.currency,
          site_auth_key: import.meta.env.VITE_API_SITE_AUTH_KEY,
          parent_admin_role_type: userData?.parent_admin_role_type,
          parent_admin_username: userData?.parent_admin_username
        };
        for (let item of singleDepositData?.user_details || []) {
          if (item.required === "true" && !formData[item.name]) {
            toast({
              title: `Please fill out all required fields.`,
              status: "warning",
              duration: 2000,
              isClosable: true,
              position: "top",
            });
            return;
          }
        }
        setDepositLoading(true);

        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/transaction/create-deposit-request/${userData?.username}`,
             payload ,
            {
              headers: {
                token: data?.token,
                usernametoken: data?.usernameToken
              }
            }
          );
      
          setDepositLoading(false);
          setDepsoitSucces(true)

        } catch (error) {
            toast({
                title: error?.response?.data?.message||error?.message,
                status: "error",
                duration: 2000,
                isClosable: true,
              });
          console.error("Error creating deposit request:", error);
          setDepositLoading(false);
        }
      };
      
    
      const handleInputChange = (e, fieldName) => {
        if (e.target.type === "file") {
          const file = e.target.files[0];
          handleImageUpload(file,fieldName);
        
        } else {
          setFormData({
            ...formData,
            [fieldName]: e.target.value
          });
        }
      };

      const handleImageUpload = async (file,fieldName) => {
        setImageUploadLoading(true);
        const formDatas = new FormData();
        formDatas.append("post_img", file);
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/payment/image-url`,
            formDatas,  {
                headers: {
                  token: data?.token,
                  usernametoken: data?.usernameToken
                }
              }
          );

          if (response.data.url) {
            toast({
              title: "Image uploaded successfully",
              status: "success",
              duration: 2000,
              isClosable: true,
            });
            setSelectedImage(response.data.url);
            setFormData({
                ...formData,
                [fieldName]: response.data.url
              });
              setImageUploadLoading(false);
    
          }
          setImageUploadLoading(false)
        } catch (error) {
          console.error("Error uploading image:", error.message);
          toast({
            title: "Error uploading image",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
          setImageUploadLoading(false);
    
        }
      };
      const [timeLeft, setTimeLeft] = useState(1 * 60); // Convert minutes to seconds
      const [isPending, setIsPending] = useState(false);
    
      useEffect(() => {
        if (timeLeft <= 0) {
          setIsPending(true);
          return;
        }
    
        const timerInterval = setInterval(() => {
          setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
    
        return () => clearInterval(timerInterval);
      }, [timeLeft]);
    
      const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
      };
    return (
        <>
   {!depositSucces?
     <div className="min-h-screen  flex items-center justify-center bg-gray-100">
        <div className='max-w-md w-full bg-white rounded-lg shadow-lg'>
        <div className="text-gray-600 bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 ... rounded-b-[50%] p-4 w-full">
            <p className="font-bold text-center  w-[100%] text-red-600  text-2xl">  {isPending ? 'Pending....' : formatTime(timeLeft)} <span>{isPending ? '' : 'Minutes'}</span></p>
           
          </div>
      <div className=" p-6 ">
     
        <div className="text-center mb-6">
          <h2 
          
          className="text-2xl font-medium text-green-500">{singleDepositData?.gateway}</h2>
         
        </div>
        <div  
        className="flex justify-center  w-[80%] pb-8 m-auto mb-6">
          {/* <QRCode value="https://example.com" size={250} style={{paddingTop:"20px"}} /> */}
          <img src={singleDepositData?.qr_code} alt="" className='h-[200px] w-[100%]' />
        </div>
        {/* <div className="text-end text-red-500 mb-4">
          UPI error, <span className="text-blue-500 cursor-pointer">Switch Account</span>
        </div> */}
        {singleDepositData?.admin_details && (
    <>
    {singleDepositData?.admin_details?.map((item,index)=>{
        return (
          <div key={index} className="flex justify-between items-center mb-1" >
            <div className='flex flex-col'>
              <span className="text-gray-700">{item?.fieldName}</span>
              <span className="mr-2 text-purple-500">{item?.fieldValue}</span>
            </div>
            <div onClick={()=>copyToClipboard(item?.fieldValue)} className="flex items-center">
              <button className="bg-purple-500 text-white px-4 py-1 text-xs rounded">Copy</button>
            </div>
          </div>
        )
  
    })}
      

    </>
   )}
        <div className="flex justify-between items-center mb-4">
        <div className='flex  flex-col'>
            <span className="text-gray-700">Amount</span>
            <span className="mr-2 text-purple-500 ">{amount}</span>
            </div>
          <div className="flex items-center">
            <button  onClick={()=>copyToClipboard(amount)} className="bg-purple-500 text-white px-4 text-xs py-1 rounded">Copy</button>
          </div>
        </div>
        {singleDepositData?.user_details?.map((item, index) => {
    return (
        <div key={item.id} className="mb-1">
        <label className="block text-gray-700 mb-2">{item?.name}</label>
        {item?.type === "file" ? (
          <input
          id="file-upload"
          type="file"
          accept="image/*"
            onChange={(e) => handleInputChange(e, item?.name)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <input
            type={item?.type}
            value={formData[item?.name] || ""}
            onChange={(e) => handleInputChange(e, item?.name)}
            required={item?.required === "true"}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
        )}
        {item.type=="file"&&imageUploadLoading?<Spinner/>:""}
        {item?.required === "true" && (
          <span className="text-red-500 text-sm">required</span>
        )}
      </div>
    )
  })}

        <div className="text-center">
          <button onClick={MakeDepositRequest} className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
           {depositLoading?<Spinner/> :"Submit"}
          </button>
        </div>
        <div className='bg-purple-200 flex items-start gap-1 justify-start rounded-lg   p-2 mt-2'>
       
       <span> <HiInformationCircle  fontSize={"20px"}/></span>
        <p className='flex text-[11px] font-bold leading-[14px]'>{singleDepositData?.instruction}</p>
        </div>

      </div>
      </div>

    </div>
    :
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className='max-w-md w-full bg-white rounded-lg shadow-lg'>
        <div className="text-gray-600 bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 ... rounded-b-[50%] p-4 py-8 w-full">
            <p className="font-bold text-center text-white w-[100%]  text-[30px]">Thank You !!</p>
          </div>
      <div className=" p-6 ">
     
        <div className="text-center mb-6">
          <h2 
          
          className="text-2xl font-medium text-green-500">Cashthru</h2>
           <h2 
          
          className="text-sm mt-2 font-semibold text-gray-400  ">Thank you for transacting with us:</h2>
        </div>
        <div  
      
        className="flex justify-center  w-[80%] pb-8 m-auto mb-0">
          <img src={tricks}  className='w-[150px]'/>
        </div>
        <div className='flex items-center justify-center'>
        <button onClick={()=>navigate("/Deposit")} className='p-2 rounded-md font-bold text-white bg-[#3C8FE6] w-[80%]'>Go Back</button>

        </div>
        <div className=" w-[80%] m-auto  mb-4">
        <p className='text-[14px] leading-5 text-center mt-2 font-semibold text-gray-400 '>You have successfully submitted your reference number. please close this tab !</p>
        </div>
    
   

       
      </div>
      </div>

    </div>
    }
    </>
  );
};

export default Payment;
