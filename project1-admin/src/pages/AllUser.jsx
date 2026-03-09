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
import {
  BsCalendarDateFill,
  BsEyeFill,
  BsEyeSlashFill,
  BsGridFill,
  BsListUl,
} from "react-icons/bs";
import { FaWallet } from "react-icons/fa6";
import { HiCurrencyDollar } from "react-icons/hi2";
import { MdDelete, MdOutlineAccountBalance } from "react-icons/md";
import { GiWallet } from "react-icons/gi";
import { VscGraphLine } from "react-icons/vsc";
import { PiEyeClosedFill } from "react-icons/pi";
import { Switch } from "@chakra-ui/react";
import { FaUsers } from "react-icons/fa";
import { IoSettings, IoWallet } from "react-icons/io5";
import { FaRegUser, FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import AddBalance from "../component/usermanageComponent/AddBalance";
import SubtractBalance from "../component/usermanageComponent/SubtractBalance";
import { GiCard3Diamonds } from "react-icons/gi";
import { MdPendingActions } from "react-icons/md";
import {
  RiUserLine,
  RiLock2Line,
  RiDeleteBinLine,
  RiShieldUserLine,
  RiEditBoxLine,
  RiKey2Line,
  RiShieldCheckLine,
} from "react-icons/ri";
import AddNewUser from "../Modals/AddNewUser";
import ChangePassword from "../Modals/ChangePassword";
import ExportModal from "../component/ExportModal";

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
const AllUser = () => {
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
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
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
  const [limit, setLimit] = useState("20");
  const [viewMode, setViewMode] = useState("card"); // 'card' or 'list'

  const getAllUser = async () => {
    setLoading(true);
    let url = `${import.meta.env.VITE_API_URL
      }/api/admin/get-all-user?page=${currentPage}&limit=${limit}`;

    if (search) {
      url += `&search=${search}`;
    }
    if (userCategory && userCategory !== "live_user") {
      url += `&category=${userCategory}`;
    }

    try {
      let response = await fetchGetRequest(url);
      let receivedData = response.data;

      // Client-side filtering for "Live User" if selected
      if (userCategory === "live_user") {
        receivedData = receivedData.filter((item) =>
          isUserOnline(item?.updated_at)
        );
      }

      setAllUserData(receivedData);
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
            <option value="">{t(`Select Status`)}</option>
            <option value="is_active">{t(`Active`)}</option>
            <option value="is_blocked">{t(`Block`)}</option>
            <option value="bet_active">
              {t(`Bet`)} {t(`Suspend`)}
            </option>
            <option value="live_user">
              {t(`Live`)} {t(`User`)}
            </option>
          </select>
          <button
            onClick={() => setIsExportModalOpen(true)}
            style={{ backgroundColor: bg }}
            className={`flex items-center p-[2px] gap-2 rounded-[6px] text-xs md:text-sm text-white font-bold w-[70px] hover:border-green-600 hover:border`}
          >
            <img src={pdfIcon} alt="" />
          </button>
          <button
            onClick={() => setIsExportModalOpen(true)}
            style={{ backgroundColor: bg }}
            className={`flex items-center p-[2px] gap-2 rounded-[6px] text-xs md:text-sm text-white font-bold w-[70px] hover:border-green-600 hover:border`}
          >
            <img src={excelIcon} alt="" />
          </button>
          {/* Export Modal */}
          <ExportModal
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            data={allUserData || []}
            title="All User List"
          />


          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border ml-2" style={{ borderColor: border }}>
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 rounded-md transition-all ${viewMode === 'card' ? 'shadow-sm' : 'text-gray-400 hover:bg-gray-50'}`}
              style={{ backgroundColor: viewMode === 'card' ? iconColor : 'transparent', color: viewMode === 'card' ? 'white' : undefined }}
            >
              <BsGridFill fontSize="14px" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'shadow-sm' : 'text-gray-400 hover:bg-gray-50'}`}
              style={{ backgroundColor: viewMode === 'list' ? iconColor : 'transparent', color: viewMode === 'list' ? 'white' : undefined }}
            >
              <BsListUl fontSize="16px" />
            </button>
          </div>
        </div>
        {check && (
          <AddNewUser
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
          {t(`All`)} {t(`User`)} {t(`Manage`)}
          <span className={`text-green-600`}>
            ({usersCount.totalUserCount})
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

      <div className="flex justify-between gap-4 overflow-x-auto pb-2">
        <p
          onClick={() => setUserCategory("is_active")}
          className={`p-2 text-sm cursor-pointer px-4 mt-3 text-white font-bold bg-green-400 text-center w-[100%] rounded-md hover:bg-green-500 transition-all shadow-sm`}
        >
          {usersCount.activeUserCount} {t(`Active`)}
        </p>
        <p
          onClick={() => setUserCategory("is_blocked")}
          className={`p-2 text-sm cursor-pointer px-4 mt-3 text-white font-bold bg-red-400 w-[100%] text-center rounded-md hover:bg-red-500 transition-all shadow-sm`}
        >
          {usersCount.blockUserCount} {t(`Block`)}
        </p>
        <p
          onClick={() => setUserCategory("live_user")}
          className={`p-2 text-sm cursor-pointer px-4 mt-3 text-white font-bold ${userCategory === "live_user"
            ? "bg-orange-600 ring-2 ring-offset-2 ring-orange-400"
            : "bg-orange-400"
            } w-[100%] text-center rounded-md hover:bg-orange-500 transition-all shadow-sm`}
        >
          Live User
        </p>
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
          allUserData.length > 0 && (
            viewMode === 'list' ? (
              // LIST VIEW
              allUserData?.map((item) => {
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
                      <div className="flex items-center min-w-[150px] gap-1">
                        <Avatar
                          name={item?.username}
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
                                {item.role_type}
                              </span>
                              {/* New Badge Logic */}
                              {item.creation_mode === 'manual' ? (
                                <span className="text-[8px] font-medium px-1 py-[2px] rounded-[4px] text-white bg-purple-500">
                                  MANUAL
                                </span>
                              ) : (
                                <span className="text-[8px] font-medium px-1 py-[2px] rounded-[4px] text-white bg-blue-500">
                                  AUTO
                                </span>
                              )}

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
                          {t(`Balance`)}
                        </p>
                        <p className="text-xs flex items-center font-semibold">
                          {item?.amount?.toFixed(2)} {item?.currency}
                        </p>
                      </div>
                      <div className="flex min-w-[140px] items-start w-[100%] flex-col gap-1">
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
                      <div className="flex flex-col min-w-[150px] gap-1">
                        <p className="text-xs flex items-center gap-1 font-bold">
                          <FaWallet style={{ color: iconColor }} />
                          {t(`Exposure`)}
                        </p>
                        <p className="text-xs flex items-center font-semibold">
                          <span className={`w-[70px]  ${plData?.totalAmount > 0
                            ? "text-green-400"
                            : "text-red-400"
                            }`}>
                            {" "}
                            {(individualEl == item?._id) && exposureShow &&
                              0
                            }
                          </span>

                          {exposureLoading && (individualEl == item?._id)
                            ? <Spinner /> : <span
                              onClick={() => handleExpsoureShow(item)}
                              className=""
                            >
                              {exposureShow && individualEl == item?._id ? (
                                <BsEyeFill
                                  style={{
                                    fontSize: "20px",
                                    cursor: "pointer",
                                    color: iconColor,
                                  }}
                                />
                              ) : (
                                <BsEyeSlashFill
                                  style={{
                                    fontSize: "20px",
                                    cursor: "pointer",
                                    color: iconColor,
                                  }}
                                />
                              )}{" "}
                            </span>}
                        </p>
                      </div>
                      <div className="flex flex-col min-w-[150px] gap-1">
                        <p className="text-xs flex items-center gap-1 font-bold">
                          <FaWallet style={{ color: iconColor }} />
                          {t(`Exposure Limit`)}
                        </p>
                        <p className="text-xs flex items-center font-semibold">
                          {item?.exposure_limit >= 0
                            ? "100000"
                            : item?.exposure_limit?.toFixed(2)}{" "}
                          {item?.currency}
                        </p>
                      </div>

                      <div className="flex min-w-[150px] w-[100%] flex-col gap-1">
                        <p className="text-xs flex items-center gap-1 font-bold">
                          <VscGraphLine style={{ color: iconColor }} />
                          {t(`Profit`)} & {t(`Loss`)}
                        </p>
                        <p
                          className={`text-xs flex items-center justify-start ${plData?.totalAmount > 0
                            ? "text-green-400"
                            : "text-red-400"
                            }  rounded-sm font-bold `}
                        >
                          <span className="w-[70px] ">
                            {" "}
                            {((individualPl == item?._id) && plShow) &&
                              plData?.totalAmount?.toFixed(2)}
                          </span>
                          {loading1 && individualPl == item?._id ? (
                            <Spinner />
                          ) : (
                            <span onClick={() => handlePlShow(item)} className="">
                              {plShow && individualPl == item?._id ? (
                                <BsEyeFill
                                  style={{
                                    fontSize: "20px",
                                    cursor: "pointer",
                                    color: iconColor,
                                  }}
                                />
                              ) : (
                                <BsEyeSlashFill
                                  style={{
                                    fontSize: "20px",
                                    cursor: "pointer",
                                    color: iconColor,
                                  }}
                                />
                              )}{" "}
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="flex flex-col min-w-[100px] w-[100%] gap-1">
                        <p className="text-xs flex items-center gap-1 font-bold">
                          <RiUserLine style={{ color: iconColor }} />
                          {t(`Live`)}
                        </p>
                        <div className={`flex items-center gap-1 w-fit px-2 py-0.5 rounded-full border ${isUserOnline(item?.updated_at) ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${isUserOnline(item?.updated_at) ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}></span>
                          <span className={`text-[9px] font-bold ${isUserOnline(item?.updated_at) ? "text-green-700" : "text-gray-500"}`}>
                            {isUserOnline(item?.updated_at) ? "ONLINE" : "OFFLINE"}
                          </span>
                        </div>
                      </div>

                      {/* <div className="flex min-w-[100px]  flex-col gap-1">
                        <p className="text-xs flex items-center gap-1 font-bold">
                          <GiCard3Diamonds style={{ color: iconColor }} />
                          Casino
                        </p>
                        <Switch size="md" />
                      </div> */}
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
                        <div className="flex items-center justify-end min-w-[170px] gap-[4px] ml-auto shrink-0">
                          <Link
                            to={`/usermanage/${item.username}`}
                            style={{ border: `1px solid ${border}` }}
                            className={`w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-[6px] h-7 hover:bg-gray-100`}
                          >
                            <FaRegUser
                              style={{ color: iconColor }}
                              fontSize={"14px"}
                            />
                          </Link>

                          <div className="w-7 h-7 flex-shrink-0">
                            <AddBalance
                              userData={item}
                              getData={getAllUser}
                              title="user"
                              customButton={
                                <div style={{ border: `1px solid ${border}` }} className="w-7 h-7 flex items-center justify-center rounded-[6px] cursor-pointer hover:bg-green-50 transition-colors">
                                  <FaPlusCircle className="text-green-600" fontSize={"14px"} />
                                </div>
                              }
                            />
                          </div>

                          <div className="w-7 h-7 flex-shrink-0">
                            <SubtractBalance
                              userData={item}
                              getData={getAllUser}
                              title="user"
                              customButton={
                                <div style={{ border: `1px solid ${border}` }} className="w-7 h-7 flex items-center justify-center rounded-[6px] cursor-pointer hover:bg-red-50 transition-colors">
                                  <FaMinusCircle className="text-red-600" fontSize={"14px"} />
                                </div>
                              }
                            />
                          </div>

                          <ChangePassword
                            id={item.user_id}
                            type="user"
                            userName={item?.username}
                            icon={<RiKey2Line fontSize={"14px"} />}
                            customStyle={{ border: `1px solid ${border}`, flexShrink: 0, width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor }}
                          />
                          <DeleteUserAdmin
                            type="user"
                            name={item.username}
                            id={item.user_id}
                            onDeleteSuccess={deleteUserHandler}
                            icon={<RiDeleteBinLine fontSize={"14px"} className="text-red-500" />}
                            customStyle={{ border: `1px solid ${border}`, flexShrink: 0, width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              // CARD VIEW
              // CARD VIEW (New Premium Design)
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full px-2">
                {allUserData?.map((item) => {
                  const time24Hour = convertToUniversalTime(`${item.joined_at.split(" ")[1]} ${item.joined_at.split(" ")[2]}`);
                  return (
                    <div
                      key={item._id}
                      className="rounded-xl overflow-hidden bg-white shadow-sm hover:translate-y-[-4px] transition-all duration-300 border border-gray-100 group relative"
                    >
                      {/* Badge Logic for Card View */}
                      <div className="absolute top-0 right-0 z-20">
                        {item.creation_mode === 'manual' ? (
                          <div className="bg-purple-600 text-white text-[9px] font-bold px-3 py-1 rounded-bl-lg shadow-md">
                            MANUAL
                          </div>
                        ) : (
                          <div className="bg-blue-500 text-white text-[9px] font-bold px-3 py-1 rounded-bl-lg shadow-md">
                            AUTO
                          </div>
                        )}
                      </div>

                      {/* Card Header - Gradient */}
                      <div style={{ background: `linear-gradient(135deg, ${iconColor}, ${secondaryBg})` }} className="p-4 flex justify-between items-start relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                        <div className="flex items-center gap-3 relative z-10">
                          <Avatar size="sm" name={item?.username} border="2px solid white" />
                          <div className="text-white">
                            <h3 className="font-bold text-sm leading-tight">{item?.username}</h3>
                            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium">{item.role_type}</span>
                          </div>
                        </div>
                        <div className={`relative z-10 flex flex-col items-end gap-1 mt-6`}>
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm`}>
                            <span className={`h-2 w-2 rounded-full ${isUserOnline(item?.updated_at) ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}></span>
                            <span className={`text-[9px] font-bold ${isUserOnline(item?.updated_at) ? "text-green-700" : "text-gray-500"}`}>
                              {isUserOnline(item?.updated_at) ? "ONLINE" : "OFFLINE"}
                            </span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statuses[item._id] === "Block" ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}>
                            {statuses[item._id] === "Block" ? "BLOCK" : "ACTIVE"}
                          </span>
                        </div>
                      </div>

                      {/* Card Body - Stats */}
                      <div className="p-4">
                        <div className="mb-4 text-center">
                          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Current Balance</p>
                          <h2 style={{ color: iconColor }} className="text-2xl font-bold font-mono mt-1">
                            {item?.amount?.toFixed(2)} <span className="text-sm text-gray-400">{item?.currency}</span>
                          </h2>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                          <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 text-center">
                            <p className="text-gray-400 font-semibold mb-1">Exposure</p>
                            <span className="font-bold text-gray-700">
                              {((individualEl == item?._id) && exposureShow) ? 0 :
                                <span onClick={() => handleExpsoureShow(item)} className="cursor-pointer text-blue-500 underline underline-offset-2">View</span>
                              }
                            </span>
                          </div>
                          <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 text-center">
                            <p className="text-gray-400 font-semibold mb-1">P/L</p>
                            <span className={`${plData?.totalAmount > 0 ? "text-green-500" : "text-red-500"} font-bold`}>
                              {((individualPl == item?._id) && plShow) ? plData?.totalAmount?.toFixed(2) :
                                <span onClick={() => handlePlShow(item)} className="cursor-pointer text-blue-500 underline underline-offset-2">View</span>
                              }
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[10px] text-gray-400 border-t pt-3 mb-3">
                          <span className="font-bold text-gray-600">Joined: <span className="text-gray-800">{item?.joined_at.split(" ")[0]}</span></span>
                          <span className="font-bold text-gray-600">By: <span className="text-gray-800">{item?.parent_admin_username}</span></span>
                        </div>

                        {/* Card Footer - Actions */}
                        {check && (
                          <div className="grid grid-cols-6 gap-0 px-1 py-3 border-t border-gray-100 mt-2 items-start justify-items-center">
                            {/* 1. UPDATE */}
                            <Link to={`/usermanage/${item.username}`} className="flex flex-col items-center gap-1 cursor-pointer group w-full">
                              <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                <RiEditBoxLine size={16} />
                              </div>
                              <span className="text-[8px] font-black text-gray-400 group-hover:text-blue-600 tracking-tighter whitespace-nowrap">UPDATE</span>
                            </Link>

                            {/* 2. ACCESS */}
                            <div className="flex flex-col items-center gap-1 cursor-pointer group w-full">
                              <ChangePassword
                                id={item.user_id}
                                type="user"
                                userName={item?.username}
                                icon={
                                  <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                                    <RiKey2Line size={16} />
                                  </div>
                                }
                              />
                              <span className="text-[8px] font-black text-gray-400 group-hover:text-orange-600 tracking-tighter whitespace-nowrap">ACCESS</span>
                            </div>

                            {/* 3. DEPOSIT */}
                            <div className="flex flex-col items-center gap-1 cursor-pointer group w-full">
                              <AddBalance
                                userData={item}
                                getData={getAllUser}
                                title="user"
                                customButton={
                                  <div className="flex flex-col items-center gap-1 w-full h-full">
                                    <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-green-50 group-hover:text-green-600 transition-colors flex justify-center w-full">
                                      <FaPlusCircle size={16} />
                                    </div>
                                    <span className="text-[8px] font-black text-gray-400 group-hover:text-green-600 tracking-tighter text-center block w-full whitespace-nowrap">DEPOSIT</span>
                                  </div>
                                }
                              />
                            </div>

                            {/* 4. WITHDRAW */}
                            <div className="flex flex-col items-center gap-1 cursor-pointer group w-full">
                              <SubtractBalance
                                userData={item}
                                getData={getAllUser}
                                title="user"
                                customButton={
                                  <div className="flex flex-col items-center gap-1 w-full h-full">
                                    <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-red-50 group-hover:text-red-600 transition-colors flex justify-center w-full">
                                      <FaMinusCircle size={16} />
                                    </div>
                                    <span className="text-[8px] font-black text-gray-400 group-hover:text-red-600 tracking-tighter text-center block w-full whitespace-nowrap">WITHDRAW</span>
                                  </div>
                                }
                              />
                            </div>

                            {/* 5. DELETE */}
                            <div className="flex flex-col items-center gap-1 cursor-pointer group w-full">
                              <DeleteUserAdmin
                                type="user"
                                name={item.username}
                                id={item.user_id}
                                onDeleteSuccess={deleteUserHandler}
                                icon={
                                  <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                                    <RiDeleteBinLine size={16} />
                                  </div>
                                }
                              />
                              <span className="text-[8px] font-black text-gray-400 group-hover:text-red-600 tracking-tighter whitespace-nowrap">DELETE</span>
                            </div>

                            {/* 6. STATUS */}
                            <Menu>
                              <MenuButton
                                as="div"
                                className="flex flex-col items-center gap-1 cursor-pointer group w-full"
                              >
                                <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                                  <RiShieldCheckLine size={16} />
                                </div>
                                <span className="text-[8px] font-black text-gray-400 group-hover:text-teal-600 tracking-tighter whitespace-nowrap">STATUS</span>
                              </MenuButton>
                              <MenuList>
                                <MenuItem onClick={() => handleStatus("is_blocked", item._id, item.user_id)}>{t(`Active`)}</MenuItem>
                                <MenuItem onClick={() => handleStatus("is_blocked", item._id, item.user_id)}>{t(`Block`)}</MenuItem>
                              </MenuList>
                            </Menu>
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
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
        <div className="flex justify-between items-center mt-4 w-full px-4 py-4 bg-gray-100/80 backdrop-blur-sm border-t border-gray-200">
          {allUserData?.length > 0 && (
            <p className="text-sm font-bold text-gray-800">
              {t(`Showing`)} 1 {t(`to`)} {allUserData.length} of {usersCount.totalUserCount}{" "}
              {t(`entries`)}
            </p>
          )}
          {allUserData && allUserData.length > 0 && (
            <div className="flex gap-4 items-center">
              <button
                type="button"
                className="h-9 w-9 flex items-center justify-center bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md group"
                onClick={() => handlePrevPage()}
                disabled={currentPage == 1}
              >
                <span className="text-lg font-bold group-hover:-translate-x-0.5 transition-transform duration-200">{"<"}</span>
              </button>

              <div className="text-sm font-bold text-gray-800 flex gap-2 items-center bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                <span className="text-gray-500 font-medium">{t(`Page`)}</span>
                <span className="text-black">{currentPage}</span>
                <span className="text-gray-400 font-medium">{t(`of`)}</span>
                <span className="text-black">{pagination?.totalPages}</span>
              </div>

              <button
                onClick={() => handleNextPage()}
                type="button"
                className="h-9 w-9 flex items-center justify-center bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md group"
                disabled={currentPage == pagination?.totalPages}
              >
                <span className="text-lg font-bold group-hover:translate-x-0.5 transition-transform duration-200">{">"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllUser;


