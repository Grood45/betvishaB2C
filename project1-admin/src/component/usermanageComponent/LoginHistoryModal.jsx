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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";
import { convertToUniversalTime } from "../../../utils/utils";
import { FaLocationDot } from "react-icons/fa6";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { sendPostRequest } from "../../api/api";
import { FaShieldAlt, FaMapMarkerAlt, FaGlobeAmericas, FaCity, FaClock, FaHistory } from "react-icons/fa";
function LoginHistoryModal({ data }) {
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
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ipDetails, setIpDetails] = useState({})
  const toast = useToast()

  const getAllLoginHistory2 = async (login_ip) => {
    setLoading(true);
    let url = `${import.meta.env.VITE_API_URL}/api/ip-service/get-ip-details`;

    try {
      const payload = {
        ip: login_ip
      }
      let response = await sendPostRequest(url, payload);
      const data = response.data;
      setLoading(false);
      setIpDetails(response.data);

    } catch (error) {
      setLoading(false);
      toast({
        description: `${error?.data?.message || error?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      console.log(error);
    }
  };


  return (
    <>
      <button
        className="flex items-center gap-2 p-1.5 px-3 rounded-lg border border-gray-200 bg-white hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 font-black text-xs uppercase tracking-widest shadow-sm transition-all"
        onClick={onOpen}
      >
        <FaHistory />
        {t(`History`)}
      </button>

      <Modal size={{ base: 'full', md: '2xl' }} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(8px)" bg="blackAlpha.600" />
        <ModalContent className="rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-white/90">
          <ModalHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 p-6">
            <div className="flex flex-col items-center gap-1">
              <h3 className="text-white text-xl font-black italic uppercase tracking-tighter flex items-center gap-2">
                <FaShieldAlt /> {t(`Security`)} {t(`Login`)} {t(`History`)}
              </h3>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">{t(`System Audit Trail`)}</p>
            </div>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody className="p-0">
            <div className="overflow-x-auto h-[70vh] bg-white/50 relative">
              <div className="sticky top-0 z-20 bg-gray-50/80 backdrop-blur-sm border-b border-gray-100">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t(`ID`)}</th>
                      <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">{t(`Access IP`)}</th>
                      <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">{t(`Timestamp`)}</th>
                      <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">{t(`Detection`)}</th>
                    </tr>
                  </thead>
                </table>
              </div>
              <table className="min-w-full">
                <tbody>
                  {data?.map((entry, index) => (
                    <tr key={index} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="py-4 px-6 text-center text-xs font-black text-gray-400 border-b border-gray-50">{index + 1}</td>
                      <td className="py-4 px-6 border-b border-gray-50">
                        <span className="font-mono text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">
                          {entry?.login_ip}
                        </span>
                      </td>
                      <td className="py-4 px-6 border-b border-gray-50">
                        <div className="flex items-center gap-2 text-gray-500 font-bold">
                          <FaClock className="text-[10px] text-gray-300" />
                          <div className="flex flex-col">
                            <span className="text-xs">{entry?.login_time?.split(" ")?.[0]}</span>
                            <span className="text-[10px] text-indigo-400">{entry?.login_time?.split(" ")?.[1]}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 border-b border-gray-50 text-right">
                        <Menu isLazy>
                          <MenuButton
                            onClick={() => getAllLoginHistory2(entry?.login_ip)}
                            className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300 hover:text-indigo-600 transition-all group-hover:scale-110"
                          >
                            <FaLocationDot />
                          </MenuButton>
                          <MenuList className="p-0 border-0 rounded-2xl shadow-2xl overflow-hidden min-w-[300px] bg-white">
                            <div className="bg-indigo-600 p-4">
                              <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest italic">{t(`Identity Intel`)}</p>
                              <h4 className="text-white font-black italic tracking-tighter text-lg uppercase truncate">{entry?.login_ip}</h4>
                            </div>
                            <div className="p-4 bg-white">
                              {loading ? (
                                <div className="p-8 flex justify-center"><Spinner size="xl" thickness="4px" color="indigo.500" /></div>
                              ) : (
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5 text-gray-400 text-[9px] font-black uppercase tracking-tighter">
                                      <FaGlobeAmericas /> {t(`Country`)}
                                    </div>
                                    <p className="text-xs font-black text-gray-800">{ipDetails?.country_name || 'N/A'}</p>
                                  </div>
                                  <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5 text-gray-400 text-[9px] font-black uppercase tracking-tighter">
                                      <FaShieldAlt /> {t(`Code`)}
                                    </div>
                                    <p className="text-xs font-black text-gray-800">{ipDetails?.country_code || 'N/A'}</p>
                                  </div>
                                  <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5 text-gray-400 text-[9px] font-black uppercase tracking-tighter">
                                      <FaCity /> {t(`City`)}
                                    </div>
                                    <p className="text-xs font-black text-gray-800">{ipDetails?.city || 'N/A'}</p>
                                  </div>
                                  <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 flex flex-col gap-1 col-span-2">
                                    <div className="flex items-center gap-1.5 text-gray-400 text-[9px] font-black uppercase tracking-tighter">
                                      <FaMapMarkerAlt /> {t(`Region`)}
                                    </div>
                                    <p className="text-xs font-black text-gray-800 truncate">{ipDetails?.region_name || 'N/A'}</p>
                                  </div>
                                  <div className="bg-indigo-50 p-2 rounded-xl border border-indigo-100 col-span-2 flex justify-between items-center">
                                    <div className="flex items-center gap-1.5 text-indigo-400 text-[9px] font-black uppercase tracking-tighter">
                                      <FaClock /> {t(`TimeZone`)}
                                    </div>
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter italic">{ipDetails?.time_zone || 'N/A'}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </MenuList>
                        </Menu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default LoginHistoryModal;
