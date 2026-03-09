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
import { useSelector } from 'react-redux';
import LoadingSpinner from '../component/loading/LoadingSpinner';
import { sendDeleteRequest, sendPatchRequest, sendPostRequest } from '../api/api';
import { useTranslation } from 'react-i18next';
import { IoMdAddCircle } from 'react-icons/io';

function AddSeoCard({getAllSeoData}) {
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

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState([]);


  const AddSeo = async () => {

    if(!name||!description ||!metaTitle||!metaDescription||!metaKeywords){
      return  toast({
        description: `fill All Details`,
        status: "warning",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    }
    setLoading(true);

    const payload = {
      name: name,
      description: description,
      metaTags: {
        title: metaTitle,
        description: metaDescription,
        keywords: metaKeywords
      }
    };
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/seo/add-seo`;
    try {
      let response = await sendPostRequest(url,payload);
      const data = response.data;
      toast({
        description: `${response?.message}`,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      getAllSeoData()
      onClose()
      setLoading(false);
    } catch (error) {
      toast({
        description: `${error?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      console.log(error);
      setLoading(false);
    }
  };



  return (
    <>
     
      <button
          onClick={onOpen}
          style={{ backgroundColor: bg }}
          className="p-[6px] rounded-md gap-2 flex items-center font-bold text-xs text-white"
        >
          {t(`Add`)} {t(`More`)}
          <IoMdAddCircle fontSize={"20px"}/>
        </button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent style={{ backgroundColor: secondaryColor }}>
          <ModalHeader style={{ color: textColor }}>{t(`Add`)} {t(`Seo`)} </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
           
          <div className='mt-3'>
        <p className='text-sm'>{t(`Name`)}</p>
        <input name="name" onChange={(e)=>setName(e.target.value)} placeholder={`${t(`Enter`)} ${t(`Name`)}`} style={{border:`1px solid ${border}`}} className='rounded-lg w-[100%] p-2 outline-none' />
      </div>
      <div className='mt-3'>
        <p className='text-sm'>{t(`Description`)}</p>
        <textarea name="description" onChange={(e)=>setDescription(e.target.value)} placeholder={`${t(`Enter`)} ${t(`Description`)}`} style={{border:`1px solid ${border}`}} className='rounded-lg w-[100%] p-2 outline-none' />
      </div>
      <div className='mt-3'>
        <p className='text-sm'>{t(`Meta`)} {t(`Title`)}</p>
        <input name="metaTitle" onChange={(e)=>setMetaTitle(e.target.value)} placeholder={`${t(`Enter`)} ${t(`Meta`)} ${t(`Title`)}`} style={{border:`1px solid ${border}`}} className='rounded-lg w-[100%] p-2 outline-none' />
      </div>
      <div className='mt-3'>
        <p className='text-sm'>{t(`Meta`)} {t(`Description`)}</p>
        <textarea name="metaDescription" onChange={(e)=>setMetaDescription(e.target.value)} placeholder={`${t(`Enter`)} ${t(`Meta`)} ${t(`Description`)}`} style={{border:`1px solid ${border}`}} className='rounded-lg w-[100%] p-2 outline-none' />
      </div>
      <div className='mt-3'>
        <p className='text-sm'>{t(`Meta`)} {t(`Keywords`)}</p>
        <input name="metaKeywords" onChange={(e)=>setMetaKeywords(e.target.value.split(','))} placeholder={`${t(`Enter`)} ${t(`Meta`)} ${t(`Keywords`)} `} style={{border:`1px solid ${border}`}} className='rounded-lg w-[100%] p-2 outline-none' />
      </div>
         
           
          </ModalBody>

          <ModalFooter>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <Button
                colorScheme=""
                style={{backgroundColor:bg}}
                className='w-[100px]'
                onClick={AddSeo}
              >
                {loading ? <LoadingSpinner color="white" size="sm" thickness="2px" /> : `${t(`Add`)}`}
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

export default AddSeoCard;
