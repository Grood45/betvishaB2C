import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosPersonAdd } from "react-icons/io";
import { Avatar, AvatarBadge, AvatarGroup, useToast } from "@chakra-ui/react";
import { FaRegCreditCard, FaUserCheck } from "react-icons/fa6";
import { BsCalendarDateFill } from "react-icons/bs";
import { FaWallet } from "react-icons/fa6";
import { HiCurrencyDollar } from "react-icons/hi2";
import { MdOutlineAccountBalance } from "react-icons/md";
import { GiWallet } from "react-icons/gi";
import { VscGraphLine } from "react-icons/vsc";
import { Switch } from "@chakra-ui/react";
import { FaArrowCircleDown, FaUsers } from "react-icons/fa";
import { IoSettings, IoWallet } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { GiCard3Diamonds } from "react-icons/gi";
import { MdPendingActions } from "react-icons/md";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Button,
} from "@chakra-ui/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { sendPostRequest } from "../../api/api";
import LoadingSpinner from "../loading/LoadingSpinner";
import nodata from "../../assets/empty.png";
import { useTranslation } from "react-i18next";
import { convertToUniversalTime, formatDate } from "../../../utils/utils";
const AllAdmin = ({ userData }) => {
  const [currentPage, setCurrentPage] = useState(1);
const { t, i18n } = useTranslation();

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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [pagination, setPagination] = useState({});
  const totalPages = pagination.totalPages;
  const [allAdmin, setAllAdmin] = useState(false);
  const [search, setSearch] = useState("");
  const [userCategory, setUserCategory] = useState();
  const [userCount, setUsersCount] = useState();
  const params = useParams();
  const getAllAdmin = async () => {
    setLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/admin/get-all-admin-by-admin?page=${currentPage}&limit=10`;
    if (search) {
      url += `&search=${search}`;
    }
    // if (userCategory) {
    //   url += `&category=${userCategory}`;
    // }

    try {
      const payload = {
        admin_id: userData?.admin_id,
        username: userData?.username,
        role_type: userData?.role_type,
      };
      let response = await sendPostRequest(url, payload);
      const data = response.data;
      const receivedData = response.data;

      setAllAdmin(receivedData);
      setUsersCount(response.userCount);
      setPagination(response.pagination);

      setLoading(false);
    } catch (error) {
      toast({
        description: `${error?.data?.message||error?.response?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    let id;
    id = setTimeout(() => {
      getAllAdmin();
    }, 100);
    return () => clearTimeout(id);
  }, [currentPage, search, userCategory, userData]);

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
    <div>
      <div className="flex justify-between mt-5 items-center w-[100%]">
        <div>
          <p
            style={{ color: iconColor }}
            className={`font-bold mt-6  w-[100%]    flex items-center gap-2 rounded-[6px]   text-lg`}
          >
            <FaUserCheck fontSize={"30px"} style={{ color: iconColor }} />
            {t(`All`)} {t(`Admin`)}
          </p>
        </div>
        <div
          style={{ border: `1px solid ${border}`, backgroundColor: primaryBg }}
          className={` justify-between rounded-[8px] pl-1 flex items-center gap-2 `}
        >
          <input
                        placeholder={`${t(`Search here`)}...`}

            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
            setCurrentPage(1)
            }}
            className=" outline-none rounded-[8px] p-[6px]  text-black text-xs md:text-sm  w-[70%]"
          />
          <span
            style={{ backgroundColor: bg }}
            className={`p-[6px] border rounded-r-[8px] cursor-pointer `}
          >
            <IoSearchOutline fontSize={"22px"} color="white" />
          </span>
        </div>
      </div>
      <div className="mt-5 ml-5">
        {loading ? (
          <LoadingSpinner size="lg" color="green" thickness="4px" />
        ) : (
          ""
        )}
      </div>
      <div className="flex items-center   mt-3 flex-col gap-3">
        {allAdmin &&
          !loading &&
          allAdmin.length > 0 &&
          allAdmin?.map((item) => {
            const timePart = item.joined_at.split(' ')[1];
            const seccondPart=item.joined_at.split(' ')[2]
            const time12Hour = `${timePart} ${seccondPart}`;
            const time24Hour = convertToUniversalTime(time12Hour);
            return (
              <div
                style={{ border: `1px solid ${border}` }}
                key={item._id}
                className={` rounded-[10px] w-[100%]`}
              >
                <div className="rounded-[10px] flex justify-between  overflow-scroll items-center gap-3 bg-white p-2 w-[100%]">
                  <div className="flex items-center min-w-[150px] w-[100%] gap-1">
                    <Avatar
                      name="Dan Abrahmov"
                      src="https://bit.ly/dan-abramov"
                      onClick={() => navigate(`/adminmanage/${item.admin_id}`)}
                      className=" cursor-pointer"
                    />
                    <div className="flex flex-col items-start gap-1">
                      <p className="text-xs font-bold">{item?.username}</p>
                      <span
                        style={{ backgroundColor: bg }}
                        className={`text-[8px] font-medium px-1 py-[2px] rounded-[4px] text-white `}
                      >
                        {item.role_type}
                      </span>
                    </div>
                  </div>

                  <div className="flex min-w-[180px] w-[100%] flex-col gap-1">
                    <p className="text-xs flex items-center gap-1 font-bold">
                      <BsCalendarDateFill style={{ color: iconColor }} />
                      {t(`Joining`)} {t(`Date`)}
                    </p>
                    <p className="text-xs flex  font-medium  ">
                      {formatDate(item?.joined_at.split(" ")[0])}
                      <span className="text-[10px] font-semibold">({time24Hour})</span>
                    </p>
                  </div>
                  <div className="flex flex-col min-w-[100px] w-[100%] gap-1">
                    <p className="text-xs flex items-center gap-1 font-bold">
                      <FaWallet style={{ color: iconColor }} />
                      {t(`Balance`)}
                    </p>
                    <p className="text-xs flex items-center font-semibold">
                      {" "}
                      {/* <HiCurrencyDollar
                        fontSize={"15px"}
                        className="text-yellow-600"
                      /> */}
                      {item?.amount.toFixed(2)} {item?.currency}
                    </p>
                  </div>
                  <div className="flex min-w-[180px] items-start w-[100%] flex-col gap-1">
                    <p className="text-xs flex items-start  gap-1 font-bold">
                      <BsCalendarDateFill style={{ color: iconColor }} />
                      {t(`Created`)} {t(`By`)}
                    </p>
                    <p
                      style={{ backgroundColor: bg }}
                      className={`text-[8px] font-medium px-1 py-[2px] rounded-[4px] text-white `}
                    >
                      {item?.parent_admin_username}
                    </p>
                  </div>
                 
                  <div className="flex min-w-[100px] w-[100%] flex-col gap-1">
                    <p className="text-xs flex items-center gap-1 font-bold">
                      <FaWallet style={{ color: iconColor }} />
                      {t(`Share`)} {t(`%`)}
                    </p>
                    <Badge className="text-xs max-w-[45px]  rounded-sm font-semibold ">
                      {" "}
                    {item?.share_percentage}%
                    </Badge>
                  </div>

                  <div className="flex min-w-[100px] w-[100%] flex-col gap-1">
                    <p className="text-xs flex items-center gap-1 font-bold">
                      <VscGraphLine style={{ color: iconColor }} />
                      {t(`Profit`)} & {t(`Loss`)}
                    </p>
                    <p className="text-xs flex items-center justify-start text-green-500 rounded-sm font-bold ">
                      {" "}
                      {/* <HiCurrencyDollar
                        fontSize={"15px"}
                        className="text-yellow-600"
                      /> */}
                      0.00 {item?.currency}
                    </p>
                  </div>

                  <div>
                    <FaArrowCircleDown
                      onClick={() => navigate(`/adminmanage/${item.admin_id}`)}
                      className="cursor-pointer"
                      fontSize="20px"
                    />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      {allAdmin.length === 0 && (
        <div className="w-[100%] flex justify-center ">
          <img src={nodata} alt="No Data Found" />
        </div>
      )}
      {allAdmin && allAdmin.length > 0 && (
        <div
          className={`text-[16px]   text-sm font-semibold flex m-auto mb-8 mr-5 justify-end gap-3 align-middle items-center mt-2`}
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
  );
};

export default AllAdmin;
