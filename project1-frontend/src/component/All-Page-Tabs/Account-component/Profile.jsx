import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Text,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { getSingleUser } from '../../../APIServices/APIServices';
import DobModel from '../../../modal/Dob';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { saveUserDetails } from '../../../redux/middleware/localstorageconfig';
import { singleUserDetails } from '../../../redux/auth-redux/actions';
import { useTranslation } from 'react-i18next';
import EmailVerification from './EmailVerification';
import MobileVerification from './MobileVerification';
import { MdVerified } from 'react-icons/md';

const Profile = () => {
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
      // toast({
      //   title: error.message || 'Error fetching user details',
      //   status: "warning",
      //   duration: 2000,
      //   isClosable: true,
      //   position: "top",
      // });
      console.log(error,"error")

     
      setLoading(false);
    }
  };

  if (loading) {
    return <div className='flex justify-center items-center h-[30vh]'> <Spinner /></div>;
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
    <div style={{ backgroundColor: bgColor1 }} className='mt-[80px] md:mt-5 my-3 w-[95%] md:w-[700px] m-auto'  >
      <Flex 
                  style={{width:"100%" }}
      
      >
        <Box width="100%">
          <div style={{ backgroundColor: bgColor1 }} className='w-[100%]'>
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
                    style={{backgroundColor:bgGray}}
                  >
      <p className='text-center mt-2 mb-4 font-bold md:hidden'> Profile</p>

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
                        <Text className='flex items-center'>{userDetails.username} <MdVerified style={{marginLeft:"10px",fontSize:"25px"}} color='#33DF72' /></Text>
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
                         { userDetails?.email_verified?<MdVerified style={{marginLeft:"10px",fontSize:"25px"}} color='#33DF72' />:<EmailVerification fetchUserDetails={fetchUserDetails} type="1"/>}
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
                        {/* { userDetails?.sms_verified?<MdVerified style={{marginLeft:"10px",fontSize:"25px"}} color='#33DF72' />:<MobileVerification type="1" />} */}

                        

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
  );
};

export default Profile;
