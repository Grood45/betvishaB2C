"use client";
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
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { sendPostRequest } from "../../api/api";
import LoadingSpinner from "../loading/LoadingSpinner";
import { useTranslation } from "react-i18next";

function SendMail({userData}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const toast = useToast();
  const [loading,setLoading]=useState(false)
  const params = useParams();
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  const { t, i18n } = useTranslation();

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };
  const { color,primaryBg,secondaryBg, bg,iconColor,hoverColor,hover,text, font, border } = useSelector(state => state.theme);

  const sendMessage = async () => {
    if(message===""||title===""){
      toast({
        description: `subject and message can not be empty`,
        status: "warning",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      return
    }
    setLoading(true)
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/admin/send-mail/${userData.user_id}`;
      const requestData = {
        subject: title,
        message: message,
      };
      const response = await sendPostRequest(url, requestData);
      toast({
        description: `message send successfully`,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setMessage("")
      setTitle("")
    setLoading(false)

      
      onClose();
    }
    catch (error) {
      toast({
        description: `${error?.message||error?.response?.message||error?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    setLoading(false)

    }
  };

  const handleSubmit = () => {
    sendMessage()
  };

  return (
    <>
      <button
        onClick={onOpen}
       style={{backgroundColor:bg}}

        className={`w-[100%]  font-semibold text-white text-xs rounded-[5px] p-[7px]`}
      >
        {t(`Send`)} {t(`Mail`)}
      </button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent style={{ backgroundColor: "white", color: "black" }}>
          <ModalHeader style={{color:iconColor}} className={`text-center  `}>{t(`Send`)} {t(`Message`)}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <input
                type="text"
                placeholder="Enter Subject"
                value={title}
                style={{border:`1px solid ${border}`}}
                className={`  w-[100%] outline-none rounded-md p-2  `}
                onChange={handleTitleChange}
              />
              <textarea
                style={{border:`1px solid ${border}`}}

                className={`  w-[100%] mt-10 outline-none rounded-md p-2 `}
                placeholder="Write something here...."
                value={message}
                onChange={handleMessageChange}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <button
       style={{backgroundColor:bg}}

              className={`  text-white font-bold w-[90px] text-sm p-2  rounded-md `}
              onClick={handleSubmit}
            >
              {loading?<LoadingSpinner color="white" size="sm" thickness={"2px"}/>:`${t(`Send`)}`}
            </button>
            <button
              className={` bg-gray-300 ml-3 font-bold w-[90px] text-sm p-2  rounded-md `}
              onClick={onClose}
            >
              {t(`Cancel`)}
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default SendMail;
