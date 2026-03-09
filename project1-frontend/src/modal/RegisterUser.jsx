import React, { useEffect, useState } from "react";
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
  Text,
  useDisclosure,
  InputGroup,
  InputLeftElement,
  Box,
  Link,
  Checkbox,
  InputRightElement,
  IconButton,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import img1 from "../assets/logo.svg";
import { CiLock } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { FaRegUser, FaMinus } from "react-icons/fa6";
import { MdLock, MdOutlineArrowDropDown, MdOutlineEmail } from "react-icons/md";
import { BiPhoneCall } from "react-icons/bi";
import { RiCouponLine } from "react-icons/ri";
import { registerUser } from "../APIServices/APIServices";
import { SlUser } from "react-icons/sl";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
} from "../redux/auth-redux/actions";
import { PiPhoneCallLight } from "react-icons/pi";
import { TfiEmail } from "react-icons/tfi";
import LoginModal from "./LoginModal";
import ForgotPassword from "./ForgotPassword";
import { useFormik } from "formik";
import * as Yup from "yup";
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import indianFlag from "../assets/indianFlag.png";
import axios from "axios";
function RegisterUser({ onHandleWithdraw, t }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const settings = useSelector((state) => state?.auth?.settings);
  const coupon = useSelector((state) => state?.website);
  const userData = useSelector((state) => state?.auth);
  const data = userData?.user?.data;
  const [activeRefer, setActiveRefer] = useState(0);

  const [registerLoading, setRegisterLoading] = useState(false);
  const { bgYellow, redBtn, blackBtn, whiteText } = useSelector(
    (state) => state.theme
  );
  const toast = useToast();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
    city: "",
    country: "India",
    address: "",
    birthday: "",
    gender: "",
    promotion_id: "",
    currency: "INR",
    refer_by_code: "",
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { isLoggedIn } = useSelector((state) => state.auth);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

const [referCodeValue, setReferCodeValue] = useState(null); // State for refer_by_code


  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };
  const onCloseLoginModal = () => {
    setShowLoginModal(false);
  };
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      email: "",
      refer_by_code:coupon?.couponCode || referCodeValue,
      phone: "",
      birthday: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(5, t("userName5to16"))
        .max(16, t("userName5to16"))
        .required(t("userNameRequired")),
      password: Yup.string()
        .min(6, t("must6to12"))
        .max(12, t("must6to12"))
        .matches(/[a-zA-Z]/, t("mustHaveAlphabet"))
        .matches(/\d/, t("mustHaveAlphabet"))
        .matches(/^[a-zA-Z0-9]+$/, t("passwordContainNumber"))
        .required(t("passwordRequired")),
      confirmPassword: Yup.string()
        .required(t("confirmPasswordRequired"))
        .oneOf([Yup.ref("password"), null], "Password mismatch"),
      fullName: Yup.string()
        .required(t("fullNameRequired"))
        .matches(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/, {
          message: t("enterFullName"),
          excludeEmptyString: true,
        }),
      email: Yup.string()
        .required(t("emailRequired"))
        .email(t("invalidEmail"))
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i, "Invalid email"),
      phone: Yup.string()
        .required(t("mustHave10"))
        .matches(/^[6-9]/, t("mobileStartWith"))
        .matches(/\d{9}$/, t("mustHave10")),
      birthday: Yup.string()
        .matches(/^\d{4}-\d{2}-\d{2}$/, t("invalidDate"))
        .required(t("birthRequired")),
    }),
    
 
    onSubmit: async (values, { resetForm }) => {
      const {
        username,
        email,
        phone,
        password,
        confirmPassword,
        fullName,
        refer_by_code,
        birthday,
      } = values;


      // Calculate age of the user based on the provided birthday
      const today = new Date();
      const birthDate = new Date(birthday);
      const ageDiff = today.getFullYear() - birthDate.getFullYear();
      const isOver18 =
        ageDiff > 18 ||
        (ageDiff === 18 && today.getMonth() > birthDate.getMonth()) ||
        (today.getMonth() === birthDate.getMonth() &&
          today.getDate() >= birthDate.getDate());

      if (!isOver18) {
        toast({
          title: "User should be 18 years or older",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      if (!isChecked) {
        toast({
          title: "Please accept the terms and conditions",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        return;
      }
      setRegisterLoading(true);
      dispatch(loginRequest());

      try {
        const data = await registerUser({
          ...formData,
          username,
          confirmPassword,
          email,
          phone,
          password,
          first_name: fullName,
          birthday,
          refer_by_code,
        });

        if (data.success === true) {
          onClose();
          setShowLoginModal(true);
          dispatch(loginSuccess(data));
          toast({
            title: data.message || "User registered successfully!!!",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "top",
          });
          resetForm();
          onClose();
        }

        setRegisterLoading(false);
        setShowLoginModal(false);
      } catch (error) {
        dispatch(loginFailure(error.message));
        toast({
          title: error.message || "Error fetching user details",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });

        setRegisterLoading(false);
      }
    },
   
  });
  const location = useLocation();
  useEffect(() => {
    if (coupon?.couponCode && !data?.token && !data?.usernameToken) {
      onOpen();
    }
    else{
      setActiveRefer(0)
    }
  }, [coupon?.couponCode]);

  // /validate-refer-code"
  const [referLoading, setReferLoading] = useState(false);
  const handleReferCodeChange = (e) => {
    setReferCodeValue(e.target.value);  // Update external state
    formik.setFieldValue("refer_by_code", e.target.value); // Update formik state
  };
  
  const handleApplyReferCode = async () => {
    // if(!coupon?.couponCode){
    //   toast({
    //     title:"InVaild Refer Code",
    //     status: "success",
    //     duration: 2000,
    //     isClosable: true,
    //     position: "top",
    //   });
    // }
    setReferLoading(true);
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/user/validate-refer-code?site_auth_key=${
          import.meta.env.VITE_API_SITE_AUTH_KEY
        }`,
        {
          refer_by_code: coupon?.couponCode||referCodeValue,
        }
      );

      setActiveRefer(1)
      toast({
        title: response?.message || "Vaild Refer Code",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      console.error("Error apply otp:", error);
      setActiveRefer(2)

      toast({
        title: error?.response?.data?.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setReferLoading(false);
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <Box display="flex">
          <Button
            onClick={onHandleWithdraw}
            bg={{ base: blackBtn, xl: redBtn }}
            _hover={{ bg: { base: blackBtn, xl: redBtn } }}
            color={{ base: whiteText }}
            fontSize={{ base: ".9rem", xl: "16px" }}
            borderRadius={{ base: "25px", xl: "5px" }}
            minW={{ base: "85px", xl: "140px" }}
            height={{ base: "40px", xl: "50px" }}
            margin={{ base: "5px 0 5px 5px", xl: "5px" }}
            display={{ base: "none", xl: "block" }}
          >
            {t("withdraw")}
          </Button>
          <Button
            backgroundColor={blackBtn}
            color={whiteText}
            borderRadius="50%"
            width="40px"
            height="40px"
            display={{ base: "flex", xl: "none" }}
            padding="8px"
            onClick={() =>
              navigate("/Deposit", { state: { type: "withdraw" } })
            }
          >
            <FaMinus size={24} />
          </Button>
        </Box>
      ) : (
        <Button
          onClick={onOpen}
          bg={{ base: blackBtn, xl: redBtn }}
          _hover={{ bg: { base: blackBtn, xl: redBtn } }}
          color={{ base: whiteText }}
          fontSize={{ base: ".9rem", xl: "16px" }}
          borderRadius={{ base: "25px", xl: "5px" }}
          minW={{ base: "85px", xl: "140px" }}
          height={{ base: "40px", xl: "50px" }}
          margin={{ base: "5px 0 5px 5px", xl: "5px" }}
        >
          {t("register")}
        </Button>
      )}
      <div>
        <div>
          <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={isOpen}
            size={{ base: "full", lg: "lg" }}
            onClose={() => {
              formik.resetForm();
              onClose();
            }}
          >
            <ModalOverlay />
            <form onSubmit={formik.handleSubmit}>
              <ModalContent>
                <div className="flex justify-center pt-10 items-center">
                  <img
                    style={{ width: "170px", paddingTop: "10px" }}
                    src={settings?.site_logo}
                    alt="Logo"
                  />
                </div>
                <ModalHeader
                  style={{ paddingTop: "0", fontSize: "17px" }}
                  className="text-[10px] flex justify-center items-center"
                >
                  {t("welcomeCasino")}
                </ModalHeader>
                <ModalCloseButton />

                <div></div>
                <ModalBody
                  pb={{ base: 4, lg: 6 }}
                  pl={{ base: 4, lg: 12 }}
                  pr={{ base: 4, lg: 12 }}
                >
                  <FormControl mt={-2}>
                    <InputGroup>
                      <InputLeftElement
                        pointerEvents="none"
                        fontSize="xl"
                        style={{ paddingLeft: "10px" }}
                        children={
                          <HiOutlineUserCircle
                            color="#0f172a"
                            fontSize={"30px"}
                            style={{ marginTop: "10px" }}
                          />
                        }
                      />

                      <Input
                        placeholder={t("userName")}
                        name="username"
                        style={{
                          backgroundColor: "#F2F2F2",
                          height: "50px",
                          paddingLeft: "50px",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                        borderRadius={{ base: "20px", md: "6px" }}
                        focusBorderColor="yellow.500"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                      />
                    </InputGroup>
                    {formik.errors.username && formik.touched.username && (
                      <div
                        style={{
                          marginTop: "2px",
                          marginLeft: "300px",
                          height: "2px",
                        }}
                      >
                        <p
                          style={{
                            color: "red",
                            fontSize: ".8rem",
                            position: "absolute",
                            bottom: "-19px",
                            right: 0,
                          }}
                        >
                          {formik.errors.username}
                        </p>
                      </div>
                    )}
                  </FormControl>

                  <FormControl mt={3}>
                    <InputGroup>
                      <InputLeftElement
                        pointerEvents="none"
                        style={{ paddingLeft: "10px" }}
                        children={
                          <CiLock
                            color="#0f172a"
                            fontSize="30px"
                            style={{ marginTop: "10px" }}
                          />
                        }
                      />
                      <Input
                        placeholder={t("password")}
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        borderRadius={{ base: "20px", md: "6px" }}
                        style={{
                          backgroundColor: "#F2F2F2",
                          height: "50px",
                          paddingLeft: "50px",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                        focusBorderColor="yellow.500"
                      />
                      <InputRightElement
                        onClick={handlePasswordVisibility}
                        style={{ marginTop: "5px", marginRight: "15px" }}
                      >
                        {showPassword ? (
                          <AiFillEye style={{ fontSize: "25px" }} />
                        ) : (
                          <AiFillEyeInvisible style={{ fontSize: "25px" }} />
                        )}
                      </InputRightElement>
                    </InputGroup>
                    {formik.errors.password && formik.touched.password && (
                      <div
                        style={{
                          marginTop: "2px",
                          marginLeft: "300px",
                          height: "2px",
                        }}
                      >
                        <p
                          style={{
                            color: "red",
                            fontSize: ".8rem",
                            position: "absolute",
                            bottom: "-19px",
                            right: 0,
                          }}
                        >
                          {formik.errors.password}
                        </p>
                      </div>
                    )}
                  </FormControl>

                  <FormControl mt={3}>
                    <InputGroup>
                      <InputLeftElement
                        pointerEvents="none"
                        style={{ paddingLeft: "10px" }}
                        children={
                          <CiLock
                            color="#0f172a"
                            fontSize={"30px"}
                            style={{ marginTop: "10px" }}
                          />
                        }
                      />
                      <Input
                        placeholder={t("confirmPassword")}
                        name="confirmPassword"
                        type={showPassword2 ? "text" : "password"}
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        borderRadius={{ base: "20px", md: "6px" }}
                        style={{
                          backgroundColor: "#F2F2F2",
                          height: "50px",
                          paddingLeft: "50px",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                        focusBorderColor="yellow.500"
                      />
                      <InputRightElement
                        onClick={handlePasswordVisibility2}
                        style={{ marginTop: "5px", marginRight: "15px" }}
                      >
                        {showPassword2 ? (
                          <AiFillEye style={{ fontSize: "25px" }} />
                        ) : (
                          <AiFillEyeInvisible style={{ fontSize: "25px" }} />
                        )}
                      </InputRightElement>
                    </InputGroup>{" "}
                    {formik.errors.confirmPassword &&
                      formik.touched.confirmPassword && (
                        <div
                          style={{
                            marginTop: "2px",
                            marginLeft: "300px",
                            height: "2px",
                          }}
                        >
                          <p
                            style={{
                              color: "red",
                              fontSize: ".8rem",
                              position: "absolute",
                              bottom: "-19px",
                              right: 0,
                            }}
                          >
                            {formik.errors.confirmPassword}
                          </p>
                        </div>
                      )}
                  </FormControl>

                  <FormControl mt={4}>
                    <InputGroup>
                      <InputLeftElement
                        pointerEvents="none"
                        style={{ paddingLeft: "10px" }}
                        children={
                          <SlUser
                            color="#0f172a"
                            fontSize={"20px"}
                            style={{ marginTop: "10px" }}
                          />
                        }
                      />
                      <Input
                        placeholder={t("fullName")}
                        name="fullName"
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                        focusBorderColor="yellow.500" // Add this line
                        style={{
                          backgroundColor: "#F2F2F2",
                          height: "50px",
                          paddingLeft: "50px",
                          fontWeight: "bold",
                          fontSize: "16px",
                          
                        }}
                        borderRadius={{ base: "20px", md: "6px" }}
                      />
                    </InputGroup>
                    {formik.errors.fullName && formik.touched.fullName && (
                      <div
                        style={{
                          marginTop: "2px",
                          marginLeft: "300px",
                          height: "2px",
                        }}
                      >
                        <p
                          style={{
                            color: "red",
                            fontSize: ".8rem",
                            position: "absolute",
                            bottom: "-19px",
                            right: 0,
                          }}
                        >
                          {formik.errors.fullName}
                        </p>
                      </div>
                    )}
                  </FormControl>

                  <FormControl mt={4} style={{ gap: "15px", width: "100%" }}>
                    <div className="flex w-[100%] gap-3">
                      <div
                        style={{
                          backgroundColor: "#F2F2F2",
                          height: "50px",
                          fontWeight: "bold",
                          fontSize: "16px",
                          width: "35%",
                        }}
                        className="flex items-center justify-between border rounded-[20px] md:rounded-[6px]"
                      >
                        <div className="flex items-center gap-2 pl-[10px]">
                          <img
                            src={indianFlag}
                            alt=""
                            className="h-[28px] w-[28px]"
                          />
                          <p className="font-bold">+91</p>
                        </div>

                        <div className="mr-2">
                          <MdOutlineArrowDropDown fontSize={"30px"} />
                        </div>
                      </div>{" "}
                      <InputGroup style={{ width: "70%" }}>
                        <InputLeftElement
                          pointerEvents="none"
                          style={{ paddingLeft: "10px" }}
                          children={
                            <PiPhoneCallLight
                              color="#0f172a"
                              fontSize={"28px"}
                              style={{ marginTop: "10px" }}
                            />
                          }
                        />
                        <Input
                          placeholder={t("phone")}
                          name="phone"
                          value={formik.values.phone}
                          onChange={formik.handleChange}
                          style={{
                            backgroundColor: "#F2F2F2",
                            height: "50px",
                            paddingLeft: "50px",
                            fontWeight: "bold",
                            fontSize: "16px",
                          }}
                          borderRadius={{ base: "20px", md: "6px" }}
                          focusBorderColor="yellow.500"
                        />
                      </InputGroup>{" "}
                    </div>
                    {formik.errors.phone && formik.touched.phone && (
                      <div
                        style={{
                          marginTop: "2px",
                          marginLeft: "300px",
                          height: "2px",
                        }}
                      >
                        <p
                          style={{
                            color: "red",
                            fontSize: ".8rem",
                            position: "absolute",
                            bottom: "-19px",
                            right: 0,
                          }}
                        >
                          {formik.errors.phone}
                        </p>
                      </div>
                    )}
                  </FormControl>
                  <FormControl mt={4}>
                    <InputGroup>
                      <InputLeftElement
                        pointerEvents="none"
                        style={{ paddingLeft: "10px" }}
                        children={
                          <TfiEmail
                            color="#0f172a"
                            fontSize={"20px"}
                            style={{ marginTop: "10px" }}
                          />
                        }
                      />
                      <Input
                        placeholder={t("email")}
                        name="email"
                        type="email"
                        focusBorderColor="yellow.500"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        style={{
                          backgroundColor: "#F2F2F2",
                          height: "50px",
                          paddingLeft: "50px",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                        borderRadius={{ base: "20px", md: "6px" }}
                      />
                    </InputGroup>{" "}
                    {formik.errors.email && formik.touched.email && (
                      <div
                        style={{
                          marginTop: "2px",
                          marginLeft: "300px",
                          height: "2px",
                        }}
                      >
                        <p
                          style={{
                            color: "red",
                            fontSize: ".8rem",
                            position: "absolute",
                            bottom: "-19px",
                            right: 0,
                          }}
                        >
                          {formik.errors.email}
                        </p>
                      </div>
                    )}
                  </FormControl>
                  <FormControl mt={4}>
                    <InputGroup>
                      <InputLeftElement
                        pointerEvents="none"
                        style={{ paddingLeft: "10px" }}
                        children={
                          <FaRegUser
                            color="#0f172a"
                            fontSize={"20px"}
                            style={{ marginTop: "10px" }}
                          />
                        }
                      />
                      <Input
                        placeholder={t("birthday")}
                        name="birthday"
                        type="date"
                        value={formik.values.birthday}
                        onChange={formik.handleChange}
                        style={{
                          backgroundColor: "#F2F2F2",
                          height: "50px",
                          paddingLeft: "50px",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                        focusBorderColor="yellow.500"
                        borderRadius={{ base: "20px", md: "6px" }}
                      />
                    </InputGroup>
                    {formik.errors.birthday && formik.touched.birthday && (
                      <div
                        style={{
                          marginTop: "2px",
                          marginLeft: "300px",
                          height: "2px",
                        }}
                      >
                        <p
                          style={{
                            color: "red",
                            fontSize: ".8rem",
                            position: "absolute",
                            bottom: "-19px",
                            right: 0,
                          }}
                        >
                          {formik.errors.birthday}
                        </p>
                      </div>
                    )}
                  </FormControl>

                  <FormControl mt={4}>
                    <InputGroup>
                      <InputLeftElement
                        pointerEvents="none"
                        style={{ paddingLeft: "10px" }}
                        children={
                          <RiCouponLine
                            color="#0f172a"
                            fontSize={"20px"}
                            style={{ marginTop: "10px" }}
                          />
                        }
                      />
                      <Input
                        name="refer_by_code"
                        type="text"
                        style={{
                          backgroundColor: "#F2F2F2",
                          height: "50px",
                          paddingLeft: "50px",
                          fontWeight: "bold",
                          fontSize: "16px",
                          border: activeRefer === 1
                            ? "1px solid green"
                            : activeRefer === 2
                            ? "1px solid red"
                            : "1px solid gray",
                        }}
                        
                        value={
                          coupon?.couponCode || formik.values.refer_by_code
                        }
                        onChange={handleReferCodeChange}
                        borderRadius={{ base: "20px", md: "6px" }}
                        focusBorderColor="yellow.500"
                        placeholder={t("promoCode")}
                      />
                      <InputRightElement
                        width="4.5rem"
                        style={{ marginTop: "5px" }}
                      >
                        <Button
                          size="sm"
                          colorScheme="yellow"
                          borderRadius={{ base: "20px", md: "6px" }}
                          onClick={handleApplyReferCode}
                        >
                          {referLoading ? <Spinner /> : t("Apply")}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  <FormControl mt={4}>
                    <Checkbox
                      isChecked={isChecked}
                      onChange={handleCheckboxChange}
                      colorScheme="blackAlpha"
                      sx={{
                        "& .chakra-checkbox__control": {
                          bg: "white",
                          borderColor: "black",
                        },
                        "& .chakra-checkbox__control[data-checked]": {
                          bg: "black",
                          borderColor: "black",
                        },
                      }}
                    >
                      <Text className="text-black">{t("Iagree")}</Text>
                    </Checkbox>
                  </FormControl>
                  <div className="min-[992px]:hidden">
                    <Button
                      borderRadius={{ base: "20px", md: "6px" }}
                      width={{ base: "100%" }}
                      style={{
                        backgroundColor: blackBtn,
                        height: "50px",
                        color: whiteText,
                        marginTop: "5px",
                      }}
                      type="submit"
                    >
                      {t("joinNow")}
                    </Button>
                    <Button
                      borderRadius={{ base: "20px", md: "6px" }}
                      width={{ base: "100%" }}
                      style={{
                        border: "1px solid black",
                        height: "50px",
                        marginTop: "10px",
                        backgroundColor: whiteText,
                      }}
                      onClick={() => {
                        onClose();
                        setShowLoginModal(true);
                      }}
                    >
                      {t("Login")}
                    </Button>
                  </div>
                </ModalBody>

                <ModalFooter
                  display={{ base: "none", lg: "flex" }}
                  flexDirection="column"
                  alignItems="center"
                  style={{ marginTop: "-20px", marginBottom: "20px" }}
                >
                  <Button
                    borderRadius={{ base: "20px", md: "6px" }}
                    width={{ base: "100%", md: "90%" }}
                    style={{ backgroundColor: bgYellow, height: "50px" }}
                    type="submit"
                  >
                    {registerLoading ? <Spinner /> : t("joinNow")}
                  </Button>
                  <Text mt={4}>
                    {t("alreadyHaveAcc")} {""}
                    <Link
                      color="black"
                      style={{ fontWeight: "bold" }}
                      href="#"
                      onClick={() => {
                        onClose();
                        setShowLoginModal(true);
                      }}
                    >
                      {t("login")}
                    </Link>
                  </Text>
                </ModalFooter>
              </ModalContent>
            </form>
          </Modal>
        </div>
        {/* login modal */}
        <LoginModal
          onOpenRegisterModal={onOpen}
          setShowLoginModal={setShowLoginModal}
          showLoginModal={showLoginModal}
          onCloseLoginModal={onCloseLoginModal}
          setShowForgotModal={setShowForgotModal}
        />
        <ForgotPassword
          setShowForgotModal={setShowForgotModal}
          showForgotModal={showForgotModal}
        />
        {/* <ToastContainer /> */}
      </div>
    </>
  );
}

export default RegisterUser;
