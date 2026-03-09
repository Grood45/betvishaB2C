import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
} from "@chakra-ui/react";
import { IoEyeSharp } from "react-icons/io5";
import { IoEyeOffSharp } from "react-icons/io5";
import { IoIosPersonAdd } from "react-icons/io";

import adduser from "../assets/addnewuser.png";
import { useState } from "react";
import { MdOutlineDashboard } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import changePassword from "../assets/changePassword.png";
import { useSelector } from "react-redux";
import { FaUserLock } from "react-icons/fa";
import { sendPatchRequest } from "../api/api";
import LoadingSpinner from "./loading/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function AdminChangePassword({ code }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    color,
    primaryBg,
    secondaryBg,
    iconColor,
    bg,
    hoverColor,
    hover,
    text,
    font,
    border,
  } = useSelector((state) => state.theme);
  const [hoveredId, setHoveredId] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
const [adminPasswordLoading,setAdminPasswordLoading]=useState(false)
const toast=useToast()
const navigate=useNavigate()
const { t, i18n } = useTranslation();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const payload = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };
    setAdminPasswordLoading(true);
    try {
      const response = await sendPatchRequest(`${import.meta.env.VITE_API_URL}/api/admin/admin-self-reset-password`,
        payload
      );
      toast({
        title: response.message,
        status: "success",
        duration: 2000,
        position: "top",
        isClosable: true,

      });
      setNewPassword("")
      setOldPassword("")
      setAdminPasswordLoading(false);
      onClose()
      navigate("/login")
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: "error",
        duration: 2000,
        position: "top",
        isClosable: true,
      });
      console.log(error, "erroro");
    }
    setAdminPasswordLoading(false);
  };

  return (
    <>
      {code == 1 && (
        <p
          onClick={onOpen}
          onMouseEnter={() => setHoveredId(true)}
          onMouseLeave={() => setHoveredId(false)}
          style={{
            backgroundColor: hoveredId ? hoverColor : "",
            // Add other styles as needed
          }}
          className={`text-sm duration-500 ease-in-out  hover:text-white rounded-lg p-3 cursor-pointer font-semibold`}
        >
          {t(`Change`)} {t(`Password`)}
        </p>
      )}
      {code == 2 && (
        <button
          style={{ backgroundColor: bg }}
          onClick={onOpen}
          className={` flex items-center gap-1  duration-500 ease-in-out  text-white rounded-md p-2  text-xs cursor-pointer px-4 font-semibold`}
        >
          <FaUserLock fontSize={"20px"} /> {t(`Change`)} {t(`Password`)}
        </button>
      )}

      <Modal size={["sm", "sm"]} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <div className=" flex flex-col items-center justify-center mt-5">
              <div className="flex items-center flex-col">
                <img className="w-[60px]" src={changePassword} alt="" />
                <p className="text-sm mt-4 font-bold">
                  {t(`Please`)} {t(`Enter`)} {t(`Your`)} {t(`Password`)}
                </p>
                <p className="text-sm font-medium">
                  {t(`Enter`)} {t(`your`)} {t(`password`)} {t(`to`)} {(t`make`)} {t(`this`)} {t(`change`)}
                </p>
              </div>
              <div className="w-[100%] mt-6">
                <form onSubmit={handleUpdatePassword}>
                  <div className="mb-4 flex flex-col gap-4">
                    <div>
                      <label
                        className="block mb-1 font-semibold text-sm"
                        htmlFor="password"
                      >
                        {t(`Enter`)} {t(`your`)} {t(`old`)} {t(`password`)}:
                      </label>
                      <div className="relative">
                        <input
                          className="w-full px-3 py-1 outline-none border rounded-md"
                          type={showPassword ? "text" : "password"}
                          value={oldPassword}
                          onChange={(e)=>setOldPassword(e.target.value)}
                          required
                        />
                        <button
                          className="absolute top-0 right-0 mr-2 mt-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                          onClick={() => setShowPassword(!showPassword)}
                          type="button"
                        >
                          {showPassword ? (
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
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        className="block mb-1 font-semibold text-sm"
                        htmlFor="confirm_password"
                      >
                        {t(`Enter`)} {t(`new`)} {t(`password`)}:
                      </label>
                      <div className="relative">
                        <input
                          className="w-full px-3 py-1 outline-none border rounded-md"
                          type={showConfirmPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e)=>setNewPassword(e.target.value)}

                          required
                        />
                        <button
                          className="absolute top-0 right-0 mr-2 mt-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          type="button"
                        >
                          {showConfirmPassword ? (
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
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col my-5 mt-6 gap-5 justify-between">
                    <button
                      style={{ backgroundColor: bg }}
                      className={`w-[100%] text-white px-4 font-semibold py-[6px] rounded-md`}
                      type="submit"
                    >
                     {adminPasswordLoading?<LoadingSpinner color="red" size="sm" thickness={"2px"} /> :`${t(`Confirm`)}`}
                    </button>
                    <button
                      onClick={onClose}
                      className="bg-gray-300 font-semibold  w-[100%] py-[6px] rounded-md mr-2"
                      type="button"
                    >
                      {t(`Cancel`)}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AdminChangePassword;
