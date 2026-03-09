import React, { useEffect, useState } from "react";
import InfoAndPayment from "./InfoAndPayment";
import { Box, Flex, Text, Badge, Grid, GridItem, Divider, useToast } from "@chakra-ui/react";
import Account from "./Account";
import InfoMobileHeader from "../component/InfoMobileHeader";
// import { useSelector } from "react-redux";

import { useSelector } from "react-redux";
import autoprefixer from "autoprefixer";
import { useTranslation } from "react-i18next";
import axios from "axios";

function Wallet() {
  const singleUserDetails = useSelector((state) => state?.auth);
  const userData = singleUserDetails?.singleUserData
  const { bgColor1, bgGray, progressBar, secondaryText } = useSelector(
    (state) => state.theme
  );
  const users = useSelector((state) => state?.auth);
  const data = users?.user?.data;
  const [sportAmount, setSportAmountDetails] = useState({})
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [wagerData, setWagerData] = useState({})
  const toast = useToast()

  const fetchSportDetails = async () => {
    try {
      // Fetch active providers first
      const providersResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/sport/active-providers`);
      const activeProviders = providersResponse?.data?.data || [];

      let totalBalance = 0;
      let totalExposure = 0;

      for (const provider of activeProviders) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/sport/get-sport-balance`, {
            headers: {
              token: data?.token,
              usernametoken: data?.usernameToken
            },
            params: {
              providerName: provider.provider_name
            }
          });

          if (response.data.success && response.data.balance) {
            totalBalance += parseFloat(response.data.balance.balance || 0);
            totalExposure += parseFloat(response.data.balance.exposure || 0);
          }
        } catch (err) {
          console.error(`Error fetching balance for ${provider.provider_name}:`, err);
        }
      }

      setSportAmountDetails({ balance: totalBalance, exposure: totalExposure });
    } catch (error) {
      console.error("Error fetching sports providers:", error);
      setLoading(false);
    }
  };

  const getTotalWager = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/get-total-wager`, {
        headers: {
          token: data?.token,
          usernametoken: data?.usernameToken
        },
      });

      setWagerData(response?.data?.data)
    } catch (error) {
      // toast({
      //   title: error.message || "Error fetching user details",
      //   status: "warning",
      //   duration: 2000,
      //   isClosable: true,
      //   position: "top",
      // });
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchSportDetails()
    getTotalWager()
  }, [])
  return (
    <Box
      style={{ backgroundColor: bgColor1 }}
      backgroundColor={{ base: "white", md: bgColor1 }}
      className="   md:mt-[155px] md:ml-2"

    >
      <Box>
        <Flex
          style={{ backgroundColor: bgColor1 }}
          flexDirection={{ base: "column", xl: "row" }}
        >
          <InfoAndPayment />
          {/* <InfoMobileHeader></InfoMobileHeader> */}
          <Box
            width={{ base: "100%" }}
          >
            {/* <p className='text-center mt-2  w-[100%]  font-bold md:hidden'> Wallet</p> */}


            <div
              className=" bg-white lg:bg-[#F2F2F2] xl:ml-[12px] mb-4 xl:mb-0 p-5 rounded-[5px]"

            >

              <GridItem colSpan={4}>
                <div className="font-normal text-xl  md:text-lg pb-2" >{t(`Total Balance`)}: <span className="font-bold" >{userData?.currency} {userData?.amount?.toFixed(2)}</span></div>
              </GridItem>
              <Divider />

              <div className=" grid grid-cols-2 md:grid-cols-4 2xl:grid-cols-5 lg:w-[100%]  mt-4  gap-4">
                <div className="lg:bg-white bg-[#F2F2F2]  p-4 h-[90px] md:h-auto rounded-[4px] shadow-sm" >
                  <p className="font-bold text-green-600 text-sm  md:text-lg" >{t(`Main (Withdraw) Balance`)}</p>
                  <Text>{userData?.currency}  {userData?.amount?.toFixed(2)}</Text>
                </div>
                <div className="lg:bg-white bg-[#F2F2F2] p-4  h-[90px] md:h-auto  rounded-[4px] shadow-sm" >

                  <p className="font-bold text-sm text-red-500 md:text-lg">
                    {t(`Promotion`)} {t(`Balance`)}
                  </p>
                  <Text>{userData?.currency} {userData?.bonus?.toFixed(2)}</Text>

                </div>
                <div className="lg:bg-white bg-[#F2F2F2] p-4  h-[90px] md:h-auto  rounded-[4px] shadow-sm" >

                  <p className="font-bold text-sm text-orange-500 md:text-lg">
                    {t(`Total`)} {t(`Wager`)}
                  </p>
                  <Text>{wagerData?.totalWager || 0} </Text>

                </div>
                <div className="lg:bg-white bg-[#F2F2F2] p-4  h-[90px] md:h-auto  rounded-[4px] shadow-sm" >

                  <p className="font-bold text-sm text-orange-500 md:text-lg">
                    {t(`Wager`)} {t(`Left`)}
                  </p>
                  <Text>{wagerData?.wagerLeft || 0} </Text>

                </div>
                <div className="lg:bg-white bg-[#F2F2F2] p-4  h-[90px] md:h-auto  rounded-[4px] shadow-sm" >

                  <p className="font-bold text-sm text-orange-500 md:text-lg">
                    {t(`Sport`)} {t(`Exposure`)}
                  </p>
                  <Text>INR {Math.abs(sportAmount?.exposure) || 0}</Text>

                </div>

              </div>



            </div>

          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

export default Wallet;
