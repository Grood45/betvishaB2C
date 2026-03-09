import React, { useEffect, useState } from 'react'
import { AiOutlineHistory, AiOutlineShareAlt, AiOutlineTransaction } from 'react-icons/ai';
import { BiMoneyWithdraw } from 'react-icons/bi';
import { RiLuggageDepositLine } from 'react-icons/ri';
import { CgProfile } from "react-icons/cg";
import { Avatar, Badge, Switch, useToast } from '@chakra-ui/react';
import AddBalance from '../component/usermanageComponent/AddBalance';
import SubtractBalance from '../component/usermanageComponent/SubtractBalance';
import SendMail from '../component/usermanageComponent/SendMail';
import logo from '../assets/logo.png'
import Profile from '../component/usermanageComponent/Profile';
import Deposit from '../component/usermanageComponent/Deposit';
import WithDrawl from '../component/usermanageComponent/WithDrawl';
import Transaction from '../component/usermanageComponent/Transaction';
import BetHistory from '../component/usermanageComponent/BetHistory';
import { useSelector } from 'react-redux';
import { MdOutlineAccountBalanceWallet } from 'react-icons/md';
import { FaUser, FaUserCheck } from 'react-icons/fa6';
import AllUser from '../component/usermanageComponent/AllUser';
import AllAdmin from '../component/usermanageComponent/AllAdmin';
import { fetchGetRequest, sendPatchRequest } from '../api/api';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../../utils/utils';
import SingleLoginHistory from '../component/usermanageComponent/SingleLoginHistory';
const SingleAdminManage = () => {
  const { color,primaryBg,iconColor,secondaryBg, bg,hoverColor,hover,text, font, border } = useSelector(state => state.theme);
  const { t, i18n } = useTranslation();

    const data = [
        {
          id: 1,
          title: "Profile",
          icon: <CgProfile />,
        },
        {
          id: 2,
          title: "Deposit",
          icon: <RiLuggageDepositLine />,
        },
        {
          id: 3,
          title: "Withdraw",
          icon: <BiMoneyWithdraw />,
        },
        {
          id: 4,
          title: "Transaction",
          icon: <AiOutlineTransaction />,
        },
        {
            id:8,
            title:"All User",
            icon:<FaUser/>
            
        },
        // {
        //     id:9,
        //     title:"All Admin",
        //     icon:<FaUserCheck/>
            
        // },
        {
          id:10,
          title:"Login History",
          icon:<FaUserCheck/>
          
      },
        // {
        //   id: 5,
        //   title: "Referrals",
        //   icon: <AiOutlineShareAlt />,
        // },
        // {
        //   id: 6,
        //   title: "Profit & Loss",
        //   icon: <MdOutlineAccountBalanceWallet />,
        // },
        
      ];
    

      const [active, setActive] = useState(1);
      const [userData, setUserData] = useState();
      const [plData, setPlData] = useState({});
      const param = useParams();
      const [loading, setLoading] = useState(false);
      const [loading1, setLoading1] = useState(false);
    const toast=useToast()
      const [statusLoading, setStatusLoading] = useState(false);
      
      
        const getUserData = async () => {
          setLoading(true);
          let url = `${import.meta.env.VITE_API_URL}/api/admin/get-single-admin/${param.id}`;
          try {
            let response = await fetchGetRequest(url);
            const data = response.data;
      
            setLoading(false);
            const receivedData = response.data;
            if (receivedData) {
              setUserData(receivedData);
            }
          } catch (error) {
            setLoading(false);
            toast({
              description: `${error?.data?.message||error?.message}`,
              status: "error",
              duration: 4000,
              position: "top",
              isClosable: true,
            });
            console.log(error);
          }
        };
      
      
      
        const profitLossData = async () => {
          if(!userData){
            return
          }
           setLoading1(true);
          let url = `${import.meta.env.VITE_API_URL}/api/transaction/get-transaction-pl/${userData?.admin_id}?username=${userData?.username}&type=admin`;
      
          try {
            let response = await fetchGetRequest(url);
            setLoading1(false);
            if (response) {
              setPlData(response);
            }
          } catch (error) {
            setLoading1(false);
            toast({
              description: `${error?.data?.message|| error?.message}`,
              status: "error",
              duration: 4000,
              position: "top",
              isClosable: true,
            });
            console.log(error);
          }
        };
      
        useEffect(() => {
          getUserData(param.id);
        }, [param.id]);    
        useEffect(()=>{
          profitLossData();
        },[userData])
      
        const handleActive = (id) => {
          setActive(id);
        };
      
      const handleStatusChange = async (name) => {
        setStatusLoading(true);
        let url = `${
          import.meta.env.VITE_API_URL
        }/api/admin/toggle-admin-status/${param.id}`;
    
        try {
          let response = await sendPatchRequest(url, { name });
          const data = response.data;
          getUserData();
    
          toast({
            description: `${response.message}`,
            status: "success",
            duration: 4000,
            position: "top",
            isClosable: true,
          });
        } catch (error) {
          toast({
            description: error?.data?.message || error?.message,
            status: "error",
            duration: 4000,
            position: "top",
            isClosable: true,
          });
          console.log(error);
          setStatusLoading(false);
        }
      };

     
    
  return (
    <div className="flex flex-col md:flex-row justify-between mt-4 gap-4 w-[98%] m-auto  ">
          <div className=" w-[100%] md:w-[22%]">
        <div className="flex flex-col-reverse  md:flex-col gap-6">
          {/* first box */}
          <div
            style={{border:`1px solid ${border}`}}
            className="  w-[100%] bg-white  p-4  pb-8 rounded-[12px] "
          >
            <div className="flex flex-row overflow-scroll md:flex-col  mt-2">
              {data.map((item) => {
                return (
                  <div
                  style={{backgroundColor:item.id==active?bg:''}}
                    key={item.id}
                    onClick={() => handleActive(item.id)}
                    className={`flex cursor-pointer  items-center font-semibold   w-[130px] md:w-[100%] px-4 md:px-0 gap-3 md:p-[6px] text-xs ${
                      item.id == active ? `${bg} text-white` : "text-black"
                    }  rounded-lg`}
                  >
                    <span
                     style={{backgroundColor:item.id==active?bg:''}}
                      className={`rounded-[30%] p-2 ${
                        item.id == active ? "" : bg
                      }  ${
                        item.id == active ? "text-white" : ""
                      }  `}
                    >
                      {item.icon}
                    </span>
                    <p>{t(item.title)}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* second box */}

          {/* <div
            style={{border:`1px solid ${border}`}}
            
            className="  w-[100%]  bg-white    p-4 pb-8 rounded-[12px] "
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1 gap-2 mt-2">
              <div
                className={`flex justify-between cursor-pointer items-center gap-3 p-[6px] text-xs rounded-2xl`}
              >
                <p className='font-semibold'>{t(`Bet`)} {t(`Suported`)}</p>
                <Switch
                  colorScheme="green"
                  name="bet_supported"
                  isChecked={userData?.bet_supported == true ? false : true}
                  onChange={() => handleStatusChange("bet_supported")}
                />
              </div>

              <div
                className={`flex justify-between cursor-pointer items-center gap-3 p-[6px] text-xs rounded-2xl`}
              >
                <p className='font-semibold'>{t(`Status`)}</p>
                <Switch
                  colorScheme="green"
                  name="status"
                  isChecked={userData?.status == false ? true : false}
                  onChange={() => handleStatusChange("status")}
                />
              </div>

              <div
                className={`flex justify-between cursor-pointer items-center gap-3 p-[6px] text-xs rounded-2xl`}
              >
                <p className='font-semibold'>{t(`Block`)} {t(`A/C`)}</p>
                <Switch
                  colorScheme="green"
                  name="is_active"
                  isChecked={userData?.is_active == true ? false : true}
                  // defaultValue={"checked"}
                  onChange={() => handleStatusChange("is_active")}
                />
              </div>

              <div
                className={`flex justify-between cursor-pointer items-center gap-3 p-[6px] text-xs rounded-2xl`}
              >
                <p className='font-semibold'>{t(`Email Verification`)}</p>
                <Switch
                  name="email_verified"
                  colorScheme="green"
                  defaultChecked={userData?.email_verified==true?true:false}
                  onChange={() => handleStatusChange("email_verified")}
                />
              </div>

              <div
                className={`flex justify-between cursor-pointer items-center gap-3 p-[6px] text-xs rounded-2xl`}
              >
                <p className='font-semibold'>{t(`SMS Verification`)}</p>
                <Switch
                  name="sms_verified"
                  colorScheme="green"
                  isChecked={userData?.sms_verified == true ? true : false}
                  onChange={() => handleStatusChange("sms_verified")}
                />
              </div>

              <div
                className={`flex justify-between cursor-pointer items-center gap-3 p-[6px] text-xs rounded-2xl`}
              >
                <p className='font-semibold'>{t(`KYC Verification`)}</p>
                <Switch
                  name="kyc_verified"
                  colorScheme="green"
                  isChecked={userData?.kyc_verified == true ? true : false}
                  onChange={() => handleStatusChange("kyc_verified")}
                />
              </div>
            </div>
          </div> */}

          {/* third box */}

          <div
            style={{border:`1px solid ${border}`}}
           
            className="  w-[100%] flex flex-col gap-4  bg-white   p-4 pb-8 rounded-[12px] "
          >
            <p className="text-xs font-medium">{t(`User`)} {t(`Action`)}</p>
            <div className="grid w-[100%] grid-cols-2 md:grid-cols-1 gap-3">
              <AddBalance userData={userData} getData={getUserData} title="admin"/>
            <SubtractBalance userData={userData} getData={getUserData} title="admin"/>
            <SendMail/>

           
            </div>
          </div>
        </div>
      </div>

      <div className="w-[95%]  md:w-[90%] mx-auto">
        <div className="w-[100%] flex  bg-[white] rounded-[10px]   justify-between items-center p-1 md:p-3   ">
          <div className="flex w-[100%] items-center gap-2">
            <div>
            <Avatar
                      name="Dan Abrahmov"
                      src="https://bit.ly/dan-abramov"
                    />
            <p 
             style={{backgroundColor:bg}}
            className={`px-2 py-1 mt-1 text-xs rounded-[4px] -ml-2  text-white`}>{t(userData?.role_type)}</p>
            
            </div>
            
            <div className="flex flex-col">
              <p className=" text-xs  md:text-sm font-semibold">
              {userData?.username}
              </p>
              <p className='text-[10px] font-medium'>{t(`Created`)} {t(`By`)} <span className='font-bold'>{userData?.parent_admin_username}</span></p>
            </div>
          </div>
         
          <div className="flex w-[100%] justify-center items-center flex-col gap-1">
          {/* <p style={{color:iconColor}} className={` text-[12px]  md:text-xl font-semibold `}>{t(`Total`)} {t(`Balance`)} :

           {userData?.amount?.toFixed(2)}
           </p> */}

            {/* <p className=" text-[10px] md:text-xs font-semibold  ">
              {t(`Profit`)} / {t(`Loss`)} :{" "}
              <span className={`text-xs ${plData?.totalAmount>0?"text-green-400":"text-red-400"} text-green-400 text-[10px] md:text-xs`}>
                {" "}
                {plData?.totalAmount?.toFixed(2)}
              </span>
            </p> */}
            {/* <p className='text-sm font-bold mt-1'>{t(`Currency`)}: <Badge colorScheme='green' style={{fontSize:'10px'}} className='font-bold rounded-sm px-2'>{userData?.currency}</Badge></p> */}

          </div>
          

          <div className="flex w-[100%] flex-col justify-between items-center gap-2">
            <button className=" flex items-center gap-1 p-1 md:p-[6px]  px-4 text-xs text-white font-semibold bg-[#01B574] rounded-md">
              {t(`Onilne`)}
            </button>

            <div className="flex flex-col items-center justify-center font-medium text-[10px]">
            <p>{formatDate(userData?.joined_at.split(" ")[0])}</p>
            </div>
          </div>
        </div>
        {active === 1 && userData && <Profile type={"admin"}  userData={userData} />}
         {active === 2 && <Deposit id={userData?.admin_id} />}
        {active === 3 && <WithDrawl id={userData?.admin_id} />}
        {active === 4 && <Transaction id={userData?.admin_id} />}
        {/* {active === 5 && <Referral />} */}
        {active === 7 && <BetHistory userData={userData} type="admin"/>} 
        {active===8&&<AllUser userData={userData} />}
        {active===9&&<AllAdmin userData={userData} />}
        {active===10&&<SingleLoginHistory userData={userData}  role="alladmin"/>}


      </div>

        </div>
  )
}

export default SingleAdminManage