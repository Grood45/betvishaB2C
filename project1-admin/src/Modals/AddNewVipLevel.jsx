import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Switch,
  useToast,
} from "@chakra-ui/react";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { useSelector } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { MdEdit } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import {
  sendDeleteRequest,
  sendPatchRequest,
  sendPostRequest,
} from "../api/api";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import { useTranslation } from "react-i18next";
function AddNewVipLevel({ id, data, getAllPromotion }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
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

  const [isActive, setIsActive] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const toggleSwitch = () => {
    setIsActive(!isActive);
  };
  const initialState = {
    category: "user_bonus",
    reward_amount: "",
    sub_category: "first_user",
    reward_type: "percentage",
    min_reward: "",
    max_reward: "",
    description: "",
    eligibility: "",
    min_bet: 0,
    min_deposit: 0,
    action: "",
    status: false,
    image: null,
    wager_required:0
  };
  const bonusData = [
    {
      category: "user_bonus",
      sub_category: ["first_user"],
      reward_type: ["fixed"],
    },
    {
      category: "deposit_bonus",
      sub_category: ["first_deposit", "every_deposit", "occasion_deposit"],
      reward_type: ["fixed", "percentage"],
    },
    {
      category: "bet_bonus",
      sub_category: ["first_bet", "lose_bet", "every_bet"],
      reward_type: ["fixed", "percentage"],
    },
  ];
  const [formData, setFormData] = useState(data || initialState);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = async (file) => {
    setImageLoading(true);

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
        setImageLoading(false);
      }
      return response.url;
    } catch (error) {
      console.error("Error uploading image:", error.message);
      toast({
        title: "Error uploading image",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      setImageLoading(false);
    }
  };

  const handleBonusImage = async (event) => {
    const file = event.target.files[0];
    const logo = await handleImageUpload(file);
    setFormData({
      ...formData,
      image: logo,
    });
  };

  const handleCategory = (e) => {
    setFormData({
      ...formData,
      category: e.target.value,
    });
  };
  const handleSubCategory = (e) => {
    setFormData({
      ...formData,
      sub_category: e.target.value,
    });
  };

  const addContribution = async (e) => {
    e.preventDefault();
    const url = `${import.meta.env.VITE_API_URL}/api/promotion/add-new-promotion`;
    setLoading(true);

    try {
      let response = await sendPostRequest(url, formData);
      toast({
        description: response.message,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
      setFormData(initialState);
      getAllPromotion()
      onClose();

    } catch (error) {
      toast({
        description: `${error?.data?.message || error?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const [updateLoading, setUpdateLoading] = useState(false);

  const UpdateContribution = async (updateId) => {
    setUpdateLoading(true);
    try {
      const response = await sendPatchRequest(
        `${
          import.meta.env.VITE_API_URL
        }/api/promotion/update-promotion/${updateId}`,
        formData
      );
      toast({
        title: "Updated Successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setUpdateLoading(false);
      getAllPromotion();
    } catch (error) {
      setUpdateLoading(false);
console.log(error, "error error")
      toast({
        title:  error?.response?.data?.message||error?.data?.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    onClose();
  };

  return (
    <>
      {id == 1 && (
        <button
          style={{ backgroundColor: bg }}
          onClick={onOpen}
          className={` px-2 py-2 rounded-md flex items-center gap-1  text-sm font-semibold text-white `}
        >
          <HiOutlineSpeakerphone />
          {t(`Add`)} {t(`New`)} {t(`Level`)}
        </button>
      )}
      {id == 2 && (
        <button onClick={onOpen} className="p-1 text-white rounded-md">
          <FaEdit fontSize="30px" color={iconColor} />
        </button>
      )}

      <Modal size={"md"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {id == 1 && (
            <ModalHeader style={{ color: iconColor, textAlign: "center" }}>
                      {t(`Add`)} {t(`New`)} {t(`Level`)}

            </ModalHeader>
          )}
          {id == 2 && (
            <ModalHeader style={{ color: iconColor, textAlign: "center" }}>
              {t(`Edit`)} {t(`Level`)}
            </ModalHeader>
          )}

          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={addContribution}>
              <div className="mb-4">
                {/* Input for Bonus Image */}
                <label className="block text-sm font-medium text-gray-700">
                  {t(`Vip`)} {t(`Level`)} {t(`Image`)}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  id="image"
                  onChange={handleBonusImage}
                  className={`mt-1 p-2 border outline-none rounded-md w-full`}
                />
                {formData?.image ? (
                  <img
                    src={formData?.image}
                    alt=""
                    className="w-[100px] rounded-[50%] m-auto border border-red-400 h-[100px]"
                  />
                ) : (
                  ""
                )}
              </div>
              <div className="flex justify-between gap-4">
                <div className="mb-4 w-[100%]">
                  {/* Select for Category */}
                  <label className="block text-sm font-medium text-gray-700">
                    {t(`Level`)} {t(`Name`)} <span className="text-red-500 text-lg">*</span>
                  </label>
                  <input
                    name="category"
                    value={''}
                    required={true}
                    placeholder="enter level name"
                    onChange={handleCategory}
                    className={`mt-1 p-[5px] border outline-none rounded-md w-full`}
                  />
                    
                 
                </div>
             
              </div>
           
              <div className="flex justify-between gap-4">
                <div className="mb-4 w-[100%]">
                  {/* Input for Min Reward */}
                  <label className="block text-sm font-medium text-gray-700">
                    {t(`Condition1`)} 
                  </label>
                  <input
                    type="number"
                    name="min_reward"
                    required={true}
                    value={formData.min_reward}
                    onChange={handleInputChange}
                    className={`mt-1 p-1 border outline-none rounded-md w-full`}
                  />
                </div>
                <div className="mb-4 w-[100%]">
                  {/* Input for Max Reward */}
                  <label className="block text-sm font-medium text-gray-700">
                    {t(`Value1`)}
                  </label>
                  <input
                    type="number"
                    required={true}
                    name="max_reward"
                    value={formData.max_reward}
                    onChange={handleInputChange}
                    className={`mt-1 p-1 border outline-none rounded-md w-full`}
                  />
                </div>
              </div>
              <div className="flex justify-between gap-4">
                <div className="mb-4 w-[100%]">
                  {/* Input for Min Reward */}
                  <label className="block text-sm font-medium text-gray-700">
                    {t(`Condition2`)} 
                  </label>
                  <input
                    type="number"
                    name="min_reward"
                    required={true}
                    value={formData.min_reward}
                    onChange={handleInputChange}
                    className={`mt-1 p-1 border outline-none rounded-md w-full`}
                  />
                </div>
                <div className="mb-4 w-[100%]">
                  {/* Input for Max Reward */}
                  <label className="block text-sm font-medium text-gray-700">
                    {t(`Value2`)}
                  </label>
                  <input
                    type="number"
                    required={true}
                    name="max_reward"
                    value={formData.max_reward}
                    onChange={handleInputChange}
                    className={`mt-1 p-1 border outline-none rounded-md w-full`}
                  />
                </div>
              </div>
              <div className="flex justify-between gap-4">
                <div className="mb-4 w-[100%]">
                  {/* Input for Min Reward */}
                  <label className="block text-sm font-medium text-gray-700">
                    {t(`Condition3`)} 
                  </label>
                  <input
                    type="number"
                    name="min_reward"
                    required={true}
                    value={formData.min_reward}
                    onChange={handleInputChange}
                    className={`mt-1 p-1 border outline-none rounded-md w-full`}
                  />
                </div>
                <div className="mb-4 w-[100%]">
                  {/* Input for Max Reward */}
                  <label className="block text-sm font-medium text-gray-700">
                    {t(`Value3`)}
                  </label>
                  <input
                    type="number"
                    required={true}
                    name="max_reward"
                    value={formData.max_reward}
                    onChange={handleInputChange}
                    className={`mt-1 p-1 border outline-none rounded-md w-full`}
                  />
                </div>
              </div>
              <div className="flex justify-between gap-4">
                <div className="mb-4 w-[100%]">
                  {/* Input for Min Reward */}
                  <label className="block text-sm font-medium text-gray-700">
                    {t(`Condition4`)} 
                  </label>
                  <input
                    type="number"
                    name="min_reward"
                    required={true}
                    value={formData.min_reward}
                    onChange={handleInputChange}
                    className={`mt-1 p-1 border outline-none rounded-md w-full`}
                  />
                </div>
                <div className="mb-4 w-[100%]">
                  {/* Input for Max Reward */}
                  <label className="block text-sm font-medium text-gray-700">
                    {t(`Value4`)}
                  </label>
                  <input
                    type="number"
                    required={true}
                    name="max_reward"
                    value={formData.max_reward}
                    onChange={handleInputChange}
                    className={`mt-1 p-1 border outline-none rounded-md w-full`}
                  />
                </div>
              </div>
              <div className="flex justify-between gap-4">
                <div className="mb-4 w-[100%]">
                  {/* Input for Min Reward */}
                  <label className="block text-sm font-medium text-gray-700">
                    {t(`Condition5`)} 
                  </label>
                  <input
                    type="number"
                    name="min_reward"
                    required={true}
                    value={formData.min_reward}
                    onChange={handleInputChange}
                    className={`mt-1 p-1 border outline-none rounded-md w-full`}
                  />
                </div>
                <div className="mb-4 w-[100%]">
                  {/* Input for Max Reward */}
                  <label className="block text-sm font-medium text-gray-700">
                    {t(`Value5`)}
                  </label>
                  <input
                    type="number"
                    required={true}
                    name="max_reward"
                    value={formData.max_reward}
                    onChange={handleInputChange}
                    className={`mt-1 p-1 border outline-none rounded-md w-full`}
                  />
                </div>
              </div>
              <div className="mb-4">
                {/* Input for Rules */}
                <label className="block text-sm font-medium text-gray-700">
                  {t(`Rules`)}
                </label>

                <ReactQuill
                  theme="snow"
                  value={formData?.rules}
                  onChange={(value) =>
                    setFormData({ ...formData, rules: value })
                  }
                />
              </div>
            
              <div className="flex  pb-5 gap-2">
                {id == 1 && (
                  <div className="flex gap-4 mb-4  w-[100%]">
                    <button
                      style={{ backgroundColor: bg }}
                      type="submit"
                      className={`  text-white font-semibold p-1 w-[100%] px-4 rounded-[6px]  `}
                      mr={3}
                    >
                      {loading ? (
                        <LoadingSpinner
                          color="white"
                          size="sm"
                          thickness={"2px"}
                        />
                      ) : (
                        `${t(`Add`)} ${t(`Vip`)} ${t(`Level`)}` 
                      )}
                    </button>
                    <button
                      onClick={onClose}
                      className={` bg-white  border ${border} font-semibold p-1 px-4 w-[100%] rounded-[6px]  `}
                    >
                      {t(`Cancel`)}
                    </button>
                  </div>
                )}
              </div>
            </form>
            {id == 2 && (
              <div className="flex gap-4 mb-4">
                <button
                  style={{ backgroundColor: bg }}
                  onClick={() => UpdateContribution(formData._id)}
                  className={`  text-white font-semibold p-1 w-[100%] px-4 rounded-[6px]  `}
                  mr={3}
                >
                  {updateLoading ? (
                    <LoadingSpinner color="white" size="sm" thickness={"2px"} />
                  ) : (
                    ` ${t(`Update`)} ${t(`Level`)}`
                  )}
                </button>
                <button
                  onClick={onClose}
                  className={` bg-white  border ${border} font-semibold p-1 px-4 w-[100%] rounded-[6px]  `}
                >
                  {t(`Cancel`)}
                </button>
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddNewVipLevel;


