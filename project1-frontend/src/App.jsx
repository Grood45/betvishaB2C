import "./App.css";
import Footer from "./component/Footer";
import MobileFooter from "./component/MobileFooter";
import Header from "./component/Header";
import AllRoute from "./allroute/AllRoute";

import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";
import { getSingleUser } from "./APIServices/APIServices";
import { logout, singleUserDetails } from "./redux/auth-redux/actions";
import useFavicon from "./hooks/hooks";
import axios from "axios";
import support from './assets/supportW.png';
import { setCouponCode } from "./redux/switch-web/action";
import loaderGif from './assets/loader.gif';
import TawkToWidget from "./TawkChat";

function App() {
  const { i18n } = useTranslation();
  console.log("DEBUG: App.jsx rendering");
  useFavicon();
  const userData = useSelector((state) => state?.auth);
  const data = userData?.user?.data;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const referCode = queryParams.get('refer_code');
  const settings = useSelector((state) => state?.auth?.settings);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loader visible
  const toast = useToast();
  const dispatch = useDispatch();

  const fetchUserDetails = async () => {
    try {
      const response = await getSingleUser(
        data?.token,
        data?.usernameToken,
        import.meta.env.VITE_API_SITE_AUTH_KEY
      );
      dispatch(singleUserDetails(response?.data));
      if (response?.data?.is_blocked) {
        dispatch(logout());
      }
    } catch (error) {
      console.error("Error fetching user details:", error.message);
    }
  };

  // Fetch user details periodically
  useEffect(() => {
    if (data) {
      fetchUserDetails();

      const intervalId = setInterval(() => {
        fetchUserDetails();
      }, 7000);

      return () => clearInterval(intervalId);
    }
  }, [data]);

  // Handle logout logic
  const handleLogout = async () => {
    try {
      // Fetch active sport providers to withdraw from each
      const providersResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/sport/active-providers`);
      const activeProviders = providersResponse?.data?.data || [];

      // Call Sports Logout for each active provider
      for (const provider of activeProviders) {
        try {
          await axios.post(
            `${import.meta.env.VITE_API_URL}/api/sport/withdraw-and-logout`,
            { providerName: provider.provider_name },
            {
              headers: {
                token: data?.token,
                usernametoken: data?.usernameToken
              }
            }
          );
        } catch (err) {
          console.error(`Error withdrawing from ${provider.provider_name}:`, err);
        }
      }

      // Call User Logout (New - For Immediate Live Count Update)
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/user-logout`,
        { user_id: data?.user_id, username: data?.username },
        {
          headers: {
            token: data?.token,
            usernametoken: data?.usernameToken
          }
        }
      );

      localStorage.removeItem('redirected');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('redirected')) {
      handleLogout();
    }
  }, []);

  // Set coupon code logic
  useEffect(() => {
    if (referCode && !data?.token && !data?.usernameToken) {
      dispatch(setCouponCode(referCode));
    } else {
      dispatch(setCouponCode(''));
    }
  }, [referCode]);

  // Show loader for 5 seconds on every page load
  useEffect(() => {
    const loaderTimeout = setTimeout(() => {
      setLoading(false); // Hide loader after 5 seconds
    }, 3000);

    return () => clearTimeout(loaderTimeout); // Cleanup timeout if component unmounts
  }, []); // Runs only once on initial render

  return (
    <div>
      {loading ? (
        // Show loader screen
        <div className="flex justify-center items-center h-screen">
          <img src={loaderGif} alt="Loading..." className="w-[350px]" />
        </div>
      ) : (
        // Render the main app content after loader
        <>
          {!(location.pathname === "/payment" || location.pathname.includes("/iframe-view")) && (
            <Header />
          )}

          <AllRoute />

          {!(location.pathname === "/payment" || location.pathname.includes("/iframe-view")) && (
            <Footer />
          )}

          {location.pathname !== "/payment" && <MobileFooter />}

          <div className="fixed right-4 bottom-[80px]">
            <a href={settings?.whatsapp} target="_blank" rel="noopener noreferrer">
              <img src={support} alt="support" className="w-[90px]" />
            </a>
          </div>
        </>
      )}
      <div className="mb-[100px] border">
        <TawkToWidget />
      </div>
    </div>
  );
}

export default App;
