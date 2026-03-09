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
  InputGroup,
  InputLeftElement,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import img1 from '../assets/logo.svg';
import { useSelector } from 'react-redux';
import { FaUserAlt, FaEnvelope } from 'react-icons/fa';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { verifyOTPAndResetPassword } from '../APIServices/APIServices';
import { useTranslation } from 'react-i18next';

function VerifyPassword({ showVerifyPasswordModal, setShowVerifyPasswordModal }) {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
const [verifyLoading,setVerifyLoading]=useState(false)
  const style = {
    width: '170px',
    paddingTop: '10px',
  };

  const {t} =useTranslation()
const toast=useToast()
  const { bgYellow } = useSelector((state) => state.theme);

  const formik = useFormik({
    initialValues: {
      email: '',
      otp: '',
      new_password: '',
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      otp: Yup.string().required('OTP is required'),
      new_password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('New password is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      setVerifyLoading(true)
      try {
        const response = await verifyOTPAndResetPassword(
          values.email,
          values.otp,
          values.new_password
        );

        if (response.success) {
          resetForm();
          setShowVerifyPasswordModal(false);
          toast({
            title: response?.message,
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "top",
          });
          
        }
      } catch (error) {
        toast({
          title: error?.message || "User not found!!!",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        console.error('Error verifying OTP:', error);
        // Handle error, e.g., display error message
      }
      finally{
      setVerifyLoading(false)

      }
    },
  });

  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={showVerifyPasswordModal}
        onClose={() => setShowVerifyPasswordModal(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex justify-center items-center">
              <img style={style} src={img1} alt="Logo" />
            </div>
            <ModalHeader
              fontSize="sm"
              className="text-base flex justify-center items-center"
            >
              Verify OTP & Reset Password
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<FaEnvelope color="gray.300" />}
                  />
                  <Input
                    ref={initialRef}
                    placeholder="Please enter your email"
                    name="email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                </InputGroup>
                {formik.errors.email && formik.touched.email && (
                  <p
                    style={{
                      color: 'red',
                      fontSize: '.8rem',
                      marginTop: '-3px',
                      marginLeft: '275px',
                    }}
                  >
                    {formik.errors.email}
                  </p>
                )}
              </FormControl>
              <FormControl mt={4}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<FaUserAlt color="gray.300" />}
                  />
                  <Input
                    placeholder="Enter OTP"
                    name="otp"
                    value={formik.values.otp}
                    onChange={formik.handleChange}
                  />
                </InputGroup>
                {formik.errors.otp && formik.touched.otp && (
                  <p
                    style={{
                      color: 'red',
                      fontSize: '.8rem',
                      marginTop: '-3px',
                      marginLeft: '275px',
                    }}
                  >
                    {formik.errors.otp}
                  </p>
                )}
              </FormControl>
              <FormControl mt={4}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<FaUserAlt color="gray.300" />}
                  />
                  <Input
                    placeholder="New Password"
                    name="new_password"
                    type="password"
                    value={formik.values.new_password}
                    onChange={formik.handleChange}
                  />
                </InputGroup>
                {formik.errors.new_password &&
                  formik.touched.new_password && (
                    <p
                      style={{
                        color: 'red',
                        fontSize: '.8rem',
                        marginTop: '-3px',
                        textAlign:"right"
                      }}
                    >
                      {formik.errors.new_password}
                    </p>
                  )}
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                style={{ backgroundColor: bgYellow }}
                mr={3}
                w="500px"
                type="submit"
              >
               {verifyLoading?<Spinner/>:t('submit')}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}

export default VerifyPassword;
