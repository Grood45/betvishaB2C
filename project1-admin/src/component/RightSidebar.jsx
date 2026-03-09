import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
  Button,
  Radio,
  RadioGroup,
  Switch,
  useToast,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { IoMdSettings, IoMdColorPalette } from "react-icons/io";
import { RxCross2, RxLapTimer } from "react-icons/rx";
import { BsGlobe } from "react-icons/bs";
import { FaPaintBrush } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarAlwaysOpen, updateTheme } from "../redux/action";
import { SketchPicker } from "react-color";
import { setSidebarVisibility } from "../redux/action";
import { useTranslation } from "react-i18next";
import { fetchGetRequest, sendPatchRequest } from "../api/api";
import { useNavigate } from "react-router-dom";
import { detailsOfSite } from "../redux/switch-web/action";
import { checkPermission } from "../../utils/utils";
function RightSidebar({ globalLoad, setGlbalLoading }) {
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
  const sidebarVisibleAlways = useSelector(
    (state) => state.theme.sidebarVisibleAlways
  );
  const sidebarVisible = useSelector((state) => state.theme.sidebarVisible);
  const { t, i18n } = useTranslation();

  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const [active, setActive] = useState(1);
  const [activeWebsite, setActiveWebsite] = useState(1);
  const [loading, setLoading] = useState();
  const [siteDetails, setSiteDetails] = useState([]);
  const toast = useToast();
  const naviagte = useNavigate();
  const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};
  // const [adminData,setProfileData]=useState(adminData)
  const isOwnerAdmin = adminData?.role_type === 'owneradmin';
  const permissionDetails = user?.user?.permissions

  let hasPermission = checkPermission(permissionDetails, "siteSwitchView")
  let check = !isOwnerAdmin ? hasPermission : true
  const lightenColor = (color, percent) => {
    color = color.replace(/^#/, "");

    let num = parseInt(color, 16);

    let amt = Math.round(2.55 * percent);

    let R = (num >> 16) + amt;
    let B = ((num >> 8) & 0x00ff) + amt;
    let G = (num & 0x0000ff) + amt;

    R = R > 255 ? 255 : R < 0 ? 0 : R;
    B = B > 255 ? 255 : B < 0 ? 0 : B;
    G = G > 255 ? 255 : G < 0 ? 0 : G;

    return "#" + ((1 << 24) | (R << 16) | (B << 8) | G).toString(16).slice(1);
  };

  const [primaryColor, setPrimaryColor] = useState("#6b7280");

  // Gradient State
  const [gradientMode, setGradientMode] = useState(false);
  const [gradientColor1, setGradientColor1] = useState("#6b7280");
  const [gradientColor2, setGradientColor2] = useState("#4b5563");
  const [gradientAngle, setGradientAngle] = useState(90);

  const handlePrimaryChange = (newColor) => {
    setPrimaryColor(newColor.hex);
    if (!gradientMode) {
      updateThemePayload(newColor.hex);
    }
  };

  const updateThemePayload = (finalColor) => {
    const payload = {
      color: finalColor,
      bg: finalColor,
      hoverColor: lightenColor(finalColor, 15),
      hover: lightenColor(finalColor, 15),
      border: finalColor,
      iconColor: finalColor,
      primaryBg: "#fff",
      secondaryBg: "#E9ECEF",
    };
    localStorage.setItem("saveTheme", JSON.stringify(payload));
    dispatch(updateTheme(payload));
  };

  const handleGradientUpdate = () => {
    const gradientString = `linear-gradient(${gradientAngle}deg, ${gradientColor1}, ${gradientColor2})`;
    setPrimaryColor(gradientString);
    updateThemePayload(gradientString);
  };

  // Apply gradient whenever dependencies change AND we are in gradient mode
  useEffect(() => {
    if (gradientMode) {
      handleGradientUpdate();
    }
  }, [gradientColor1, gradientColor2, gradientAngle, gradientMode]);

  const getSiteDetails = async () => {
    setLoading(true);
    let url = `${import.meta.env.VITE_API_URL}/api/site-switch/get-all-site-record`;

    try {
      let response = await fetchGetRequest(url);
      setSiteDetails(response?.data);
      dispatch(detailsOfSite(response?.data))
      setLoading(false);
    } catch (error) {
      toast({
        description: `${error?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      console.log(error);
      setLoading(false);
    }
  };
  //   const handleWebsite = async (id) => {
  //     setActiveWebsite(id);
  //     setGlbalLoading(true)
  //     let url = `${
  //       import.meta.env.VITE_API_URL
  //     }/api/site-switch/toggle-selected/${id}`;
  //     try {
  //       let response = await sendPatchRequest(url);

  //       getSiteDetails();
  //       toast({
  //         description: `Site Switch Successfully`,
  //         status: "success",
  //         duration: 4000,
  //         position: "top",
  //         isClosable: true,
  //       });
  //       setTimeout(()=>{    
  // window.location.reload()

  //           },4000)
  //       onClose()

  //     } catch (error) {
  //       console.log(error, "error");
  //       toast({
  //         description: `${error?.data?.message}`,
  //         status: "error",
  //         duration: 4000,
  //         position: "top",
  //         isClosable: true,
  //       });
  //     }finally{
  //       setTimeout(()=>{    
  //                    console.log("adarsh")
  //                    setGlbalLoading(false)


  //                   },4000)
  //     }
  //   };

  useEffect(() => {
    getSiteDetails();
  }, []);

  // useEffect(()=>{
  //   
  //   console.log("adarsh1")

  //     },[toagleLoading])

  const handleToggleSidebar = useCallback(() => {
    dispatch(setSidebarAlwaysOpen(!sidebarVisibleAlways));
    dispatch(setSidebarVisibility(!sidebarVisible));
  }, [sidebarVisibleAlways, sidebarVisible]);

  return (
    <>
      {/* <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ... p-[1px]   rounded-[4px] lg:rounded-[6px]"> */}

      <div
        ref={btnRef}
        onClick={onOpen}
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
          border: `1px solid ${border}`,
        }}
        className={`lg:p-2 p-1 px-[4px] lg:px-[9px] border  cursor-pointer  rounded-[4px] lg:rounded-[6px] `}
      >
        <IoMdSettings
          cursor="pointer"
          fontSize="20px"
          color={iconColor}
          className=" duration-500 ease-in-out"
        />
      </div>
      {/* </div> */}

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader padding="0">
            <div style={{ backgroundColor: iconColor }} className="p-5 text-white pb-8 rounded-b-[20px] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-black/10 rounded-full -ml-8 -mb-8 blur-xl"></div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <IoMdSettings fontSize="22px" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">{t(`Setting`)}</h2>
                    <p className="text-xs opacity-80 font-medium">Customize your experience</p>
                  </div>
                </div>
                <div
                  onClick={onClose}
                  className="p-2 bg-white/20 rounded-full cursor-pointer hover:bg-white/30 transition-all active:scale-95"
                >
                  <RxCross2 fontSize="20px" />
                </div>
              </div>
            </div>
          </DrawerHeader>

          <DrawerBody className="bg-gray-50 px-4 pt-6 space-y-6">
            {/* Theme Section */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                <span style={{ backgroundColor: `${iconColor}20`, color: iconColor }} className="p-1 rounded">
                  <IoMdColorPalette />
                </span>
                {t(`Theme`)} {t(`Engine`)}
              </h3>

              <Tabs colorScheme="purple" variant="soft-rounded" isFitted size="sm" index={gradientMode ? 1 : 0} onChange={(idx) => setGradientMode(idx === 1)}>
                <TabList className="bg-gray-100 p-1 rounded-lg mb-3">
                  <Tab _selected={{ color: 'white', bg: 'purple.500' }}>Solid</Tab>
                  <Tab _selected={{ color: 'white', bg: 'purple.500' }}>Gradient</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel padding={0}>
                    <div className="flex flex-col items-center">
                      <div className="p-1 border-2 rounded-xl mb-3" style={{ borderColor: `${iconColor}40` }}>
                        <SketchPicker
                          color={gradientMode ? "#ffffff" : primaryColor}
                          width="240px"
                          styles={{ default: { picker: { boxShadow: 'none' } } }}
                          onChange={handlePrimaryChange}
                        />
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg text-xs font-mono text-gray-500 w-full justify-center border border-gray-200">
                        <span>Hex:</span>
                        <span style={{ color: iconColor, fontWeight: 'bold' }}>{primaryColor}</span>
                      </div>
                    </div>
                  </TabPanel>

                  <TabPanel padding={0}>
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-center">
                          <p className="text-xs font-bold mb-1 text-gray-500">Start Color</p>
                          <div className="p-1 border rounded-lg inline-block">
                            <div className="relative overflow-hidden w-8 h-8 rounded-full cursor-pointer shadow-sm mx-auto" style={{ backgroundColor: gradientColor1 }}>
                              <input
                                type="color"
                                className="absolute w-[150%] h-[150%] -top-1/4 -left-1/4 opacity-0 cursor-pointer"
                                value={gradientColor1}
                                onChange={(e) => setGradientColor1(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold mb-1 text-gray-500">End Color</p>
                          <div className="p-1 border rounded-lg inline-block">
                            <div className="relative overflow-hidden w-8 h-8 rounded-full cursor-pointer shadow-sm mx-auto" style={{ backgroundColor: gradientColor2 }}>
                              <input
                                type="color"
                                className="absolute w-[150%] h-[150%] -top-1/4 -left-1/4 opacity-0 cursor-pointer"
                                value={gradientColor2}
                                onChange={(e) => setGradientColor2(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-bold mb-1 text-gray-500 flex justify-between">
                          <span>Angle: {gradientAngle}°</span>
                          <RxLapTimer />
                        </p>
                        <Slider
                          aria-label="gradient-angle"
                          defaultValue={90}
                          min={0}
                          max={360}
                          onChange={(v) => setGradientAngle(v)}
                        >
                          <SliderTrack bg='gray.200'>
                            <SliderFilledTrack bg='purple.500' />
                          </SliderTrack>
                          <SliderThumb boxSize={4} bg="purple.500" />
                        </Slider>
                      </div>

                      <div
                        className="h-12 w-full rounded-lg shadow-inner flex items-center justify-center text-xs font-bold text-white border border-gray-200"
                        style={{ background: `linear-gradient(${gradientAngle}deg, ${gradientColor1}, ${gradientColor2})` }}
                      >
                        Preview Gradient
                      </div>
                    </div>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </div>

            {/* Website Section */}
            {adminData?.role_type === "owneradmin" && (
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                  <span style={{ backgroundColor: `${iconColor}20`, color: iconColor }} className="p-1 rounded">
                    <BsGlobe />
                  </span>
                  {t(`Select`)} {t(`Website`)}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {siteDetails?.map((site) => (
                    <div
                      key={site._id}
                      className={`relative group cursor-pointer transition-all duration-300 hover:-translate-y-1`}
                    // onClick={() => handleWebsite(site._id)}
                    >
                      {/* Glassmorphism Card */}
                      <div
                        className={`
                           h-24 rounded-xl border p-3 flex flex-col justify-between overflow-hidden
                           ${site.selected ? 'shadow-md' : 'hover:shadow-sm bg-gray-50 border-gray-200'}
                        `}
                        style={{
                          background: site.selected ? `linear-gradient(135deg, white, ${iconColor}10)` : undefined,
                          borderColor: site.selected ? iconColor : undefined
                        }}
                      >
                        {/* Header: Status Dot & Badge */}
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-full border border-gray-100 shadow-sm">
                            <span className={`w-1.5 h-1.5 rounded-full ${site.selected ? 'animate-pulse bg-green-500' : 'bg-gray-400'}`}></span>
                            <span className="text-[10px] font-bold text-gray-600 tracking-tight">LIVE</span>
                          </div>

                          {site.selected && (
                            <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs shadow-sm" style={{ backgroundColor: iconColor }}>
                              ✓
                            </div>
                          )}
                        </div>

                        {/* Footer: Name */}
                        <div className="text-center">
                          <p className={`font-bold text-sm tracking-wide ${site.selected ? 'text-gray-800' : 'text-gray-500'}`}>
                            LuckyDaddy
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sidebar Toggle Section */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div style={{ backgroundColor: `${iconColor}20`, color: iconColor }} className="p-2 rounded-lg">
                  <IoMdSettings fontSize="18px" />
                </div>
                <div>
                  <p className="font-bold text-gray-700">{t(`Sidebar`)} 2</p>
                  <p className="text-xs text-gray-400">Fixed Visibility</p>
                </div>
              </div>
              <Switch
                colorScheme="green"
                size="lg"
                isChecked={sidebarVisibleAlways || sidebarVisible}
                onChange={handleToggleSidebar}
              />
            </div>

            <div className="h-10"></div> {/* Spacer */}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default RightSidebar;
