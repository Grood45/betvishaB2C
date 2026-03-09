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
import { AiFillPlusCircle } from 'react-icons/ai';
import { FaEdit } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { sendPatchRequest } from '../api/api';
import LoadingSpinner from '../component/loading/LoadingSpinner';
import ReactQuill from 'react-quill';
import { useTranslation } from 'react-i18next';

function CreateLink({ type, data ,getFooterData}) {
  const {
    color,
    primaryBg,
    secondaryBg,
    bg,
    iconColor,
    hoverColor,
    hover,
    text,
    font,
    border,
  } = useSelector((state) => state.theme);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // State for managing input values
  const [labelName, setLabelName] = useState(data ? data.name : '');
  const toast=useToast()
  const [labelLink, setLabelLink] = useState(data ? data.link : '');
 const [loading,setLoading]=useState(false)
  const handleUpdateFooter = async() => {
    setLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/navigation/update-navigation/${data._id}`;

    try {
      let payload = {
        name: labelName,
        link: labelLink ,
      };
      let response = await sendPatchRequest(url, payload);
      toast({
        description: `Updated Successfully`,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading(false)
      getFooterData()
      onClose()
     
    } catch (error) {
      console.log(error,"error")

      toast({
        description: `${error?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
    }
    setLoading(false);

  };

  // Function to handle input change for label name
  const handleLabelNameChange = (e) => {
    setLabelName(e.target.value);
  };

  // Function to handle input change for label link
  const handleLabelLinkChange = (e) => {
    setLabelLink(e.target.value);
  };
const { t, i18n } = useTranslation();


  return (
    <>
      {type === "1" ? (
        <button onClick={onOpen} style={{ backgroundColor: bg }} className="p-2 text-white px-3 rounded-md text-sm font-bold flex items-center gap-1">
          {t(`Create`)} {t(`Link`)} <AiFillPlusCircle fontSize={'20px'} />
        </button>
      ) : (
        <FaEdit onClick={onOpen} style={{ color: iconColor, fontSize: '20px' }} className="cursor-pointer" />
      )}

      <Modal size={'sm'} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{type === "1" ? 'Create' : 'Update'} {t(`footer`)} {t(`Link`)}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  {t(`Label`)} {t(`Name`)}
                </label>
                <input
                  value={labelName}
                  onChange={handleLabelNameChange}
                  placeholder="enter label name"
                  type="text"
                  id="name"
                  name="name"
                  style={{ border: `1px solid ${border}` }}
                  className={`mt-1 outline-none p-2 block w-full border rounded-md`}
                />
              </div>
              <div>
                <label htmlFor="text" className="block text-sm font-medium text-gray-700">
                  {t(`Label`)} {t(`Link`)}
                </label>
                <input
                  value={labelLink}
                  onChange={handleLabelLinkChange}
                  placeholder="enter label link"
                  type="text"
                  id="text"
                  name="text"
                  style={{ border: `1px solid ${border}` }}
                  className="mt-1 outline-none p-2 block w-full border rounded-md"
                />
              </div>
              {/* <div>
              <p  className="block text-sm font-bold text-gray-700">
                   Content
                </p>
                <ReactQuill
  theme="snow"
  value={''}
 
  modules={{
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      [{ color: [] }], // Add color option here
      ["link", "image"],
      ["clean"],
    ],
  }}
  style={{ height: "200px", width: "100%", color: "black" }}
/>

              </div> */}
            </form>
          </ModalBody>

          <ModalFooter style={{marginBottom:'20px'}}> 
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              {t(`Close`)}
            </Button>
            {/* {type === '1' ? (
              <Button style={{ backgroundColor: bg, color: 'white' }} variant="ghost">
                Create
              </Button>
            ) : ( */}
              <Button onClick={handleUpdateFooter} style={{ backgroundColor: bg, color: 'white',width:'100px' }} variant="ghost">
               {loading?<LoadingSpinner color={'white'} thickness={"4px"} size="sm"/>:`${t(`Update`)}`} 
              </Button>
            {/* )} */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateLink;
