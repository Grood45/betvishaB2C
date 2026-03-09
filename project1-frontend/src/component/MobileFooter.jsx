import '../assets/css/style.css'
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Box, Text, UnorderedList, ListItem } from "@chakra-ui/react";
import { GoHomeFill } from "react-icons/go";
import { FaGift } from "react-icons/fa6";
import { IoWallet } from "react-icons/io5";;
import { BiSupport } from "react-icons/bi";
import { FaUser } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import LoginModal from '../modal/LoginModal';
import { useState } from 'react';
function MobileFooter() {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const settings = useSelector((state) => state?.auth?.settings); 
  const [showLoginModal,setShowLoginModal]=useState(false)
  const [showForgotModal, setShowForgotModal] = useState(false);

    const onCloseLoginModal = () => {
        setShowLoginModal(false);
      };
    const {
        bgGray,
    } = useSelector((state) => state.theme);

    const { t, i18n } = useTranslation();
    const  data  = useSelector((state) => state?.auth);

    const Style ={
        display:"flex", 
        justifyContent:"center", 
        alignItems:"center", 
        flexDirection:"column",
        gap:"5px"
    }
    const TextFont={
        fontSize:"14px"
    }
    const navigate=useNavigate()
    //For Active Menu
    const location = useLocation();
    const currentPath = location.pathname;
    const isActive = (path) => {
        return currentPath === path ? 'active' : '';
    };

   
    const userLoginCheck=!data?.user?.data?.token&&!data?.user?.data?.usernameToken
   
    return (
        <>
            <Box style={{background:bgGray, borderTop:'1px solid #fff', position:'fixed', bottom:'0', width:'100%'}}
                as="footer"
                zIndex="99"
                className="footer-tab-wrapper py-2"
                display={{ base: "block", xl: "none" }}
            >
                <UnorderedList listStyleType="none" p={0} m={0} display='flex' justifyContent="space-around">
                    <ListItem>
                        <Link style={Style} to="/" className={isActive('/')}>
                            <GoHomeFill size={28}/>
                            <Text style={{ fontSize:"14px !important"}}>{t(`Home`)}</Text>
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link style={Style} to="/Promotion" className={isActive('/Promotion')}>
                            <FaGift size={28}/>
                            <Text>{t(`Promotion`)}</Text>
                        </Link>
                    </ListItem>
                    
                    <ListItem>
                       {isLoggedIn? 
                       <Link style={Style} to="/Deposit" className={isActive('/Deposit')} >
                           <IoWallet size={28} />
              <Text>{t(`Deposit`)}</Text>

                        </Link>:

                            <LoginModal
          setShowLoginModal={setShowLoginModal}
          showLoginModal={showLoginModal}
          onCloseLoginModal={onCloseLoginModal}
          setShowForgotModal={setShowForgotModal}
          id="4"
        />
                       }
                     
                    </ListItem>
                    <ListItem>
                  
                        <Link style={Style}  to={settings?.whatsapp} target="_blank" >
                            <BiSupport size={28}/>
                            <Text>{t(`Support`)}</Text>
                        </Link >
                    </ListItem>
                    <ListItem>
                       {isLoggedIn? 
                       <Link style={Style} to="/Account" className={isActive('/Account')} >
                            <FaUser size={28}/>
              <Text  >{t(`Account`)}</Text>

                        </Link>:

                            <LoginModal
          setShowLoginModal={setShowLoginModal}
          showLoginModal={showLoginModal}
          onCloseLoginModal={onCloseLoginModal}
          setShowForgotModal={setShowForgotModal}
          id="3"
        />
                       }
                     
                    </ListItem>
                </UnorderedList>
            </Box>
        </>
    )
}


export default MobileFooter