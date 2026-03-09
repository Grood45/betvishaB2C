import bg from '../assets/2787870.png'
import bg1 from '../assets/6343845.png'
import bg3 from '../assets/bg3.png'
import login9 from '../assets/admin_bg_casino_sport.png'

import React, { FormEvent, useEffect, useState } from "react";

import { HStack, PinInput, PinInputField, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  loginFailure,
  loginRequest,
  loginSuccess,
} from "../redux/auth-redux/actions";
import { useDispatch } from "react-redux";
import { saveUserDetails } from "../redux/middleware/localstorageconfig";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import { IoEyeOffSharp, IoEyeSharp } from "react-icons/io5";

import { IoInformationCircle } from 'react-icons/io5'
import { Tooltip } from '@chakra-ui/react'
import { InfoIcon, SearchIcon } from '@chakra-ui/icons'


import account from '../assets/account.png'



const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const toast = useToast();
  const naviagte = useNavigate();
  const [admiBlockStatus, setAdminBlockStatus] = useState(false)
  const [email, setEmail] = useState('')
  const [scretCode, setScretCode] = useState('')
  const [admin, checkAdmin] = useState(false)
  const [qrCode, setQrcode] = useState("")
  const [verfifyLoading, setVerifyLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      username: username.trim(),
      password: password.trim(),
    };
    dispatch(loginRequest());
    setAdminBlockStatus(false)
    try {
      // const response = await axios.post("http://localhost:8094/api/admin/admin-login", payload);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/admin-login`,
        payload
      );
      if (response?.data?.status == 23) {

        if (response.data.success) {
          toast({
            title: response.data.message,
            status: "success",
            duration: 2000,
            position: "top",
            isClosable: true,

          });

          dispatch(loginSuccess(response.data));

          const admindetails = {
            token: response?.data?.token,
            usernametoken: response?.data?.usernameToken,
          };

          naviagte("/");
          saveUserDetails("adminauth", admindetails);

          saveUserDetails("adminData", response.data)


        } else if (!response.data.success && response.data.status === "401") {
          toast({
            title: response.payload.message,
            status: "warning",
            duration: 2000,
            position: "top",
            isClosable: true,
          });
        } else {

          toast({
            title: `${response?.data?.message}`,
            status: "error",
            duration: 2000,
            position: "top",
            isClosable: true,
          });

        }
      }
      else if (response?.data?.status == 22) {
        toast({
          title: "Please authenticate your self ! ",
          status: "success",
          duration: 2000,
          position: "top",
          isClosable: true,
        })
        QrSetup(response?.data?.email)
        setEmail(response?.data?.email)
        checkAdmin(true)


      }
      else {
        toast({
          title: response?.message || response?.data?.message,
          status: "error",
          duration: 2000,
          position: "top",
          isClosable: true,
        })
      }

      setLoading(false);
    } catch (error) {
      if (error?.response?.data?.message === "You have been blocked, contact admin.") {
        setAdminBlockStatus(true)

      }
      console.log(error, "error");
      toast({
        title: error?.response?.data?.message || error?.data?.message || error?.message,
        status: "error",
        duration: 2000,
        position: "top",
        isClosable: true,
      });


      dispatch(loginFailure(error.message));
      setLoading(false);
    }
  };


  const QrSetup = async (email) => {
    try {
      // const response = await axios.post("http://localhost:8094/api/admin/admin-login", payload);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/qr-setup`,
        {
          email: email
        }
      );
      setQrcode(response?.data?.qrCode)

    }
    catch (error) {
      toast({
        title: error?.response?.data?.message || error?.data?.message,
        status: "error",
        duration: 2000,
        position: "top",
        isClosable: true,
      });
    }
  }

  const handleQrVerify = async () => {
    setVerifyLoading(true)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/qr-verify`,
        {
          email: email,
          code: scretCode
        }
      );
      setVerifyLoading(false)
      toast({
        title: response?.data?.message,
        status: "success",
        duration: 2000,
        position: "top",
        isClosable: true,
      });
      dispatch(loginSuccess(response.data));

      const admindetails = {
        token: response?.data?.token,
        usernametoken: response?.data?.usernameToken,
      };

      naviagte("/");
      saveUserDetails("adminauth", admindetails);
      dispatch(loginSuccess(response.data));

      saveUserDetails("adminData", response.data)
    }
    catch (error) {
      dispatch(loginFailure(error.message));
      toast({
        title: error?.response?.data?.message || error?.data?.message,
        status: "error",
        duration: 2000,
        position: "top",
        isClosable: true,
      });
      setVerifyLoading(false)

    }
  }




  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: `url(${login9})` }}>
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-0"></div>

      <div className="relative z-10 w-[95%] sm:w-[500px] m-auto">
        <div className="p-8 sm:p-10 shadow-2xl rounded-2xl border border-yellow-600/30 bg-black/60 backdrop-blur-md relative overflow-hidden">

          {/* Decorative Glow */}
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-transparent via-yellow-500/10 to-transparent rotate-45 pointer-events-none"></div>

          {!admin && (
            <div className="text-center mb-8 relative z-10">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-yellow-500/10 border border-yellow-500/30 mb-4 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                <img src={account} className='w-[40px] h-[40px] drop-shadow-lg filter brightness-110' alt="Admin" />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Admin Portal</h2>
              <p className="text-gray-400 text-sm mt-2">Sign in to manage your platform</p>
            </div>
          )}

          {admin && (
            <div className="text-center mb-8 relative z-10">
              <h2 className="text-2xl font-bold text-white mb-2">2FA Verification</h2>
              <p className="text-gray-400 text-sm">Enter the code from your authenticator app</p>
            </div>
          )}


          {!admin && (
            <form onSubmit={handleLogin} className="space-y-6 relative z-10">
              <div>
                <label className="block text-xs font-medium text-yellow-500 mb-1 uppercase tracking-wider">Username</label>
                <div className="relative group">
                  <input
                    placeholder="Enter your username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-yellow-500 mb-1 uppercase tracking-wider">Password</label>
                <div className='relative group'>
                  <input
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    required
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-300 backdrop-blur-sm pr-10"
                  />
                  <button
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition-colors focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    {showPassword ? (
                      <IoEyeSharp fontSize="20px" />
                    ) : (
                      <IoEyeOffSharp fontSize="20px" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-600 rounded bg-white/10"
                  />
                  <label htmlFor="remember-me" className="ml-2 text-sm text-gray-300 select-none cursor-pointer hover:text-white transition-colors">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Tooltip placement='top' hasArrow label='Contact your upline for access recovery.' bg='gray.700' color='white'>
                    <span className="font-medium text-yellow-500 hover:text-yellow-400 cursor-pointer flex items-center gap-1 transition-colors">
                      Need Help?
                    </span>
                  </Tooltip>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-black bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <LoadingSpinner color="black" size="sm" thickness={"3px"} />
                  ) : (
                    "LOGIN TO DASHBOARD"
                  )}
                </button>
              </div>
            </form>
          )}

          {admin && (
            <div className="space-y-8 relative z-10">
              <div className="flex flex-col items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                <img src={qrCode} alt="2FA QR Code" className="w-48 h-48 rounded-lg shadow-lg" />
              </div>

              <div>
                <label className="block text-xs font-medium text-yellow-500 mb-3 text-center uppercase tracking-wider">Verification Code</label>
                <HStack spacing="2" justify="center">
                  <PinInput value={scretCode} onChange={setScretCode} focusBorderColor="#EAB308" placeholder="•">
                    {[...Array(6)].map((_, i) => (
                      <PinInputField
                        key={i}
                        color="white"
                        fontWeight="bold"
                        bg="white/5"
                        borderColor="white/10"
                        _hover={{ borderColor: 'white/30' }}
                        w={['40px', '50px']}
                        h={['40px', '50px']}
                      />
                    ))}
                  </PinInput>
                </HStack>
              </div>

              <div>
                <button
                  onClick={handleQrVerify}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-black bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {verfifyLoading ? (
                    <LoadingSpinner color="black" size="sm" thickness={"3px"} />
                  ) : (
                    "VERIFY & PROCEED"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Security Badge - Always Visible */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center relative z-10">
            <p className="text-gray-500 text-xs flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Secure 256-bit Encrypted Connection
            </p>
          </div>


          {admiBlockStatus && (
            <div className="mt-4 relative z-10 animate-shake">
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-center text-sm font-medium backdrop-blur-sm">
                Access Denied: Account Blocked
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Signup