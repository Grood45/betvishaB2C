
import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Button,
  useDisclosure,
  useToast,
  Text,
  Flex,
  Box
} from '@chakra-ui/react';
import { MdDelete, MdWarning } from 'react-icons/md';
import { RiCloseLine } from "react-icons/ri"; // Importing close icon for modern look
import { useSelector } from 'react-redux';
import LoadingSpinner from '../component/loading/LoadingSpinner';
import { sendDeleteRequest } from '../api/api';
import { useTranslation } from 'react-i18next';

function DeleteUserAdmin({ type, name, id, onDeleteSuccess, icon }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { primaryBg, border, iconColor } = useSelector(state => state.theme);
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const { t } = useTranslation();

  const handleDelete = async () => {
    setLoading(true)
    try {
      let url;
      if (type === "user") {
        url = `${import.meta.env.VITE_API_URL}/api/admin/delete-user/${id}`;
      } else if (type === "admin") {
        url = `${import.meta.env.VITE_API_URL}/api/admin/delete-admin/${id}`;
      }
      let response = await sendDeleteRequest(url);
      toast({
        description: response.message,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading(false)
      onDeleteSuccess()
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
      onClose();
    }
  };

  return (
    <>
      <button onClick={onOpen} style={{ border: `1px solid ${border}`, backgroundColor: primaryBg }} className={`w-[25px] flex items-center border justify-center rounded-[6px] h-[25px]`}>
        {React.cloneElement(icon || <MdDelete fontSize={"20px"} cursor={"pointer"} color={iconColor} />, { onClick: onOpen })}
      </button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="slideInBottom">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
        <ModalContent
          bg="white"
          borderRadius="2xl"
          boxShadow="2xl"
          maxW="400px"
          p={6}
          overflow="hidden"
        >
          {/* Custom Close Button */}
          <div className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors" onClick={onClose}>
            <RiCloseLine size={24} />
          </div>

          <ModalBody p={0}>
            <Flex direction="column" align="center" textAlign="center" gap={4}>

              {/* Icon Circle */}
              <Flex
                align="center"
                justify="center"
                w={16}
                h={16}
                bg="red.50"
                borderRadius="full"
                color="red.500"
                mb={2}
              >
                <MdWarning size={32} />
              </Flex>

              {/* Text Content */}
              <Box>
                <Text fontSize="xl" fontWeight="bold" color="gray.800" mb={2}>
                  {t(`Are You Sure?`)}
                </Text>
                <Text fontSize="sm" color="gray.500" lineHeight="tall">
                  {t(`Do you really want to delete`)} <span className="font-bold text-gray-800">"{name}"</span>?<br />
                  {t(`This process cannot be undone.`)}
                </Text>
              </Box>

              {/* Action Buttons */}
              <Flex gap={3} w="full" mt={4}>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  w="full"
                  size="lg"
                  color="gray.600"
                  _hover={{ bg: "gray.50" }}
                  borderRadius="xl"
                  fontSize="sm"
                >
                  {t(`Cancel`)}
                </Button>
                <Button
                  onClick={handleDelete}
                  colorScheme="red"
                  w="full"
                  size="lg"
                  borderRadius="xl"
                  fontSize="sm"
                  boxShadow="lg"
                  isLoading={loading}
                  loadingText="Deleting"
                >
                  {t(`Delete`)}
                </Button>
              </Flex>

            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default DeleteUserAdmin;
