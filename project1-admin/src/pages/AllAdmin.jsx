import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosPersonAdd } from "react-icons/io";
import { Avatar, AvatarBadge, AvatarGroup, Badge, useToast } from "@chakra-ui/react";
import { FaRegCreditCard } from "react-icons/fa6";
import { BsCalendarDateFill } from "react-icons/bs";
import { FaWallet } from "react-icons/fa6";
import { HiCurrencyDollar } from "react-icons/hi2";
import { MdOutlineAccountBalance } from "react-icons/md";
import { GiWallet } from "react-icons/gi";
import { VscGraphLine } from "react-icons/vsc";
import { Switch } from "@chakra-ui/react";
import { FaUserCheck, FaUsers } from "react-icons/fa";
import { IoSettings, IoWallet } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { GiCard3Diamonds } from "react-icons/gi";
import { MdPendingActions } from "react-icons/md";
import AddNewUserAdmin from "../Modals/AddNewUserAdmin";
import ChangePassword from "../Modals/ChangePassword";
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
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchGetRequest, sendPatchRequest } from "../api/api";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import DeleteUserAdmin from "../Modals/DeleteUserAdmin";
import nodatafound from "../assets/emptydata.png";
import { useTranslation } from "react-i18next";
import { checkPermission, convertToUniversalTime, formatDate } from "../../utils/utils";

const AllAdmin = () => {
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

  const [allAdminData, setAllAdminData] = useState();
  const [loading, setLoading] = useState(false);
  const [adminCount, setAdminCount] = useState({
    adminCount: 0,
    agentCount: 0,
    ownerAdminCount: 0,
    seniorsuperCount: 0,
    subadminCount: 0,
    superagentCount: 0,
    totalAdminCount: 0,
  });
  const { t, i18n } = useTranslation();

  const [adminDetails, setAdminDetails] = useState({
    activeAdminCount: 0,
    betActiveAdminCount: 0,
    blockAdminCount: 0,
  });
  const [adminCategory, setAdminCategory] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const toast = useToast();
  const [pagination, setPagination] = useState({});
  const totalPages = pagination.totalPages;
  const [statuses, setStatuses] = useState({});
  const [status, setStatus] = useState("");
  const [limit, setLimit] = useState("20");
  const user = useSelector((state) => state.authReducer);
  const adminLayer = user.adminLayer;
  const { selectedWebsite, siteDetails } = useSelector(
    (state) => state.websiteReducer
  );
  let filteredData = siteDetails.filter((item) => item.selected === true);


  const adminData = user.user || {};
  const isOwnerAdmin = adminData?.role_type === 'owneradmin';

  const permissionDetails = user?.user?.permissions


  let hasPermission = checkPermission(permissionDetails, "adminManage")
  let check = !isOwnerAdmin ? hasPermission : true


  const getAllAdmin = async () => {
    setLoading(true);
    let url = `${import.meta.env.VITE_API_URL
      }/api/admin/get-all-admin?page=${currentPage}&limit=${limit}&status=${status}`;

    if (search) {
      url += `&search=${search}`;
    }
    if (adminCategory) {
      url += `&category=${adminCategory}`;
    }
    try {
      let response = await fetchGetRequest(url);
      const data = response.data;
      const receivedData = response.data;
      setAllAdminData(receivedData);
      setAdminCount(response.adminCount);
      setAdminDetails(response.adminDetailsCount);
      setPagination(response.pagination);

      setLoading(false);
    } catch (error) {
      toast({
        description: `${error?.data?.message || error?.response?.data?.message}`,
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
  }, [currentPage, search, adminCategory, status, limit]);

  useEffect(() => {
    let result = {};
    let data = allAdminData?.map((ele) => {
      result[ele._id] = ele.is_blocked ? "Block" : "Active";
    });
    setStatuses(result);
  }, [allAdminData]);

  const handleStatus = async (value, itemId, adminId) => {
    let url = `${import.meta.env.VITE_API_URL
      }/api/admin/toggle-admin-status/${adminId}`;

    try {
      let response = await sendPatchRequest(url, { name: value });
      const data = response.data;

      setLoading(false);
      setStatuses((prevStatuses) => ({
        ...prevStatuses,
        [itemId]: data.is_active ? "Block" : "Active",
      }));
      getAllAdmin();

    } catch (error) {
      toast({
        description: `${error?.data?.message || error?.response?.data?.message}`,
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
    getAllAdmin();
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
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)


              }}
            />
            <span
              style={{ backgroundColor: bg }}
              className={`p-[6px] border rounded-r-[8px] cursor-pointer`}
            >
              <IoSearchOutline fontSize={"22px"} color="white" />
            </span>
          </div>
          <select
            onChange={(e) => {
              setAdminCategory(e.target.value)
              setCurrentPage(1)
            }}

            style={{ border: `1px solid ${border}`, backgroundColor: primaryBg }}
            className={` p-[8px]  w-[100%] rounded-[6px] text-xs md:text-sm font-semibold border outline-none`}>
            <option value="">{t(`Select Layer`)} </option>
            {adminLayer?.slice(0, -1).map((ele) => (
              <option value={ele}>{t(ele)}</option>
            ))}</select>

          <select
            onChange={(e) => {
              setStatus(e.target.value)
              setCurrentPage(1)

            }}
            value={status}
            style={{
              border: `1px solid ${border}`,
              backgroundColor: primaryBg,
            }}
            className={` p-[8px]   w-[100%] rounded-[6px] text-xs md:text-sm font-semibold border outline-none `}
          >
            <option>
              {" "}
              <IoSearchOutline fontSize={"22px"} color="black" />
              {t(`Select Status`)}
            </option>
            <option value="is_active">{t(`Active`)}</option>
            <option value="is_blocked">{t(`Block`)}</option>
          </select>
        </div>
        {check && <AddNewUserAdmin setAllAdminData={setAllAdminData} />}
      </div>

      <div className="flex justify-between flex-col gap-4 sm:flex-row  mt-6  pr-5 sm:items-center">
        <p
          style={{ color: iconColor }}
          className={`font-bold mt-6  w-[100%]    flex items-center gap-2 rounded-[6px]  text-lg`}
        >
          <FaUserCheck fontSize={"30px"} style={{ color: iconColor }} />
          {t(`All Admin`)}{" "}
          <span className={`text-green-600`}>
            ( {adminCount?.totalAdminCount})
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
      <div className="flex justify-between">
        <p
          onClick={() => setStatus("is_active")}
          className={` p-2 text-sm cursor-pointer   px-4  mt-3 text-white  font-bold bg-green-400 text-center  w-[100%] `}
        >
          {adminDetails?.activeAdminCount} {t(`Active`)}
        </p>
        <p
          onClick={() => setStatus("is_blocked")}
          className={` p-2 text-sm  cursor-pointer    px-4  mt-3 text-white  font-bold bg-red-400  w-[100%] text-center`}
        >
          {adminDetails?.blockAdminCount} {t(`Block`)}
        </p>
        {/* <p onClick={()=>setAdminCategory("bet_active")} className={` p-2 text-sm  cursor-pointer    px-4  mt-3 text-white  font-bold bg-yellow-400  w-[100%]  text-center `}>{usersCount.betDeactiveUser} Bet Suspend</p> */}
      </div>

      <div className="mt-5 ml-5">
        {loading ? (
          <LoadingSpinner size="lg" color="green" thickness="4px" />
        ) : (
          ""
        )}
      </div>
      <div className="flex items-center   mt-3 flex-col gap-3">
        {allAdminData &&
          !loading &&
          allAdminData.length > 0 &&
          allAdminData?.map((item) => {
            const timePart = item.joined_at.split(' ')[1];
            const seccondPart = item.joined_at.split(' ')[2]
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
                      <span className="text-[10px] font-bold">
                        ({time24Hour})
                      </span>
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
                      {item?.amount?.toFixed(2)} {item?.currency}
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
                      <FaWallet style={{ color: iconColor }} />
                      {t(`Company`)} {t(`Site`)}
                    </p>
                    <p className="text-xs flex items-center justify-start rounded-sm font-semibold ">
                      {" "}

                      <Badge color={iconColor} className="text-xs   rounded-sm font-semibold ">
                        {" "}
                        {filteredData[0]?.site_name}
                      </Badge>
                    </p>
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
                  <div className="min-w-[50px]">
                    <p
                      className={`h-[15px] w-[15px] animate-pulse rounded-[50%] ${item.status ? "bg-green-700" : "bg-red-700"
                        } `}
                    ></p>
                  </div>
                  {/* <div className="flex min-w-[100px]  flex-col gap-1">
                    <p className="text-xs flex items-center gap-1 font-bold">
                      <GiCard3Diamonds style={{ color: iconColor }} />
                      Casino
                    </p>
                    <Switch size="md" />
                  </div> */}
                  {check && <div className="flex min-w-[100px]   flex-col gap-1">
                    <p className="text-xs flex items-center gap-1 font-bold">
                      <MdPendingActions style={{ color: iconColor }} />
                      {t(`Status`)}
                    </p>
                    <Menu>
                      <MenuButton
                        className={` ${item?.is_active ? "bg-green-600" : "bg-red-500"
                          } px-2   `}
                        style={{
                          fontSize: "13px",
                          borderRadius: "4px",
                          color: "white",
                        }}
                      >
                        {/* {statuses[item._id] || "Active"} */}
                        {item?.is_active ? "Active" : "Block"}
                      </MenuButton>
                      <MenuList>
                        <MenuItem
                          onClick={() =>
                            handleStatus("is_active", item._id, item.admin_id)
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
                            handleStatus("is_active", item._id, item.admin_id)
                          }
                        >
                          {t(`Block`)}
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </div>}
                  {check && <div className="flex items-center justify-end min-w-[90px] gap-[4px]">
                    <Link
                      to={`/adminmanage/${item.admin_id}`}
                      style={{ border: `1px solid ${border}` }}
                      className={`w-[25px] flex items-center justify-center rounded-[6px] h-[25px]`}
                    >
                      <FaRegUser
                        style={{ color: iconColor }}
                        fontSize={"15px"}
                      />
                    </Link>
                    <ChangePassword id={item.admin_id} type="admin" userName={item?.username} />
                    <DeleteUserAdmin
                      type="admin"
                      name={item.username}
                      id={item.admin_id}
                      onDeleteSuccess={deleteUserHandler}
                    />
                  </div>}
                </div>
              </div>
            );
          })}
      </div>
      <div>
        {allAdminData?.length === 0 ? (
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
        {allAdminData?.length > 0 && (
          <p style={{ color: iconColor }} className="text-xs font-semibold ">
            {t(`Showing`)} 1 {t(`to`)} {limit} {t(`of`)} {pagination?.totalAdmins} {t(`Entries`)}
          </p>
        )}
        {allAdminData && allAdminData.length > 0 && (
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

export default AllAdmin;
