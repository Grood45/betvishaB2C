import React, { useEffect, useState } from "react";
import { fetchGetRequest, sendDeleteRequest, sendPatchRequest, sendPostRequest } from "../api/api";
import { useParams } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import {
  Switch,
  Progress,
  useToast,
  Badge,
  MenuButton,
  MenuItem,
  Menu,
  Button,
  MenuList,
} from "@chakra-ui/react";
import nodatafound from "../assets/emptydata.png";
import { FindGameTypeIdByName, checkPermission } from "../../utils/utils";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import { TiArrowBack } from "react-icons/ti";
import { useTranslation } from "react-i18next";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { RxCross2, RxCrossCircled } from "react-icons/rx";
import { IoMdArrowDropdown } from "react-icons/io";
const ManageGames = () => {
  const [game, setAllGame] = useState([]);
  const [gameLoading, setGameLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const { t, i18n } = useTranslation();

  const [pagination, setPagination] = useState({});
  const totalPages = pagination?.totalPages;
  const [search, setSearch] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loaderActive, setLoaderActive] = useState();
  const [catgory,setGameCategory]=useState([])
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const toast = useToast();
  const params = useParams();
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
  const getAllGamesByProviderID = async () => {
    setGameLoading(true);
    let url = `${import.meta.env.VITE_API_URL}/api/game/get-game-by-provider/${
      params.gpId
    }?page=${currentPage}&limit=${limit}&status=${status}`;

    if (search) {
      url += `&search=${search}`;
    }

    try {
      let response = await fetchGetRequest(url);
      const data = response.data;
      const receivedData = response.data;

      setAllGame(receivedData);
      setPagination(response.pagination);
      //   setProviderCount(response.providerCounts);
      setGameLoading(false);
    } catch (error) {
      toast({
        description: `${error?.data?.message||error?.response?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      console.log(error);
      setGameLoading(false);
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


  const handleImageChange = async (event, index, gameId, providerID) => {
    setLoaderActive(index);
    const file = event.target.files[0];
    handleImageUpload(file, gameId, providerID);
  };

  const handleImageUpload = async (file, gameId, providerID) => {
    setImageUploadLoading(true);
    const formData = new FormData();
    formData.append("post_img", file);
    try {
      const response = await sendPostRequest(
        `${import.meta.env.VITE_API_URL}/api/payment/image-url`,
        formData
      );
      if (response.url) {
        toast({
          title: "Image uploaded successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        setSelectedImage(response.url);
        updateImg(response.url, gameId, providerID);
        setImageUploadLoading(false);
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
    }
  };

  const updateImg = async (imageUrl, gameId, providerID) => {
  
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/game/update-game-image/${gameId}/${providerID}`;
    try {
      const payload = {
        image_url: imageUrl,
      };
      let response = await sendPatchRequest(url, payload);
      const data = response.data;
      getAllGamesByProviderID();
      toast({
        description: `succesfully updated `,
        status: `success`,
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setGameLoading(false);
    } catch (error) {
      console.log(error, "error");
      toast({
        description: `${error?.message||error?.response?.data?.message||error?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setGameLoading(false);
    }
  };

  useEffect(() => {
    let id;
    id = setTimeout(() => {
      getAllGamesByProviderID();
      getGameCategory()
    }, 200);

    return () => clearTimeout(id);
  }, [search, status, limit, currentPage]);

  const handleCasinoStatusUpdate = async (gameId, providerID, status) => {

    setGameLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/game/update-game-status/${gameId}/${providerID}`;
    try {
      const payload = {
        status: !status,
      };
      let response = await sendPatchRequest(url, payload);
      const data = response.data;
      const updatedStatus = response.data.status;

      getAllGamesByProviderID();
      toast({
        description: `${
          data.status ? "Provider activated" : "Provider diactivated"
        }`,
        status: `${data.status ? "success" : "warning"}`,
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setGameLoading(false);
    } catch (error) {
      console.log(error, "error");
      toast({
        description: `${error?.message||error?.response?.data?.message||error?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setGameLoading(false);
    }
  };

  const handleStatusChange = (e) => {
    setCurrentPage(1)
    const selectedValue = e.target.value;
if(selectedValue===""){
  setStatus('')
  return
}
    setStatus(
      selectedValue === "active"
        ? true
        : selectedValue === "inactive"
        ? false
        : null
    );
  };

  const [priorities, setPriorities] = useState([]);
  const [selectedItemIDs, setSelectedItemIDs] = useState([]);

  // Set initial state for priorities when game changes
  useEffect(() => {
    const initialPriorities = game.map((item) => item?.priority || "");
    setPriorities(initialPriorities);
    const initialSelectedIDs = initialPriorities.reduce(
      (selectedIDs, priority, index) => {
        if (priority) {
          return [...selectedIDs, game[index]._id];
        }
        return selectedIDs;
      },
      []
    );
    setSelectedItemIDs(initialSelectedIDs);
  }, [game]);

  const handlePriorityChange = (index, id, event) => {
    const { value } = event.target;
    console.log(index, id, event);
    setPriorities((prevPriorities) => {
      const updatedPriorities = [...prevPriorities];
      updatedPriorities[index] = value;
      return updatedPriorities;
    });
  };

  const handleUpdatePriority = async () => {
    setUpdateLoading(true);
    const payload = {
      ids: selectedItemIDs,
      values: priorities,
    };

    console.log(payload, "priority");
    try {
      let url = `${import.meta.env.VITE_API_URL}/api/game/update-priority`;
      let response = await sendPatchRequest(url, payload);
      toast({
        description: response.message,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setUpdateLoading(false);
      getAllGamesByProviderID();
    } catch (error) {
      console.log(error, "error sf");
      toast({
        description: `${error?.data?.message || error?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setUpdateLoading(false);
    }
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
  const handleAddCategory=async(data,id)=>{
    const payload={
      category:data.toLowerCase()
    }
    const url = `${import.meta.env.VITE_API_URL}/api/game/add-category/${id}`;
    try {
      let response = await sendPostRequest(url, payload);
      toast({
        description: response.message,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      getAllGamesByProviderID()
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
        
          let response = await sendPatchRequest(`${import.meta.env.VITE_API_URL}/api/game/delete-category/${item._id}`,payload);
          toast({
            description: response.message,
            status: "warning",
            duration: 4000,
            position: "top",
            isClosable: true,
          });
      getAllGamesByProviderID()

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



      const user = useSelector((state) => state.authReducer);
      const adminData = user.user || {};
      const isOwnerAdmin = adminData?.role_type === 'owneradmin';
    
      const permissionDetails=user?.user?.permissions
    
    
    let hasPermission=checkPermission(permissionDetails,"gameManage")
      let check=!isOwnerAdmin?hasPermission:true

  return (
    <div>
      <div className="flex flex-col items-end gap-3  md:flex-row justify-between pr-5">
        <div className="flex items-center md:w-[60%] gap-2">
          <div
            style={{
              border: `1px solid ${border}`,
              backgroundColor: primaryBg,
            }}
            className={`justify-between rounded-[8px] pl-1 flex items-center gap-2 md:w-[240px]`}
          >
            <input
              onChange={(e) =>{
                 setSearch(e.target.value)
                setCurrentPage(1)
                }}
              value={search}
              placeholder="Search here..."
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
            <option value="">All Game</option>
            <option value="active">
              {t(`Active`)} {t(`Game`)}
            </option>

            <option value="inactive">
              {t(`InActive`)} {t(`Game`)}
            </option>
          </select>
        </div>
        {check&&<div>
          <button
            onClick={handleUpdatePriority}
            style={{ backgroundColor: bg }}
            className="p-2 px-4  w-[150px] text-xs font-bold text-white rounded-md "
          >
            {updateLoading ? (
              <LoadingSpinner size="sm" thickness={"3px"} color={"white"} />
            ) : (
              `${t(`Update`)} ${t(`Priority`)}`
            )}
          </button>
        </div>}
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

      <div className="max-w-full mt-5  overflow-x-auto">
        {gameLoading && (
          <Progress size="xs" isIndeterminate colorScheme="#e91e63" />
        )}
        <table className="min-w-full bg-white shadow-md rounded mb-4">
          <thead>
            <tr className="border-b text-sm text-center">
              <th className="p-3  text-left w-[200px] ">
                {t(`Game`)} {t(`Image`)}
              </th>
              <th className="p-3  text-left w-[150px] ">
                {t(`Game`)} {t(`Name`)}
              </th>
              {/* <th className="p-3  min-w-[100px] ">
                {t(`Game`)} {t(`id`)}
              </th> */}
              <th className="p-3 ">{t(`Provider`)}</th>
              <th className="p-3  min-w-[150px]">
                {t(`Game`)} {t(`Type`)}
              </th>
              {/* <th className="p-3 ">{t(`Platform`)}</th> */}
              <th className="p-3 min-w-[120px]">{t(`Status`)}</th>
              {check&&<th className="p-3 min-w-[120px]">{t(`Priority`)}</th>}
              {check&&<th className="p-3  min-w-[120px]">{t(`Groups`)}</th>}

             {check&& <th className="p-3  text-right">
                {t(`Manage`)} {t(`Status`)}
              </th>}

              {/* Add more table headings for other important keys */}
            </tr>
          </thead>
          <tbody>
            {game.length > 0 &&
              game?.map((item, index) => (
                <tr
                  key={index}
                  className="border-b text-sm text-center hover:bg-gray-100"
                >
                  <td className="p-3">
                    <div className="flex justify-start    w-[200px] items-center">
                      {item.gameInfos.map((info, idx) => {
                        const language = info.language.toLowerCase();
                        if (language === "en") {
                          return (
                            <div
                              className="flex justify-end  gap-4 items-center"
                              key={idx}
                            >
                              <div className="flex flex-col gap-2 justify-start items-start">
                                <img
                                  className="w-[50%] h-[170px] rounded-2xl"
                                  src={info?.gameIconUrl}
                                />
                                {imageUploadLoading &&
                                loaderActive === index ? (
                                  <div className=" w-[30%]">
                                    <LoadingSpinner
                                      color="green"
                                      size="sm"
                                      thickness={"4px"}
                                    />
                                  </div>
                                ) : (
                                  ""
                                )}

                                <input
                                  type="file"
                                  accept="image/*"
                                  name="image"
                                  id="image"
                                  onChange={(e) =>
                                    handleImageChange(
                                      e,
                                      index,
                                      item?.gameID,
                                      item?.gameProviderId
                                    )
                                  }
                                />
                              </div>
                            </div>
                          );
                        }
                        return null; // If language is not "en" or "EN", don't render anything
                      })}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-start w-[150px]  items-center">
                      {item.gameInfos.map((info, idx) => {
                        const language = info.language.toLowerCase();
                        if (language === "en") {
                          return (
                            <div
                              className="flex justify-end gap-4 items-center"
                              key={idx}
                            >
                              <p className="font-bold">{info.gameName}:</p>
                              {/* {info.infoValue} */}
                            </div>
                          );
                        }
                        return null; // If language is not "en" or "EN", don't render anything
                      })}
                    </div>
                  </td>
                  {/* <td className="p-3">{item.gameID}</td> */}
                  <td className="p-3">{item.provider}</td>
                  <td className="p-3">
                    {FindGameTypeIdByName(item.newGameType)}
                  </td>
                  {/* <td className="p-3">{item.platform}</td> */}
                  <td className="">
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
                      {item?.status ? "Active" : "InActive"}
                    </Badge>
                  </td>

                 { check&& <td>
                    <div className="flex items-center justify-center gap-2">
                      <input
                        value={priorities[index] || ""}
                        className="text-center outline-none p-1 rounded-md"
                        onChange={(e) =>
                          handlePriorityChange(index, item?._id, e)
                        }
                      />
                    </div>
                  </td>}

                {check&&  <td className="">
                    <div className="flex  justify-center items-center gap-3">
                      <div className="flex flex-wrap max-w-[200px] justify-center items-center gap-2">
                        {item?.category?.map((skill, index) => (
                          <div
                            className="flex p-[2px] bg-gray-200 pl-2 rounded-md  items-center border"
                          >
                            <p
                              className="text-[8px]  font-bold"
                              key={index}
                              colorScheme="blue"
                            >
                              {skill}
                            </p>
                            <RxCrossCircled
                              onClick={() => handleDeleteCategory(item,item?.category[index])}
                              style={{
                                cursor: "pointer",
                                fontSize: "10px",
                                marginLeft: "5px",
                                fontWeight:"800",
                                color: "red",
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      <Menu>
                        <MenuButton
                          rightIcon={<ChevronDownIcon />}
                        >
                         <IoMdArrowDropdown />
                        </MenuButton>
                        <MenuList >
                          {catgory?.map((value,index)=>{
                              return  <MenuItem onClick={(e)=>handleAddCategory(value.name,item._id)} key={index}>{value.name}</MenuItem>
                          })}
                          
                        </MenuList>
                      </Menu>
                    </div>
                  </td>}
                  {check&& <td>
                    <div className="flex justify-end pr-5 ">
                      <Switch
                        colorScheme={"green"}
                        onChange={() =>
                          handleCasinoStatusUpdate(
                            item?.gameID,
                            item?.gameProviderId,
                            item?.status
                          )
                        }
                        size="md"
                        isChecked={item?.status}
                      />
                    </div>
                  </td>}
                </tr>
              ))}
          </tbody>
        </table>

        {game.length === 0 && (
          <div className="flex justify-center items-center">
            <img src={nodatafound} className="w-[300px]" />
          </div>
        )}
      </div>

      <div className="flex justify-between  items-center">
        {game?.length > 0 && (
          <p style={{ color: iconColor }} className="text-xs font-semibold ">
            {t(`Showing`)} 1 {t(`to`)} {limit} {t(`of`)}{" "}
            {pagination?.totalItems} {t(`Entries`)}
          </p>
        )}
        {game && game.length > 0 && (
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
            {t(`Page`)} <span>{currentPage}</span> of{" "}
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

export default ManageGames;
