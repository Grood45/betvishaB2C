import React from "react";
import { useSelector } from "react-redux";
import { useState } from 'react'
import { Box } from "@chakra-ui/react";
import HomeTabs from "../component/HomeTabs";
import SportCards from "../component/sport/SportCards";
import { MdOutlineSearch } from "react-icons/md";
import { Flex, Text, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import SportTabs from "../component/All-Page-Tabs/SportTabs";
import MobileHeader from "../component/MobileHeader";
import Carousel from "../component/Carousel";
import ambassador from '../assets/images/footer/ambassador.png';

const Demo = () => {
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

  return (
    <Box className="main_page">
       <Box  className="slider_wrap" display={{base:"block", xl:"none"}}>
      <Carousel></Carousel>
      </Box>
      <Flex style={{ backgroundColor: bgGray,}} className="game-toolbar-wrapper rounded" 
      align="center" justify="space-between" 
      p="5px 5px 5px 15px" h="60px" 
      mb="15px" mt="10px" mx="10px"
      display={{base:"none", xl:"flex"}}
      >
        <Flex className="tags-wrapper">
          <ul className="tags-list">
            <li className="active font-bold" style={{color:secondaryText}}>
              All
            </li>
          </ul>
        </Flex>
        <Flex className="search-wrapper">
          <InputGroup className="custom-input-wrapper search-input" h= '50px' w="266px">
            <InputLeftElement h="100%"
              pointerEvents="none"
              children={<MdOutlineSearch size={28} />}
            />
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery} style={{ backgroundColor: bgColor1,}} h="100%"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Flex>
      </Flex>
      <Box className="tabs_wrap" display={{base:"none", xl:"block"}}>
      <SportTabs></SportTabs>
      </Box>
      <MobileHeader></MobileHeader>
      <SportCards></SportCards>
      <Box display={{ base: "block", xl: "none" }}>
      <img src={ambassador} alt="ambassador" style={{margin:'0 auto'}} />
      </Box>
    </Box>
  );
};

export default Demo;
