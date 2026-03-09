
import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { MdDelete } from 'react-icons/md';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../component/loading/LoadingSpinner';
import { sendDeleteRequest } from '../api/api';
import { useTranslation } from 'react-i18next';

function ConfirmPromotionDelete({data,getAllPromotion}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { primaryColor, secondaryColor, textColor, borderColor,iconColor,primaryBg,border } = useSelector(state => state.theme);
const [loading,setLoading]=useState(false)
const toast=useToast()
const { t, i18n } = useTranslation();

const deletePromotion = async () => {
    setLoading(true)
    try {
      const response = await sendDeleteRequest(
        `${import.meta.env.VITE_API_URL}/api/promotion/delete-promotion/${data._id}`
      );
      toast({
        title: response.message,
        status: "success",
        duration: 2000,
        position: "top",
        isClosable: true,
      });
      getAllPromotion()
    setLoading(false)

    onClose(); 

    } catch (error) {
      console.error("Error uploading image:", error.message);
      toast({
        title: error.message,
        status: "error",
        duration: 2000,
        position: "top",
        isClosable: true,
      });
    setLoading(false)

    }
  };

  return (
    <>
      <button   onClick={onOpen} style={{border:`1px solid ${border}`,backgroundColor:primaryBg}} className={`w-[25px] flex items-center border  justify-center rounded-[6px] h-[25px]`}>
      <MdDelete  color={iconColor} fontSize={"30px"} />
                  </button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent style={{ backgroundColor: secondaryColor }}>
          <ModalHeader style={{ color: textColor }}>{t(`Are You Sure?`)}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p style={{ color: textColor }}>{`Are you sure you want to delete this `} <span className='font-bold'>{data?.category}</span>.</p>
          </ModalBody>

          <ModalFooter>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <Button
                colorScheme="red"
                onClick={deletePromotion}
                className='w-[100px]'
              >
                {loading?<LoadingSpinner color="white" size="sm" thickness="2px"/>:`${t(`Delete`)}`}
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                style={{ color: textColor, borderColor: borderColor }}
              >
                {t(`Cancel`)}
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ConfirmPromotionDelete;
