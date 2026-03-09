import { Switch, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGetRequest, sendPatchRequest } from '../api/api';
import AddMoreSite from '../Modals/AddMoreSite';
import LoadingSpinner from '../component/loading/LoadingSpinner';
import { detailsOfSite } from '../redux/switch-web/action';
import { checkPermission } from '../../utils/utils';

const SiteManage = () => {
  const { t, i18n } = useTranslation();

  const {
    color,
    primaryBg,
    iconColor,
    secondaryBg,
    bg,
    hoverColor,
    hover,
    text,
    font,
    border,
  } = useSelector((state) => state.theme);

  const dispatch=useDispatch()

  const [loading,setLoading]=useState('')
  const [active,setActive]=useState('-1')
  const [siteData, setSiteData] = useState([]);
const [updateLoading,setUpdateLoading]=useState(false)
  const toast=useToast()
  const getSiteDetails = async () => {
    setLoading(true);
    let url = `${
        import.meta.env.VITE_API_URL
      }/api/site-switch/get-all-site-record`;
   
    try {
      let response = await fetchGetRequest(url);
      setSiteData(response?.data)
      dispatch(detailsOfSite(response?.data))
      setLoading(false);
    } catch (error) {
      toast({
        description: `${error?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      console.log(error);
      setLoading(false);
    }
  };
  
  useEffect(()=>{
    getSiteDetails()
  },[])


  // Function to handle input changes
  const handleChange = (index, key, value) => {
    const updatedFormData = [...siteData];
    updatedFormData[index][key] = value;
    setSiteData(updatedFormData);
  };

  // Function to handle update
  const handleUpdate = async(index,id) => {
    const payload=siteData[index]
    setActive(id)
          setUpdateLoading(true);
          try {
        
            const response = await sendPatchRequest(
              `${import.meta.env.VITE_API_URL}/api/site-switch/update-site-record/${id}`,payload);
            toast({
              title: `Updated Successfully `,
              status: "success",
              duration: 2000,
              isClosable: true,
            });
            setUpdateLoading(false);
            getSiteDetails(); 
          } catch (error) {
            setUpdateLoading(false);
        
            toast({
              title: error?.data?.message || error?.message,
              status: "error",
              duration: 2000,
              isClosable: true,
            });

       
    }


  };

  const handleToogleSite=async(e,status,id)=>{
    try {
        const response = await sendPatchRequest(
          `${import.meta.env.VITE_API_URL}/api/site-switch/toggle-is-active/${id}`);
        toast({
          title: status?`Deactivate Successfully`:"Activate Successfully",
          status:  status?"warning":"success",
          duration: 2000,
          isClosable: true,
        });
        // getSiteDetails(); 
        setTimeout(()=>{
            window.location.reload();
        },1000)

      } catch (error) {
    
        toast({
          title: error?.data?.message || error?.message,
          status: "error",
          duration: 2000,
          isClosable: true,
        });

   
}
  }


  const user = useSelector((state) => state.authReducer);

const adminData = user.user || {};
const isOwnerAdmin = adminData?.role_type === 'owneradmin';

const permissionDetails=user?.user?.permissions


let hasPermission=checkPermission(permissionDetails,"siteManage")
let check=!isOwnerAdmin?hasPermission:true

  return (
    <div className=" ">
      <p style={{color:iconColor}} className='font-bold text-2xl text-center'>{t(`Website`)} {t(`Manage`)}</p>

      <div className='flex justify-end pr-5 mt-8'>
    {check&&  <AddMoreSite getSiteDetails={getSiteDetails}/>}

      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-[100%] md:p-2 justify-between gap-4  mt-2">
        {siteData.map((item, index) => (
          <div style={{backgroundColor:bg}} key={index} className="p-6 w-[100%] text-white border-b flex flex-col gap-3 rounded-lg  ">
            <div className="flex flex-col  ">
              <span className=" font-semibold">Name:</span>
              <input
                type="text"
                style={{backgroundColor:bg}}
                className=" border rounded-md px-2 py-1 outline-none"
                value={item.name}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
              />
            </div>
            <div className="flex flex-col  ">
              <span className=" font-semibold">Age:</span>
              <input
                type="text"
                style={{backgroundColor:bg}}
                className=" border rounded-md px-2 py-1 outline-none"
                value={item.age}
                onChange={(e) => handleChange(index, 'age', e.target.value)}
              />
            </div>
            <div className="flex flex-col ">
              <span className="font-semibold">Site Name:</span>
              <input
                type="text"
                style={{backgroundColor:bg}}
                className=" border rounded-md px-2 py-1 outline-none"
                value={item.site_name}
                onChange={(e) => handleChange(index, 'site_name', e.target.value)}
              />
            </div>
            <div className="flex flex-col ">
              <span className="font-semibold">Site Auth Key:</span>
              <input
                type="text"
                style={{backgroundColor:bg}}
                disabled
                className=" border rounded-md px-2 py-1 outline-none"
                value={item.site_auth_key}
                onChange={(e) => handleChange(index, 'site_auth_key', e.target.value)}
              />
            </div>
            <div className="flex flex-col ">
              <span className="font-semibold">Company Key:</span>
              <input
                type="text"
                disabled
                style={{backgroundColor:bg}}
                className=" border rounded-md px-2 py-1 outline-none"
                value={item.company_key}
                onChange={(e) => handleChange(index, 'company_key', e.target.value)}
              />
            </div>
            <div className="flex flex-col ">
              <span className="font-semibold">Is Active:</span>
             <div className='flex justify-between p-1'>
             {check&&<Switch onChange={(e)=>handleToogleSite(e,item?.is_active,item._id)} colorScheme='green' isChecked={item?.is_active}/>}
<p className={` ${item?.is_active?"text-green-500":"text-red-500"} font-bold `}>{item?.is_active?"Active":"InActive"}</p>
                </div>

            </div>
           {check&& <button
            style={{backgroundColor:hoverColor}}
              className=" text-white font-bold py-2 px-4 rounded mt-2"
              onClick={() => handleUpdate(index,item._id)}
            >
              {updateLoading&&(item._id===active)?<LoadingSpinner size="sm" thickness={"3px"} color={"white"}/>:`${t(`Update`)}`}
            </button>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SiteManage;
