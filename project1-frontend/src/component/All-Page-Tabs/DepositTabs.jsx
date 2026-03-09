// import React from 'react';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import upi from "../assets/images/deposit/upi.svg";
import upi from '../../assets/images/deposit/upi.svg';
import usdt from '../../assets/images/deposit/usdt.svg';
import { FaStar } from 'react-icons/fa';

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
import Upi from '../deposit-component/Upi';
import Usdt from '../deposit-component/Usdt';
import Reword from '../deposit-component/Reword';
import { useEffect, useState } from 'react';

function DepositTabs() {
  const { bgGray, starBg } = useSelector((state) => state.theme);
  const location = useLocation();

  const tabId = new URLSearchParams(location.search).get('tab');
  const [tabIndex, setTabIndex] = useState(0);

  const { t, i18n } = useTranslation();
  const TabsStyle = {
    minWidth: '100px',
    height: '100px',
    width: 'auto',
    borderRadius: '10px',
  };

  useEffect(() => {
    let number = tabId;
    setTabIndex(Number(number));
  }, [tabId]);
  return (
    <>
      <Box
        className="home-tabs-section all-tabs"
        display={{ base: 'none', xl: 'block' }}
      >
        <Tabs
          marginLeft="10px"
          //   defaultIndex={tabIndex}
          index={tabIndex}
          onChange={(index) => setTabIndex(index)}
        >
          <TabList borderBottom="none" gap="10px">
            <Tab
              style={{
                backgroundColor: bgGray,
                ...TabsStyle,
                width: '110px',
                height: '93px',
                padding: '10px 6px 6px',
              }}
              className={`home-tab rounded text-center `}
            >
              <Center h="100%">
                <Link
                  className="flex items-center justify-between flex-col "
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                  style={{ height: '100%' }}
                >
                  <img src={upi} alt="" width="80px" />
                  {/* <FaUser size={28} /> */}
                  {t(`Gateway`)}
                </Link>
              </Center>
            </Tab>
            {/* <Tab
              style={{
                backgroundColor: bgGray,
                ...TabsStyle,
                width: '110px',
                height: '93px',
                padding: '10px 6px 6px',
              }}
              className={`home-tab rounded text-center `}
            >
              <Center h="100%">
                <Link
                  className="flex items-center flex-col justify-between"
                  style={{ height: '100%' }}
                >
                  <img src={usdt} alt="" width="40px" />
                  {t(`USDT`)}
                </Link>
              </Center>
            </Tab> */}
            {/* <Tab
              style={{
                backgroundColor: bgGray,
                ...TabsStyle,
                width: '110px',
                height: '93px',
                padding: '10px 6px 6px',
              }}
              className={`home-tab rounded text-center `}
            >
              <Center h="100%">
                <Link
                  className="flex items-center flex-col justify-between"
                  style={{ height: '100%' }}
                >
                  <FaStar size={35} style={{ fill: starBg }} />
                  {t(`Reward Redeem`)}
                </Link>
              </Center>
            </Tab> */}
          </TabList>

          <TabPanels padding="0" margin="0">
            <TabPanel padding="0" margin="0">
              <Upi></Upi>
            </TabPanel>
            <TabPanel padding="0" margin="0">
              <Usdt></Usdt>
            </TabPanel>
            <TabPanel padding="0" margin="0">
              <Reword></Reword>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
}

export default DepositTabs;
