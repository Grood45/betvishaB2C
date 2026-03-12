import {
  Box,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
  Link,
  Flex,
  Divider,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  MenuButton,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { IoMenu, IoSearch } from 'react-icons/io5'
import {
  IoHome,
  IoGiftOutline,
  IoStar,
  IoCash,
  IoRefreshCircle,
  IoHelpCircle,
  IoBasketball,
  IoCard,
  IoAlertCircle,
  IoHammer,
  IoChatbubbleEllipses,
  IoListCircle,
  IoGlobeOutline,
  IoCall,
  IoChatboxEllipses,
  IoLogoTwitter,
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoWhatsapp,
  IoMail,
} from 'react-icons/io5';
import { FaSnapchat } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa6";

import { CiSearch } from "react-icons/ci";
import { GoHome } from "react-icons/go";
import { LiaCrownSolid } from "react-icons/lia";
import { CiMenuBurger } from "react-icons/ci";
import { PiSpinnerBallBold } from "react-icons/pi";
import { RiUserSharedLine } from "react-icons/ri";
import { MdSportsSoccer } from "react-icons/md";
import { MdOutlineCasino } from "react-icons/md";
import { IoRocketOutline } from "react-icons/io5";
import { AiOutlineAim } from "react-icons/ai";
import { CgGames } from "react-icons/cg";
import { TbBrandAppleArcade } from "react-icons/tb";
import Reward from "../assets/images/home-images/reward.png";
import { CiGlobe } from "react-icons/ci";
import { FiPhoneCall } from "react-icons/fi";
import { PiHandshakeThin } from "react-icons/pi";
import { MdOutlineDownloadForOffline } from "react-icons/md";
import { PiNote } from "react-icons/pi";
import { GoShieldSlash } from "react-icons/go";
import { RiTelegramLine } from "react-icons/ri";
import { FaWhatsapp } from "react-icons/fa";
import img1 from "../assets/logo.svg";
import { getProviderGroupName, setSideBarOption } from "../redux/switch-web/action";

import football from '../assets/football.png'

import { useDispatch, useSelector } from "react-redux";
import ChangeLanguageMobile from './ChangeLanguageMobile';
import { RxCross1, RxCross2 } from 'react-icons/rx';
import SearchModal from './SearchModal';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
function RightSidebar() {
  const { borderLang, bgGray, PrimaryText, whatsappiconBg, fbiconBg, SnapiconBg, bgColor1, telegramiconBg, instaiconBg, twittericonbg } = useSelector((state) => state.theme);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const settings = useSelector((state) => state?.auth?.settings);
  const [gameCategory, setGameCategory] = useState([]);
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const btnRef = React.useRef();
  const { t } = useTranslation()
  const navigate = useNavigate()
  const Style = {
    common: {
      borderRadius: '100%',
      color: "#fff",
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
    },
    fb: {
      backgroundColor: fbiconBg,
    },
    insta: {
      background: instaiconBg,
      backgroundImage: 'radial-gradient(circle farthest-corner at 32% 106%, #ffe17d 0, #ffcd69 10%, #fa9137 28%, #eb4141 42%, transparent 82%), linear-gradient(135deg, #234bd7 12%, #c33cbe 58%)',
    },
    whatsapp: {
      backgroundColor: whatsappiconBg,
    },
    telegram: {
      backgroundColor: telegramiconBg,
    },
    snap: {
      backgroundColor: SnapiconBg,
    },
    twitter: {
      backgroundColor: twittericonbg,
    },
  }

  const [isOpenSecond, setIsOpenSecond] = useState(false);
  const dispatch = useDispatch()


  const getCategoryList = async () => {
    setLoading(true);
    try {
      let response = await axios.get(`${import.meta.env.VITE_API_URL}/api/game-navigation/get-all-game-navigation?site_auth_key=${import.meta.env.VITE_API_SITE_AUTH_KEY}`);

      setGameCategory(response?.data?.data?.reverse())
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
    getCategoryList();
  }, []);


  const openModal = () => {
    onClose();
    setIsOpenSecond(true);
  };

  const closeModal = () => {
    setIsOpenSecond(false);
  };

  const getFetchGameByProvider = (item) => {
    dispatch(getProviderGroupName(item?.name))
    dispatch(setSideBarOption(item?._id))


  }

  const handleSport = () => {
    // setActive("1")
    dispatch(setSideBarOption("1"))
  }

  return (
    <>
      <Box style={{ backgroundColor: bgGray, }} borderRadius="50%"
        width="40px" height="40px" padding="3px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        marginLeft="10px"
      >
        <CiMenuBurger ref={btnRef} onClick={onOpen} size={22}
          color="black"
        />
      </Box>

      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <div className='flex justify-between px-4 pt-3  py-1 sticky top-0 z-20 bg-white  w-[100%] items-center'>
            <img onClick={() => navigate("/")} style={{ width: '110px' }} src={settings?.site_logo_mobile} alt="Logo" />
            <RxCross2 onClick={onClose} fontSize={"20px"} />
          </div>
          <Divider color={{ borderLang }} opacity={1} />

          <DrawerBody style={{ width: '100%', padding: '10px' }}  >

            <VStack align="start" width={'100%'}>

              <Flex onClick={() => openModal()} width="100%">
                <InputGroup borderRadius="25px" width={'100%'} backgroundColor={bgGray} height="40px">
                  <Input focusBorderColor="yellow.400" outline="none" placeholder="Search Games" width={'100%'} borderRadius="25px" />
                  <InputRightElement pointerEvents="none">
                    <CiSearch fontSize="24px" color="#0000008a" />
                  </InputRightElement>
                </InputGroup>
              </Flex>
              <Box style={{ marginLeft: "10px", marginTop: '10px' }}>
                <ChangeLanguageMobile />

              </Box>

              <Divider color={{ borderLang }} opacity={1} />
              {links.slice(0, 4).map((link, index) => (
                <React.Fragment key={index}>
                  <Flex align="center" style={{ marginLeft: "10px" }} marginY="2" borderRadius="md" _hover={{ bg: "gray.100" }}>
                    {getIcon(link.label)}
                    <Link as={RouterLink} to={link.to} fontSize="14px" ml={4} fontWeight="bold">{t(link.label)}</Link>
                  </Flex>

                </React.Fragment>
              ))}


              <Divider color={{ borderLang }} opacity={1} />
              <React.Fragment >
                <Flex onClick={handleSport} align="center" style={{ marginLeft: "10px" }} marginY="2" borderRadius="md" _hover={{ bg: "gray.100" }}>
                  <div className={`flex `}>
                    <img src={football} alt="" className="h-[25px] w-[25px]  " />
                  </div>

                  <Link as={RouterLink} to='' fontSize="14px" ml={4} fontWeight="bold">{t(`sports`)}</Link>
                </Flex>

              </React.Fragment>

              <React.Fragment >
                <Flex onClick={onClose} align="center" style={{ marginLeft: "10px" }} marginY="2" borderRadius="md" _hover={{ bg: "gray.100" }}>
                  <div className={`flex `}>
                    <img src={football} alt="" className="h-[25px] w-[25px]  " />
                  </div>

                  <Link as={RouterLink} to='/lucky-sport' fontSize="14px" ml={4} fontWeight="bold">LuckySport</Link>
                </Flex>

              </React.Fragment>
              {gameCategory?.map((item, index) => (
                <React.Fragment key={item?._id}>
                  <Flex
                    onClick={() =>
                      getFetchGameByProvider(item)

                    }
                    align="center" style={{ marginLeft: "10px" }} marginY="2" borderRadius="md" _hover={{ bg: "gray.100" }}>
                    <div className={`flex   rounded-[8px]  `}>
                      <img src={item?.icon} alt="" className="h-[25px] w-[25px]  " />
                    </div>

                    <Link as={RouterLink} to='' fontSize="14px" ml={4} fontWeight="bold">{t(item?.name)}</Link>
                  </Flex>

                </React.Fragment>

              ))}

              <Divider color={{ borderLang }} opacity={1} />


              {links.slice(17, 40).map((link, index) => (
                <React.Fragment key={index}>
                  <Flex align="center" style={{ marginLeft: "10px" }} marginY="2" borderRadius="md" _hover={{ bg: "gray.100" }}>
                    {getIcon(link.label)}
                    <Link as={RouterLink} to={link.to} fontSize="14px" ml={4} fontWeight="bold">{t(link.label)}</Link>
                  </Flex>

                </React.Fragment>
              ))}
              <Divider color={{ borderLang }} opacity={1} />

              <Flex justify="center" align="center" marginY="2" gap={3}>
                <Box display="flex" flexDirection="row" gap='2' flexWrap='wrap'>
                  <Link href={settings?.facebook} target="_blank" style={{ ...Style.fb, ...Style.common }}
                    width={{ base: '36px' }}
                    height={{ base: '36px' }}>
                    <FaFacebook size={22} />
                  </Link>
                  <Link href={settings?.twitter} target="_blank" style={{ ...Style.twitter, ...Style.common }}
                    width={{ base: '36px' }}
                    height={{ base: '36px' }}>
                    <FaTwitter size={22} />
                  </Link>
                  <Link href={settings?.instagram} target="_blank" style={{ ...Style.insta, ...Style.common }}
                    width={{ base: '36px' }}
                    height={{ base: '36px' }}>
                    <FaInstagram size={22} />
                  </Link>
                  <Link href={settings?.whatsapp} target="_blank" style={{ ...Style.whatsapp, ...Style.common, color: PrimaryText }}
                    width={{ base: '36px' }}
                    height={{ base: '36px' }}>
                    <FaWhatsapp size={22} />
                  </Link>
                  <Link href={settings?.teligram} target="_blank" style={{ ...Style.telegram, ...Style.common, color: PrimaryText }}
                    width={{ base: '36px' }}
                    height={{ base: '36px' }}>
                    <RiTelegramLine size={22} />
                  </Link>
                  {/* <Link href={settings?.twitter} target="_blank" style={{ ...Style.snap, ...Style.common, color: PrimaryText }}
                          width={{ base: '36px'}}
                          height={{ base: '36px'}}>
                          <FaSnapchat size={22} />
                        </Link> */}

                </Box>
              </Flex>

            </VStack>

          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <SearchModal
        isOpen={isOpenSecond}
        onClose={closeModal}
        providerData={"20"}
        size="full"

      />
    </>
  );
}

function getIcon(label) {
  switch (label) {
    case 'Home':
      return <GoHome fontSize="sm" color="black" marginRight="4" size={28} />;
    case 'Promotions':
      return <IoGiftOutline fontSize="lg" color="black" marginRight="4" size={28} />;
    case 'VIP':
      return <LiaCrownSolid fontSize="lg" color="black" marginRight="4" size={28} />;
    case 'Reward Point':
      return <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="28" height="28" x="0" y="0" viewBox="0 0 50 50" style={{ enableBackground: "new 0 0 512 512" }} xml:space="preserve" class=""><g><g fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"><path d="M38.2 8.2c0 11.2-12.7 16-12.7 16s-12.7-4.9-12.7-16c0-3.7 3-6.7 6.6-6.7 2.8 0 5.1 1.7 6.1 4.1 1-2.4 3.3-4.1 6.1-4.1 3.6 0 6.6 3 6.6 6.7z" fill="" opacity="1"></path><path d="M14.9 8.2c0-2.5 2-4.5 4.4-4.5M36 8.2c0 5-3 8.5-6 10.8M35.8 35.8c.3-1.1.6-2 1-2.5 1.2-1.7 5.3-3.6 6.2-5.5 1.8-3.8 3.4-16.2.7-16.7-1.9-.3-3.1 9.6-3.1 9.6" fill="" opacity="1"></path><path d="M37.4 28.5s5.6-5.6 4.2-7.2c-2.3-2.5-9.3 4.5-11.1 7.4-.8 1.3-1.3 4.7-1.6 7.2M27.1 36.1h10.3v12.4H27.1zM14.2 35.8c-.3-1.1-.6-2-1-2.5-1.2-1.7-5.3-3.6-6.2-5.5-1.8-3.8-3.4-16.2-.7-16.7 1.9-.3 3.1 9.6 3.1 9.6" fill="" opacity="1"></path><path d="M12.6 28.5S7 22.9 8.4 21.3c2.3-2.5 9.3 4.5 11.1 7.4.8 1.3 1.3 4.7 1.6 7.2M12.6 36.1h10.3v12.4H12.6zM27.1 36.1h10.3v5.3H27.1z" fill="" opacity="1"></path><path d="M12.6 36.1h10.3v5.3H12.6z" fill="" opacity="1"></path><circle cx="30.2" cy="38.8" r="1" fill="" opacity="1"></circle><circle cx="19.8" cy="38.8" r="1" fill="" opacity="1"></circle></g></g></svg>;
    // case 'Spin & Win':
    //   return <PiSpinnerBallBold fontSize="lg" color="black" marginRight="4" size={28} />;
    case 'Referral':
      return <RiUserSharedLine fontSize="lg" color="black" marginRight="4" size={28} />;
    case 'Sports':
      return <MdSportsSoccer fontSize="lg" color="black" marginRight="4" size={28} />;
    case 'Casino':
      return <MdOutlineCasino fontSize="lg" color="black" marginRight="4" size={28} />;
    case 'Crash':
      return <IoRocketOutline fontSize="lg" color="black" marginRight="4" size={28} />;
    case 'Bingo':
      return <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width="28" height="28" x="0" y="0" viewBox="0 0 64 64" style={{ enableBackground: "new 0 0 512 512" }} xmlSpace="preserve" class=""><g><path fill="#000000" d="m30.606 63.057-5.121-6.752-7.81 3.29a1.75 1.75 0 0 1-2.416-1.4L14.21 49.79 5.8 48.741a1.749 1.749 0 0 1-1.52-1.953 1.75 1.75 0 0 1 1.953-1.52L16 46.485a1.75 1.75 0 0 1 1.52 1.52l.93 7.468 6.934-2.921a1.751 1.751 0 0 1 2.074.556L32 59.1l4.547-6a1.751 1.751 0 0 1 2.074-.556l6.934 2.921.93-7.467a1.749 1.749 0 0 1 1.52-1.52l9.762-1.218a1.751 1.751 0 0 1 1.953 1.52 1.75 1.75 0 0 1-1.52 1.953l-8.41 1.057-1.049 8.41a1.75 1.75 0 0 1-2.416 1.4l-7.81-3.29-5.121 6.752a1.749 1.749 0 0 1-2.788-.005zM4.28 17.212a1.75 1.75 0 0 1 1.52-1.953l8.41-1.049 1.049-8.41a1.75 1.75 0 0 1 2.416-1.4l7.81 3.29L30.606.943a1.749 1.749 0 0 1 2.788 0L38.515 7.7l7.81-3.29a1.75 1.75 0 0 1 2.416 1.4l1.049 8.4 8.41 1.049a1.749 1.749 0 0 1 1.52 1.953 1.75 1.75 0 0 1-1.953 1.52l-9.762-1.217A1.75 1.75 0 0 1 46.485 16l-.93-7.468-6.934 2.921a1.751 1.751 0 0 1-2.074-.556L32 4.9l-4.547 6a1.751 1.751 0 0 1-2.074.556l-6.934-2.929-.93 7.467A1.749 1.749 0 0 1 16 17.514l-9.767 1.218a1.751 1.751 0 0 1-1.953-1.52z" opacity="1" data-original="#fa6e96" class=""></path><path fill="#000000" d="M9.558 31.492A5.74 5.74 0 0 0 5 22.25H2A1.75 1.75 0 0 0 .25 24v16A1.75 1.75 0 0 0 2 41.75h4a5.744 5.744 0 0 0 3.558-10.258zM3.75 25.75H5a2.25 2.25 0 0 1 0 4.5H3.75zM6 38.25H3.75v-4.5H6a2.25 2.25 0 0 1 0 4.5zM17 22.25A1.75 1.75 0 0 0 15.25 24v16a1.75 1.75 0 0 0 3.5 0V24A1.75 1.75 0 0 0 17 22.25zM32 22.25A1.751 1.751 0 0 0 30.25 24v8.587l-4.685-9.37A1.75 1.75 0 0 0 22.25 24v16a1.75 1.75 0 0 0 3.5 0v-8.587l4.685 9.37A1.75 1.75 0 0 0 33.75 40V24A1.751 1.751 0 0 0 32 22.25zM58 22.25A5.757 5.757 0 0 0 52.25 28v8a5.75 5.75 0 0 0 11.5 0v-8A5.757 5.757 0 0 0 58 22.25zM60.25 36a2.25 2.25 0 0 1-4.5 0v-8a2.25 2.25 0 0 1 4.5 0zM47 30.25h-2a1.75 1.75 0 0 0 0 3.5h.25V36a2.25 2.25 0 0 1-4.5 0v-8a2.25 2.25 0 0 1 3.841-1.591 1.75 1.75 0 1 0 2.474-2.475A5.749 5.749 0 0 0 37.25 28v8a5.75 5.75 0 0 0 11.5 0v-4A1.75 1.75 0 0 0 47 30.25z" opacity="1" data-original="#646487" class=""></path><g fill="#fff06e"><circle cx="32" cy="47" r="1.75" fill="#fff06e" opacity="0" data-original="#fff06e" class=""></circle><circle cx="25" cy="47" r="1.75" fill="#fff06e" opacity="0" data-original="#fff06e" class=""></circle><circle cx="39" cy="47" r="1.75" fill="#fff06e" opacity="0" data-original="#fff06e" class=""></circle><circle cx="32" cy="17" r="1.75" fill="#fff06e" opacity="0" data-original="#fff06e" class=""></circle><circle cx="25" cy="17" r="1.75" fill="#fff06e" opacity="0" data-original="#fff06e" class=""></circle><circle cx="39" cy="17" r="1.75" fill="#fff06e" opacity="0" data-original="#fff06e" class=""></circle></g></g></svg>;
    case 'Slots':
      return <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width="28" height="28" x="0" y="0" viewBox="0 0 480 480" style={{ enableBackground: "new 0 0 512 512" }} xmlSpace="preserve" class=""><g><path d="M456.097 222.76V119.418c13.714-3.558 23.871-16.042 23.871-30.854 0-17.574-14.297-31.871-31.871-31.871s-31.871 14.297-31.871 31.871c0 14.812 10.157 27.295 23.871 30.854v103.34h-14.29v-56.807c0-13.233-10.767-24-24-24H24c-13.233 0-24 10.767-24 24v233.355c0 13.233 10.767 24 24 24h377.807c13.233 0 24-10.767 24-24V238.758H456c4.411 0 8 3.589 8 8V318.5c0 4.411-3.589 8-8 8a8 8 0 0 0 0 16c13.233 0 24-10.767 24-24v-71.742c0-13.201-10.714-23.945-23.903-23.998zM24 157.951h377.807c4.411 0 8 3.589 8 8v17.388H49.774a8 8 0 0 0 0 16H276v166.58H149.807V228.178a8 8 0 0 0-16 0v137.741H16V165.951c0-4.411 3.589-8 8-8zm385.807 241.356c0 4.411-3.589 8-8 8H24c-4.411 0-8-3.589-8-8v-17.388h361.258a8 8 0 0 0 0-16H292v-166.58h117.807zm22.419-310.743c0-8.751 7.12-15.871 15.871-15.871s15.871 7.12 15.871 15.871-7.12 15.871-15.871 15.871z" fill="#000000" opacity="1" data-original="#000000" class=""></path><path d="M183.743 251.817c21.878-8.28 27.265 1.965 42.467 3.001-14.472 23.169-25.267 48.351-32.179 75.11-1.312 5.08 2.536 10.003 7.752 10.003a8.004 8.004 0 0 0 7.74-6.001c8.222-31.835 22.283-61.288 41.792-87.541 5.165-6.949-2.944-16.04-10.441-11.688-22.113 12.854-26.399-11.615-62.793 2.151a8 8 0 0 0 5.662 14.965zM377.374 234.701c-22.112 12.853-26.401-11.615-62.793 2.151a8 8 0 0 0 5.662 14.964c21.878-8.28 27.265 1.965 42.467 3.001-14.472 23.169-25.267 48.351-32.179 75.11-1.312 5.08 2.536 10.003 7.752 10.003a8.004 8.004 0 0 0 7.74-6.001c8.222-31.835 22.283-61.288 41.792-87.541 5.166-6.947-2.943-16.038-10.441-11.687zM45.243 251.817c21.953-8.309 27.157 1.958 42.467 3.001-14.472 23.169-25.267 48.351-32.179 75.11a8 8 0 0 0 15.492 4.002c8.222-31.835 22.283-61.288 41.792-87.541 5.165-6.949-2.944-16.04-10.441-11.688-22.113 12.854-26.399-11.615-62.793 2.151a7.999 7.999 0 0 0-4.651 10.313 8 8 0 0 0 10.313 4.652z" fill="#000000" opacity="1" data-original="#000000" class=""></path></g></svg>;
    case 'Fishing':
      return <AiOutlineAim fontSize="lg" color="black" marginRight="4" size={28} />;
    case 'Table':
      return <CgGames fontSize="lg" color="black" marginRight="4" size={28} />;
    case 'Arcade':
      return <TbBrandAppleArcade fontSize="lg" color="black" marginRight="4" size={28} />;
    case 'Lottery':
      return <img src={Reward} alt="Reward" size={40} style={{ width: "40px" }} />;
    case 'Cock Fight':
      return <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width="28" height="28" x="0" y="0" viewBox="0 0 47 60" style={{ enableBackground: "new 0 0 512 512" }} xmlSpace="preserve"><g><g fill="#000" fillRule="nonzero"><path d="M36.718 21.345a7.2 7.2 0 0 1-.528-.546 18.92 18.92 0 0 1 1.5-3.6c.972-1.925 1.891-3.744 1.3-5.517a3 3 0 0 0-1.826-2.052 3.384 3.384 0 0 0-2.286.108 10.366 10.366 0 0 0-3.129-6.446c-3.434-3.431-6.177-2.64-7.634-1.726A8.7 8.7 0 0 0 19.04 0a6.468 6.468 0 0 0-6.731 5.123 10.513 10.513 0 0 0-6.971 3.438 5.686 5.686 0 0 0-1.285 4.6 7.445 7.445 0 0 0 1.968 4.21 8.224 8.224 0 0 0-4.692 2.911 6.872 6.872 0 0 0-1.275 4.881.963.963 0 0 0 1.625.6.685.685 0 0 1 .071-.031A7.15 7.15 0 0 0 5.8 27.97c1.45.37 2.918.66 4.4.866a13.715 13.715 0 0 1-2.709 2.332C.462 35.85 0 40.114.973 42.984a8 8 0 0 0 .118 5.332A5.7 5.7 0 0 0 5.9 52.4c.33.043.66.065.993.064 1.375-.027 2.73-.33 3.986-.891a11.32 11.32 0 0 1-.485 4.218 1.5 1.5 0 0 0 1.914 1.841l4.01-1.337a3 3 0 0 1-.5 1.364 1.484 1.484 0 0 0-.013 1.569c.296.492.846.773 1.418.724a16.43 16.43 0 0 0 8.259-3.19c.02.6-.088 1.198-.316 1.753a1 1 0 0 0 1.236 1.412 16.431 16.431 0 0 0 7.083-4.484 13.947 13.947 0 0 1-.182 2.11c-.1.617.2 1.23.746 1.534a1.5 1.5 0 0 0 1.717-.163 17.938 17.938 0 0 0 5.734-9.279l.055.147c.224.62.832 1.017 1.49.974a1.5 1.5 0 0 0 1.373-1.143A45.425 45.425 0 0 0 46.04 39c0-7.525-5.07-13.755-9.322-17.655zM6.894 9.818a8.707 8.707 0 0 1 6.283-2.769 9.562 9.562 0 0 1 6.2 1.829 1 1 0 1 0 1.2-1.6 11.411 11.411 0 0 0-6.158-2.211A4.435 4.435 0 0 1 19.04 2a6.76 6.76 0 0 1 4.423 1.581 9.368 9.368 0 0 1 2.629 3.737 1.001 1.001 0 1 0 1.9-.634A11.432 11.432 0 0 0 25.73 2.99c1.368-.537 2.909.024 4.6 1.717a8.287 8.287 0 0 1 2.579 6.586 9.79 9.79 0 0 1-.19 1.433 1 1 0 0 0 .976 1.204 1 1 0 0 0 .978-.8 11.9 11.9 0 0 0 .177-1.177 2.372 2.372 0 0 1 1.65-.433c.241.084.439.352.588.8.328.982-.374 2.372-1.186 3.981-.395.782-.812 1.632-1.167 2.531l-.006-.008A21.436 21.436 0 0 0 29.64 13.2c-5.561-4.171-9.975-1.743-12.9-.136-.645.383-1.32.713-2.018.987a30.959 30.959 0 0 0-3.888 1.735c-.832.417-1.608.8-2.129.992-1.431-.545-2.338-1.863-2.682-3.943a3.687 3.687 0 0 1 .871-3.017zm11.4 17.564a12.252 12.252 0 0 0-6.394-8.061 5.09 5.09 0 0 0-1.145-1.261c.313-.152.637-.313.983-.486a30.439 30.439 0 0 1 3.537-1.593c6.479-.79 10.946.72 11.953 4.043.776 2.565-.819 5.675-3.631 7.081a21.888 21.888 0 0 0-4.774 2.949 18.851 18.851 0 0 0-.532-2.672zM8.083 19c.452.032 2.584.373 2.914 4a54.96 54.96 0 0 0-8.783.584.9.9 0 0 0-.154.018c.112-.77.411-1.5.872-2.126.989-1.323 2.722-2.156 5.151-2.476zm-3.747 6.3c1.835-.167 4.33-.27 6.7-.294v1.92a35.522 35.522 0 0 1-4.756-.895 8.012 8.012 0 0 1-1.944-.731zm1.828 25.118a3.7 3.7 0 0 1-3.175-2.733 5.962 5.962 0 0 1-.071-4.229 4.846 4.846 0 0 1 2.494-2.526 1 1 0 0 0-.744-1.858A6.554 6.554 0 0 0 2.6 40.45c.129-2.489 2.129-5.042 5.993-7.618a12.933 12.933 0 0 0 4.34-4.385c.047-.146.083-.295.107-.447v-4a12 12 0 0 0-.117-1.639 10.806 10.806 0 0 1 3.441 5.56c1.873 6.7-.678 15.8-3.156 19.524a8.4 8.4 0 0 1-7.044 2.972zM42.843 47.6l-.106-.26a1.5 1.5 0 0 0-2.866.325 16.37 16.37 0 0 1-4.431 8.846c.08-.867.054-1.74-.079-2.6a1.5 1.5 0 0 0-2.691-.617 13.227 13.227 0 0 1-5.2 4.073 5.45 5.45 0 0 0-.2-1.933 1.5 1.5 0 0 0-2.395-.73 14.69 14.69 0 0 1-6.91 3.156 4.012 4.012 0 0 0 .231-2.6 1.509 1.509 0 0 0-1.93-1.06l-3.714 1.238a11.6 11.6 0 0 0 .193-4.875 7.751 7.751 0 0 0 2.128-2.013c2.11-3.175 4.192-9.587 4.13-15.724.827-1.159 1.788-2.088 5.484-3.935 3.72-1.86 5.719-5.923 4.651-9.451-.415-1.369-2.255-5.254-9.495-5.631 2.446-1.132 5.241-1.681 8.8.987a19.467 19.467 0 0 1 4.64 5.146c.388.57.767 1.12 1.171 1.638l.014.016c.334.434.701.841 1.1 1.217C39.322 26.447 44.04 32.2 44.04 39a38.117 38.117 0 0 1-1.197 8.6z"></path><path d="M20.04 17a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"></path></g></g></svg>;
    case 'Racing':
      return <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width="28" height="28" x="0" y="0" viewBox="0 0 846.66 846.66" style={{ enableBackground: "new 0 0 512 512" }} xmlSpace="preserve" fillRule="evenodd" className=""><g transform="matrix(-1,0,0,1,846.656307220459,0)"><path fillRule="nonzero" d="M461.43 794.35c-50.82-115.8-52.26-134.44-48.6-279.82-39.12-9.8-76.83-40.65-91.91-71.64-11.65-23.92 24.69-41.6 36.33-17.69 31.56 64.83 133.17 68.68 185.77 35.99 6.49-4.03 14.38-3.94 20.6-.43 29.68 15.91 81.66 50.89 103.85 58.96 15.33 5.58 27.88 2.87 35.91-19.23 3.64-10.05 14.45-15.43 24.57-12.49 78.4 21.37 44.2-74.97 31.96-82.84-101.28-65.14-215.44-163.47-306.03-214.82-29.08-16.49 20.59-55.17-42.46-95.7-6.06 18.5-7.6 33.41-3.18 53.85 2.45 11.33-4.85 22.29-17.04 24.29-146.98 28.29-156.66 101.7-184.79 232.99-35.7 166.64 2.33 223.78-116.14 375.25zm267.5-377.24c22.25 14.56.13 48.37-22.12 33.81l-10.02-6.56c-22.26-14.57-.13-48.37 22.11-33.81zM548.59 306.24c15.95 21.13-16.29 45.45-32.23 24.32-14.53-19.28-35.94-19.92-50.95-1.48-16.69 20.51-47.96-4.94-31.28-25.44 31.7-38.95 84.4-37.29 114.46 2.6zm-62.91-161.1L617.41 16.62c15.07-14.68 40.74.89 32.7 22.14L582.68 233.8c69.64 58.01 125.16 89.86 199.03 137.4 47.65 30.65 61.54 174.34-47.4 159.11-39.93 76.77-122.42 2.67-179.89-28.79-46.79 27.89-56.9 22.66-101.41 18.11-3.57 143.88-1.1 154.31 57.75 286.76 7.22 15.02-4.16 29.91-18.62 29.39L48.67 819.87c-16.17-.6-25.58-19.9-14.85-32.94 141.05-171.22 92.8-201.47 133.1-389.53 30.36-141.7 48.54-225.95 198.8-260.47-2.06-25.98 5.24-55.53 17.21-80.27 4.97-9.94 17.06-13.97 27.01-9 50.42 25.21 74.92 54.5 75.74 97.48zm63.73 61.63 35.21-101.82-74.66 72.84c13.79 9.36 26.81 19.06 39.45 28.98z" fill="#000000" opacity="1" data-original="#000000"></path></g></svg>;

    case 'Contact Us':
      return <FiPhoneCall fontSize="lg" color="black" marginRight="4" size={28} />;
    case 'Blog':
      return <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width="28" height="28" x="0" y="0" viewBox="0 0 682.667 682.667" style={{ enableBackground: 'new 0 0 512 512' }} xmlSpace="preserve" className=""><g><defs><clipPath id="a" clipPathUnits="userSpaceOnUse"><path d="M0 512h512V0H0Z" fill="#000000" opacity="1" data-original="#000000"></path></clipPath></defs><path d="M0 0h286.723" style={{ strokeWidth: 15, strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: 10, strokeDasharray: 'none', strokeOpacity: 1 }} transform="matrix(1.33333 0 0 -1.33333 109.283 182.14)" fill="none" stroke="#000000" data-original="#000000" className=""></path><path d="M0 0h216.802" style={{ strokeWidth: 15, strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: 10, strokeDasharray: 'none', strokeOpacity: 1 }} transform="matrix(1.33333 0 0 -1.33333 109.283 273.524)" fill="none" stroke="#000000" data-original="#000000" className=""></path><path d="M0 0h159.552" style={{ strokeWidth: 15, strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: 10, strokeDasharray: 'none', strokeOpacity: 1 }} transform="matrix(1.33333 0 0 -1.33333 109.283 364.908)" fill="none" stroke="#000000" data-original="#000000" className=""></path><g clipPath="url(#a)" transform="matrix(1.33333 0 0 -1.33333 0 682.667)"><path d="m0 0-34.29-14.905c-7.359-3.198-14.83 4.272-11.631 11.631l14.904 34.291a57.374 57.374 0 0 0 12.049 17.698l163.579 163.58c7.321 7.32 19.189 7.32 26.509 0l10.158-10.158c7.321-7.321 7.321-19.189 0-26.509L17.699 12.048A57.393 57.393 0 0 0 0 0Z" style={{ strokeWidth: 15, strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: 10, strokeDasharray: 'none', strokeOpacity: 1 }} transform="translate(317.731 207.285)" fill="none" stroke="#000000" data-original="#000000" className=""></path><path d="m0 0 36.667-36.667" style={{ strokeWidth: 15, strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: 10, strokeDasharray: 'none', strokeOpacity: 1 }} transform="translate(298.764 256)" fill="none" stroke="#000000" data-original="#000000" className=""></path><path d="m0 0-36.667 36.667" style={{ strokeWidth: 15, strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: 10, strokeDasharray: 'none', strokeOpacity: 1 }} transform="translate(478.405 362.309)" fill="none" stroke="#000000" data-original="#000000" className=""></path><path d="m0 0 36.667-36.667" style={{ strokeWidth: 15, strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: 10, strokeDasharray: 'none', strokeOpacity: 1 }} transform="translate(420.196 377.433)" fill="none" stroke="#000000" data-original="#000000" className=""></path><path d="M0 0c-9.578 11.261-23.852 18.404-39.793 18.404h-331.208c-28.84 0-52.219-23.379-52.219-52.219v-203.839c0-28.84 23.379-52.219 52.219-52.219h4.94c4.518 0 7.935-4.087 7.134-8.533l-12.865-71.439c-.968-5.372 5.49-8.857 9.449-5.099l84.719 80.421a16.922 16.922 0 0 0 11.652 4.65h226.179c28.84 0 52.219 23.379 52.219 52.219v91.182" style={{ strokeWidth: 15, strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: 10, strokeDasharray: 'none', strokeOpacity: 1 }} transform="translate(430.72 435.056)" fill="none" stroke="#000000" data-original="#000000" className=""></path></g></g></svg>;
    case 'Affiliate':
      return <PiHandshakeThin fontSize="lg" color="black" marginRight="4" size={28} />;
    case 'Brand Ambassador':
      return <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width="28" height="28" x="0" y="0" viewBox="0 0 512 512" style={{ enableBackground: 'new 0 0 512 512' }} xmlSpace="preserve" className=""><g><path d="M330.2 350.22a44.17 44.17 0 0 0-30.65 76v67a7.5 7.5 0 0 0 12 6l18.63-14.06 18.62 14.06a7.52 7.52 0 0 0 4.52 1.52 7.42 7.42 0 0 0 3.34-.79 7.5 7.5 0 0 0 4.16-6.71v-67a44.17 44.17 0 0 0-30.64-76zm0 15a29.2 29.2 0 1 1-29.2 29.19 29.22 29.22 0 0 1 29.2-29.19zm15.64 113-11.13-8.41a7.52 7.52 0 0 0-9 0l-11.13 8.41v-42.48a44.08 44.08 0 0 0 31.29 0z" fill="#000000" opacity="1" data-original="#000000"></path><path d="M330.2 417.64a23.23 23.23 0 1 0-13.86-41.87 7.5 7.5 0 1 0 9 12 8.23 8.23 0 1 1-3.13 8.36 7.5 7.5 0 1 0-14.66 3.2 23.36 23.36 0 0 0 22.65 18.31z" fill="#000000" opacity="1" data-original="#000000"></path><path d="M418.93 471.12a7.74 7.74 0 0 0 6.91-8.51c0-.27-3.87-27.6-5.75-47.74-3.16-33.79-10.81-61-22.75-81-13.43-22.46-32.29-36-56.06-40.16-19.4-3.42-63.95-5.87-80.7-5.89h-.26c-19.1 0-64.17 2.93-82.82 5.86-31.73 5-71.19 30.06-78.95 121.25-1.72 20.21-4.4 47.73-4.43 48a7.5 7.5 0 1 0 14.93 1.45c0-.27 2.71-27.87 4.44-48.18 3.83-45 18.45-100.18 66.34-107.7 4.65-.73 11.19-1.47 18.62-2.17 0 .28.08.55.14.82 6.8 29.84 31.93 50.67 61.1 50.67 28.91 0 54-20.6 61-50.1a7.9 7.9 0 0 0 .19-1.5c7 .69 13.27 1.46 17.82 2.26 38.07 6.71 60.43 43 66.48 107.78 1.91 20.5 5.8 48.17 5.83 48.44a7.79 7.79 0 0 0 7.92 6.42zm-159.24-128.3c-21.72 0-40.53-15.46-46.16-37.75 17.55-1.31 36.37-2.25 46.79-2.25h.24c10.38 0 28.43.84 45.33 2.11-5.6 22.34-24.49 37.89-46.2 37.89zM336.45 131.78c-22.73 4.89-36.84.45-50.31-15.83a7.5 7.5 0 0 0-11.71.21c-24.36 31.62-53.39 39.21-91.35 23.91a7.5 7.5 0 0 0-10.2 5.7 106.05 106.05 0 0 0-2 18.1c0 26.86 9.22 55.19 25.29 77.73 17.55 24.61 40.2 38.16 63.79 38.16s46.24-13.55 63.79-38.16c16.07-22.54 25.29-50.87 25.29-77.73a105.43 105.43 0 0 0-3.79-26.63 7.49 7.49 0 0 0-8.8-5.46zm-24.87 101.11c-14.66 20.55-33 31.87-51.58 31.87s-36.92-11.32-51.58-31.87c-14.09-19.76-22.5-45.56-22.5-69a61 61 0 0 1 .4-6.64c18.91 6.23 35.94 7.18 51.83 2.91 15.52-4.17 29.79-13.57 42.53-28 14.1 13.68 30.5 18.63 51.65 15.61a81.32 81.32 0 0 1 1.75 16.12c0 23.44-8.41 49.24-22.5 69z" fill="#000000" opacity="1" data-original="#000000"></path><path d="M111.25 303.6a7.49 7.49 0 0 0 10.44-1.84c1.08-1.54 26.38-38.28 27.64-90.83.63-26.33 3.18-65.06 18.08-97.33 8.13-17.64 19.15-31.39 32.73-40.89 16-11.19 36.13-16.87 59.86-16.87s43.87 5.68 59.86 16.87c13.58 9.5 24.6 23.25 32.73 40.89 14.9 32.27 17.45 71 18.08 97.33 1.26 52.55 26.56 89.29 27.64 90.83a7.5 7.5 0 0 0 12.29-8.59c-.23-.34-23.79-34.75-24.93-82.6-.66-27.66-3.4-68.45-19.46-103.25C345.86 63.21 310.12 40.84 260 40.84s-85.86 22.37-106.21 66.48c-16.06 34.8-18.8 75.59-19.46 103.25-1.14 47.85-24.7 82.26-24.93 82.6a7.49 7.49 0 0 0 1.85 10.43z" fill="#000000" opacity="1" data-original="#000000"></path></g></svg>;
    case 'Download App':
      return <MdOutlineDownloadForOffline fontSize="28" color="black" marginRight="4" size={28} />;
    case 'Term & Conditions':
      return <PiNote fontSize="lg" color="black" marginRight="4" size={28} />;
    case 'FAQ':
      return <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width="28" height="28" x="0" y="0" viewBox="0 0 512 512" style={{ enableBackground: 'new 0 0 512 512' }} xmlSpace="preserve"><g><path d="M397 28.086H115c-63.411 0-115 51.589-115 115v110c0 58.33 43.648 106.655 100 114.026v101.801a14.998 14.998 0 0 0 14.997 15c3.903 0 7.74-1.524 10.609-4.394L237.04 368.086H397c63.411 0 115-51.589 115-115v-110c0-63.411-51.589-115-115-115zm85 225c0 46.869-38.131 85-85 85H230.827c-3.979 0-7.794 1.58-10.606 4.393L130 432.7v-79.614c0-8.284-6.716-15-15-15-46.869 0-85-38.131-85-85v-110c0-46.869 38.131-85 85-85h282c46.869 0 85 38.131 85 85z" fill="#000000" opacity="1" data-original="#000000"></path><path d="M182.7 155.856c6 0 9.4-6.4 9.4-13.8 0-6.4-2.801-13.4-9.4-13.4h-69.398c-6.801 0-13.6 3.2-13.6 9.6v126.998c0 6.4 7.799 9.6 15.6 9.6 7.799 0 15.6-3.2 15.6-9.6v-51.6h30.199c6.6 0 9.4-6.4 9.4-11.8 0-6.4-3.4-12.2-9.4-12.2h-30.199v-33.799H182.7zM265.903 137.856c-2.199-7-11.199-10.4-20.4-10.4-9.199 0-18.199 3.4-20.398 10.4l-37.199 121.998c-.201.8-.4 1.6-.4 2.2 0 7.4 11.4 12.8 20 12.8 5 0 9-1.6 10.199-5.8l6.801-25h42.199l6.799 25c1.201 4.2 5.201 5.8 10.199 5.8 8.602 0 20-5.4 20-12.8 0-.6-.199-1.4-.398-2.2zm-35 82.198 14.6-53.599 14.6 53.599zM372.7 128.656c-27.6 0-48.998 12.6-48.998 47.199v52.999c0 30.4 16.6 43.799 39.398 46.6v11.6c0 6.4 4.801 9.6 9.6 9.6 4.801 0 9.6-3.2 9.6-9.6v-11.6c22.801-2.8 39.6-16.2 39.6-46.6v-52.999c-.001-34.599-21.6-47.199-49.2-47.199zm18 100.198c0 9.2-3.199 15-8.4 18v-8.8c0-6.6-4.799-9.4-9.6-9.4-4.799 0-9.6 2.8-9.6 9.4v8.8c-5.4-3-8.199-8.8-8.199-18v-52.999c0-13.6 6.6-19.999 17.799-19.999 11.201 0 18 6.4 18 19.999z" fill="#000000" opacity="1" data-original="#000000"></path></g></svg>;
    case 'Privacy Policy':
      return <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width="28" height="28" x="0" y="0" viewBox="0 0 24 24" style={{ enableBackground: 'new 0 0 512 512' }} xmlSpace="preserve"><g><path d="M18 24c-.1 0-.2-.02-.294-.06-.232-.099-5.706-2.483-5.706-7.386v-4.018a.75.75 0 0 1 .509-.71l5.25-1.786a.75.75 0 0 1 .482 0l5.25 1.786a.75.75 0 0 1 .509.71v4.018c0 4.903-5.474 7.287-5.706 7.387A.768.768 0 0 1 18 24zm-4.5-10.927v3.48c0 3.333 3.456 5.337 4.5 5.865 1.044-.528 4.5-2.532 4.5-5.865v-3.48L18 11.542z" fill="#000000" opacity="1" data-original="#000000"></path><path d="M17.75 19.5a.744.744 0 0 1-.53-.22l-2-2a.75.75 0 1 1 1.061-1.061l1.389 1.389 2.48-3.308a.75.75 0 1 1 1.199.901l-3 4a.75.75 0 0 1-.547.298l-.052.001zM10.59 21H2.75A2.752 2.752 0 0 1 0 18.25V2.75A2.752 2.752 0 0 1 2.75 0h11.5A2.752 2.752 0 0 1 17 2.75v5.43a.75.75 0 0 1-1.5 0V2.75c0-.689-.561-1.25-1.25-1.25H2.75c-.689 0-1.25.561-1.25 1.25v15.5c0 .689.561 1.25 1.25 1.25h7.84a.75.75 0 0 1 0 1.5z" fill="#000000" opacity="1" data-original="#000000"></path><path d="M13.25 9.5h-9.5a.75.75 0 0 1 0-1.5h9.5a.75.75 0 0 1 0 1.5zM9.25 13.5h-5.5a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 0 1.5zM8.25 5.5h-4.5a.75.75 0 0 1 0-1.5h4.5a.75.75 0 0 1 0 1.5z" fill="#000000" opacity="1" data-original="#000000"></path></g></svg>;
    case 'Disconnection Policy':
      return <GoShieldSlash fontSize="lg" color="black" marginRight="4" size={28} />;
    case 'Responsible Gambling':
      return <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="28" height="28" x="0" y="0" viewBox="0 0 512 512" style={{ enableBackground: 'new 0 0 512 512' }} xml:space="preserve" ><g><path d="M119.094 309.036c-8.939-8.938-22.24-10.918-33.11-5.94v-81.414c0-16.237-13.21-29.447-29.447-29.447s-29.448 13.21-29.448 29.447V337.02c0 7.839 3.071 15.227 8.646 20.802l65.86 65.859v57.33a5 5 0 0 0 5 5h96.733a5 5 0 0 0 5-5v-80.669a5.004 5.004 0 0 0-1.464-3.536zm79.234 166.975h-86.733V421.61a5.004 5.004 0 0 0-1.464-3.536L42.807 350.75c-3.687-3.687-5.717-8.563-5.717-13.731V221.682c0-10.723 8.724-19.447 19.448-19.447 10.723 0 19.447 8.724 19.447 19.447v88.943c-9.985 11.556-9.503 29.089 1.464 40.056l39.69 39.69c.977.976 2.256 1.464 3.536 1.464s2.559-.488 3.536-1.464a5 5 0 0 0 0-7.071l-39.69-39.69c-7.582-7.582-7.583-19.92 0-27.503s19.922-7.583 27.504 0l86.305 86.306v73.598zm257.135-283.776c-16.237 0-29.447 13.21-29.447 29.447v81.412a29.469 29.469 0 0 0-12.287-2.653c-7.885 0-15.28 3.053-20.823 8.595l-87.77 87.771a4.998 4.998 0 0 0-1.464 3.536v80.669a5 5 0 0 0 5 5h96.732a5 5 0 0 0 5-5v-57.33l65.86-65.86c5.575-5.576 8.646-12.963 8.646-20.802V221.682c0-16.237-13.21-29.447-29.447-29.447zM474.91 337.02c0 5.168-2.03 10.044-5.717 13.731l-67.325 67.324a4.998 4.998 0 0 0-1.464 3.536v54.401h-86.732v-73.598l86.305-86.306c3.654-3.654 8.538-5.666 13.751-5.666s10.098 2.012 13.751 5.667c3.654 3.654 5.667 8.538 5.667 13.751s-2.012 10.097-5.667 13.751l-39.69 39.69a5 5 0 1 0 7.072 7.071l39.689-39.69c5.543-5.542 8.596-12.938 8.596-20.822 0-7.156-2.522-13.904-7.131-19.235v-88.941c0-10.723 8.724-19.447 19.447-19.447s19.447 8.724 19.447 19.447V337.02zM167.516 159.908c6.002 3.31 9.81 9.616 9.938 16.459.127 6.846-3.445 13.292-9.323 16.822-7.339 4.406-10.25 13.329-6.923 21.215a102.941 102.941 0 0 0 15.09 25.047c5.418 6.627 14.666 8.224 21.99 3.794 5.869-3.547 13.236-3.693 19.229-.38 5.99 3.311 9.786 9.625 9.907 16.479.15 8.537 6.407 15.515 14.876 16.592 4.282.544 8.582.816 12.876.816a101.5 101.5 0 0 0 16.407-1.334c8.443-1.384 14.445-8.597 14.27-17.151-.14-6.858 3.417-13.314 9.285-16.85 5.868-3.535 13.238-3.663 19.236-.333 7.48 4.153 16.662 2.217 21.832-4.6a101.69 101.69 0 0 0 14.143-25.646c3.007-7.992-.238-16.784-7.716-20.906-6.002-3.309-9.81-9.616-9.938-16.46-.127-6.846 3.445-13.292 9.323-16.822 7.339-4.407 10.25-13.329 6.923-21.215a103.087 103.087 0 0 0-6.65-13.063 102.966 102.966 0 0 0-8.44-11.984c-5.417-6.627-14.666-8.222-21.99-3.794-5.869 3.546-13.236 3.692-19.229.38-5.99-3.311-9.786-9.625-9.907-16.478-.149-8.537-6.406-15.515-14.876-16.593a101.627 101.627 0 0 0-29.283.518c-8.443 1.384-14.445 8.597-14.27 17.151.14 6.858-3.417 13.314-9.285 16.85s-13.237 3.663-19.236.334c-7.48-4.153-16.663-2.218-21.832 4.6a101.685 101.685 0 0 0-14.143 25.645c-3.007 7.992.238 16.784 7.716 20.907zm1.643-17.385a91.712 91.712 0 0 1 12.752-23.125 6.976 6.976 0 0 1 9.011-1.898c9.118 5.061 20.325 4.865 29.249-.512 8.923-5.377 14.334-15.193 14.122-25.619a6.977 6.977 0 0 1 5.889-7.079 91.672 91.672 0 0 1 26.404-.466 6.98 6.98 0 0 1 6.14 6.848c.183 10.418 5.957 20.019 15.067 25.055 9.115 5.038 20.319 4.819 29.24-.574a6.977 6.977 0 0 1 9.076 1.565 92.858 92.858 0 0 1 13.619 22.605 6.976 6.976 0 0 1-2.857 8.756c-8.936 5.366-14.367 15.168-14.173 25.581.194 10.409 5.983 20 15.108 25.03a6.98 6.98 0 0 1 3.185 8.628 91.708 91.708 0 0 1-12.751 23.125 6.977 6.977 0 0 1-9.011 1.898c-9.118-5.061-20.326-4.865-29.25.511-8.923 5.377-14.334 15.193-14.122 25.619a6.977 6.977 0 0 1-5.889 7.079 91.638 91.638 0 0 1-26.404.466 6.98 6.98 0 0 1-6.14-6.848c-.183-10.418-5.957-20.019-15.067-25.055a29.168 29.168 0 0 0-14.115-3.63 29.232 29.232 0 0 0-15.125 4.204 6.977 6.977 0 0 1-9.075-1.565 92.845 92.845 0 0 1-13.619-22.604 6.974 6.974 0 0 1 2.857-8.756c8.936-5.366 14.367-15.168 14.173-25.582-.194-10.408-5.982-19.999-15.107-25.03a6.975 6.975 0 0 1-3.187-8.627zm76.777 69.236a38.227 38.227 0 0 0 9.206 1.132c6.817 0 13.53-1.851 19.52-5.46 8.684-5.232 14.811-13.532 17.251-23.373 2.441-9.84.904-20.042-4.328-28.726-10.8-17.927-34.171-23.723-52.099-12.924-17.926 10.801-23.723 34.172-12.923 52.099 5.233 8.685 13.533 14.812 23.373 17.252zm-5.289-60.785a27.785 27.785 0 0 1 14.381-4.004c9.486 0 18.75 4.822 23.992 13.522 3.854 6.396 4.986 13.91 3.188 21.158s-6.31 13.361-12.706 17.214c-6.397 3.854-13.911 4.985-21.158 3.188-7.248-1.798-13.361-6.31-17.214-12.706-7.956-13.202-3.686-30.417 9.517-38.372zm-54.532-95.371a5 5 0 0 1 .808-7.025c36.925-29.308 88.407-29.974 125.891-2.718l-2.108-11.021a5 5 0 0 1 9.822-1.878l4.5 23.535a5 5 0 0 1-3.831 5.821l-23.396 5.177a5.001 5.001 0 0 1-2.16-9.764l12.625-2.793c-33.987-25.633-81.311-25.366-115.127 1.474a5 5 0 0 1-7.024-.808zm137.111 245.658c-19.013 15.091-41.892 22.59-64.726 22.59-21.511 0-42.982-6.65-61.165-19.871l2.108 11.021a5 5 0 0 1-9.822 1.878l-4.501-23.535a5 5 0 0 1 3.831-5.821l23.396-5.177a5 5 0 1 1 2.16 9.764l-12.625 2.793c33.987 25.632 81.31 25.367 115.126-1.475a4.999 4.999 0 0 1 7.024.808 4.999 4.999 0 0 1-.806 7.025z" fill="#000000" opacity="1" data-original="#000000" class=""></path></g></svg>;
    default:
      return null;
  }
}

const links = [
  { to: "/", label: "Home" },
  { to: "/Promotion", label: "Promotions" },
  // { to: "/VIP", label: "VIP" },
  // { to: "/spin-and-win", label: "Spin & Win" },
  { to: "/Referral", label: "Referral" },
  { to: "/", label: "Sports" },
  { to: "/", label: "Casino" },
  { to: "/responsible-gambling", label: "Crash" },
  { to: "/Reward-Points", label: "Bingo" },
  { to: "/vip-page", label: "Slots" },
  { to: "/blog", label: "Fishing" },
  { to: "/affiliate-program", label: "Table" },
  { to: "/spin-and-win", label: "Arcade" },
  { to: "/faq", label: "Lottery" },
  { to: "/terms-and-conditions", label: "Cock Fight" },
  { to: "/disconnection-policy", label: "Racing" },
  // { to: "/responsible-gambling", label: "English" },
  { to: "/contact-us", label: "Contact Us" },
  // { to: "/vip-page", label: "Blog" },
  { to: "/blog", label: "Affiliate" },
  // { to: "/affiliate-program", label: "Brand Ambassador" },
  // { to: "/spin-and-win", label: "Download App" },
  { to: "/terms-and-conditions", label: "Term & Conditions" },
  { to: "/faq", label: "FAQ" },
  { to: "/PrivacyPolicy", label: "Privacy Policy" },
  { to: "/responsible-gambling", label: "Disconnection Policy" },
  { to: "/Responsible-Gambling", label: "Responsible Gambling" }
];

export default RightSidebar;

