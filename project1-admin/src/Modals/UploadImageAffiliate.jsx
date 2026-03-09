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
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { sendPatchRequest, sendPostRequest } from "../api/api";

function UploadImageAffiliate({ getSocailData,socialData }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const toast = useToast();
  const [updateLoading, setUpdateLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    handleImageUpload(file);
  };

  const handleImageUpload = async (file) => {
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
    secondaryColor,
    textColor,
    borderColor,
  } = useSelector((state) => state.theme);

  const handleAdd = async () => {
if(!title || !description || !selectedImage){
  return  toast({
    title: "fill all the details.",
    status: "warning",
    duration: 2000,
    isClosable: true,
  });
}

    setUpdateLoading(true);

    const payload = {
      title,
      description,
      url: selectedImage,
    };
    const affiliate_media=[...socialData,payload]
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/setting/update-setting/6532c132ed5efb8183a66703`;
    try {
      let response = await sendPatchRequest(url, {affiliate_media});
      toast({
        description: `Updated Successfully`,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      onClose();
      setTitle("");
      setDescription("");
      setSelectedImage("");
      getSocailData();
      setUpdateLoading(false);
    } catch (error) {
      setUpdateLoading(false);
    }
  };

  return (
    <>
      <Button style={{ backgroundColor: bg, color: "white" }} onClick={onOpen}>
        Upload Image
      </Button>

      <Modal
        size={{ base: "full", md: "md" }}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="text-lg text-center font-bold">
            Upload Image & Details
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex flex-col space-y-4">
            {/* Title Input */}
            <input
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 rounded w-full"
              style={{ border: `1px solid ${border}` }}
            />

            {/* Description Input */}
            <textarea
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 rounded w-full"
              style={{ border: `1px solid ${border}` }}
              rows="3"
            />

            {/* Image Upload */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
            />
            {imageUploadLoading && <Spinner />}
          </ModalBody>

          <ModalFooter className="w-[100%] flex gap-4">
            {/* Cancel Button */}
            <Button
              style={{ border: `1px solid ${border}` }}
              onClick={onClose}
              className="w-[100%]"
            >
              Cancel
            </Button>
            {/* Add Button */}
            <Button
              disabled={updateLoading}
              style={{ backgroundColor: bg }}
              className="w-[100%]"
              colorScheme="blue"
              onClick={handleAdd}
            >
              {updateLoading ? <Spinner /> : "Add"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UploadImageAffiliate;
