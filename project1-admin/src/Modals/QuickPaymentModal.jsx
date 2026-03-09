import React, { useState, useEffect } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    useDisclosure,
    Input,
    InputGroup,
    InputLeftElement,
    Avatar,
    Badge,
    Spinner,
    Text,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
    RiCloseLine,
    RiSearchLine,
    RiLuggageDepositLine,
    RiBankFill,
    RiUserLine,
    RiCheckFill,
    RiExchangeDollarFill,
} from "react-icons/ri";
import { fetchGetRequest } from "../api/api";
import AddBalance from "../component/usermanageComponent/AddBalance";
import SubtractBalance from "../component/usermanageComponent/SubtractBalance";

const QuickPaymentModal = ({ isOpen, onClose, onConfirm }) => {
    const { t } = useTranslation();
    const { iconColor, bg, text, border } = useSelector((state) => state.theme);

    const [step, setStep] = useState(1); // 1: Select Type, 2: Search, 3: Confirm
    const [type, setType] = useState(""); // "deposit" or "withdraw"
    const [search, setSearch] = useState("");
    const [foundUser, setFoundUser] = useState(null);
    const [loading, setLoading] = useState(false);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setType("");
            setSearch("");
            setFoundUser(null);
        }
    }, [isOpen]);

    const handleSearch = async () => {
        if (!search) return;
        setLoading(true);
        try {
            const url = `${import.meta.env.VITE_API_URL}/api/admin/get-all-user?search=${search}`;
            const response = await fetchGetRequest(url);
            if (response.data && response.data.length > 0) {
                // Find exact match or first result
                const user = response.data.find(u => u.username.toLowerCase() === search.toLowerCase()) || response.data[0];
                setFoundUser(user);
                setStep(3);
            } else {
                setFoundUser(null);
                // Maybe show error but keep on search step
            }
        } catch (error) {
            console.error("Search error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
            <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(5px)" />
            <ModalContent
                bg="white"
                boxShadow="2xl"
                borderRadius="24px"
                width="95%"
                maxW="420px"
                border="1px solid"
                borderColor="gray.100"
            >
                <ModalBody p={0}>
                    <div className="relative overflow-hidden bg-white rounded-[24px]">
                        {/* Header */}
                        <div className="p-6 pb-4 flex justify-between items-center border-b border-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <RiExchangeDollarFill size={22} />
                                </div>
                                <div>
                                    <Text fontSize="lg" fontWeight="800" color="gray.800">
                                        {step === 1 ? t('Quick Payment') : step === 2 ? t('Find Recipient') : t('Verify User')}
                                    </Text>
                                    <Text fontSize="xs" fontWeight="bold" color="gray.400" mt="-1">
                                        {step === 1 ? 'SELECT TRANSACTION' : step === 2 ? 'ENTER USERNAME' : 'CONFIRM DETAILS'}
                                    </Text>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                title="Close"
                            >
                                <RiCloseLine size={24} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="p-6 pt-6">
                            <AnimatePresence mode="wait">
                                {/* STEP 1: SELECT TYPE */}
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex flex-col gap-4"
                                    >
                                        <div
                                            onClick={() => { setType("deposit"); setStep(2); }}
                                            className="group p-5 rounded-2xl bg-white border border-gray-100 cursor-pointer shadow-sm hover:border-green-300 hover:shadow-md hover:shadow-green-50 transition-all"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 rounded-xl bg-green-50 text-green-600 group-hover:bg-green-500 group-hover:text-white transition-all shadow-inner">
                                                    <RiLuggageDepositLine size={24} />
                                                </div>
                                                <div>
                                                    <Text fontWeight="800" fontSize="md" color="gray.700">DEPOSIT FUNDS</Text>
                                                    <Text fontSize="xs" color="gray.400" fontWeight="medium">Add balance to a user account</Text>
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            onClick={() => { setType("withdraw"); setStep(2); }}
                                            className="group p-5 rounded-2xl bg-white border border-gray-100 cursor-pointer shadow-sm hover:border-red-300 hover:shadow-md hover:shadow-red-50 transition-all"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 rounded-xl bg-red-50 text-red-600 group-hover:bg-red-500 group-hover:text-white transition-all shadow-inner">
                                                    <RiBankFill size={24} />
                                                </div>
                                                <div>
                                                    <Text fontWeight="800" fontSize="md" color="gray.700">WITHDRAW FUNDS</Text>
                                                    <Text fontSize="xs" color="gray.400" fontWeight="medium">Deduct balance from a user</Text>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 2: SEARCH */}
                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex flex-col gap-6"
                                    >
                                        <div className="space-y-2">
                                            <Text fontSize="xs" fontWeight="900" color="gray.400" className="tracking-widest flex items-center gap-1 uppercase">
                                                <RiUserLine /> PLAYER USERNAME
                                            </Text>
                                            <InputGroup size="lg">
                                                <Input
                                                    placeholder="Search username..."
                                                    borderRadius="14px"
                                                    autoFocus
                                                    value={search}
                                                    onChange={(e) => setSearch(e.target.value)}
                                                    onKeyPress={handleKeyPress}
                                                    bg="gray.50"
                                                    border="1px solid"
                                                    borderColor="gray.100"
                                                    _focus={{ borderColor: "indigo-400", bg: "white", boxShadow: "0 0 0 4px rgba(99, 102, 241, 0.1)" }}
                                                    className="font-bold text-gray-700 placeholder:text-gray-300"
                                                />
                                            </InputGroup>
                                        </div>

                                        <button
                                            onClick={handleSearch}
                                            disabled={loading || !search}
                                            className={`w-full py-4 rounded-xl font-black text-white shadow-lg transition-all flex items-center justify-center gap-2 ${!search ? 'bg-gray-200 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'
                                                }`}
                                        >
                                            {loading ? <Spinner size="sm" /> : <><RiSearchLine /> SEARCH DATABASE</>}
                                        </button>

                                        <button
                                            onClick={() => setStep(1)}
                                            className="text-[10px] font-black text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest"
                                        >
                                            ← Back to Selection
                                        </button>
                                    </motion.div>
                                )}

                                {/* STEP 3: CONFIRM */}
                                {step === 3 && foundUser && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col gap-6 items-center"
                                    >
                                        <div className="w-full p-6 rounded-[24px] bg-gray-50 border border-gray-100 flex flex-col items-center shadow-inner">
                                            <div className="relative mb-3">
                                                <Avatar
                                                    size="xl"
                                                    name={foundUser.username}
                                                    src={foundUser.avatar}
                                                    border="4px solid white"
                                                    shadow="lg"
                                                    bg="indigo.500"
                                                />
                                                <div className="absolute bottom-1 right-1 p-1.5 bg-green-500 rounded-full border-2 border-white shadow-sm">
                                                    <RiCheckFill color="white" size={14} />
                                                </div>
                                            </div>

                                            <Text fontSize="2xl" fontWeight="900" color="gray.800">@{foundUser.username}</Text>
                                            <Badge colorScheme="green" variant="solid" borderRadius="full" px={3} py={1} fontSize="10px" mt={1}>VERIFIED USER</Badge>

                                            <div className="mt-6 w-full pt-4 border-t border-gray-200 flex justify-between items-center">
                                                <Text fontSize="xs" fontWeight="900" color="gray.400" className="tracking-tighter">AVAILABLE BALANCE</Text>
                                                <Text fontSize="lg" fontWeight="900" color="indigo-600">₹{foundUser.amount?.toLocaleString()}</Text>
                                            </div>
                                        </div>

                                        <div className="w-full flex flex-col gap-3">
                                            <button
                                                onClick={() => onConfirm(foundUser, type)}
                                                className={`w-full py-4 rounded-xl text-white font-black shadow-lg active:scale-[0.98] transition-all text-sm tracking-wider ${type === 'deposit'
                                                    ? 'bg-green-600 hover:bg-green-700 shadow-green-100'
                                                    : 'bg-red-600 hover:bg-red-700 shadow-red-100'
                                                    }`}
                                            >
                                                {type === 'deposit' ? 'START DEPOSIT PROCESS' : 'START WITHDRAWAL PROCESS'}
                                            </button>

                                            <button
                                                onClick={() => setStep(2)}
                                                className="py-2 text-[10px] font-black text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest"
                                            >
                                                Find Another Username
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Subtle aesthetic touch */}
                        <div className="h-1 w-full bg-gray-50 flex items-center justify-center">
                            <div className="w-12 h-1 rounded-full bg-gray-200"></div>
                        </div>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default QuickPaymentModal;
