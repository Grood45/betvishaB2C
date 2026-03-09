import React, { useEffect, useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Input, Box, Button } from '@chakra-ui/react';
import { MdArrowBack } from 'react-icons/md';
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import Skeleton from '../component/Skeleton/Skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLoginForm } from '../redux/switch-web/action';
const GameModal = ({count, isOpen, onClose,providerData,size }) => {
  const [search, setSearch] = useState('');
const [loading,setLoading]=useState(false)
  const [game,setGames]=useState({})
  const ProviderCategoryGroup = useSelector((state) => state?.website);
  const users= useSelector((state) => state?.auth);
  const data=users?.user?.data
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const providerCategory = ProviderCategoryGroup?.providerGroupName;
  const [page,setPage]=useState(false)

  console.log(count,"ount")
  const fetchGamesByProvider = async () => {
    setLoading(true);
    // const url = `${
    //   import.meta.env.VITE_API_URL
    // }/api/game/get-game-by-provider/${id}?category=${providerCategory.toLowerCase()}&status=true&page=${page}&limit=30&site_auth_key=${
    //   import.meta.env.VITE_API_SITE_AUTH_KEY
    // }`;
    try {
      let url = `${import.meta.env.VITE_API_URL}/api/game/get-game-by-provider/${providerData?.gpId}?category=${providerCategory.toLowerCase()}&status=true&page=${page}&limit=30&site_auth_key=${import.meta.env.VITE_API_SITE_AUTH_KEY}`;
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
      console.error('Error fetching data:', error);
    }
  };
  useEffect(()=>{
    setGames({})

    let id;
    id = setTimeout(() => {
        if(providerData?.gpId){
            fetchGamesByProvider()
        
        }
    }, 100);

    return () => clearTimeout(id);
  },[providerData?.gpId,search,count])


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
          {/* {selectedGame?.providerName} */}
          <MdArrowBack onClick={onClose} style={{position:"absolute"}} fontSize={"30px"} />
          {providerData?.gpName}
        </ModalHeader>
        <ModalBody style={{padding:"8px"}}>
            <div className='rounded-full bg-[#F2F2F2] justify-between border border-yellow-500   p-[10px] flex items-end pr-4 '>
          <input
            placeholder="Search games"
            value={search}
            className='w-[85%] pl-1 bg-[#F2F2F2] outline-none text-gray-900 font-bold ]'

            onChange={(e)=>setSearch(e.target.value)}
          />
          <RxCross2  onClick={()=>{
            setSearch('')
            }} fontSize={"20px"} style={{zIndex:'10000',cursor:"pointer"}} />
          </div>
          <Box mt={4}>
            
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 my-5 mb-10 gap-3">
    {loading ? (
      Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} height={"120px"}/>
      ))
    ) : (
      game?.data?.map((game) => (
        <div 
          key={game._id} 
          onClick={() => handleRedirect(game.gameProviderId, game.gameID)} 
          className="relative cursor-pointer group overflow-hidden rounded-[6px] shadow-lg"
        >
          <img 
            src={game?.gameInfos[0]?.gameIconUrl} 
            alt={game?.gameInfos[0]?.gameName} 
            className="w-full h-[130px] transform transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-1 opacity-100 transition-opacity duration-500">
            {/* <h3 className="text-lg font-semibold text-white">{game.gameInfos[0].gameName?.slice(0, 15)}</h3> */}
            <p className="text-sm text-white font-bold">{game.gameInfos[0].gameName?.slice(0, 15)}</p>
          </div>
        </div>
      ))
    )}
  </div>
  {(game?.data?.length==0&&!loading)&&<div className='text-center font-normal '>
        No Search Found !
  </div>}
          </Box>
        </ModalBody>
       
      </ModalContent>
    </Modal>
  );
};

export default GameModal;
