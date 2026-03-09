import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
  MdOutlineSearch,
} from "react-icons/md";
import Skeleton from "../Skeleton/Skeleton";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { setLoginForm } from "../../redux/switch-web/action";

const GameCategory = () => {
  const [jackpotGames, setJackpotGames] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMoreGames, setHasMoreGames] = useState(true);
  const { id } = useParams();
  const { bgColor1, secondaryText } = useSelector(
    (state) => state.theme
  );
  const {t}=useTranslation()
  const [searchQuery, setSearchQuery] = useState("");
  const [active, setActive] = useState(0);
  const ProviderCategoryGroup = useSelector((state) => state?.website);
  const users= useSelector((state) => state?.auth);
  const data=users?.user?.data
  const dispatch=useDispatch()
  const providerCategory = ProviderCategoryGroup?.providerGroupName || "";
const navigate=useNavigate()
  useEffect(() => {
    fetchProviders();
  }, [providerCategory]);

  const fetchGames = async (page) => {
    setLoading(true);
    try {
      let url = `${
        import.meta.env.VITE_API_URL
      }/api/game/get-game-by-game-type?status=true&page=${page}&limit=18&site_auth_key=${
        import.meta.env.VITE_API_SITE_AUTH_KEY
      }`;
      const headers = {
        "Content-Type": "application/json",
      };

      if (providerCategory) {
        url += `&category=${providerCategory.toLowerCase()}`;
      }
      if (searchQuery) {
        url += `&search=${searchQuery}`;
      }
      const response = await axios.get(url, { headers });

      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      const newGames = response.data.data;

      if (newGames.length === 0) {
        setHasMoreGames(false);
      }
       else {
        if (page !== 1) {
          setJackpotGames((prevGames) => [...prevGames, ...newGames]);
        } else {
          setJackpotGames(newGames);
        }
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const fetchGamesByProvider = async (id) => {
    setLoading(true);
    try {
      let url = `${
        import.meta.env.VITE_API_URL
      }/api/game/get-game-by-provider/${id}?status=true&page=${page}&limit=30&site_auth_key=${
        import.meta.env.VITE_API_SITE_AUTH_KEY
      }`;

      if (providerCategory) {
        url += `&category=${providerCategory.toLowerCase()}`;
      }

      const headers = {
        "Content-Type": "application/json",
      };
      const response = await axios.get(url, { headers });
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      const newGames = response.data.data;

      if (newGames.length === 0) {
        setHasMoreGames(false);
      } else {
        setJackpotGames((prevGames) => [...prevGames, ...newGames]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const fetchProviders = async () => {
    try {
      const url = `${
        import.meta.env.VITE_API_URL
      }/api/casinoprovider/get-provider?limit=100&status=true&site_auth_key=${
        import.meta.env.VITE_API_SITE_AUTH_KEY
      }`;
      const headers = {
        "Content-Type": "application/json",
      };

      const response = await axios.get(url, { headers });

      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      const providerData = response.data.data;

      const filteredProviders = providerData.filter((provider) =>
        provider.category.some(
          (cat) => cat.toLowerCase() === providerCategory.toLowerCase()
        )
      );

    
      setProviders(filteredProviders);
    } catch (error) {
      console.error("Error fetching provider data:", error);
    }
  };

  useEffect(() => {
    setJackpotGames([]);
    setPage(1); // Reset page to 1 when id or providerCategory changes
    fetchGames(1);
    fetchProviders();
  }, [id, providerCategory]);

  
  useEffect(() => {
    if (page === 1) {
      fetchGames(1); // Fresh fetch for the first page
    } else {
      fetchGames(page); // Fetch more games
    }
  }, [page, searchQuery]);

  const handleShowMore = () => {
    setPage((prevPage) => prevPage + 1); 
  };

  const getFetchGameByProvider = (game) => {
    setActive(game._id);
    setJackpotGames([]);
    setPage(1); // Reset page to 1 when switching providers
    fetchGamesByProvider(game.gpId);
  };

  const getAllCasinoData = () => {
    setActive(0);            // Reset active provider to "All"
    setJackpotGames([]);      // Clear current games
    setPage(1);               // Reset page to 1
    fetchGames(1);            // Fetch games from the first page
  };

  const scrollProviders = (direction) => {
    const container = document.getElementById("provider-container");
    const scrollAmount = direction === "left" ? -200 : 200;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const TabsStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
  };

  const bgGray = "#f0f0f0";

  const handleRedirect = (game_id, gp_id) => {

    if(!data?.token && !data?.usernameToken ){
      dispatch(setLoginForm(true))
      return 
}
else{
 window.open(`/iframe-view/${game_id}/${gp_id}`, '_blank');


}
  };

  return (
    <div className="mt-[150px]">
      <Flex
        style={{ backgroundColor: bgGray }}
        className="game-toolbar-wrapper rounded"
        align="center"
        justify="space-between"
        p="5px 5px 5px 15px"
        h="60px"
        mb="15px"
        mt="10px"
        mx="10px"
        display={{ base: "none", xl: "flex" }}
      >
        <Flex className="tags-wrapper">
          <ul className="tags-list">
            <li
              className={`active font-bold ${active === 0 ? "text-[#ffaa00]" : ""}`}
              onClick={getAllCasinoData}
              style={{ color: secondaryText }}
            >
              {t(`All`)}
            </li>
          </ul>
        </Flex>
        <Flex className="search-wrapper">
          <InputGroup
            className="custom-input-wrapper search-input"
            h="50px"
            w="266px"
          >
            <InputLeftElement
              h="100%"
              pointerEvents="none"
              children={<MdOutlineSearch size={28} />}
            />
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              style={{ backgroundColor: bgColor1 }}
              h="100%"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Flex>
      </Flex>
      <div className=" ">
        <div className="tabs relative">
          {providers?.length > 0 && (
            <div className="flex gap-2 px-3 tab-list ">
              {providers?.length > 13&& (
                <button
                  className=" left-0 z-10 p-2 text-black rounded-full"
                  onClick={() => scrollProviders("left")}
                >
                  <MdOutlineArrowBackIos fontSize={"20px"} />
                </button>
              )}

              <div
                id="provider-container"
                className="flex overflow-x-scroll gap-2 scrollbar-hide"
              >
                <div
                  onClick={getAllCasinoData}
                  className={`tab flex flex-col ${
                    active == 0 ? "border-2 border-[#ffaa00]" : ""
                  }  items-center `}
                  style={{ backgroundColor: bgGray, ...TabsStyle }}
                >
                  <p className="w-[75px] text-center font-bold">{t(`All`)}</p>
                </div>

                {providers.map((provider) => (
                  <div
                    key={provider._id}
                    className={`tab ${
                      active == provider._id ? "border-2 border-[#ffaa00]" : ""
                    } `}
                    style={{ backgroundColor: bgGray, ...TabsStyle }}
                    onClick={() => getFetchGameByProvider(provider)}
                  >
                    <div className="flex flex-col items-center justify-center gap-2 w-[80px] h-[80px]">
                      <img
                        src={provider.image_url}
                        alt={provider.gpName}
                        className="w-[40px] h-10 object-cover rounded-[4px]"
                      />
                      <p className="mt-2 text-sm font-semibold text-center">
                        {provider?.gpName?.slice(0, 10)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {providers?.length > 13 && (
                <button
                  className="p-2 rounded-full text-black"
                  onClick={() => scrollProviders("right")}
                >
                  <MdOutlineArrowForwardIos fontSize={"20px"} />
                </button>
              )}
            </div>
          )}
        </div>
        <div className="grid grid-cols-6 mt-5 px-3 gap-3">
          {jackpotGames.map((game) => (
            <div
              key={game._id}
              onClick={() => handleRedirect(game.gameProviderId, game.gameID)}
              className="relative cursor-pointer group overflow-hidden rounded-[6px] shadow-lg"
            >
              <img
                src={game.gameInfos[0].gameIconUrl}
                alt={game.gameInfos[0].gameName}
                className="w-full h-[140px] transform transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-1 opacity-100 transition-opacity duration-500">
                <h3 className="text-lg font-semibold text-white">
                  {game.gameInfos[0].gameName?.slice(0, 15)}
                </h3>
                <p className="text-sm text-gray-300">{game.provider}</p>
              </div>
            </div>
          ))}
          {loading
            ? Array.from({ length: 18 }).map((_, index) => (
                <Skeleton key={index} height={"140px"} />
              ))
            : ""}
        </div>
        {!loading && hasMoreGames && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleShowMore}
              className="px-6 py-2 text-black font-bold text-lg bg-[#ffaa00] rounded-[8px] transition-transform transform hover:scale-105 focus:outline-none"
            >
              {t(`Show More`)}
            </button>
          </div>
        )}
        {!hasMoreGames && (
          <div className="flex justify-center mt-8">
            <p className="text-gray-500">{t(`No more games available`)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCategory;
