import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Box, Flex, Spinner, Text, Button, Image, VStack, Container } from "@chakra-ui/react";
import { motion } from "framer-motion";
import MobileHeader from "../component/MobileHeader";
import { setLoginForm } from "../redux/switch-web/action";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import sportsMaintenance from "../assets/sports_maintenance.png";

const MotionBox = motion(Box);

const SportsPage = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { bgGray, secondaryText, whiteText } = useSelector((state) => state.theme);
    const users = useSelector((state) => state?.auth);
    const data = users?.user?.data;

    const [loading, setLoading] = useState(true);
    const [iframeUrl, setIframeUrl] = useState(null);
    const [errorText, setErrorText] = useState("");

    const initializeLuckySport = async () => {
        if (!data?.token && !data?.usernameToken) {
            setLoading(false);
            dispatch(setLoginForm(true));
            return;
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/sport/get-lucky-sport-token`,
                {},
                {
                    headers: {
                        token: data?.token,
                        usernametoken: data?.usernameToken
                    }
                }
            );

            if (response.data.success && response.data.loginUrl) {
                setIframeUrl(response.data.loginUrl);
            } else {
                setErrorText(response.data.message || "Sports Provider is unavailable.");
            }
        } catch (error) {
            console.error('Error fetching LuckySport tokens:', error);
            setErrorText(error.response?.data?.message || "Failed to load Sports Provider. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        initializeLuckySport();
    }, [data?.token]);

    return (
        <Box className="main_page" minH="100vh" bg={bgGray}>
            <MobileHeader />

            <Flex direction="column" minH="calc(100vh - 80px)" align="center" justify="center" p={4}>
                {loading ? (
                    <VStack spacing={6}>
                        <Spinner size="xl" color="blue.500" thickness="4px" emptyColor="gray.200" />
                        <Text fontSize="lg" fontWeight="600" color={secondaryText} textAlign="center">
                            {t("Connecting to Arena...")}
                        </Text>
                    </VStack>
                ) : errorText ? (
                    <MotionBox
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        maxW="lg"
                        w="100%"
                        p={8}
                        textAlign="center"
                        bg="rgba(255, 255, 255, 0.85)"
                        backdropFilter="blur(15px)"
                        borderRadius="2xl"
                        boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.15)"
                        border="1px solid rgba(255, 255, 255, 0.18)"
                    >
                        <Image
                            src={sportsMaintenance}
                            alt="Maintenance"
                            maxH="250px"
                            mx="auto"
                            mb={6}
                            fallbackSrc="https://via.placeholder.com/250"
                        />
                        <Text fontSize="2xl" fontWeight="800" color="red.500" mb={2}>
                            {t("Sports Unavailable")}
                        </Text>
                        <Text fontSize="md" color="gray.600" mb={8}>
                            {t(errorText)}
                        </Text>
                        <Button
                            size="lg"
                            colorScheme="blue"
                            px={10}
                            borderRadius="full"
                            onClick={() => navigate('/')}
                            _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                            transition="all 0.2s"
                        >
                            {t("Return to Home")}
                        </Button>
                    </MotionBox>
                ) : iframeUrl ? (
                    <Box w="100%" h="calc(100vh - 80px)" rounded="md" overflow="hidden" shadow="xl">
                        <iframe
                            src={iframeUrl}
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            allowFullScreen
                            title="LuckySport Game"
                            style={{ border: "none" }}
                        />
                    </Box>
                ) : null}
            </Flex>
        </Box>
    );
};

export default SportsPage;
