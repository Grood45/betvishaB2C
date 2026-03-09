import '../assets/css/style.css'
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import img1 from '../assets/images/home-images/10001.png'
import img2 from '../assets/images/home-images/10001.png'
import img3 from '../assets/images/home-images/10005.jpeg'
import img4 from '../assets/images/home-images/10006.png'
import img5 from '../assets/images/home-images/10007.png'
import img6 from '../assets/images/home-images/10008.png'
import img7 from '../assets/images/home-images/10009.jpeg'
import img8 from '../assets/images/home-images/10010.jpeg'
import img9 from '../assets/images/home-images/10011.png'
import img10 from '../assets/images/home-images/10012.jpeg'
import img11 from '../assets/images/home-images/10013.jpeg'
import img12 from '../assets/images/home-images/10013.jpeg'
import img13 from '../assets/images/home-images/10013.jpeg'
import img14 from '../assets/images/home-images/10016.png'
import img15 from '../assets/images/home-images/10017.jpeg'
import img16 from '../assets/images/home-images/10018.png'
import img17 from '../assets/images/home-images/10019.png'
import img18 from '../assets/images/home-images/10020.jpeg'
import { FcLike } from "react-icons/fc";



import { SimpleGrid, Box } from '@chakra-ui/react';
import GameModal from '../modal/GameModal';
import { useState } from 'react';
import axios from 'axios';
import Skeleton from './Skeleton/Skeleton';



function HomeCards({provider,loading}) {
    const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14, img15, img16, img17, img18];
    const {
        bgGray,
    } = useSelector((state) => state.theme);
    const [games, setGames] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
const [page,setPage]=useState(1)
const [gpId,setGpID]=useState("")
const [count,setCount]=useState(0)
    const { t, i18n } = useTranslation();
 


    const openModal = (game) => {
        setCount(count+1)
        setIsOpen(true);
        
        setGpID(game)
      };
    
      const closeModal = () => {
        setIsOpen(false);
        setSelectedGame(null);
      };

    return (
        <>
            <SimpleGrid columns={{ base:2, sm: 3, md: 4, lg: 6 }} spacing="10px" p="3" >
               
            {loading? (
      Array.from({ length: 12 }).map((_, index) => (
        <Skeleton key={index} height={"130px"} />
      ))
    ) :
                (provider?.map((img, index) => (
                     <div 
                     key={img._id} 
                     onClick={() => openModal(img)} 
                     className="relative cursor-pointer group overflow-hidden rounded-[6px] shadow-lg"
                   >
                     <img 
                       src={img.category_image_url} 
                       alt={"image"} 
                       className="w-full h-[120px]  transform transition-transform duration-500 group-hover:scale-105"
                     />
                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-1 opacity-100 transition-opacity duration-500">
                       {/* <h3 className="text-lg font-semibold text-white">{img?.gpName}</h3> */}
                       <p className="text-sm font-bold text-white">{img?.gpName}</p>
                     </div>
                   </div>
                )))}
               
            </SimpleGrid>
            <GameModal
            count={count}
          isOpen={isOpen}
          onClose={closeModal}
          providerData={gpId}
          size="full"
          
        />
        </>
    )
}


export default HomeCards