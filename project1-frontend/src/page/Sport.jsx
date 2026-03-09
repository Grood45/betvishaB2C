import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Box } from "@chakra-ui/react";
import HomeTabs from "../component/HomeTabs";
import SportCards from "../component/sport/SportCards";
import { MdOutlineSearch } from "react-icons/md";
import { Flex, Text, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import SportTabs from "../component/All-Page-Tabs/SportTabs";
import MobileHeader from "../component/MobileHeader";
import Carousel from "../component/Carousel";
import ambassador from '../assets/images/footer/ambassador.png';
import { useTranslation } from "react-i18next";

const Sport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const {
    bgColor1,
    bgGray,
    bgYellow,
    PrimaryText,
    secondaryText,
    hoverColor,
    ClickActiveColor,
  } = useSelector((state) => state.theme);
  const [activeProviders, setActiveProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("all");

  const fetchActiveProviders = async () => {
    try {
      let url = `${import.meta.env.VITE_API_URL}/api/sport/active-providers`;
      const res = await axios.get(url);
      if (res?.data?.success) {
        setActiveProviders(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch active providers", error);
    }
  };

  useEffect(() => {
    fetchActiveProviders();
  }, []);

  const { t } = useTranslation()

  return (
    <Box className="main_page">
      <Box className="slider_wrap" display={{ base: "block", xl: "none" }}>
        <Carousel></Carousel>
      </Box>
      <Flex style={{ backgroundColor: bgGray, }} className="game-toolbar-wrapper rounded"
        align="center" justify="space-between"
        p="5px 5px 5px 15px" h="60px"
        mb="15px" mt="10px" mx="10px"
        display={{ base: "none", xl: "flex" }}
      >
        <Flex className="tags-wrapper">
          <ul className="tags-list" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <li
              className={`font-bold cursor-pointer ${selectedProvider === 'all' ? 'active' : ''}`}
              style={{ color: selectedProvider === 'all' ? ClickActiveColor : secondaryText, padding: '5px 10px' }}
              onClick={() => setSelectedProvider("all")}
            >
              {t(`All`)}
            </li>
            {activeProviders.map((provider) => (
              provider.provider_logo && (
                <li
                  key={provider._id}
                  className="cursor-pointer"
                  onClick={() => setSelectedProvider(provider.provider_name)}
                  style={{ opacity: selectedProvider === provider.provider_name ? 1 : 0.6 }}
                >
                  <img
                    src={provider.provider_logo}
                    alt={provider.provider_name}
                    className="h-[30px] w-auto object-contain rounded"
                  />
                </li>
              )
            ))}
          </ul>
        </Flex>
        <Flex className="search-wrapper">
          <InputGroup className="custom-input-wrapper search-input" h='50px' w="266px">
            <InputLeftElement h="100%"
              pointerEvents="none"
              children={<MdOutlineSearch size={28} />}
            />
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery} style={{ backgroundColor: bgColor1, }} h="100%"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Flex>
      </Flex>
      {/* <Box className="tabs_wrap" display={{ base: "none", xl: "block" }}>
        <SportTabs></SportTabs>
      </Box> */}
      <MobileHeader></MobileHeader>
      <SportCards activeProviders={activeProviders} selectedProvider={selectedProvider} searchQuery={searchQuery} />
      {/* <Box display={{ base: "block", xl: "none" }}>
        <img src={ambassador} alt="ambassador" style={{ margin: '0 auto' }} />
      </Box> */}
    </Box>
  );
};

export default Sport;
