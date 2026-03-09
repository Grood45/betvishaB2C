import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchGetRequest, sendPatchRequest, sendPostRequest } from "../api/api";
import { AiFillPlusCircle } from "react-icons/ai";
import {
  Button,
  Checkbox,
  Input,
  Radio,
  RadioGroup,
  Stack,
  useToast,
} from "@chakra-ui/react";
import {
  IoLogoFacebook,
  IoLogoWhatsapp,
  IoLogoInstagram,
} from "react-icons/io5";
import { HiOutlineLink } from "react-icons/hi";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import img1 from "./../assets/admin.jpeg";
import { MdDelete, MdKeyboardArrowUp } from "react-icons/md";
import CreateLink from "../Modals/CreateLink";
import { FaEdit, FaTwitterSquare } from "react-icons/fa";
import GameCategorySetting from "./adminSettingComponent/GameCategorySetting";
import FooterManage from "./adminSettingComponent/FooterManage";
import { useTranslation } from "react-i18next";
import { checkPermission } from "../../utils/utils";
import { BsLinkedin } from "react-icons/bs";
const AdminSetting = () => {
  const [socialData, setSocialData] = useState({});
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [gameCategory, setGameCategory] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [uploadImageLoading, setUploadImageLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState("");
  const [categoryName, setNewCategoryName] = useState("");
const { t, i18n } = useTranslation();
  
  const toast = useToast();
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

  const handleLinkChange = (id, value) => {
    setSocialData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const data = [
    {
      id: "facebook",
      title: "Facebook",
      icon: <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="m23 12c0-6.07578-4.9242-11-11-11-6.07578 0-11 4.92422-11 11 0 5.4914 4.02187 10.0418 9.2812 10.8668v-7.6871h-2.79292v-3.1797h2.79292v-2.42344c0-2.75644 1.6415-4.27968 4.1551-4.27968 1.2032 0 2.4621.21484 2.4621.21484v2.70703h-1.3879c-1.3664 0-1.7917.84863-1.7917 1.71875v2.0625h3.0507l-.4877 3.1797h-2.563v7.6871c5.2593-.825 9.2812-5.3754 9.2812-10.8668z" fill="#1877f2"/><path d="m16.2818 15.1797.4877-3.1797h-3.0507v-2.0625c0-.87012.4253-1.71875 1.7917-1.71875h1.3879v-2.70703s-1.2589-.21484-2.4621-.21484c-2.5136 0-4.1551 1.52324-4.1551 4.27968v2.42344h-2.79292v3.1797h2.79292v7.6871c.5608.0881 1.1344.1332 1.7188.1332s1.158-.0451 1.7188-.1332v-7.6871z" fill="#fff"/></svg>,
      link: socialData?.facebook || "",
    },
    {
      id: "whatsapp",
      title: "WhatsApp",
      icon: <svg fill="none" height="24" viewBox="0 0 32 32" width="24" xmlns="http://www.w3.org/2000/svg"><path d="m0 16c0 8.8366 7.16344 16 16 16 8.8366 0 16-7.1634 16-16 0-8.83656-7.1634-16-16-16-8.83656 0-16 7.16344-16 16z" fill="#25d366"/><path clip-rule="evenodd" d="m21.6 10.3c-1.5-1.5-3.5-2.3-5.6-2.3-4.4 0-8 3.6-8 8 0 1.4.40001 2.8 1.10001 4l-1.10001 4 4.2-1.1c1.2.6 2.5 1 3.8 1 4.4 0 8-3.6 8-8 0-2.1-.9-4.1-2.4-5.6zm-5.6 12.3c-1.2 0-2.4-.3-3.4-.9l-.2-.1-2.50001.7.70001-2.4-.2-.3c-.70001-1.1-1.00001-2.3-1.00001-3.5 0-3.6 3.00001-6.6 6.60001-6.6 1.8 0 3.4.7 4.7 1.9 1.3 1.3 1.9 2.9 1.9 4.7 0 3.5-2.9 6.5-6.6 6.5zm3.6-5c-.2-.1-1.2-.6-1.4-.6-.2-.1-.3-.1-.4.1s-.5.6-.6.8c-.1.1-.2.1-.4.1-.2-.1-.8-.3-1.6-1-.6-.5-1-1.2-1.1-1.4s0-.3.1-.4.2-.2.3-.3.1-.2.2-.3 0-.2 0-.3-.4-1.1-.6-1.5c-.1-.3-.3-.3-.4-.3s-.2 0-.4 0c-.1 0-.3 0-.5.2s-.7.7-.7 1.7.7 1.9.8 2.1c.1.1 1.4 2.2 3.4 3 1.7.7 2 .5 2.4.5s1.2-.5 1.3-.9c.2-.5.2-.9.1-.9-.1-.5-.3-.5-.5-.6z" fill="#fff" fill-rule="evenodd"/></svg>,
      link: socialData?.whatsapp || "",
    },
    {
      id: "instagram",
      title: "Instagram",
      icon: <svg fill="none" height="24" viewBox="0 0 32 32" width="24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><radialGradient id="a" cx="0" cy="0" gradientTransform="matrix(14.50001629 -20.99998838 20.99998838 14.50001629 12 23)" gradientUnits="userSpaceOnUse" r="1"><stop offset="0" stop-color="#b13589"/><stop offset=".79309" stop-color="#c62f94"/><stop offset="1" stop-color="#8a3ac8"/></radialGradient><radialGradient id="b" cx="0" cy="0" gradientTransform="matrix(9.49998144 -20.49995674 20.49995674 9.49998144 11 31)" gradientUnits="userSpaceOnUse" r="1"><stop offset="0" stop-color="#e0e8b7"/><stop offset=".444662" stop-color="#fb8a2e"/><stop offset=".71474" stop-color="#e2425c"/><stop offset="1" stop-color="#e2425c" stop-opacity="0"/></radialGradient><radialGradient id="c" cx="0" cy="0" gradientTransform="matrix(38.50002699 -5.50000224 1.17639341 8.23475632 .500002 3)" gradientUnits="userSpaceOnUse" r="1"><stop offset=".156701" stop-color="#406adc"/><stop offset=".467799" stop-color="#6a45be"/><stop offset="1" stop-color="#6a45be" stop-opacity="0"/></radialGradient><rect fill="url(#a)" height="28" rx="6" width="28" x="2" y="2"/><rect fill="url(#b)" height="28" rx="6" width="28" x="2" y="2"/><rect fill="url(#c)" height="28" rx="6" width="28" x="2" y="2"/><g fill="#fff"><path d="m23 10.5c0 .8284-.6716 1.5-1.5 1.5s-1.5-.6716-1.5-1.5c0-.82843.6716-1.5 1.5-1.5s1.5.67157 1.5 1.5z"/><path clip-rule="evenodd" d="m16 21c2.7614 0 5-2.2386 5-5s-2.2386-5-5-5-5 2.2386-5 5 2.2386 5 5 5zm0-2c1.6569 0 3-1.3431 3-3s-1.3431-3-3-3-3 1.3431-3 3 1.3431 3 3 3z" fill-rule="evenodd"/><path clip-rule="evenodd" d="m6 15.6c0-3.3603 0-5.0405.65396-6.32394.57524-1.12898 1.49312-2.04686 2.6221-2.6221 1.28344-.65396 2.96364-.65396 6.32394-.65396h.8c3.3603 0 5.0405 0 6.3239.65396 1.129.57524 2.0469 1.49312 2.6221 2.6221.654 1.28344.654 2.96364.654 6.32394v.8c0 3.3603 0 5.0405-.654 6.3239-.5752 1.129-1.4931 2.0469-2.6221 2.6221-1.2834.654-2.9636.654-6.3239.654h-.8c-3.3603 0-5.0405 0-6.32394-.654-1.12898-.5752-2.04686-1.4931-2.6221-2.6221-.65396-1.2834-.65396-2.9636-.65396-6.3239zm9.6-7.6h.8c1.7132 0 2.8777.00156 3.7779.0751.8769.07164 1.3253.20149 1.6381.36087.7526.3835 1.3645.99542 1.748 1.74803.1594.3128.2893.7612.3609 1.6381.0735.9002.0751 2.0647.0751 3.7779v.8c0 1.7132-.0016 2.8777-.0751 3.7779-.0716.8769-.2015 1.3253-.3609 1.6381-.3835.7526-.9954 1.3645-1.748 1.748-.3128.1594-.7612.2893-1.6381.3609-.9002.0735-2.0647.0751-3.7779.0751h-.8c-1.7132 0-2.8777-.0016-3.7779-.0751-.8769-.0716-1.3253-.2015-1.6381-.3609-.75261-.3835-1.36453-.9954-1.74803-1.748-.15938-.3128-.28923-.7612-.36087-1.6381-.07354-.9002-.0751-2.0647-.0751-3.7779v-.8c0-1.7132.00156-2.8777.0751-3.7779.07164-.8769.20149-1.3253.36087-1.6381.3835-.75261.99542-1.36453 1.74803-1.74803.3128-.15938.7612-.28923 1.6381-.36087.9002-.07354 2.0647-.0751 3.7779-.0751z" fill-rule="evenodd"/></g></svg>,
      link: socialData?.instagram || "",
    },
    {
      id: "linkedin",
      title: "linkedin",
      icon: <svg height="24"  width="24" enable-background="new 0 0 112.196 112.196" viewBox="0 0 112.196 112.196" xmlns="http://www.w3.org/2000/svg"><circle cx="56.098" cy="56.097" fill="#007ab9" r="56.098"/><path d="m89.616 60.611v23.128h-13.409v-21.578c0-5.418-1.936-9.118-6.791-9.118-3.705 0-5.906 2.491-6.878 4.903-.353.862-.444 2.059-.444 3.268v22.524h-13.41s.18-36.546 0-40.329h13.411v5.715c-.027.045-.065.089-.089.132h.089v-.132c1.782-2.742 4.96-6.662 12.085-6.662 8.822 0 15.436 5.764 15.436 18.149zm-54.96-36.642c-4.587 0-7.588 3.011-7.588 6.967 0 3.872 2.914 6.97 7.412 6.97h.087c4.677 0 7.585-3.098 7.585-6.97-.089-3.956-2.908-6.967-7.496-6.967zm-6.791 59.77h13.405v-40.33h-13.405z" fill="#f1f2f2"/></svg>,
      link: socialData?.linkedin || "",
    },
    {
      id: "twitter",
      title: "twitter",
      icon: <svg eight="24"  width="24" enable-background="new 0 0 1024 1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><circle cx="512" cy="512" fill="#1da1f2" r="512"/><path d="m778 354.8c-18.8 8.3-38.9 13.9-60.1 16.5 21.6-13 38.2-33.5 46-57.9-20.2 11.8-42.7 20.4-66.5 25.2-19.1-20.4-46.2-33.2-76.4-33.2-57.8 0-104.7 46.9-104.7 104.6 0 8.3 1 16.3 2.7 23.9-87-4.1-164.2-45.9-215.8-109.1-9.1 15.4-14.2 33.2-14.2 52.7 0 36.4 18.5 68.4 46.6 87.2-17.2-.6-33.3-5.3-47.4-13.1v1.3c0 50.8 36 93.1 84 102.7-8.8 2.4-18.1 3.6-27.6 3.6-6.7 0-13.1-.6-19.5-1.8 13.4 41.6 52 71.9 98 72.7-35.7 28.1-81.1 44.8-129.8 44.8-8.3 0-16.6-.5-24.9-1.4 46.6 29.7 101.5 47 160.8 47 192.5 0 297.8-159.5 297.8-297.6 0-4.4 0-8.9-.3-13.4 20.4-14.7 38.3-33.2 52.3-54.2z" fill="#fff"/></svg>,
      link: socialData?.twitter || "",
    },
    {
      id: "teligram",
      title: "teligram",
      icon: <svg height="24" preserveAspectRatio="xMidYMid" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg"><path d="m128 0c-70.693 0-128 57.307-128 128 0 70.693 57.307 128 128 128 70.693 0 128-57.307 128-128 0-70.693-57.307-128-128-128z" fill="#40b3e0"/><path d="m190.2826 73.6308-22.862 115.267s-3.197 7.994-11.99 4.157l-52.758-40.448-19.184-9.272-32.294-10.872s-4.956-1.758-5.436-5.595c-.479-3.837 5.596-5.915 5.596-5.915l128.376-50.36s10.552-4.636 10.552 3.038" fill="#fff"/><path d="m98.6178 187.6035s-1.54-.144-3.459-6.22c-1.918-6.075-11.67-38.049-11.67-38.049l77.537-49.24s4.477-2.718 4.317 0c0 0 .799.479-1.599 2.717-2.398 2.239-60.911 54.836-60.911 54.836" fill="#d2e5f1"/><path d="m122.9015 168.1154-20.868 19.026s-1.631 1.238-3.416.462l3.996-35.341" fill="#b5cfe4"/></svg>,
      link: socialData?.teligram || "",
    },
    {
      id: "youtube",
      title: "youtube",
      icon:
      <svg height="24" viewBox="0 0 64 64" width="24" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><circle cx="32" cy="32" fill="#e43535" r="30"/><path d="m41.7058241 42h-18.4116482c-2.3617968 0-4.2941759-1.9741935-4.2941759-4.3870968v-10.2258064c0-2.4129033 1.9323791-4.3870968 4.2941759-4.3870968h18.4116482c2.3617968 0 4.2941759 1.9741935 4.2941759 4.3870968v10.2258064c0 2.4129033-1.9323791 4.3870968-4.2941759 4.3870968zm-11.6576339-13.174434v8.1145l7.3516964-4.1894631z" fill="#fff"/></g></svg>,
      
       link: socialData?.teligram || "",
    },
    {
      id: "email",
      title: "email",
      icon:
      <svg   height="30" width="30" viewBox="0 0 425 512" xmlns="http://www.w3.org/2000/svg"><path d="m212.5 49q43.5 0 81.75 16.5t66.75 45 45 66.75 16.5 81.75-16.5 81.75-45 66.75-66.75 45-81.75 16.5-81.75-16.5-66.75-45-45-66.75-16.5-81.75 16.5-81.75 45-66.75 66.75-45 81.75-16.5zm-118 264.5 63-45-63-45zm236 20-77-55-41 29.5-41.5-29.5-76.5 55v30.5h236zm0-110-63 45 63 45zm0-69.5h-236v30.5l118 84 118-84z"/></svg>,
      
       link: socialData?.teligram || "",
    },
  ];

  const getSocailData = async () => {
    setLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/setting/get-setting/6532c132ed5efb8183a66703`;
    try {
      let response = await fetchGetRequest(url);
      setSocialData(response.data);

      setLoading(false);
    } catch (error) {
      // toast({
      //   description: `${error?.data?.message}`,
      //   status: "error",
      //   duration: 4000,
      //   position: "top",
      //   isClosable: true,
      // });
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/setting/update-setting/6532c132ed5efb8183a66703`;
    try {
      let response = await sendPatchRequest(url, socialData);
      setSocialData(response.data);
      toast({
        description: `Updated Successfully`,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      getSocailData();
      setUpdateLoading(false);
    } catch (error) {
      // toast({
      //   description: `${error?.data?.message}`,
      //   status: "error",
      //   duration: 4000,
      //   position: "top",
      //   isClosable: true,
      // });
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    getSocailData();
  }, []);

  const user = useSelector((state) => state.authReducer);

const adminData = user.user || {};
const isOwnerAdmin = adminData?.role_type === 'owneradmin';

const permissionDetails=user?.user?.permissions


let hasPermission=checkPermission(permissionDetails,"socialMediaManage")
let check=!isOwnerAdmin?hasPermission:true


 

  //

  return (
    <div className="w-[100%] px-2">
      <form
        onSubmit={handleUpdate}
        className={`bg-white shadow-md rounded px-3 lg:px-8  pt-6 pb-8 mb-4 border `}
      >
        <h2 className="text-lg font-semibold mb-4">{t(`Social`)} {t(`Media`)} {t(`Setting`)}</h2>
        {data.map((item) => (
          <div key={item.id} className="mb-4">
            <p className="block text-sm font-medium text-gray-700">
              {t(item.title)} {t(`Link`)}
            </p>
            <div className="flex items-center mt-2">
              <span className="mr-2  w-[30px]">{item.icon}</span>
              <input
                type="text"
                style={{ border: `1px solid ${border}` }}
                value={item.link}
                onChange={(e) => handleLinkChange(item.id, e.target.value)}
                className={`shadow appearance-none border rounded sm:w-[70%] md:w-[80%] lg:w-[85%]   py-1 px-3 text-gray-700 leading-tight outline-none`}
                placeholder={`Enter ${item.title} link`}
              />
            </div>
          </div>
        ))}
       {check&&<button
          style={{ backgroundColor: bg }}
          type="submit"
          className={`  text-white font-bold py-2 text-xs px-8 rounded focus:outline-none focus:shadow-outline`}
        >
          {updateLoading ? (
            <LoadingSpinner size="sm" color="white" thickness={"2px"} />
          ) : (
            `${t(`Update`)}`
          )}
        </button>}
      </form>

     

<GameCategorySetting/>
    
    </div>
  );
};

export default AdminSetting;
