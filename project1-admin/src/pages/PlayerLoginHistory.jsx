import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";
import { fetchGetRequest, sendPostRequest } from "../api/api";
import { useTranslation } from "react-i18next";
import nodatafound from "../assets/emptydata.png";
import LoginHistoryModal from "../component/usermanageComponent/LoginHistoryModal";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import { FaHistory, FaGlobe, FaClock } from "react-icons/fa";

const PlayerLoginHistory = () => {
  const [loading, setLoading] = useState(true);
  const [loginHistoryData, setLoginHistoryData] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const totalPages = pagination?.totalPages;
  const user = useSelector((state) => state.authReducer);
  const adminLayer = user?.adminLayer;
  const [filterStatus, setFilterStatus] = useState("");
  const {
    color,
    primaryBg,
    iconColor,
    secondaryBg,
    bg,
    hoverColor,
    hover,
    text,
    font,
    border,
  } = useSelector((state) => state.theme);
  const toast = useToast();
  const { t, i18n } = useTranslation();
  const getAllLoginHistory = async () => {
    setLoading(true);
    let url = `${import.meta.env.VITE_API_URL}/api/login-history/get-history?page=${currentPage}&limit=${limit}&role=user`;
    if (search) {
      url += `&search=${search}`;
    }

    try {
      let response = await fetchGetRequest(url);
      const data = response.data;
      setLoading(false);
      setLoginHistoryData(response.data);
      setPagination(response.pagination);
    } catch (error) {
      setLoading(false);
      toast({
        description: `${error?.data?.message || error?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      console.log(error);
    }
  };



  useEffect(() => {
    let id;

    id = setTimeout(() => {
      getAllLoginHistory();
    }, 200);

    return () => clearTimeout(id);
  }, [search, currentPage, role, limit]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  return (
    <div className="w-full md:p-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-1 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
        <h2 className="text-2xl font-black text-gray-800 tracking-tight italic uppercase">
          {t(`User`)} {t(`Login`)} {t(`History`)}
        </h2>
      </div>

      {/* Summary Cards */}
      {!loading && loginHistoryData?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/40 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-xl flex items-center gap-5 hover:scale-[1.02] transition-all cursor-pointer overflow-hidden relative group">
            <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-indigo-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-indigo-50 text-indigo-600 shadow-inner group-hover:rotate-6 transition-transform">
              <FaHistory fontSize="28px" />
            </div>
            <div className="z-10">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{t(`Total Logs`)}</p>
              <p className="text-2xl font-black text-gray-800">
                {(loginHistoryData || []).reduce((acc, curr) => acc + (curr?.login_history?.length || 0), 0)}
              </p>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-xl flex items-center gap-5 hover:scale-[1.02] transition-all cursor-pointer overflow-hidden relative group">
            <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-emerald-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-emerald-50 text-emerald-600 shadow-inner group-hover:rotate-6 transition-transform">
              <FaGlobe fontSize="28px" />
            </div>
            <div className="z-10">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{t(`Unique IPs`)}</p>
              <p className="text-2xl font-black text-gray-800">
                {[...new Set((loginHistoryData || []).flatMap(u => u?.login_history?.map(h => h.login_ip)))].filter(Boolean).length}
              </p>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-xl flex items-center gap-5 hover:scale-[1.02] transition-all cursor-pointer overflow-hidden relative group">
            <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-amber-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-amber-50 text-amber-600 shadow-inner group-hover:rotate-6 transition-transform">
              <FaClock fontSize="28px" />
            </div>
            <div className="z-10">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{t(`Recent Activity`)}</p>
              <p className="text-lg font-black text-gray-800">
                {loginHistoryData[0]?.updated_time?.split(" ")?.[0] || "No Data"}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col mt-4 md:flex-row items-center justify-between mb-6 gap-4">
        <div className="relative w-full md:w-80 group">
          <input
            type="text"
            placeholder={t("Search by user...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 pl-10 outline-none rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
            <FaHistory />
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm p-2 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-gray-500 uppercase px-2">{t(`Show`)}</span>
          <select
            onChange={(e) => setLimit(e.target.value)}
            className="text-sm font-bold outline-none bg-transparent cursor-pointer"
            value={limit}
          >
            {[20, 50, 100, 200, 500].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          <span className="text-xs font-bold text-gray-500 uppercase px-2">{t(`Entries`)}</span>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center mt-5">
          <LoadingSpinner size={"lg"} thickness={"4px"} color={"green"} />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white border border-gray-200 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="py-4 px-6 text-xs font-black text-gray-500 uppercase tracking-widest border-b border-gray-100">{t(`ID`)}</th>
                <th className="py-4 px-6 text-xs font-black text-gray-500 uppercase tracking-widest border-b border-gray-100 text-left">{t(`Username`)}</th>
                <th className="py-4 px-6 text-xs font-black text-gray-500 uppercase tracking-widest border-b border-gray-100 text-left">{t(`Email`)}</th>
                <th className="py-4 px-6 text-xs font-black text-gray-500 uppercase tracking-widest border-b border-gray-100">{t(`Role`)}</th>
                <th className="py-4 px-6 text-xs font-black text-gray-500 uppercase tracking-widest border-b border-gray-100">{t(`Login Time`)}</th>
                <th className="py-4 px-6 text-xs font-black text-gray-500 uppercase tracking-widest border-b border-gray-100">{t(`Recent Login`)}</th>
                <th className="py-4 px-6 text-xs font-black text-gray-500 uppercase tracking-widest border-b border-gray-100">{t(`Action`)}</th>
              </tr>
            </thead>
            <tbody>
              {loginHistoryData.map((entry, index) => (
                <tr key={entry?._id} className="text-center">
                  <td className="py-4 px-6 border-b border-gray-50 font-bold text-gray-700">{index + 1}</td>
                  <td className="py-4 px-6 border-b border-gray-50 text-left">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs shadow-sm">
                        {entry?.username?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-gray-800">{entry?.username}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 border-b border-gray-50 text-left text-sm text-gray-500">{entry?.email}</td>
                  <td className="py-4 px-6 border-b border-gray-50">
                    <span className="px-2 py-1 rounded-md bg-gray-100 text-[10px] font-black uppercase text-gray-500 border border-gray-200">
                      {entry?.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 border-b border-gray-50">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-bold text-gray-700">{entry?.created_time?.split(" ")?.[0]}</span>
                      <span className="text-[10px] font-medium text-gray-400">({entry?.created_time?.split(" ")?.[1]})</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 border-b border-gray-50">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-bold text-gray-700 text-indigo-600">{entry?.updated_time?.split(" ")?.[0]}</span>
                      <span className="text-[10px] font-medium text-gray-400">({entry?.updated_time?.split(" ")?.[1]})</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 border-b border-gray-50">
                    <LoginHistoryModal data={entry?.login_history || []} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div>
        {!loading && loginHistoryData?.length === 0 ? (
          <div className="flex justify-center items-center">
            <img
              src={nodatafound}
              className="w-[300px] rounded-[50%]"
              alt="No user found"
            />
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="flex justify-between items-center mt-8 w-full px-6 py-5 bg-gray-100/80 backdrop-blur-sm border-t border-gray-200">
        {loginHistoryData?.length > 0 && (
          <p className="text-sm font-bold text-gray-800 uppercase tracking-tight">
            {t(`Showing`)} <span className="text-indigo-600 italic">1</span> {t(`to`)} <span className="text-indigo-600 italic">{limit}</span> {t(`of`)} <span className="text-indigo-600 italic">{loginHistoryData?.length}</span> {t(`Entries`)}
          </p>
        )}
        {loginHistoryData && loginHistoryData?.length > 0 && (
          <div className="flex gap-4 items-center">
            <button
              type="button"
              className="h-10 w-10 flex items-center justify-center bg-black text-white rounded-xl hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg group"
              onClick={() => handlePrevPage()}
              disabled={currentPage == 1}
            >
              <span className="text-xl font-bold group-hover:-translate-x-1 transition-transform tracking-tighter">{"<<"}</span>
            </button>

            <div className="text-sm font-bold text-gray-800 flex gap-2 items-center bg-white px-5 py-2.5 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-gray-400 font-medium uppercase tracking-widest text-[10px]">{t(`Page`)}</span>
              <span className="text-indigo-600 text-lg italic tracking-tighter">{currentPage}</span>
              <div className="h-4 w-[1px] bg-gray-200 mx-1"></div>
              <span className="text-gray-400 font-medium uppercase tracking-widest text-[10px]">{t(`of`)}</span>
              <span className="text-black text-lg italic tracking-tighter">{pagination?.totalPages}</span>
            </div>

            <button
              onClick={() => handleNextPage()}
              type="button"
              className="h-10 w-10 flex items-center justify-center bg-black text-white rounded-xl hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg group"
              disabled={currentPage == pagination?.totalPages}
            >
              <span className="text-xl font-bold group-hover:translate-x-1 transition-transform tracking-tighter">{">>"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerLoginHistory;
