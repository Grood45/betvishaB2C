import React, { useEffect, useState } from "react";
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Box,
  useToast,
  Spinner,
  Tab,
  Center,
  Text,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import InfoAndPayment from "./InfoAndPayment";
import BankTab from "../component/All-Page-Tabs/BankTabs";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiAlertCircle } from "react-icons/fi";
import Withdrawal from "../component/withdraw-component/Withdrawal";

const WithDraw = () => {
  const banks = [
    "State Bank of India (SBI)",
    "ICICI Bank",
    "HDFC Bank",
    "Axis Bank",
    "Punjab National Bank (PNB)",
    "Bank of Baroda (BOB)",
    "Canara Bank",
    "Union Bank of India",
    "Bank of India (BOI)",
    "IDBI Bank",
    "Central Bank of India",
    "Indian Bank",
    "Bank of Maharashtra",
    "UCO Bank",
    "Indian Overseas Bank (IOB)",
    "Punjab & Sind Bank",
    "Kotak Mahindra Bank",
    "IndusInd Bank",
    "Yes Bank",
    "RBL Bank",
    "Federal Bank",
    "IDFC First Bank",
    "Bandhan Bank",
    "South Indian Bank",
    "DCB Bank",
    "Nainital Bank",
    "Jammu & Kashmir Bank",
    "Karur Vysya Bank",
    "City Union Bank",
    "Dhanlaxmi Bank",
  ];
  const userData = useSelector((state) => state?.auth.user.user);
  const { data } = useSelector((state) => state.auth.user);

  const { bgColor1, bgGray, greenBtn, redBtn, whiteText } = useSelector(
    (state) => state.theme
  );

  const formik = useFormik({
    initialValues: {
      accountName: "",
      selectedBank: "",
      bankBranch: "",
      accountNumber: "",
      ifscCode: "",
    },
    validationSchema: Yup.object({
      accountName: Yup.string().required("Account Name is required"),
      selectedBank: Yup.string().required("Please select Bank"),
      bankBranch: Yup.string().required("Please Enter Bank Branch Name"),
      accountNumber: Yup.string()
        .required("Please Enter Your Account Number")
        .matches(
          /^\d{11,16}$/,
          "Account Number must be between 11 to 16 digits"
        ),
      ifscCode: Yup.string()
        .required("Please Enter IFSC Code")
        .matches(
          /^[A-Za-z]{4}\d{7}$/,
          "IFSC Code must be 4 alphabets followed by 7 digits"
        ),
    }),
    onSubmit: (values) => {
      // Handle form submission
    },
  });

  const toast = useToast();
  const [activeWithdraw, setActiveWithdraw] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState([]);
  const [singleWithdrawData, setSingleWithdrawData] = useState({});
  const getPaymentGateway = async () => {
    setLoading(true);
    try {
      let response = await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/payment/get-payment-method?type=withdraw`,
        {
          parent_admin_role_type: userData?.parent_admin_role_type,
          parent_admin_username: userData?.parent_admin_username,
        },
        {
          headers: {
            token: data?.token,
            usernametoken: data?.usernameToken,
          },
          params: {
            site_auth_key: import.meta.env.VITE_API_SITE_AUTH_KEY ,
          },
        }
      );
      setPaymentData(response?.data?.data);
      setSingleWithdrawData(response?.data?.data[0]);
      setActiveWithdraw(response?.data?.data[0]?._id)
      setLoading(false);
    } catch (error) {
      console.error("Error getting payment data:", error.message);
      toast({
        title: error.message || "Somthing went wrong!!!",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });

      setLoading(false);
    }
  };

  useEffect(() => {
    getPaymentGateway();
  }, []);

  const handleSingleWithdraw = (item) => {
    setSingleWithdrawData(item);
    setActiveWithdraw(item?._id);
  };

  const handleDeposit = () => {};
  const inputdiv = {
    fontSize: "1rem",
    fontWeight: 700,
    borderRadius: "5px",
    height: "50px",
    padding: "0 10px",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    flexWrap: "wrap",
    minWidth: 0,
    width: "100%",
    marginTop: "10px",
    marginBottom: "10px",
    "::placeholder": {
      color: "#000000de",
    },
    outlineColor: "#ffaa00",
  };
  const ListStyle = {
    lineHeight: "30px",
  };

  return (
    <div
      style={{ backgroundColor: bgColor1 }}
      className="main_page mt-5 ml-2"
     
    >
      <Flex>
        <InfoAndPayment />
        <div className="pl-2 w-[100%]">
        <Withdrawal/>

        </div>
        
      </Flex>
    </div>
  );
};

export default WithDraw;
