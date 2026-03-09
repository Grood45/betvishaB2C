
import React, { useState } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    Checkbox,
    CheckboxGroup,
    Stack,
    useToast,
    Image,
    Text,
    Box,
} from "@chakra-ui/react";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/logo.png";

const ExportModal = ({ isOpen, onClose, data, title = "User Data" }) => {
    // Fixed Premium Light Theme Colors
    const theme = {
        bg: "white",
        cardBg: "gray.50",
        text: "gray.800",
        border: "gray.200",
        accent: "purple.500",
        hover: "gray.100",
        inputBg: "white",
        mutedText: "gray.500",
        inputBorder: "gray.300"
    };

    const toast = useToast();

    // Field Selection State
    const [selectedFields, setSelectedFields] = useState({
        username: true,
        phone: true,
        email: true,
        country: true,
        amount: true,
    });

    // Filter States
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [userSearch, setUserSearch] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);

    // 1. First, filter data by Date Range
    const usersInDateRange = React.useMemo(() => {
        if (!fromDate && !toDate) return data;

        return data.filter((item) => {
            if (!item.joined_at) return false;
            const joinedDate = new Date(item.joined_at);
            if (isNaN(joinedDate.getTime())) return false;

            if (fromDate) {
                const from = new Date(fromDate);
                from.setHours(0, 0, 0, 0);
                if (joinedDate < from) return false;
            }
            if (toDate) {
                const to = new Date(toDate);
                to.setHours(23, 59, 59, 999);
                if (joinedDate > to) return false;
            }
            return true;
        });
    }, [data, fromDate, toDate]);

    // 2. Then, filter by Search
    const filteredUsersForSelection = React.useMemo(() => {
        return usersInDateRange.filter(user =>
            user.username.toLowerCase().includes(userSearch.toLowerCase())
        );
    }, [usersInDateRange, userSearch]);

    // Initialize/Reset selectedUsers
    React.useEffect(() => {
        if (isOpen) {
            const ids = filteredUsersForSelection.map(u => u._id);
            setSelectedUsers(ids);
        }
    }, [fromDate, toDate, isOpen, data]);

    const handleFieldChange = (e) => {
        setSelectedFields({
            ...selectedFields,
            [e.target.name]: e.target.checked,
        });
    };

    const handleUserToggle = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const visibleIds = filteredUsersForSelection.map(user => user._id);
            const newSelection = [...new Set([...selectedUsers, ...visibleIds])];
            setSelectedUsers(newSelection);
        } else {
            const visibleIds = filteredUsersForSelection.map(user => user._id);
            setSelectedUsers(selectedUsers.filter(id => !visibleIds.includes(id)));
        }
    };

    const isAllVisibleSelected = filteredUsersForSelection.length > 0 && filteredUsersForSelection.every(user => selectedUsers.includes(user._id));
    const isSomeVisibleSelected = filteredUsersForSelection.some(user => selectedUsers.includes(user._id)) && !isAllVisibleSelected;

    const getFilteredData = () => {
        return data.filter((item) => selectedUsers.includes(item._id)).map((item) => {
            const filteredItem = {};
            if (selectedFields.username) filteredItem["Username"] = item.username;
            if (selectedFields.phone) filteredItem["Phone"] = item.phone || "N/A";
            if (selectedFields.email) filteredItem["Email"] = item.email || "N/A";
            if (selectedFields.country) filteredItem["Country"] = item.country || "N/A";
            if (selectedFields.amount) filteredItem["Balance"] = item.amount?.toFixed(2);
            return filteredItem;
        });
    };

    const handleExcelExport = () => {
        try {
            const filteredData = getFilteredData();
            if (filteredData.length === 0) {
                toast({
                    title: "No data to export",
                    description: "Please adjust your filters or select users.",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }
            const worksheet = XLSX.utils.json_to_sheet(filteredData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            const excelBuffer = XLSX.write(workbook, {
                bookType: "xlsx",
                type: "array",
            });
            const dataBlob = new Blob([excelBuffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
            });
            saveAs(dataBlob, `${title.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.xlsx`);
            onClose();
            toast({ status: "success", title: "Excel downloaded successfully!" });
        } catch (error) {
            console.error(error);
            toast({ status: "error", title: "Excel export failed" });
        }
    };

    const handlePdfExport = async () => {
        try {
            const filteredData = getFilteredData();

            if (filteredData.length === 0) {
                toast({
                    title: "No data to export",
                    description: "Please adjust your filters or select users.",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }

            const doc = new jsPDF();

            const loadImage = (src) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.src = src;
                    img.onload = () => resolve(img);
                    img.onerror = (e) => reject(e);
                });
            };

            try {
                const img = await loadImage(logo);
                doc.addImage(img, "PNG", 14, 10, 30, 20);
            } catch (logoError) {
                console.warn("Logo loading failed, proceeding without logo:", logoError);
            }

            doc.setFontSize(18);
            doc.text(title, 50, 22);
            doc.setFontSize(10);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 35);
            if (fromDate || toDate) {
                doc.text(`Date Range: ${fromDate || 'Start'} to ${toDate || 'Now'}`, 14, 40);
            }

            const tableColumn = Object.keys(filteredData[0]);
            const tableRows = filteredData.map((item) => Object.values(item));

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 45,
                theme: "grid",
                headStyles: { fillColor: [128, 90, 213] }, // Purple matching theme
            });

            doc.save(`${title.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`);
            onClose();
            toast({ status: "success", title: "PDF downloaded successfully!" });
        } catch (error) {
            console.error("PDF Export Error:", error);
            toast({
                status: "error",
                title: "PDF export failed",
                description: error.message || "Unknown error occurred"
            });
        }
    };

    // Custom Scrollbar Style for Light Theme
    const scrollbarStyle = {
        "&::-webkit-scrollbar": {
            width: "6px",
        },
        "&::-webkit-scrollbar-track": {
            width: "6px",
            background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
            background: "gray.400",
            borderRadius: "24px",
        },
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl" motionPreset="scale">
            <ModalOverlay backdropFilter="blur(5px)" bg="blackAlpha.300" />
            <ModalContent
                bg={theme.bg}
                borderColor={theme.border}
                borderWidth="1px"
                color={theme.text}
                boxShadow="xl"
                borderRadius="2xl"
                overflow="hidden"
            >
                <ModalHeader
                    bg="white"
                    borderBottom={`1px solid ${theme.border}`}
                    fontSize="xl"
                    fontWeight="bold"
                    display="flex"
                    alignItems="center"
                    gap={3}
                    py={5}
                >
                    <Box
                        as="span"
                        bgGradient="linear(to-r, purple.500, blue.500)"
                        bgClip="text"
                        fontSize="2xl"
                    >
                        📊
                    </Box>
                    <Text color={theme.text}>
                        Advanced Export
                    </Text>
                </ModalHeader>
                <ModalCloseButton color="gray.500" _hover={{ color: "red.500", bg: "red.50" }} />

                <ModalBody py={6} px={6} bg={theme.bg}>
                    <Stack spacing={6}>
                        {/* 1. Date Range Filter */}
                        <Box
                            bg={theme.cardBg}
                            borderRadius="xl"
                            p={5}
                            border="1px solid"
                            borderColor={theme.border}
                            boxShadow="md"
                            position="relative"
                            overflow="hidden"
                        >
                            <Box
                                position="absolute"
                                top={0} left={0} w="4px" h="100%"
                                bg="blue.400"
                            />
                            <Text fontWeight="bold" mb={4} fontSize="sm" color={theme.mutedText} textTransform="uppercase" letterSpacing="wide">
                                📅 DATE RANGE
                            </Text>
                            <Stack direction={{ base: "column", md: "row" }} spacing={4}>
                                <Box w="100%">
                                    <Text fontSize="xs" mb={1} color={theme.mutedText}>From</Text>
                                    <Box
                                        as="input"
                                        type="date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                        w="100%"
                                        p={3}
                                        borderRadius="lg"
                                        border="1px solid"
                                        borderColor={theme.inputBorder}
                                        bg={theme.inputBg}
                                        color={theme.text}
                                        css={{ "color-scheme": "light" }}
                                        _focus={{ borderColor: "blue.400", outline: "none", boxShadow: "0 0 0 1px blue.400" }}
                                    />
                                </Box>
                                <Box w="100%">
                                    <Text fontSize="xs" mb={1} color={theme.mutedText}>To</Text>
                                    <Box
                                        as="input"
                                        type="date"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                        w="100%"
                                        p={3}
                                        borderRadius="lg"
                                        border="1px solid"
                                        borderColor={theme.inputBorder}
                                        bg={theme.inputBg}
                                        color={theme.text}
                                        css={{ "color-scheme": "light" }}
                                        _focus={{ borderColor: "purple.500", outline: "none", boxShadow: "0 0 0 1px purple.500" }}
                                    />
                                </Box>
                            </Stack>
                        </Box>

                        {/* 2. User Selection */}
                        <Box
                            bg={theme.cardBg}
                            borderRadius="xl"
                            p={5}
                            border="1px solid"
                            borderColor={theme.border}
                            boxShadow="md"
                            position="relative"
                            overflow="hidden"
                        >
                            <Box
                                position="absolute"
                                top={0} left={0} w="4px" h="100%"
                                bg="purple.500"
                            />
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                                <Text fontWeight="bold" fontSize="sm" color={theme.mutedText} textTransform="uppercase" letterSpacing="wide" display="flex" alignItems="center" gap={2}>
                                    👥 SELECT USERS
                                    {selectedUsers.length > 0 && (
                                        <Text as="span" fontSize="xs" bg={theme.accent} color="white" px={2} py={0.5} borderRadius="full">
                                            {selectedUsers.length}
                                        </Text>
                                    )}
                                </Text>
                                <Checkbox
                                    isChecked={isAllVisibleSelected}
                                    isIndeterminate={isSomeVisibleSelected}
                                    onChange={handleSelectAll}
                                    colorScheme="purple"
                                    size="sm"
                                    color="gray.600"
                                >
                                    Select All
                                </Checkbox>
                            </Stack>

                            <Box
                                as="input"
                                type="text"
                                placeholder="🔍 Search user..."
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                                w="100%"
                                p={3}
                                mb={3}
                                borderRadius="lg"
                                border="1px solid"
                                borderColor={theme.inputBorder}
                                bg={theme.inputBg}
                                color={theme.text}
                                _focus={{ borderColor: "purple.500", outline: "none" }}
                            />

                            <Box
                                maxH="180px"
                                overflowY="auto"
                                borderRadius="md"
                                p={1}
                                css={scrollbarStyle}
                            >
                                <Stack spacing={1}>
                                    {filteredUsersForSelection.map(user => (
                                        <Box
                                            key={user._id}
                                            p={2}
                                            borderRadius="md"
                                            bg={selectedUsers.includes(user._id) ? "purple.50" : "transparent"}
                                            _hover={{ bg: "gray.100" }}
                                            transition="all 0.2s"
                                            display="flex"
                                            alignItems="center"
                                            borderLeft={selectedUsers.includes(user._id) ? "2px solid" : "2px solid transparent"}
                                            borderLeftColor="purple.400"
                                        >
                                            <Checkbox
                                                isChecked={selectedUsers.includes(user._id)}
                                                onChange={() => handleUserToggle(user._id)}
                                                colorScheme="purple"
                                                size="sm"
                                                w="100%"
                                            >
                                                <Text fontSize="sm" ml={2} color={theme.text}>{user.username}</Text>
                                            </Checkbox>
                                        </Box>
                                    ))}
                                    {filteredUsersForSelection.length === 0 && (
                                        <Text fontSize="sm" color="gray.500" textAlign="center" py={4}>
                                            No users found
                                        </Text>
                                    )}
                                </Stack>
                            </Box>
                        </Box>

                        {/* 3. Field Selection */}
                        <Box
                            bg={theme.cardBg}
                            borderRadius="xl"
                            p={5}
                            border="1px solid"
                            borderColor={theme.border}
                            boxShadow="md"
                            position="relative"
                            overflow="hidden"
                        >
                            <Box
                                position="absolute"
                                top={0} left={0} w="4px" h="100%"
                                bg="pink.500"
                            />
                            <Text fontWeight="bold" mb={4} fontSize="sm" color={theme.mutedText} textTransform="uppercase" letterSpacing="wide">
                                📝 FIELDS
                            </Text>
                            <CheckboxGroup colorScheme="pink" defaultValue={["username", "phone", "email", "country", "amount"]}>
                                <Stack spacing={4} direction="row" flexWrap="wrap">
                                    {['username', 'phone', 'email', 'country', 'amount'].map((field) => (
                                        <Checkbox
                                            key={field}
                                            isChecked={selectedFields[field]}
                                            name={field}
                                            onChange={handleFieldChange}
                                            textTransform="capitalize"
                                            size="sm"
                                            color="gray.600"
                                        >
                                            {field === 'amount' ? 'Balance' : field}
                                        </Checkbox>
                                    ))}
                                </Stack>
                            </CheckboxGroup>
                        </Box>
                    </Stack>

                    <Box mt={8} display="flex" gap={4} justifyContent="center">
                        <Button
                            leftIcon={<FaFilePdf />}
                            colorScheme="red"
                            _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                            _active={{ transform: "translateY(0)" }}
                            onClick={handlePdfExport}
                            width="full"
                            size="lg"
                            borderRadius="xl"
                            fontWeight="bold"
                            transition="all 0.2s"
                        >
                            Export PDF
                        </Button>
                        <Button
                            leftIcon={<FaFileExcel />}
                            colorScheme="green"
                            _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                            _active={{ transform: "translateY(0)" }}
                            onClick={handleExcelExport}
                            width="full"
                            size="lg"
                            borderRadius="xl"
                            fontWeight="bold"
                            transition="all 0.2s"
                        >
                            Export Excel
                        </Button>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ExportModal;
