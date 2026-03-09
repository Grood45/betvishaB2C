

import React from "react";

import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import {
    Button,
    Progress,
    Text,
    Box,
    Flex,
    Image,
    Heading,
    Icon,
    useToast,
} from "@chakra-ui/react";
import { IoWalletOutline } from "react-icons/io5";
import { CiBank } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { IoDocumentsOutline } from "react-icons/io5";
import { FaRegEnvelope } from "react-icons/fa";
import { CiWallet } from "react-icons/ci";
import { LiaCrownSolid } from "react-icons/lia";
import { FaHandsHoldingCircle } from "react-icons/fa6";
import { PiSpinnerBallFill } from "react-icons/pi";
import { FaUsers } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa6";
import { IoIosLogOut } from "react-icons/io";
import { MdLock } from "react-icons/md";
import { PiSpinnerBall } from "react-icons/pi";
import { FiLink } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { sendPostRequest } from "../api/api";

import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
// import {
//     WhatsappShareButton,
//   } from 'react-custom-share';

import Bronze from '../assets/images/vip/Bronze.png';
import { logout } from "../redux/auth-redux/actions";
import ProfileModal from "../modal/ProfileModal";
import ChangePasswordModal from "../modal/ChangePasswordModal"
import BankModal from "../modal/BankModal";
import WalletModal from "../modal/WalletModal";
import RecordsModal from "../modal/RecordsModal"
import BetRecordsModal from "../modal/BetRecordsModal"
const InfoMobileHeader = () => {
    const {
        bgColor1,
        bgGray,
        progressBar,
        secondaryText,
        blackBtn,
        bgYellow,
        PrimaryText,
    } = useSelector((state) => state.theme);
    const TabsStyle = {
        width: 'auto',
        borderRadius: '10px',
    }

    const datas = useSelector((state) => state?.auth?.user);
    const userData = datas?.user
    const singleUserDetails = useSelector((state) => state?.auth);

    const { t, i18n } = useTranslation();
    const isActive = (path) => {
        return location.pathname === path;
    };
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const toast = useToast()
    const tabs = [
        // { to: "/Profile", icon: <CgProfile size={28} />, text: "Profile" ,modal:<ProfileModal/>},
        // { to: "/ChangePassword", icon: <MdLock size={28} />, text: "Change.",modal:<ChangePasswordModal/> },
        // { to: "/Bank", icon: <CiBank fontSize="28px" />, text: "Bank" ,modal:<ProfileModal/>},
        // { to: "/Wallet", icon: <CiWallet fontSize="28px" />, text: "Wallet",modal:<ProfileModal/> },
        // { to: "/Records", icon: <IoDocumentsOutline fontSize="28px" />, text: "Records",modal:<ProfileModal/> },
        // { to: "/Inbox", icon: <FaRegEnvelope fontSize="28px" />, text: "Inbox",modal:<ProfileModal/> },
        { to: "/Favorite", icon: <FaRegHeart fontSize="28px" />, text: "Favorite", modal: <ProfileModal /> },
        // { to: "/Logout", icon: <IoIosLogOut fontSize="28px" />, text: "Logout" },
    ];

    const onLogout = async () => {
        try {
            if (userData?.user_id) {
                await sendPostRequest(`${import.meta.env.VITE_API_URL}/api/user/user-logout`, {
                    user_id: userData.user_id
                });
            }
        } catch (error) {
            console.error(error);
        }
        dispatch(logout());
        toast({
            title: 'Logout Succesfully !',
            status: "error",
            duration: 2000,
            isClosable: true,
            position: "top",
        });
        navigate('/');
    };

    const copyToClipboard = (text) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                // setCopiedItem(text);
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


    const handleShareClick = () => {
        const referralCode = singleUserDetails?.singleUserData?.referral_code;
        const shareUrl = `https://royaldeltin.com?refer_code=${referralCode}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareUrl)}`;

        window.open(whatsappUrl, "_blank");
    };

    return (
        <Box style={{ backgroundColor: bgColor1 }} pr={{ base: "10px" }} className="infoPayment_sideBar" display={{ base: "block", xl: "none" }}>
            <Box>
                <Flex flexDirection="column">
                    <Box>
                        <Box style={{ textAlign: 'left' }} maxW="100%" width={{ base: "100%", xl: "280px" }} >
                            <Box bg={{ base: bgGray, xl: bgGray }} padding="15px" borderRadius="5px">
                                <Flex align="center" gap="10px">
                                    <CgProfile size={28} />
                                    <Box ml={2}>
                                        <Text lineHeight="21px">Hello,</Text>
                                        <Text lineHeight="21px">{userData?.username}</Text>
                                    </Box>
                                </Flex>
                            </Box>
                            <div className="infoTabs grid grid-cols-4 gap-2 mt-3" >
                                <ProfileModal />
                                <ChangePasswordModal />
                                <BankModal />
                                <WalletModal />
                                <RecordsModal />
                                <BetRecordsModal />
                                {tabs.map((tab, index) => (
                                    <Button onClick={() => navigate(tab.to)} key={index} gap="15px" height="auto" fontSize="14px" minW={{ base: "100%", xl: "100%" }} bg="transparent" _hover={{ bg: 'transparent', }} justifyContent="center">
                                        <Link className={`${isActive(tab.to) ? 'active-menu' : ''}`}
                                            style={{ display: "flex", gap: "15px", backgroundColor: bgGray }}
                                        >
                                            {tab.icon}
                                            <Text>{t(tab.text)}</Text>
                                        </Link>
                                    </Button>
                                ))}
                                <Button onClick={onLogout} gap="15px" height="auto" fontSize="14px" minW={{ base: "100%", xl: "100%" }} bg="transparent" _hover={{ bg: 'transparent', }} justifyContent="center">
                                    <p to={"/"} className={`flex items-center flex-col`}
                                        style={{ backgroundColor: bgGray }}
                                    >
                                        <IoIosLogOut fontSize="28px" />
                                        <Text>{t(`Logout`)}</Text>
                                    </p>
                                </Button>
                            </div>
                            <Flex gap="10px" flexDirection={{ base: "column" }} bg={{ base: bgColor1, xl: bgGray }} style={{ textAlign: 'left' }} my={4}>

                                <div className="flex gap-1 ">
                                    <div className="w-[5px] h-[20px] rounded-sm bg-yellow-400"></div>

                                    <Heading as="h6">{t(`My Rewards`)}</Heading>

                                </div>
                                <Box style={{ backgroundColor: bgGray }} padding="15px">
                                    <Box display='flex' gap="15px" bg="transparent" _hover={{ bg: 'transparent', }} justifyContent="flex-start" marginBottom="20px">
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
                                                    <span >{t(`Bet Amount`)}:</span>
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
                            {/* <Box className="spinwin-wrapper" borderRadius="5px" style={{ backgroundColor: bgGray }} padding="15px" mb="15px">
                                <Flex className="item-left" align="center" justifyContent="space-between">
                                    <Flex alignItems="center" gap="10px">
                                        <PiSpinnerBall mr="2" size={28} />
                                        <Box className="content flex flex-col">
                                            <Text as="span" className="content-label" fontWeight="bold">
                                                Spin & Win
                                            </Text>
                                            <Text as="span" className="ticket" fontWeight="semibold">
                                                0
                                            </Text>
                                        </Box>
                                    </Flex>
                                    <Button
                                        className="spin-button"
                                        type="button"
                                        disabled
                                        colorScheme="blue"
                                        bg={{ base: blackBtn }} _hover={{ bg: { base: blackBtn } }}
                                        fontSize={{ base: ".9rem", xl: "16px" }}
                                        borderRadius={{ base: "25px", xl: "5px" }}
                                        minW={{ base: "110px" }}
                                    >
                                        Spin
                                    </Button>
                                </Flex>

                            </Box>
                            <Box className="spinwin-wrapper" borderRadius="5px" style={{ backgroundColor: bgGray }} padding="15px" mb="15px">
                                <Flex className="item-left" align="center" justifyContent="space-between">
                                    <Flex alignItems="center" gap="10px">
                                        <FaHandsHoldingCircle fontSize="28px" />
                                        <Box className="content flex flex-col">
                                            <Text as="span" className="content-label" fontWeight="bold">
                                                Reward Point
                                            </Text>
                                            <Text as="span" className="ticket" fontWeight="semibold">
                                                0
                                            </Text>
                                        </Box>
                                    </Flex>
                                    <Button
                                        className="spin-button"
                                        type="button"
                                        colorScheme="blue"
                                        bg={{ base: blackBtn }} _hover={{ bg: { base: blackBtn } }}
                                        fontSize={{ base: ".9rem", xl: "16px" }}
                                        borderRadius={{ base: "25px", xl: "5px" }}
                                        minW={{ base: "110px" }}
                                    >
                                        Redeem
                                    </Button>
                                </Flex>

                            </Box> */}
                            <Box className="spinwin-wrapper" borderRadius="5px" mb="15px">
                                <div className="flex gap-1 ">
                                    <div className="w-[5px] h-[20px] rounded-sm bg-yellow-400"></div>

                                    <Heading as="h6">{t(`Referral`)}</Heading>




                                </div>
                                <Flex className="item-left" align="center" borderRadius="5px" padding="25px" justifyContent="space-between" style={{ backgroundColor: bgGray }}>
                                    <Flex alignItems="center" gap="10px">
                                        <FiLink fontSize="24px" />
                                        <Box className="content flex flex-col">
                                            <Text as="span" className="content-label" fontWeight="bold">
                                                https://royaldeltin.in?refer_code={singleUserDetails?.singleUserData?.referral_code}
                                            </Text>
                                        </Box>
                                    </Flex>
                                </Flex>
                                <Flex gap="10px" mt="10px">

                                    <Button
                                        className="spin-button"
                                        type="button"
                                        color={{ PrimaryText }}
                                        bg={{ base: bgYellow }} _hover={{ bg: { base: bgYellow } }}
                                        fontSize={{ base: ".9rem", xl: "16px" }}
                                        borderRadius={{ base: "25px", xl: "5px" }}
                                        w={{ base: "100%" }}


                                        onClick={() =>
                                            copyToClipboard(`https://royaldeltin.com?refer_code=${singleUserDetails?.singleUserData?.referral_code}`)}

                                    >
                                        {t(`Copy`)}
                                    </Button>
                                    <Button
                                        className="spin-button"
                                        type="button"
                                        colorScheme="blue"
                                        bg={{ base: blackBtn }}
                                        _hover={{ bg: { base: blackBtn } }}
                                        fontSize={{ base: ".9rem", xl: "16px" }}
                                        borderRadius={{ base: "25px", xl: "5px" }}
                                        w={{ base: "100%" }}
                                        onClick={handleShareClick}
                                    >
                                        {t("Share")}
                                    </Button>
                                </Flex>
                            </Box>
                            {/* <Flex gap="10px" flexDirection={{base:"row", xl:"column"}} bg={{base:bgColor1, xl:bgGray}} style={{ textAlign: 'left' }} mt={4}>
                                <Button gap="15px" bg="transparent" _hover={{ bg: 'transparent', }} justifyContent="flex-start">
                                <Link to="/Reward-Point" className={`${isActive('/Reward-Point') ? 'active-menu' : ''}`}
                                    style={{display:"flex", gap:"15px", backgroundColor: bgGray}}
                                    >
                                   <FaHandsHoldingCircle fontSize="28px" />
                                    <Text>Reward Point</Text>
                                    </Link>
                                </Button>
                                <Button gap="15px" bg="transparent" _hover={{ bg: 'transparent', }} justifyContent="flex-start">
                                <Link to="/VIP" className={`${isActive('/VIP') ? 'active-menu' : ''}`}
                                    style={{display:"flex", gap:"15px", backgroundColor: bgGray}}
                                    >
                                   <LiaCrownSolid fontSize="28px" />
                                    <Text>VIP</Text>
                                    </Link>
                                </Button>
                                <Button gap="15px" bg="transparent" _hover={{ bg: 'transparent', }} justifyContent="flex-start">
                                <Link to="/spin-win" className={`${isActive('/spin-win') ? 'active-menu' : ''}`}
                                    style={{display:"flex", gap:"15px", backgroundColor: bgGray}}
                                    >
                                  <PiSpinnerBallFill fontSize="28px" />
                                    <Text>Spin & Win</Text>
                                    </Link>
                                </Button>
                                <Button gap="15px" bg="transparent" _hover={{ bg: 'transparent', }} justifyContent="flex-start">
                                <Link to="/Referral" className={`${isActive('/Referral') ? 'active-menu' : ''}`}
                                    style={{display:"flex", gap:"15px", backgroundColor: bgGray}}
                                    >
                                  <FaUsers fontSize="28px" />
                                    <Text>Referral</Text>
                                    </Link>
                                </Button>
                            </Flex>

                            <Flex gap="10px" flexDirection={{base:"row", xl:"column"}} bg={{base:bgColor1, xl:bgGray}} style={{ textAlign: 'left' }} mt={4}>
                                <Button gap="15px" bg="transparent" _hover={{ bg: 'transparent', }} justifyContent="flex-start">
                                <Link to="/Terms-Conditions" className={`${isActive('/Terms-Conditions') ? 'active-menu' : ''}`}
                                    style={{display:"flex", gap:"15px", backgroundColor: bgGray}}
                                    >
                                   <FaHandsHoldingCircle fontSize="28px" />
                                    <Text>Terms & Conditions</Text>
                                    </Link>
                                </Button>
                                <Button gap="15px" bg="transparent" _hover={{ bg: 'transparent', }} justifyContent="flex-start">
                                <Link to="/faq" className={`${isActive('/faq') ? 'active-menu' : ''}`}
                                    style={{display:"flex", gap:"15px", backgroundColor: bgGray}}
                                    >
                                   <LiaCrownSolid fontSize="28px" />
                                    <Text>FAQ</Text>
                                    </Link>
                                </Button>
                                <Button gap="15px" bg="transparent" _hover={{ bg: 'transparent', }} justifyContent="flex-start">
                                <Link to="/Privacy-Policy" className={`${isActive('/Privacy-Policy') ? 'active-menu' : ''}`}
                                    style={{display:"flex", gap:"15px", backgroundColor: bgGray}}
                                    >
                                   <PiSpinnerBallFill fontSize="28px" />
                                    <Text>Privacy Policy</Text>
                                    </Link>
                                </Button>
                                <Button gap="15px" bg="transparent" _hover={{ bg: 'transparent', }} justifyContent="flex-start">
                                <Link to="/DisconnectionPolicy" className={`${isActive('/DisconnectionPolicy') ? 'active-menu' : ''}`}
                                    style={{display:"flex", gap:"15px", backgroundColor: bgGray}}
                                    >
                                   <FaUsers fontSize="28px" />
                                    <Text>Disconnection Policy</Text>
                                    </Link>
                                </Button>
                                <Button gap="15px" bg="transparent" _hover={{ bg: 'transparent', }} justifyContent="flex-start">
                                <Link to="/Responsible" className={`${isActive('/Responsible') ? 'active-menu' : ''}`}
                                    style={{display:"flex", gap:"15px", backgroundColor: bgGray}}
                                    >
                                   <FaUsers fontSize="28px" />
                                    <Text>Responsible Gambling</Text>
                                    </Link>
                                </Button>
                                <Button gap="15px" bg="transparent" _hover={{ bg: 'transparent', }} justifyContent="flex-start">
                                <Link to="/Contact-US" className={`${isActive('/Contact-US') ? 'active-menu' : ''}`}
                                    style={{display:"flex", gap:"15px", backgroundColor: bgGray}}
                                    >
                                   <FaUsers fontSize="28px" />
                                    <Text>Contact US</Text>
                                    </Link>
                                </Button>
                            </Flex> */}
                        </Box>

                    </Box>

                </Flex>
            </Box>
        </Box>
    );
};

export default InfoMobileHeader;
