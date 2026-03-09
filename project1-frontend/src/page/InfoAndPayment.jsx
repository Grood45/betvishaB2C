import React from 'react';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Progress, Text, Box, Flex, Image } from '@chakra-ui/react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { HStack, Center } from '@chakra-ui/react';
import { IoWalletOutline } from 'react-icons/io5';
import { CiBank } from 'react-icons/ci';
import { FaRegUser } from 'react-icons/fa';
import { IoDocumentsOutline } from 'react-icons/io5';
import { FaRegEnvelope } from 'react-icons/fa';
import { CiWallet } from 'react-icons/ci';
import { LiaCrownSolid } from 'react-icons/lia';
import { FaHandsHoldingCircle } from 'react-icons/fa6';
import { PiSpinnerBallFill } from 'react-icons/pi';
import { FaUsers } from 'react-icons/fa';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { sendPostRequest } from '../api/api';

import Bronze from '../assets/images/vip/Bronze.png';
import { logout } from '../redux/auth-redux/actions';
const InfoAndPayment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bgColor1, bgGray, progressBar, secondaryText } = useSelector(
    (state) => state.theme
  );
  const TabsStyle = {
    width: 'auto',
    borderRadius: '10px',
  };

  const { t, i18n } = useTranslation();
  const isActive = (path) => {
    return location.pathname === path;
  };

  const datas = useSelector((state) => state?.auth?.user);
  const userData = datas?.user;

  const onLogout = async (e) => {
    e.preventDefault();
    try {
      if (userData?.user_id) {
        await sendPostRequest(`${import.meta.env.VITE_API_URL}/api/user/user-logout`, {
          user_id: userData.user_id
        });
      }
    } catch (err) {
      console.log(err);
    }
    dispatch(logout());
    navigate('/');
  };
  return (
    <Box
      style={{ backgroundColor: bgColor1 }}
      className="infoPayment_sideBar "
      display={{ base: 'none', xl: 'block' }}
    >
      <Box>
        <Flex>
          <Box>
            <Box
              style={{ textAlign: 'left' }}
              maxW="100%"
              width={{ base: '100%', xl: '280px' }}
            >
              <Flex
                className="infoTabs"
                gap="10px"
                flexDirection={{ base: 'row', xl: 'column' }}
                bg={{ base: bgColor1, xl: bgGray }}
                style={{ textAlign: 'left' }}
                borderRadius={"8px"}
                py="20px"
              >
                <Button
                  gap="15px"
                  height="auto"
                  minW={{ base: '85px', xl: '100%' }}
                  bg="transparent"
                  _hover={{ bg: 'transparent' }}
                  justifyContent="flex-start"
                >
                  <Link
                    to="/Account"
                    className={`${isActive('/Account') ? 'active-menu' : ''}`}
                    style={{
                      display: 'flex',
                      gap: '15px',
                      backgroundColor: bgGray,
                    }}
                  >
                    <FaRegUser fontSize="28px" />
                    <Text>{t('account')}</Text>
                  </Link>
                </Button>
                <Button
                  gap="15px"
                  height="auto"
                  minW={{ base: '85px', xl: '100%' }}
                  bg="transparent"
                  _hover={{ bg: 'transparent' }}
                  justifyContent="flex-start"
                >
                  <Link
                    to="/Deposit"
                    className={`${isActive('/Deposit') ? 'active-menu' : ''}`}
                    style={{
                      display: 'flex',
                      gap: '15px',
                      backgroundColor: bgGray,
                    }}
                  >
                    <IoWalletOutline fontSize="28px" />
                    <Text>{t('deposit')}</Text>
                  </Link>
                </Button>
                <Button
                  gap="15px"
                  height="auto"
                  minW={{ base: '85px', xl: '100%' }}
                  bg="transparent"
                  _hover={{ bg: 'transparent' }}
                  justifyContent="flex-start"
                >
                  <Link
                    to="/Withdraw"
                    className={`${isActive('/Withdraw') ? 'active-menu' : ''}`}
                    style={{
                      display: 'flex',
                      gap: '15px',
                      backgroundColor: bgGray,
                    }}
                  >
                    <FaRegUser fontSize="28px" />
                    <Text>{t('withdraw')}</Text>
                  </Link>
                </Button>
                <Button
                  gap="15px"
                  height="auto"
                  minW={{ base: '85px', xl: '100%' }}
                  bg="transparent"
                  _hover={{ bg: 'transparent' }}
                  justifyContent="flex-start"
                >
                  <Link
                    to="/Bank"
                    className={`${isActive('/Bank') ? 'active-menu' : ''}`}
                    style={{
                      display: 'flex',
                      gap: '15px',
                      backgroundColor: bgGray,
                    }}
                  >
                    <CiBank fontSize="28px" />
                    <Text>{t('bank')}</Text>
                  </Link>
                </Button>
                <Button
                  gap="15px"
                  height="auto"
                  minW={{ base: '85px', xl: '100%' }}
                  bg="transparent"
                  _hover={{ bg: 'transparent' }}
                  justifyContent="flex-start"
                >
                  <Link
                    to="/Records"
                    className={`${isActive('/Records') ? 'active-menu' : ''}`}
                    style={{
                      display: 'flex',
                      gap: '15px',
                      backgroundColor: bgGray,
                    }}
                  >
                    <IoDocumentsOutline fontSize="28px" />
                    <Text>{t('records')}</Text>
                  </Link>
                </Button>
                <Button
                  gap="15px"
                  height="auto"
                  minW={{ base: '85px', xl: '100%' }}
                  bg="transparent"
                  _hover={{ bg: 'transparent' }}
                  justifyContent="flex-start"
                >
                  <Link
                    to="/bet-records"
                    className={`${isActive('/bet-records') ? 'active-menu' : ''}`}
                    style={{
                      display: 'flex',
                      gap: '15px',
                      backgroundColor: bgGray,
                    }}
                  >
                    <FaRegEnvelope fontSize="28px" />
                    <Text>{t('Bet Reports')}</Text>
                  </Link>
                </Button>
                <Button
                  gap="15px"
                  height="auto"
                  minW={{ base: '85px', xl: '100%' }}
                  bg="transparent"
                  _hover={{ bg: 'transparent' }}
                  justifyContent="flex-start"
                >
                  <Link
                    to="/Wallet"
                    className={`${isActive('/Wallet') ? 'active-menu' : ''}`}
                    style={{
                      display: 'flex',
                      gap: '15px',
                      backgroundColor: bgGray,
                    }}
                  >
                    <CiWallet fontSize="28px" />
                    <Text>{t('wallet')}</Text>
                  </Link>
                </Button>
              </Flex>
              <Flex
                padding="15px"
                gap="10px"
                flexDirection={{ base: 'row', xl: 'column' }}
                bg={{ base: bgColor1, xl: bgGray }}
                style={{ textAlign: 'left' }}
                mt={4}
                borderRadius={"8px"}

                p="20px 15px"
              >
                <Box
                  display="flex"
                  gap="15px"
                  bg="transparent"
                  _hover={{ bg: 'transparent' }}
                  justifyContent="flex-start"
                  marginBottom="20px"
                >
                  <Image src={Bronze} alt="Bronze" boxSize="35px" />
                  <Text style={{ fontWeight: 'bold' }} flexShrink={0}>
                    {t('vipBronze')}
                  </Text>
                </Box>
                <Box position="relative" className="level_wrap">
                  <Progress
                    value={0}
                    style={{
                      backgroundColor: progressBar,
                      height: '8px',
                      width: '100%',
                    }}
                    colorScheme="primary"
                    height="4px"
                    mb="2"
                  />
                  <Flex align="center" width="100%" flexGrow="100%">
                    <Box className="first-step" width="100%">
                      <Box
                        className="prgoress_star box-outline default-center"
                        width="35px"
                        height="35px"
                      ></Box>
                      <Text
                        as="span"
                        style={{ fontSize: '14px' }}
                        marginTop="10px"
                        display="inline-block"
                      >
                        <span>{t('betAmount')} :</span>
                        <Text
                          as="span"
                          className="amount font-bold"
                          style={{ color: secondaryText }}
                        >
                          0/1,000,000
                        </Text>
                      </Text>
                    </Box>
                    <Box
                      className="step"
                      zIndex="1"
                      right="-15px"
                      position="absolute"
                      top="-15px"
                    >
                      <Image
                        src={Bronze}
                        alt="Bronze"
                        boxSize="50px"
                        mr={2}
                        width="35px"
                        height="35px"
                      />
                      <Text style={{ fontSize: '14px' }} as="span">
                        {t('silver')}
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              </Flex>

              <Flex
                gap="10px"
                flexDirection={{ base: 'row', xl: 'column' }}
                bg={{ base: bgColor1, xl: bgGray }}
                style={{ textAlign: 'left' }}
                mt={4}
                py="20px"
                borderRadius={"8px"}

              >
                {/* <Button
                  gap="15px"
                  bg="transparent"
                  _hover={{ bg: 'transparent' }}
                  justifyContent="flex-start"
                >
                  <Link
                    to="/Reward-Point"
                    className={`${
                      isActive('/Reward-Point') ? 'active-menu' : ''
                    }`}
                    style={{
                      display: 'flex',
                      gap: '15px',
                      backgroundColor: bgGray,
                    }}
                  >
                    <FaHandsHoldingCircle fontSize="28px" />
                    <Text>{t('rewardPoint')}</Text>
                  </Link>
                </Button> */}
                {/* <Button
                  gap="15px"
                  bg="transparent"
                  _hover={{ bg: 'transparent' }}
                  justifyContent="flex-start"
                >
                  <Link
                    to="/VIP"
                    className={`${isActive('/VIP') ? 'active-menu' : ''}`}
                    style={{
                      display: 'flex',
                      gap: '15px',
                      backgroundColor: bgGray,
                    }}
                  >
                    <LiaCrownSolid fontSize="28px" />
                    <Text>{t('vip')}</Text>
                  </Link>
                </Button> */}
                {/* <Button
                  gap="15px"
                  bg="transparent"
                  _hover={{ bg: 'transparent' }}
                  justifyContent="flex-start"
                >
                  <Link
                    to="/spin-win"
                    className={`${isActive('/spin-win') ? 'active-menu' : ''}`}
                    style={{
                      display: 'flex',
                      gap: '15px',
                      backgroundColor: bgGray,
                    }}
                  >
                    <PiSpinnerBallFill fontSize="28px" />
                    <Text>{t('spin&Win')}</Text>
                  </Link>
                </Button> */}
                <Button
                  gap="15px"
                  bg="transparent"
                  _hover={{ bg: 'transparent' }}
                  justifyContent="flex-start"
                >
                  <Link
                    to="/Referral"
                    className={`${isActive('/Referral') ? 'active-menu' : ''}`}
                    style={{
                      display: 'flex',
                      gap: '15px',
                      backgroundColor: bgGray,
                    }}
                  >
                    <FaUsers fontSize="28px" />
                    <Text>{t('referral')}</Text>
                  </Link>
                </Button>
              </Flex>
              {/* <Flex gap="10px" flexDirection={{ base: "row", xl: "column" }} bg={{ base: bgColor1, xl: bgGray }} style={{ textAlign: 'left' }} mt={4} py="20px">
                                <Button gap="15px" bg="transparent" _hover={{ bg: 'transparent', }} justifyContent="flex-start">
                                    <Link to="/Terms-Conditions" className={`${isActive('/Terms-Conditions') ? 'active-menu' : ''}`}
                                        style={{ display: "flex", gap: "15px", backgroundColor: bgGray }}
                                    >
                                        <FaHandsHoldingCircle fontSize="28px" />
                                        <Text>Terms & Conditions</Text>
                                    </Link>
                                </Button>
                                <Button gap="15px" bg="transparent" _hover={{ bg: 'transparent', }} justifyContent="flex-start">
                                    <Link to="/faq" className={`${isActive('/faq') ? 'active-menu' : ''}`}
                                        style={{ display: "flex", gap: "15px", backgroundColor: bgGray }}
                                    >
                                        <LiaCrownSolid fontSize="28px" />
                                        <Text>FAQ</Text>
                                    </Link>
                                </Button>
                                <Button gap="15px" bg="transparent" _hover={{ bg: 'transparent', }} justifyContent="flex-start">
                                    <Link to="/Privacy-Policy" className={`${isActive('/Privacy-Policy') ? 'active-menu' : ''}`}
                                        style={{ display: "flex", gap: "15px", backgroundColor: bgGray }}
                                    >
                                        <PiSpinnerBallFill fontSize="28px" />
                                        <Text>Privacy Policy</Text>
                                    </Link>
                                </Button>
                                <Button gap="15px" bg="transparent" _hover={{ bg: 'transparent', }} justifyContent="flex-start">
                                    <Link to="/DisconnectionPolicy" className={`${isActive('/DisconnectionPolicy') ? 'active-menu' : ''}`}
                                        style={{ display: "flex", gap: "15px", backgroundColor: bgGray }}
                                    >
                                        <FaUsers fontSize="28px" />
                                        <Text>Disconnection Policy</Text>
                                    </Link>
                                </Button>
                                <Button gap="15px" bg="transparent" _hover={{ bg: 'transparent', }} justifyContent="flex-start">
                                    <Link to="/Responsible" className={`${isActive('/Responsible') ? 'active-menu' : ''}`}
                                        style={{ display: "flex", gap: "15px", backgroundColor: bgGray }}
                                    >
                                        <FaUsers fontSize="28px" />
                                        <Text>Responsible Gambling</Text>
                                    </Link>
                                </Button>
                                <Button gap="15px" bg="transparent" _hover={{ bg: 'transparent', }} justifyContent="flex-start">
                                    <Link to="/Contact-US" className={`${isActive('/Contact-US') ? 'active-menu' : ''}`}
                                        style={{ display: "flex", gap: "15px", backgroundColor: bgGray }}
                                    >
                                        <FaUsers fontSize="28px" />
                                        <Text>Contact US</Text>
                                    </Link>
                                </Button>
                            </Flex> */}
              <Accordion
                allowToggle
                gap="10px"
                flexDirection={{ base: 'row', xl: 'column' }}
                bg={{ base: bgColor1, xl: bgGray }}
                style={{ textAlign: 'left' }}
                mt={4}
                py="20px"
              >
                <AccordionItem>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      ... {t('more')}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <Button
                      gap="15px"
                      bg="transparent"
                      _hover={{ bg: 'transparent' }}
                      justifyContent="flex-start"
                    >
                      <Link
                        to="/Terms-Conditions"
                        className={`${isActive('/Terms-Conditions') ? 'active-menu' : ''
                          }`}
                        style={{
                          display: 'flex',
                          gap: '15px',
                          backgroundColor: bgGray,
                        }}
                      >
                        <FaHandsHoldingCircle fontSize="28px" />
                        <Text>{t('termsConditions')}</Text>
                      </Link>
                    </Button>
                  </AccordionPanel>
                  <AccordionPanel>
                    <Button
                      gap="15px"
                      bg="transparent"
                      _hover={{ bg: 'transparent' }}
                      justifyContent="flex-start"
                    >
                      <Link
                        to="/faq"
                        className={`${isActive('/faq') ? 'active-menu' : ''}`}
                        style={{
                          display: 'flex',
                          gap: '15px',
                          backgroundColor: bgGray,
                        }}
                      >
                        <LiaCrownSolid fontSize="28px" />
                        <Text>{t('faq')}</Text>
                      </Link>
                    </Button>
                  </AccordionPanel>
                  <AccordionPanel>
                    <Button
                      gap="15px"
                      bg="transparent"
                      _hover={{ bg: 'transparent' }}
                      justifyContent="flex-start"
                    >
                      <Link
                        to="/Privacy-Policy"
                        className={`${isActive('/Privacy-Policy') ? 'active-menu' : ''
                          }`}
                        style={{
                          display: 'flex',
                          gap: '15px',
                          backgroundColor: bgGray,
                        }}
                      >
                        <PiSpinnerBallFill fontSize="28px" />
                        <Text>{t('privacyPolicy')}</Text>
                      </Link>
                    </Button>
                  </AccordionPanel>
                  <AccordionPanel>
                    <Button
                      gap="15px"
                      bg="transparent"
                      _hover={{ bg: 'transparent' }}
                      justifyContent="flex-start"
                    >
                      <Link
                        to="/DisconnectionPolicy"
                        className={`${isActive('/DisconnectionPolicy') ? 'active-menu' : ''
                          }`}
                        style={{
                          display: 'flex',
                          gap: '15px',
                          backgroundColor: bgGray,
                        }}
                      >
                        <FaUsers fontSize="28px" />
                        <Text>{t('disconnectionPolicy')}</Text>
                      </Link>
                    </Button>
                  </AccordionPanel>
                  <AccordionPanel>
                    <Button
                      gap="15px"
                      bg="transparent"
                      _hover={{ bg: 'transparent' }}
                      justifyContent="flex-start"
                    >
                      <Link
                        to="/Responsible"
                        className={`${isActive('/Responsible') ? 'active-menu' : ''
                          }`}
                        style={{
                          display: 'flex',
                          gap: '15px',
                          backgroundColor: bgGray,
                        }}
                      >
                        <FaUsers fontSize="28px" />
                        <Text>{t('responsibleGambling')}</Text>
                      </Link>
                    </Button>
                  </AccordionPanel>
                  <AccordionPanel>
                    <Button
                      bg="transparent"
                      _hover={{ bg: 'transparent' }}
                      justifyContent="flex-start"
                    >
                      <Link
                        to="/Contact-US"
                        className={`${isActive('/Contact-US') ? 'active-menu' : ''
                          }`}
                        style={{
                          display: 'flex',
                          gap: '15px',
                          backgroundColor: bgGray,
                        }}
                      >
                        <FaUsers fontSize="28px" />
                        <Text>{t('contactUs')}</Text>
                      </Link>
                    </Button>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
              <Button
                bg={{ base: '#ec1c2b' }}
                _hover={{ bg: { base: '#ec1c2b', xl: 'greenBtn' } }}
                color={"white"}
                fontSize={{ base: '.9rem', xl: '16px' }}
                borderRadius={{ base: '25px', xl: '5px' }}
                width={"100%"}
                marginTop={"5px"}
                height={{ base: '40px', xl: '50px' }}
                display={{ base: 'none', xl: 'block' }}
                onClick={(e) => onLogout(e)}

              >
                {t('logout')}
              </Button>
            </Box>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default InfoAndPayment;
