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
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiAlertCircle } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import MobileVerification from "../All-Page-Tabs/Account-component/MobileVerification";
import EmailVerification from "../All-Page-Tabs/Account-component/EmailVerification";
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
const Withdrawal = () => {
  const { t } = useTranslation();
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
  const singleUserDetails = useSelector((state) => state?.auth);
  const userData = singleUserDetails?.singleUserData;
  const { data } = useSelector((state) => state?.auth?.user);
  const { bgColor1, bgGray, greenBtn, redBtn, whiteText } = useSelector(
    (state) => state.theme
  );
  const [copiedItem, setCopiedItem] = useState(null);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [rangeError, setRangeError] = useState(false);
  const [amount, setAmount] = useState(null);

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
            site_auth_key: import.meta.env.VITE_API_SITE_AUTH_KEY,
          },
        }
      );
      setPaymentData(response?.data?.data);
      setSingleWithdrawData(response?.data?.data[0]);
      setActiveWithdraw(response?.data?.data[0]?._id);
      setLoading(false);
    } catch (error) {
      console.error("Error getting payment data:", error.message);
      // toast({
      //   title: error.message || 'Somthing went wrong !',
      //   status: "error",
      //   duration: 2000,
      //   isClosable: true,
      //   position: "top",
      // });

      setLoading(false);
    }
  };

  useEffect(() => {
    getPaymentGateway();
  }, []);

  const handleSingleWithdraw = (item) => {
    setSingleWithdrawData(item);
    setFormData({});
    setActiveWithdraw(item?._id);
  };

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

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedItem(text);
        toast({
          title: ` ${text} has been copied`,
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      })
      .catch((err) => console.error("Failed to copy: ", err));
  };
  const [dwithdrawSucces, setWithdrawSucces] = useState(false);
  const [formData, setFormData] = useState({});
  const [fileData, setFileData] = useState({});
  const [selectedImage, setSelectedImage] = useState("");

  const MakeWithdrawRequest = async () => {
    if (
      amount < singleWithdrawData?.min_limit ||
      amount > singleWithdrawData?.max_limit
    ) {
      toast({
        title: `Amount should be range`,
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    for (let item of singleWithdrawData?.user_details || []) {
      if (item.required === "true" && !formData[item.name]) {
        toast({
          title: `Please fill out all required fields.`,
          status: "warning",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        return;
      }
    }
    setWithdrawLoading(true);

    const payload = {
      method: singleWithdrawData.gateway,
      method_url: singleWithdrawData.image,
      username: userData?.username,
      method_id: singleWithdrawData._id,
      user_id: userData?.user_id,
      user_type: "user",
      payable: Number(amount),
      withdraw_amount: amount,
      bonus: userData?.bonus,
      after_withdraw: Number(userData?.amount) - Number(amount),
      wallet_amount: userData?.amount,
      admin_response: "",
      user_details: formData, // Ensure correct property name
      admin_details: singleWithdrawData.admin_details,
      utr_no: "486",
      currency: userData?.currency,
      site_auth_key: import.meta.env.VITE_API_SITE_AUTH_KEY,
      parent_admin_role_type: userData?.parent_admin_role_type,
      parent_admin_username: userData?.parent_admin_username,
    };
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/transaction/create-withdraw-request/${userData?.username}`,
        payload,
        {
          headers: {
            token: data?.token,
            usernametoken: data?.usernameToken,
          },
        }
      );

      setWithdrawLoading(false);
      setWithdrawSucces(true);
      toast({
        title: response?.message || "Withdraw request placed successfully !",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setFormData({});
      setAmount("");
    } catch (error) {
      toast({
        title: error?.response?.data?.message || error?.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.error("Error creating deposit request:", error);
      setWithdrawLoading(false);
    }
  };

  const handleInputChange = (e, fieldName) => {
    if (e.target.type === "file") {
      const file = e.target.files[0];
      handleImageUpload(file, fieldName);
    } else {
      setFormData({
        ...formData,
        [fieldName]: e.target.value,
      });
    }
  };

  const handleImageUpload = async (file, fieldName) => {
    setImageUploadLoading(true);
    const formDatas = new FormData();
    formDatas.append("post_img", file);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/image-url`,
        formDatas,
        {
          headers: {
            token: data?.token,
            usernametoken: data?.usernameToken,
          },
        }
      );

      if (response.data.url) {
        toast({
          title: "Image uploaded successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        setSelectedImage(response.data.url);
        setFormData({
          ...formData,
          [fieldName]: response.data.url,
        });
        setImageUploadLoading(false);
      }
      setImageUploadLoading(false);
    } catch (error) {
      console.error("Error uploading image:", error.message);
      toast({
        title: "Error uploading image",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      setImageUploadLoading(false);
    }
  };

  const handleAmount = (e) => {
    setAmount(e.target.value);
    if (
      e.target.value > singleWithdrawData?.min_limit &&
      e.target.value < singleWithdrawData?.max_limit
    ) {
      setRangeError(false);
    } else {
      setRangeError(true);
    }
  };

  return (
    <div className="w-[100%] mb-10 md:mb-0">
      <div className="flex w-[100%] gap-2 pt-2">
        <div gap="10px" className="flex   w-[100%]  ">
          {loading ? <Spinner /> : ""}
          <div className="w-[100%]  sm:m-0 sm:w-[60%]  grid grid-cols-4 lg:grid-cols-6 items-center   justify-between gap-2 md:gap-1">
            {paymentData?.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={() => handleSingleWithdraw(item)}
                  bg={{ base: bgGray, xl: bgColor1 }}
                  className={` rounded-[12px]  text-center  cursor-pointer border-2 h-[98%] ${
                    item?._id === activeWithdraw ? "bg-[#ffaa00]" : ""
                  }   w-[100%]  `}
                  borderRadius="5px"
                >
                  <div
                    className="flex items-center py-2 justify-between text-xs flex-col font-bold"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                    style={{ height: "100%" }}
                  >
                    <img
                      src={item?.image}
                      alt=""
                      className="w-[40px] md:w-[60px]"
                    />

                    <p className=" text-xs lowercase md:text-sm  ">
                      {" "}
                      {item?.gateway}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {userData?.is_withdraw_suspend ? (
        <div
          style={{ backgroundColor: bgGray }}
          className=" rounded-lg p-8 text-center mt-2 w-[100%] md:w-[700px]"
        >
          <div className="flex flex-col items-center justify-center mb-4">
            <svg
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              width="150px"
              height="150px"
              viewBox="0 0 500 500"
              style={{ enableBackground: "new 0 0 500 500" }}
              xmlSpace="preserve"
            >
              <style type="text/css">
                {`
        .st0{fill:#AEAEAE;}
      `}
              </style>
              <g>
                <g>
                  <path
                    className="st0"
                    d="M316.7,194.1H409c15.6,30,24.6,64.8,24.6,102C433.6,408.7,351.4,500,250,500S66.4,408.7,66.4,296.1
            c0-37.1,8.9-72,24.6-102h92.3c1.2,1.4,2.4,2.9,3.6,4.2c17.4,19.4,39.8,30,63.1,30c23.3,0,45.7-10.7,63.1-30
            C314.3,196.9,315.5,195.5,316.7,194.1z M229.8,317.7l-45.1,6.6l32.6,31.8l-7.7,44.9l40.3-21.2l40.3,21.2l-7.7-44.9l32.6-31.8
            l-45.1-6.6L250,276.9L229.8,317.7z"
                  />
                </g>
                <path
                  className="st0"
                  d="M161.1,138.7c0-49.5,40.3-89.7,89.7-89.7s89.7,40.3,89.7,89.7v55.4h48.9v-55.4C389.5,62.2,327.3,0,250.8,0
          S112.1,62.2,112.1,138.7v55.4h48.9V138.7z"
                />
              </g>
            </svg>

            <p className="font-semibold text-red-500 mt-5 text-sm text-center">
              Your Withdrawal is suspended. Please contact wih admin !
            </p>
          </div>
        </div>
      ) : (
        <>
          {
            //  userData?.sms_verified&&
            userData?.email_verified ? (
              <div className="w-[100%] mt-2">
                <div
                  className="flex flex-col w-[100%] gap-2"
                  style={{ textAlign: "left" }}
                >
                  <div
                    className="rounded-[5px] p-4 w-[100%] md:w-[700px]"
                    style={{ backgroundColor: bgGray }}
                  >
                    <p className="text-end font-bold">
                      {t(`Withdraw`)} {t(`Balance`)} :{" "}
                      <span className="text-green-500">
                        {userData?.amount} {userData?.currency}
                      </span>
                    </p>

                    <div className="mt-6">
                      <div className="">
                        {singleWithdrawData?.user_details?.map((item) => {
                          return (
                            <div
                              key={item?.id}
                              className="flex items-start  justify-between w-[100%]"
                            >
                              <p className="font-bold">{t(item.name)}</p>
                              <div className="w-[60%] sm:w-[54%]">
                                {item?.type === "file" ? (
                                  <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                      handleInputChange(e, item?.name)
                                    }
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                  />
                                ) : (
                                  <input
                                    type={item?.type}
                                    value={formData[item?.name] || ""}
                                    onChange={(e) =>
                                      handleInputChange(e, item?.name)
                                    }
                                    required={item?.required === "true"}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                  />
                                )}
                                {item.type == "file" && imageUploadLoading ? (
                                  <Spinner />
                                ) : (
                                  ""
                                )}
                                {item.required === "true" && (
                                  <p className="text-red-500 mt-1 text-xs text-end">
                                    {t(`required`)}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <Box display="flex" flexDirection="column">
                        <Flex
                          flexDirection={{ base: "column", xl: "row" }}
                          position="relative"
                        >
                          <Box
                            width="237px"
                            minWidth="237px"
                            margin="5px"
                            fontWeight="700"
                            position={{ base: "absolute", xl: "inherit" }}
                          >
                            {t(`Amount`)}
                          </Box>
                          <Box
                            width={{ base: "100%", xl: "calc(100% - 250px)" }}
                          >
                            <Box
                              display="flex"
                              flexDirection={{
                                base: "column-reverse",
                                xl: "column",
                              }}
                            >
                              <Box style={{ width: "100%" }}>
                                <input
                                  style={{
                                    ...inputdiv,
                                    backgroundColor: bgColor1,
                                  }}
                                  className="bg-white inputdiv rounded text-black-700"
                                  type="text"
                                  value={amount}
                                  onChange={(e) => handleAmount(e)}
                                />
                                {rangeError ? (
                                  <p className="text-xs  text-red-500 text-end w-[100%]">
                                    {t(`Must be within transaction range`)}
                                  </p>
                                ) : (
                                  ""
                                )}
                              </Box>
                              <Box
                                display="flex"
                                justifyContent={{ base: "end", xl: "start" }}
                                gap="10px"
                              >
                                <FiAlertCircle stroke={"red"} size={26} />
                                <p className="text-left text-red-500">
                                  Min/Max {t(`Limit`)}:{" "}
                                  {singleWithdrawData?.min_limit}/
                                  {singleWithdrawData?.max_limit}
                                </p>
                              </Box>
                            </Box>
                            <Box paddingTop="10px">
                              <Button
                                bg={{ base: redBtn }}
                                _hover={{ bg: { base: redBtn } }}
                                color={{ base: whiteText, xl: whiteText }}
                                fontSize={{ base: ".9rem", xl: "16px" }}
                                borderRadius={{ base: "25px", xl: "5px" }}
                                minW={{ base: "100%", xl: "100%" }}
                                height={{ base: "40px", xl: "50px" }}
                                margin={{ base: "5px 0 5px", xl: "5px" }}
                                flex="1"
                                textShadow="0 2px 3px rgba(0, 0, 0, .3)"
                                textTransform="uppercase"
                                onClick={MakeWithdrawRequest}
                              >
                                {withdrawLoading ? <Spinner /> : t(`WITHDRAW`)}
                              </Button>
                            </Box>
                          </Box>
                        </Flex>
                      </Box>
                    </div>
                  </div>
                  <p className="text-red-600 font-bold">
                    {t(`Important Notes`)}
                  </p>
                  <div className="flex">
                    <p className="text-left -mt-3 font-medium">
                      {singleWithdrawData?.instruction}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center mt-2 justify-start  w-[100%] md:w-[700px]">
                <div
                  style={{ backgroundColor: bgGray }}
                  className=" rounded-lg p-8 text-center w-full"
                >
                  <div className="flex justify-center mb-4">
                    <svg
                      version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      x="0px"
                      y="0px"
                      width="150px"
                      height="150px"
                      viewBox="0 0 500 500"
                      style={{ enableBackground: "new 0 0 500 500" }}
                      xmlSpace="preserve"
                    >
                      <style type="text/css">
                        {`
        .st0{fill:#AEAEAE;}
      `}
                      </style>
                      <g>
                        <g>
                          <path
                            className="st0"
                            d="M316.7,194.1H409c15.6,30,24.6,64.8,24.6,102C433.6,408.7,351.4,500,250,500S66.4,408.7,66.4,296.1
            c0-37.1,8.9-72,24.6-102h92.3c1.2,1.4,2.4,2.9,3.6,4.2c17.4,19.4,39.8,30,63.1,30c23.3,0,45.7-10.7,63.1-30
            C314.3,196.9,315.5,195.5,316.7,194.1z M229.8,317.7l-45.1,6.6l32.6,31.8l-7.7,44.9l40.3-21.2l40.3,21.2l-7.7-44.9l32.6-31.8
            l-45.1-6.6L250,276.9L229.8,317.7z"
                          />
                        </g>
                        <path
                          className="st0"
                          d="M161.1,138.7c0-49.5,40.3-89.7,89.7-89.7s89.7,40.3,89.7,89.7v55.4h48.9v-55.4C389.5,62.2,327.3,0,250.8,0
          S112.1,62.2,112.1,138.7v55.4h48.9V138.7z"
                        />
                      </g>
                    </svg>
                  </div>
                  <h2 className="text-lg font-medium text-gray-700 mb-4">
                    Verify your mobile to unlock this feature.
                  </h2>
                  {/* <MobileVerification type="2"/> */}
                  <EmailVerification type="2" />
                </div>
              </div>
            )
          }
        </>
      )}
    </div>
  );
};

export default Withdrawal;
