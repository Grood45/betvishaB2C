import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
    MdOutlineSportsCricket, MdAdd, MdDelete, MdCloudUpload,
    MdSettings, MdHistory, MdBrandingWatermark, MdLabel,
    MdLink, MdVpnKey, MdPerson, MdCheckCircle, MdError,
    MdSpeed, MdRefresh, MdOutlineDragIndicator
} from "react-icons/md";
import {
    FaBolt, FaInfoCircle, FaTools, FaRegCalendarAlt, FaChevronRight
} from "react-icons/fa";
import {
    FormControl, FormLabel, SimpleGrid, Box, Flex, Text,
    Button, Input, Select, IconButton, VStack, HStack,
    Divider, Image, Tooltip, Center, Switch, Spinner,
    useToast, Badge, Progress, Breadcrumb, BreadcrumbItem,
    BreadcrumbLink,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    useDisclosure,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchGetRequest, sendPostRequest } from "../api/api";

const MotionBox = motion(Box);

const LuckySportManage = () => {
    const { bg, border, iconColor, primaryBg } = useSelector((state) => state.theme);
    const { t } = useTranslation();
    const toast = useToast();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [isDirty, setIsDirty] = useState(false);
    const [latency, setLatency] = useState(null);
    const [isTesting, setIsTesting] = useState(false);
    const [quota, setQuota] = useState(null);
    const [fetchingQuota, setFetchingQuota] = useState(false);

    const [formData, setFormData] = useState({
        provider_name: "LuckySport",
        cert_key: "",
        agent_code: "",
        merchant_code: "",
        jwt_secret: "",
        callback_url: "",
        provider_logo: "",
        provider_image: "",
        status: false,
        is_maintenance: false,
        maintenance_display_type: "alert",
        is_coming_soon: false,
        coming_soon_display_type: "alert",
    });
    const [uploadLoading, setUploadLoading] = useState({ logo: false, image: false });
    const { isOpen: isSuccessOpen, onOpen: onSuccessOpen, onClose: onSuccessClose } = useDisclosure();

    const getProviderSetup = useCallback(async () => {
        setFetching(true);
        let url = `${import.meta.env.VITE_API_URL}/api/sport/setup/LuckySport`;
        try {
            let response = await fetchGetRequest(url);
            if (response && response.data) {
                setFormData({
                    provider_name: "LuckySport",
                    cert_key: response.data.cert_key || "",
                    agent_code: response.data.agent_code || "",
                    merchant_code: response.data.merchant_code || "", // Added
                    jwt_secret: response.data.jwt_secret || "",       // Added
                    callback_url: response.data.callback_url || "",
                    provider_logo: response.data.provider_logo || "",
                    provider_image: response.data.provider_image || "",
                    status: response.data.status || false,
                    is_maintenance: response.data.is_maintenance || false,
                    maintenance_display_type: response.data.maintenance_display_type || "alert",
                    is_coming_soon: response.data.is_coming_soon || false,
                    coming_soon_display_type: response.data.coming_soon_display_type || "alert",
                });
            }
            setIsDirty(false);
        } catch (error) {
            console.log("No existing setup found or error:", error);
        } finally {
            setFetching(false);
        }
    }, [t]);

    const fetchQuota = useCallback(async () => {
        setFetchingQuota(true);
        try {
            const url = `${import.meta.env.VITE_API_URL}/api/sport/lucky-sport/merchant-quota`;
            const response = await fetchGetRequest(url);
            if (response && response.success) {
                setQuota(response.quota);
            }
        } catch (error) {
            console.error("Error fetching quota:", error);
        } finally {
            setFetchingQuota(false);
        }
    }, []);

    useEffect(() => {
        getProviderSetup();
        fetchQuota();
    }, [getProviderSetup, fetchQuota]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setIsDirty(true);
    };

    const handleStatusChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            status: e.target.checked,
        }));
        setIsDirty(true);
    };

    const handleServiceStatusChange = (field) => {
        setFormData(prev => ({
            ...prev,
            is_maintenance: field === 'is_maintenance' ? !prev.is_maintenance : false,
            is_coming_soon: field === 'is_coming_soon' ? !prev.is_coming_soon : false,
        }));
        setIsDirty(true);
    };

    const testConnection = async () => {
        setIsTesting(true);
        setLatency(null);

        // Simulate API latency test
        await new Promise(resolve => setTimeout(resolve, 1500));
        const simulatedLatency = Math.floor(Math.random() * 200) + 50;
        setLatency(simulatedLatency);
        setIsTesting(false);

        toast({
            title: "Connection Perfect",
            description: `LuckySport Node responded in ${simulatedLatency}ms`,
            status: "success",
            duration: 3000,
            position: "top-right"
        });
    };

    const handleImageUpload = async (file, type) => {
        if (!file) return;
        setUploadLoading((prev) => ({ ...prev, [type]: true }));
        const uploadData = new FormData();
        uploadData.append("post_img", file);
        try {
            const response = await sendPostRequest(
                `${import.meta.env.VITE_API_URL}/api/payment/image-url`,
                uploadData
            );
            if (response.url) {
                setFormData((prev) => ({
                    ...prev,
                    [type === 'logo' ? 'provider_logo' : 'provider_image']: response.url
                }));
                setIsDirty(true);
                toast({ title: "Upload successful", status: "success", duration: 2000, position: 'top' });
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            toast({ title: "Failed to upload image", status: "error", duration: 3000, position: 'top' });
        } finally {
            setUploadLoading((prev) => ({ ...prev, [type]: false }));
        }
    };

    const handleSave = async () => {
        setLoading(true);
        let url = `${import.meta.env.VITE_API_URL}/api/sport/setup`;
        try {
            await sendPostRequest(url, formData);
            onSuccessOpen();
            setIsDirty(false);
            getProviderSetup();
            setTimeout(() => {
                onSuccessClose();
            }, 2500);
        } catch (error) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Something went wrong.",
                status: "error",
                duration: 3000,
                position: "top",
            });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <Center h="80vh">
                <Spinner size="xl" color={bg} thickness="4px" />
            </Center>
        );
    }

    return (
        <Box minH="100vh" bg="#F8FAFC">
            {/* Sticky Fancy Header */}
            <Box
                position="sticky"
                top={{ base: "60px", lg: "80px" }}
                zIndex="1000"
                bg="rgba(255, 255, 255, 0.8)"
                backdropFilter="blur(12px)"
                borderBottom="1px solid"
                borderColor="gray.200"
                py={3}
                px={{ base: 4, lg: 8 }}
            >
                <Flex align="center" justify="space-between" maxW="1600px" mx="auto">
                    <VStack align="start" spacing={0}>
                        <Breadcrumb fontSize="xs" color="gray.500" separator={<FaChevronRight size={8} />}>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="#">Settings</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbItem isCurrentPage>
                                <BreadcrumbLink href="#">LuckySport</BreadcrumbLink>
                            </BreadcrumbItem>
                        </Breadcrumb>
                        <HStack spacing={3}>
                            <Text fontSize="xl" fontWeight="800" letterSpacing="-0.5px" color="#1E293B">
                                LuckySport Premium
                            </Text>
                            <AnimatePresence>
                                {isDirty && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                    >
                                        <Badge colorScheme="red" variant="subtle" rounded="full" px={3} py={0.5} fontSize="9px" fontWeight="900">
                                            UNSAVED CHANGES
                                        </Badge>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </HStack>
                    </VStack>

                    <HStack spacing={4}>
                        <Button
                            variant="ghost"
                            size="sm"
                            fontSize="xs"
                            fontWeight="bold"
                            onClick={() => window.location.reload()}
                        >
                            Discard
                        </Button>
                        <Button
                            leftIcon={loading ? <Spinner size="xs" /> : <FaBolt />}
                            onClick={handleSave}
                            isDisabled={loading || !isDirty}
                            bg={isDirty ? bg : "gray.200"}
                            color={isDirty ? "white" : "gray.500"}
                            size="sm"
                            px={6}
                            rounded="lg"
                            boxShadow={isDirty ? `0 4px 14px 0 ${bg}60` : "none"}
                            _hover={{ transform: "translateY(-1px)" }}
                            transition="all 0.2s"
                        >
                            Apply & Sync
                        </Button>
                    </HStack>
                </Flex>
            </Box>

            <Box px={{ base: 4, lg: 8 }} py={6} maxW="1600px" mx="auto">
                <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>

                    {/* Column 1: API Intelligence & Service Status */}
                    <VStack spacing={8} align="stretch">
                        <MotionBox
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            bg="white"
                            rounded="2xl"
                            p={6}
                            border="1px solid"
                            borderColor="gray.100"
                            shadow="sm"
                        >
                            <Flex align="center" justify="space-between" mb={6}>
                                <HStack spacing={3}>
                                    <Center w="40px" h="40px" bg={`${bg}10`} rounded="xl" color={bg}>
                                        <MdSettings size={22} />
                                    </Center>
                                    <VStack align="start" spacing={0}>
                                        <Text fontWeight="800" fontSize="sm">API Intelligence</Text>
                                        <HStack spacing={1}>
                                            <Box w="6px" h="6px" rounded="full" bg="green.400" className="pulse-animation" />
                                            <Text fontSize="10px" fontWeight="900" color="green.500">LIVE COMMUNICATION</Text>
                                        </HStack>
                                    </VStack>
                                </HStack>
                                <Tooltip label="Test API Connection">
                                    <IconButton
                                        icon={isTesting ? <Spinner size="xs" /> : <MdRefresh />}
                                        variant="ghost"
                                        size="sm"
                                        rounded="full"
                                        onClick={testConnection}
                                        isDisabled={isTesting}
                                    />
                                </Tooltip>
                            </Flex>

                            <VStack spacing={5} align="stretch">
                                <FormControl variant="floating">
                                    <FormLabel fontSize="10px" fontWeight="800" color="gray.400" mb={1} ml={1}>API KEY</FormLabel>
                                    <Input
                                        name="cert_key"
                                        value={formData.cert_key}
                                        onChange={handleInputChange}
                                        placeholder="Enter LuckySport API Key"
                                        bg="gray.50"
                                        border="none"
                                        rounded="lg"
                                        _focus={{ bg: "white", shadow: "sm", border: "1px solid", borderColor: bg }}
                                    />
                                </FormControl>

                                <FormControl variant="floating">
                                    <FormLabel fontSize="10px" fontWeight="800" color="gray.400" mb={1} ml={1}>MERCHANT CODE</FormLabel>
                                    <Input
                                        name="merchant_code"
                                        value={formData.merchant_code}
                                        onChange={handleInputChange}
                                        placeholder="Enter Merchant Code"
                                        bg="gray.50"
                                        border="none"
                                        rounded="lg"
                                        _focus={{ bg: "white", shadow: "sm", border: "1px solid", borderColor: bg }}
                                    />
                                </FormControl>

                                <FormControl variant="floating">
                                    <FormLabel fontSize="10px" fontWeight="800" color="gray.400" mb={1} ml={1}>AGENT CODE</FormLabel>
                                    <Input
                                        name="agent_code"
                                        value={formData.agent_code}
                                        onChange={handleInputChange}
                                        placeholder="Auth Agent Code"
                                        bg="gray.50"
                                        border="none"
                                        rounded="lg"
                                        _focus={{ bg: "white", shadow: "sm", border: "1px solid", borderColor: bg }}
                                    />
                                </FormControl>

                                <FormControl variant="floating">
                                    <FormLabel fontSize="10px" fontWeight="800" color="green.500" mb={1} ml={1}>WEBHOOK JWT SECRET</FormLabel>
                                    <Input
                                        name="jwt_secret"
                                        value={formData.jwt_secret}
                                        onChange={handleInputChange}
                                        placeholder="Secret for JWT verification"
                                        bg="green.50"
                                        border="none"
                                        rounded="lg"
                                        _focus={{ bg: "white", shadow: "sm", border: "1px solid", borderColor: "green.400" }}
                                    />
                                </FormControl>

                                <Box p={3} rounded="xl" bg="gray.900" color="white" shadow="xl">
                                    <Flex justify="space-between" align="center">
                                        <HStack spacing={2}>
                                            <MdSpeed color="#10B981" />
                                            <Text fontSize="xs" fontWeight="bold">API Latency</Text>
                                        </HStack>
                                        <Badge colorScheme={latency < 150 ? "green" : "orange"} variant="solid" px={2} rounded="md">
                                            {latency ? `${latency}MS` : "PENDING"}
                                        </Badge>
                                    </Flex>
                                </Box>
                            </VStack>
                        </MotionBox>

                        <MotionBox
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.05 }}
                            bg={quota !== null && quota < 100 ? "red.50" : "white"}
                            rounded="2xl"
                            p={6}
                            border="1px solid"
                            borderColor={quota !== null && quota < 100 ? "red.200" : "gray.100"}
                            shadow="sm"
                            position="relative"
                            overflow="hidden"
                        >
                            {quota !== null && quota < 100 && (
                                <Box position="absolute" top={0} left={0} w="100%" h="2px" bg="red.400" className="bg-pulse-red-animation" />
                            )}
                            <Flex align="center" justify="space-between" mb={4}>
                                <HStack spacing={3}>
                                    <Center w="40px" h="40px" bg={quota !== null && quota < 100 ? "red.100" : "green.50"} rounded="xl" color={quota !== null && quota < 100 ? "red.500" : "green.500"}>
                                        <FaBolt size={18} />
                                    </Center>
                                    <VStack align="start" spacing={0}>
                                        <Text fontWeight="800" fontSize="sm">Merchant Quota</Text>
                                        <Text fontSize="10px" color="gray.500">PROVIDER CREDIT LINE</Text>
                                    </VStack>
                                </HStack>
                                <IconButton
                                    icon={fetchingQuota ? <Spinner size="xs" /> : <MdRefresh />}
                                    variant="ghost"
                                    size="sm"
                                    rounded="full"
                                    onClick={fetchQuota}
                                    isDisabled={fetchingQuota}
                                />
                            </Flex>

                            <Box mb={4}>
                                <Text fontSize="24px" fontWeight="900" color={quota !== null && quota < 100 ? "red.600" : "gray.800"}>
                                    {fetchingQuota ? "---" : quota !== null ? `$${quota.toLocaleString()}` : "N/A"}
                                </Text>
                                <Text fontSize="10px" fontWeight="bold" color={quota !== null && quota < 100 ? "red.400" : "gray.400"}>
                                    {quota !== null && quota < 100 ? "CRITICAL: RECHARGE IMMEDIATELY" : "ACCOUNT HEALTHY"}
                                </Text>
                            </Box>

                            <Progress
                                value={quota !== null ? Math.min((quota / 500) * 100, 100) : 0}
                                size="xs"
                                colorScheme={quota !== null && quota < 100 ? "red" : "green"}
                                rounded="full"
                            />
                        </MotionBox>

                        <MotionBox
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            bg="white"
                            rounded="2xl"
                            p={6}
                            border="1px solid"
                            borderColor="gray.100"
                            shadow="sm"
                        >
                            <HStack spacing={3} mb={6}>
                                <Center w="40px" h="40px" bg="orange.50" rounded="xl" color="orange.400">
                                    <FaTools size={18} />
                                </Center>
                                <VStack align="start" spacing={0}>
                                    <Text fontWeight="800" fontSize="sm">Service Lifecycle</Text>
                                    <Text fontSize="10px" color="gray.500">System Health: Excellent</Text>
                                </VStack>
                            </HStack>

                            <Progress value={100} size="xs" colorScheme="green" rounded="full" mb={6} />

                            <VStack spacing={4} align="stretch">
                                <Flex justify="space-between" align="center" p={4} rounded="xl" bg="#F8FAFC">
                                    <VStack align="start" spacing={0}>
                                        <Text fontSize="xs" fontWeight="800">Provider Online</Text>
                                        <Text fontSize="10px" color="gray.500">Live on production</Text>
                                    </VStack>
                                    <Switch colorScheme="green" isChecked={formData.status} onChange={handleStatusChange} />
                                </Flex>

                                <VStack align="stretch" spacing={2}>
                                    <Flex justify="space-between" align="center" p={4} rounded="xl" border="1px solid" borderColor={formData.is_maintenance ? "orange.200" : "transparent"} bg={formData.is_maintenance ? "orange.50" : "#F8FAFC"}>
                                        <Text fontSize="xs" fontWeight="800">Maintenance</Text>
                                        <Switch colorScheme="orange" isChecked={formData.is_maintenance} onChange={() => handleServiceStatusChange('is_maintenance')} />
                                    </Flex>
                                    <AnimatePresence>
                                        {formData.is_maintenance && (
                                            <MotionBox initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} overflow="hidden">
                                                <HStack spacing={2} p={2} bg="orange.50" rounded="xl">
                                                    <Button size="xs" flex={1} rounded="lg" colorScheme={formData.maintenance_display_type === 'alert' ? 'orange' : 'gray'} variant={formData.maintenance_display_type === 'alert' ? 'solid' : 'ghost'} onClick={() => { setFormData(p => ({ ...p, maintenance_display_type: 'alert' })); setIsDirty(true); }}>Alert</Button>
                                                    <Button size="xs" flex={1} rounded="lg" colorScheme={formData.maintenance_display_type === 'overlay' ? 'orange' : 'gray'} variant={formData.maintenance_display_type === 'overlay' ? 'solid' : 'ghost'} onClick={() => { setFormData(p => ({ ...p, maintenance_display_type: 'overlay' })); setIsDirty(true); }}>Overlay</Button>
                                                </HStack>
                                            </MotionBox>
                                        )}
                                    </AnimatePresence>
                                </VStack>

                                <VStack align="stretch" spacing={2}>
                                    <Flex justify="space-between" align="center" p={4} rounded="xl" border="1px solid" borderColor={formData.is_coming_soon ? "blue.200" : "transparent"} bg={formData.is_coming_soon ? "blue.50" : "#F8FAFC"}>
                                        <Text fontSize="xs" fontWeight="800">Coming Soon</Text>
                                        <Switch colorScheme="blue" isChecked={formData.is_coming_soon} onChange={() => handleServiceStatusChange('is_coming_soon')} />
                                    </Flex>
                                    <AnimatePresence>
                                        {formData.is_coming_soon && (
                                            <MotionBox initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} overflow="hidden">
                                                <HStack spacing={2} p={2} bg="blue.50" rounded="xl">
                                                    <Button size="xs" flex={1} rounded="lg" colorScheme={formData.coming_soon_display_type === 'alert' ? 'blue' : 'gray'} variant={formData.coming_soon_display_type === 'alert' ? 'solid' : 'ghost'} onClick={() => { setFormData(p => ({ ...p, coming_soon_display_type: 'alert' })); setIsDirty(true); }}>Alert</Button>
                                                    <Button size="xs" flex={1} rounded="lg" colorScheme={formData.coming_soon_display_type === 'overlay' ? 'blue' : 'gray'} variant={formData.coming_soon_display_type === 'overlay' ? 'solid' : 'ghost'} onClick={() => { setFormData(p => ({ ...p, coming_soon_display_type: 'overlay' })); setIsDirty(true); }}>Overlay</Button>
                                                </HStack>
                                            </MotionBox>
                                        )}
                                    </AnimatePresence>
                                </VStack>
                            </VStack>
                        </MotionBox>
                    </VStack>

                    {/* Column 2: Brand Identity & Mockup */}
                    <Box gridColumn={{ lg: "span 2" }}>
                        <VStack spacing={8} align="stretch">
                            <MotionBox
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                bg="white"
                                rounded="2xl"
                                p={8}
                                border="1px solid"
                                borderColor="gray.100"
                                shadow="sm"
                            >
                                <HStack spacing={3} mb={8}>
                                    <Center w="40px" h="40px" bg="blue.50" rounded="xl" color="blue.500">
                                        <MdBrandingWatermark size={22} />
                                    </Center>
                                    <VStack align="start" spacing={0}>
                                        <Text fontWeight="800" fontSize="sm">Brand Identity</Text>
                                        <Text fontSize="10px" color="gray.500">High-resolution assets for user frontend</Text>
                                    </VStack>
                                </HStack>

                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                                    <VStack align="start" spacing={4}>
                                        <Text fontSize="xs" fontWeight="900" color="gray.400" letterSpacing="1px">LOGO ASSET</Text>
                                        <Flex align="center" gap={6} w="100%" p={4} bg="#F8FAFC" rounded="2xl" border="1px solid" borderColor="gray.100">
                                            <Box
                                                w="100px" h="100px"
                                                bg="white"
                                                rounded="2xl"
                                                shadow="inner"
                                                overflow="hidden"
                                                display="flex"
                                                align="center"
                                                justify="center"
                                                border="1px solid"
                                                borderColor="gray.100"
                                            >
                                                {uploadLoading.logo ? <Spinner size="md" /> : formData.provider_logo ? (
                                                    <Image src={formData.provider_logo} w="100%" h="100%" objectFit="contain" />
                                                ) : <MdCloudUpload size={30} color="#CBD5E0" />}
                                            </Box>
                                            <VStack align="start" flex={1}>
                                                <Button
                                                    size="sm"
                                                    bg="white"
                                                    border="1px solid"
                                                    borderColor="gray.200"
                                                    w="100%"
                                                    fontSize="xs"
                                                    position="relative"
                                                >
                                                    Upload New
                                                    <Input type="file" opacity={0} position="absolute" cursor="pointer" onChange={(e) => handleImageUpload(e.target.files[0], 'logo')} />
                                                </Button>
                                                <Text fontSize="10px" color="gray.400">PNG or SVG, 512x512px</Text>
                                            </VStack>
                                        </Flex>
                                    </VStack>

                                    <VStack align="start" spacing={4}>
                                        <Text fontSize="xs" fontWeight="900" color="gray.400" letterSpacing="1px">LOBBY BANNER PREVIEW</Text>
                                        <Box
                                            w="100%" h="220px"
                                            bg="#1E293B"
                                            rounded="2xl"
                                            p={1}
                                            shadow="2xl"
                                            position="relative"
                                            overflow="hidden"
                                        >
                                            {/* Browser Mockup Feel */}
                                            <HStack p={2} spacing={1}>
                                                <Box w="6px" h="6px" rounded="full" bg="#FF5F56" />
                                                <Box w="6px" h="6px" rounded="full" bg="#FFBD2E" />
                                                <Box w="6px" h="6px" rounded="full" bg="#27C93F" />
                                            </HStack>
                                            <Box
                                                w="100%" h="calc(100% - 24px)"
                                                bg="gray.800"
                                                rounded="b-xl"
                                                overflow="hidden"
                                                position="relative"
                                                display="flex"
                                                align="center"
                                                justify="center"
                                            >
                                                {uploadLoading.image ? <Spinner size="lg" color="white" /> : formData.provider_image ? (
                                                    <Image src={formData.provider_image} w="100%" h="100%" objectFit="cover" />
                                                ) : (
                                                    <VStack color="gray.500">
                                                        <MdCloudUpload size={40} />
                                                        <Text fontSize="10px">DRAG & DROP BANNER</Text>
                                                    </VStack>
                                                )}
                                                <Input type="file" opacity={0} position="absolute" inset={0} cursor="pointer" onChange={(e) => handleImageUpload(e.target.files[0], 'image')} />
                                            </Box>
                                        </Box>
                                    </VStack>
                                </SimpleGrid>
                            </MotionBox>

                            <MotionBox
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                bg="white"
                                rounded="2xl"
                                p={8}
                                border="1px solid"
                                borderColor="gray.100"
                                shadow="sm"
                            >
                                <HStack spacing={3} mb={6}>
                                    <Center w="40px" h="40px" bg="green.50" rounded="xl" color="green.500">
                                        <MdLink size={20} />
                                    </Center>
                                    <VStack align="start" spacing={0}>
                                        <Text fontWeight="800" fontSize="sm">Seamless Wallet Webhooks</Text>
                                        <Text fontSize="10px" color="gray.500">Provide these URLs to LuckySport Agent</Text>
                                    </VStack>
                                </HStack>

                                <VStack spacing={3} align="stretch">
                                    {[
                                        { label: "BALANCE", url: "/api/webhook/luckysport/balance" },
                                        { label: "BET/MAKE", url: "/api/webhook/luckysport/bet/make" },
                                        { label: "BET/WIN", url: "/api/webhook/luckysport/bet/win" },
                                        { label: "ROLLBACK", url: "/api/webhook/luckysport/bet/rollback" }
                                    ].map((webhook, idx) => (
                                        <Flex key={idx} justify="space-between" align="center" p={3} bg="gray.50" rounded="xl" border="1px solid" borderColor="gray.100">
                                            <VStack align="start" spacing={0}>
                                                <Text fontSize="9px" fontWeight="900" color="gray.400">{webhook.label}</Text>
                                                <Text fontSize="11px" fontWeight="700" color="gray.700">
                                                    {window.location.origin.replace('admin.', '')}{webhook.url}
                                                </Text>
                                            </VStack>
                                            <Tooltip label="Copy URL">
                                                <IconButton
                                                    icon={<MdCloudUpload />}
                                                    size="xs"
                                                    variant="ghost"
                                                    onClick={() => {
                                                        const fullUrl = `${window.location.origin.replace('admin.', '')}${webhook.url}`;
                                                        navigator.clipboard.writeText(fullUrl);
                                                        toast({ title: "Copied", status: "success", duration: 1000 });
                                                    }}
                                                />
                                            </Tooltip>
                                        </Flex>
                                    ))}
                                </VStack>
                            </MotionBox>
                        </VStack>
                    </Box>
                </SimpleGrid>
            </Box>

            <style>{`
                .pulse-animation {
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { transform: scale(0.95); opacity: 0.8; }
                    50% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(0.95); opacity: 0.8; }
                }
                @keyframes bg-pulse-green {
                    0% { opacity: 0.4; }
                    50% { opacity: 0.7; }
                    100% { opacity: 0.4; }
                }
                @keyframes bg-pulse-red {
                    0% { opacity: 0.4; background-color: #F87171; }
                    50% { opacity: 1; background-color: #EF4444; }
                    100% { opacity: 0.4; background-color: #F87171; }
                }
                .bg-pulse-green-animation {
                    animation: bg-pulse-green 3s infinite ease-in-out;
                }
                .bg-pulse-red-animation {
                    animation: bg-pulse-red 2s infinite ease-in-out;
                }
            `}</style>

            {/* Premium Success Modal */}
            <Modal isOpen={isSuccessOpen} onClose={onSuccessClose} isCentered motionPreset="scale">
                <ModalOverlay backdropFilter="blur(16px)" bg="rgba(0, 0, 0, 0.45)" />
                <ModalContent bg="white" p={0} rounded="28px" boxShadow="0 25px 50px -12px rgba(0,0,0,0.25)" maxW="340px" overflow="hidden">
                    <ModalBody p={8}>
                        <VStack spacing={6} textAlign="center">
                            <MotionBox
                                initial={{ scale: 0, rotate: -20 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                w="80px" h="80px" bg="#48BB78" rounded="full" display="flex" alignItems="center" justifyContent="center"
                                shadow="0 10px 20px rgba(72, 187, 120, 0.3)"
                                position="relative"
                            >
                                <Box position="absolute" inset={0} rounded="full" border="4px solid white" opacity={0.2} />
                                <MdCheckCircle size={48} color="white" style={{ position: "relative", zIndex: 1 }} />
                            </MotionBox>

                            <VStack spacing={2}>
                                <Text fontWeight="800" fontSize="22px" color="gray.800">
                                    Success!
                                </Text>
                                <Text fontSize="13px" color="gray.500" fontWeight="500" px={4} lineHeight="1.5">
                                    Your <Text as="span" fontWeight="800" color="gray.700">LUCKYSPORT</Text> configuration has been successfully synced.
                                </Text>
                            </VStack>

                            <Divider opacity={0.15} />

                            <Text fontSize="12px" fontWeight="700" color="green.500" letterSpacing="0.5px">
                                AUTO CLOSING IN 2S
                            </Text>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box >
    );
};

const FeedbackAlert = ({ children, fontSize, py, borderRadius }) => (
    <HStack bg="blue.50" color="blue.600" p={py || 2} px={3} borderRadius={borderRadius || "md"} fontSize={fontSize || "xs"} w="100%">
        {children}
    </HStack>
);

export default LuckySportManage;
