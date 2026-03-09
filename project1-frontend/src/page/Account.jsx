import React from "react";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { FaRegUser } from "react-icons/fa";
import { MdLock } from "react-icons/md";
import InfoAndPayment from "./InfoAndPayment";
import AccountTabs from "../component/All-Page-Tabs/AccountTabs";
import DobModel from "../modal/Dob";
import {
    Box,
    Flex,
    Button,
    Text,
    FormControl,
    FormLabel,
    Input,
} from "@chakra-ui/react";

import {
    HStack,
    Center,
} from '@chakra-ui/react';
import InfoMobileHeader from "../component/InfoMobileHeader";

const Account = () => {
    const {
        bgColor1,
        bgGray,
    } = useSelector((state) => state.theme);

    const TabsStyle = {
        width: 'auto',
        borderRadius: '10px',
    }
    return (
        <Box ml={{base:"8px"}}  style={{ backgroundColor: bgColor1 }} className="main_page" paddingTop="155px" px="10x">
            <Box>
                <Flex flexDirection={{base:"column", xl:"row"}}>
                    <InfoAndPayment />
                    <InfoMobileHeader></InfoMobileHeader>
                    <Box >
                    <AccountTabs />
                    </Box>
                </Flex>
            </Box>
        </Box>
    );
};

export default Account;


