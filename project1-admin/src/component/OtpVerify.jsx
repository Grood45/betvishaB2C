import React, { useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

const OtpVerify = ({setShowPassword}) => {
    const [otp,setOtp]=useState("")
const navigate=useNavigate()
    const handleVeify=(e)=>{
        e.preventDefault()
    setShowPassword(true)
      }
  return (
    <div>
    <div className="flex flex-col mt-[80px] items-start justify-start">
    <div onClick={()=>navigate("/login")} className="flex items-center justify-start pl-[-4px]  cursor-pointer">
        <IoIosArrowBack color="gray" fontSize={"18px"}/>
       <p className="text-sm font-light"> Back to Login</p>
    </div>
      <p className="font-semibold text-blue-950  mt-4 text-2xl">Verify code</p>
      <p className="font-thin mt-2 text-left w-[90%] md:w-[70%] text-xs ">
      An authentication code has been sent to your email.
      </p>
    </div>

    <form  onSubmit={handleVeify} className="w-[100%]   ">
      <div className="mt-8 w-[100%] ">
        {/* <p className="text-[16px] text-left font-semibold">Email</p> */}
        <div className="flex items-center border pl-2 mt-1  border-gray-300 rounded-[4px]">
          <input
            className="p-2 outline-none w-[90%] text-[13px] font-medium"
            placeholder="Enter your otp"
            value={otp}
            type="number"
            onChange={(e)=>setOtp(e.target.value)}
          />
        </div>
      </div>
      <p className="font-semibold text-sm text-left mt-3 ml-[2px]">Didn’t receive a code? <span className="cursor-pointer text-[#FF8682]">Resend</span> </p>
    
        <button  type="submit" className="w-[100%] rounded-[4px] mt-4 p-2 text-white text-sm bg-[#515DEF] hover:bg-blue-500 duration-700 ease-in-out">Verify</button>
    </form>
  

  </div>
  )
}

export default OtpVerify