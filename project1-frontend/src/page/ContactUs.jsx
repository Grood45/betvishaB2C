import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Image, Text, Flex, VStack, Button, OrderedList, ListItem, Grid, GridItem } from '@chakra-ui/react';
import { FaCheck } from "react-icons/fa6";
import Bronze from '../assets/images/vip/Bronze.png';
import Silver from '../assets/images/vip/Silver.png';
import Gold from '../assets/images/vip/Gold.png';
import Platinum from '../assets/images/vip/Platinum.png';
import Diamond from '../assets/images/vip/Diamond.png';
import Sapphire from '../assets/images/vip/Sapphire.png';
import contactUs from "../assets/images/contact-us/contactus.jpg";
import { RiTelegramLine } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { BsChatDotsFill } from "react-icons/bs";


const ContactUs = () => {
    const { bgGray, bgYellow, whiteText, bgColor1, greenBtn, secondaryText } = useSelector((state) => state.theme);
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
                { label: "Relationship Manager Support", value: <FaCheck /> },
                { label: "Festive Gift / Treats", value: <FaCheck /> },
                { label: "Reward Points - No Expiry", value: <FaCheck /> },
            ],
        },
        {
            image: Silver,
            heading: "Silver",
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
            image: Gold,
            heading: "Gold",
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

    return (
        <Box className="main_page">
            <Box className="spinWin_banner" p={{ base: "10px", xl: "0" }}>
                <Image src={contactUs} alt="spin and win" height={{ base: "100%", xl: "480px" }} borderRadius={{ base: "5px", xl: "0" }} objectFit="cover" />
            </Box>
            <Box>
                <Box
                    backgroundColor={{base:bgColor1, xl:bgGray}}
                    className="page-content introduction-wrapper"
                    p={{ base: "10px", xl: "40px 60px" }}
                    mt="10px"
                    borderRadius="5px"
                >
                    <Box className='container' margin="0 auto">
                        <Grid templateColumns={{base:"repeat(1, 1fr)",sm:"repeat(2, 1fr)", xl:"repeat(3, 1fr)"}} gap="10px" rowGap="20px" gridGap="10px" gridRowGap="10px">
                            <GridItem display="flex" alignItems="center" flexDirection="column" padding="15px" gap="20px" backgroundColor={{base:bgGray, xl:bgColor1}} w='100%'>
                                <RiTelegramLine size={32} />
                                <Box  textAlign="center">
                                    <Text fontWeight="bold">Telegram Contact</Text>
                                    <Text fontWeight="bold" as="span" style={{ color: secondaryText, whiteSpace: "nowrap"  }}>@bvinr_support</Text>
                                </Box>
                                <Button bg={{ base: greenBtn, xl: greenBtn }} _hover={{ bg: { base: greenBtn, xl: greenBtn } }}
                                    color={{ base: whiteText, xl: whiteText }}
                                    fontSize={{ base: ".9rem", xl: "16px" }}
                                    borderRadius={{ base: "25px", xl: "5px" }}
                                    minW={{ base: "85px", xl: "140px" }}
                                    height={{ base: "40px", xl: "50px" }}
                                    margin={{ base: "5px 0 5px", xl: "5px" }}
                                    display={{ xl: "block" }}
                                    textTransform="uppercase"
                                >
                                    Contact US
                                </Button>
                            </GridItem>
                            <GridItem display="flex" justifyContent="center" alignItems="center" flexDirection="column" padding="15px" gap="20px" backgroundColor={{base:bgGray, xl:bgColor1}} w='100%'>
                                <BsChatDotsFill size={32} />
                                <Box  textAlign="center">
                                    <Text fontWeight="bold">Chat with us</Text>
                                    <Text fontWeight="bold" as="span" style={{ color: secondaryText,  whiteSpace: "nowrap"  }}>Open Live Chat</Text>
                                </Box>
                                <Button bg={{ base: greenBtn, xl: greenBtn }} _hover={{ bg: { base: greenBtn, xl: greenBtn } }}
                                    color={{ base: whiteText, xl: whiteText }}
                                    fontSize={{ base: ".9rem", xl: "16px" }}
                                    borderRadius={{ base: "25px", xl: "5px" }}
                                    minW={{ base: "85px", xl: "140px" }}
                                    height={{ base: "40px", xl: "50px" }}
                                    margin={{ base: "5px 0 5px", xl: "5px" }}
                                    display={{ xl: "block" }}
                                    textTransform="uppercase"
                                >
                                    Contact US
                                </Button>
                            </GridItem>
                            <GridItem display="flex" justifyContent="center" alignItems="center" flexDirection="column" padding="15px" gap="20px" backgroundColor={{base:bgGray, xl:bgColor1}} w='100%'>
                                <MdEmail size={32} />
                                <Box  textAlign="center">
                                    <Text fontWeight="bold">Email us at</Text>
                                    <Text fontWeight="bold" as="span" style={{ color: secondaryText, whiteSpace: "nowrap"  }}>marketing.inr@royaldeltin.com</Text>
                                </Box>
                                <Button bg={{ base: greenBtn, xl: greenBtn }} _hover={{ bg: { base: greenBtn, xl: greenBtn } }}
                                    color={{ base: whiteText, xl: whiteText }}
                                    fontSize={{ base: ".9rem", xl: "16px" }}
                                    borderRadius={{ base: "25px", xl: "5px" }}
                                    minW={{ base: "85px", xl: "140px" }}
                                    height={{ base: "40px", xl: "50px" }}
                                    margin={{ base: "5px 0 5px", xl: "5px" }}
                                    display={{ xl: "block" }}
                                    textTransform="uppercase"
                                >
                                    Contact US
                                </Button>
                            </GridItem>
                            <GridItem backgroundColor={{base:bgGray, xl:bgColor1}} display="flex" height="210px" gridColumn={{base:"auto", xl:"1 / -1"}} 
                                justifyContent={{base:"center", xl:"space-between"}} alignItems="center" 
                                flexDirection={{base:"column", xl:"row"}} padding={{base:"15px", xl:"0 30px"}} 
                                gap="20px" w='100%'>
                                <Box padding={{base:"0", xl:"30px"}} style={{ backgroundColor: bgGray }}  >
                                    <MdEmail size={32} />
                                </Box>
                                <Box textAlign="center">
                                    <Text fontWeight="bold">Email us at</Text>
                                    <Text fontWeight="bold" as="span" style={{ color: secondaryText, whiteSpace: "nowrap" }}>marketing.inr@royaldeltin.com</Text>
                                </Box>
                                <Button bg={{ base: greenBtn, xl: greenBtn }} _hover={{ bg: { base: greenBtn, xl: greenBtn } }}
                                    color={{ base: whiteText, xl: whiteText }}
                                    fontSize={{ base: ".9rem", xl: "16px" }}
                                    borderRadius={{ base: "25px", xl: "5px" }}
                                    minW={{ base: "85px", xl: "140px" }}
                                    height={{ base: "40px", xl: "50px" }}
                                    margin={{ base: "5px 0 5px", xl: "5px" }}
                                    display={{ xl: "block" }}
                                    textTransform="uppercase"
                                >
                                    Contact US
                                </Button>
                            </GridItem>
                        </Grid>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default ContactUs;
