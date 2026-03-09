import React, { useEffect, useState } from "react";
import {
  fetchGetRequest,
  sendDeleteRequest,
  sendPatchRequest,
  sendPostRequest,
} from "../../api/api";
import { useToast } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../component/loading/LoadingSpinner";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useTranslation } from "react-i18next";
import AddGameCategory from "../../Modals/AddGameCategory";
import { checkPermission } from "../../../utils/utils";

const GameCategorySetting = () => {
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

  const [gameCategory, setGameCategory] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [uploadImageLoading, setUploadImageLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState("");
  const [btnId, setBtnId] = useState("");

  const [updateLoading, setUpdateLoading] = useState(false);

  const [editpermission, setEditPermission] = useState(-1);
  const toast = useToast();

  const getGameCategory = async () => {
    setCategoryLoading(true);
    let url = `${import.meta.env.VITE_API_URL
      }/api/game-navigation/get-all-game-navigation`;
    try {
      let response = await fetchGetRequest(url);
      setGameCategory(response.data);

      setCategoryLoading(false);
    } catch (error) {
      toast({
        description: `${error?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setCategoryLoading(false);
    }
  };

  const handleUpdateGameCategory = async (item, id) => {
    setBtnId(id);
    setUpdateLoading(true);
    let url = `${import.meta.env.VITE_API_URL
      }/api/game-navigation/update-game-navigation/${id}`;

    try {
      let payload = {
        name: item.name,
        icon: selectedImage || item.icon,
        link: item.link,
      };
      let response = await sendPatchRequest(url, payload);
      toast({
        description: `Updated Successfully`,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setSelectedImage("");
      getGameCategory();
      setUpdateLoading(false);
      setEditPermission(-1);
    } catch (error) {
      console.log(error, "error");

      toast({
        description: `${error?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setUpdateLoading(false);
    }
    setUpdateLoading(false);
  };

  const handleImageChange = (event, id) => {
    const file = event.target.files[0];
    setUpdatingItemId(id);
    handleImageUpload(file);
  };

  const handleChangeCategoryTitle = (e, index, name) => {
    const { value } = e.target;
    const updatedGameCategory = [...gameCategory];
    updatedGameCategory[index] = {
      ...updatedGameCategory[index],
      [name]: value,
    };
    setGameCategory(updatedGameCategory);
  };
  // image upload
  const handleImageUpload = async (file) => {
    setUploadImageLoading(true);
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
        setUploadImageLoading(false);
      }
    } catch (error) {
      console.error("Error uploading image:", error.message);
      toast({
        title: "Error uploading image",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      setUploadImageLoading(false);
    }
  };

  const handleActiveEdit = (index) => {
    setEditPermission(index);
  };
  useEffect(() => {
    getGameCategory();
  }, []);



   
    const handleDeleteCategory = async(id) => {
          try {
             const url = `${import.meta.env.VITE_API_URL}/api/game-navigation/delete-game-navigation/${id}`;
            let response = await sendDeleteRequest(url);
            toast({
              description: response.message,
              status: "success",
              duration: 4000,
              position: "top",
              isClosable: true,
            });
            getGameCategory()
          } catch (error) {
            console.log(error, "error during deleting category");
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
        
        
        let hasPermission=checkPermission(permissionDetails,"socialMediaManage")
        let check=!isOwnerAdmin?hasPermission:true
        

  return (
    <div className={`bg-white shadow-md rounded px-3 lg:px-8 pt-6 pb-8 mb-4 `}>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold mb-4">{t(`Game`)} {t(`Category`)}</h2>
        {check&&<AddGameCategory getGameCategory={getGameCategory}/>}
      </div>

      <div className="grid sm:grid-cols-2 mt-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {gameCategory?.map((item, index) => (
          <div
            style={{
              border:
                editpermission == index
                  ? `3px solid ${border}`
                  : `1px solid ${border}`,
            }}
            key={index}
            className="mb-4 p-3 rounded-md"
          >
          
            <div className="flex justify-between gap-2 items-center">
              {/* Input field for editing title */}
              <input
                type="text"
                value={t(item?.name) || ""}
                style={{
                  border:
                    editpermission == index
                      ? `2px solid ${border}`
                      : `1px solid ${border}`,
                }}
                name={"name"}
                // disabled={}
                readOnly={editpermission == index ? false : true}
                onChange={(e) => handleChangeCategoryTitle(e, index, "name")} // Pass item id to identify which item's title to update
                className="block text-lg font-bold outline-none p-1 rounded-sm  text-gray-700 w-[100%]"
              />
              <div className="flex items-center  gap-2">
            {check&&  <button
                onClick={() => handleActiveEdit(index)}
                style={{ backgroundColor: bg }}
                className=" p-2 rounded-[8px] flex justify-center items-center"
              >
                <FaEdit
                  style={{ color: "white", fontSize: "20px" }}
                  className="cursor-pointer"
                />
              </button>}
             {check&&<MdDelete
              color={iconColor}
              fontSize={"45px"}
              className="cursor-pointer"
              onClick={() => handleDeleteCategory(item?._id)}
            />}

              </div>
             
            </div>

            <div className="flex items-center mt-2">
              {item.icon && (
                <img
                  src={item.icon}
                  alt={item.title}
                  className="h-[200px] w-[100%]"
                />
              )}
            </div>

            {/* Input file for updating image */}
            <div className="mt-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {t(`Update`)} {t(`Image`)}
              </label>
              <input
                disabled={editpermission == index ? false : true}
                id="file-upload"
                type="file"
                accept="image/*"
                style={{
                  border:
                    editpermission == index
                      ? `2px solid ${border}`
                      : `1px solid ${border}`,
                }}
                className="border border-gray-300 p-2 w-full"
                onChange={(e) => handleImageChange(e, item._id)} // Pass item id to identify which item's image to update
              />

              <input
                type="text"
                value={item?.link || ""}
                style={{
                  border:
                    editpermission == index
                      ? `2px solid ${border}`
                      : `1px solid ${border}`,
                }}
                name={"link"}
                // disabled={}
                readOnly={editpermission == index ? false : true}
                onChange={(e) => handleChangeCategoryTitle(e, index, "link")} // Pass item id to identify which item's title to update
                className="block text-lg font-bold outline-none p-1 rounded-sm  text-gray-700 w-full"
              />

              {updatingItemId == item._id && uploadImageLoading && (
                <LoadingSpinner size="xs" />
              )}
            </div>
           {check&& <button
              disabled={editpermission == index ? false : true}
              onClick={() => handleUpdateGameCategory(item, item._id)}
              style={{ backgroundColor: bg }}
              className="rounded-lg w-[100%] p-2 font-bold text-white text-sm mt-4"
            >
              {btnId === item._id && updateLoading ? (
                <LoadingSpinner size="sm" color="white" thickness={"4px"} />
              ) : (
                ` ${t(`Update`)}`
              )}
            </button>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameCategorySetting;
