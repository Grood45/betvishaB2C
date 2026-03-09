import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchGetRequest } from "../api/api";
import ModernChart from "../component/ModernChart";
import { useTranslation } from "react-i18next";
import { useToast, Spinner, Select, Input } from "@chakra-ui/react";
import { MdPersonAdd, MdRefresh, MdTimeline, MdDateRange } from "react-icons/md";
import { VscGraph } from "react-icons/vsc";
import UserJoinListModal from "../Modals/UserJoinListModal";

const UserJoinGraph = () => {
    const { t } = useTranslation();
    const { color, primaryBg, iconColor, secondaryBg, bg, hoverColor, hover, text, font, border } = useSelector((state) => state.theme);
    const [graphData, setGraphData] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    // Filters
    const [groupBy, setGroupBy] = useState("day");
    const [joinType, setJoinType] = useState("all");
    const [adminName, setAdminName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const getGraphData = async () => {
        setLoading(true);
        let url = `${import.meta.env.VITE_API_URL}/api/admin/get-user-join-graph-data?groupBy=${groupBy}&joinType=${joinType}`;
        if (adminName) url += `&adminName=${adminName}`;
        if (startDate) url += `&startDate=${startDate}T00:00:00`;
        if (endDate) url += `&endDate=${endDate}T23:59:59`;

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
    }, [groupBy, joinType, adminName, startDate, endDate]);

    // Process data for charts
    const getLineChartData = () => {
        if (!graphData || graphData.length === 0) return { labels: [], values: [] };
        const labels = graphData.map(item => item._id);
        const values = graphData.map(item => item.count);
        return { labels, values };
    };

    const lineChart = getLineChartData();

    const getTotalAutoManual = () => {
        let auto = 0;
        let manual = 0;
        graphData.forEach(item => {
            auto += item.autoCount;
            manual += item.manualCount;
        });
        return [
            { name: "Auto Join (Self)", value: auto },
            { name: "Manual Join (Admin)", value: manual }
        ].filter(item => item.value > 0);
    };

    const pieData = getTotalAutoManual();
    const totalUsers = graphData.reduce((acc, curr) => acc + curr.count, 0);

    const handleChartClick = (params) => {
        if (params && params.name) {
            setSelectedDate(params.name);
            setIsModalOpen(true);
        }
    };

    return (
        <div className="p-6 min-h-screen bg-white">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <div>
                    <h1 style={{ color: '#1a202c' }} className="text-3xl font-extrabold flex items-center gap-3">
                        <span className="p-3 rounded-2xl bg-blue-50 text-blue-600 shadow-sm">
                            <MdTimeline size={28} />
                        </span>
                        {t("User Join Graph")}
                    </h1>
                    <p className="text-sm text-gray-500 mt-2 font-medium ml-1">{t("Track user growth, signups, and acquisition sources over time.")}</p>
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

            {/* Filters Section */}
            <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-8 flex flex-wrap gap-4 items-end">
                <div className="flex flex-col gap-1 flex-1 min-w-[150px]">
                    <label className="text-xs font-bold text-gray-500 uppercase">{t("Time Period")}</label>
                    <Select value={groupBy} onChange={(e) => setGroupBy(e.target.value)} bg="gray.50" border="none" rounded="xl" className="font-medium">
                        <option value="day">{t("Daily")}</option>
                        <option value="week">{t("Weekly")}</option>
                        <option value="month">{t("Monthly")}</option>
                        <option value="year">{t("Yearly")}</option>
                    </Select>
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-[150px]">
                    <label className="text-xs font-bold text-gray-500 uppercase">{t("Join Type")}</label>
                    <Select value={joinType} onChange={(e) => setJoinType(e.target.value)} bg="gray.50" border="none" rounded="xl" className="font-medium">
                        <option value="all">{t("All Sources")}</option>
                        <option value="auto">{t("Auto (Self Signup)")}</option>
                        <option value="manual">{t("Manual (Admin Added)")}</option>
                    </Select>
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-[150px]">
                    <label className="text-xs font-bold text-gray-500 uppercase">{t("Filter by Admin")}</label>
                    <Input
                        placeholder={t("Admin Username")}
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        bg="gray.50" border="none" rounded="xl" className="font-medium"
                    />
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-[150px]">
                    <label className="text-xs font-bold text-gray-500 uppercase">{t("Start Date")}</label>
                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} bg="gray.50" border="none" rounded="xl" className="font-medium" />
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-[150px]">
                    <label className="text-xs font-bold text-gray-500 uppercase">{t("End Date")}</label>
                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} bg="gray.50" border="none" rounded="xl" className="font-medium" />
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden flex items-center justify-between">
                    <div className="relative z-10 w-full">
                        <div className="flex items-center gap-3 mb-2 opacity-80">
                            <MdPersonAdd size={24} />
                            <span className="text-sm font-bold uppercase tracking-wider">{t("Total Registrations")}</span>
                        </div>
                        <h2 className="text-5xl font-extrabold mt-2">{totalUsers.toLocaleString()}</h2>
                        <p className="text-sm opacity-80 mt-2">{t("For the selected period")}</p>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Line Chart: User Join Trend */}
                <div className="lg:col-span-8 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-900 text-xl flex items-center gap-2">
                            {t("Registration Trend")}
                        </h3>
                    </div>

                    <div className="min-h-[350px]">
                        {lineChart.values.length > 0 ? (
                            <ModernChart
                                type="line"
                                labels={lineChart.labels}
                                data={lineChart.values}
                                height="400px"
                                onClick={handleChartClick}
                            />
                        ) : (
                            <div className="h-[400px] flex flex-col items-center justify-center text-gray-400 gap-2">
                                <VscGraph size={50} className="opacity-20" />
                                <span>{t("No data available for selected filters")}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pie Chart: Acquisition Source */}
                <div className="lg:col-span-4 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-900 text-xl flex items-center gap-2">
                            {t("Acquisition Source")}
                        </h3>
                    </div>

                    <div className="flex-grow flex items-center justify-center min-h-[350px]">
                        {pieData.length > 0 ? (
                            <ModernChart
                                type="rose"
                                data={pieData}
                                height="350px"
                            />
                        ) : (
                            <div className="flex flex-col items-center text-gray-400 gap-2">
                                <MdPersonAdd size={40} className="opacity-20" />
                                <span className="text-sm">{t("No data available")}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="mt-10 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-900 text-xl">{t("Detailed Registration Report")}</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <th className="p-4 pl-0">{t("Date/Period")}</th>
                                <th className="p-4 text-center">{t("Auto Signups")}</th>
                                <th className="p-4 text-center">{t("Manual Additions")}</th>
                                <th className="p-4 text-right">{t("Total Users")}</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-700 font-medium">
                            {graphData?.map((item, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
                                    onClick={() => handleChartClick({ name: item._id })}
                                >
                                    <td className="p-4 pl-0 font-bold text-gray-900 flex items-center gap-2">
                                        <MdDateRange className="text-gray-400" />
                                        {item._id}
                                    </td>
                                    <td className="p-4 text-center">{item.autoCount}</td>
                                    <td className="p-4 text-center">{item.manualCount}</td>
                                    <td className="p-4 text-right text-base text-gray-900 font-bold">{item.count}</td>
                                </tr>
                            ))}
                            {graphData?.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center p-6 text-gray-400">{t("No data found")}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Clickable Modal */}
            <UserJoinListModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                date={selectedDate}
                groupBy={groupBy}
                joinType={joinType}
                adminName={adminName}
            />
        </div>
    );
};

export default UserJoinGraph;
