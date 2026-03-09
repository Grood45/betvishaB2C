import React from "react";
import { useSelector } from "react-redux";
import { useState } from 'react'
import { Box } from "@chakra-ui/react";
import { MdOutlineSearch } from "react-icons/md";
import { Flex, Text, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import PromotionCards from "../component/All-Cards/PromotionCards";
import { useTranslation } from "react-i18next";

const Promotion = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const {t} =useTranslation()
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
      {/* <Carousel></Carousel> */}
      <Flex style={{ backgroundColor: bgGray, }} className="game-toolbar-wrapper py-1 px-2 rounded-lg w-[96%] m-auto" align="center" justify="space-between"   mb="15px" mt="10px" >
        <div className="tags-wrapper overflow-scroll hide-scroll">
          <ul className="tags-list flex gap-8 overflow-scroll">
            <li className="active bg-[#ffaa00] rounded-[8px]  text-black w-[50px] text-center py-2 font-bold text-nowrap" >
              {t(`All`)}
            </li>
            {/* <li className="font-bold text-nowrap" >
              Jackpot
            </li>
            <li className="font-bold text-nowrap" >
              Top Games
            </li>
            <li className="font-bold text-nowrap" >
              New
            </li>
            <li className="font-bold text-nowrap" >
              Play FOr Fun
            </li>
            <li className="font-bold text-nowrap" >
              Featured
            </li> */}
          </ul>
        </div>
        <div className="search-wrapper hidden md:contents">
          <InputGroup className="custom-input-wrapper  search-input" h='50px' w="266px">
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
        </div>
      </Flex>
      <PromotionCards></PromotionCards>
    </Box>
  );
};

export default Promotion;
