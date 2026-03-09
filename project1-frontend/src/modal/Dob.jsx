import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  useDisclosure,
  Input,
  useToast,
} from '@chakra-ui/react';
import img1 from '../assets/logo.svg';
import { useSelector, useDispatch } from 'react-redux';
import { BsFillPlusCircleFill } from 'react-icons/bs';
import { updateSingleUser } from '../APIServices/APIServices';
// import { , ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

function DobModel({ dateOfBirth, onUpdate }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const [dob, setDob] = useState(dateOfBirth || '');


  const style = {
    width: '170px',
    paddingTop: '10px',
  };
  const toast=useToast()

  const { greenBtn, PrimaryText, whiteText, redBtn } = useSelector(
    (state) => state.theme
  );

  const { data } = useSelector((state) => state.auth.user);

  const handleUpdateUser = async () => {
    try {
      const modelQuery = import.meta.env.VITE_API_SITE_AUTH_KEY ; // Replace with actual model query if needed
      const userData = { dateOfBirth: dob };

      const response = await updateSingleUser(
        data?.token,
        data?.usernameToken,
        modelQuery,
        userData
      );
      if (response.status === 200) {
        toast({
          title: response.message || 'D.O.B Updated Successfully!',
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
  
       
        //   dispatch(yourReduxAction(response));
        onUpdate(dob);
        onClose();
      }
    } catch (error) {
      toast({
        title: response.message || 'Error fetching user details',
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      console.error(error);
    }
  };

  return (
    <>
      <BsFillPlusCircleFill
        onClick={onOpen}
        size={22}
        fill="#33df72"
        cursor="pointer"
      />
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent maxWidth="400px">
          <div className="flex justify-center items-center">
            {' '}
            <img style={style} src={img1} alt="Logo" />
          </div>
          <ModalHeader
            fontSize="sm"
            className=" text-base flex justify-center items-center"
          >
            Add Date of Birth
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl className="dob_field">
              <Input
                placeholder="Date of Birth"
                size="24px"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter justifyContent="space-between">
            <Button
              bg={{ base: greenBtn }}
              _hover={{ bg: { base: greenBtn } }}
              color={{ base: PrimaryText, xl: whiteText }}
              fontSize={{ base: '.9rem', xl: '16px' }}
              borderRadius={{ base: '25px', xl: '5px' }}
              minW={{ base: '85px', xl: '140px' }}
              height={{ base: '40px', xl: '50px' }}
              margin={{ base: '5px 0 5px', xl: '5px' }}
              flex="1"
              textShadow="0 2px 3px rgba(0, 0, 0, .3)"
              onClick={handleUpdateUser}
            >
              Submit
            </Button>
            <Button
              bg={{ base: redBtn }}
              _hover={{ bg: { base: redBtn } }}
              color={{ base: PrimaryText, xl: whiteText }}
              fontSize={{ base: '.9rem', xl: '16px' }}
              borderRadius={{ base: '25px', xl: '5px' }}
              minW={{ base: '85px', xl: '140px' }}
              height={{ base: '40px', xl: '50px' }}
              margin={{ base: '5px 0 5px', xl: '5px' }}
              flex="1"
              textShadow="0 2px 3px rgba(0, 0, 0, .3)"
              onClick={onClose}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* <ToastContainer /> */}
    </>
  );
}

export default DobModel;
