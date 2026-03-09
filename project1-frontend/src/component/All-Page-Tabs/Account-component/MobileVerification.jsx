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
  } from '@chakra-ui/react';
  import { useState, useEffect } from 'react';
  import { MdOutlinePendingActions } from 'react-icons/md';
  import { useSelector } from 'react-redux';
  
  function MobileVerification({type}) {
    const { bgColor1, bgGray } = useSelector((state) => state.theme);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [step, setStep] = useState(1); // Step 1: Enter Phone Number, Step 2: Enter OTP
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [resendTimer, setResendTimer] = useState(3); // 3 seconds countdown for demo
    const [mobile, setMobile] = useState('');
  
    useEffect(() => {
      if (resendTimer > 0) {
        const timerId = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
        return () => clearTimeout(timerId);
      }
    }, [resendTimer]);
  
    const handlePhoneSubmit = () => {
      // Simulate sending OTP to the phone number
      setMobile(`+91 ******${phone.slice(-4)}`); // Masking the phone number
      setStep(2);
    };
  
    const handleOtpSubmit = () => {
      setIsVerifying(true);
      // Verify OTP here
      setTimeout(() => {
        setIsVerifying(false);
        setStep(3); // Assuming step 3 is the final success step
      }, 2000); // Simulate API call
    };
  
    const handleResendCode = () => {
      setResendTimer(3); // Reset countdown (e.g., 3 seconds for demo purposes)
      // Trigger resend OTP function here
    };
  
    return (
      <>
        {type=="1"&&<MdOutlinePendingActions
          style={{
            fontSize: "20px",
            marginLeft: "10px",
            cursor: "pointer",
            color: "red"
          }}
          onClick={onOpen}
        />}
  
  {type=="2"&&<button
  
  onClick={onOpen}
  className="bg-[#ffaa00] text-white font-semibold py-2 px-6 rounded-md hover:bg-yellow-500">
          Request OTP
        </button>}
        <Modal size={{ base: "full", sm: 'md' }} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent bgColor={bgColor1} style={{ padding: "26px" }}>
            <ModalCloseButton />
            <ModalBody className="text-center">
              {step === 1 && (
                <>
                  <Text fontWeight="bold" className="mb-4">
                    Enter your phone number
                  </Text>
                  <Input
                    placeholder="Enter Phone Number"
                    value={phone}
                    bgColor={bgGray}
                    onChange={(e) => setPhone(e.target.value)}
                    className="p-2 font-bold outline-none rounded mb-4"
                    textAlign="left"
                    borderRadius={{ base: "20px", md: "6px" }}
                    focusBorderColor="yellow.500"
                  />
                  <Button
                    bgColor="#33DF72"
                    colorScheme=''
                    onClick={handlePhoneSubmit}
                    width="100%"
                    color={"white"}
                    padding={"20px"}
                    mb={4}
                    disabled={!phone} // Disable button if phone number is empty
                  >
                    Send OTP
                  </Button>
                </>
              )}
  
              {step === 2 && (
                <>
                  <Text fontWeight="bold" className="mb-4">
                    A 4-digit pin number has been sent to your phone
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" className="mb-6">
                    {mobile}
                  </Text>
                  <Text className="mb-2">Please enter the number you received</Text>
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
                    colorScheme=''
                    onClick={handleOtpSubmit}
                    className={isVerifying ? 'opacity-50' : ''}
                    disabled={isVerifying}
                    width="100%"
                    color={"white"}
                    padding={"20px"}
                    mb={4}
                  >
                    {isVerifying ? 'Verifying...' : 'Verify'}
                  </Button>
                  <Text className="mb-2">
                    Having any issue? Contact{' '}
                    <Link color="yellow.500" fontWeight="bold" href="#">
                      Customer Support
                    </Link>
                  </Text>
                  <Text>
                    Didn't receive the pin number?{' '}
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
  
  export default MobileVerification;
  