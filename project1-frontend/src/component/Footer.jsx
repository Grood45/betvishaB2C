import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  UnorderedList,
  ListItem,
  Link,
  Flex,
  Image,
  useToast,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import upi from '../assets/images/footer/footer-payment-upi.svg';
import imps from '../assets/images/footer/footer-payment-imps.svg';
import paytm from '../assets/images/footer/footer-payment-paytm.svg';
import astropay from '../assets/images/footer/footer-payment-astropay.svg';
import usdt from '../assets/images/footer/footer-payment-usdt.svg';
import qrCode from '../assets/images/footer/qr-code.png';
import gc from '../assets/images/footer/gc.svg';
import eighteenPlus from '../assets/images/footer/18+.svg';
import { FaFacebook } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';
import { FaWhatsapp } from 'react-icons/fa';
import { RiTelegramLine } from 'react-icons/ri';
import { RiTwitterXFill } from 'react-icons/ri';
import { MdEmail } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Footer = () => {
  const { bgColor1, bgGray, gray50, PrimaryText } = useSelector((state) => state.theme);
  const settings = useSelector((state) => state?.auth?.settings);
  const navigate = useNavigate()
  const [footerData, setFooterData] = useState([])
  const { t } = useTranslation();
  const location = useLocation();
  const images = [upi, imps, paytm, astropay, usdt];
  const Style = {
    common: {
      borderRadius: '100%',
      color: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
    },
    fb: {
      backgroundColor: '#3b5998',
    },
    insta: {
      background: '#3f729b',
      backgroundImage:
        'radial-gradient(circle farthest-corner at 32% 106%, #ffe17d 0, #ffcd69 10%, #fa9137 28%, #eb4141 42%, transparent 82%), linear-gradient(135deg, #234bd7 12%, #c33cbe 58%)',
    },
    whatsapp: {
      backgroundColor: ' #00b900',
    },
    telegram: {
      backgroundColor: ' #08c',
    },
    email: {
      backgroundColor: ' #425563',
    },
  };
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const getFooterData = async () => {
    setLoading(true);
    try {
      let response = await axios.get(
        `${import.meta.env.VITE_API_URL
        }/api/footer-info/get-footer-info?site_auth_key=${import.meta.env.VITE_API_SITE_AUTH_KEY}`);

      setFooterData(response?.data?.data);

      setLoading(false)
    } catch (error) {
      console.error("Error getting payment data:", error);
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
    getFooterData()
  }, [])
  return (
    <div
      className={`${["/Promotion", "/Account", "/Deposit", "/Referral"].includes(location.pathname)
          ? "hidden lg:contents"
          : ""
        }`}

    >

      <Box className=" contents  footer-main">
        <Box
          display="flex"
          flexDirection={{ base: 'column', xl: 'column' }}
          p={{ base: '25px 10px 90px', xl: '10px' }}
          bg={{ base: bgGray, xl: bgColor1 }}
        >
          <Box
            display="flex"
            flexDirection={{ base: 'column', xl: 'row' }}
            justifyContent="space-between"
            p="3"
            px="10px"
            py="50px"
          >
            <Box
              className="about-wrapper"
              w={{ base: '100%', xl: '45%' }}
              mr={{ base: 0, md: '4' }}
            >
              <Heading as="h6">{t('aboutBetVisa')}</Heading>
              <Text
                color={{ base: PrimaryText, xl: gray50 }}
                textAlign="justify"
                className="content"
                fontSize={{ base: 'sm', xl: 'md' }}
                fontWeight={{ base: 'normal', xl: 'bold' }}
              >
                {t('betVisaHistory')}
              </Text>
            </Box>
            <Box
              display={{ base: 'none', xl: 'flex' }}
              className="link-section section"
              w={{ base: '100%', xl: '45%' }}
              flexDirection={{ base: 'column', md: 'row' }}
              justifyContent="space-between"
            >
              <Box className="about-link-wrapper" mb="4" w="45%">
                <Heading as="h6">{t('about')}</Heading>
                <UnorderedList
                  listStyleType="none"
                  p={0}
                  m={0}
                  style={{ color: gray50 }}
                  fontWeight="700"
                  lineHeight="30px"
                >
                  <ListItem>
                    <Link>{t('rewardPoint')}</Link>
                  </ListItem>
                  <ListItem>
                    <Link>{t('vip')}</Link>
                  </ListItem>
                  <ListItem>
                    <Link>{t('blog')}</Link>
                  </ListItem>
                  <ListItem>
                    <Link>{t('affiliateProgram')}</Link>
                  </ListItem>
                  <ListItem>
                    <Link>{t('brandAmbassador')}</Link>
                  </ListItem>
                </UnorderedList>
              </Box>
              <Box w="45%">
                <Heading as="h6">{t('info')}</Heading>
                <UnorderedList
                  listStyleType="none"
                  p={0}
                  m={0}
                  style={{ color: gray50 }}
                  fontWeight="700"
                  lineHeight="30px"
                >
                  <ListItem>
                    <Box style={{ cursor: 'pointer' }} onClick={() => navigate('/terms-and-conditions')}>{t('termsConditions')}</Box>
                  </ListItem>
                  <ListItem>
                    <Box style={{ cursor: 'pointer' }} onClick={() => navigate('/faq')}>{t('faq')}</Box>
                  </ListItem>
                  <ListItem>
                    <Link>{t('privacyPolicy')}</Link>
                  </ListItem>
                  {/* <ListItem>
                  <Link>{t('disconnectionPolicy')}</Link>
                </ListItem> */}
                  <ListItem>
                    <Link>{t('responsibleGambling')}</Link>
                  </ListItem>
                  <ListItem>
                    <Link>{t('contactUs')}</Link>
                  </ListItem>
                </UnorderedList>
              </Box>
            </Box>
          </Box>
          <Box display="flex" justifyContent="space-between" p="3">
            <Box
              className="payment-partner-wrapper"
              w={{ base: '100%', xl: '45%' }}
            >
              <Heading as="h6" className="default-title">
                {t('paymentMethods')}
              </Heading>
              <Box display="flex" flexDirection={{ base: 'row' }} gap="2">
                {footerData?.payments?.map((item, index) => (
                  <Link href={item?.link} target="_blank" rel="noopener noreferrer" key={index} rounded="5px" overflow="hidden">
                    <img className='w-[100px] h-[40px] md:h-[80px]' src={item?.src} alt={`Logo ${index + 1}`} />
                  </Link>
                ))}
              </Box>
            </Box>
            <Box
              className="download-app-qr-wrapper"
              w={{ base: '100%', xl: '45%' }}
              display={{ base: 'none', xl: 'block' }}
            >
              <Heading as="h6" className="default-title">
                {t('downloadApp')}
              </Heading>
              {/* <Box className="qr-code-wrapper">
              <Box
                as="div"
                level="L"
                background="#fff"
                foreground="#000"
                className="app-download-qr-code"
              >
                <img src={qrCode} style={{ width: '100px' }} />
              </Box>
            </Box> */}
            </Box>
          </Box>
          <Box
            justifyContent="space-between"
            p="3"
            display={{ base: 'block', xl: 'flex' }}
          >
            <Box alignItems="center" w={{ base: '100%', xl: '45%' }}>
              <Text as="h6" className="default-title">
                {t('followUs')}
              </Text>
              <Box
                className="social-icon"
                display="flex"
                flexDirection="row"
                gap="2"
                flexWrap="wrap"
              >
                <Link
                  href={settings?.facebook}
                  target="_blank"
                  style={{ ...Style.fb, ...Style.common }}
                  width={{ base: '50px', xl: '60px' }}
                  height={{ base: '50px', xl: '60px' }}
                >
                  <FaFacebook size={28} />
                </Link>
                <Link
                  href={settings?.instagram}
                  target="_blank"
                  style={{ ...Style.insta, ...Style.common }}
                  width={{ base: '50px', xl: '60px' }}
                  height={{ base: '50px', xl: '60px' }}
                >
                  <FaInstagram size={28} />
                </Link>
                <Link
                  href={settings?.whatsapp}
                  target="_blank"
                  style={{ ...Style.whatsapp, ...Style.common }}
                  width={{ base: '50px', xl: '60px' }}
                  height={{ base: '50px', xl: '60px' }}
                >
                  <FaWhatsapp size={28} />
                </Link>
                <Link
                  href={settings?.teligram}
                  target="_blank"
                  rel="noopener"
                  style={{ ...Style.telegram, ...Style.common }}
                  width={{ base: '50px', xl: '60px' }}
                  height={{ base: '50px', xl: '60px' }}
                >
                  <RiTelegramLine size={28} />
                </Link>
                <Link
                  href={settings?.twitter}
                  target="_blank"
                  style={{ backgroundColor: PrimaryText, ...Style.common }}
                  width={{ base: '50px', xl: '60px' }}
                  height={{ base: '50px', xl: '60px' }}
                >
                  <RiTwitterXFill size={28} />
                </Link>
                <Link
                  href={settings?.email ?? "mailto:support.inr@betvisa.com"}
                  target="_blank"
                  rel="noopener"
                  style={{ ...Style.whatsapp, ...Style.common }}
                  width={{ base: '50px', xl: '60px' }}
                  height={{ base: '50px', xl: '60px' }}
                >
                  <MdEmail size={28} />
                </Link>
              </Box>
            </Box>
            <Box alignItems="center" w={{ base: '100%', xl: '45%' }}>
              <Text as="h6" className="default-title">
                {t('licenses')}
              </Text>
              <Box className="licenses-list" display="flex" flexDirection="row">
                {footerData?.partners?.map((item, index) => {
                  return <Link href={item?.link} target="_blank" rel="noopener noreferrer" key={index} className="image-wrapper">
                    <img src={item?.src} alt="gc" style={{ width: '60px' }} />
                  </Link>
                })}

              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          display={{ base: 'none', xl: 'block' }}
          className="footer-copyright-wrapper mb-[60px] lg:mb-[0px]"
          textAlign="center"
          padding="20px"
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          {footerData?.footer_text?.map((item) => {
            return <span className='text-lg font-medium'>
              {item}
            </span>
          })}
        </Box>
      </Box>
    </div>

  );
};

export default Footer;
