import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  VStack,
  Link,
  Box,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom'; // Optional for router
import React from 'react';
import { CiMenuBurger, CiBank } from 'react-icons/ci';
import { useSelector } from 'react-redux';
import { RiInboxLine } from 'react-icons/ri';
import { FaRegUser } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';

function RightSidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const btnRef = React.useRef();
  const { bgGray } = useSelector((state) => state.theme);
  const isUserLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  return (
    <>
      <Box display={{ base: 'none', xl: 'block' }}>
        <Box
          style={{ backgroundColor: bgGray  , cursor: 'pointer'}}
          borderRadius="5px"
          width="50px"
          height="50px"
          padding="13px"
          ref={btnRef}
          onClick={onOpen}
        >
          <CiMenuBurger
           
            fontSize={'25px'}
            color="black"
          />
        </Box>

        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerBody>
              <VStack align="start" gap="20px" fontSize="16px">
                {isUserLoggedIn && (
                  <>
                    <Link
                      as={RouterLink}
                      to="/Bank"
                      fontSize="base"
                      fontWeight="bold"
                      display="flex" // Use flexbox for layout
                      alignItems="center"
                      marginTop="20px"
                      height="20px"
                    >
                      <CiBank size="39px" style={{ paddingRight: '10px' }} />{' '}
                      {t('banking')}
                    </Link>{' '}
                    <Link
                      as={RouterLink}
                      to="/Account"
                      fontSize="base"
                      fontWeight="bold"
                      display="flex" // Use flexbox for layout
                      alignItems="center"
                    >
                      <FaRegUser size="20px" style={{ marginRight: '15px' }} />
                      {t('profile')}
                    </Link>{' '}
                    {/* <Link
                      as={RouterLink}
                      to="/Inbox"
                      fontSize="base"
                      fontWeight="bold"
                      display="flex" // Use flexbox for layout
                      alignItems="center"
                    >
                      <RiInboxLine
                        size="23px"
                        style={{ marginRight: '12px' }}
                      />
                      {t('inbox')}
                    </Link> */}
                  </>
                )}
                {/* <Link
                  as={RouterLink}
                  to="/Reward-Points"
                  fontSize="base"
                  fontWeight="bold"
                >
                  {t('rewardPoint')}
                </Link> */}
                {/* <Link
                  as={RouterLink}
                  to="/vip-page"
                  fontSize="base"
                  fontWeight="bold"
                >
                  {t('vip')}
                </Link> */}
                {/* <Link
                  as={RouterLink}
                  to="/blog"
                  fontSize="base"
                  fontWeight="bold"
                >
                  {t('blog')}
                </Link> */}
                <Link
                  as={RouterLink}
                  to="/affiliate-program"
                  fontSize="base"
                  fontWeight="bold"
                >
                  {t('affiliateProgram')}
                </Link>
                {/* <Link
                  as={RouterLink}
                  to="/Brand-Ambassador"
                  fontSize="base"
                  fontWeight="bold"
                >
                  {t('brandAmbassador')}
                </Link> */}
                <Link
                  as={RouterLink}
                  to="/faq"
                  fontSize="base"
                  fontWeight="bold"
                >
                  {t('faq')}
                </Link>
                <Link
                  as={RouterLink}
                  to="/PrivacyPolicy"
                  fontSize="base"
                  fontWeight="bold"
                >
                  {t('privacyPolicy')}
                </Link>
                <Link
                  as={RouterLink}
                  to="/terms-and-conditions"
                  fontSize="base"
                  fontWeight="bold"
                >
                  {t('termsConditions')}
                </Link>
                {/* <Link
                  as={RouterLink}
                  to="/Disconnection-Policy"
                  fontSize="base"
                  fontWeight="bold"
                >
                  {t('disconnectionPolicy')}
                </Link> */}
                <Link
                  as={RouterLink}
                  to="/Responsible-Gambling"
                  fontSize="base"
                  fontWeight="bold"
                >
                  {t('responsibleGambling')}
                </Link>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>
    </>
  );
}

export default RightSidebar;
