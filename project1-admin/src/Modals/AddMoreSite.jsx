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

function AddMoreSite({getSiteDetails}) {
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
  const [age, setAge] = useState('');
  const [siteName, setSiteName] = useState('');
  const [siteAuthKey, setSiteAuthKey] = useState('');
  const [companyKey, setCompanyKey] = useState('');


  const AddSite = async () => {

    if(!name||!age ||!siteName||!siteAuthKey||!companyKey){
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
      age: age,
      company_key:companyKey,
      site_auth_key:siteAuthKey,
      site_name:siteName,
      is_active:false,
      selected:false
      
    };
    let url = `${
      import.meta.env.VITE_API_URL }/api/site-switch/add-site-record`;
    try {
      let response = await sendPostRequest(url,payload);
      const data = response.data;
      toast({
        description: `Added Successfully`,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      getSiteDetails()
      onClose()
      setLoading(false);
    } catch (error) {
      toast({
        description: `${error?.data?.message||"Something Went Wrong"}`,
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
          <ModalHeader style={{ color: textColor }}>{t(`Add`)} {t(`Site`)} </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
           
          <div className='mt-3'>
        <p className='text-sm'>{t(`Name`)}</p>
        <input name="name" onChange={(e)=>setName(e.target.value)} placeholder={`${t(`Enter`)} ${t(`name`)}`} style={{border:`1px solid ${border}`}} className='rounded-lg w-[100%] p-2 outline-none' />
      </div>
      <div className='mt-3'>
        <p className='text-sm'>{t(`Age`)}</p>
        <input name="description" onChange={(e)=>setAge(e.target.value)} placeholder={`${t(`Enter`)} ${t(`age`)}`} style={{border:`1px solid ${border}`}} className='rounded-lg w-[100%] p-2 outline-none' />
      </div>
      <div className='mt-3'>
        <p className='text-sm'>{t(`Site`)} {t(`Name`)}</p>
        <input name="metaTitle" onChange={(e)=>setSiteName(e.target.value)} placeholder={`${t(`Enter`)} ${t(`Site`)} ${t(`name`)}`} style={{border:`1px solid ${border}`}} className='rounded-lg w-[100%] p-2 outline-none' />
      </div>
      <div className='mt-3'>
        <p className='text-sm'>{t(`Site`)} {t(`Auth`)} {t(`Key`)}</p>
        <input name="metaDescription" onChange={(e)=>setSiteAuthKey(e.target.value)} placeholder={`${t(`Enter`)} ${t(`site`)} ${t(`auth`)} ${t(`key`)}`} style={{border:`1px solid ${border}`}} className='rounded-lg w-[100%] p-2 outline-none' />
      </div>
      <div className='mt-3'>
        <p className='text-sm'>{t(`Site`)} {t(`Company`)} {t(`Key`)}</p>
        <input name="metaKeywords" onChange={(e)=>setCompanyKey(e.target.value)} placeholder={`${t(`Enter`)} ${t(`company`)} ${t(`key`)} `} style={{border:`1px solid ${border}`}} className='rounded-lg w-[100%] p-2 outline-none' />
      </div>
         
           
          </ModalBody>

          <ModalFooter>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <Button
                colorScheme=""
                style={{backgroundColor:bg}}
                className='w-[100px]'
                onClick={AddSite}
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

export default AddMoreSite;
