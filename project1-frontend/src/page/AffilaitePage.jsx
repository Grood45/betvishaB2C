import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Image, Text, Flex, VStack, Button, OrderedList, ListItem, Progress, Heading, Icon,TabList, Tab, TabPanels, TabPanel,Tabs } from '@chakra-ui/react';
import { FaCheck } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import Bronze from '../assets/images/vip/Bronze.png';
import Silver from '../assets/images/vip/Silver.png';
import Gold from '../assets/images/vip/Gold.png';
import Platinum from '../assets/images/vip/Platinum.png';
import Diamond from '../assets/images/vip/Diamond.png';
import Sapphire from '../assets/images/vip/Sapphire.png';
import spinWin from "../assets/affiliate-banner-web.webp";
import { useNavigate } from 'react-router-dom';
const AffilatePage = () => {
  const { bgGray, bgYellow, whiteText, bgColor1, progressBar, } = useSelector((state) => state.theme);
  const images = [Bronze, Silver, Gold, Platinum, Diamond, Sapphire];
  // Example data for the cards
  const navigate=useNavigate()

 
  return (
    <Box className="main_page vip_page_wrap">
      <Box className="spinWin_banner" >
        <Image src={spinWin} alt="spin and win" height={{ base: "100%" }} borderRadius={{ base: "5px", xl: "0" }} objectFit="cover" />
      </Box>
      <Box>
        <Box
          backgroundColor={{ base: bgColor1, xl: bgGray }}
          className="page-content introduction-wrapper"
          p={{ base: "10px", xl: "40px 60px" }}
          my="10px"
          borderRadius="5px"
        >
          <Text className="default-title" fontSize="base" fontWeight="bold">
            Introduction
          </Text>
          <Text>
          Become a royaldeltin's Affiliate! Promote royaldeltin's and earn lifetime commission by introducing your friends, family or online audience through your affiliate referral link.          </Text>
        </Box>
        <Box backgroundColor={bgColor1}>
          <Box>
        
          
          <div className="bg-[#F2F2F2] px-[20px] md:px-[60px] p-6 shadow-md rounded-md">
        <h2 className="text-lg font-semibold mb-4">Affiliate Details</h2>
        <div className="flex flex-col gap-y-3 font-bold  text-sm">
            <div className=' flex items-center p-4 justify-between  bg-white'>
            <div className="">Commission</div>
            <div>50%</div>
            </div>

            <div className=' flex items-center p-4 justify-between '>
            <div className="">Platform Fee</div>
            <div>18%</div>
            </div>

            <div className=' flex items-center p-4 justify-between  bg-white'>
            <div className="">Active Player</div>
            <div>5+</div>
            </div>

          
            <div className=' flex items-center p-4 justify-between  '>
            <div className="">Net Revenue</div>
            <div>INR 1+</div>
            </div>
          
            <div className=' flex items-center p-4 justify-between  bg-white'>
            <div className="">Min Payout</div>
            <div>INR 1,000</div>
            </div>

            <div className=' flex items-center p-4 justify-between  '>
            <div className="">Duration</div>
            <div>Monthly</div>
            </div>

          
          
          
          
        </div>
        <div className="mt-6 text-center">
          <p className="text-xl font-medium mb-2">
            Become an Affiliate <br />
            Earn Lifetime commission
          </p>
          <button
  className="bg-[#FFAA01] text-white font-semibold py-2 px-6 rounded-md shadow hover:bg-yellow-500"
  onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLScTTOBI5O9-BS-2FREvE9-xYaJH8NBrJsZF3uMvGPqktVjlRQ/viewform', '_blank')}
>
  JOIN NOW
</button>

        </div>
      </div>
            <Box className="" style={{ backgroundColor: bgGray, }} p={{ base: "10px", xl: "40px 60px" }} mt='10px'>
              <Box className="page-content free-spin-wrapper">
                <Text className="default-title" fontSize="lg" fontWeight="bold">
                  Terms and Conditions
                </Text>
                <OrderedList className="termsCondition">
                  <ListItem>
                    <Flex align="center">
                      <Text>
                      Affiliate will receive their commission on the 10th of every month.
                      </Text>
                    </Flex>
                  </ListItem>
                  <ListItem>
                    <Flex align="center">
                      <Text>
                      Commission is calculated with deduction of platform fee and promotion bonuses.
                      </Text>
                    </Flex>
                  </ListItem>
                  <ListItem>
                    <Flex align="center">
                      <Text>
                      Negative carryover is applied and settled with net revenue generated from the affiliate's downline member. Negative carryover will be carried forward to the next settlement date until the amount is zero.
                      </Text>
                    </Flex>
                  </ListItem>
                  <ListItem>
                    <Flex align="center">
                      <Text>
                      Affiliates will receive a minimum payout of INR 1,000. Affiliates should have at least five (5) real money members to receive the payouts.
                      </Text>
                    </Flex>
                  </ListItem>
                  <ListItem>
                    <Flex align="center">
                      <Text>
                      Affiliate downlines will not include those with multiple royaldeltin's accounts or without an affiliate referral or tracking URL. One people only can apply one Affiliate.In its sole and absolute discretion, the Company retains the right to cancel, alter, close, or add provisions to its Affiliate Program, as deemed appropriate by it.
                      </Text>
                    </Flex>
                  </ListItem>
                  <ListItem>
                    <Flex align="center">
                      <Text>
                      The Referral Bonus is not available to affiliates. Participation in other royaldeltin's promotions is possible. In case of violation, affiliates will be penalized.
                      </Text>
                    </Flex>
                  </ListItem>
                  <ListItem>
                    <Flex align="center">
                      <Text>
                      royaldeltin's <span onClick={()=>navigate("/terms-and-conditions")} className='font-bold cursor-pointer'>Terms and Conditions</span> apply.
                      </Text>
                    </Flex>
                  </ListItem>
                </OrderedList>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AffilatePage;

