import React, { useEffect, useState } from 'react';
import ForgotPassword from '../modal/ForgotPassword';
import RegisterUser from '../modal/RegisterUser';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Stack, Checkbox, Box, Link, Text, useToast, Spinner, useBreakpointValue } from '@chakra-ui/react';
import { BiSolidHide, BiSolidShow } from 'react-icons/bi';
import { FaRegBell } from 'react-icons/fa';
import { IoIosStarOutline } from 'react-icons/io';
import { TbCoins } from 'react-icons/tb';
import { GrUpdate } from 'react-icons/gr';
import { FiPlus } from 'react-icons/fi';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
} from '../redux/auth-redux/actions';
import { getSingleUser, userLogin } from '../APIServices/APIServices';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoginModal from '../modal/LoginModal';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  
  const { bgGray, greenBtn, bgYellow, whiteText, PrimaryText, secondaryText } =
    useSelector((state) => state.theme);
  const { t } = useTranslation();
  const [showLoginModal,setShowLoginModal]=useState(false)
  const singleUserDetails=useSelector((state)=>state.auth)
  const settings = useSelector((state) => state?.auth?.settings); 
  const {data}  = useSelector((state) => state?.auth);
  const userData=useSelector((state) => state?.auth?.user?.user)
 const toast=useToast()
 const isLargeScreen = useBreakpointValue({ base: false, xl: true });

  const style = { width: '170px' };
  const inputdiv = {
    fontSize: '1rem',
    fontWeight: 700,
    borderRadius: '5px',
    height: '50px',
    padding: '0 10px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flexWrap: 'wrap',
    minWidth: 0,
    width: '100%',
    margin: '5px',
    '::placeholder': { color: '#000000de' },
    outlineColor: '#ffaa00',
  };
  const checkboxStyle = {
    checkAndForgot: {
      display: 'flex',
      position: 'absolute',
      bottom: '-15px',
      right: '0',
      padding: '0 5px',
      width: '100%',
      zIndex: 10,
      height: '20px',
    },
    inputStyle: {
      maxWidth: '300px',
      margin: '0 5px',
      width: '100%',
      textAlign: 'right',
    },
  };
  const onCloseLoginModal = () => {
    setShowLoginModal(false);
  };
  const loginFont = { fontFamily: 'Teko, sans-serif', fontWeight: '500' };
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading,setLoading]=useState(false)
  const handleLogin = async (userName, userPassword) => {
    dispatch(loginRequest())
    setLoading(true);
    try {
      const data = await userLogin(userName, userPassword);
      if(data.success===true){
        dispatch(loginSuccess(data));
        toast({
          title: data.message || 'User Login successfully!!!',
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      }else {
        toast({
          title: data.message || "An error occurred while User Login!!!",
          status: "warning",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      }
    setLoading(false);

    } catch (error) {
      dispatch(loginFailure(error.message));
      toast({
        title: error.message || "Error while User Login!!!",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    setLoading(false);

    }
  };

  
  const handleDeposit = () => {
    navigate('/Deposit', { state: { type: 'Deposit' } });
  };
  const onHandleWithdraw = () => {
    navigate('/Withdraw');
  };

  const formik = useFormik({
    initialValues: {
      user_name: '',
      password: '',
    },
    validationSchema: Yup.object({
      user_name: Yup.string().required(t('userNameRequired')),
      password: Yup.string()
        .min(5, t('min5Char'))
        .max(16, t('max16Char'))
        .required(t('passwordRequired')),
    }),
    onSubmit: (values) => {
      handleLogin(values.user_name, values.password);
    },
  });

  const styleForgetPassword = {
    color: formik.errors.password && formik.touched.password ? 'red' : 'black',
    marginRight: '-12px',
  };
  const [rotationCount, setRotationCount] = useState(0);

  const handleIconClick = () => {
    setRotationCount(prevCount => prevCount + 1);
  };

  const handleAnimationEnd = () => {
    setRotationCount(0);
  };
  return (
    <Box className="flex items-center" gap={{ base: '10px', xl: '0' }}>
      <form className="bg-white" onSubmit={formik.handleSubmit}>
        <div
          className="flex justify-center items-center"
          style={{ gap: '10px' }}
        >
          {isLoggedIn ? (
            <Box
              className="flex justify-center relative"
              style={{ gap: '10px' }}
            >
              {/* <Box
                className="indox_Icon_wr flex justify-center"
                width="50px"
                height="50px"
                marginY="5px"
                display={{ base: 'none', xl: 'flex' }}
              >
                <p
                onClick={()=>navigate('/inbox')}
                  className="justify-flex-center cursor-pointer"
                  _hover={{ color: secondaryText }}
                  style={{
                    ...inputdiv,
                    backgroundColor: bgGray,
                    margin: '0',
                    outline: 'none',
                    flexFlow: 'initial',
                    alignItems: 'center',
                  }}
                  fontSize={{ base: '14px', xl: '1.5rem' }}
                >
                  <FaRegBell size={28} />
                </p>
              </Box>
              <Box
                className="deposit_icon_wr flex justify-center"
                minWidth="150px"
                height="50px"
                marginY="5px"
                display={{ base: 'none', xl: 'flex' }}
              >
                <Link
                  href="/Deposit?tab=2"
                  className="justify-flex-center"
                  gap="8px"
                  _hover={{ color: secondaryText }}
                  style={{
                    ...inputdiv,
                    backgroundColor: bgGray,
                    margin: '0',
                    outline: 'none',
                    flexFlow: 'initial',
                    alignItems: 'center',
                  }}
                  fontSize={{ base: '14px', xl: '1.5rem' }}
                >
                  <IoIosStarOutline size={28} />
                  <Text as="span" style={{ ...loginFont }}>
                    0
                  </Text>
                </Link>
              </Box> */}
              <Box
                className="deposit_icon_wr flex justify-center"
                marginY="5px"
                minWidth={{ base: '85px', xl: '150px' }}
                minHeight={{ base: '40px', xl: '50px' }}
                borderRadius={{ base: '25px', xl: '5px' }}
              >
                <Link
                  to="/deposit"
                  className="justify-flex-center"
                  gap="8px"
                  _hover={{ color: secondaryText }}
                  style={{
                    ...inputdiv,
                    backgroundColor: bgGray,
                    margin: '0',
                    outline: 'none',
                    flexFlow: 'initial',
                    alignItems: 'center',
                  }}
                  minWidth={{ base: '85px', xl: '150px' }}
                  maxHeight={{ base: '40px !important', xl: '50px !important' }}
                  borderRadius={{
                    base: '25px !important',
                    xl: '5px !important',
                  }}
                  fontSize={{ base: '14px', xl: '1.5rem' }}
                >
                  <TbCoins  onAnimationEnd={handleAnimationEnd}
        onClick={handleIconClick} size={28} />
                  <Text 
                   onAnimationEnd={handleAnimationEnd}
                   onClick={handleIconClick}
                   fontSize={{base:"16px",md:"20px"}}
                  as="span" style={{ ...loginFont }}>
                  {singleUserDetails?.singleUserData?.amount?.toFixed(2)} {singleUserDetails?.singleUserData?.currency}
                  </Text>
                  <Box display={{ base: 'none', xl: 'block' }}>
                  <GrUpdate
        style={{
          transform: `rotate(${rotationCount * 360}deg)`,
          transition: 'transform 1s',
        }}
        onAnimationEnd={handleAnimationEnd}
        onClick={handleIconClick}
      />

                  </Box>
                </Link>
              </Box>
            </Box>
          ) : (
            <Box
              className="flex justify-center relative"
              style={{ gap: '10px' }}
              display={{ base: 'none', xl: 'flex' }}
            >
              <div style={{ maxWidth: '200px', textAlign: 'end' }}>
                <input
                  style={{ ...inputdiv, backgroundColor: bgGray }}
                  className="inputdiv rounded text-black-700"
                  type="text"
                  placeholder={t('userName')}
                  name="user_name"
                  value={formik.values.user_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div style={{ maxWidth: '200px' }}>
                <div className="relative">
                  <input
                    style={{ ...inputdiv, backgroundColor: bgGray }}
                    className="rounded inputdiv "
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('password')}
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {showPassword ? (
                    <BiSolidShow
                      onClick={() => setShowPassword(false)}
                      className="absolute"
                      style={{ top: 'calc(50% - 9px)', right: '5px' }}
                      size={24}
                    />
                  ) : (
                    <BiSolidHide
                      onClick={() => setShowPassword(true)}
                      className="absolute"
                      style={{ top: 'calc(50% - 9px)', right: '5px' }}
                      size={24}
                    />
                  )}
                </div>
              </div>
              <div style={{ ...checkboxStyle.checkAndForgot }}>
                <Stack
                  spacing={5}
                  direction="row"
                  justifyContent="end"
                  style={{ ...checkboxStyle.inputStyle }}
                >
                  {formik.errors.user_name && formik.touched.user_name ? (
                    <p
                      style={{
                        color: 'red',
                        fontSize: '.8rem',
                        marginTop: '-6px',
                      }}
                    >
                      {formik.errors.user_name}
                    </p>
                  ) : (
                    <Checkbox
                      colorScheme="custom"
                      defaultChecked
                      sx={{
                        '.chakra-checkbox__control': {
                          bg: 'black',
                        },
                        '.chakra-checkbox__label': {
                          fontSize: '.8rem',
                        },
                      }}
                    >
                      {t('rememberMe')}
                    </Checkbox>
                  )}
                </Stack>
                <div style={{ ...checkboxStyle.inputStyle }}>
                  <Text
                    onClick={() => {
                      setShowForgotModal(true);
                    }}
                    fontSize=".8rem"
                    fontWeight="normal"
                    className="cursor-pointer"
                    textAlign="end"
                    lineHeight="normal"
                    style={styleForgetPassword}
                  >
                    {formik.errors.password && formik.touched.password
                      ? formik.errors.password
                      : t('forgotPassword')}
                  </Text>
                  <ForgotPassword
                    showForgotModal={showForgotModal}
                    setShowForgotModal={setShowForgotModal}
                  />
                </div>
              </div>
            </Box>
          )}
          <div>
            {isLoggedIn ? (
              <Box display="flex">
                <Button
                  bg={{ base: bgYellow, xl: greenBtn }}
                  _hover={{ bg: { base: bgYellow, xl: greenBtn } }}
                  color={{ base: PrimaryText, xl: whiteText }}
                  fontSize={{ base: '.9rem', xl: '16px' }}
                  borderRadius={{ base: '25px', xl: '5px' }}
                  minW={{ base: '85px', xl: '140px' }}
                  height={{ base: '40px', xl: '50px' }}
                  margin={{ base: '5px 0 5px', xl: '5px' }}
                  display={{ base: 'none', xl: 'block' }}
                  onClick={handleDeposit}
                >
                  {t('deposit')}
                </Button>
                <Button
 onClick={handleDeposit}
                  backgroundColor={bgYellow}
                  borderRadius="50%"
                  width="40px"
                  height="40px"
                  display={{ base: 'flex', xl: 'none' }}
                  padding="8px"
                >
                  <FiPlus size={24} />
                </Button>
              </Box>
            ) : (
              <>
              {isLargeScreen ? (
        <Button
          bg={{ base: bgYellow, xl: greenBtn }}
          _hover={{ bg: { base: bgYellow, xl: greenBtn } }}
          color={{ base: PrimaryText, xl: whiteText }}
          fontSize={{ base: '.9rem', xl: '16px' }}
          borderRadius={{ base: '25px', xl: '5px' }}
          minW={{ base: '85px', xl: '140px' }}
          height={{ base: '40px', xl: '50px' }}
          margin={{ base: '5px 0 5px', xl: '5px' }}
          type="submit"
        >
          {loading ? <Spinner /> : t('login')}
        </Button>
      ) : (
        
        <LoginModal
          setShowLoginModal={setShowLoginModal}
          showLoginModal={showLoginModal}
          onCloseLoginModal={onCloseLoginModal}
          setShowForgotModal={setShowForgotModal}
          
          id="2"
        />
      )}
              </>
            )}
          </div>
        </div>
      </form>
      {/* <ToastContainer /> */}
      <RegisterUser onHandleWithdraw={onHandleWithdraw} t={t} />
    </Box>
  );
};

export default Login;
