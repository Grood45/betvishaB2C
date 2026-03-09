import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    Text,
  } from '@chakra-ui/react'
  import {Link} from "react-router-dom"
import { CgProfile } from 'react-icons/cg';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { getSingleUser } from '../APIServices/APIServices';
import DobModel from '../modal/Dob';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { saveUserDetails } from '../redux/middleware/localstorageconfig';
import { singleUserDetails } from '../redux/auth-redux/actions';
import { useTranslation } from 'react-i18next';

    function ProfileModal() {
    
        const { isOpen, onOpen, onClose } = useDisclosure()
        const { bgColor1, bgGray } = useSelector((state) => state.theme);
        const { data } = useSelector((state) => state.auth.user);
        const [userDetails, setUserDetails] = useState(null);
        const dispatch=useDispatch()
        const [loading, setLoading] = useState(true);
      const toast=useToast()
      const {t} =useTranslation()
        useEffect(() => {
          fetchUserDetails();
        }, [data?.token, data?.usernameToken]);
      
        const fetchUserDetails = async () => {
          try {
            const response = await getSingleUser(
              data?.token,
              data?.usernameToken,
              import.meta.env.VITE_API_SITE_AUTH_KEY 
            );
      
            if (response.message === 'User data retrived successfully.') {
              setUserDetails(response?.data);
         dispatch(singleUserDetails(response?.data))
      
              setLoading(false);
            }
          } catch (error) {
            toast({
              title: error.message || 'Error fetching user details',
              status: "warning",
              duration: 2000,
              isClosable: true,
              position: "top",
            });
           
            setLoading(false);
          }
        };
      
        if (loading) {
          return <Spinner />;
        }
      
        if (!userDetails) {
          return <Text>No user details found</Text>;
        }
      
        const handleUpdateDob = (dob) => {
          setUserDetails((prevDetails) => ({
            ...prevDetails,
            birthday: dob,
          }));
        };
        return (
          <>
            {/* <Button >Open Modal</Button> */}
            <Button onClick={onOpen}  gap="15px" height="auto" fontSize="14px"  minW={{ base: "100%", xl: "100%" }} bg="transparent" _hover={{ bg: 'transparent', }} justifyContent="center">
          <Link  className={` `}
            style={{ display: "flex", gap: "15px", backgroundColor: bgGray }}
          >
            <CgProfile size={28} />
            <p className='text-black ' style={{color:"black"}}>{t(`Profile`)}</p>
          </Link>
        </Button>
        
            <Modal size={"full"} isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
              <ModalHeader style={{textAlign:"center",fontSize:"16px"}}>{t(`Profile`)}</ModalHeader>
          <ModalCloseButton />

              <div className=' my-3  -mt-3 w-[95%] m-auto'  >
      <Flex 
                  style={{width:"100%" }}
      
      >
        <Box width="100%">
          <div  className='w-[100%]'>
            <Flex flexDirection="column" 
                  style={{ textAlign: 'left',width:"100%" }}
            
            >
              <Box width="100%">
                <Flex
                  gap="10px"
                  flexDirection="column"
                  style={{ textAlign: 'left',width:"100%" }}
                >
                  <div

                    className="p-3 w-full px-[15px]   rounded-[5px] "
                  >

                    <Box display="flex" flexDirection="column" gap="10px">
                      <FormControl
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                      >
                        <FormLabel width="130px" fontWeight="700" mb="0">
                          {t(`Full Name`)}
                        </FormLabel>
                        <Text>{userDetails.first_name}</Text>
                      </FormControl>
                      <FormControl
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                      >
                        <FormLabel width="130px" fontWeight="700" mb="0">
                          {t(`Username`)}
                        </FormLabel>
                        <Text>{userDetails.username}</Text>
                      </FormControl>
                      <FormControl
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                      >
                        <FormLabel width="130px" fontWeight="700" mb="0">
                          {t(`Email`)}
                        </FormLabel>
                        <Text>{userDetails.email}</Text>
                      </FormControl>
                      <FormControl
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                      >
                        <FormLabel width="130px" fontWeight="700" mb="0">
                          {t(`Mobile`)}
                        </FormLabel>
                        <Text>{userDetails.phone}</Text>
                      </FormControl>
                      <FormControl
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                      >
                        <FormLabel width="130px" fontWeight="700" mb="0">
                          {t(`D.O.B`)}
                        </FormLabel>
                        <Text>
                          {userDetails.birthday ? (
                            userDetails.birthday
                          ) : (
                            <DobModel
                              dateOfBirth={userDetails.birthday}
                              onUpdate={handleUpdateDob}
                            />
                          )}
                        </Text>
                      </FormControl>
                    </Box>
                  </div>
                </Flex>
              </Box>
            </Flex>
          </div>
        </Box>
      </Flex>
      {/* <ToastContainer /> */}
    </div>
              </ModalContent>
            </Modal>
          </>
        )
      }

      export default ProfileModal