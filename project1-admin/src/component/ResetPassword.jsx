import React, { useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { IoEyeOffSharp, IoEyeSharp } from 'react-icons/io5'
import { RiLockPasswordFill } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'

const ResetPassword = ({setShowPassword}) => {
    const [otp,setOtp]=useState("")
  const [eyeShow, setEyeShow] = useState(false);
  const [eyeShow1, setEyeShow1] = useState(false);
const navigate=useNavigate()


    const handleSetPassword=(e)=>{
        e.preventDefault()
        navigate("/login")
      }


  return (
    <div>
    <div className="flex flex-col mt-[80px] items-start justify-start">
    <div onClick={()=>navigate("/login")} className="flex items-center justify-start pl-[-4px]  cursor-pointer">
        <IoIosArrowBack color="gray" fontSize={"18px"}/>
       <p className="text-sm font-light"> Back to Login</p>
    </div>
      <p className="font-semibold text-blue-950  mt-4 text-2xl">Set a password</p>
      <p className="font-thin mt-2 text-left w-[90%] md:w-[70%] text-xs ">
      Your previous password has been reseted. Please set a new password for your account.
      </p>
    </div>

    <form  onSubmit={handleSetPassword} className="w-[100%]   ">
      <div className="mt-8 w-[100%] ">
        {/* <p className="text-[16px] text-left font-semibold">Email</p> */}
        <div className="flex items-center border px-2 mt-1  border-gray-300 rounded-[4px]">
                  <RiLockPasswordFill fontSize="20px" color="gray" />
                  <input
                    type={eyeShow ? "text" : "password"}
                    className="p-2 outline-none w-[90%]  text-[13px] font-medium"
                    placeholder="Create  new password "
                  />
                  {eyeShow ? (
                    <IoEyeSharp
                      cursor={"pointer"}
                      onClick={() => setEyeShow(false)}
                      fontSize="20px"
                      color="gray"
                    />
                  ) : (
                    <IoEyeOffSharp
                      cursor={"pointer"}
                      onClick={() => setEyeShow(true)}
                      fontSize="20px"
                      color="gray"
                    />
                  )}
                </div>

                <div className="flex items-center border px-2 mt-5  border-gray-300 rounded-[4px]">
                  <RiLockPasswordFill fontSize="20px" color="gray" />
                  <input
                    type={eyeShow1 ? "text" : "password"}
                    className="p-2 outline-none w-[90%]  text-[13px] font-medium"
                    placeholder="Re-enter new password "
                  />
                  {eyeShow1 ? (
                    <IoEyeSharp
                      cursor={"pointer"}
                      onClick={() => setEyeShow1(false)}
                      fontSize="20px"
                      color="gray"
                    />
                  ) : (
                    <IoEyeOffSharp
                      cursor={"pointer"}
                      onClick={() => setEyeShow1(true)}
                      fontSize="20px"
                      color="gray"
                    />
                  )}
                </div>
      </div>
    
        <button  type="submit" className="w-[100%] rounded-[4px] mt-5 p-2 text-white text-sm bg-[#515DEF] hover:bg-blue-500 duration-700 ease-in-out">Set Password</button>
    </form>
  

  </div>
  )
}

export default ResetPassword