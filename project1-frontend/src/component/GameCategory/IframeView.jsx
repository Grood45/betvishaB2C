import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sendPostRequest } from "../../api/api";
import { useSelector } from "react-redux";
// import { sendPostRequest } from "../../../../project1-admin/src/api/api";

const IframeView = () => {
  const [iframeUrl, setIframeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(true);
  const { gp_id, game_id } = useParams();
  console.log(gp_id,game_id,"asdasfsf")
  const userTokenDetails = useSelector((state) => state?.auth?.user);
  useEffect(() => {
    startLoader();
    handleLoginSeamlessGame(gp_id, game_id, "player");
  }, [gp_id, game_id]);
  
  const handleLoginSeamlessGame = async (gpid, gameid, mode) => {
    try {
      const payload = {
        Portfolio: "SeamlessGame",
        IsWapSports: false,
        Username:userTokenDetails?.user?.username,
        IsGetAll: "false",
        CompanyKey: import.meta.env.VITE_APP_COMPANY_KEY,
        ServerId: import.meta.env.VITE_APP_SERVER_ID,
        site_auth_key: import.meta.env.VITE_API_SITE_AUTH_KEY,
      };
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/casinogame/login-casino?site_auth_key=${import.meta.env.VITE_API_SITE_AUTH_KEY}`,
        payload,
        {
          headers: {
            token: userTokenDetails?.data?.token,
            usernametoken: userTokenDetails?.data?.usernameToken,
          }
        }
      );

      if (response.status !== 200) {
        return;
      }

      const data = response?.data
      let url = `https:${data.data.url}&gpid=${gpid}&gameid=${gameid}`;
      const deviceType = window.innerWidth <= 768 ? "m" : "d";
      url += `&device=${deviceType}`;
      window.open(url, "_blank");
      setIframeUrl(url);
      return;
    } catch (error) {
        console.log(error,"showing error during")
    } finally {
      setLoading1(false);
    }
  };

  const startLoader = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 7000);
  };
  const navigate=useNavigate()

  const handleBackClick = () => {
    navigate("/");

  };

  return (
    <div className="iframe-page  ">
      <div className="iframe-container bg-black " >
        {loading && (
          <div className="w-[100%] flex items-center  h-[100%] justify-center">
          <div class="loaderCircular"></div>

          </div>

        )}
        {/* <div className="cross" onClick={handleBackClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="white"
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        </div> */}
        <iframe
        
          className="iframe"
          src={iframeUrl}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default IframeView;
