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
  Badge,
  FormControl,
  FormLabel,
  Select,
} from '@chakra-ui/react';
import { MdDelete } from 'react-icons/md';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../component/loading/LoadingSpinner';
import { sendDeleteRequest, sendPatchRequest } from '../api/api';
import { useTranslation } from 'react-i18next';
import { BiEdit } from 'react-icons/bi';
import { RxCross2 } from 'react-icons/rx';

function UpdatePriority({gpId,getAllCasinoProvider, provider_url="casinoprovider"}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
   const {
    color,
    primaryBg,
    secondaryBg,
    iconColor,
    bg,
    hoverColor,
    hover,
    text,
    font,
    border,
    secondaryColor,
    textColor,
    borderColor
  } = useSelector((state) => state.theme);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { t, i18n } = useTranslation();
const [value,setValue]=useState('')

  const handleCasinoPriorityUpdate = async () => {
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/${provider_url}/update-priority`;
    setLoading(true)
    const payload={
      value:value,
      gpid:gpId
    }
    try {
      let response = await sendPatchRequest(url,payload);
      const data = response.data;

      getAllCasinoProvider()
      toast({
        description: `${t(`Priority`)} ${t(`Update`)} ${t(`Successfully`)}`,
        status: `success`,
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    setLoading(false)
onClose()

    } catch (error) {
      console.log(error,"error")
      toast({
        description: `${error?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    setLoading(false)

    }
  };

  return (
    <>
      <button onClick={onOpen} style={{ border: `1px solid ${border}`, backgroundColor: primaryBg }} className={`w-[25px] flex items-center border  justify-center rounded-[6px] h-[25px]`}>
        <BiEdit fontSize={"20px"} cursor={"pointer"} color={iconColor} />
      </button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent style={{ backgroundColor: secondaryColor }}>
          <ModalHeader style={{ color: textColor }}>{t(`Update`)} {t(`Priority`)}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
           <div>
            <p className='text-sm '>{t(`Enter`)} {t(`Priority`)}</p>
            <input onChange={(e)=>setValue(e.target.value)} placeholder={`${t(`Enter`)} ${t(`priority`)} ${t(`number`)}`} style={{border:`1px solid ${border}`}} className='rounded-lg w-[100%] p-2 outline-none' />
           </div>
         
           
          </ModalBody>

          <ModalFooter>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <Button
                colorScheme=""
                style={{backgroundColor:bg}}
                className='w-[100px]'
                onClick={handleCasinoPriorityUpdate}
              >
                {loading ? <LoadingSpinner color="white" size="sm" thickness="2px" /> : `${t(`Update`)}`}
              </Button>
              <Button
                onClick={onClose}
              
                variant="outline"
                style={{ color: textColor, border: `1px solid ${border}` }}
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

export default UpdatePriority;
