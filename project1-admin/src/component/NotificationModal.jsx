
import { IoMdCloseCircle } from "react-icons/io";
import { DeleteIcon } from '@chakra-ui/icons'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
  Box,
  Button,
} from "@chakra-ui/react";
import { AiFillBell } from "react-icons/ai";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { fetchGetRequest } from "../api/api";
import nodata from '../assets/emptydata.png'
import SlipModal from "../Modals/SlipModal";

const AUDIO_URL = "https://actions.google.com/sounds/v1/alarms/beep_short.ogg";

function NotificationModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading1, setLoading1] = useState(false);
  const [notification, setNotification] = useState([]);
  const [loading, setLoading] = useState(false);
  const { color, primaryBg, secondaryBg, iconColor, bg, hoverColor, hover, text, font, border } = useSelector(state => state.theme);
  const [transactionData, setTransactionData] = useState([])
  const toast = useToast();
  const [pendingTransactionCount, setPendingTransaction] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({});
  const totalPages = pagination?.totalPages;
  const [limit, setLimit] = useState("20");

  // Audio State
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(new Audio(AUDIO_URL));

  const getAllTransactionDetails = async () => {
    // setLoading(true); // Disable loading state for polling to prevent flickering
    let url = `${import.meta.env.VITE_API_URL
      }/api/transaction/get-all-transaction?transaction_type=all&user_type=user&page=${currentPage}&limit=15`;

    try {
      let response = await fetchGetRequest(url);
      setTransactionData(response.data);
      setPendingTransaction(response?.transactionCount.pendingDepositCount + response?.transactionCount?.pendingWithdrawCount)
      setPagination(response.pagination);
      setLoading(false);
    } catch (error) {
      // toast({
      //   description: error?.message || error?.data?.message||error?.response?.data?.message,
      //   status: "error",
      //   duration: 4000,
      //   position: "top",
      //   isClosable: true,
      // });
      console.log(error);
      setLoading(false);
    }
  };

  // Initial Fetch & Polling
  useEffect(() => {
    getAllTransactionDetails();
    const interval = setInterval(() => {
      getAllTransactionDetails();
    }, 10000); // 10 seconds poll

    return () => clearInterval(interval);
  }, []);

  // Audio Logic
  useEffect(() => {
    const audio = audioRef.current;

    // Play loop logic
    const playSound = async () => {
      try {
        if (pendingTransactionCount > 0 && !isMuted) {
          audio.loop = true;
          await audio.play();
        } else {
          audio.pause();
          audio.currentTime = 0;
        }
      } catch (error) {
        console.log("Audio autoplay blocked:", error);
      }
    };

    playSound();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [pendingTransactionCount, isMuted]);

  // Handle user interaction to unlock audio
  useEffect(() => {
    const unlockAudio = () => {
      if (pendingTransactionCount > 0 && !isMuted) {
        audioRef.current.play().catch(e => console.log(e));
      }
    };
    document.addEventListener('click', unlockAudio);
    return () => document.removeEventListener('click', unlockAudio);
  }, [pendingTransactionCount, isMuted]);

  const handleRender = () => {
    getAllTransactionDetails(); // Refresh list immediately after action
  }

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  }

  return (
    <>
      <div
        onClick={onOpen}
        style={{
          boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
          border: `1px solid ${border}`,
          position: "relative",
          display: "inline-block",
          padding: "8px",
          borderRadius: "6px",
        }}
        className="cursor-pointer"
      >
        <AiFillBell
          cursor="pointer"
          fontSize="20px"
          style={{ color: iconColor }}
        />
        {pendingTransactionCount > 0 && (
          <Box
            position="absolute"
            top="-5px"
            right="-5px"
            backgroundColor="red"
            color="white"
            borderRadius="50%"
            padding="0 6px"
            fontSize="12px"
            fontWeight="bold"
            className="animate-pulse"
          >
            {pendingTransactionCount}
          </Box>
        )}
      </div>

      <Modal
        size={{ base: "full", md: "md" }}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent className="h-[100%] sm:h-[640px]">
          <div className="flex justify-between p-4 items-center">
            <div className="relative">
              {/* Mute Button */}
              <div
                onClick={toggleMute}
                className="cursor-pointer p-2 rounded-full hover:bg-gray-200"
                title={isMuted ? "Unmute Notification Sound" : "Mute Notification Sound"}
              >
                {isMuted ? <FaVolumeMute fontSize={22} color="red" /> : <FaVolumeUp fontSize={22} color="green" />}
              </div>
            </div>

            <ModalHeader textAlign={"center"} className="uppercase font-extrabold flex-1">Notification</ModalHeader>

            <div onClick={onClose} className="cursor-pointer">
              <IoMdCloseCircle fontSize={25} />
            </div>
          </div>

          <ModalBody style={{ padding: "4px" }}>
            <div className="px-4 flex flex-col gap-3 overflow-scroll sm:h-[540px]">
              {transactionData?.filter(notif => notif.status === "pending").map((notif, index) => (
                <div
                  key={index}
                  className={`flex relative flex-col ${notif.type === "deposit" ? "border border-green-600" : "border border-red-800"} justify-between px-4 py-2 rounded bg-[#eceaea] gap-2`}
                >
                  <div className="flex items-center  absolute top-6 left-[50%] justify-center">
                    <SlipModal data={notif} type={notif?.type} transactionDetails={getAllTransactionDetails} handleRender={handleRender} />

                  </div>

                  <div className="absolute top-1 right-2 h-[10px] w-[10px] rounded-[50%] bg-yellow-600 animate-pulse"></div>
                  <div className="flex justify-between w-[100%]">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex items-center text-[20px] justify-center w-9 h-9 rounded-[6px] text-white font-bold ${notif.type === "deposit" ? "bg-green-600" : "bg-red-800"}`}
                      >
                        {notif.type === "deposit" ? "D" : "W"}
                      </div>
                      <div className="text-[12px] font-bold">
                        <div className="text-gray-600">USER ID</div>
                        <div className="font-extrabold">{notif?.user_id}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className={`text-lg font-bold ${notif?.type === "deposit" ? 'text-green-600' : 'text-red-600'}`}>
                        {notif?.type === "deposit" ? `+ ₹${notif?.deposit_amount}` : `- ₹${notif.withdraw_amount}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-end justify-between text-[11px]">
                    <div className="font-extrabold text-[9px]">
                      {notif?.initiated_at}
                    </div>
                    <div className="font-semibold">
                      {notif?.method} by UPI Gateway
                    </div>
                  </div>
                </div>
              ))}

              {transactionData.length == 0 && <div>
                <img src={nodata} alt="no data found" className="w-[100%]" />
              </div>}

            </div>

          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default NotificationModal;
