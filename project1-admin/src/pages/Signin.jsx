import React, { FormEvent, useEffect, useState } from "react";

import { useToast } from "@chakra-ui/react";
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

const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const toast = useToast();
  const naviagte = useNavigate();
  const [admiBlockStatus,setAdminBlockStatus]=useState(false)

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

        saveUserDetails("adminData",response.data)


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
          title: response.data.message,
          status: "error",
          duration: 2000,
          position: "top",
          isClosable: true,
        });

      }

      setLoading(false);
    } catch (error) {
      if(error?.response?.data?.message==="You have been blocked, contact admin." ){
        setAdminBlockStatus(true)

      }
      console.log(error, "error");
      toast({
        title: error?.response?.data?.message || error?.data?.message,
        status: "error",
        duration: 2000,
        position: "top",
        isClosable: true,
      });


      dispatch(loginFailure(error.message));
      setLoading(false);
    }
  };
  return (
    <div className="w-[100%]  flex  min-h-[100vh]">
      {/* Left side of the page */}
      <div className="w-[100%]   flex justify-center items-center sign-bg">
        {/* Right side of the page */}

        <div className=" flex flex-col items-center  justify-center">
          {/* Your right side content */}
          {/* <div>
          <h2 className="block text-center text-xl font-bold text-[10px] text-[#FDD10C]">
            Welcome!
          </h2>
          <p className="block text-center text-lg mb-4 font-medium text-[10px] text-[#FDD10C]">
            Company Name
          </p>
        </div> */}
          <form
            onSubmit={handleLogin}
            style={{ background: "rgba(6, 4, 8, 0.7)" }}
            className={`p-8    rounded-[20px]  opacity-7 shadow-lg w-80 sm:w-96 border border-gray-300`}
          >
            <div className="mt-5 flex flex-col gap-1">
              <label className="block font-medium text-[10px] text-[#FFF]">
                Username
              </label>
              <input
                style={{
                  background:
                    "linear-gradient(124deg, rgba(255, 255, 255, 0.00) -22.38%, rgba(255, 255, 255, 0.04) 70.38%)",
                }}
                type="text"
                className="w-full border border-[#FFF] p-3 rounded-[20px] text-xs text-gray-300 outline-none"
                placeholder="Your username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mt-5 flex relative flex-col gap-1">
              <label className="block font-medium text-[10px] text-[#FFF]">
                Password
              </label>
              <input
                style={{
                  background:
                    "linear-gradient(124deg, rgba(255, 255, 255, 0.00) -22.38%, rgba(255, 255, 255, 0.04) 70.38%)",
                }}
                type={showPassword?"text":"password"}
                className="w-full border border-[#FFF] p-3 rounded-[20px] text-xs text-gray-300 outline-none"
                placeholder="Your password"
                value={password}
                required
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="absolute top-6 right-0 mr-4 mt-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                {showPassword ? (
                  <IoEyeSharp
                    cursor={"pointer"}
                    fontSize="20px"
                    color="white"
                  />
                ) : (
                  <IoEyeOffSharp
                    cursor={"pointer"}
                    fontSize="20px"
                    color="white"
                  />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#FDD10C] font-bold  mt-10 mb-6  p-2 rounded-[12px] w-full hover:bg-yellow-500 duration-500 ease-in-out focus:outline-none"
            >
              {loading ? (
                <LoadingSpinner color="red" size="sm" thickness={"2px"} />
              ) : (
                "Login"
              )}
            </button>
          </form>
          {admiBlockStatus? <div className="mt-2">
          <p className="block  rounded-[8px] bg-red-600  p-2 text-center mt-6 px-5 font-bold text-[14px] text-white">
          Oops! Blocked by admin. Contact us now.
          </p>
         
        </div>:""}
        </div>
      </div>
    </div>
  );
};

export default Signin;
