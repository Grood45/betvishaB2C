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
  Input,
  Text,
  Link,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { MdOutlinePendingActions } from "react-icons/md";
import { useSelector } from "react-redux";

function EmailVerification({fetchUserDetails,type}) {
  const { bgColor1, bgGray } = useSelector((state) => state.theme);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [step, setStep] = useState(1); // Step 1: Enter Email, Step 2: Enter OTP
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(3); // 3 seconds countdown for demo
  const [maskedEmail, setMaskedEmail] = useState("");
  const toast = useToast();
  const userTokenData = useSelector((state) => state?.auth);
  const data = userTokenData?.user?.data;
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (resendTimer > 0) {
      const timerId = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [resendTimer]);

  const handleEmailSubmit = async () => {
    setLoading(true);
    let url = `${import.meta.env.VITE_API_URL}/api/user/send-email-otp`;

    try {
      const payload = {
        email: email,
      };
      let response = await axios.post(url, payload, {
        headers: {
          token: data?.token,
          usernametoken: data?.usernameToken,
        },
      });

      setLoading(false);
      const [name, domain] = email.split("@");
      setMaskedEmail(`${name[0]}******@${domain}`);
      setStep(2);
      toast({
        description: `otp sent succesfully`,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    } catch (error) {
      toast({
        description: `${
          error?.data?.message || error?.response?.data?.message
        }`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      console.log(error);
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    setIsVerifying(true);

    let url = `${import.meta.env.VITE_API_URL}/api/user/verify-email-otp`;
    try {
      const payload = {
        email: email,
        userEnteredOTP: otp,
      };
      let response = await axios.post(url, payload, {
        headers: {
          token: data?.token,
          usernametoken: data?.usernameToken,
        },
      });

      setLoading(false);
      setIsVerifying(false);
      setStep(3);
      if(type=="1"){
        fetchUserDetails()
      }
      toast({
        description: `verfication successfully !`,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      onClose()
    } catch (error) {
      toast({
        description: `${
          error?.data?.message || error?.response?.data?.message
        }`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      console.log(error);
      setIsVerifying(false);
    }
  };

  const handleResendCode = () => {
    handleEmailSubmit();
    setResendTimer(59);
  };

  return (
    <>
      {type=="1"&& <MdOutlinePendingActions
        style={{
          fontSize: "20px",
          marginLeft: "10px",
          cursor: "pointer",
          color: "red",
        }}
        onClick={onOpen}
      />}

{type=="2"&&<button
  
  onClick={onOpen}
  className="bg-[#ffaa00] text-white font-semibold py-2 px-6 rounded-md hover:bg-yellow-500">
          Request OTP
        </button>}
      <Modal
        size={{ base: "full", sm: "md" }}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent bgColor={bgColor1} style={{ padding: "26px" }}>
          <ModalCloseButton />
          <ModalBody className="text-center">
            {step === 1 && (
              <>
                <Text fontWeight="bold" className="mb-4">
                  Enter your email address
                </Text>
                <Input
                  placeholder="Enter Email"
                  value={email}
                  bgColor={bgGray}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-2 font-bold outline-none rounded mb-4"
                  textAlign="left"
                  borderRadius={{ base: "20px", md: "6px" }}
                  focusBorderColor="yellow.500"
                />
                <Button
                  bgColor="#33DF72"
                  colorScheme=""
                  onClick={handleEmailSubmit}
                  width="100%"
                  color={"white"}
                  padding={"20px"}
                  mb={4}
                  disabled={!email} // Disable button if email is empty
                >
                  {loading ? <Spinner /> : "Send OTP"}
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <Text fontWeight="bold" className="mb-4">
                  A 4-digit pin number has been sent to your email
                </Text>
                <Text fontSize="lg" fontWeight="bold" className="mb-6">
                  {maskedEmail}
                </Text>
                <Text className="mb-2">
                  Please enter the number you received
                </Text>
                <Input
                  placeholder="Enter Code"
                  value={otp}
                  bgColor={bgGray}
                  onChange={(e) => setOtp(e.target.value)}
                  className="p-2 font-bold outline-none rounded mb-4"
                  textAlign="left"
                  borderRadius={{ base: "20px", md: "6px" }}
                  focusBorderColor="yellow.500"
                />
                <Button
                  bgColor="#33DF72"
                  colorScheme=""
                  onClick={handleOtpSubmit}
                  className={isVerifying ? "opacity-50" : ""}
                  disabled={isVerifying}
                  width="100%"
                  color={"white"}
                  padding={"20px"}
                  mb={4}
                >
                  {isVerifying ? <Spinner/> : "Verify"}
                </Button>
                <Text className="mb-2">
                  Having any issue? Contact{" "}
                  <Link color="yellow.500" fontWeight="bold" href="#">
                    Customer Support
                  </Link>
                </Text>
                <Text>
                  Didn't receive the pin number?{" "}
                  <Button
                    onClick={handleResendCode}
                    disabled={resendTimer > 0}
                    colorScheme="yellow"
                    variant="solid"
                  >
                    Resend Code ({resendTimer})
                  </Button>
                </Text>
              </>
            )}

            {step === 3 && (
              <Text fontWeight="bold" className="mb-4">
                Verification successful!
              </Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EmailVerification;
