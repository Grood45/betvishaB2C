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

function AddGameCategory({getGameCategory}) {
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
const [name,setName]=useState('')
const [link,setLink]=useState('')

const [imageUploadLoading,setUploadImageLoading]=useState(false)
const [selectedImage, setSelectedImage] = useState(null);

const handleImageChange = (event) => {
    const file = event.target.files[0];
    handleImageUpload(file);
  };

  const handleImageUpload = async (file) => {
    setUploadImageLoading(true);
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
        setUploadImageLoading(false);
      }
    } catch (error) {
      console.error("Error uploading image:", error.message);
      toast({
        title: "Error uploading image",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      setUploadImageLoading(false);
    }
  };
  const handleAddCategory = async () => {
    if(!name||!selectedImage||!link){
        return toast({
            description: `${t(`Fill `)} ${t(`the`)} ${t(`all`)} ${t(`details`)}`,
            status: `warning`,
            duration: 4000,
            position: "top",
            isClosable: true,
          });
    }
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/game-navigation/add-game-navigation`;
    setLoading(true)
    const payload={
        name:name,
         link:link, 
         original_name:name,
         icon:selectedImage
    }

    try {
      let response = await sendPostRequest(url,payload);
      const data = response.data;

      getGameCategory()
      setSelectedImage('')
      setName('')
      setLink('')

      toast({
        description: `${t(`Category`)} ${t(`Add`)} ${t(`Successfully`)}`,
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
        description: `${error?.message||error?.data?.message}`,
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
          <ModalHeader style={{ color: textColor }}>{t(`Add`)} {t(`Game`)}{t(`Category`)}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>
            <p className='text-sm '>{t(`Add`)} {t(`Image`)}</p>
            {imageUploadLoading?<LoadingSpinner thickness={"4px"} color="blue" size="sm" />:""}
            {selectedImage&&<img src={selectedImage} className='w-[100] max-h-[200px] ' />}
            <input
                id="file-upload"
                type="file"
                accept="image/*"
                style={{
                  border:`1px solid ${border}`,
                }}
                className="border border-gray-300 p-2 w-full"
                // Pass item id to identify which item's image to update
                onChange={(e) => handleImageChange(e)}
              />

            </div>
           <div className='mt-3'>
            <p className='text-sm '>{t(`Enter`)} {t(`Category`)}</p>
            <input onChange={(e)=>setName(e.target.value)} placeholder={`${t(`Enter`)} ${t(`Category`)} ${t(`name`)}`} style={{border:`1px solid ${border}`}} className='rounded-lg w-[100%] p-2 outline-none' />
           </div>
           <div className='mt-3'>
            <p className='text-sm '>{t(`Enter`)} {t(`Link`)}</p>
            <input onChange={(e)=>setLink(e.target.value)} placeholder={`${t(`Enter`)} ${t(`Link`)} ${t(`name`)}`} style={{border:`1px solid ${border}`}} className='rounded-lg w-[100%] p-2 outline-none' />
           </div>
         
           
          </ModalBody>

          <ModalFooter>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <Button
                colorScheme=""
                style={{backgroundColor:bg}}
                className='w-[100px]'
                onClick={handleAddCategory}
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

export default AddGameCategory;
