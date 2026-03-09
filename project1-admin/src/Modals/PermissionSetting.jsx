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
  FormControl,
  FormLabel,
  Switch,
} from "@chakra-ui/react";
import { IoEyeSharp } from "react-icons/io5";
import { IoEyeOffSharp } from "react-icons/io5";
import { IoIosPersonAdd } from "react-icons/io";

import adduser from "../assets/addnewuser.png";
import { useEffect, useState } from "react";
import { MdOutlineDashboard } from "react-icons/md";
import { RiFolderSettingsFill, RiLockPasswordFill } from "react-icons/ri";
import changePassword from "../assets/changePassword.png";
import { useSelector } from "react-redux";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import { fetchGetRequest, sendPatchRequest } from "../api/api";
import { useTranslation } from "react-i18next";

function updateArr2BasedOnArr1(arr1, arr2) {
  const updatedArr2 = arr1.map((item2) => {
    const correspondingItem1 = arr2?.find((item1) => item1.name === item2.name);
    if (correspondingItem1 && correspondingItem1.value) {
      return { ...item2, value: true };
    } else return { ...item2, value: false };
  }).sort((a, b)=> b.value-a.value);

  return updatedArr2;
}





function PermissionSetting({ adminid, singledata, permissionsData }) {
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
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [singleLoading, setSingleLoading] = useState(false);
  const [allPermission, setAllPermission] = useState([]);
  const [switchStates, setSwitchStates] = useState({});
  const [allLowerPermission,setAllLowerPermission ]=useState(permissionsData||[])
  const { t, i18n } = useTranslation();

  const getSinglePermission = async () => {
    setSingleLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/permission/get-single-permission?role_type=${singledata?.role_type}`;

    try {
      let response = await fetchGetRequest(url);
      const data = response.data;
      setSingleLoading(false);
      const check = updateArr2BasedOnArr1(response?.data, allLowerPermission);
      setAllPermission(check);
      const initialSwitchStates = {};
      check?.forEach((switchItem) => {
        initialSwitchStates[switchItem.name] = switchItem.value;
      });
      setSwitchStates(initialSwitchStates);
    } catch (error) {
      toast({
        description: `${error?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      console.log(error);
      setSingleLoading(false);
    }
  };

  useEffect(() => {
    getSinglePermission();
  }, []);
  // Initialize switch states based on permissions data
  useState(() => {
    const initialSwitchStates = {};
    allPermission?.forEach((switchItem) => {
      initialSwitchStates[switchItem.name] = switchItem.value;
    });
    setSwitchStates(initialSwitchStates);
  }, [allPermission]);

  const toggleSwitch = (name, data) => {
    setSwitchStates((prevSwitchStates) => ({
      ...prevSwitchStates,
      [name]: !prevSwitchStates[name]
    }));

if(!switchStates[name]){
  setAllLowerPermission((prev)=>[...prev,{...data, value:true}])
}
else if(switchStates[name]){
  setAllLowerPermission((prev)=>prev.filter((ele)=>ele.name!==data.name ))
}
  };
  const handleUpdate = async () => {
    setLoading(true);

    // const payload = Object.entries(allLowerPermission).map(([name, value]) => {
    //   const permission = allPermission.find((item) => item.name === name);
    //   return {
    //     name: permission.name,
    //     value,
    //   };
    // });

    const payload=allLowerPermission

    const finalpayload = {
      ...singledata,
      permissions: payload,
    };

    try {
      let url = `${
        import.meta.env.VITE_API_URL
      }/api/admin/update-single-admin/${adminid}`;
      let response = await sendPatchRequest(url, finalpayload);
      const data = response.data;

      toast({
        description: response?.message,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      getSinglePermission();
      setLoading(false);
    } catch (error) {
      console.log(error, "error");
      toast({
        description: `${error?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <>
      <button
        onClick={onOpen}
        style={{ border: `1px solid ${border}`, backgroundColor: primaryBg }}
        className={`w-[25px] flex items-center border  justify-center rounded-[6px] h-[25px]`}
      >
        <RiFolderSettingsFill
          onClick={onOpen}
          fontSize={"20px"}
          cursor={"pointer"}
          color={iconColor}
        />
      </button>

      <Modal size={["full", "2xl", "2xl"]} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <div className=" flex flex-col items-center justify-center mt-5">
              <div className="flex items-center flex-col">
                <img className="w-[60px]" src={changePassword} alt="" />
                <p className="text-lg mt-4 font-bold">
                  {t(`Permission`)} {t(`access`)}
                </p>
                <p className="text-sm font-medium">
                  {t(`Give the Permission to the Admin`)}
                </p>
              </div>
              <div className="flex gap-5 mt-8 flex-col sm:flex-row w-[100%] items-center justify-between">
                <div
                  style={{ border: `1px solid ${border}` }}
                  className="flex w-[100%]  p-2 rounded-sm  flex-col gap-4"
                >
                  <p
                    style={{ color: iconColor }}
                    className="text-center border-b pb-2  w-[100%] font-semibold"
                  >
                    {t(`Your`)} {t(`Permissions`)}
                  </p>
                  <div className="h-[500px] flex flex-col gap-2 overflow-scroll">
                    {allPermission?.map((switchItem) => (
                      <div key={switchItem.name}>
                        <div className="flex items-center text-sm font-semibold justify-between">
                          <label htmlFor={`switch-${switchItem.name}`}>
                            {switchItem.name}:
                          </label>
                          <Switch
                            id={`switch-${switchItem.name}`}
                            onChange={() => toggleSwitch(switchItem.name, switchItem)}
                            isChecked={switchStates[switchItem.name]}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  style={{ border: `1px solid ${border}` }}
                  className="flex  w-[100%] border p-2 rounded-sm  flex-col gap-4"
                >
                  <p
                    style={{ color: iconColor }}
                    className="text-center border-b pb-2 w-[100%] font-semibold"
                  >
                    {singledata?.username} {t(`Permissions`)}
                  </p>
                  <div className="h-[500px] flex flex-col gap-2 overflow-scroll">
                    {allLowerPermission?.map((switchItem) => (
                      <div key={switchItem.name}>
                        <div className="flex items-center text-sm font-semibold justify-between">
                          <label htmlFor={`switch-${switchItem.name}`}>
                            {switchItem.name}:
                          </label>
                          <Switch
                            readOnly
                            colorScheme="green"
                            id={`switch-${switchItem.name}`}
                            // onChange={() => toggleSwitch(switchItem._id)}kkkk
                            isChecked={switchItem?.value}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex w-[100%] my-5 mt-6 gap-5 justify-between">
                <button
                  onClick={handleUpdate}
                  style={{ backgroundColor: bg }}
                  className={` w-[100%] text-white px-4 font-semibold py-[6px] rounded-md`}
                  type="submit"
                >
                  {loading ? (
                    <LoadingSpinner color="white" size="sm" thickness={"2px"} />
                  ) : (
                    `${t(`Update`)}`
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
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default PermissionSetting;
