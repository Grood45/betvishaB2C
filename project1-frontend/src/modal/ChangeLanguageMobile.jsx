import React, { useEffect, useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';
import hindi from '../assets/images/flags/hi.svg';
import bangladesh from '../assets/images/flags/bangladesh.svg';
import en from '../assets/images/flags/en.svg';
import hi from '../assets/images/flags/hi.svg';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from '@chakra-ui/react';
import {
  Button,
  Menu,
  MenuButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Box,
  Link,
  Image,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import i18n from '../i18n';

const ChangeLanguageMobile = ({ lang, handleChange }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const style = {
    width: '170px',
    paddingTop: '10px',
  };
const preferredLanguage = localStorage.getItem('luckydaddy');

  const { bgYellow, greenBtn, borderLang, bgGray } = useSelector(
    (state) => state.theme
  );
  const langStyle = {
    minWidth: '100px',
    fontWeight: '400',
    border: '1px solid #d9dee4',
    padding: '8px 10px',
    display: 'flex',
    justifyContent: 'center',
  };
  const [isXl] = useMediaQuery('(min-width: 1280px)');
  const { usernameToken } = useSelector((state) => state.auth);
  const { t } = useTranslation();

  const location = useLocation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);


  const onLanguageChange = (value) => {
    // toast({
    //   title:'langauge change successfully!!!',
    //   status: "true",
    //   duration: 2000,
    //   isClosable: true,
    //   position: "top",
    // });
    localStorage.setItem("luckydaddy",value);
    
    setSelectedLanguage(value);
    i18n.changeLanguage(value);
    
    onClose()

  };
  return (
    <div>
     
         
          <div onClick={onOpen} className='flex items-center gap-4 font-semibold' >
           
              <Image
                src={hindi}
                alt="Hindi"
                height={{ base: '30px', xl: '40px' }}
                width={{ base: '30px', xl: '40px' }}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
              <p>{preferredLanguage=="hi"?"Hindi":"English"} </p>
          </div>
      
      

      
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent p="4">
          <ModalHeader
            style={{ paddingTop: '0', paddingBottom: '10px' }}
            fontSize="1.1rem"
            className=" flex justify-center items-center"
          >
            {t('selectLanguage')}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} pt={10}>
            <Box className="lang-list-wrapper default-center">
              <ul>
                <li style={{ padding: '5px 0' }}>
                  <Box
                    className="justify-between lang-selection-wrapper"
                    display="flex"
                    alignItems="center"
                  >
                    <Image
                      src={hi}
                      alt="Country Flag"
                      w="50px"
                      className="flag rounded"
                    />
                    <Box className="currency">
                      <Text className="currency-code">INR</Text>
                      <Text className="sign">₹</Text>
                    </Box>
                    <Text
                      className="rounded"
                      style={{ ...langStyle }}
                    >
                      <Box
                        className="lang-bg-wrapper cursor-pointer"
                        onClick={() => {
                          onLanguageChange('en');
                        }}
                      >
                        <Text>English</Text>
                      </Box>
                    </Text>
                    <Text
                      className="rounded"
                      style={{ ...langStyle }}
                    >
                      <Box
                        className="lang-bg-wrapper cursor-pointer"
                        onClick={() => {
                          onLanguageChange('hi');
                        }}
                      >
                        <Text>हिन्दी</Text>
                      </Box>
                    </Text>
                  </Box>
                </li>
              </ul>
            </Box>
          </ModalBody>

          {/* <ModalFooter>
                        <Button style={{backgroundColor:bgYellow}}  mr={3} w="500px"> 
                            Submit
                        </Button>
                    </ModalFooter> */}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ChangeLanguageMobile;
