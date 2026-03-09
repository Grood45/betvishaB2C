import React, { useEffect, useState } from "react";
import {
  fetchGetRequest,
  sendPatchRequest,
  sendPostRequest,
} from "../../api/api";
import { useToast } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../component/loading/LoadingSpinner";
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { checkPermission } from "../../../utils/utils";

const FooterPaymentTerms = () => {
  const [footerData, setFooterData] = useState();
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
  const [loading, setLoading] = useState(false);
  const [uploadImageLoading, setUploadImageLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState("");
  const { t, i18n } = useTranslation();

  const [updateLoading, setUpdateLoading] = useState(false);
  const [value, setValue] = useState("");
  const [footerText, setFooterText] = useState([]);
  const toast = useToast();
  const getFooterPayments = async () => {
    setLoading(true);
    let url = `${import.meta.env.VITE_API_URL}/api/footer-info/get-footer-info`;
    try {
      let response = await fetchGetRequest(url);
      setFooterData(response.data);
      setFooterText(response.data.footer_text);
      setLoading(false);
    } catch (error) {
      toast({
        description: `${error?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleInputChange = (e, index, key) => {
    const { name, value } = e.target;
    let paymentData = footerData[key];
    paymentData[index][name] = value;
    setFooterData((pre) => {
      return { ...pre, [key]: paymentData };
    });
  };

  useEffect(() => {
    getFooterPayments();
  }, []);

  const handleImageChange = (event, id, index,type) => {
    const file = event.target.files[0];

    setUpdatingItemId(id);
    handleImageUpload(file, index,type);
  };

  const handleImageUpload = async (file, index,type) => {
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
        if(type==="payments"){
        const newData = { ...footerData.payments };
        newData[index].src = response.url;
        }
        else if (type==="partners"){
          const newData = { ...footerData.partners };
        newData[index].src = response.url;
        }
        
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

  const handleUpdateContent = async () => {
    setUpdateLoading(true);

    const payload = { ...footerData, footer_text: footerText };
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/footer-info/update-footer-info`;
    try {
      let response = await sendPatchRequest(url, payload);
      setFooterData(response.data);
      toast({
        description: `Updated Successfully`,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      getFooterPayments();
      setUpdateLoading(false);
    } catch (error) {
      toast({
        description: `${error?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setUpdateLoading(false);
    }
  };

  const handleAdd = (key) => {
    if (key === "payments" || key === "partners") {
        const payload = {
            label: "",
            Visa: "",
            srs: "",
            link: ""
        };
        setFooterData((prev) => {
            return { ...prev, [key]: [...prev[key], payload] };
        });
    }
};
const handleDelete = (index,key) => {
  if (key === "payments" || key === "partners") {
      setFooterData((prev) => {
          const updatedArray = prev[key].filter((item, i) => i !== index);
          return { ...prev, [key]: updatedArray };
      });
  }
};


  const handleChangeFooterText = (e, index) => {
    const { value } = e.target;
    setFooterText((prevFooterText) => {
      const updatedFooterText = [...prevFooterText]; // Create a copy of the previous state array
      updatedFooterText[index] = value; // Update the value at the specified index
      return updatedFooterText; // Return the updated array
    });
  };

  const addFooterTextField = () => {
    if (footerText[footerText.length - 1] !== "") {
      setFooterText((pre) => [...pre, ""]);
    }
  };

  const removeFooterTextField = (index) => {
    setFooterText((prevFooterText) => {
      return prevFooterText.filter((_, ind) => ind !== index);
    });
  };

  const user = useSelector((state) => state.authReducer);

  const adminData = user.user || {};
  const isOwnerAdmin = adminData?.role_type === 'owneradmin';
  
  const permissionDetails=user?.user?.permissions
  
  
  let hasPermission=checkPermission(permissionDetails,"footerContentManage")
  let check=!isOwnerAdmin?hasPermission:true
  

  return (
    <div>
      <div
        style={{ border: `1px solid ${border} ` }}
        className="border p-2 rounded-md"
      >
        <div className="flex justify-between items-center ">
          <p className="font-bold text-lg">{t(`Payment`)}</p>
         {check&& <button
 onClick={()=>handleAdd("payments")}
            style={{ backgroundColor: bg }}
            className="p-[6px] rounded-md font-bold text-xs text-white"
          >
            {t(`Add`)} {t(`More`)}
          </button>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3  mt-5 justify-between items-center">
          {footerData?.payments?.map((item, index) => {
            return (
              <div
                style={{ border: `1px solid ${border}` }}
                key={item._id}
                className="flex flex-col  gap-1 p-4 rounded-lg "
              >
                <div className="flex gap-3 items-center justify-between">
                  <input
                    onChange={(e) => handleInputChange(e, index, "payments")}
                    style={{ border: `1px solid ${border}` }}
                    name="label"
                    value={item.label}
                    className="p-1 outline-none w-full rounded-md"
                  />
                 { check&&<MdDelete
                    color={iconColor}
                    fontSize={"35px"}
                    className="cursor-pointer"
                    onClick={()=>handleDelete(index,"payments")}
                  />}
                </div>

                <img
                  src={item.src}
                  alt="error"
                  className="w-[100%] h-[180px]"
                />
               {check&& <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="border border-gray-300 p-2 w-full"
                  onChange={(e) => handleImageChange(e, item._id, index,"payments")} // Pass item id to identify which item's image to update
                />}
                {updatingItemId == item._id && uploadImageLoading && (
                  <LoadingSpinner size="xs" />
                )}
                <input
                  onChange={(e) => handleInputChange(e, index, "payments")}
                  style={{ border: `1px solid ${border}` }}
                  value={item.link}
                  name="link"
                  className="p-1 rounded-md outline-none"
                />
              </div>
            );
          })}
        </div>
      </div>
      <div
        style={{ border: `1px solid ${border} ` }}
        className="border p-2 mt-8 rounded-md"
      >
        <div className="flex justify-between items-center ">
          <p className="font-bold text-lg">{t(`Partners`)}</p>
         {check&& <button
            style={{ backgroundColor: bg }}
            className="p-[6px] rounded-md font-bold text-xs text-white"
            onClick={()=>handleAdd("partners")}
          >
            {t(`Add`)} {t(`More`)}
          </button>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3  mt-2  items-start justify-between ">
          {footerData?.partners?.map((item, index) => {
            return (
              <div
                style={{ border: `1px solid ${border}` }}
                key={item._id}
                className="flex flex-col  gap-1 p-4 rounded-lg "
              >
                {check&&<div className="flex justify-end">
                  {" "}
                  <MdDelete
                  onClick={()=>handleDelete(index,"partners")}
                    color={iconColor}
                    fontSize={"35px"}
                    className="cursor-pointer"
                  />
                </div>}
                <img
                  src={item.src}
                  alt="error"
                  className="w-[100%] h-[160px] "
                />
                {/* <input type="file" /> */}
                 <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="border border-gray-300 p-2 w-full"
                  onChange={(e) => handleImageChange(e, item._id, index,"partners")} // Pass item id to identify which item's image to update
                />
                {updatingItemId == item._id && uploadImageLoading && (
                  <LoadingSpinner size="xs" />
                )}
                <input
                  onChange={(e) => handleInputChange(e, index, "partners")}
                  style={{ border: `1px solid ${border}` }}
                  value={item.link}
                  name="link"
                  className="p-1  mt-5 rounded-md outline-none"
                />
                
              </div>
            );
          })}
        </div>
      </div>
      <div
        style={{ border: `1px solid ${border} ` }}
        className="border p-2 mt-8 rounded-md"
      >
        <div className="flex  items-start justify-between">
          <p className="font-bold  text-lg">{t(`footer`)} {t(`Text`)}</p>
          <IoMdAddCircleOutline onClick={addFooterTextField} size={30} />
        </div>

        {footerText?.map((item, index) => {
          return (
            <div
              style={{ border: `1px solid ${border}` }}
              key={index}
              className="flex mt-5 w-[100%] gap-1 p-4 rounded-lg"
            >
              <textarea
                onChange={(e) => handleChangeFooterText(e, index)}
                value={item}
                className="p-1 rounded-md w-full  outline-none"
              />
              <IoMdRemoveCircleOutline
                onClick={() => removeFooterTextField(index)}
                className="cursor-pointer"
                size={40}
              />
            </div>
          );
        })}
      </div>
      {check&&<div>
       <button
          onClick={handleUpdateContent}
          style={{ backgroundColor: bg }}
          disabled={updateLoading}
          className="p-2 w-full mt-5 rounded-md  font-bold text-white text-sm"
        >
          {updateLoading ? (
            <LoadingSpinner color={"white"} size="md" thickness={"4px"} />
          ) : (
            `${t(`Update`)}`
          )}
        </button>
      </div>}
    </div>
  );
};

export default FooterPaymentTerms;
