// import React from 'react';
import { RiHome4Line } from 'react-icons/ri';
import { CiSearch } from 'react-icons/ci';
import { PiSpinnerBallBold } from 'react-icons/pi';
import { MdOutlineStarBorder } from 'react-icons/md';
import { GiPokerHand } from 'react-icons/gi';
import { IoFlashOutline } from 'react-icons/io5';

import '../assets/css/style.css';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
// Images
import Search from '../assets/images/carousel/c1.jpg';
import SpinWin from '../assets/images/carousel/c2.jpg';
import Reward from '../assets/images/home-images/reward.png';
import Games from '../assets/images/carousel/c3.jpg';
import Recommended from '../assets/images/carousel/c3.jpg';
import MegaWin from '../assets/images/carousel/c3.jpg';

import { Box, HStack, Center, Text } from '@chakra-ui/react';
import GameModal from '../modal/GameModal';
import { useState } from 'react';
import SearchModal from '../modal/SearchModal';

function HomeTabs({active,setActive}) {
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
    width: 'auto',
    borderRadius: '10px',
  };
  const [isOpen, setIsOpen] = useState(false);

  
  const openModal = () => {
        
    setIsOpen(true);
      };

      
  const closeModal = () => {
    setIsOpen(false);
  };
  return (
    <>
      <div className="home-tabs-section">
        <Box
          className="p-3"
          overflowX="scroll"
          css={{ '&::-webkit-scrollbar': { display: 'none' } }}
          display={{ base: 'none', xl: 'block' }}
        >
          <HStack spacing="15px" className="text-base font-bold">
            <Box
              style={{ backgroundColor: bgGray, ...TabsStyle }}
              width={{ base: 'auto', xl: '100px' }}
              className="p-3 home-tab rounded text-center"
              onClick={() => openModal()}
            >
              <Center
                className="flex-col"
                direction="column"
                alignItems="center"
                justifyContent="space-between"
                h="100%"
              >
                <CiSearch size={40} />
                <Link to="/">{t(`search`)}</Link>
              </Center>
            </Box>
            {/* <Box
              style={{ backgroundColor: bgGray, ...TabsStyle }}
              width={{ base: 'auto', xl: '100px' }}
              className="p-3 home-tab rounded text-center"
            >
              <Center
                className="flex-col"
                direction="column"
                alignItems="center"
                justifyContent="space-between"
                h="100%"
              >
                <PiSpinnerBallBold size={40} />
                <Link to="/spin-and-win">{t(`spin&Win`)}</Link>
              </Center>
            </Box> */}
            {/* <Box
              style={{ backgroundColor: bgGray, ...TabsStyle }}
              width={{ base: 'auto', xl: '100px' }}
              className="p-3 home-tab rounded text-center"
            >
              <Center
                className="flex-col"
                direction="column"
                alignItems="center"
                justifyContent="space-between"
                h="100%"
              >
                <img
                  src={Reward}
                  alt="Reward"
                  size={40}
                  style={{ width: '40px' }}
                />
                <Link to="/reward-points">{t(`rewardPoint`)}</Link>
              </Center>
            </Box> */}
            {/* FADF13 */}
            <Box
            onClick={()=>setActive(1)}
              style={{ backgroundColor:active===1?'#ffaa00':bgGray, ...TabsStyle }}
              width={{ base: 'auto', xl: '100px' }}
              className="p-3 home-tab cursor-pointer rounded text-center"
            >
              <Center
                className="flex-col"
                direction="column"
                alignItems="center"
                justifyContent="space-between"
                h="100%"
              >
                <MdOutlineStarBorder size={40} />
                <Text>{t(`topGames`)}</Text>
              </Center>
            </Box>
            <Box
            onClick={()=>setActive(2)}

            style={{ backgroundColor:active===2?'#ffaa00':bgGray, ...TabsStyle }}
              width={{ base: 'auto', xl: '100px' }}
              className="p-3 home-tab cursor-pointer rounded text-center"
            >
              <Center
                className="flex-col"
                direction="column"
                alignItems="center"
                justifyContent="space-between"
                h="100%"
              >
                <GiPokerHand size={40} />
                <Text>{t(`recommended`)}</Text>
              </Center>
            </Box>
            <Box
            onClick={()=>setActive(3)}

            style={{ backgroundColor:active===3?'#ffaa00':bgGray, ...TabsStyle }}
              width={{ base: 'auto', xl: '100px' }}
              className="p-3 home-tab rounded cursor-pointer text-center"
            >
              <Center
                className="flex-col"
                direction="column"
                alignItems="center"
                justifyContent="space-between"
                h="100%"
              >
                <IoFlashOutline size={40} />
                <Text >{t(`megaWin`)}</Text>
              </Center>
            </Box>
          </HStack>
        </Box>
        <SearchModal
          isOpen={isOpen}
          onClose={closeModal}
          providerData={"20"}
          size="lg"
          
        />
      </div>
    </>
  );
}

export default HomeTabs;
