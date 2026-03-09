import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import upi from "../../assets/images/deposit/upi.svg";
import { FiAlertCircle } from "react-icons/fi";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Flex,
  Button,
  Text,
  FormControl,
  FormLabel,
  OrderedList,
  Heading,
  ListItem,
  Center,
  Input,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";

const Upi = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allDeposit, setPaymentData] = useState([]);
  const datas = useSelector((state) => state?.auth?.user);
  const userData = datas?.user;
  const [loading, setLoading] = useState(false);
  const [transactionType, setTransactionType] = useState("");
  const [search, setSearch] = useState("");
  const [transactionCount, setTransactionCount] = useState({
    pendingDepositCount: 0,
    pendingWithdrawCount: 0,
  });
  const toast = useToast();
  const [singleDepositData, setSingleDepositData] = useState({});
  const [pagination, setPagination] = useState({});
  const [amount, setAmount] = useState(null);
  const [rangeError, setRangeError] = useState(false);
  const totalPages = pagination.totalPages;
  const { bgColor1, bgGray, warning, greenBtn, PrimaryText, whiteText } =
    useSelector((state) => state.theme);

  const TabsStyle = {
    width: "auto",
    borderRadius: "10px",
  };
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isActive = (path) => {
    return location.pathname === path;
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
  const listItems = [
    {
      title: "Important Notes",
      listContent: [
        "Deposits are subjected to a 1x wagering requirement.",
        "Please always deposit to the latest bank shown on this page. If you deposit money into an old bank account and cause any delayed or lost, we will not be responsible.",
      ],
    },
  ];
  const { data } = useSelector((state) => state.auth.user);

  const getPaymentGateway = async () => {
    setLoading(true);
    try {
      let response = await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/payment/get-payment-method?type=deposit`,
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
      setSingleDepositData(response?.data?.data[0]);
      setLoading(false);
    } catch (error) {
      console.error("Error getting payment data:", error.message);
      //   toast({
      //     title: error.message || 'Somthing went wrong !',
      //     status: "error",
      //     duration: 2000,
      //     isClosable: true,
      //     position: "top",
      //   });
      console.log(error, "error");

      setLoading(false);
    }
  };

  useEffect(() => {
    getPaymentGateway();
  }, []);

  const handleSingleDeposit = (item) => {
    setSingleDepositData(item);
  };

  const handleDeposit = () => {
    if (
      amount > singleDepositData?.min_limit &&
      amount < singleDepositData?.max_limit
    ) {
      const queryParams = new URLSearchParams();
      queryParams.append(
        "singleDepositData",
        JSON.stringify(singleDepositData)
      );
      queryParams.append("amount", amount);
      // window.open(`/payment?${queryParams.toString()}`);
      window.location.href = `/payment?${queryParams.toString()}`;
    } else {
      setRangeError(true);
    }
  };

  const handleAmount = (e) => {
    setAmount(e.target.value);
    if (
      e.target.value > singleDepositData?.min_limit &&
      e.target.value < singleDepositData?.max_limit
    ) {
      setRangeError(false);
    } else {
      setRangeError(true);
    }
  };
  
  return (
    <Box maxW="100%" my={3}>
      <Flex gap="10px" flexDirection="column" style={{ textAlign: "left" }}>
        <Box
          className="p-3"
          width={{ base: "100%", xl: "800px" }}
          height="auto"
          padding={{ base: "0", xl: "15px 34px" }}
          borderRadius="5px"
          bg={{ base: "transparent", xl: bgGray }}
        >
          <Box display="flex" flexDirection="column">
            <Tabs
              display="flex"
              flexDirection={{ base: "column", xl: "column" }}
            >
              <Box display="flex" flexDirection={{ base: "column", xl: "row" }}>
                <Box
                  width="100%"
                  maxWidth="250px"
                  minWidth="250px"
                  margin="5px"
                  fontWeight="700"
                >
                  {t(`Payment Channels`)}
                </Box>

                <Box
                  gap="10px"
                  className="flex xl:-ml-4  overflow-scroll py-2 w-[100%] "
                >
                  {loading ? <Spinner /> : ""}
                  {allDeposit?.map((item) => {
                    return (
                      <Tab
                        onClick={() => handleSingleDeposit(item)}
                        style={{ border: "2px soloid red" }}
                        border="0"
                        padding="0"
                      >
                        <Box
                          bg={{ base: bgGray, xl: bgColor1 }}
                          style={{
                            ...TabsStyle,
                            width: "95px",
                            height: "85px",
                          }}
                          className={`home-tab rounded text-center  relative`}
                          padding="10px 6px 6px"
                          borderRadius="5px"
                        >
                          <span className="absolute -top-2 h-[20px] w-[20px] text-white bg-black border border-yellow-600 -right-1 rounded-[50%] flex items-center justify-center text-[8px] font-bold ">
                            {item?.bonus}%
                          </span>
                          <Center h="100%">
                            <Link
                              className="flex items-center justify-between text-xs flex-col font-bold"
                              flexDirection="column"
                              justifyContent="center"
                              alignItems="center"
                              height="100%"
                              style={{ height: "100%" }}
                            >
                              <img
                                src={item?.image}
                                alt=""
                                width="36px"
                                height="36px"
                              />
                              {item?.gateway}
                            </Link>
                          </Center>
                        </Box>
                      </Tab>
                    );
                  })}
                </Box>
              </Box>

              <Box>
                <Box>
                  <Box>
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
                        <Box width={{ base: "100%", xl: "calc(100% - 250px)" }}>
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
                                className="whteBg_xl inputdiv rounded text-black-700"
                                type="text"
                                value={amount}
                                onChange={(e) => handleAmount(e)}
                              />
                              {rangeError ? (
                                <p className="text-xs  text-red-500 text-end w-[100%]">
                                  Must be within transaction range
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
                              <FiAlertCircle stroke={warning} size={26} />
                              <Text color={warning}>
                                {`Min/Max`} {t(`Limit`)}:{" "}
                                {singleDepositData?.min_limit}/
                                {singleDepositData?.max_limit}
                              </Text>
                            </Box>
                          </Box>
                          <Box paddingTop="10px">
                            <Button
                              bg={{ base: greenBtn }}
                              _hover={{ bg: { base: greenBtn } }}
                              color={{ base: whiteText, xl: whiteText }}
                              fontSize={{ base: ".9rem", xl: "16px" }}
                              borderRadius={{ base: "25px", xl: "5px" }}
                              minW={{ base: "100%", xl: "100%" }}
                              height={{ base: "40px", xl: "50px" }}
                              margin={{ base: "5px 0 5px", xl: "5px" }}
                              flex="1"
                              textShadow="0 2px 3px rgba(0, 0, 0, .3)"
                              textTransform="uppercase"
                              onClick={handleDeposit}
                            >
                              {t(`DEPOSIT`)}
                            </Button>
                          </Box>
                        </Box>
                      </Flex>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Tabs>
          </Box>
        </Box>
      </Flex>
      <Box>
        <Box p="3px 10px 3px 0">
          {listItems.map((item, index) => (
            <OrderedList key={index} ml="0" mb="15px">
              {item.title && (
                <Heading as="h6" style={{ ...ListStyle, color: warning }}>
                  {t(item.title)}
                </Heading>
              )}
              {item.listContent.map((content, idx) => (
                <ListItem
                  key={idx}
                  style={{ ...ListStyle }}
                  display="list-item"
                  ml="20px"
                  sx={{
                    "&::marker": {
                      textAlign: "left", // Set marker to left align
                    },
                  }}
                >
                  {content}
                </ListItem>
              ))}
            </OrderedList>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Upi;
