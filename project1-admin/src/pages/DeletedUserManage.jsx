import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import {
    Avatar,
    Badge,
    Spinner,
    useToast,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    Text,
    Flex,
    Box
} from "@chakra-ui/react";
import { MdWarning } from "react-icons/md";
import { BsCalendarDateFill, BsGridFill, BsListUl } from "react-icons/bs";
import { FaWallet, FaUserCheck, FaUserSlash, FaUsers } from "react-icons/fa";
import { RiUserLine, RiRestartLine, RiDeleteBin2Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import { fetchGetRequest, sendPatchRequest, sendDeleteRequest } from "../api/api";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import nodatafound from "../assets/emptydata.png";
import { useTranslation } from "react-i18next";
import { convertToUniversalTime, formatDate } from "../../utils/utils";
import moment from "moment";

const DeletedUserManage = () => {
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

    const [allUserData, setAllUserData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState("20");
    const [viewMode, setViewMode] = useState("card");
    const [pagination, setPagination] = useState({});
    const [selectedUserForDelete, setSelectedUserForDelete] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const { t } = useTranslation();

    const getAllDeletedUser = async () => {
        setLoading(true);
        let url = `${import.meta.env.VITE_API_URL}/api/admin/get-all-deleted-user?page=${currentPage}&limit=${limit}`;

        if (search) {
            url += `&search=${search}`;
        }

        try {
            let response = await fetchGetRequest(url);
            setAllUserData(response.data);
            setPagination(response.pagination);
            setLoading(false);
        } catch (error) {
            toast({
                description: `${error?.data?.message || error?.message}`,
                status: "error",
                duration: 4000,
                position: "top",
                isClosable: true,
            });
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllDeletedUser();
    }, [currentPage, search, limit]);

    const handleRestore = async (userId) => {
        try {
            let url = `${import.meta.env.VITE_API_URL}/api/admin/restore-user/${userId}`;
            let response = await sendPatchRequest(url);
            toast({
                description: response.message,
                status: "success",
                duration: 4000,
                position: "top",
                isClosable: true,
            });
            getAllDeletedUser();
        } catch (error) {
            toast({
                description: `${error?.data?.message || error?.message}`,
                status: "error",
                duration: 4000,
                position: "top",
                isClosable: true,
            });
        }
    };

    const confirmPermanentDelete = (user) => {
        setSelectedUserForDelete(user);
        onOpen();
    };

    const handlePermanentDelete = async () => {
        if (!selectedUserForDelete) return;
        const userId = selectedUserForDelete.user_id;

        try {
            let url = `${import.meta.env.VITE_API_URL}/api/admin/permanent-delete-user/${userId}`;
            let response = await sendDeleteRequest(url);
            toast({
                description: response.message,
                status: "success",
                duration: 4000,
                position: "top",
                isClosable: true,
            });
            getAllDeletedUser();
            onClose();
            setSelectedUserForDelete(null);
        } catch (error) {
            toast({
                description: `${error?.data?.message || error?.message}`,
                status: "error",
                duration: 4000,
                position: "top",
                isClosable: true,
            });
            onClose();
        }
    };

    const isUserOnline = (updatedAt) => {
        return moment().diff(moment(updatedAt, "YYYY-MM-DD hh:mm:ss A"), "minutes") < 2;
    };

    return (
        <div className="px-2 lg:px-0">
            <div className="flex flex-col items-end gap-3 md:flex-row justify-between px-2">
                <div className="flex items-center md:w-[60%] gap-2">
                    <div
                        style={{ border: `1px solid ${border}`, backgroundColor: primaryBg }}
                        className={` justify-between rounded-[8px] pl-1 flex items-center gap-2 w-[100%]`}
                    >
                        <input
                            placeholder={`${t(`Search deleted users`)}...`}
                            className=" outline-none rounded-[8px] p-[6px]  text-black text-xs md:text-sm  w-[70%]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <span style={{ backgroundColor: bg }} className={`p-[6px] border rounded-r-[8px] cursor-pointer `}>
                            <IoSearchOutline fontSize={"22px"} color="white" />
                        </span>
                    </div>

                    <div className="flex items-center gap-1 bg-white p-1 rounded-lg border ml-2" style={{ borderColor: border }}>
                        <button
                            onClick={() => setViewMode('card')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'card' ? 'shadow-sm text-white' : 'text-gray-400 hover:bg-gray-50'}`}
                            style={{ backgroundColor: viewMode === 'card' ? iconColor : 'transparent' }}
                        >
                            <BsGridFill fontSize="14px" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'shadow-sm text-white' : 'text-gray-400 hover:bg-gray-50'}`}
                            style={{ backgroundColor: viewMode === 'list' ? iconColor : 'transparent' }}
                        >
                            <BsListUl fontSize="16px" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-between flex-col gap-4 sm:flex-row mt-6 pr-5 sm:items-center">
                <p style={{ color: iconColor }} className={`font-bold w-[100%] flex items-center gap-2 rounded-[6px] text-lg`}>
                    <FaUserSlash style={{ color: iconColor }} fontSize={"30px"} />
                    {t(`Deleted`)} {t(`User`)} {t(`Manage`)}
                    <span className={`text-red-600`}>({pagination.totalItems || 0})</span>
                </p>
                <div className="flex items-center gap-2 text-sm">
                    {t(`Show`)}
                    <select
                        onChange={(e) => setLimit(e.target.value)}
                        style={{ border: `1px solid ${border}` }}
                        className="text-xs outline-none p-1 rounded-md"
                        value={limit}
                    >
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                    {t(`Entries`)}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center mt-10">
                    <LoadingSpinner size="lg" color="red" thickness="4px" />
                </div>
            ) : allUserData.length === 0 ? (
                <div className="flex flex-col items-center mt-10">
                    <img src={nodatafound} alt="No data" className="w-[200px] opacity-50" />
                    <p className="text-gray-500 font-bold mt-4">{t("Recycle bin is empty")}</p>
                </div>
            ) : (
                <div className="mt-6">
                    {viewMode === 'list' ? (
                        <div className="flex flex-col gap-3">
                            {allUserData.map((item) => (
                                <div key={item._id} style={{ border: `1px solid ${border}` }} className="rounded-[10px] bg-white p-3 flex justify-between items-center overflow-x-auto gap-4 leading-normal">
                                    <div className="flex items-center min-w-[150px] gap-3">
                                        <Avatar name={item?.username} />
                                        <div>
                                            <p className="text-xs font-bold">{item?.username}</p>
                                            <Badge colorScheme="red" fontSize="8px">{t("DELETED")}</Badge>
                                        </div>
                                    </div>
                                    <div className="flex flex-col min-w-[150px] gap-1">
                                        <p className="text-xs font-bold text-gray-500">{t("Deleted At")}</p>
                                        <p className="text-xs">{item.deleted_at ? moment(item.deleted_at).format("DD-MM-YYYY hh:mm A") : "N/A"}</p>
                                    </div>
                                    <div className="flex flex-col min-w-[100px] gap-1">
                                        <p className="text-xs font-bold text-gray-500">{t("Balance")}</p>
                                        <p className="text-xs font-bold">{item?.amount?.toFixed(2)} {item?.currency}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleRestore(item.user_id)}
                                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all shadow-md"
                                            title={t("Restore User")}
                                        >
                                            <RiRestartLine fontSize="18px" />
                                        </button>
                                        <button
                                            onClick={() => confirmPermanentDelete(item)}
                                            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-md"
                                            title={t("Permanent Delete")}
                                        >
                                            <RiDeleteBin2Line fontSize="18px" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {allUserData.map((item) => (
                                <div key={item._id} className="rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                    <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Avatar size="sm" name={item?.username} />
                                            <p className="font-bold text-sm">{item?.username}</p>
                                        </div>
                                        <Badge colorScheme="red" variant="subtle">{t("TRASHED")}</Badge>
                                    </div>
                                    <div className="p-4">
                                        <div className="mb-4">
                                            <p className="text-[10px] text-gray-400 uppercase font-black">{t("Balance")}</p>
                                            <p className="text-lg font-bold text-red-600">{item?.amount?.toFixed(2)} {item?.currency}</p>
                                        </div>
                                        <div className="text-[11px] text-gray-500 mb-4">
                                            <p><strong>{t("Deleted On")}:</strong> {item.deleted_at ? moment(item.deleted_at).format("DD MMM, YYYY") : "N/A"}</p>
                                        </div>
                                        <div className="flex gap-2 w-full">
                                            <button
                                                onClick={() => handleRestore(item.user_id)}
                                                className="flex-1 py-2 bg-green-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1 hover:bg-green-600"
                                            >
                                                <RiRestartLine fontSize="14px" /> {t("Restore")}
                                            </button>
                                            <button
                                                onClick={() => confirmPermanentDelete(item)}
                                                className="flex-1 py-2 bg-red-600 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1 hover:bg-red-700"
                                            >
                                                <RiDeleteBin2Line fontSize="14px" /> {t("Delete")}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Permanent Delete Confirmation Modal */}
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
                    <ModalCloseButton />
                    <ModalBody p={0}>
                        <Flex direction="column" align="center" textAlign="center" gap={4}>
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

                            <Box>
                                <Text fontSize="xl" fontWeight="bold" color="gray.800" mb={2}>
                                    {t("Permanent Delete")}
                                </Text>
                                <Text fontSize="sm" color="gray.500" lineHeight="tall">
                                    {t("Are you sure you want to permanently delete")} <span className="font-bold text-gray-800">"{selectedUserForDelete?.username}"</span>?
                                    <br />
                                    {t("This action cannot be undone.")}
                                </Text>
                                {selectedUserForDelete?.amount > 0 && (
                                    <Box mt={4} p={3} bg="orange.50" borderRadius="md" border="1px dashed" borderColor="orange.200">
                                        <Text fontSize="sm" color="orange.800" fontWeight="bold">
                                            {t("Refund Alert")}:
                                        </Text>
                                        <Text fontSize="xs" color="orange.700" mt={1}>
                                            {t("This user has a wallet balance of")} <span className="font-bold">{selectedUserForDelete?.amount?.toFixed(2)} {selectedUserForDelete?.currency}</span>.
                                        </Text>
                                        <Text fontSize="xs" color="orange.700" mt={1}>
                                            {t("This amount will be refunded to your (Mother Admin) wallet automatically.")}
                                        </Text>
                                    </Box>
                                )}
                            </Box>

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
                                    {t("Cancel")}
                                </Button>
                                <Button
                                    onClick={handlePermanentDelete}
                                    colorScheme="red"
                                    w="full"
                                    size="lg"
                                    borderRadius="xl"
                                    fontSize="sm"
                                    boxShadow="lg"
                                    _hover={{ bg: "red.600" }}
                                    isLoading={loading}
                                    loadingText="Deleting"
                                >
                                    {t("Delete & Refund")}
                                </Button>
                            </Flex>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default DeletedUserManage;
