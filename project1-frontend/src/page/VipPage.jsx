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
import spinWin from "../assets/images/vip/banner.jpg";
const VipPage = () => {
  const { bgGray, bgYellow, whiteText, bgColor1, progressBar, } = useSelector((state) => state.theme);
  const images = [Bronze, Silver, Gold, Platinum, Diamond, Sapphire];
  // Example data for the cards
  const cards = [
    {
      image: Bronze,
      heading: "Bronze",
      priceNUmber: [
        { label: "Upgrade Turnover", value: "0" },
        { label: "Maintain Turnover", value: "0" },
        { label: "Upgrade Bonus", value: "0" },
        { label: "Monthly Bonus", value: "0" },
        { label: "Birthday Bonus", value: "300" },
      ],
      features: [
        { label: "Priority Withdrawal Processing", value: <FaCheck /> },
        { label: "Relationship Manager Support", value: <IoMdClose /> },
        { label: "Festive Gift / Treats", value: <IoMdClose /> },
        { label: "Reward Points - No Expiry", value: <IoMdClose /> },
      ],
    },
    {
      image: Silver,
      heading: "Silver",
      priceNUmber: [
        { label: "Upgrade Turnover", value: "10" },
        { label: "Maintain Turnover", value: "0" },
        { label: "Upgrade Bonus", value: "0" },
        { label: "Monthly Bonus", value: "0" },
        { label: "Birthday Bonus", value: "300" },
      ],
      features: [
        { label: "Priority Withdrawal Processing", value: <FaCheck /> },
        { label: "Relationship Manager Support", value: <FaCheck /> },
        { label: "Festive Gift / Treats", value: <FaCheck /> },
        { label: "Reward Points - No Expiry", value: <FaCheck /> },
      ],
    },
    {
      image: Gold,
      heading: "Gold",
      priceNUmber: [
        { label: "Upgrade Turnover", value: "20" },
        { label: "Maintain Turnover", value: "0" },
        { label: "Upgrade Bonus", value: "0" },
        { label: "Monthly Bonus", value: "0" },
        { label: "Birthday Bonus", value: "300" },
      ],
      features: [
        { label: "Priority Withdrawal Processing", value: <FaCheck /> },
        { label: "Relationship Manager Support", value: <FaCheck /> },
        { label: "Festive Gift / Treats", value: <FaCheck /> },
        { label: "Reward Points - No Expiry", value: <FaCheck /> },
      ],
    },
    {
      image: Platinum,
      heading: "Platinum",
      priceNUmber: [
        { label: "Upgrade Turnover", value: "0" },
        { label: "Maintain Turnover", value: "0" },
        { label: "Upgrade Bonus", value: "0" },
        { label: "Monthly Bonus", value: "0" },
        { label: "Birthday Bonus", value: "300" },
      ],
      features: [
        { label: "Priority Withdrawal Processing", value: <FaCheck /> },
        { label: "Relationship Manager Support", value: <FaCheck /> },
        { label: "Festive Gift / Treats", value: <FaCheck /> },
        { label: "Reward Points - No Expiry", value: <FaCheck /> },
      ],
    },
    {
      image: Diamond,
      heading: "Diamond",
      priceNUmber: [
        { label: "Upgrade Turnover", value: "0" },
        { label: "Maintain Turnover", value: "0" },
        { label: "Upgrade Bonus", value: "0" },
        { label: "Monthly Bonus", value: "0" },
        { label: "Birthday Bonus", value: "300" },
      ],
      features: [
        { label: "Priority Withdrawal Processing", value: <FaCheck /> },
        { label: "Relationship Manager Support", value: <FaCheck /> },
        { label: "Festive Gift / Treats", value: <FaCheck /> },
        { label: "Reward Points - No Expiry", value: <FaCheck /> },
      ],
    },
    {
      image: Sapphire,
      heading: "Sapphire",
      priceNUmber: [
        { label: "Upgrade Turnover", value: "0" },
        { label: "Maintain Turnover", value: "0" },
        { label: "Upgrade Bonus", value: "0" },
        { label: "Monthly Bonus", value: "0" },
        { label: "Birthday Bonus", value: "300" },
      ],
      features: [
        { label: "Priority Withdrawal Processing", value: <FaCheck /> },
        { label: "Relationship Manager Support", value: <FaCheck /> },
        { label: "Festive Gift / Treats", value: <FaCheck /> },
        { label: "Reward Points - No Expiry", value: <FaCheck /> },
      ],
    },
  ];
  const TabsStyle = {
    minWidth: '100px',
    height: '100px',
    width: 'auto',
    borderRadius: '10px',
}
  return (
    <Box className="main_page vip_page_wrap">
      <Box className="spinWin_banner" p={{ base: "10px", xl: "0" }}>
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
          royaldeltin's VIP program is an exclusive initiative designed to enhance players' gaming experience on the platform. Participants in the royaldeltin program can enjoy a range of exclusive benefits tailored to their respective tiers, including offers, rewards, gifts, and other privileges.
          </Text>
        </Box>
        <Box backgroundColor={bgColor1}>
          <Box>
          <Box display={{ base: 'block', xl: "none" }} backgroundColor={{ base: bgColor1, xl: bgGray }} p={{ base: "10px", xl: "40px 60px" }}
            mt='10px'>
              <Flex gap="10px" flexDirection={{ base: "column" }} style={{ backgroundColor: bgColor1, textAlign: 'left' }} mt={4}>
                <Box style={{ backgroundColor: bgGray }} padding="15px">
                  <Box display='flex' gap="15px" bg="transparent" _hover={{ bg: 'transparent', }} justifyContent="flex-start">
                    <Image src={Bronze} alt="Bronze" boxSize="35px" />
                    <Text style={{ fontWeight: "bold" }} flexShrink={0}>VIP Bronze</Text>
                  </Box>
                  <Box position="relative" className="level_wrap">
                    <Progress value={0} style={{ backgroundColor: progressBar, height: "8px", width: "100%" }} colorScheme="primary" height="4px" mb="2" />
                    <Flex align="center" width="100%" flexGrow="100%">
                      <Box className="first-step" width="100%">
                        <Box className="prgoress_star box-outline default-center"
                          width="35px" height="35px"
                        ></Box>
                        <Text as="span" style={{ fontSize: "14px" }} marginTop="10px" display="inline-block">
                          <span >Bet Amount:</span>
                          <Text as="span" className="amount font-bold">0/1,000,000</Text>
                        </Text>
                      </Box>
                      <Box className="step" zIndex="1" right="-15px" position="absolute" top="-15px">
                        <Image src={Bronze} alt="Bronze" boxSize="50px" mr={2} width="35px" height="35px" />
                        <Text style={{ fontSize: "14px" }} as="span">Silver</Text>
                      </Box>
                    </Flex>
                  </Box>
                </Box>
              </Flex>
            </Box>
            <Box backgroundColor={{ base: bgColor1, xl: bgGray }}
              p={{ base: "10px", xl: "40px 60px" }}
              mb="10px">
              <Text className="default-title" fontSize="base" fontWeight="bold" display={{ base: "none", xl: "block" }}>
                VIP Benefits
              </Text>
              <Box className='desktopCards' overflow="hidden" display={{ base: "none", xl: "block" }}>
                <Flex justifyContent="center" overflow="auto">
                  {cards.map((card, index) => (
                    <Box key={index} borderWidth="1px" borderRadius="lg" overflowX="auto" p={4} m={4} width="325px" flexShrink='0' backgroundColor={bgColor1}>
                      <Image src={card.image} alt={card.heading} width="60px" height="60px" margin="0 auto" />
                      <Text textAlign="center" fontSize="xl" fontWeight="bold">
                        {card.heading}
                      </Text>
                      <VStack mt={2} spacing={2} alignItems="flex-start">
                        {card.priceNUmber.map((price, idx) => (
                          <Box key={idx} fontSize="md" width="100%">
                            <Flex justifyContent="space-between">
                              <Text>{price.label}</Text>
                              <Text>{price.value}</Text>
                            </Flex>
                          </Box>
                        ))}
                      </VStack>
                      {/* <Text mt={4} textAlign="center" fontSize="lg">
                        Features
                      </Text> */}
                       <hr />
                      <VStack mt={2} spacing={2} alignItems="flex-start">
                        {card.features.map((feature, idx) => (
                          <Box key={idx} alignItems="center" width="100%">
                            <Flex justifyContent="space-between">
                              <Text>{feature.label}</Text>
                              <Text>{feature.value}</Text>
                            </Flex>
                            {/* <FaCheck /> <Text ml={2} fontSize="md">{feature.label}</Text> */}
                          </Box>
                        ))}
                      </VStack>
                    </Box>
                  ))}
                </Flex>
              </Box>
              <Box className='mobileCards' display={{ base: "block", xl: "none" }}>
                <Tabs>
                  <TabList borderBottom="none" gap="10px" className='tabs_list_wr' overflowX="auto" paddingBottom="10px">
                    {cards.map((card, index) => (
                      <Tab key={index} style={{ backgroundColor: bgGray, ...TabsStyle, width: "110px", height: "93px",padding: "10px 6px 6px"  }}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                          <Image src={card.image} alt={card.heading} boxSize="40px" />
                          <Text mt={2}>{card.heading}</Text>
                        </Box>
                      </Tab>
                    ))}
                  </TabList>
                  <TabPanels>
                    {cards.map((card, index) => (
                      <TabPanel key={index}>
                        <Box>
                        <Heading as="h6">{card.heading}</Heading>
                        <VStack mt={2} spacing={2} alignItems="flex-start">
                        {card.priceNUmber.map((price, idx) => (
                          <Box key={idx} fontSize="md" width="100%">
                            <Flex justifyContent="space-between">
                              <Text>{price.label}</Text>
                              <Text>{price.value}</Text>
                            </Flex>
                          </Box>
                        ))}
                      </VStack>
                      <hr />
                          <VStack mt={2} spacing={2} alignItems="flex-start">
                        {card.features.map((feature, idx) => (
                          <Box key={idx} alignItems="center" width="100%">
                            <Flex justifyContent="space-between">
                              <Text>{feature.label}</Text>
                              <Text>{feature.value}</Text>
                            </Flex>
                            {/* <FaCheck /> <Text ml={2} fontSize="md">{feature.label}</Text> */}
                          </Box>
                        ))}
                      </VStack>
                        </Box>
                      </TabPanel>
                    ))}
                  </TabPanels>
                </Tabs>
              </Box>
            </Box>
            <Box backgroundColor={{ base: bgGray, xl: bgGray }} p={{ base: "10px", xl: "40px 60px" }}
              mb="10px" mt='10px'>
              <Box className="login-link-wrapper text-center" p="15px" style={{ backgroundColor: bgColor1, }}
              >
                <Box className="description">
                  <Text>Free Spins</Text>
                  <Text>Win 8,888 Credits and more</Text>
                </Box>
                <Button type="button" style={{ backgroundColor: bgYellow, color: whiteText }} textTransform="uppercase"
                  width={{ base: "100%", xl: "250px" }}
                  height="50px" borderRadius={{ base: "25px", xl: "5px" }}
                  textShadow="0 2px 3px rgba(0, 0, 0, .3)"
                >
                  Join Now
                </Button>
              </Box>
            </Box>
            <Box className="" style={{ backgroundColor: bgGray, }} p={{ base: "10px", xl: "40px 60px" }} mt='10px'>
              <Box className="page-content free-spin-wrapper">
                <Text className="default-title" fontSize="lg" fontWeight="bold">
                  Terms and Conditions
                </Text>
                <OrderedList className="termsCondition">
                  <ListItem>
                    <Flex align="center">
                      <Text>
                        Free spin tickets must be claimed from Spin and Win. Ticket claim issues should be reported by 23:59 pm (GMT+7) to Customer Support.
                      </Text>
                    </Flex>
                  </ListItem>
                  <ListItem>
                    <Flex align="center">
                      <Text>
                        Tickets must be claimed within 24 hours of issuance or they will expire.
                      </Text>
                    </Flex>
                  </ListItem>
                  <ListItem>
                    <Flex align="center">
                      <Text>
                        Promotion dates are from 00:00 am to 23:59 pm (GMT+7).
                      </Text>
                    </Flex>
                  </ListItem>
                  <ListItem>
                    <Flex align="center">
                      <Text>
                        Players who meet the requirements must visit the Spin and Win page to redeem tickets.
                      </Text>
                    </Flex>
                  </ListItem>
                  <ListItem>
                    <Flex align="center">
                      <Text>
                        Players can only have one account. Multiple or fraudulent accounts will be locked, and deposits forfeited.
                      </Text>
                    </Flex>
                  </ListItem>
                  <ListItem>
                    <Flex align="center">
                      <Text>
                      royaldeltin reserves the right to modify, alter, discontinue, cancel, refuse, or void Spin and Win at any time.
                      </Text>
                    </Flex>
                  </ListItem>
                  <ListItem>
                    <Flex align="center">
                      <Text>
                      royaldeltin's Terms and Conditions supersede all Spin and Win Terms and Conditions.
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

export default VipPage;

