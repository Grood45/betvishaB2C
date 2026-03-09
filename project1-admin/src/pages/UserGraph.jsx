import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchGetRequest } from "../api/api";
import ModernChart from "../component/ModernChart";
import { useTranslation } from "react-i18next";
import { useToast, Spinner } from "@chakra-ui/react";
import { MdPerson, MdPersonOutline, MdRefresh, MdLocationOn } from "react-icons/md";
import { VscGraph } from "react-icons/vsc";
import { FaGlobeAmericas, FaMapMarkerAlt } from "react-icons/fa";
import LiveUserListModal from "../Modals/LiveUserListModal";

const UserGraph = () => {
    const { t } = useTranslation();
    const { color, primaryBg, iconColor, secondaryBg, bg, hoverColor, hover, text, font, border } = useSelector((state) => state.theme);
    const [graphData, setGraphData] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    // Live User Modal State
    const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
    const [selectedLiveCountry, setSelectedLiveCountry] = useState(null);
    const [selectedLiveState, setSelectedLiveState] = useState(null);

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

    const getGraphData = async () => {
        setLoading(true);
        let url = `${import.meta.env.VITE_API_URL}/api/admin/get-user-graph-data`;
        try {
            let response = await fetchGetRequest(url);
            if (response.success) {
                setGraphData(response.data);
            } else {
                toast({
                    description: response.message,
                    status: "error",
                    duration: 4000,
                    position: "top",
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                description: error?.message || "Something went wrong",
                status: "error",
                duration: 4000,
                position: "top",
                isClosable: true,
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        getGraphData();
    }, []);

    // Process data for charts
    const getLocationPieData = () => {
        if (!graphData?.locationDistribution) return [];
        return graphData.locationDistribution.slice(0, 8).map(item => ({
            name: `${getFlagEmoji(item._id.country)} ${item._id.country}`,
            value: item.count
        }));
    };

    const getLiveUserChartData = () => {
        if (!graphData?.liveUserDistribution) return { labels: [], values: [] };
        const topLocations = graphData.liveUserDistribution.slice(0, 10);
        const labels = topLocations.map(item => `${getFlagEmoji(item._id.country)} ${item._id.state}`);
        const values = topLocations.map(item => item.count);
        return { labels, values };
    };

    const handleLiveRegionClick = (country, state) => {
        setSelectedLiveCountry(country);
        setSelectedLiveState(state);
        setIsLiveModalOpen(true);
    };

    const handleLiveChartClick = (params) => {
        if (params && params.dataIndex !== undefined && graphData?.liveUserDistribution) {
            const loc = graphData.liveUserDistribution.slice(0, 10)[params.dataIndex];
            if (loc) {
                handleLiveRegionClick(loc._id.country, loc._id.state);
            }
        }
    };


    const locationPieData = getLocationPieData();
    const liveChart = getLiveUserChartData();

    return (
        <div className="p-6 min-h-screen bg-white">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <div>
                    <h1 style={{ color: '#1a202c' }} className="text-3xl font-extrabold flex items-center gap-3">
                        <span className="p-3 rounded-2xl bg-blue-50 text-blue-600 shadow-sm">
                            <VscGraph size={28} />
                        </span>
                        {t("User Graph")}
                    </h1>
                    <p className="text-sm text-gray-500 mt-2 font-medium ml-1">{t("Advanced analytics regarding user demographics and activity.")}</p>
                </div>
                <button
                    onClick={getGraphData}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl shadow-lg hover:bg-black transition-all active:scale-95 disabled:opacity-70"
                >
                    {loading ? <Spinner size="sm" /> : <MdRefresh size={20} />}
                    <span className="font-semibold">{t("Refresh Data")}</span>
                </button>
            </div>

            {/* Status Cards - Ultra Modern White Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                {/* Total Users Card */}
                <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-gray-50 text-gray-900">
                            <MdPerson size={24} />
                        </div>
                        <span className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1 rounded-full uppercase tracking-wider">
                            {t("Total")}
                        </span>
                    </div>
                    <h2 className="text-4xl font-extrabold text-gray-900">{graphData?.totalUsers?.toLocaleString() || 0}</h2>
                    <p className="text-sm text-gray-500 font-medium mt-1">{t("Registered Users")}</p>
                </div>

                {/* Live Users Card */}
                <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-green-50 text-green-600 relative">
                            <MdPersonOutline size={24} />
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
                        </div>
                        <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full uppercase tracking-wider">
                            {t("Live")}
                        </span>
                    </div>
                    <h2 className="text-4xl font-extrabold text-gray-900">{graphData?.totalLiveUsers?.toLocaleString() || 0}</h2>
                    <p className="text-sm text-gray-500 font-medium mt-1">{t("Online Now")}</p>
                </div>

                {/* Regions Card */}
                <div className="md:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden flex items-center justify-between">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2 opacity-80">
                            <FaGlobeAmericas size={18} />
                            <span className="text-sm font-bold uppercase tracking-wider">{t("Global Presence")}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-5xl font-extrabold">{graphData?.locationDistribution?.length || 0}</h2>
                            <span className="text-xl font-medium opacity-70">{t("Regions")}</span>
                        </div>
                        <p className="text-sm opacity-60 mt-2 max-w-[200px]">{t("Active user base across different states and countries.")}</p>
                    </div>
                    {/* Decorative Circle */}
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white opacity-5 rounded-full blur-3xl"></div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Rose Chart: Total Distribution */}
                <div className="lg:col-span-5 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-900 text-xl flex items-center gap-2">
                            {t("User Distribution")}
                        </h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-6">{t("Geographic breakdown by region")}</p>

                    <div className="flex-grow flex items-center justify-center min-h-[350px]">
                        {locationPieData.length > 0 ? (
                            <ModernChart
                                type="rose"
                                data={locationPieData}
                                height="400px"
                            />
                        ) : (
                            <div className="flex flex-col items-center text-gray-400 gap-2">
                                <FaGlobeAmericas size={40} className="opacity-20" />
                                <span className="text-sm">{t("No data available")}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bar Chart: Live Users */}
                <div className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-900 text-xl flex items-center gap-2">
                            {t("Live Activity")}
                        </h3>
                        <span className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            REAL-TIME
                        </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-6">{t("Top active regions right now")}</p>

                    <div className="min-h-[350px]">
                        {liveChart.values.length > 0 ? (
                            <ModernChart
                                type="gradient-bar-green"
                                labels={liveChart.labels}
                                data={liveChart.values}
                                height="400px"
                                onClick={handleLiveChartClick}
                            />
                        ) : (
                            <div className="h-[400px] flex flex-col items-center justify-center text-gray-400 gap-2">
                                <MdPersonOutline size={50} className="opacity-20" />
                                <span>{t("No users currently online")}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Detailed Stats Table */}
            <div className="mt-10 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-900 text-xl">{t("Detailed Regional Report")}</h3>
                    <button className="text-sm font-bold text-blue-600 hover:underline">{t("Export Data")}</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <th className="p-4 pl-0">{t("Region / State")}</th>
                                <th className="p-4 text-right">{t("Total Users")}</th>
                                <th className="p-4 text-right">{t("Activity Status")}</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-700 font-medium">
                            {graphData?.locationDistribution?.slice(0, 10).map((item, index) => {
                                const liveCount = graphData?.liveUserDistribution?.find(
                                    live => live._id.country === item._id.country && live._id.state === item._id.state
                                )?.count || 0;
                                const flag = getFlagEmoji(item._id.country);
                                return (
                                    <tr
                                        key={index}
                                        className={`border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors group ${liveCount > 0 ? 'cursor-pointer' : ''}`}
                                        onClick={() => {
                                            if (liveCount > 0) handleLiveRegionClick(item._id.country, item._id.state)
                                        }}
                                    >
                                        <td className="p-4 pl-0 flex items-center gap-3">
                                            <span className="text-xl bg-gray-50 w-10 h-10 flex items-center justify-center rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all">{flag}</span>
                                            <div>
                                                <div className="text-gray-900 font-bold">{item._id.country}</div>
                                                <div className="text-xs text-gray-500">{item._id.state}</div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right text-base text-gray-900 font-bold">{item.count}</td>
                                        <td className="p-4 text-right">
                                            {liveCount > 0 ? (
                                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-bold">
                                                    <span>{liveCount} Online</span>
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-300 text-xs">{t("Offline")}</span>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Live User Details Modal */}
            <LiveUserListModal
                isOpen={isLiveModalOpen}
                onClose={() => setIsLiveModalOpen(false)}
                country={selectedLiveCountry}
                state={selectedLiveState}
            />
        </div>
    );
};

export default UserGraph;
