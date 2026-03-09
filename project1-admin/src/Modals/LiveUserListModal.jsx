import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    Spinner,
    Text,
    Box,
    Flex,
    Icon,
    Tooltip
} from '@chakra-ui/react';
import { fetchGetRequest } from '../api/api';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MdOutlineDateRange, MdPersonOutline, MdPersonAdd } from 'react-icons/md';
import { FaUserCircle, FaMapMarkerAlt } from 'react-icons/fa';
import { RiAdminLine } from 'react-icons/ri';
import moment from 'moment';
import { useSelector } from 'react-redux';

const LiveUserListModal = ({ isOpen, onClose, country, state, modelQuery }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { color, primaryBg, iconColor, secondaryBg, bg, hoverColor, hover, text, font, border } = useSelector((globalState) => globalState.theme);

    // Helper to get flag emoji
    const getFlagEmoji = (countryCode) => {
        if (!countryCode || countryCode === "Unknown") return "🌍";
        const flags = {
            "INDIA": "🇮🇳", "USA": "🇺🇸", "UK": "🇬🇧", "UAE": "🇦🇪", "CANADA": "🇨🇦",
            "AUSTRALIA": "🇦🇺", "GERMANY": "🇩🇪", "FRANCE": "🇫🇷", "BANGLADESH": "🇧🇩",
            "PAKISTAN": "🇵🇰", "SRI LANKA": "🇱🇰", "NEPAL": "🇳🇵", "CHINA": "🇨🇳",
            "JAPAN": "🇯🇵", "RUSSIA": "🇷🇺", "BRAZIL": "🇧🇷"
        };
        return flags[countryCode.toUpperCase()] || "📍";
    };

    useEffect(() => {
        if (isOpen) {
            fetchUsersList();
        }
    }, [isOpen, country, state]);

    const fetchUsersList = async () => {
        if (users.length === 0) setLoading(true); // Only show spinner if we don't have previously cached users
        setError(null);
        try {
            let url = `${import.meta.env.VITE_API_URL}/api/admin/get-live-users-by-location?country=${country}&state=${state}`;
            const response = await fetchGetRequest(url);

            if (response.success) {
                setUsers(response.data || []);
            } else {
                setError(response.message || 'Failed to fetch users');
            }
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
            <ModalOverlay backdropFilter="blur(5px)" bg="blackAlpha.300" />
            <ModalContent rounded="2xl" overflow="hidden" boxShadow="xl">
                <ModalHeader bg="gray.50" borderBottom="1px solid" borderColor="gray.100" pb={4}>
                    <Flex justify="space-between" align="center" pr={8}>
                        <Box>
                            <Text fontSize="xl" fontWeight="bold" color="gray.800" display="flex" alignItems="center" gap={2}>
                                <div className="text-green-500 relative flex items-center justify-center p-1">
                                    <MdPersonOutline size={24} />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full border border-white animate-pulse"></span>
                                </div>
                                {t("Live Users from")}
                                <Badge bg="white" color="gray.700" ml={2} px={3} py={1} rounded="lg" fontSize="sm" shadow="sm" border="1px solid" borderColor="gray.200" display="flex" alignItems="center" gap={2}>
                                    {(country && state) ? (
                                        <>
                                            <span className="text-lg">{getFlagEmoji(country)}</span>
                                            {state === "Unknown" ? country : `${state}, ${country}`}
                                        </>
                                    ) : (
                                        <span>{t("All Locations")}</span>
                                    )}
                                </Badge>
                            </Text>
                            <Text fontSize="sm" color="gray.500" mt={1} fontWeight="medium">
                                {t("Currently Online")}: <Text as="span" fontWeight="bold" color="green.600">{users.length} {t("Users")}</Text>
                            </Text>
                        </Box>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton mt={3} mr={2} rounded="full" _hover={{ bg: "gray.100" }} />

                <ModalBody p={0} bg="whitesmoke">
                    {loading ? (
                        <Flex justify="center" align="center" h="300px" flexDir="column" gap={4}>
                            <Spinner size="xl" color="green.500" thickness="4px" />
                            <Text color="gray.500" fontWeight="medium">{t("Scanning Live Traffic...")}</Text>
                        </Flex>
                    ) : error ? (
                        <Flex justify="center" align="center" h="300px" flexDir="column">
                            <Text color="red.500" fontWeight="bold" mb={2}>{t("Error")}</Text>
                            <Text color="gray.600">{error}</Text>
                        </Flex>
                    ) : users.length === 0 ? (
                        <Flex justify="center" align="center" h="300px" flexDir="column" color="gray.400">
                            <MdPersonOutline size={60} opacity={0.3} />
                            <Text mt={4} fontWeight="medium">{t("No users are online from this location right now.")}</Text>
                        </Flex>
                    ) : (
                        <Box overflowX="auto" p={4}>
                            <Table variant="simple" bg="white" rounded="xl" shadow="sm">
                                <Thead bg="gray.50">
                                    <Tr>
                                        <Th color="gray.500" fontWeight="bold">{t("Online User")}</Th>
                                        <Th color="gray.500" fontWeight="bold">{t("Since (Registered)")}</Th>
                                        <Th color="gray.500" fontWeight="bold">{t("Added By")}</Th>
                                        <Th color="gray.500" fontWeight="bold">{t("Current Status")}</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {users.map((user, index) => (
                                        <Tr
                                            key={user._id || index}
                                            _hover={{ bg: "gray.50", cursor: "pointer" }}
                                            transition="background 0.2s"
                                            onClick={() => {
                                                navigate(`/usermanage/${user.username}`);
                                                onClose();
                                            }}
                                        >
                                            <Td>
                                                <Flex align="center" gap={3}>
                                                    <Box bg="green.50" p={2} rounded="full" color="green.500">
                                                        <FaUserCircle size={20} />
                                                    </Box>
                                                    <Box>
                                                        <Text fontWeight="bold" color="gray.800">{user.username}</Text>
                                                        <Text color="gray.500" fontSize="xs" display="flex" alignItems="center" gap={1}>
                                                            <FaMapMarkerAlt size={10} />
                                                            {user.state === "Unknown" ? user.country : user.state}
                                                        </Text>
                                                    </Box>
                                                </Flex>
                                            </Td>
                                            <Td>
                                                <Flex align="center" gap={2} color="gray.600">
                                                    <MdOutlineDateRange />
                                                    <Text fontSize="sm" fontWeight="medium">
                                                        {moment(user.joined_at).format('DD MMM YYYY')}
                                                    </Text>
                                                </Flex>
                                            </Td>
                                            <Td>
                                                {user.parent_admin_username ? (
                                                    <Text fontWeight="bold" color="gray.700" display="flex" alignItems="center" gap={1}>
                                                        <RiAdminLine color="purple" /> {user.parent_admin_username}
                                                    </Text>
                                                ) : (
                                                    <Text color="gray.400" fontStyle="italic" display="flex" alignItems="center" gap={1}>
                                                        <MdPersonAdd color="teal" /> {t("Self/Auto")}
                                                    </Text>
                                                )}
                                            </Td>
                                            <Td>
                                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-bold border border-green-100 shadow-sm">
                                                    <span>Live</span>
                                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span>
                                                </div>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    )}
                </ModalBody>

                <ModalFooter bg="gray.50" borderTop="1px solid" borderColor="gray.100">
                    <Button onClick={onClose} rounded="xl" px={8} colorScheme="gray">
                        {t("Close")}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default LiveUserListModal;
