import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Flex, Box ,useToast, Spinner} from '@chakra-ui/react';
import { BiSolidHide, BiSolidShow } from 'react-icons/bi';
import { changePassword } from '../../../APIServices/APIServices';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
} from '../../../redux/auth-redux/actions';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const {t} =useTranslation()
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate=useNavigate()
  const { bgColor1, bgGray, greenBtn, PrimaryText, whiteText } = useSelector(
    (state) => state.theme
  );
  const [loading,setLoading]=useState(false)
  const toast=useToast()
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: 'New Password and Confirm Password do not match',
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if(!oldPassword){
        toast({
          title: 'Enter old password !!',
          status: "warning",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      return 
    }
    setLoading(true)

    dispatch(loginRequest());
    try {
      const response = await changePassword(
        user?.data?.token,
        user?.data?.usernameToken,
        oldPassword,
        newPassword
      );
      dispatch(loginSuccess(response));
      if (response.message === 'Password updated successfully.') {
        toast({
          title: ` Password updated successfully!!!`,
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
    dispatch(logout());
    navigate('/');
      } else {
        
        toast({
          title: response.message || 'An error occurred while updating the password!!!',
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
       
      }
    setLoading(false)

    } catch (error) {
      console.error('Error updating password:', error);
      dispatch(loginFailure(error));
      toast({
        title: error.message || 'Error updating password!!!',
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    setLoading(false)
     
    }
  };

  const inputdiv = {
    fontSize: '1rem',
    fontWeight: 700,
    height: '50px',
    padding: '0 10px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flexWrap: 'wrap',
    minWidth: 0,
    width: '100%',
    marginBottom: '10px',
    '::placeholder': {
      color: '#000000de',
    },
    outlineColor: '#ffaa00',
  };

  return (
    <Flex flexDirection="column" style={{width:"100%"}}>
      <div className='w-[100%] mt-[70px] md:mt-5 my-3'  style={{width:"100%"}}>

        <Flex gap="10px" flexDirection="column" style={{ textAlign: 'left',width:"100%" }}>
          
          <div
            className="p-3 w-[100%] lg:w-[700px] px-[15px] rounded-[5px]"
            style={{backgroundColor:bgGray}}
          >
      <p className='text-center mt-2 font-bold md:hidden'> Change Password</p>

            <div className='flex flex-col mt-3 w-[100%]'>
              <div className='flex flex-col md:flex-row md:items-center md:gap-4 justify-between'>
                <p className='text-nowrap font-semibold'>
                  {t('oldPassword')}
                </p>
                  <div
                  className=' w-[100%] md:w-[70%] -mt-3 md:mt-0 relative text-end'
                   
                  >
                    <input
                      style={{ ...inputdiv, backgroundColor: bgColor1 }}
                      className="inputdiv rounded-full  mt-3  md:rounded text-black-700"
                      type={showOldPassword ? 'text' : 'password'}
                      placeholder={t('oldPassword')}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                    {showOldPassword ? (
                      <BiSolidShow
                        onClick={() => setShowOldPassword(false)}
                        className="absolute"
                        style={{
                          top: 'calc(50% - 9px)',
                          right: '15px',
                          cursor: 'pointer',
                        }}
                        size={24}
                      />
                    ) : (
                      <BiSolidHide
                        onClick={() => setShowOldPassword(true)}
                        className="absolute"
                        style={{
                          top: 'calc(50% - 9px)',
                          right: '15px',
                          cursor: 'pointer',
                        }}
                        size={24}
                      />
                    )}
                  </div>
              </div>
              <div className='flex flex-col md:flex-row md:items-center md:gap-4 justify-between'>

             <p className='text-nowrap font-semibold'>
                  {t('newPassword')}
                </p>
                <div
                                    className=' w-[100%] md:w-[70%] -mt-3 md:mt-0 relative text-end'

                   
                  >
                    <input
                      style={{ ...inputdiv, backgroundColor: bgColor1 }}
                      className="inputdiv rounded-full  mt-3  md:rounded text-black-700"

                      type={showNewPassword ? 'text' : 'password'}
                      placeholder={t('newPassword')}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    {showNewPassword ? (
                      <BiSolidShow
                        onClick={() => setShowNewPassword(false)}
                        className="absolute"
                        style={{
                          top: 'calc(50% - 9px)',
                          right: '15px',
                          cursor: 'pointer',
                        }}
                        size={24}
                      />
                    ) : (
                      <BiSolidHide
                        onClick={() => setShowNewPassword(true)}
                        className="absolute"
                        style={{
                          top: 'calc(50% - 9px)',
                          right: '15px',
                          cursor: 'pointer',
                        }}
                        size={24}
                      />
                    )}
                  </div>
              </div>
              <div className='flex flex-col md:flex-row md:items-center md:gap-4 justify-between'>              <p className='text-nowrap font-semibold'>
                  {t('confirmPassword')}
                </p>
                <div
                                    className=' w-[100%] md:w-[70%] -mt-3 md:mt-0 relative text-end'

                   
                  >
                    <input
                      style={{ ...inputdiv, backgroundColor: bgColor1 }}
                      className="inputdiv rounded-full  mt-3  md:rounded text-black-700"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder={t('confirmPassword')}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {showConfirmPassword ? (
                      <BiSolidShow
                        onClick={() => setShowConfirmPassword(false)}
                        className="absolute"
                        style={{
                          top: 'calc(50% - 9px)',
                          right: '15px',
                          cursor: 'pointer',
                        }}
                        size={24}
                      />
                    ) : (
                      <BiSolidHide
                        onClick={() => setShowConfirmPassword(true)}
                        className="absolute"
                        style={{
                          top: 'calc(50% - 9px)',
                          right: '15px',
                          cursor: 'pointer',
                        }}
                        size={24}
                      />
                    )}
                 
                </div>
              </div>
              <div className='w-[100%] flex items-end justify-end'>

              <div className='w-[100%] md:w-[70%] mt-2 md:mt-0 md:mr-1'>

<Button
  bg={{ base: greenBtn }}
  _hover={{ bg: { base: greenBtn } }}
  color={{ base: PrimaryText, xl: whiteText }}
  fontSize={{ base: '.9rem', xl: '16px' }}
  borderRadius={{ base: '25px', xl: '5px' }}
  minW={{ base: '100%', xl: '100%' }}
  height={{ base: '40px', xl: '50px' }}
  margin={{ base: '5px 0 5px', xl: '5px' }}
  flex="1"
  textShadow="0 2px 3px rgba(0, 0, 0, .3)"
  textTransform="uppercase"
  onClick={
    oldPassword &&
    newPassword &&
    confirmPassword &&
    handleChangePassword
  }
>
  {loading?<Spinner/>: (t('updatePassword'))}

</Button>
              </div>
              </div>

              
            </div>
          </div>
        </Flex>
      </div>
      {/* <ToastContainer /> */}
    </Flex>
  );
};

export default ChangePassword;
