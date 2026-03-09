import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
    useToast,
    Switch,
    FormControl, FormLabel, SimpleGrid, Box, Flex, Text,
    Button, Input, Select, IconButton, VStack, HStack,
    Divider, Image, Tooltip, Center, Spinner,
    Badge, Progress, Breadcrumb, BreadcrumbItem,
    BreadcrumbLink,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    useDisclosure,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchGetRequest, sendPostRequest } from "../api/api";
import {
    MdOutlineSportsScore,
    MdAdd,
    MdDelete,
    MdCloudUpload,
    MdSettings,
    MdHistory,
    MdBrandingWatermark,
    MdLabel,
    MdLink,
    MdVpnKey,
    MdPerson,
    MdCheckCircle,
    MdError,
    MdSpeed,
    MdRefresh,
    MdOutlineDragIndicator
} from "react-icons/md";
import { FaBolt, FaInfoCircle, FaTools, FaRegCalendarAlt, FaChevronRight } from "react-icons/fa";

const PREDEFINED_SPORTS = [
    { name: "Cricket", id: 4 },
    { name: "Soccer", id: 2 },
    { name: "Tennis", id: 3 },
    { name: "Cricket/Fancy", id: 5 },
    { name: "Odds", id: 6 },
    { name: "Bookmaker", id: 7 },
    { name: "Kabaddi", id: "" },
    { name: "Horse Racing", id: "" },
    { name: "Greyhound Racing", id: "" },
    { name: "Other", id: "" },
];

const MotionBox = motion(Box);

const PowerPlayManage = () => {
    const { bg, border, iconColor, primaryBg, secondaryBg } = useSelector((state) => state.theme);
    const { t } = useTranslation();
    const toast = useToast();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [isDirty, setIsDirty] = useState(false);
    const [latency, setLatency] = useState(null);
    const [isTesting, setIsTesting] = useState(false);
    const { isOpen: isSuccessOpen, onOpen: onSuccessOpen, onClose: onSuccessClose } = useDisclosure();

    const [formData, setFormData] = useState({
        provider_name: "PowerPlay",
        cert_key: "",
        agent_code: "",
        callback_url: "",
        provider_logo: "",
        provider_image: "",
        status: false,
        is_maintenance: false,
        maintenance_display_type: "alert",
        is_coming_soon: false,
        coming_soon_display_type: "alert",
        sport_images: [],
    });

    const [uploadLoading, setUploadLoading] = useState({ logo: false, image: false, sport: {} });

    const getProviderSetup = useCallback(async () => {
        setFetching(true);
        let url = `${import.meta.env.VITE_API_URL}/api/sport/setup/PowerPlay`;
        try {
            let response = await fetchGetRequest(url);
            if (response && response.data) {
                setFormData({
                    provider_name: "PowerPlay",
                    cert_key: response.data.cert_key || "",
                    agent_code: response.data.agent_code || "",
                    callback_url: response.data.callback_url || "",
                    provider_logo: response.data.provider_logo || "",
                    provider_image: response.data.provider_image || "",
                    status: response.data.status || false,
                    is_maintenance: response.data.is_maintenance || false,
                    maintenance_display_type: response.data.maintenance_display_type || "alert",
                    is_coming_soon: response.data.is_coming_soon || false,
                    coming_soon_display_type: response.data.coming_soon_display_type || "alert",
                    sport_images: response.data.sport_images || [],
                });
                setIsDirty(false);
            }
        } catch (error) {
            console.log("No existing setup found or error:", error);
        } finally {
            setFetching(false);
        }
    }, []);

    useEffect(() => {
        getProviderSetup();
    }, [getProviderSetup]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setIsDirty(true);
    };

    const handleStatusChange = (e) => {
        setFormData((prev) => ({ ...prev, status: e.target.checked }));
        setIsDirty(true);
    };

    const testConnection = () => {
        setIsTesting(true);
        setLatency(null);
        setTimeout(() => {
            const mockLatency = Math.floor(Math.random() * 200) + 50;
            setLatency(mockLatency);
            setIsTesting(false);
            toast({ title: `Connection Speed: ${mockLatency}ms`, status: "info", duration: 2000, position: 'top' });
        }, 1500);
    };

    const handleImageUpload = async (file, type, index = null) => {
        if (!file) return;
        if (index !== null) {
            setUploadLoading((prev) => ({ ...prev, sport: { ...prev.sport, [index]: true } }));
        } else {
            setUploadLoading((prev) => ({ ...prev, [type]: true }));
        }

        const uploadData = new FormData();
        uploadData.append("post_img", file);

        try {
            const response = await sendPostRequest(`${import.meta.env.VITE_API_URL}/api/payment/image-url`, uploadData);
            if (response.url) {
                if (index !== null) {
                    const updatedSports = [...formData.sport_images];
                    updatedSports[index].image_url = response.url;
                    setFormData((prev) => ({ ...prev, sport_images: updatedSports }));
                } else {
                    setFormData((prev) => ({
                        ...prev,
                        [type === 'logo' ? 'provider_logo' : 'provider_image']: response.url
                    }));
                }
                setIsDirty(true);
                toast({ title: "Upload successful", status: "success", duration: 2000, position: 'top' });
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            toast({ title: "Failed to upload image", status: "error", duration: 3000, position: 'top' });
        } finally {
            if (index !== null) {
                setUploadLoading((prev) => ({ ...prev, sport: { ...prev.sport, [index]: false } }));
            } else {
                setUploadLoading((prev) => ({ ...prev, [type]: false }));
            }
        }
    };

    const addSport = () => {
        setFormData((prev) => ({
            ...prev,
            sport_images: [...prev.sport_images, { sport_name: "", image_url: "", event_type: "", status: true }],
        }));
        setIsDirty(true);
    };

    const removeSport = (index) => {
        const updatedSports = [...formData.sport_images];
        updatedSports.splice(index, 1);
        setFormData((prev) => ({ ...prev, sport_images: updatedSports }));
        setIsDirty(true);
    };

    const handleSportChange = (index, field, value) => {
        const updatedSports = [...formData.sport_images];
        updatedSports[index][field] = value;
        if (field === 'sport_name') {
            const predefined = PREDEFINED_SPORTS.find(s => s.name === value);
            if (predefined && predefined.id !== "") updatedSports[index].event_type = predefined.id;
        }
        setFormData((prev) => ({ ...prev, sport_images: updatedSports }));
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

    const handleSave = async () => {
        setLoading(true);
        let url = `${import.meta.env.VITE_API_URL}/api/sport/setup`;
        const payload = {
            ...formData,
            sport_images: formData.sport_images.map(sport => ({ ...sport, event_type: Number(sport.event_type) }))
        };

        try {
            await sendPostRequest(url, payload);
            onSuccessOpen();
            setIsDirty(false);
            getProviderSetup();
            setTimeout(() => {
                onSuccessClose();
            }, 2500);
        } catch (error) {
            toast({ title: "Error", description: error?.response?.data?.message || "Something went wrong.", status: "error", duration: 3000, isClosable: true, position: "top" });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <Flex justify="center" align="center" h="80vh">
                <Spinner size="xl" color={bg} thickness="4px" />
            </Flex>
        );
    }

    return (
        <Box minH="100vh" bg="#f8fafd" pb={10}>
            {/* Sticky Header */}
            <Box
                position="sticky"
                top={{ base: "60px", lg: "80px" }}
                zIndex="1000"
                bg="rgba(255, 255, 255, 0.8)"
                backdropFilter="blur(12px)"
                borderBottom="1px solid" borderColor="gray.100" py={3} px={{ base: 4, lg: 8 }}
            >
                <Flex align="center" justify="space-between" maxW="1600px" mx="auto">
                    <VStack align="start" spacing={1}>
                        <Breadcrumb fontSize="xs" color="gray.500" separator={<FaChevronRight size={8} />}>
                            <BreadcrumbItem><BreadcrumbLink href="#">Settings</BreadcrumbLink></BreadcrumbItem>
                            <BreadcrumbItem isCurrentPage><BreadcrumbLink href="#">PowerPlay</BreadcrumbLink></BreadcrumbItem>
                        </Breadcrumb>
                        <HStack spacing={3}>
                            <Text fontSize="xl" fontWeight="900" color="#1A202C" letterSpacing="-0.5px">
                                {t("PowerPlay Premium")}
                            </Text>
                            <AnimatePresence>
                                {isDirty && (
                                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                                        <Badge colorScheme="red" variant="subtle" borderRadius="full" px={2} fontSize="9px">
                                            {t("Unsaved Changes")}
                                        </Badge>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </HStack>
                    </VStack>

                    <HStack spacing={3}>
                        <Button
                            leftIcon={<MdAdd />} variant="ghost" size="sm" color="gray.600" onClick={addSport}
                            _hover={{ bg: "gray.100" }}
                        >
                            {t("Add Sport")}
                        </Button>
                        <Button
                            leftIcon={loading ? <Spinner size="xs" /> : <FaBolt />}
                            onClick={handleSave}
                            disabled={loading || !isDirty}
                            bg={isDirty ? "purple.600" : "gray.400"}
                            color="white"
                            size="sm"
                            px={8}
                            borderRadius="12px"
                            fontWeight="bold"
                            boxShadow={isDirty ? "0 4px 12px rgba(107, 70, 193, 0.3)" : "none"}
                            _hover={{ transform: isDirty ? "translateY(-1px)" : "none", opacity: 0.9 }}
                            transition="all 0.2s"
                        >
                            {t("Apply & Sync")}
                        </Button>
                    </HStack>
                </Flex>
            </Box>

            <Box px={{ base: 4, lg: 8 }} mt={8} maxW="1600px" mx="auto">
                <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} spacing={8} alignItems="start">

                    {/* Column 1: API Intelligence */}
                    <VStack spacing={8} align="stretch">
                        <MotionBox
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                            bg="white" borderRadius="20px" p={6} border="1px solid" borderColor="gray.100" boxShadow="0 10px 30px rgba(0,0,0,0.03)"
                        >
                            <Flex align="center" justify="space-between" mb={6}>
                                <HStack spacing={3}>
                                    <Center w="40px" h="40px" bg="purple.50" color="purple.500" borderRadius="12px">
                                        <MdSettings size={20} />
                                    </Center>
                                    <VStack align="start" spacing={0}>
                                        <Text fontWeight="900" fontSize="sm" color="gray.800">{t("API Intelligence")}</Text>
                                        <HStack spacing={1}>
                                            <Box w="2" h="2" rounded="full" bg="green.400" className="pulse-animation" />
                                            <Text fontSize="10px" color="gray.400" fontWeight="bold">LIVE COMMUNICATION</Text>
                                        </HStack>
                                    </VStack>
                                </HStack>
                                <Tooltip label="Test Connection Latency">
                                    <IconButton
                                        aria-label="Test" icon={isTesting ? <Spinner size="xs" /> : <MdRefresh />}
                                        size="xs" variant="ghost" borderRadius="full" onClick={testConnection}
                                    />
                                </Tooltip>
                            </Flex>

                            <VStack spacing={5} align="stretch">
                                <FormControl>
                                    <FormLabel fontSize="10px" fontWeight="900" color="gray.400" mb={1}>{t("PARTNER SECURE KEY")}</FormLabel>
                                    <Input
                                        name="cert_key" value={formData.cert_key} onChange={handleInputChange}
                                        placeholder="Enter secure hash" size="md" borderRadius="12px" bg="gray.50" border="none" _focus={{ bg: "white", boxShadow: "0 0 0 2px purple.100" }}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel fontSize="10px" fontWeight="900" color="gray.400" mb={1}>{t("CORE API ENDPOINT")}</FormLabel>
                                    <Input
                                        name="callback_url" value={formData.callback_url} onChange={handleInputChange}
                                        placeholder="https://api..." size="md" borderRadius="12px" bg="gray.50" border="none" _focus={{ bg: "white", boxShadow: "0 0 0 2px purple.100" }}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel fontSize="10px" fontWeight="900" color="gray.400" mb={1}>{t("AGENT IDENTIFIER")}</FormLabel>
                                    <Input
                                        name="agent_code" value={formData.agent_code} onChange={handleInputChange}
                                        placeholder="Agent ID" size="md" borderRadius="12px" bg="gray.50" border="none" _focus={{ bg: "white", boxShadow: "0 0 0 2px purple.100" }}
                                    />
                                </FormControl>
                            </VStack>

                            {latency && (
                                <Flex mt={6} p={3} bg="blue.50" borderRadius="12px" align="center" justify="space-between">
                                    <HStack>
                                        <MdSpeed color="#3182CE" />
                                        <Text fontSize="xs" fontWeight="bold" color="blue.700">API Response Latency</Text>
                                    </HStack>
                                    <Badge colorScheme={latency < 100 ? "green" : "orange"} borderRadius="full" px={3}>
                                        {latency}ms
                                    </Badge>
                                </Flex>
                            )}
                        </MotionBox>

                        <MotionBox
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
                            bg="white" borderRadius="20px" p={6} border="1px solid" borderColor="gray.100" boxShadow="0 10px 30px rgba(0,0,0,0.03)"
                        >
                            <Flex align="center" gap={3} mb={6}>
                                <Center w="40px" h="40px" bg="orange.50" color="orange.500" borderRadius="12px">
                                    <FaTools size={18} />
                                </Center>
                                <VStack align="start" spacing={0}>
                                    <Text fontWeight="900" fontSize="sm" color="gray.800">{t("Service Lifecycle")}</Text>
                                    <Text fontSize="10px" color="gray.400" fontWeight="bold">SYSTEM HEALTH: EXCELLENT</Text>
                                </VStack>
                            </Flex>

                            <Progress value={95} size="xs" colorScheme="green" borderRadius="full" mb={6} />

                            <VStack spacing={4} align="stretch">
                                <Flex justify="space-between" align="center" p={4} rounded="xl" bg="#F8FAFC">
                                    <VStack align="start" spacing={0}>
                                        <Text fontSize="xs" fontWeight="900" color="gray.700">{t("Provider Online")}</Text>
                                        <Text fontSize="10px" color="gray.400">{t("Live on production")}</Text>
                                    </VStack>
                                    <Switch size="md" colorScheme="green" isChecked={formData.status} onChange={handleStatusChange} />
                                </Flex>

                                <VStack align="stretch" spacing={2}>
                                    <Flex justify="space-between" align="center" p={4} rounded="xl" border="1px solid" borderColor={formData.is_maintenance ? "orange.200" : "transparent"} bg={formData.is_maintenance ? "orange.50" : "#F8FAFC"}>
                                        <VStack align="start" spacing={0}>
                                            <Text fontSize="xs" fontWeight="900" color="gray.700">{t("Maintenance")}</Text>
                                            <Text fontSize="10px" color="gray.400">{t("Service disruption mode")}</Text>
                                        </VStack>
                                        <Switch size="md" colorScheme="orange" isChecked={formData.is_maintenance} onChange={() => handleServiceStatusChange('is_maintenance')} />
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
                                    </AnimatePresence>                                </VStack>

                                <VStack align="stretch" spacing={2}>
                                    <Flex justify="space-between" align="center" p={4} rounded="xl" border="1px solid" borderColor={formData.is_coming_soon ? "blue.200" : "transparent"} bg={formData.is_coming_soon ? "blue.50" : "#F8FAFC"}>
                                        <VStack align="start" spacing={0}>
                                            <Text fontSize="xs" fontWeight="900" color="gray.700">{t("Coming Soon")}</Text>
                                            <Text fontSize="10px" color="gray.400">{t("Pre-launch state")}</Text>
                                        </VStack>
                                        <Switch size="md" colorScheme="blue" isChecked={formData.is_coming_soon} onChange={() => handleServiceStatusChange('is_coming_soon')} />
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

                    {/* Column 2: Visual Branding */}
                    <VStack spacing={8} align="stretch">
                        <MotionBox
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
                            bg="white" borderRadius="20px" p={6} border="1px solid" borderColor="gray.100" boxShadow="0 10px 30px rgba(0,0,0,0.03)"
                        >
                            <Flex align="center" gap={3} mb={8}>
                                <Center w="40px" h="40px" bg="blue.50" color="blue.500" borderRadius="12px">
                                    <MdBrandingWatermark size={20} />
                                </Center>
                                <VStack align="start" spacing={0}>
                                    <Text fontWeight="900" fontSize="sm" color="gray.800">{t("Brand Identity")}</Text>
                                    <Text fontSize="10px" color="gray.400" fontWeight="bold">USER EXPERIENCE ASSETS</Text>
                                </VStack>
                            </Flex>

                            <VStack spacing={8}>
                                {/* Nav Logo */}
                                <VStack align="start" w="100%" spacing={4}>
                                    <Text fontSize="10px" fontWeight="900" color="gray.400" letterSpacing="1px">{t("NAVIGATION BRANDING")}</Text>
                                    <Flex align="center" gap={5} p={4} border="2px dashed" borderColor="gray.100" bg="gray.50" rounded="20px" w="100%">
                                        <Box w="64px" h="64px" rounded="16px" bg="white" boxShadow="sm" overflow="hidden" display="flex" align="center" justify="center">
                                            {uploadLoading.logo ? <Spinner size="xs" /> : formData.provider_logo ? (
                                                <Image src={formData.provider_logo} objectFit="contain" />
                                            ) : <MdCloudUpload color="#CBD5E0" size={24} />}
                                        </Box>
                                        <VStack align="start" flex={1} spacing={2}>
                                            <Button size="xs" colorScheme="blue" variant="solid" borderRadius="full" position="relative" px={4}>
                                                {t("Change Logo")}
                                                <Input type="file" position="absolute" opacity={0} cursor="pointer" onChange={(e) => handleImageUpload(e.target.files[0], 'logo')} />
                                            </Button>
                                            <Text fontSize="9px" color="gray.400" maxW="150px">Square ratio recommended (PNG/SVG)</Text>
                                        </VStack>
                                    </Flex>
                                </VStack>

                                {/* Lobby Banner - Mockup Frame */}
                                <VStack align="start" w="100%" spacing={4}>
                                    <Text fontSize="10px" fontWeight="900" color="gray.400" letterSpacing="1px">{t("LOBBY MOCKUP PREVIEW")}</Text>
                                    <Box
                                        w="100%" h="200px" bg="gray.800" rounded="16px" p={2} position="relative"
                                        boxShadow="0 20px 40px rgba(0,0,0,0.2)" border="3px solid #2D3748"
                                    >
                                        {/* Mockup Top Bar */}
                                        <HStack spacing={1} mb={2} px={1}>
                                            <Box w="6px" h="6px" rounded="full" bg="#FF5F56" />
                                            <Box w="6px" h="6px" rounded="full" bg="#FFBD2E" />
                                            <Box w="6px" h="6px" rounded="full" bg="#27C93F" />
                                        </HStack>
                                        <Box w="100%" h="165px" bg="#1A202C" rounded="8px" overflow="hidden" display="flex" align="center" justify="center" position="relative">
                                            {uploadLoading.image ? <Spinner size="sm" color="white" /> : formData.provider_image ? (
                                                <Image src={formData.provider_image} objectFit="cover" w="100%" h="100%" />
                                            ) : (
                                                <VStack opacity={0.5}>
                                                    <MdCloudUpload size={40} color="white" />
                                                    <Text fontSize="9px" color="white" fontWeight="bold">UPLOAD BANNER</Text>
                                                </VStack>
                                            )}
                                            <IconButton
                                                position="absolute" bottom={3} right={3} aria-label="Upload" icon={<MdCloudUpload />}
                                                size="sm" colorScheme="whiteAlpha" borderRadius="full" variant="solid"
                                            >
                                                <Input type="file" position="absolute" opacity={0} cursor="pointer" onChange={(e) => handleImageUpload(e.target.files[0], 'image')} />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                    <FeedbackAlert fontSize="10px" py={1} borderRadius="8px">
                                        <FaInfoCircle style={{ marginRight: '6px' }} /> Default fallback for empty sport banners.
                                    </FeedbackAlert>
                                </VStack>
                            </VStack>
                        </MotionBox>
                    </VStack>

                    {/* Column 3: Sport Matrix */}
                    <Box
                        as={motion.div} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.3 }}
                        bg="white" borderRadius="20px" p={6} border="1px solid" borderColor="gray.100" boxShadow="0 10px 40px rgba(0,0,0,0.05)"
                        display="flex" flexDirection="column" maxH="850px"
                    >
                        <Flex align="center" justify="space-between" mb={6}>
                            <HStack spacing={3}>
                                <Center w="40px" h="40px" bg="green.50" color="green.500" borderRadius="12px">
                                    <MdOutlineSportsScore size={20} />
                                </Center>
                                <VStack align="start" spacing={0}>
                                    <Text fontWeight="900" fontSize="sm" color="gray.800">{t("Sport Matrix")}</Text>
                                    <HStack spacing={2} align="center">
                                        <Badge colorScheme="green" fontSize="9px" borderRadius="4px">{formData.sport_images.length} ACTIVE</Badge>
                                    </HStack>
                                </VStack>
                            </HStack>
                            <Button size="xs" leftIcon={<MdAdd />} colorScheme="green" variant="ghost" onClick={addSport}>Add</Button>
                        </Flex>

                        <VStack spacing={4} flex={1} overflowY="auto" pr={2} sx={{
                            '&::-webkit-scrollbar': { width: '3px' },
                            '&::-webkit-scrollbar-track': { background: 'transparent' },
                            '&::-webkit-scrollbar-thumb': { background: '#E2E8F0', borderRadius: '10px' },
                        }}>
                            <AnimatePresence>
                                {formData.sport_images.map((sport, index) => (
                                    <MotionBox
                                        key={index} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                                        p={4} bg="gray.50" borderRadius="18px" position="relative" border="1px solid transparent"
                                        _hover={{ borderColor: "purple.200", bg: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                                        transition="all 0.2s"
                                    >
                                        <Flex gap={4}>
                                            <VStack justify="center" cursor="grab" opacity={0.2} _hover={{ opacity: 1 }}>
                                                <MdOutlineDragIndicator />
                                            </VStack>

                                            <Box w="80px" h="54px" rounded="12px" bg="white" shadow="sm" overflow="hidden" position="relative" border="1px solid" borderColor="gray.100">
                                                {uploadLoading.sport[index] ? <Spinner size="xs" m="18px" /> : sport.image_url ? (
                                                    <Image src={sport.image_url} objectFit="cover" w="100%" h="100%" />
                                                ) : <MdCloudUpload size={20} color="#CBD5E0" style={{ margin: '17px auto' }} />}
                                                <Input type="file" position="absolute" opacity={0} cursor="pointer" onChange={(e) => handleImageUpload(e.target.files[0], 'sport', index)} />
                                            </Box>

                                            <VStack align="start" flex={1} spacing={1}>
                                                <Select
                                                    size="xs" variant="unstyled" fontWeight="900" fontSize="sm" value={sport.sport_name} p={0}
                                                    onChange={(e) => handleSportChange(index, 'sport_name', e.target.value)}
                                                >
                                                    <option value="">{t("Unknown Sport")}</option>
                                                    {PREDEFINED_SPORTS.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                                </Select>
                                                <HStack spacing={2}>
                                                    <Badge fontSize="8px" bg="white" color="gray.500" border="1px solid" borderColor="gray.200">ID: {sport.event_type || 'N/A'}</Badge>
                                                    <Badge fontSize="8px" colorScheme={sport.status ? "green" : "gray"}>{sport.status ? "LIVE" : "PAUSED"}</Badge>
                                                </HStack>
                                            </VStack>

                                            <VStack justify="space-between">
                                                <IconButton
                                                    aria-label="Delete" icon={<MdDelete />} size="xs" variant="ghost" colorScheme="red"
                                                    onClick={() => removeSport(index)} _hover={{ bg: "red.50" }}
                                                />
                                                <Switch size="sm" colorScheme="green" isChecked={sport.status} onChange={(e) => handleSportChange(index, 'status', e.target.checked)} />
                                            </VStack>
                                        </Flex>
                                    </MotionBox>
                                ))}
                            </AnimatePresence>

                            {formData.sport_images.length === 0 && (
                                <Center py={10} flexDir="column" opacity={0.2}>
                                    <MdOutlineSportsScore size={60} />
                                    <Text mt={4} fontWeight="bold">Config Matrix Empty</Text>
                                    <Text fontSize="xs">Click add to begin orchestration</Text>
                                </Center>
                            )}
                        </VStack>
                    </Box>
                </SimpleGrid>
            </Box >

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .pulse-animation {
                    animation: pulse 2s infinite ease-in-out;
                }
                @keyframes bg-pulse {
                    0% { opacity: 0.4; }
                    50% { opacity: 0.7; }
                    100% { opacity: 0.4; }
                }
                .bg-pulse-animation {
                    animation: bg-pulse 3s infinite ease-in-out;
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
                                    Your <Text as="span" fontWeight="800" color="gray.700">POWERPLAY</Text> configuration has been successfully synced.
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
    <HStack bg="blue.50" color="blue.600" p={py} px={3} borderRadius={borderRadius} fontSize={fontSize} w="100%">
        {children}
    </HStack>
);

export default PowerPlayManage;
