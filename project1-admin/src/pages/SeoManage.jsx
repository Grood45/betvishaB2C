import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import AddSeoCard from '../Modals/AddSeoCard';
import { fetchGetRequest, sendDeleteRequest, sendPatchRequest } from '../api/api';
import { useToast } from '@chakra-ui/react';
import LoadingSpinner from '../component/loading/LoadingSpinner';
import { MdDelete } from 'react-icons/md';
import { checkPermission } from '../../utils/utils';

const SeoManage = () => {
 
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
  const { t, i18n } = useTranslation();
const [loading,setLoading]=useState(false)
const [seoData,setSeoData]=useState([])
const [updateLoading,setUpdateLoading]=useState(false)
const [active,setActive]=useState('')
const [currentPage, setCurrentPage] = useState(1);
const [pagination, setPagination] = useState({});
const [limit,setLimit]=useState(20)
const totalPages = pagination.totalPages;
const toast=useToast()
  const getAllSeoData = async () => {
    setLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/seo/get-all-seo?limit=${limit}&page=${currentPage}`;
    try {
      let response = await fetchGetRequest(url);
      const data = response.data;
      const receivedData = response.data;
      setSeoData(receivedData);
      setPagination(response.pagination);
    

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

  useEffect(() => {
    
    getAllSeoData();

  
  }, [limit,currentPage]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const newCategories = [...seoData];
    newCategories[index][name] = value;
    setSeoData(newCategories);
  };

  const handleUpdateSeo = async(category) => {
    setActive(category._id)

    const foundCategory = seoData?.find(item => item._id === category._id);
    if (foundCategory) {
          setUpdateLoading(true);
          try {
        
            const response = await sendPatchRequest(
              `${import.meta.env.VITE_API_URL}/api/seo/update-single-seo/${category._id}`,foundCategory);
            toast({
              title: `Updated Successfully `,
              status: "success",
              duration: 2000,
              isClosable: true,
            });
            setUpdateLoading(false);
            getAllSeoData(); 
          } catch (error) {
            setUpdateLoading(false);
        
            toast({
              title: error?.data?.message || error?.message,
              status: "error",
              duration: 2000,
              isClosable: true,
            });
          }
      

    } else {
      toast({
        title: 'Category not found in seoData',
        status: "error",
        duration: 2000,
        isClosable: true,
      });
       
    }
}

const handleDeleteSeo=async(id)=>{
    try {
    const url = `${import.meta.env.VITE_API_URL}/api/seo/delete-single-seo/${id}`;
      let response = await sendDeleteRequest(url);
      toast({
        description: response.message,
        status: "warning",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      getAllSeoData()
    } catch (error) {
      console.log(error, "error sf");
      toast({
        description: `${error?.data?.message || error?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });

    }
}


const handlePrevPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};

const handleNextPage = () => {
  if (currentPage < totalPages) {
    setCurrentPage(currentPage + 1);
  }
};

const user = useSelector((state) => state.authReducer);

const adminData = user.user || {};
const isOwnerAdmin = adminData?.role_type === 'owneradmin';

const permissionDetails=user?.user?.permissions


let hasPermission=checkPermission(permissionDetails,"seoManage")
let check=!isOwnerAdmin?hasPermission:true

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center my-5">{t(`SEO`)} {t(`Management`)} {t(`Panel`)}</h1>
      <div className='flex pr-5 p-2 justify-between'>
        <div className="flex items-center font-semibold gap-2 text-sm">{t(`Show`)} 
        <select onChange={(e)=>setLimit(e.target.value)} style={{border:`1px solid ${border}`}} className="text-xs font-bold outline-none p-1 rounded-md" value={limit}>
        <option value="20">20</option>

          <option value="50">50</option>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="500">500</option>
          <option value="1000">1000</option>

        </select></div>
{check&&<AddSeoCard getAllSeoData={getAllSeoData}/>}

      </div>
      {loading&&<div className='flex w-[100%] border justify-center items-center'>
             <LoadingSpinner size="xl"  thickness={"4px"}/>
      </div>}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 w-[100%] m-auto lg:grid-cols-3'>

      {seoData&&seoData?.map((category, index) => (
        <div key={category._id.$oid} style={{border:`1px solid ${border}`}} className="w-[100%]  mx-auto my-4 p-6 border rounded-2xl">
       <div className='flex  items-center justify-between'>
       <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
      {check&&  <MdDelete onClick={()=>handleDeleteSeo(category._id)} fontSize={"25px"} cursor={"pointer"} color={iconColor} />}
        </div>  
          <label className="block mb-2">
            {t(`Name`)}:
            <input
              type="text"
              name="name"
              style={{border:`1px solid ${border}`}}
              value={category.name}
              onChange={(e) => handleChange(index, e)}
              className="block w-full p-1 pl-2 outline-none text-sm font-semibold rounded-md mt-1"
            />
          </label>
         
        
          <label className="block mb-2">
            {t(`Description`)}:
            <textarea
              name="description"
              style={{border:`1px solid ${border}`}}

              value={category.description}
              onChange={(e) => handleChange(index, e)}
              className="block w-full p-1 pl-2 outline-none text-sm font-semibold rounded-md mt-1"
            ></textarea>
          </label>
          <label className="block mb-2">
            {t(`Meta`)} {t(`Title`)}:
            <input
              type="text"
              name="title"
              style={{border:`1px solid ${border}`}}

              value={category.metaTags.title}
              onChange={(e) => handleChange(index, e)}
              className="block w-full p-1 pl-2 text-sm outline-none font-semibold  rounded-md mt-1"
            />
          </label>
          <label className="block mb-2">
            {t(`Meta`)} {t(`Description`)}:
            <textarea
              name="description"
              style={{border:`1px solid ${border}`}}

              value={category.metaTags.description}
              onChange={(e) => handleChange(index, e)}
              className="block w-full p-1 pl-2 text-sm outline-none font-semibold  rounded-md mt-1"
            ></textarea>
          </label>
          <label className="block mb-2">
            {t(`Meta`)} {t(`Keywords`)}:
            <input
              type="text"
              name="keywords"
              value={category.metaTags.keywords.join(', ')}
              style={{border:`1px solid ${border}`}}

              onChange={(e) => handleChange(index, e)}
              className="block w-full p-1 pl-2 text-sm outline-none font-semibold  rounded-md mt-1"
            />
          </label>
          <div className='flex justify-center items-center'>
          {check&&<button onClick={()=>handleUpdateSeo(category)} style={{backgroundColor:bg}} className='w-[100%] p-2 rounded-lg text-white font-semibold'>{updateLoading&&(active==category._id)?<LoadingSpinner color="white" thickness={"4px"} size="sm"/>:`${t(`Update`)}`}</button>}

          </div>
        </div>
      ))}
     
      </div>
      <div className="flex justify-between items-center">
       {seoData?.length>0&& <p style={{color:iconColor}} className="text-xs font-semibold ">{t(`Showing`)} 1 {t(`to`)} {limit} of {pagination?.totalItems} </p>}
        {seoData && seoData.length > 0 && (
        <div
          className={`text-[16px]   text-sm font-semibold flex  mt-5 mr-5 justify-end gap-3 align-middle items-center`}
        >
          <button
            type="button"
            style={{
              backgroundColor: bg,
              border: `1px solid ${border}`,
              color: "white",
              fontSize: "12px",
            }}
            className={`ml-1 px-2 py-[4px] cursor-pointer  rounded-[5px] text-[20px]`}
            onClick={() => handlePrevPage()}
            disabled={currentPage == 1}
          >
            {"<"}
          </button>
          {t(`Page`)} <span>{currentPage}</span> {t(`of`)}{" "}
          <span>{pagination?.totalPages}</span>
          <button
            onClick={() => handleNextPage()}
            type="button"
            className={`ml-1 px-2 py-[4px] cursor-pointer rounded-[5px] text-[20px]`}
            style={{
              backgroundColor: bg,
              border: `1px solid ${border}`,
              color: "white",
              fontSize: "12px",
            }}
            disabled={currentPage == pagination?.totalPages}
          >
            {">"}
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default SeoManage;
