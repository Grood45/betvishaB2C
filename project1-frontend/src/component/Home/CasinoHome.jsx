import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Center, Flex, Input, InputGroup, InputLeftElement, Tab, TabList, Tabs } from '@chakra-ui/react';
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos, MdOutlineSearch } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import Skeleton from '../../component/Skeleton/Skeleton';
import { setLoginForm } from '../../redux/switch-web/action';
const CasinoHome = ({active}) => {
  const [jackpotGames, setJackpotGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMoreGames, setHasMoreGames] = useState(true);
  const { bgColor1, PrimaryText, whiteText, secondaryText } = useSelector((state) => state.theme);
  const ProviderCategoryGroup = useSelector((state) => state?.website);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate =useNavigate();
  const users= useSelector((state) => state?.auth);
  const data=users?.user?.data
  const dispatch=useDispatch()
  const fetchGames = async (page) => {
    setLoading(true);
    try {
      let url = `${import.meta.env.VITE_API_URL}/api/game/get-all-game?page=${page}&limit=18&site_auth_key=${import.meta.env.VITE_API_SITE_AUTH_KEY}`;
      const headers = {
        'Content-Type': 'application/json',
      };
      if (searchQuery) {
        url += `&search=${searchQuery}`;
      }
      const response = await axios.get(url, { headers });

      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }

      const newGames = response.data.data;

      if (response.data.pagination.totalPages <= page) {
        setHasMoreGames(false);
      }
        setJackpotGames(newGames);
       
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
    }
  };



  useEffect(() => {
    fetchGames(page);
  
  }, [page, searchQuery,active ]);

  const handleRedirect = (gameId, gpId) => {
    if(!data?.token && !data?.usernameToken ){
             dispatch(setLoginForm(true))
             return 
       }
       else{

    
 window.open(`/iframe-view/${gameId}/${gpId}`, '_blank');

  }

  };


 

  const TabsStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
  };

 
  const bgGray = '#f0f0f0';


  return (
    <div className=' hidden xl:contents'>
      <div className=" ">
        <div className="grid grid-cols-6 mt-5 px-3 gap-3">
          
          {loading ?
            (
              Array.from({ length: 18 }).map((_, index) => (
                <Skeleton key={index} height={"140px"} />
              ))
            )
            : jackpotGames.map((game) => (
              <div
                key={game._id}
                onClick={() => handleRedirect(game,game.gameProviderId, game.gameID)}
                className="relative cursor-pointer group overflow-hidden rounded-[6px] shadow-lg"
              >
                <img
                  src={game.gameInfos[0].gameIconUrl}
                  alt={game.gameInfos[0].gameName}
                  className="w-full h-[140px]  transform transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-1 opacity-100 transition-opacity duration-500">
                  <h3 className="text-lg font-semibold text-white">{game.gameInfos[0].gameName?.slice(0, 15)}</h3>
                  <p className="text-sm text-gray-300">{game.provider}</p>
                </div>
              </div>
            ))}
        </div>
    
        {!hasMoreGames && (
          <div className="flex justify-center mt-8">
            <p className="text-gray-500">No more games available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CasinoHome;
