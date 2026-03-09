import { useEffect, useState } from "react";
import "./App.css";
import AllRoute from "./allroute/AllRoute";
import { useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "./component/Sidebar";
import TopNavbar from "./component/TopNavbar";
import Sidebar2 from "./component/RightSidebar";
import { useDispatch, useSelector } from "react-redux";
import Signin from "./pages/Signin";
import useFavicon from "./hooks/hooks";



function App() {
  const [count, setCount] = useState(0);
  const location = useLocation();
  useFavicon();
  const currentPath = location.pathname;
  const { color, primaryBg, secondaryBg, bg, hoverColor, hover, text, font, border } = useSelector(state => state.theme);
  const navigate = useNavigate()
  const getAdminDetails = JSON.parse(localStorage.getItem("adminauth"));
  const sidebarVisible = useSelector(state => state.theme.sidebarVisible);
  const dispatch = useDispatch();
  useEffect(() => {
    // Check if the user is not on the login page before checking the token
    if (currentPath !== "/login") {
      if (!getAdminDetails || !getAdminDetails.token) {
        // Redirect to login page if user is not authenticated
        navigate("/login");
      }

    }
  }, [currentPath, navigate]);




  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      {currentPath === "/login" || currentPath === "/signup" ? (
        <AllRoute />
      ) : (
        <div style={{ backgroundColor: secondaryBg }} className={`flex w-[100%] min-h-[100vh] `}>
          <div className="fixed z-[1200]  top-0">
            <div className="hidden lg:contents">
              <Sidebar

              />
            </div>

          </div>
          <div className="flex flex-col w-[100%] gap-4">
            <div className="w-auto sticky lg:ml-[90px] z-[1100] bg-white top-0">
              {" "}
              <TopNavbar onRefresh={handleRefresh} />
            </div>

            <div className="w-[100%] gap-4 ">
              <div
                className={`${sidebarVisible
                  ? "lg:ml-[370px] w-auto  duration-500 ease-in-out"
                  : "lg:ml-[110px] w-auto px-4 lg:px-0  duration-500 ease-in-out"
                  }  lg:mt-[10px]`}
              >
                <AllRoute key={refreshKey} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
