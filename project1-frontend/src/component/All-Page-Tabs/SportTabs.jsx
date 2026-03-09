// import React from 'react';
import { RiHome4Line } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { PiSpinnerBallBold } from "react-icons/pi";
import { MdOutlineStarBorder } from "react-icons/md";
import { GiPokerHand } from "react-icons/gi";
import { IoFlashOutline } from "react-icons/io5";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, useLocation } from 'react-router-dom';
// Images
import reward from "../../assets/images/home-images/reward.png";
import wickets from "../../assets/images/sport/9wickets.png";
import we from "../../assets/images/sport/we.png";
import pinnance from "../../assets/images/sport/pinnance.jpeg";
import saba from "../../assets/images/sport/saba.png";
import ug from "../../assets/images/sport/ug.png";
import bti from "../../assets/images/sport/bti.png";
import cmd from "../../assets/images/sport/cmd.png";
import sbo from "../../assets/images/sport/sbo.png";

import {
    Box,
    HStack,
    Center,
    Tabs,
    TabList,
    Tab,
    TabIndicator,
    TabPanels,
    TabPanel,
} from '@chakra-ui/react'
import SportCards from "../sport/SportCards";
import Sport9Wicket from "../sport/Sport9Wicket";
import SportWe from "../sport/SportWe";
import SportBti from "../sport/SportBti";
import SportCmd from "../sport/SportCmd";
import SportPinnacle from "../sport/SportPinnacle";
import SportSaba from "../sport/SportSaba";
import SportSbo from "../sport/SportSbo";
import SportUg from "../sport/SportUg";


function SportTabs() {
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
        borderRadius: '5px',
        fontWeight:"700",
        textTransform: 'uppercase',
        border:`2px solid ${bgGray} `,
    }
    return (
        <>
            {/* <div className="home-tabs-section all-tabs">
                <Box className="p-3" overflowX="scroll" css={{ "&::-webkit-scrollbar": { display: "none", }, }}>
                    <HStack spacing='15px' className="text-base font-bold">
                        <Box style={{ backgroundColor: bgGray, ...TabsStyle }} className="active p-3 home-tab rounded text-center" >
                            <Center className="flex-col" direction="column" alignItems="center" justifyContent="center" h="100%">

                                <Link to="/">{t(`All`)}</Link>
                            </Center>
                        </Box>
                        <Box style={{ backgroundColor: bgGray, ...TabsStyle }} className="p-3 home-tab rounded text-center" >
                            <Center className="flex-col" direction="column" alignItems="center" justifyContent="space-between" h="100%">
                                <img src={wickets} alt="9wickets" size={40} style={{ width: "40px" }} />
                                <Link to="/9wickets">{t(`wickets`)}</Link>
                            </Center>
                        </Box>
                        <Box style={{ backgroundColor: bgGray, ...TabsStyle }} className="p-3 home-tab rounded text-center" >
                            <Center className="flex-col" direction="column" alignItems="center" justifyContent="space-between" h="100%">
                                <img src={we} alt="we" size={40} style={{ width: "40px" }} />
                                <Link to="/we">{t(`we`)}</Link>
                            </Center>
                        </Box>
                        <Box style={{ backgroundColor: bgGray, ...TabsStyle }} className="p-3 home-tab rounded text-center" >
                            <Center className="flex-col" direction="column" alignItems="center" justifyContent="space-between" h="100%">
                                <img src={saba} alt="saba" size={40} style={{ width: "40px" }} />
                                <Link to="/saba">{t(`saba`)}</Link>
                            </Center>
                        </Box>
                        <Box style={{ backgroundColor: bgGray, ...TabsStyle }} className="p-3 home-tab rounded text-center" >
                            <Center className="flex-col" direction="column" alignItems="center" justifyContent="space-between" h="100%">
                                <img src={bti} alt="bti" size={40} style={{ width: "40px" }} />
                                <Link to="/bti">{t(`bti`)}</Link>
                            </Center>
                        </Box>
                        <Box style={{ backgroundColor: bgGray, ...TabsStyle }} className="p-3 home-tab rounded text-center" >
                            <Center className="flex-col" direction="column" alignItems="center" justifyContent="space-between" h="100%">
                                <img src={ug} alt="ug" size={40} style={{ width: "40px" }} />
                                <Link to="/ug">{t(`ug`)}</Link>
                            </Center>
                        </Box>
                        <Box style={{ backgroundColor: bgGray, ...TabsStyle }} className="p-3 home-tab rounded text-center" >
                            <Center className="flex-col" direction="column" alignItems="center" justifyContent="space-between" h="100%">
                                <img src={pinnance} alt="pinnance" size={40} style={{ width: "40px" }} />
                                <Link to="/pinnance">{t(`pinnance`)}</Link>
                            </Center>
                        </Box>
                    </HStack>
                </Box>
            </div> */}
        <Tabs className="home-tabs-section all-tabs all_pages_tabsWr" position='relative' variant='unstyled' px="10px">
            <TabList gap="10px">
                <Tab style={{ backgroundColor: bgGray, ...TabsStyle }}>
                    {t(`All`)}
                </Tab>
                <Tab style={{ backgroundColor: bgGray, ...TabsStyle }}>
                    <Center className="flex-col" direction="column" alignItems="center" justifyContent="space-between" h="100%">
                        <img src={wickets} alt="9wickets" size={40} style={{ width: "40px" }} />
                        {t(`wickets`)}
                    </Center>
                </Tab>
                <Tab style={{ backgroundColor: bgGray, ...TabsStyle }}>
                    <Center className="flex-col" direction="column" alignItems="center" justifyContent="space-between" h="100%">
                        <img src={we} alt="we" size={40} style={{ width: "40px" }} />
                        {t(`we`)}
                    </Center>
                </Tab>
                <Tab style={{ backgroundColor: bgGray, ...TabsStyle }}>
                    <Center className="flex-col" direction="column" alignItems="center" justifyContent="space-between" h="100%">
                        <img src={bti} alt="bti" size={40} style={{ width: "40px" }} />
                        {t(`bti`)}
                    </Center>
                </Tab>
                <Tab style={{ backgroundColor: bgGray, ...TabsStyle }}>
                    <Center className="flex-col" direction="column" alignItems="center" justifyContent="space-between" h="100%">
                        <img src={cmd} alt="cmd" size={40} style={{ width: "40px" }} />
                        {t(`cmd`)}
                    </Center>
                </Tab>
                <Tab style={{ backgroundColor: bgGray, ...TabsStyle }}>
                    <Center className="flex-col" direction="column" alignItems="center" justifyContent="space-between" h="100%">
                        <img src={pinnance} alt="pinnancle" size={40} style={{ width: "40px" }} />
                        {t(`pinnancle`)}
                    </Center>
                </Tab>
                <Tab style={{ backgroundColor: bgGray, ...TabsStyle }}>
                    <Center className="flex-col" direction="column" alignItems="center" justifyContent="space-between" h="100%">
                        <img src={saba} alt="saba" size={40} style={{ width: "40px" }} />
                        {t(`saba`)}
                    </Center>
                </Tab>
                <Tab style={{ backgroundColor: bgGray, ...TabsStyle }}>
                    <Center className="flex-col" direction="column" alignItems="center" justifyContent="space-between" h="100%">
                        <img src={sbo} alt="sbo" size={40} style={{ width: "40px" }} />
                        {t(`sbo`)}
                    </Center>
                </Tab>
                <Tab style={{ backgroundColor: bgGray, ...TabsStyle }}>
                    <Center className="flex-col" direction="column" alignItems="center" justifyContent="space-between" h="100%">
                        <img src={ug} alt="ug" size={40} style={{ width: "40px" }} />
                        {t(`ug`)}
                    </Center>
                </Tab>
            </TabList>
            <TabIndicator mt='-1.5px' height='2px' borderRadius='1px' />
            <TabPanels>
                <TabPanel>
                {/* <SportCards></SportCards> */}
                </TabPanel>
                <TabPanel>
                   <Sport9Wicket></Sport9Wicket>
                </TabPanel>
                <TabPanel>
                    <SportWe></SportWe>
                </TabPanel>
                <TabPanel>
                    <SportBti></SportBti>
                </TabPanel>
                <TabPanel>
                    <SportCmd></SportCmd>
                </TabPanel>
                <TabPanel>
                    <SportPinnacle></SportPinnacle>
                </TabPanel>
                <TabPanel>
                    <SportSaba></SportSaba>
                </TabPanel>
                <TabPanel>
                    <SportSbo></SportSbo>
                </TabPanel>
                <TabPanel>
                    <SportUg></SportUg>
                </TabPanel>
            </TabPanels>
        </Tabs >
        </>
    )
}


export default SportTabs
