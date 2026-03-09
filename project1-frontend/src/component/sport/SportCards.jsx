import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Box, Flex, Text, useToast, Spinner } from "@chakra-ui/react";
import axios from "axios";
import { setLoginForm } from "../../redux/switch-web/action";
import { motion, AnimatePresence } from "framer-motion";

const SportCards = ({ activeProviders = [], selectedProvider = 'all', searchQuery = '' }) => {
  const { bgGray, bgColor1, secondaryText } = useSelector((state) => state.theme);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toast = useToast();

  const users = useSelector((state) => state?.auth);
  const data = users?.user?.data;

  const StyleCard = {
    width: "100%",
    position: "absolute",
    paddingTop: "10px",
    bottom: 0,
    left: 0,
    borderRadius: "0 0 5px 5px",
    background: "linear-gradient(0deg, #000, transparent)",
    display: "flex",
    justifyContent: "space-between",
  };

  const filteredProviders = activeProviders.filter(provider => {
    const matchesTab = selectedProvider === 'all' || provider.provider_name === selectedProvider;
    const matchesSearch = provider.provider_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch && provider.provider_image;
  });

  const handleSportGame = async (providerName, eventType = 4) => {
    // Check provider status (maintenance/coming soon)
    const provider = activeProviders.find(p => p.provider_name === providerName);

    if (provider?.is_coming_soon) {
      if (provider?.coming_soon_display_type === 'overlay') {
        // Overlay is handled in UI, click does nothing or shows toast anyway
        return;
      }
      toast({
        title: t("Coming Soon"),
        description: t("This sport provider will be available very soon!"),
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (provider?.is_maintenance) {
      if (provider?.maintenance_display_type === 'overlay') {
        return;
      }
      toast({
        title: t("Under Maintenance"),
        description: t("Provider is currently under maintenance. Please try again later."),
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (!data?.token && !data?.usernameToken) {
      dispatch(setLoginForm(true));
      return null;
    } else {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/sport/get-key-and-login`,
          {
            eventType: eventType,
            providerName: providerName
          },
          {
            headers: {
              token: data?.token,
              usernametoken: data?.usernameToken
            },
            params: {
              site_auth_key: import.meta.env.VITE_API_SITE_AUTH_KEY
            }
          }
        );

        if (response.data.loginUrl) {
          localStorage.setItem('redirected', 'true');
          window.location.href = response.data.loginUrl;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error opening game",
          description: error.response?.data?.message || error.message || "Something went wrong",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };

  // Prepare cards array: some providers might have multiple sports
  const allCards = [];
  activeProviders.forEach(provider => {
    const matchesTab = selectedProvider === 'all' || provider.provider_name === selectedProvider;
    const matchesSearch = provider.provider_name.toLowerCase().includes(searchQuery.toLowerCase());

    if (matchesTab && matchesSearch) {
      // 1. Add Provider Lobby Card if image exists
      if (provider.provider_image) {
        allCards.push({
          id: `${provider._id}-lobby`,
          provider_name: provider.provider_name,
          name: provider.provider_name, // User sees "PowerPlay" or "9Wicket"
          image: provider.provider_image,
          eventType: 4 // Default
        });
      }

      // 2. Add Sport-Specific Cards
      if (provider.sport_images && provider.sport_images.length > 0) {
        provider.sport_images.forEach(sport => {
          if (sport.status) {
            allCards.push({
              id: `${provider._id}-${sport.event_type}`,
              provider_name: provider.provider_name,
              name: sport.sport_name,
              image: sport.image_url,
              eventType: sport.event_type
            });
          }
        });
      }
    }
  });

  return (
    <Box>
      {activeProviders.length === 0 ? (
        <Flex justify="center" p={10}>
          <Spinner size="xl" color={bgGray} />
        </Flex>
      ) : allCards.length > 0 ? (
        <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-[10px]">
          {allCards.map((card) => (
            <Box
              key={card.id}
              rounded="5px"
              overflow="hidden"
              position="relative"
              cursor={"pointer"}
              onClick={() => handleSportGame(card.provider_name, card.eventType)}
              transition="all 0.3s"
              _hover={{ transform: "translateY(-4px)", shadow: "xl" }}
            >
              <img src={card.image} className="h-[140px] md:h-[160px] w-[100%] object-cover" alt={card.name} />

              {/* Overlay Logic */}
              <AnimatePresence>
                {(() => {
                  const provider = activeProviders.find(p => p.provider_name === card.provider_name);
                  const isMaint = provider?.is_maintenance && provider?.maintenance_display_type === 'overlay';
                  const isSoon = provider?.is_coming_soon && provider?.coming_soon_display_type === 'overlay';

                  if (isMaint || isSoon) {
                    return (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "rgba(0, 0, 0, 0.7)",
                          backdropFilter: "blur(4px)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 10,
                          padding: "10px"
                        }}
                      >
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          style={{ textAlign: "center" }}
                        >
                          <Text
                            color="white"
                            fontWeight="900"
                            fontSize="xs"
                            letterSpacing="2px"
                            textShadow="0 0 10px rgba(255,255,255,0.5)"
                          >
                            {isMaint ? "UNDER MAINTENANCE" : "COMING SOON"}
                          </Text>
                          <Box mt={2} h="2px" bg={isMaint ? "orange.400" : "blue.400"} w="40px" mx="auto" rounded="full" />
                        </motion.div>
                      </motion.div>
                    );
                  }
                  return null;
                })()}
              </AnimatePresence>

              <div style={{ ...StyleCard }} className="text-white px-2">
                <span className="font-bold mb-2 ml-1 text-sm md:text-base">{card.name}</span>
                {card.provider_name !== card.name && (
                  <span className="text-[10px] opacity-70 mb-2 mr-1 self-end">{card.provider_name}</span>
                )}
              </div>
            </Box>
          ))}
        </div>
      ) : (
        <Flex justify="center" align="center" direction="column" minH="300px" p={10}>
          <Text fontSize="xl" fontWeight="bold" color={secondaryText}>
            {t("No sports available for this selection.")}
          </Text>
        </Flex>
      )}
    </Box>
  );
};

export default SportCards;
