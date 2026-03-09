import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, useLocation } from 'react-router-dom';
import { FaRegUser } from "react-icons/fa";
import { MdLock } from "react-icons/md";
import InfoAndPayment from "./InfoAndPayment";
import DepositTabs from "../component/All-Page-Tabs/DepositTabs";
import DobModel from "../modal/Dob";
import upi from "../assets/images/deposit/upi.svg";
import { FiAlertCircle } from "react-icons/fi";

import {
    Box,
    Flex,
    Button,
    Text,
    FormControl,
    FormLabel,
    OrderedList,
    Heading,
    ListItem,
    Center,
} from "@chakra-ui/react";
import Upi from "../component/deposit-component/Upi";
import Usdt from "../component/deposit-component/Usdt";
import DepositMobile from "../component/DepositMobile";


const Deposit = () => {
    const {
        bgColor1,
        bgGray,
        warning,
        greenBtn,
        PrimaryText,
        whiteText
    } = useSelector((state) => state.theme);

    const TabsStyle = {
        width: 'auto',
        borderRadius: '10px',
    }
    const { t, i18n } = useTranslation();
    const inputdiv = {
        fontSize: '1rem',
        fontWeight: 700,
        borderRadius: '5px',
        height: '50px',
        padding: '0 10px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        flexWrap: 'wrap',
        minWidth: 0,
        width: '100%',
        marginTop: '10px',
        marginBottom: '10px',
        '::placeholder': {
            color: '#000000de',
        },
        outlineColor: '#ffaa00',
    };
    const ListStyle = {
        lineHeight: "30px",
    }
    const listItems = [
        {
            title: "Important Notes",
            listContent: [
                "Deposits are subjected to a 1x wagering requirement.",
                "Please always deposit to the latest bank shown on this page. If you deposit money into an old bank account and cause any delayed or lost, we will not be responsible.",
            ],
        },
    ];
    return (
        <div style={{ backgroundColor: bgColor1 }} className="main_page mt-[20px] ml-2" >
            <Box>
                <Flex flexDirection={{base:"column", xl:"row"}}>
                    <InfoAndPayment />
                    <Box>
                    <DepositTabs />
                    <DepositMobile />
                </Box>
                </Flex>
            </Box>
        </div>
    );
};

export default Deposit;


