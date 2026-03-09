import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";
import { fetchGetRequest } from "../../api/api";
import { useTranslation } from "react-i18next";
import nodatafound from "../../assets/emptydata.png";
import LoginHistoryModal from "../../component/usermanageComponent/LoginHistoryModal";
import LoadingSpinner from "../../component/loading/LoadingSpinner";

const SingleLoginHistory = ({userData,role}) => {
  const [loading, setLoading] = useState(false);
  const [loginHistoryData, setLoginHistoryData] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState("");
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
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/login-history/get-history?page=${currentPage}&limit=${limit}&role=${role}&username=${userData?.username}`;
    if (search) {
      url += `&search=${search}`;
    }

    try {
      let response = await fetchGetRequest(url);
      const data = response.data;
      console.log(response, "all Single login history");
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
    <div className=" w-[100%] md:p-4">
      <h2 className="text-xl font-bold mb-4">
      {t(`Login`)} {t(`History`)}
      </h2>
      <div className="flex flex-col mt-10 md:flex-row items-center justify-between mb-4">
        

        <div>
          <div className="flex items-center gap-2 text-sm">
            {t(`Show`)}
            <select
              onChange={(e) => setLimit(e.target.value)}
              style={{ border: `1px solid ${border}` }}
              className="text-xs outline-none p-1 rounded-md"
              value={limit}
            >
              <option value="20">20</option>

              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="500">500</option>
              <option value="1000">1000</option>
            </select>
            {t(`Entries`)}
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center mt-5">
          <LoadingSpinner size={"lg"} thickness={"4px"} color={"green"} />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg p-2  bg-white border border-gray-200 ">
          <table className="min-w-full  ">
            <thead>
              <tr>
                <th className="py-2 px-4 text-nowrap border-b">{t(`ID`)}</th>
                <th className="py-2 px-4 text-nowrap border-b">
                  {t(`Username`)}
                </th>
                <th className="py-2 px-4 text-nowrap border-b">{t(`Email`)}</th>
                <th className="py-2 px-4 text-nowrap border-b">{t(`IP`)}</th>

                <th className="py-2 px-4 text-nowrap border-b">
                {t(`Recent`)} {t(`Login`)}
                </th>
                <th className="py-2 px-4  text-nowrap border-b">
                  {t(`Login`)} {t(`History`)}
                </th>
              
                
              </tr>
            </thead>
            
            <tbody>
            {loginHistoryData[0]?.login_history?.map((entry, index) => (
                    <tr key={entry?._id} className="text-center">

                      <td className="py-2 px-4 border-b">{index + 1}</td>
                      <td className="py-2 px-4 border-b">{loginHistoryData[0]?.username}</td>
                      <td className="py-2 px-4 border-b">{loginHistoryData[0]?.email}</td>

                      <td className="py-2 px-4 border-b">{entry?.login_ip}</td>
                      <td className="py-2 px-4 border-b">
                        <p className="flex flex-col items-center"> {entry?.login_time.split(" ")[0]} <span className="text-xs ml-1 font-semibold"> ({entry?.login_time.split(" ")[1]})</span></p>
                      </td>
                      <td className=" border-b ">
                    <LoginHistoryModal  data={loginHistoryData[0].login_history} />
                  </td>
                    </tr>
                  ))}
            
            </tbody>
          </table>
        </div>
      )}

      <div>
        {loginHistoryData?.length === 0 ? (
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
      <div className="flex justify-between items-center">
        {loginHistoryData?.length > 0 && (
          <p style={{ color: iconColor }} className="text-xs font-semibold ">
            {t(`Showing`)} 1 {t(`to`)} {limit} {t(`of`)}{" "}
            {loginHistoryData?.length} {t(`Entries`)}
          </p>
        )}
        {loginHistoryData && loginHistoryData?.length > 0 && (
          <div
            className={`text-[16px]   text-sm font-semibold flex  mt-5 mr-5 justify-end gap-3 align-middle items-center`}
          >
            <button
              type="button"
              style={{
                backgroundColor: bg,
                border: `1px solid ${border}`,
                color: "white",
                fontSize: "12px",
              }}
              className={`ml-1 px-2 py-[4px] cursor-pointer  rounded-[5px] text-[20px]`}
              onClick={() => handlePrevPage()}
              disabled={currentPage == 1}
            >
              {"<"}
            </button>
            {t(`Page`)} <span>{currentPage}</span> {t(`of`)}{" "}
            <span>{pagination?.totalPages}</span>
            <button
              onClick={() => handleNextPage()}
              type="button"
              className={`ml-1 px-2 py-[4px] cursor-pointer rounded-[5px] text-[20px]`}
              style={{
                backgroundColor: bg,
                border: `1px solid ${border}`,
                color: "white",
                fontSize: "12px",
              }}
              disabled={currentPage == pagination?.totalPages}
            >
              {">"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleLoginHistory;
