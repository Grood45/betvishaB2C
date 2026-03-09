import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosPersonAdd } from "react-icons/io";
import {
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Badge,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { FaRegCreditCard } from "react-icons/fa6";
import { BsCalendarDateFill, BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { FaWallet } from "react-icons/fa6";
import { HiCurrencyDollar } from "react-icons/hi2";
import { MdDelete, MdOutlineAccountBalance } from "react-icons/md";
import { GiWallet } from "react-icons/gi";
import { VscGraphLine } from "react-icons/vsc";
import { PiEyeClosedFill } from "react-icons/pi";
import { Switch } from "@chakra-ui/react";
import { FaUsers } from "react-icons/fa";
import { IoSettings, IoWallet } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { GiCard3Diamonds } from "react-icons/gi";
import { MdPendingActions } from "react-icons/md";
import AddNewUser from "../Modals/AddNewUser";
import ChangePassword from "../Modals/ChangePassword";
import pdfIcon from "../assets/pdfIcon.webp";
import excelIcon from "../assets/excelIcon.webp";
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
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchGetRequest, sendPatchRequest } from "../api/api";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import DeleteUserAdmin from "../Modals/DeleteUserAdmin";
import nodatafound from "../assets/emptydata.png";
import { useTranslation } from "react-i18next";
import {
  checkPermission,
  convertToUniversalTime,
  formatDate,
} from "../../utils/utils";
import moment from "moment/moment";
import AddNewAffilate from "../Modals/AddNewAffilate";
const AffilateAdminManage = () => {
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

  const naviagte = useNavigate();
  const [allUserData, setAllUserData] = useState();
  const [loading, setLoading] = useState(false);
  const [usersCount, setUsersCount] = useState({
    totalUserCount: 0,
    blockUserCount: 0,
    betDeactiveUser: 0,
  });
  const { t, i18n } = useTranslation();
  const [exposureShow, setExposureShow] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [plData, setPlData] = useState({});
  const [individualPl, setShowIndivitualPl] = useState();
  const [plShow, setPlShow] = useState(false);

  const [individualEl, setShowIndivituaEl] = useState();

  const [userCategory, setUserCategory] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const toast = useToast();
  const [pagination, setPagination] = useState({});
  const totalPages = pagination.totalPages;
  const [statuses, setStatuses] = useState({});
  const { selectedWebsite, siteDetails } = useSelector(
    (state) => state.websiteReducer
  );
  let filteredData = siteDetails.filter((item) => item.selected === true);

  const user = useSelector((state) => state.authReducer);

  const adminData = user.user || {};
  const isOwnerAdmin = adminData?.role_type === "owneradmin";

  const permissionDetails = user?.user?.permissions;

  let hasPermission = checkPermission(permissionDetails, "userManage");
  let check = !isOwnerAdmin ? hasPermission : true;
  const [limit, setLimit] = useState("100");


  const getAllUser = async () => {
    setLoading(true);
    let url = `${import.meta.env.VITE_API_URL
      }/api/admin/get-all-admin-by-parent?page=${currentPage}&limit=${limit}`;


    if (search) {
      url += `&search=${search}`;
    }
    if (userCategory) {
      url += `&category=${userCategory}`;
    }

    try {
      let response = await fetchGetRequest(url);
      const data = response.data;
      const receivedData = response.data;
      const finalData = receivedData?.filter((item) => item?.role_type === "affiliate")
      setAllUserData(finalData);
      console.log(response, finalData, "allUSerData 123")
      setUsersCount(response.userCount);
      setPagination(response.pagination);
      setLoading(false);
    } catch (error) {
      toast({
        description: `${error?.data?.message || error?.response?.data?.message
          }`,
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
      getAllUser();
    }, 100);

    return () => clearTimeout(id);
  }, [currentPage, search, userCategory, limit]);

  useEffect(() => {
    let result = {};
    let data = allUserData?.map((ele) => {
      result[ele._id] = ele.is_blocked ? "Block" : "Active";
    });
    setStatuses(result);
  }, [allUserData]);

  const handleStatus = async (value, itemId, userId) => {
    let url = `${import.meta.env.VITE_API_URL
      }/api/admin/toggle-user-status/${userId}`;

    try {
      let response = await sendPatchRequest(url, { name: value });
      const data = response.data;

      setLoading(false);
      setStatuses((prevStatuses) => ({
        ...prevStatuses,
        [itemId]: data.is_blocked ? "Block" : "Active",
      }));
      getAllUser();
    } catch (error) {
      toast({
        description: `${error?.data?.message || error?.response?.data?.message
          }`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      console.log(error);
    }
  };

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
  const deleteUserHandler = () => {
    getAllUser();
  };

  const isUserOnline = (updatedAt) => {
    return (
      moment().diff(moment(updatedAt, "YYYY-MM-DD hh:mm:ss A"), "minutes") < 2
    );
  };

  // Example usage
  // const updatedAt = '2024-08-01 7:49:42 PM';
  // const onlineStatus = isUserOnline(updatedAt);

  const profitLossData = async (userData) => {
    setPlData({});
    if (!userData) {
      return;
    }
    setLoading1(true);
    let url = `${import.meta.env.VITE_API_URL
      }/api/transaction/get-transaction-pl/${userData?.user_id}?username=${userData?.username
      }&type=user`;

    try {
      let response = await fetchGetRequest(url);
      setLoading1(false);
      if (response) {
        setPlData(response);
      }
    } catch (error) {
      setLoading1(false);
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

  const [sportAmount, setSportAmountDetails] = useState({});
  const [exposureLoading, setExposureLoading] = useState(false);

  const fetchSportDetails = async (userData) => {
    setExposureLoading(true);
    try {
      const response = await fetchGetRequest(
        `${import.meta.env.VITE_API_URL
        }/api/sport/get-sport-balance-admin?username=${userData?.username}`
      );

      setSportAmountDetails(response?.data?.balance);
      setExposureLoading(false);
    } catch (error) {
      setExposureLoading(false);
    }
  };

  const handlePlShow = (item) => {
    setPlShow(!plShow);
    profitLossData(item);
    setShowIndivitualPl(item?._id);
  };

  const handleExpsoureShow = (item) => {
    setExposureShow(!exposureShow);
    fetchSportDetails(item);
    setShowIndivituaEl(item?._id);
  };

  return (
    <div className="px-2 lg:px-0">
      <div className="flex flex-col items-end gap-3 md:flex-row justify-between px-2">
        <div className="flex items-center md:w-[60%] gap-2">
          <div
            style={{
              border: `1px solid ${border}`,
              backgroundColor: primaryBg,
            }}
            className={` justify-between rounded-[8px] pl-1 flex items-center gap-2 w-[100%]`}
          >
            <input
              placeholder={`${t(`Search here`)}...`}
              className=" outline-none rounded-[8px] p-[6px]  text-black text-xs md:text-sm  w-[70%]"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <span
              style={{ backgroundColor: bg }}
              className={`p-[6px] border rounded-r-[8px] cursor-pointer `}
            >
              <IoSearchOutline fontSize={"22px"} color="white" />
            </span>
          </div>

          <select
            onChange={(e) => {
              setUserCategory(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              border: `1px solid ${border}`,
              backgroundColor: primaryBg,
            }}
            className={`p-[8px]   w-[100%] rounded-[6px] text-xs md:text-sm font-semibold border outline-none`}
          >
            <option>
              {" "}
              <IoSearchOutline fontSize={"22px"} color="black" />
              {t(`Select Status`)}
            </option>
            <option value="is_active">{t(`Active`)}</option>
            <option value="is_blocked">{t(`Block`)}</option>

          </select>
          <button
            style={{ backgroundColor: bg }}
            className={`flex items-center p-[2px] gap-2 rounded-[6px] text-xs md:text-sm text-white font-bold w-[70px] hover:border-green-600 hover:border`}
          >
            <img src={pdfIcon} alt="" />
          </button>
          <button
            style={{ backgroundColor: bg }}
            className={`flex items-center p-[2px] gap-2 rounded-[6px] text-xs md:text-sm text-white font-bold w-[70px] hover:border-green-600 hover:border`}
          >
            <img src={excelIcon} alt="" />
          </button>
        </div>
        {check && (
          <AddNewAffilate
            setAllUserData={setAllUserData}
            allUserData={allUserData}
          />
        )}
      </div>
      <div className="flex justify-between flex-col gap-4 sm:flex-row  mt-6  pr-5 sm:items-center">
        <p
          style={{ color: iconColor }}
          className={`font-bold  w-[100%]    flex items-center gap-2 rounded-[6px]  text-lg`}
        >
          <FaUsers style={{ color: iconColor }} fontSize={"30px"} />
          {t(`Affilate`)} {(`Admin`)} {t(`Manage`)}
          <span className={`text-green-600`}>
            {/* ({usersCount.totalUserCount}) */}
          </span>
        </p>
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

      <div className="flex justify-between ">
        <p
          // onClick={() => setUserCategory("is_active")}
          className={` p-2 text-sm cursor-pointer   px-4  mt-3 text-white  font-bold bg-green-400 text-center  w-[100%] `}
        >
          {allUserData?.length}
        </p>
        <p
          // onClick={() => setUserCategory("is_blocked")}
          className={` p-2 text-sm  cursor-pointer    px-4  mt-3 text-white  font-bold bg-red-400  w-[100%] text-center`}
        >
          {/* {usersCount.blockUserCount} {t(`Block`)} */}
        </p>
        {/* <p onClick={()=>setUserCategory("bet_active")} className={` p-2 text-sm  cursor-pointer    px-4  mt-3 text-white  font-bold bg-yellow-400  w-[100%]  text-center `}>{usersCount.betDeactiveUser} Bet Suspend</p> */}
      </div>

      <div className="mt-5 ml-5">
        {loading ? (
          <LoadingSpinner size="lg" color="green" thickness="4px" />
        ) : (
          ""
        )}
      </div>
      <div className="flex items-center mt-3 flex-col gap-3  border-red-300">
        {allUserData &&
          !loading &&
          allUserData.length > 0 &&
          allUserData
            // Filter items where role_type is 'affiliate'
            .map((item) => {
              const timePart = item.joined_at.split(" ")[1];
              const seccondPart = item.joined_at.split(" ")[2];
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
                      />
                      <div className="flex flex-col items-start gap-1">
                        <p className="text-xs font-bold">{item?.username}</p>

                        <div className="flex flex-col items-start gap-1">
                          {/* <p className="text-xs font-bold">{item?.username}</p> */}
                          <div className="flex items-center gap-1">
                            <span
                              style={{ backgroundColor: bg }}
                              className={`text-[8px] font-medium px-1 py-[2px] rounded-[4px] text-white `}
                            >
                              {item?.role_type}
                            </span>
                            {item?.is_withdraw_suspend && (
                              <span
                                className={`text-[8px] bg-red-500 font-bold px-1 py-[2px] rounded-[4px] text-white `}
                              >
                                WS
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex min-w-[190px] w-[100%] flex-col gap-1">
                      <p className="text-xs flex  items-center gap-1 font-bold">
                        <BsCalendarDateFill style={{ color: iconColor }} />
                        {t(`Joining`)} {t(`Date`)}
                      </p>
                      <p className="text-xs flex gap-1 font-medium  ">
                        {formatDate(item?.joined_at.split(" ")[0])}
                        <span className="text-[9px]">({time24Hour})</span>
                      </p>
                    </div>
                    <div className="flex flex-col min-w-[140px] w-[100%] gap-1">
                      <p className="text-xs flex items-center gap-1 font-bold">
                        <FaWallet style={{ color: iconColor }} />
                        {t(`Commision`)}
                      </p>
                      <p className="text-xs flex items-center font-semibold">
                        {item?.share_percentage} %
                      </p>
                    </div>

                    <div className="flex flex-col min-w-[150px] w-[100%] gap-1">
                      <p className="text-xs flex items-center gap-1 font-bold">
                        <FaWallet style={{ color: iconColor }} />
                        {t(`Total`)} {t(`Earning`)}
                      </p>
                      <p className="text-xs flex items-center font-semibold">
                        <span className={`w-[70px]  ${plData?.totalAmount > 0
                            ? "text-green-400"
                            : "text-red-400"
                          }`}>
                          0:00
                        </span>

                      </p>
                    </div>





                    {check && (
                      <div className="flex min-w-[100px]   flex-col gap-1">
                        <p className="text-xs flex items-center gap-1 font-bold">
                          <MdPendingActions style={{ color: iconColor }} />
                          {t(`Status`)}
                        </p>
                        <Menu>
                          <MenuButton
                            className={` ${statuses[item._id] === "Block"
                                ? "bg-red-600"
                                : "bg-green-500"
                              } px-2   `}
                            style={{
                              fontSize: "13px",
                              borderRadius: "4px",
                              color: "white",
                            }}
                          >
                            {statuses[item._id] || "Active"}
                          </MenuButton>
                          <MenuList>
                            <MenuItem
                              onClick={() =>
                                handleStatus("is_blocked", item._id, item.user_id)
                              }
                            >
                              {t(`Active`)}
                            </MenuItem>
                            {/* <MenuItem
                        onClick={() => handleStatus("Suspended", item._id)}
                      >
                        Suspended
                      </MenuItem> */}
                            <MenuItem
                              onClick={() =>
                                handleStatus("is_blocked", item._id, item.user_id)
                              }
                            >
                              {t(`Block`)}
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </div>
                    )}
                    {check && (
                      <div className="flex items-center justify-end min-w-[90px] gap-[4px]">
                        <Link

                          to={`/affilate-manage/${item?.admin_id}`}
                          style={{ border: `1px solid ${border}` }}
                          className={`w-[25px] flex items-center justify-center rounded-[6px] h-[25px]`}
                        >
                          <FaRegUser
                            style={{ color: iconColor }}
                            fontSize={"15px"}
                          />
                        </Link>
                        <ChangePassword id={item.user_id} type="user" userName={item?.username} />
                        <DeleteUserAdmin type="admin" name={item.username} id={item.admin_id} onDeleteSuccess={deleteUserHandler} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
      </div>
      <div>
        {allUserData?.length === 0 ? (
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
        {allUserData?.length > 0 && (
          <p style={{ color: iconColor }} className="text-xs font-semibold ">
            {/* {t(`Showing`)} 1 {t(`to`)} {limit} of {usersCount.totalUserCount}{" "} */}
            {/* {t(`entries`)} */}
          </p>
        )}
        {allUserData && allUserData.length > 0 && (
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


export default AffilateAdminManage