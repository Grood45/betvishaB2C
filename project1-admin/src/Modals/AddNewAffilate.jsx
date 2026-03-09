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
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import { fetchGetRequest, sendPostRequest } from "../api/api";
import Select from "react-select";
import countryList from "react-select-country-list";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useTranslation } from "react-i18next";

const initialState = {
  username: "",
  phone: "",
  email: "",
  password: "",
  confirm_password: "",
  amount: 0,
  country: "INDIA",
  exposure_limit: 0,
  currency: "INR",
};
function AddNewAffilate({ setAllUserData, allUserData }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phone, setPhoneNumber] = useState();
  const { t, i18n } = useTranslation();

  const {
    color,
    primaryBg,
    secondaryBg,
    bg,
    hoverColor,
    hover,
    text,
    font,
    border,
  } = useSelector((state) => state.theme);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [valid, setValid] = useState(false);
  const [userExist, setUserExist] = useState(false);
  const [value, setValue] = useState("");
  const toast = useToast();
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};
  const adminLayer = user.adminLayer;
  const CreateUser = async (e) => {
    e.preventDefault();
    if (formData?.password !== formData?.confirm_password) {
      toast({
        description: "Both password are not same",
        status: "warning",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      return;
    } else if (userExist) {
      toast({
        description: "User name should be unique",
        status: "warning",
        duration: 4000,
        position: "top",
        isClosable: true,
      });

      return;
    } else if (valid) {
      toast({
        description: "Not a valid user name",
        status: "warning",
        duration: 4000,
        position: "top",
        isClosable: true,
      });

      return;
    }
    const payload = {
      password: formData?.password,
      role_type: "affiliate",
      username: formData?.username,
      amount: formData?.amount,
      parent_admin_id: adminData?.admin_id,
      email: formData?.email,
      share_percentage:formData?.share_percentage,
      exposure_limit: formData?.exposure_limit,
      country: "INDIA",
      phone: formData?.phone,
      currency: "INR",
    };

    const url = `${import.meta.env.VITE_API_URL}/api/admin/create-admin-user`;
    try {
      setLoading(true);
      let response = await sendPostRequest(url, payload);
      toast({
        description: response.message,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
      setAllUserData((prev) => [response.data, ...prev]);
      // SecondaryCreateUser()
      onClose();
    } catch (error) {
      console.log(error, "error sf");
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



  const CheckUsernameExistence = async () => {
    const paylaod = {
      username: formData.username,
      type: "user",
    };
    let url = `${import.meta.env.VITE_API_URL}/api/admin/exist-or-not`;
    try {
      let response = await sendPostRequest(url, paylaod);

      setUserExist(response?.data?.exists || response?.exists);
    } catch (error) {
      setUserExist(error?.data?.exists || error?.exists);
      // toast({
      //   description: `${error?.data?.message}`,

      //   status: "error",
      //   duration: 4000,
      //   position: "top",
      //   isClosable: true,
      // });
      console.log(error);
    }
  };

  function checkUsername(username) {
    let hasAlpha = false;
    let hasNum = false;

    for (let char of username) {
      if (!isNaN(char)) {
        hasNum = true;
      } else {
        hasAlpha = true;
      }

      if (hasAlpha && hasNum) {
        return true;
      }
    }

    return false;
  }
  useEffect(() => {
    // Define a function to perform username validation
    const validateUsername = () => {
      if (formData.username.length > 3 && checkUsername(formData.username)) {
        setValid(false);
        CheckUsernameExistence();
      } else {
        setValid(true);
      }
    };

    let timer;
    if (formData.username.length > 3) {
      timer = setTimeout(validateUsername, 700);
    } else {
      setValid(false);
    }

    return () => clearTimeout(timer); // Cleanup function to clear the timer
  }, [formData.username]);

  const options = useMemo(() => countryList().getData(), []);

  const changeHandler = (value) => {
    setValue(value);
    setFormData((prevFormData) => ({ ...prevFormData, country: value?.label }));
  };
  useEffect(() => {
    changeHandler();
    setFormData((prevFormData) => ({ ...prevFormData, phone: phone }));
  }, [phone]);

  return (
    <>
      <div
        onClick={onOpen}
        // className="flex items-end bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ... p-[2px]   rounded-[6px] justify-end"
      >
        <button
          style={{ backgroundColor: bg }}
          className={`flex items-center p-2 gap-2 rounded-[6px] text-xs md:text-sm text-white font-bold `}
        >
          <IoIosPersonAdd fontSize="20px" />
          {t(`Add`)} {t(`New`)} {t(`Affilate`)}
        </button>
      </div>
      <Modal size={["sm", "md"]} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col items-center justify-center mt-5">
              <div className="flex items-center flex-col">
                <img className="w-[60px]" src={adduser} alt="" />
                <p className="text-sm font-semibold">
                  {t(`Add`)} {t(`New`)} {t(`Affiliate`)}
                </p>
              </div>

              <div className="w-[100%] mt-6">
                <form onSubmit={CreateUser}>
                  {/* Username Input */}
                  <div className="mb-3 flex gap-4 justify-between w-full gap-4">
                    <div className="w-full">
                      <label
                        className="block mb-1 font-semibold text-sm"
                        htmlFor="username"
                      >
                        {t(`Username`)}:
                      </label>
                      <input
                        className={`w-full px-3 border ${
                          valid ? "border-red-500" : ""
                        } py-1 outline-none border rounded-md`}
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                      {userExist ? (
                        <p className="text-xs font-semibold text-red-500">
                          {t(`Username already exists`)}
                        </p>
                      ) : (
                        <p className="text-[9px] font-semibold">
                          {t(
                            `Username must include alphabet and numeric value e.g. xyz123`
                          )}
                        </p>
                      )}
                    </div>
                    <div className="mb-4 flex w-full gap-4">
                      <div className="mb-4">
                        <label
                          className="block mb-1 text-sm font-semibold"
                          htmlFor="share_percentage"
                        >
                          {t(`Percentage`)}:
                        </label>
                        <div className="w-[100%] justify-center flex pr-1 border rounded-md">
                          <p
                            style={{ backgroundColor: bg }}
                            className="text-white text-xl font-bold w-[20%] rounded-md flex items-center justify-center"
                          >
                            %
                          </p>
                          <input
                            className="w-[100%] px-3 py-1 outline-none"
                            type="number"
                            id="share_percentage"
                            name="share_percentage"
                            value={formData?.share_percentage}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="mb-4 flex gap-4">
                    <div>
                      <label
                        className="block mb-1 font-semibold text-sm"
                        htmlFor="password"
                      >
                        {t(`Password`)}:
                      </label>
                      <div className="relative">
                        <input
                          className="w-full px-3 py-1 outline-none border rounded-md"
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
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
                              fontSize="20px"
                              color="gray"
                            />
                          ) : (
                            <IoEyeOffSharp
                              cursor={"pointer"}
                              fontSize="20px"
                              color="gray"
                            />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                      <label
                        className="block mb-1 font-semibold text-sm"
                        htmlFor="confirm_password"
                      >
                        {t(`Confirm Password`)}:
                      </label>
                      <div className="relative">
                        <input
                          className="w-full px-3 py-1 outline-none border rounded-md"
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirm_password"
                          name="confirm_password"
                          value={formData.confirm_password}
                          onChange={handleChange}
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
                              fontSize="20px"
                              color="gray"
                            />
                          ) : (
                            <IoEyeOffSharp
                              cursor={"pointer"}
                              fontSize="20px"
                              color="gray"
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Deposit Percentage Input */}

                  <div className="flex justify-between w-[100%] gap-4">
                    {/* New Bank Name Input */}
                    <div className="mb-4 flex gap-4">
                      <div className="w-full">
                        <label
                          className="block mb-1 font-semibold text-sm"
                          htmlFor="bank_name"
                        >
                          {t(`Bank Name`)}:
                        </label>
                        <input
                          className="w-full px-3 py-1 outline-none border rounded-md"
                          type="text"
                          id="bank_name"
                          name="bank_name"
                          value={formData.bank_name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* New IFSC Code Input */}
                    <div className="mb-4 flex gap-4">
                      <div className="w-full">
                        <label
                          className="block mb-1 font-semibold text-sm"
                          htmlFor="ifsc_code"
                        >
                          {t(`IFSC Code`)}:
                        </label>
                        <input
                          className="w-full px-3 py-1 outline-none border rounded-md"
                          type="text"
                          id="ifsc_code"
                          name="ifsc_code"
                          value={formData.ifsc_code}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between w-[100%] gap-4">
                    {/* New Account Number Input */}
                    <div className="mb-4 flex gap-4">
                      <div className="w-full">
                        <label
                          className="block mb-1 font-semibold text-sm"
                          htmlFor="account_number"
                        >
                          {t(`Account Number`)}:
                        </label>
                        <input
                          className="w-full px-3 py-1 outline-none border rounded-md"
                          type="text"
                          id="account_number"
                          name="account_number"
                          value={formData.account_number}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* New Bank Holder Name Input */}
                    <div className="mb-4 flex gap-4">
                      <div className="w-full">
                        <label
                          className="block mb-1 font-semibold text-sm"
                          htmlFor="holder_name"
                        >
                          {t(`Bank Holder Name`)}:
                        </label>
                        <input
                          className="w-full px-3 py-1 outline-none border rounded-md"
                          type="text"
                          id="holder_name"
                          name="holder_name"
                          value={formData.holder_name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit and Cancel Buttons */}
                  <div className="flex my-5 mt-6 gap-2 justify-between">
                    <button
                      onClick={onClose}
                      className="bg-gray-300 font-semibold w-[100%] py-[6px] rounded-md mr-2"
                      type="button"
                    >
                      {t(`Cancel`)}
                    </button>
                    <button
                      style={{ backgroundColor: bg }}
                      className={`w-[100%] text-white px-4 font-semibold py-[6px] rounded-md`}
                      type="submit"
                    >
                      {loading ? (
                        <LoadingSpinner
                          color="white"
                          size="sm"
                          thickness={"2px"}
                        />
                      ) : (
                        `${t(`Create`)}`
                      )}
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

export default AddNewAffilate;
