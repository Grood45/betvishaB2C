import React, { useEffect, useState } from "react";
import { FaUpload } from "react-icons/fa6";
import { MdEmail, MdSupportAgent } from "react-icons/md";
import { RiWhatsappFill } from "react-icons/ri";
import { SiTelegram } from "react-icons/si";
import { useSelector } from "react-redux";
import UploadImageAffiliate from "../Modals/UploadImageAffiliate";
import img1 from "../assets/dash1.png";
import { fetchGetRequest, sendPatchRequest } from "../api/api";
import { useToast } from "@chakra-ui/react";
const CreateAffilate = () => {
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

  const [social_media, setContacts] = useState({
    whatsapp: {
      title: "WhatsApp",
      image:"https://img.icons8.com/color/48/whatsapp--v1.png",
      link: "",
    },
    email: {
      title: "Email",
      image: "https://img.icons8.com/parakeet-line/48/new-post.png",
      link: "",
    },
    telegram: {
      title: "Telegram",
      image: "https://img.icons8.com/color/48/telegram-app--v1.png",
      link: "",
    },
  });

  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const toast = useToast();
const [socialData,setSocialData]=useState([])
  const handleUpdate = async () => {
    setUpdateLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/setting/update-setting/6532c132ed5efb8183a66703`;
    try {
      let response = await sendPatchRequest(url, {social_media});
      // setSocialData(response.data);
      toast({
        description: `Updated Successfully`,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });

      setUpdateLoading(false);
    } catch (error) {
      setUpdateLoading(false);
    }
  };
 
  const getSocailData = async () => {
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/setting/get-setting/6532c132ed5efb8183a66703`;
    try {
      let response = await fetchGetRequest(url);
      console.log(response,"asasdd")
      setContacts(response?.data?.social_media)
      setSocialData(response?.data?.affiliate_media)

    } catch (error) {
      
    }
  };

  // Handle input change for each card
  const handleChange = (platform, field, value) => {
    setContacts({
      ...social_media,
      [platform]: {
        ...social_media[platform],
        [field]: value,
      },
    });
  };

  const handleAddSocailMedia = () => {
    handleUpdate();
    console.log(social_media,"cotnact")
  };

  useEffect(()=>{
    getSocailData()
  },[])



  const handleDelete = async (updatedData) => {
    setDeleteLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/setting/update-setting/6532c132ed5efb8183a66703`;
const affiliate_media=updatedData
    try {
      let response = await sendPatchRequest(url,{affiliate_media});
      // setSocialData(response.data);
      toast({
        description: `Updated Successfully`,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
getSocailData()
      setDeleteLoading(false);
    } catch (error) {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCard=(item)=>{
    const updatedData = socialData.filter((obj) => obj._id !== item._id);
    handleDelete(updatedData)
    console.log(item,updatedData,"item to be delted")
  }

  return (
    <div>
      <div className=" p-6 ">
        <h1
          style={{ color: iconColor }}
          className="text-2xl flex items-center gap-2 font-bold text-left mb-6"
        >
          <span>
            <MdSupportAgent fontSize={"30px"} />
          </span>
          Affilate Support{" "}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(social_media).map(([platform, details]) => (
            <div key={platform} className="p-6 bg-white shadow-lg rounded-lg">
              <h2 className="text-xl flex items-center gap-1 font-semibold mb-4">
                <img src={details?.image} className="w-[45px]" />
                {details.title}
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link
                </label>
                <input
                  type="text"
                  style={{ border: `1px solid ${border}` }}
                  value={details.link}
                  onChange={(e) =>
                    handleChange(platform, "link", e.target.value)
                  }
                  className="block w-full px-3 py-3  rounded-md shadow-sm outline-none sm:text-sm"
                  placeholder={`Enter ${details.title} Link`}
                />
              </div>
              <button
                onClick={handleAddSocailMedia}
                disabled={updateLoading}
                style={{ backgroundColor: bg }}
                className="w-full mt-3 text-white rounded-lg p-2 font-bold"
              >
                Update
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className=" p-6 ">
        <div className="flex items-center justify-between">
          <h1
            style={{ color: iconColor }}
            className="text-2xl flex items-center gap-2 font-bold text-left mb-6"
          >
            <span>
              <FaUpload fontSize={"30px"} />
            </span>
            Affilate Image{" "}
          </h1>

          <UploadImageAffiliate getSocailData={getSocailData} socialData={socialData} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialData?.map((item) => (
            <div key={item?.id} className="p-6 bg-white shadow-lg rounded-lg">
              <img src={item?.url} className="w-[100%] h-[200px] rounded-lg" />

              <div className="my-4">
                <label className="block text-xl font-extrabold  text-gray-700 mb-1">
                  Title
                </label>
                <p>{item?.title}</p>
              </div>
              <div className="my-4">
                <label className="block text-xl font-extrabold  text-gray-700 mb-1">
                  Description
                </label>
                <p>{item?.description}</p>
              </div>
              <button
              onClick={()=>handleDeleteCard(item)}
                style={{ backgroundColor: bg }}
                disabled={deleteLoading}
                className="w-full mt-3 text-white rounded-lg p-2 font-bold"
              >

                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateAffilate;
