// import React from 'react';
import { RiHome4Line } from 'react-icons/ri';
import { CiSearch } from 'react-icons/ci';
import { PiSpinnerBallBold } from 'react-icons/pi';
import { MdOutlineStarBorder } from 'react-icons/md';
import { GiPokerHand } from 'react-icons/gi';
import { IoFlashOutline } from 'react-icons/io5';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { MdLock } from 'react-icons/md';

import {
  Box,
  HStack,
  Center,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import Profile from './Account-component/Profile';
import ChangePassword from './Account-component/ChangePassword';

function AccountTabs() {
  const {
    bgColor1,
    bgGray,
    PrimaryText,
    secondaryText,
    hoverColor,
    ClickActiveColor,
  } = useSelector((state) => state.theme);

  const { t, i18n } = useTranslation();
  const TabsStyle = {
    minWidth: '100px',
    height: '100px',
    width: 'auto',
    borderRadius: '10px',
  };
  return (
    <>
      <div className="home-tabs-section all-tabs">
        <Tabs marginLeft="10px" display={{ base: 'none', xl: 'block' }}>
          <TabList borderBottom="none" gap="10px">
            <Tab
              style={{
                backgroundColor: bgGray,
                ...TabsStyle,
                width: '110px',
                height: '93px',
              }}
              className="p-3 home-tab rounded text-center"
            >
              <Center h="100%">
                <Link
                  className="flex items-center justify-content-center flex-col"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                >
                  <FaUser size={28} />
                  {t(`profile`)}
                </Link>
              </Center>
            </Tab>
            <Tab
              style={{
                backgroundColor: bgGray,
                ...TabsStyle,
                width: '110px',
                height: '93px',
              }}
              className="p-3 home-tab rounded text-center"
            >
              <Center h="100%">
                <Link className="flex items-center justify-content-center flex-col h-full">
                  <MdLock size={28} />
                  {t(`Change Password`)}
                </Link>
              </Center>
            </Tab>
          </TabList>

          <TabPanels padding="0" margin="0">
            <TabPanel padding="0" margin="0" className=''>
              <Profile t={t}></Profile>
            </TabPanel>
            <TabPanel padding="0" margin="0">
              <ChangePassword t={t}></ChangePassword>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </>
  );
}

export default AccountTabs;
