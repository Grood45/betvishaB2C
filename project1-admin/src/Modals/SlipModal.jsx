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
  Badge,
  CircularProgress,
  useToast,
  Box,
  Text,
  VStack
} from '@chakra-ui/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaVolumeUp } from 'react-icons/fa';
import { IoIosCopy } from 'react-icons/io';
import { MdRemoveRedEye } from 'react-icons/md';
import { RxCrossCircled } from 'react-icons/rx';
import { SlScreenDesktop } from 'react-icons/sl';
import { sendPatchRequest } from '../api/api';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { convertToUniversalTime, formatDate } from '../../utils/utils';
import { useSelector } from 'react-redux';

function SlipModal({ data, handleRender, type, transactionDetails }) {
  const { isOpen, onOpen, onClose: originalOnClose } = useDisclosure();
  const [depositLoading, setDepositLoading] = useState(false)
  const [loading1, setLoading1] = useState(false)
  const [viewSlip, setViewSlip] = useState(false)
  const user = useSelector((state) => state.authReducer);

  // Animation State
  const [animationStatus, setAnimationStatus] = useState(null); // 'success' | 'reject' | null

  const adminData = user.user || {};
  const toast = useToast()
  const { t, i18n } = useTranslation();

  const onClose = () => {
    setAnimationStatus(null);
    originalOnClose();
  }

  // Audio / Speech Function
  const speakTransaction = (status, amount, username, type) => {
    if (!('speechSynthesis' in window)) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    let text = "";
    if (status === 'approved') {
      if (type === 'deposit') {
        text = `Payment Approved. ${username} has successfully deposited ${amount} rupees.`;
      } else {
        text = `Payment Approved. ${username} has successfully withdrawn ${amount} rupees.`;
      }
    } else {
      if (type === 'deposit') {
        text = `Payment Rejected. Deposit of ${amount} rupees by ${username} has been rejected.`;
      } else {
        text = `Payment Rejected. Withdrawal of ${amount} rupees by ${username} has been rejected.`;
      }
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1; // Normal speed
    utterance.pitch = 1; // Normal pitch
    utterance.volume = 1; // Full volume

    // Optional: Select a specific voice (e.g., Google US English if available)
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => voice.lang.includes('en-US') || voice.lang.includes('en-GB'));
    if (englishVoice) utterance.voice = englishVoice;

    window.speechSynthesis.speak(utterance);
  };

  const approvedDeposit = async () => {
    setDepositLoading(true);
    let url;
    if (data.type === "deposit") {
      url = `${import.meta.env.VITE_API_URL}/api/transaction/update-single-deposit/${data._id}?`;
    } else if (data.type === "withdraw") {
      url = `${import.meta.env.VITE_API_URL}/api/transaction/update-single-withdraw/${data._id}?`;
    } else {
      setDepositLoading(false);
      return;
    }

    try {
      const updatedata = {
        status: "approved",
        approved_by_username: adminData?.username,
        approved_by_role_type: adminData?.role_type,
        approved_by_admin_id: adminData?.admin_id
      };

      let response = await sendPatchRequest(url, updatedata);

      // Trigger Animation
      setAnimationStatus('success');

      // Trigger Audio
      speakTransaction('approved', data.type === "deposit" ? data.deposit_amount : data.withdraw_amount, data.user_id, data.type);

      // Delay closing to show animation
      setTimeout(() => {
        transactionDetails()
        handleRender()
        onClose()
        setAnimationStatus(null);
      }, 2000);

      setDepositLoading(false);
    } catch (error) {
      toast({
        description: `${error?.response?.data?.message}`,
        status: "error",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
      setDepositLoading(false);
    }
  };
  const rejectDeposit = async () => {
    setLoading1(true);
    let url;
    if (data.type === "deposit") {
      url = `${import.meta.env.VITE_API_URL}/api/transaction/update-single-deposit/${data._id}?`;
    } else if (data.type === "withdraw") {
      url = `${import.meta.env.VITE_API_URL}/api/transaction/update-single-withdraw/${data._id}?`;
    } else {
      setDepositLoading(false);
      return;
    }
    try {
      const updatedata = {
        status: "reject",
        approved_by_username: adminData?.username,
        approved_by_role_type: adminData?.role_type,
        approved_by_admin_id: adminData?.admin_id
      };

      let response = await sendPatchRequest(url, updatedata);

      // Trigger Animation
      setAnimationStatus('reject');

      // Trigger Audio
      speakTransaction('rejected', data.type === "deposit" ? data.deposit_amount : data.withdraw_amount, data.user_id, data.type);

      // Delay closing to show animation
      setTimeout(() => {
        transactionDetails()
        handleRender()
        onClose()
        setAnimationStatus(null);
      }, 2000);

      setLoading1(false);
    } catch (error) {
      toast({
        description: `${error?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading1(false);
    }
  };

  const handleApproved = () => {
    approvedDeposit();
  };

  const handleReject = () => {
    rejectDeposit();
  };
  const [copiedItem, setCopiedItem] = useState(null);

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedItem(text);
        toast({
          title: ` ${text} has been copied`,
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      })
      .catch((err) => console.error("Failed to copy: ", err));
  };

  const timePart = data?.initiated_at.split(' ')[1];
  const seccondPart = data?.initiated_at.split(' ')[2]
  const time12Hour = `${timePart} ${seccondPart}`;
  const time24Hour = convertToUniversalTime(time12Hour);
  return (
    <>
      <SlScreenDesktop
        onClick={onOpen}
        cursor="pointer"
        color="black"
        fontSize="20px"
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered size={animationStatus ? "sm" : "md"}>
        <ModalOverlay />
        <ModalContent
          bg={animationStatus ? "transparent" : "white"}
          boxShadow={animationStatus ? "none" : "lg"}
        >
          {animationStatus ? (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                className="flex justify-center items-center"
              >
                <Box
                  bg="white"
                  p={8}
                  borderRadius="2xl"
                  boxShadow="2xl"
                  textAlign="center"
                  minW="300px"
                  minH="250px"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  gap={4}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1.2 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    {animationStatus === 'success' ? (
                      <FaCheckCircle color="#48BB78" size={80} />
                    ) : (
                      <RxCrossCircled color="#F56565" size={80} />
                    )}
                  </motion.div>

                  <VStack spacing={1}>
                    <Text fontSize="2xl" fontWeight="bold" color={animationStatus === 'success' ? "green.500" : "red.500"}>
                      {animationStatus === 'success' ? "Approved!" : "Rejected!"}
                    </Text>
                    <Text fontSize="lg" fontWeight="semibold" color="gray.600">
                      {data.user_id}
                    </Text>
                    <Text fontSize="3xl" fontWeight="extrabold" color="gray.800">
                      {data.type === "deposit" ? `₹${data.deposit_amount}` : `₹${data.withdraw_amount}`}
                    </Text>
                  </VStack>
                </Box>
              </motion.div>
            </AnimatePresence>
          ) : (
            <>
              <ModalHeader className="text-center capitalize ">{t(data.type)} {t(`Slip`)}</ModalHeader>
              <ModalCloseButton />
              <ModalBody className='lg:min-h-[540px] '>
                <p className='font-bold text-sm text-left'>{t(`Deposit`)} {t(`Details`)} <span className='text-red-600'>*</span></p>

                <div className="grid grid-cols-2 mt-3 text-sm gap-4">
                  <div className='font-bold'>{t(`Date`)}/{t(`Time`)}:</div>
                  <div className='flex items-center gap-1'>{formatDate(data.initiated_at.split(" ")[0])}<span className='text-[10px] font-bold'>({time24Hour})</span></div>
                  <div className='font-bold'>{t(`Method`)}:</div>
                  <div ><Badge>{data.method}</Badge></div>
                  <div className='font-bold'>{t(`Approved By`)}:</div>
                  <div ><Badge colorScheme='green'> {data?.status === "pending" ? "pending" : adminData?.username}
                  </Badge></div>
                  <div className='font-bold '>{data?.type} {t(`Amount`)}:</div>
                  <div>{data.type == "deposit" ? data.deposit_amount : data.withdraw_amount?.toFixed(2)} {data?.currency}</div>
                  {type === "user" && <div className='font-bold'>{t(`Bonus`)}:</div>}
                  {type === "user" && <div >{data.bonus}%</div>}
                  <div className='font-bold'>{t(`Wallet`)} {t(`Amount`)}:</div>
                  <div>{data?.wallet_amount?.toFixed(2)} {data?.currency}</div>
                  <div className='font-bold'>{data.type == "deposit" ? `${t(`After`)} ${t(`Deposit`)}` : `${t(`After`)} ${t(`Withdraw`)}`}</div>
                  <div>{data.type == "deposit" ? ((data?.deposit_amount + (data?.deposit_amount * (data?.bonus / 100)))?.toFixed(2)) : data?.after_withdraw?.toFixed(2)} {data?.currency}</div>
                  {/* <div className='font-bold'>Payable:</div>
              <div>{data.payable}</div> */}
                  <div className='font-bold'>{t(`Status`)}:</div>
                  <div className={`flex items-center gap-2 ${data.status === "approved" ? "text-green-600" : data.status == "pending" ? "text-orange-600" : "text-red-600"} font-bold`}>
                    <span className="capitalize">{data.status}</span>
                    {data.status !== 'pending' && (
                      <FaVolumeUp
                        cursor="pointer"
                        className="text-gray-500 hover:text-gray-800 transition-colors duration-200"
                        size={18}
                        onClick={() => speakTransaction(data.status, data.type === "deposit" ? data.deposit_amount : data?.withdraw_amount, data.user_id, data.type)}
                        title="Replay Audio"
                      />
                    )}
                  </div>
                </div>

                <div className='w-[100%] bg-gray-300 mt-5 h-[1px]'></div>
                <div className='mt-5 '>
                  <p className='font-bold text-sm text-left'>{t(`User`)} {t(`Details`)} <span className='text-red-600'>*</span></p>

                  <div className='bg-slate-200 mt-1 rounded-md p-1 py-3'>
                    <div className='flex items-center mt-4 justify-between w-[100%]'>
                      <div className='font-bold text-sm'>{t(`Date`)}/{t(`Time`)}:</div>
                      <div className='flex  font-bold text-sm items-center gap-1'>{formatDate(data.initiated_at.split(" ")[0])}<span className='text-[10px] font-bold'>({time24Hour})</span></div>
                    </div>
                    <div className=' flex flex-col mt-2 gap-3'>
                      {data?.user_details?.map((obj, index) => (
                        <div key={index} className="flex w-[100%] flex-col gap-3 justify-between">
                          {Object.keys(obj).map((key, subIndex) => (
                            <div key={subIndex} className="flex w-[100%] justify-between">
                              <div className="font-bold text-sm">{key}</div>
                              <div className="flex items-center gap-2 text-sm font-semibold">
                                {typeof obj[key] === 'string' && obj[key].startsWith('http') ? (
                                  <div>
                                    <div className="font-bold flex justify-end ml-9">
                                      {t(`View`)} {t(`Receipt`)}:
                                      <MdRemoveRedEye
                                        onClick={() => setViewSlip(!viewSlip)}
                                        fontSize={"20px"}
                                        cursor={"pointer"}
                                      />
                                    </div>
                                    {viewSlip && (
                                      <div className="mt-3">
                                        <img src={obj[key]} alt="Receipt" />
                                      </div>
                                    )}
                                  </div>

                                ) : (
                                  <>
                                    <span>{obj[key]}</span>
                                    <IoIosCopy cursor="pointer" color="green" onClick={() => copyToClipboard(obj[key])} />
                                  </>
                                )}
                              </div>

                            </div>
                          ))}
                        </div>
                      ))}
                    </div>



                  </div>




                  {/* <div className='flex justify-between items-center'>

              {type==="user"&&<div className='font-bold'>{t(`View`)} {t(`Receipt`)}:</div>}
              {type==="user"&&<div  className='flex items-center gap-2' >{data.method} <MdRemoveRedEye  onClick={()=>setViewSlip(!viewSlip)} fontSize={"20px"} cursor={"pointer"}  /></div>}
            </div>
               */}
                  {/* {viewSlip&&<div className='mt-3 '>
             <img src={data?.deposit_slip}/>
            </div>} */}

                </div>

              </ModalBody>

              {data.status === "pending" ? <ModalFooter className='flex justify-between w-[100%]'>
                <Button className='w-[100%]' colorScheme="red" mr={3} onClick={handleReject}>
                  {loading1 ? (
                    <CircularProgress
                      isIndeterminate
                      color="orange.600"
                      size={"16px"}
                    />
                  ) : (
                    `${t(`Reject`)}`
                  )}
                </Button>
                <Button
                  onClick={handleApproved}

                  className='w-[100%]' colorScheme="green" >
                  {depositLoading ? (
                    <CircularProgress
                      isIndeterminate
                      size={"16px"}
                      color="orange.600"
                    />
                  ) : (
                    `${t(`Approved`)}`
                  )}
                </Button>


              </ModalFooter>
                : <ModalFooter>
                  {data.status == "approved" ? <div className='w-[100%] p-2 text-center flex justify-center gap-2 items-center bg-green-500 text-white font-semibold text-sm rounded-md ' >
                    {t(`Payment`)} {t(`Accepted`)} <FaCheckCircle fontSize={"20px"} />
                  </div> :
                    <div className='w-[100%] p-2 text-center flex justify-center gap-2 items-center bg-red-500 text-white font-semibold text-sm rounded-md ' >
                      {t(`Payment`)} {t(`Reject`)} <RxCrossCircled fontSize={"20px"} />

                    </div>}
                </ModalFooter>}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default SlipModal;
