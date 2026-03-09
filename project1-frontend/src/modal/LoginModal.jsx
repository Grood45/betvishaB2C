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
  Checkbox,
  Text,
  useDisclosure,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Link,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import {
  AiFillEye,
  AiFillEyeInvisible,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import img1 from "../assets/logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { FaRegCircleUser, FaUser } from "react-icons/fa6";
import { MdLock } from "react-icons/md";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  loginFailure,
  loginRequest,
  loginSuccess,
} from "../redux/auth-redux/actions";
import { userLogin } from "../APIServices/APIServices";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from "react-i18next";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { CiLock } from "react-icons/ci";
import { IoWallet } from "react-icons/io5";
import RegisterUser from "./RegisterUser";
import { setLoginForm } from "../redux/switch-web/action";

function LoginModal({
  onOpenRegisterModal,
  setShowLoginModal,
  showLoginModal,
  onCloseLoginModal,
  isShowJoinNowBtn = false,
  setShowForgotModal,
  id,
}) {
  const Style = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: "5px",
  };

  const { onOpen } = useDisclosure();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const isLoginForm = useSelector((state) => state?.website);

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const settings = useSelector((state) => state?.auth?.settings);
  const [loading, setLoading] = useState(false);
  const { bgYellow, whiteText, blackBtn, greenBtn, PrimaryText } = useSelector(
    (state) => state.theme
  );
  const dispatch = useDispatch();
  const toast = useToast();

  const handleLogin = async (userName, userPassword) => {
    dispatch(loginRequest());
    setLoading(true);
    try {
      const data = await userLogin(userName, userPassword);
      if (data.success === true) {
        dispatch(loginSuccess(data));
        toast({
          title: data?.message || "User Login successfully!!!!",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        setShowLoginModal(false);
      } else {
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

  const handleClose = () => {
    onCloseLoginModal();
  };

  useEffect(() => {
    if (isLoginForm?.loginForm) {
      handleOpen();
    dispatch(setLoginForm(false));

    }
  }, [isLoginForm?.loginForm]);

  const formik = useFormik({
    initialValues: {
      user_name: "",
      password: "",
    },
    validationSchema: Yup.object({
      user_name: Yup.string().required(t("userNameRequired")),
      password: Yup.string().required(t("passwordRequired")),
    }),
    onSubmit: (values, { resetForm }) => {
      handleLogin(values.user_name, values.password);
    },
  });

  const handleOpen = () => {

    onOpen();

    setShowLoginModal(true);
  };
  return (
    <>
      {isShowJoinNowBtn && (
        <Button
          onClick={onOpen}
          type="button"
          style={{ backgroundColor: bgYellow, color: whiteText }}
          textTransform="uppercase"
          width={{ base: "100%", xl: "250px" }}
          height="50px"
          borderRadius={{ base: "25px", xl: "5px" }}
          textShadow="0 2px 3px rgba(0, 0, 0, .3)"
        >
          Join Now
        </Button>
      )}

      {id == "2" && (
        <Button
          onClick={handleOpen}
          bg={{ base: bgYellow, xl: greenBtn }}
          _hover={{ bg: { base: bgYellow, xl: greenBtn } }}
          color={{ base: PrimaryText, xl: whiteText }}
          fontSize={{ base: ".9rem", xl: "16px" }}
          borderRadius={{ base: "25px", xl: "5px" }}
          minW={{ base: "85px", xl: "140px" }}
          height={{ base: "40px", xl: "50px" }}
          margin={{ base: "5px 0 5px", xl: "5px" }}
          type="submit"
        >
          {t("login")}
        </Button>
      )}

      {id == "3" && (
        <Link style={Style} onClick={handleOpen}>
          <FaUser size={28} />
          <Text>Account</Text>
        </Link>
      )}
      {id == "4" && (
        <Link style={Style} onClick={handleOpen}>
          <IoWallet size={28} />
          <Text>Deposit</Text>
        </Link>
      )}
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={showLoginModal}
        onClose={handleClose}
        size={{ base: "full", lg: "lg" }}
      >
        <ModalOverlay />
        <form onSubmit={formik.handleSubmit}>
          <ModalContent style={{ display: "flex", justifyContent: "center" }}>
            <div className="flex pt-[130px] lg:pt-10  justify-center items-center">
              <img
                style={{ width: "170px", paddingTop: "10px" }}
                src={settings?.site_logo}
                alt="Logo"
              />
            </div>
            <ModalHeader
              style={{ paddingTop: "0" }}
              className="text-base flex justify-center items-center"
            >
              {t("Welcome Back, Good Luck!")}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody
              pb={{ base: 4, lg: 6 }}
              pl={{ base: 4, lg: 12 }}
              pr={{ base: 4, lg: 12 }}
            >
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
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
                    ref={initialRef}
                    placeholder={t("userName")}
                    name="user_name"
                    value={formik.values.user_name}
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
                </InputGroup>
                {formik.errors.user_name && formik.touched.user_name && (
                  <p
                    style={{
                      color: "red",
                      fontSize: ".8rem",
                      marginTop: "-3px",
                      // marginLeft: '275px',
                      textAlign: "right",
                    }}
                  >
                    {formik.errors.user_name}
                  </p>
                )}
              </FormControl>

              <FormControl mt={4}>
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
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formik.values.password}
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
                  <InputRightElement
                    onClick={togglePasswordVisibility}
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
                  <p
                    style={{
                      color: "red",
                      fontSize: ".8rem",
                      marginTop: "-3px",
                      textAlign: "right",
                    }}
                  >
                    {formik.errors.password}
                  </p>
                )}
              </FormControl>
              <div className="flex justify-between items-center ">
                <Checkbox
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
                  mt={4}
                  ml={1}
                >
                  {t("rememberPassword")}
                </Checkbox>
                <p
                  onClick={() => {
                    setShowLoginModal(false);
                    setShowForgotModal(true);
                  }}
                  className="cursor-pointer font-bold text-lg"
                >
                  {t(`Forgot Password`)} ?
                </p>
              </div>

              <div className="min-[992px]:hidden">
                <Button
                  borderRadius={{ base: "20px", md: "6px" }}
                  width={{ base: "100%" }}
                  style={{
                    backgroundColor: blackBtn,
                    height: "50px",
                    color: whiteText,
                    marginTop: "25px",
                  }}
                  w="full"
                  type="submit"
                >
                  {loading ? <Spinner /> : t("login")}
                </Button>
                <Button
                  borderRadius={{ base: "20px", md: "6px" }}
                  width={{ base: "100%" }}
                  style={{
                    border: "1px solid black",
                    height: "50px",
                    marginTop: "15px",
                    backgroundColor: whiteText,
                  }}
                  w="full"
                  onClick={() => {
                    onOpenRegisterModal(true);
                    setShowLoginModal(false);
                  }}
                >
                  {t("Create New Account")}
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
                style={{
                  backgroundColor: bgYellow,
                  height: "50px",
                  width: "90%",
                }}
                w="full"
                type="submit"
              >
                {loading ? <Spinner /> : t("login")}
              </Button>
              <Text mt={4}>
                {t("Don't have an account?")}
                {""}
                <Link
                  color="black"
                  style={{ fontWeight: "bold" }}
                  href="#"
                  onClick={() => {
                    onOpenRegisterModal();
                    setShowLoginModal(false);
                  }}
                >
                  {t("Create Account")}
                </Link>
              </Text>
              <Text mt={2}>
                <Link
                  color="black"
                  style={{ fontWeight: "bold" }}
                  href="#"
                  onClick={() => {
                    setShowLoginModal(false);
                    setShowForgotModal(true);
                  }}
                >
                  {t("forgotPassword")}
                </Link>
              </Text>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>

      {/* <ToastContainer /> */}
    </>
  );
}

export default LoginModal;
