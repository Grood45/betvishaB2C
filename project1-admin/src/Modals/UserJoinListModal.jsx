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
import { RiAdminLine } from 'react-icons/ri';
import { FaUserCircle } from 'react-icons/fa';
import moment from 'moment';
import { useSelector } from 'react-redux';

const UserJoinListModal = ({ isOpen, onClose, date, groupBy, joinType, adminName, modelQuery }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { color, primaryBg, iconColor, secondaryBg, bg, hoverColor, hover, text, font, border } = useSelector((state) => state.theme);


    useEffect(() => {
        if (isOpen && date) {
            fetchUsersList();
        }
    }, [isOpen, date]);

    const fetchUsersList = async () => {
        setLoading(true);
        setError(null);
        try {
            let url = `${import.meta.env.VITE_API_URL}/api/admin/get-users-by-join-date?date=${date}&groupBy=${groupBy}&joinType=${joinType}`;
            if (adminName) url += `&adminName=${adminName}`;

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

    const isRecent = (joinedAt) => {
        const joinDate = moment(joinedAt);
        const now = moment();
        const diffHours = now.diff(joinDate, 'hours');
        return diffHours <= 24; // recent if joined within 24 hours
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
            <ModalOverlay backdropFilter="blur(5px)" bg="blackAlpha.300" />
            <ModalContent rounded="2xl" overflow="hidden" boxShadow="xl">
                <ModalHeader bg="gray.50" borderBottom="1px solid" borderColor="gray.100" pb={4}>
                    <Flex justify="space-between" align="center" pr={8}>
                        <Box>
                            <Text fontSize="xl" fontWeight="bold" color="gray.800" display="flex" alignItems="center" gap={2}>
                                <MdPersonOutline size={24} color={iconColor} />
                                {t("Users Joined")}
                                <Badge colorScheme="blue" ml={2} px={3} py={1} rounded="full" fontSize="sm">
                                    {date}
                                </Badge>
                            </Text>
                            <Text fontSize="sm" color="gray.500" mt={1} fontWeight="medium">
                                {t("Total Users Found")}: <Text as="span" fontWeight="bold" color="gray.700">{users.length}</Text>
                            </Text>
                        </Box>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton mt={3} mr={2} rounded="full" _hover={{ bg: "gray.100" }} />

                <ModalBody p={0} bg="whitesmoke">
                    {loading ? (
                        <Flex justify="center" align="center" h="300px" flexDir="column" gap={4}>
                            <Spinner size="xl" color={iconColor} thickness="4px" />
                            <Text color="gray.500" fontWeight="medium">{t("Loading users...")}</Text>
                        </Flex>
                    ) : error ? (
                        <Flex justify="center" align="center" h="300px" flexDir="column">
                            <Text color="red.500" fontWeight="bold" mb={2}>{t("Error")}</Text>
                            <Text color="gray.600">{error}</Text>
                        </Flex>
                    ) : users.length === 0 ? (
                        <Flex justify="center" align="center" h="300px" flexDir="column" color="gray.400">
                            <MdPersonOutline size={60} opacity={0.3} />
                            <Text mt={4} fontWeight="medium">{t("No users found for this date/period.")}</Text>
                        </Flex>
                    ) : (
                        <Box overflowX="auto" p={4}>
                            <Table variant="simple" bg="white" rounded="xl" shadow="sm">
                                <Thead bg="gray.50">
                                    <Tr>
                                        <Th color="gray.500" fontWeight="bold">{t("User")}</Th>
                                        <Th color="gray.500" fontWeight="bold">{t("Joined At")}</Th>
                                        <Th color="gray.500" fontWeight="bold">{t("Type")}</Th>
                                        <Th color="gray.500" fontWeight="bold">{t("Added By")}</Th>
                                        <Th color="gray.500" fontWeight="bold">{t("Status")}</Th>
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
                                                    <Box bg="blue.50" p={2} rounded="full" color="blue.500">
                                                        <FaUserCircle size={20} />
                                                    </Box>
                                                    <Box>
                                                        <Text fontWeight="bold" color="gray.800">{user.username}</Text>
                                                        {isRecent(user.joined_at) && (
                                                            <Badge colorScheme="green" variant="subtle" fontSize="2xs" rounded="md" mt={1}>
                                                                {t("NEW")}
                                                            </Badge>
                                                        )}
                                                    </Box>
                                                </Flex>
                                            </Td>
                                            <Td>
                                                <Flex align="center" gap={2} color="gray.600">
                                                    <MdOutlineDateRange />
                                                    <Text fontSize="sm" fontWeight="medium">
                                                        {moment(user.joined_at).format('DD MMM YYYY, hh:mm A')}
                                                    </Text>
                                                </Flex>
                                            </Td>
                                            <Td>
                                                {user.parent_admin_username ? (
                                                    <Badge colorScheme="purple" p={1.5} px={3} rounded="lg" display="flex" alignItems="center" gap={1} w="fit-content">
                                                        <RiAdminLine /> {t("Manual")}
                                                    </Badge>
                                                ) : (
                                                    <Badge colorScheme="teal" p={1.5} px={3} rounded="lg" display="flex" alignItems="center" gap={1} w="fit-content">
                                                        <MdPersonAdd /> {t("Auto/Self")}
                                                    </Badge>
                                                )}
                                            </Td>
                                            <Td>
                                                {user.parent_admin_username ? (
                                                    <Text fontWeight="bold" color="gray.700">{user.parent_admin_username}</Text>
                                                ) : (
                                                    <Text color="gray.400" fontStyle="italic">-</Text>
                                                )}
                                            </Td>
                                            <Td>
                                                {user.status ? (
                                                    <Badge colorScheme="green" rounded="md" px={2}>{t("Active")}</Badge>
                                                ) : (
                                                    <Badge colorScheme="red" rounded="md" px={2}>{t("Inactive")}</Badge>
                                                )}
                                                {user.is_online && (
                                                    <Tooltip label={t("Currently Online")}>
                                                        <Badge ml={2} colorScheme="green" variant="solid" rounded="full" w="2" h="2" p={0} />
                                                    </Tooltip>
                                                )}
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

export default UserJoinListModal;
