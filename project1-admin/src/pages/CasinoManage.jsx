import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosPersonAdd, IoMdArrowDropdown } from "react-icons/io";
import {
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Badge,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Progress,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Image,
  Input,
} from "@chakra-ui/react";
import { FaRegCreditCard } from "react-icons/fa6";
import { BsCalendarDateFill } from "react-icons/bs";
import { FaWallet } from "react-icons/fa6";
import { HiCurrencyDollar } from "react-icons/hi2";
import { MdOutlineAccountBalance } from "react-icons/md";
import { GiCardKingClubs, GiWallet } from "react-icons/gi";
import { VscGraphLine } from "react-icons/vsc";
import { Switch } from "@chakra-ui/react";
import { FaRegEdit, FaUsers } from "react-icons/fa";
import { IoSettings, IoWallet } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { GiCard3Diamonds } from "react-icons/gi";
import { MdPendingActions } from "react-icons/md";
import { useSelector } from "react-redux";
import { FcViewDetails } from "react-icons/fc";
import { fetchGetRequest, sendPatchRequest, sendPostRequest } from "../api/api";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UpdatePriority from "../Modals/UpdatePriority";
import { checkPermission } from "../../utils/utils";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { RxCrossCircled } from "react-icons/rx";

const CasinoManage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingProvider, setProviderLoading] = useState(true);
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

  const [limit, setLimit] = useState("20");
  const [search, setSearch] = useState("");
  const [casinoProvider, setCasinoProvider] = useState([]);
  const toast = useToast();
  const [catgory,setGameCategory]=useState([])

  const [pagination, setPagination] = useState({});
  const [loaderActive, setLoaderActive] = useState();
  const [loaderActive1, setLoaderActive1] = useState();

  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [imageUploadLoading1,setImageUploadLoading1] = useState(false);

  const [selectedImage, setSelectedImage] = useState("");
  const totalPages = pagination?.totalPages;
  const [selectedProvider, setSelectedProvider] = useState('');
const [providerName,setProviderName]=useState('')
  const [providerCounts, setProviderCount] = useState({
    activeCount: 0,
    inactiveCount: 0,
    totalCount: 0,
  });
  const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};
  const isOwnerAdmin = adminData?.role_type === "owneradmin";

  const permissionDetails = user?.user?.permissions;

  let hasPermission = checkPermission(permissionDetails, "gameView");
  let check = !isOwnerAdmin ? hasPermission : true;
  let hasPermission1 = checkPermission(permissionDetails, "providerManage");
  let providerManage = !isOwnerAdmin ? hasPermission1 : true;
  const [status, setStatus] = useState("");
  const [updateGameLoading, setUpdateGameLoading] = useState();
  const getAllCasinoProvider = async () => {
    setProviderLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/casinoprovider/get-provider?search=${search}&status=${status}&page=${currentPage}&limit=${limit}`;

    try {
      let response = await fetchGetRequest(url);
      const data = response.data;
      const receivedData = response.data;
      setCasinoProvider(receivedData);
      setPagination(response.pagination);
      setProviderCount(response.providerCounts);

      setProviderLoading(false);
    } catch (error) {
      toast({
        description: `${
          error?.data?.message || error?.response?.data?.message
        }`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      console.log(error);
      setProviderLoading(false);
    }
  };
 
  const getGameCategory = async () => {
    let url = `${import.meta.env.VITE_API_URL
      }/api/game-navigation/get-all-game-navigation`;
    try {
      let response = await fetchGetRequest(url);
      setGameCategory(response.data);

    } catch (error) {
      toast({
        description: `${error?.data?.message||error?.response?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      // setCategoryLoading(false);
    }
  };

  const handleCasinoStatusUpdate = async (id) => {
    setCasinoProvider(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/casinoprovider/toggle-provider/${id}`;
    try {
      let response = await sendPatchRequest(url);
      const data = response.data;
      const updatedStatus = response.data.status;

      getAllCasinoProvider();
      toast({
        description: `${
          data.status ? "Provider activated" : "Provider diactivated"
        }`,
        status: `${data.status ? "success" : "warning"}`,
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setCasinoProvider(false);
    } catch (error) {
      console.log(error, "error");
      toast({
        description: `${
          error?.message ||
          error?.response?.data?.message ||
          error?.data?.message
        }`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setCasinoProvider(false);
    }
  };

  useEffect(() => {
    let id;
    id = setTimeout(() => {
      getAllCasinoProvider();
      getGameCategory()
    }, 100);

    return () => clearTimeout(id);
  }, [search, status, limit, currentPage, selectedProvider]);
  const handleStatusChange = (e) => {
    const selectedValue = e.target.value;
    setCurrentPage(1);
    if (selectedValue == "") {
      setStatus("");
      return;
    }
    // Set status to true if selectedValue is "active", false if "inactive", null otherwise
    setStatus(
      selectedValue === "active"
        ? true
        : selectedValue === "inactive"
        ? false
        : null
    );
  };

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

  const updateImg = async (imageUrl, providerID,checks) => {
    const url = checks === "1"
    ? `${import.meta.env.VITE_API_URL}/api/casinoprovider/update-provider-image`
    : `${import.meta.env.VITE_API_URL}/api/casinoprovider/update-provider-category-image`;
    try {
     const payload = {
       [checks == "1" ? "image_url" : "category_image_url"]: imageUrl,
        gpid: providerID,
};
      let response = await sendPatchRequest(url, payload);
      const data = response.data;
      getAllCasinoProvider();
      toast({
        description: `succesfully updated`,
        status: `success`,
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      // setGameLoading(false);
    } catch (error) {
      console.log(error, "error");
      toast({
        description: `${
          error?.message ||
          error?.response?.data?.message ||
          error?.data?.message
        }`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      // setGameLoading(false);
    }
  };

  const handleImageUpload = async (file, providerID,checks) => {
    checks=="1"? setImageUploadLoading(true): setImageUploadLoading1(true);
    const formData = new FormData();
    formData.append("post_img", file);
    try {
      const response = await sendPostRequest(
        `${import.meta.env.VITE_API_URL}/api/payment/image-url`,
        formData
      );
      if (response.url) {
        // toast({
        //   title: "Image uploaded successfully",
        //   status: "success",
        //   duration: 2000,
        //   isClosable: true,
        // });
        setSelectedImage(response.url);
        updateImg(response.url, providerID,checks);
        setImageUploadLoading(false);
        setImageUploadLoading1(false)
      }
    } catch (error) {
      console.error("Error uploading image:", error.message);
      toast({
        title: "Error uploading image",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      setImageUploadLoading(false);
      setImageUploadLoading1(false)

    }
  };

  const handleImageChange = async (event, index, providerID) => {
    setLoaderActive(index);
    const file = event.target.files[0];
    handleImageUpload(file, providerID,"1");
  };

  const handleImageChange1 = async (event, index, providerID) => {
    setLoaderActive1(index);
    const file = event.target.files[0];
    handleImageUpload(file, providerID,"2");
  };



  const handleAddCategory=async(data,id)=>{
    const payload={
      category:data.toLowerCase()
    }
    const url = `${import.meta.env.VITE_API_URL}/api/casinoprovider/add-category/${id}`;
    try {
      let response = await sendPostRequest(url, payload);
      toast({
        description: response.message,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      getAllCasinoProvider()
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

  const handleDeleteCategory = async(item,data) => {
    const payload={
      category:data
  }
  try {
  
    let response = await sendPatchRequest(`${import.meta.env.VITE_API_URL}/api/casinoprovider/delete-category/${item._id}`,payload);
    toast({
      description: response.message,
      status: "warning",
      duration: 4000,
      position: "top",
      isClosable: true,
    });
    getAllCasinoProvider()

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

  

};
  return (
    <div>
      <div className="flex flex-col items-end gap-3 md:flex-row justify-between px-2">
        <div className="flex items-center md:w-[60%] gap-2">
          <div
            style={{
              border: `1px solid ${border}`,
              backgroundColor: primaryBg,
            }}
            className={`justify-between rounded-[8px] pl-1 flex items-center gap-2 md:w-[240px]`}
          >
            <input
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              value={search}
              placeholder={`${t(`Search here`)}...`}
              className=" outline-none rounded-[8px] p-[6px]  text-black text-xs md:text-sm  w-[100%]"
            />
            <span
              style={{ backgroundColor: bg }}
              className={`p-[6px] border rounded-r-[8px] cursor-pointer `}
            >
              <IoSearchOutline fontSize={"22px"} color="white" />
            </span>
          </div>

          <select
            style={{
              border: `1px solid ${border}`,
              backgroundColor: primaryBg,
            }}
            className={`p-[8px]   md:w-[200px] rounded-[6px] text-xs md:text-sm font-semibold border outline-none`}
            onChange={handleStatusChange}
          >
            <option value="">
              {t(`All`)} {t(`Provider`)}
            </option>
            <option value="active">
              {t(`Active`)} {t(`Provider`)}
            </option>

            <option value="inactive">
              {t(`InActive`)} {t(`Provider`)}
            </option>
          </select>
        </div>
      </div>
      <div className="flex item-center justify-end mr-5">
        {/* <div className="border flex flex-wrap font-bold  md:flex-nowrap items-center gap-6">
         
          <div className="flex flex-wrap items-center gap-2 lg:gap-5">
            {moreProvider.map((item,index)=>{
              return  <div className="flex gap-2 items-end font-bold">
              <p
                style={{
                  color: iconColor,
                  borderBottom:
                    selectedProvider == index ? `3px solid ${hoverColor}` : "",
                }}
                onClick={() => {
                  setSelectedProvider(index)
                setProviderName(item.provider_name)
                }}
                className={`font-bold mt-6 ${
                  selectedProvider === index ? "   pb-1 " : ""
                } w-[100%] cursor-pointer   flex items-center gap-2 rounded-[6px]  text-lg`}
              >
                <GiCardKingClubs style={{ color: iconColor }} fontSize={"30px"} />
                <span>{item.modified_api_provider_name}</span>
              </p>
              <Tooltip
                label="Click to update the games with the latest information"
                aria-label="Update games tooltip"
              >
                <button
                  className="text-[12px] bg-black text-white px-2 py-1 rounded-md"
                  onClick={() => handleUpdateGames(item.provider_name)}
                >
                  UPDATE
                </button>
              </Tooltip>
            </div>
            })}
          </div>
      
        </div> */}

        <div className="flex items-center gap-2 text-sm">
          {t(`Show`)}
          <select
            onChange={(e) => setLimit(e.target.value)}
            style={{ border: `1px solid ${border}` }}
            className="text-xs outline-none p-1 rounded-md"
            value={limit}
          >
            <option value="20">20</option>

            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="500">500</option>
            <option value="1000">1000</option>
          </select>
          {t(`Entries`)}
        </div>
      </div>

      <div
        className={` bg-white pb-6 overflow-scroll rounded-[12px] mt-6  `}
      >
        <div className="h-[100%] rounded-[16px] px-4  pt-4 w-[100%]  ">
          {loadingProvider && (
            <Progress size="xs" isIndeterminate colorScheme="#e91e63" />
          )}
          <div className="flex justify-between items-center">
            <div className="">
              <p className=" font-semibold text-sm  pt-2 text-left">
                {t(`All`)} {t(`Provider`)} {t(`Details`)}
              </p>
            </div>
          </div>

          <Box overflowX="auto">
      <Table variant="striped" mt={5}>
        <Thead>
          <Tr style={{ borderBottom: `1px solid ${border}` }} className="text-center text-nowrap p-2 h-[30px] text-[14px] font-bold">
            <Th style={{width:"200px"}} className="text-left ">{t(`Provider Logo`)}</Th>
            <Th className="text-left w-[100px] text-nowrap">{t(`Provider Image`)}</Th>
            <Th className="text-left w-[50%]">{t(`ProviderID`)}</Th>
            <Th className="text-left w-[50%]">{t(`Provider Name`)}</Th>
            <Th className="text-left w-[50%]">{t(`Game Name`)}</Th>
            <Th className="text-left w-[50%]">{t(`Status`)}</Th>
            {providerManage && (
              <>
                <Th className="text-center w-[50%]">{t(`Manage Status`)}</Th>
                <Th className="text-center w-[50%]">{t(`Manage Priority`)}</Th>
              </>
            )}
            {check && (
              <>
                <Th className="text-right w-[100%]">{t(`Manage Games`)}</Th>
                <Th className="p-3 w-[100%]">{t(`Groups`)}</Th>
              </>
            )}
          </Tr>
        </Thead>
        <Tbody>
          {casinoProvider.length > 0 && casinoProvider.map((item, dex) => (
            <Tr key={item?._id} style={{ borderBottom: `1px solid ${border}` }} className="text-center h-[60px] text-xs">
              <Td>
                <Box className="flex flex-col  min-w-[200px] gap-2 mb-2">
                  <Image
                    className="w-[50%] h-[100px] py-3 rounded-2xl"
                    src={item?.image_url}
                  />
                  {imageUploadLoading && loaderActive === dex && (
                    <Box className="w-[30%]">
                      <LoadingSpinner color="green" size="sm" thickness="4px" />
                    </Box>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    name="image"
                    style={{outline:"none",border:"none",cursor:'pointer'}}
                    id="image"
                    onChange={(e) => handleImageChange(e, dex, item?.gpId)}
                  />
                </Box>
              </Td>
              <Td>
                <Box className="flex flex-col   min-w-[200px] gap-2 mb-2">
                  <Image
                    className="w-[50%] h-[150px] py-3 rounded-2xl"
                    src={item?.category_image_url}
                  />
                  {imageUploadLoading1 && loaderActive1 === dex && (
                    <Box className="w-[30%]">
                      <LoadingSpinner color="green" size="sm" thickness="4px" />
                    </Box>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    name="image"
                    id="image"
                    style={{outline:"none",border:"none",cursor:'pointer'}}

                    onChange={(e) => handleImageChange1(e, dex, item?.gpId)}
                  />
                </Box>
              </Td>
              <Td className="text-left">{item?.gpId}</Td>
              <Td className="text-left">
                <Box className="flex flex-col">
                  <p>{item?.gpName}</p>
                </Box>
              </Td>
              <Td className="text-left">{item?.gameName}</Td>
              <Td className="text-left">
                <Badge
                  style={{
                    backgroundColor: item?.status ? "green" : "red",
                    color: "white",
                    padding: "2px",
                    width: "80px",
                    textAlign: "center",
                    borderRadius: "4px",
                  }}
                >
                  {item?.status ? `${t(`Active`)}` : `${t(`InActive`)}`}
                </Badge>
              </Td>
              {providerManage && (
                <Td className="">
                  <div className="flex justify-center items-center ">
                  <Switch
                    onChange={() => handleCasinoStatusUpdate(item?._id)}
                    size="md"
                    isChecked={item?.status}
                  />
                  </div>
                
                </Td>
              )}
              {providerManage && (
                <Td>
                  <Box className="flex items-center gap-4 justify-center">
                    <p className="text-lg font-semibold">{item?.priority}</p>
                    <UpdatePriority gpId={item?.gpId} getAllCasinoProvider={getAllCasinoProvider} />
                  </Box>
                </Td>
              )}
              {check && (
                <Td>
                  <Link to={`/casinomanage/${item?.gameName}/${item?.gpId}`} className="flex justify-center">
                    <FcViewDetails fontSize="25px" cursor="pointer" />
                  </Link>
                </Td>
              )}
              {check && (
                <Td>
                  <Box className="flex justify-center items-center gap-3">
                    <Box className="flex flex-wrap min-w-[220px]  gap-2">
                      {item?.category?.map((skill, index) => (
                        <Box className="flex p-[2px] bg-gray-200 pl-2 rounded-md items-center" key={index}>
                          <p className="text-[12px] text-nowrap font-bold">{skill}</p>
                          <RxCrossCircled
                            onClick={() => handleDeleteCategory(item, item?.category[index])}
                            style={{
                              cursor: "pointer",
                              fontSize: "10px",
                              marginLeft: "5px",
                              fontWeight: "800",
                              color: "red",
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                    <Menu>
                      <MenuButton rightIcon={<ChevronDownIcon />}>
                        <IoMdArrowDropdown />
                      </MenuButton>
                      <MenuList>
                        {catgory?.map((value, index) => (
                          <MenuItem onClick={(e) => handleAddCategory(value.name, item._id)} key={index}>
                            {value.name}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </Box>
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>


        </div>
      </div>

        <div className="flex justify-between items-center">
          {casinoProvider?.length > 0 && (
            <p style={{ color: iconColor }} className="text-xs font-semibold ">
              {t(`Showing`)} 1 {t(`to`)} {limit} {t(`of`)}{" "}
              {providerCounts.activeCount + providerCounts.inactiveCount}{" "}
              {t(`Entries`)}
            </p>
          )}
          {casinoProvider && casinoProvider.length > 0 && (
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
              {t(`Page`)} <span>{currentPage}</span> {t(`of`)}
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

export default CasinoManage;
