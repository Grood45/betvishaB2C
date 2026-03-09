import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import bank from "../../assets/images/deposit/bank.svg";


import {
    Box,
    HStack,
    Center,
} from '@chakra-ui/react'
import { FaUser } from "react-icons/fa6";


function BankTab() {
    const {
        bgGray,
        starBg,
    } = useSelector((state) => state.theme);
    const { t, i18n } = useTranslation();
    const singleUserDetail=useSelector((state)=>state.auth)
  
    return (
        <>
            <div className="home-tabs-section all-tabs">
                <Box paddingLeft={{base:"0",md:"12px"}} className=" m-0" overflowX="scroll"  css={{"&::-webkit-scrollbar": { display: "none", },}}>
                    <HStack spacing='15px' className="text-base font-bold">
                    <Box borderRadius={{base:"8px",md:"8px"}} width={{base:"88px",md:"110px"}} height={{base:"80px",md:"90px"}} style={{ backgroundColor: bgGray }} className="active home-tab rounded text-center" >
                        <Center  h="100%">
                      {!singleUserDetail?.singleUserData?.bank_verified? <Link  className="flex items-center justify-between flex-col" 
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        height="100%"
                        style={{height:"100%", padding:"10px 6px 6px"}}
                        >
                            <img src={bank} alt="" width="40px"/>
                        {/* <FaUser size={28} /> */}
                        {t(`Add Bank `)}
                        </Link>:<Link  className="flex items-center justify-between text-xs flex-col" 
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        height="100%"
                        style={{height:"100%", padding:"10px 6px 6px"}}
                        >
                            <img src={bank} alt="" width="40px"/>
                        {/* <FaUser size={28} /> */}
                        {t(singleUserDetail?.singleUserData?.bank_name.slice(0,19))}..
                        </Link>}
                        </Center>
                    </Box>
                   
                    </HStack>
                </Box>
            </div>
        </>
    )
}


export default BankTab