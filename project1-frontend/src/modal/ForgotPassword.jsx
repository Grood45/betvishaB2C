import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  Input,
  Select,
  InputGroup,
  InputLeftElement,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import img1 from '../assets/logo.svg';
import { useSelector } from 'react-redux';
import { FaUserAlt, FaMobileAlt, FaEnvelope } from 'react-icons/fa';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { sendOTP } from '../APIServices/APIServices'; // Import the sendOTP function
import { useTranslation } from 'react-i18next';
import VerifyPassword from './VerifyPassword';
import { HiOutlineUserCircle } from 'react-icons/hi2';
import { AiOutlineComment } from 'react-icons/ai';
import { TfiEmail } from 'react-icons/tfi';
import { PiPhoneCallLight } from 'react-icons/pi';

function ForgotPassword({ showForgotModal, setShowForgotModal }) {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const [selectPhoneEmailVal, setSelectPhoneEmailVal] = useState('email');
  const [showVerifyPasswordModal, setShowVerifyPasswordModal] = useState(false);
  const style = {
    width: '170px',
    paddingTop: '10px',
  };
  const toast=useToast()
  const { t } = useTranslation();
  const { bgYellow,blackBtn ,whiteText} = useSelector((state) => state.theme);
  const settings = useSelector((state) => state?.auth?.settings); 
const [forgotLoading,setForgotLoading]=useState(false)
  const formik = useFormik({
    initialValues: {
      user_name: '',
      phone: '',
      email: '',
      selectPhoneEmail: 'email',
    },
    validationSchema: Yup.object().shape({
      // user_name: Yup.string().required(t('userNameRequired')),
      ...(selectPhoneEmailVal === 'email' && {
        email: Yup.string()
          .email(t('invalidEmail'))
          .required(t('emailRequired')),
      }),
      ...(selectPhoneEmailVal === 'phone' && {
        phone: Yup.string()
          .required(t('Mobile number is required'))
          .matches(/^\d{10}$/, t('mustHave10')),
      }),
    }),
    onSubmit: async (values, { resetForm }) => {
      setForgotLoading(true)
      try {
        // Determine the correct identifier object
        const otpTarget =
          selectPhoneEmailVal === 'email'
            ? { email: values.email }
            : { phone: values.phone };

        
        // Call sendOTP API function
        const response = await sendOTP(otpTarget);

        if (response.success) {
          resetForm();
          setShowForgotModal(false);
          setShowVerifyPasswordModal(true); // Open VerifyPassword modal
          toast({
          title: response?.message||"OTP Sent Successfully!",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        }
       
      } catch (error) {
        console.error('Error sending OTP:', error);
        toast({
          title: error?.message || "User not found!!!",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        // Handle error, e.g., display error message
      } finally{
        setForgotLoading(false)
      }
    },
  });

  const onHandleSelect = (e) => {
    let selectValue = e.target.value;
    setSelectPhoneEmailVal(selectValue);
    formik.setFieldValue('selectPhoneEmail', selectValue);
  };

  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        size={{ base: 'full', md: 'lg' }}
      >
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex justify-center pt-[130px] md:pt-10   items-center">
              <img style={style} src={settings?.site_logo} alt="Logo" />
            </div>
            <ModalHeader
              fontSize="sm"
              className="text-base flex justify-center items-center"
            >
              {t('Forgot Password ? Reset your password')}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={{ base: 4, lg: 6 }} 
      pl={{ base: 4, lg: 12 }} 
      pr={{ base: 4, lg: 12 }}>
              {/* <FormControl>
                <InputGroup>
                  <InputLeftElement
                  
                    style={{ paddingLeft: '10px' }}
                    children={
                      <HiOutlineUserCircle
                        color="#0f172a"
                        fontSize={'40px'}
                        style={{ marginTop: '10px' }}
                      />}
                  />
                  <Input
                    ref={initialRef}
                    placeholder={t('Please enter your username')}
                    name="user_name"
                    value={formik.values.user_name}
                    onChange={formik.handleChange}
                    style={{
                      backgroundColor: '#F2F2F2',
                      height: '50px',
                      paddingLeft: '50px',
                      fontWeight: 'bold',
                      fontSize: '16px',
                    }}
                    borderRadius={{ base: "20px", md: "6px" }}
                    focusBorderColor="yellow.500" 
                  />
                </InputGroup>
                {formik.errors.user_name && formik.touched.user_name && (
                  <p
                    style={{
                      color: 'red',
                      fontSize: '.8rem',
                      marginTop: '-3px',
                                           textAlign:"right"
                    }}
                  >
                    {formik.errors.user_name}
                  </p>
                )}
              </FormControl> */}
              <FormControl mt={4} style={{position:"relative"}}>
              <AiOutlineComment

                        color="#0f172a"
                        fontSize={'30px'}
                        style={{ marginTop: '10px',marginLeft:"10px",position:"absolute" ,zIndex:"10"}}
                      />
                <Select
                  name="selectPhoneEmail"
                  onChange={onHandleSelect}
                  value={selectPhoneEmailVal}
                  style={{
                    backgroundColor: '#F2F2F2',
                    height: '50px',
                    paddingLeft: '50px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    color:"gray"
                  }}
                  borderRadius={{ base: "20px", md: "6px" }}
                  focusBorderColor="yellow.500" 

                >
                  {/* <option value="phone">{t('Mobile Number')}</option> */}
                  <option value="email">{t('Email Address')}</option>
                </Select>
              </FormControl>

              {formik.values.selectPhoneEmail === 'phone' && (
                <FormControl mt={4}>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                     
                      style={{ paddingLeft: '10px' }}
                      children={
                        <PiPhoneCallLight
                        color="#0f172a"
                        fontSize={'28px'}
                        style={{ marginTop: '10px' }}
                      />}
                    />
                    <Input
                      placeholder={t('Please enter your mobile number')}
                      name="phone"
                      type="text"
                      borderRadius={{ base: "20px", md: "6px" }}
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                  focusBorderColor="yellow.500" 
                  style={{
                    backgroundColor: '#F2F2F2',
                    height: '50px',
                    paddingLeft: '50px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                  }}
                    />
                  </InputGroup>
                  {formik.errors.phone && formik.touched.phone && (
                    <div style={{ marginTop: '-3px', marginLeft: '300px' }}>
                      <p
                        style={{
                          color: 'red',
                          fontSize: '.8rem',
                          position: 'absolute',
                          bottom: '-26px',
                          right: 0,
                        }}
                      >
                        {formik.errors.phone}
                      </p>
                    </div>
                  )}
                </FormControl>
                
              )}
              {formik.values.selectPhoneEmail === 'email' && (
                <FormControl mt={4}>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      
                      style={{ paddingLeft: '10px' }}
                    children={
                      <TfiEmail
                        color="#0f172a"
                        fontSize={'25px'}
                        style={{ marginTop: '10px' }}
                      />}
                    />
                    <Input
                      placeholder={t('Please enter your email address')}
                      name="email"
                      type="text"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      style={{
                        backgroundColor: '#F2F2F2',
                        height: '50px',
                        paddingLeft: '50px',
                        fontWeight: 'bold',
                        fontSize: '16px',
                      }}
                      borderRadius={{ base: "20px", md: "6px" }}
                  focusBorderColor="yellow.500" 

                    />
                  </InputGroup>
                  {formik.errors.email && formik.touched.email && (
                    <div style={{ marginTop: '-3px', marginLeft: '300px' }}>
                      <p
                        style={{
                          color: 'red',
                          fontSize: '.8rem',
                          position: 'absolute',
                          bottom: '-26px',
                          right: 0,
                        }}
                      >
                        {formik.errors.email}
                      </p>
                    </div>
                  )}
                </FormControl>
              )}
            </ModalBody>

            <ModalFooter flexDirection="column" alignItems="center" style={{marginTop:"0px",marginBottom:"20px"}}>
              <Button
               borderRadius={{ base: "20px", md: "6px" }}
               backgroundColor={{base:blackBtn,md:bgYellow}}
               width={{base:"103%",lg:"90%"}}
               color={{base:"white",md:"black"}}
                style={{height:"50px"}}
                type="submit"
              >
                {forgotLoading?<Spinner/>:t('submit')}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <VerifyPassword
        showVerifyPasswordModal={showVerifyPasswordModal}
        setShowVerifyPasswordModal={setShowVerifyPasswordModal}
      />
    </>
  );
}

export default ForgotPassword;
