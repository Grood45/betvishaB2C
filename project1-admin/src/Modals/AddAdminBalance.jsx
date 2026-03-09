import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PiBankFill } from "react-icons/pi";
import { FaUserLock } from "react-icons/fa";
import { RiExchangeDollarLine } from "react-icons/ri";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import { retrieveUserDetails } from "../redux/middleware/localstorageconfig";
import { sendPostRequest } from "../api/api";

import {
  loginSuccess,
  updateAdminFailure,
  updateAdminRequest,
  updateAdminSuccess,
} from "../redux/auth-redux/actions";
import { useTranslation } from "react-i18next";

function AddAdminBalance({ code, getAdmin }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [chip, setChip] = useState(0);
  const [totalBalance, setTotalBalance] = useState();
  const [hoveredId, setHoveredId] = useState(false);
  const params = useParams();
  const {
    color,
    primaryBg,
    secondaryBg,
    bg,
    iconColor,
    hoverColor,
    hover,
    text,
    font,
    border,
  } = useSelector((state) => state.theme);
  const toast = useToast();
const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [adminResponse, setAdminResponse] = useState("");
  const user = useSelector((state) => state.authReducer);
  const adminDetails = user.user || {};
  const handleTotal = (e) => {
    setChip(e.target.value);
  };
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateAdminRequest());
    const payload = { admin_response: adminResponse, new_amount: chip };
    const url = `${import.meta.env.VITE_API_URL}/api/admin/create-chip/${
      adminDetails.admin_id
    }`;
    setLoading(true);
    try {
      let response = await sendPostRequest(url, payload);
      toast({
        description: `${response?.message}`,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      dispatch(updateAdminSuccess(response.data));
      // getAdmin();
      setLoading(false);
      onClose();
    } catch (error) {
      toast({
        description: `${error?.data?.message || error?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      dispatch(updateAdminFailure());
      setLoading(false);
    }
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
          className={`w-[100%] cursor-pointer duration-500  ease-in-out  hover:text-white rounded-lg p-3  text-sm font-semibold`}
        >
          {t(`Generate`)} {t(`Amount`)}
        </p>
      )}

      {code == 2 && (
        <button
          onClick={onOpen}
          style={{ backgroundColor: bg }}
          className={` flex items-center gap-1  duration-500 ease-in-out  text-white rounded-md p-2 text-xs cursor-pointer px-4 font-semibold`}
        >
          <RiExchangeDollarLine fontSize={"20px"} /> {t(`Generate`)} {t(`Amount`)}
        </button>
      )}
      <Modal size="sm" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent style={{ backgroundColor: "white", color: "black" }}>
          <ModalCloseButton />
          <ModalBody>
            <div className=" flex flex-col items-center justify-center mt-5">
              <div className="flex items-center flex-col">
                <PiBankFill style={{ color: iconColor }} fontSize={"40px"} />
                <p className="text-sm mt-4 font-bold">
                  {t(`Please`)} {t(`Generate`)} {t(`Your`)} {t(`Amount`)}
                </p>
                {/* <p className="text-sm font-medium">Enter your Password to make this change</p> */}
              </div>
              <div className="w-[100%] mt-6">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4 flex flex-col gap-4">
                    <label
                      className="block mb-1 font-semibold text-sm"
                      htmlFor="password"
                    >
                      {t(`Available`)} {t(`Balance`)}: {adminDetails?.amount?.toFixed(2)}
                    </label>

                    <div>
                      <label
                        className="block mb-1 font-semibold text-sm"
                        htmlFor="confirm_password"
                      >
                        {t(`Enter`)} {t(`Amount`)}:
                      </label>
                      <div className="relative">
                        <input
                          className="w-full px-3 py-1 outline-none border rounded-md"
                          type="number"
                          required
                          value={chip}
                          onChange={handleTotal}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        className="block mb-1 font-semibold text-sm"
                        htmlFor="confirm_password"
                      >
                        {t(`Remarks`)}:
                      </label>
                      <div className="relative">
                        <textarea
                          className="w-full px-3 py-1 outline-none border rounded-md"
                          type="number"
                          onChange={(e) => setAdminResponse(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col my-5 mt-6 gap-5 justify-between">
                    <button
                      style={{ backgroundColor: bg }}
                      className={` w-[100%] text-white px-4 font-semibold py-[6px] rounded-md`}
                      type="submit"
                    >
                      {loading ? (
                        <LoadingSpinner
                          color="white"
                          thickness={"2px"}
                          size="sm"
                        />
                      ) : (
                        `${t(`Generate`)} ${t(`Amount`)}`
                      )}
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

export default AddAdminBalance;
