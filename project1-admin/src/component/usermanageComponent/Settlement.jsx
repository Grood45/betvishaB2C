'use client'
import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { PiBankFill } from "react-icons/pi";
import { GiBank } from "react-icons/gi";
import { BiSolidBank } from "react-icons/bi";
import { sendPostRequest } from "../../api/api";
import LoadingSpinner from "../loading/LoadingSpinner";
import { useTranslation } from "react-i18next";


function Settlement({ userData,
  getData,title}) {

const { color,primaryBg,secondaryBg, iconColor,bg,hoverColor,hover,text, font, border } = useSelector(state => state.theme);
const [withdrawResponse,setWithdrawResponse]=useState("")

const { isOpen, onOpen, onClose } = useDisclosure();
const [amount, setAmount] = useState(0);
const [totalBalance, setTotalBalance] = useState();
const [loading, setLoading] = useState(false);
const params = useParams();
const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};
  const { t, i18n } = useTranslation();

const toast = useToast();
const subtractBalance = async () => {
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
      username: userData.username,
      withdraw_amount: Number(amount),
      admin_response: withdrawResponse,
      parent_admin_id: adminData.admin_id,
      [userKey]: userData[userKey], 
      user_type: title  ,
      currency:userData?.currency ,
      approved_by_username:adminData?.username,
      approved_by_role_type:adminData?.role_type,
     approved_by_admin_id:adminData?.admin_id


    };
 
    
    const response = await sendPostRequest(url, requestData);
    setTotalBalance(response.data.amount);
    toast({
      description: `${amount} withdrawal successfully`,
      status: "success",
      duration: 4000,
      position: "top",
      isClosable: true,
    });
    // console.log(response, "response");
    setAmount(0);
    setLoading(false);
    getData();
    onClose();
  } catch (error) {
    console.error("Error adding balance:", error);
    setLoading(false);
    toast({
      description: `${error?.data?.message}`,
      status: "error",
      duration: 4000,
      position: "top",
      isClosable: true,
    });
  }
};
const handleSubtractBalance = (e) => {
  e.preventDefault()
  subtractBalance();
};

    return (
      <>
        <button
         onClick={onOpen}
       style={{backgroundColor:bg}}
               
         className={`w-[100%]  font-semibold text-white text-xs rounded-[5px] p-[7px]`}
              >
                {t(`Settlement`)} {t(`Amount`)}
              </button>
       
              <Modal size="sm" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent style={{ backgroundColor: "white", color: "black" }}>
          <ModalCloseButton />
          <ModalBody>
          <div className=" flex flex-col items-center justify-center mt-5">
                <div className="flex items-center flex-col">
                <BiSolidBank style={{color:iconColor}} fontSize={"40px"}   />
                  <p className="text-sm mt-4 font-bold">{t(`Please`)} {t(`Enter`)} {(t`Your`)} {t(`Amount`)}</p>
                  {/* <p className="text-sm font-medium">Enter your Password to make this change</p> */}

                </div>
                <div className="w-[100%] mt-6">
                  <form onSubmit={handleSubtractBalance}>
                   
                  
                   
                    <div className="mb-4 flex flex-col gap-4">
                        <label
                          className="block mb-1 font-semibold text-sm"
                          htmlFor="password"
                        >
                          {t(`Available`)} {t(`Balance`)}: {userData?.amount?.toFixed(2)}
                        </label>
                       
                      <div>
                        <label
                          className="block mb-1 font-semibold text-sm"
                          htmlFor="confirm_password"
                        >
                          {t(`Enter`)} {t(`Amount`)}:
                        </label>
                        <div className="relative">
                          <input
                          style={{border:`1px solid ${border}`}}
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-3 py-1 outline-none  rounded-md"
                            type="number"  
                            required
                          />
                         
                        </div>
                      </div>
                      <div>
                        <label
                          className="block mb-1 font-semibold text-sm"
                          htmlFor="confirm_password"
                        >
                          {t(`Remarks`)}:
                        </label>
                        <div className="relative">
                          <textarea
                          style={{border:`1px solid ${border}`}}
value={withdrawResponse}
onChange={(e)=>setWithdrawResponse(e.target.value)}
                            className="w-full px-3 py-1 outline-none  rounded-md"
                            type="number"  
                            
                          />
                         
                        </div>
                      </div>
                    </div>
                 
                    <div className="flex flex-col my-5 mt-6 gap-5 justify-between">
                    <button
       style={{backgroundColor:bg}}

                        className={` w-[100%] text-white px-4 font-semibold py-[6px] rounded-md`}
                        type="submit"
                      >
                        {loading?<LoadingSpinner color="white" size="sm" thickness={"2px"}/> :`${t(`Withdraw`)}`}
                      </button>
                      <button
                      onClick={onClose}
                        className="bg-gray-300 font-semibold  w-[100%] py-[6px] rounded-md mr-2"
                        type="button"
                      >
                        {t(`Cancel`)}
                      </button>
                     
                    </div>
                  </form>
                </div>
              </div>
              </ModalBody>
        
        </ModalContent>
      </Modal>
      </>
    )
  }

  export default Settlement