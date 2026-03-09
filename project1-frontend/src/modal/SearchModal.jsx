import React, { useEffect, useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Input, Box, Button } from '@chakra-ui/react';
import { MdArrowBack } from 'react-icons/md';
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import Skeleton from '../component/Skeleton/Skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { setLoginForm } from '../redux/switch-web/action';
import { useNavigate } from 'react-router-dom';
const SearchModal = ({ isOpen, onClose,size }) => {
  const [search, setSearch] = useState('');
const [loading,setLoading]=useState(false)
  const [game,setGames]=useState({})
  const [page,setPage]=useState(false)
  const users= useSelector((state) => state?.auth);
  const data=users?.user?.data
  const dispatch=useDispatch()
const navigate=useNavigate()
  const SearchByGames = async () => {
    setLoading(true);
    try {
      let url = `${import.meta.env.VITE_API_URL}/api/game/get-all-game?status=true&page=1&limit=50&site_auth_key=${import.meta.env.VITE_API_SITE_AUTH_KEY}`;
      if(search){
        url+=`&search=${search}`
      }
      const headers = {
        'Content-Type': 'application/json',
      };
      const response = await axios.get(url, { headers });
      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }
    
      setLoading(false);
      setGames(response?.data)
    } catch (error) {
      setLoading(false);
      console.log('Error fetching data:', error);
    }
  };
  useEffect(()=>{
    let id;
    id = setTimeout(() => {
            SearchByGames()

    }, 100);

    return () => clearTimeout(id);
  },[search])


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
    <Modal size={size} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent >
        <ModalHeader style={{textAlign:"center"}}>
      <span onClick={onClose} className='bg-gray-200 cursor-pointer absolute  rounded-[50%] top-3 right-4 h-[30px] flex items-center justify-center w-[30px]'>
      <RxCross2 fontWeight={'800'}/>

      </span>
        </ModalHeader>
        <ModalBody style={{padding:"8px"}} className='min-h-[600px] overflow-scroll '>
            <div className=' flex mt-5 items-center  '> 
          <input
            placeholder="Search games"
            value={search}
            className='w-[92%]  outline-none m-auto p-[12px] pl-4  rounded-[4px] text-gray-900 bg-[#F2F2F2] font-bold focus:outline-none focus:ring-2 focus:ring-yellow-500'

            onChange={(e)=>setSearch(e.target.value)} 
          />
          </div>
          <Box mt={4}>
            
          <div className="grid grid-cols-2  overflow-scroll h-[100vh] md:h-[500px] mx-5 my-5 mb-10 gap-3">
    {loading ? (
      Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} height={"120px"}/>
      ))
    ) : (
      game?.data?.map((game) => (
        <div 
          key={game._id} 
          onClick={() => handleRedirect(game.gameProviderId, game.gameID)} 
          className="relative cursor-pointer group rounded-[6px] shadow-lg"
        >
          <img 
            src={game?.gameInfos[0]?.gameIconUrl} 
            alt={game?.gameInfos[0]?.gameName} 
            className="w-full h-[130px] rounded-[6px] transform  transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-1 opacity-100 transition-opacity duration-500">
            <p className="text-sm font-semibold text-white">{game.gameInfos[0].gameName?.slice(0, 15)}</p>
            {/* <p className="text-sm text-gray-300">{game.provider}</p> */}
          </div>
        </div>
      ))
    )}
  </div>
          </Box>
        </ModalBody>
       
      </ModalContent>
    </Modal>
  );
};

export default SearchModal;
