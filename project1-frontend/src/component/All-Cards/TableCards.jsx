import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import img1 from "../../assets/images/crash/10009.png";
import img2 from "../../assets/images/crash/10010.png";
import img3 from "../../assets/images/crash/10011.png";
import img4 from "../../assets/images/crash/10012.png";
import img5 from "../../assets/images/crash/10013.png";
import img6 from "../../assets/images/crash/10014.png";
import img7 from "../../assets/images/crash/10015.png";
import img8 from "../../assets/images/crash/10016.jpeg";
import img9 from "../../assets/images/crash/10017.png";
import img10 from "../../assets/images/crash/10018.png";
import img11 from "../../assets/images/crash/10019.png";
import img12 from "../../assets/images/crash/10020.jpeg";
import img13 from "../../assets/images/crash/10021.png";
import img14 from "../../assets/images/crash/10022.png";

import { FcLike } from "react-icons/fc";



import { SimpleGrid, Box } from '@chakra-ui/react';



function TableCards() {
    const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9,img10,img11,img12,img13,img14];
    const {
        bgGray,
    } = useSelector((state) => state.theme);

    const { t, i18n } = useTranslation();
    const StyleCard = {
        width: "100%",
        position: "absolute",
        paddingTop: "10px",
        bottom: 0,
        left: 0,
        borderRadius: "0 0 5px 5px",
        background: "linear-gradient(0deg, #000, transparent)",
        display: 'flex',
        justifyContent: 'space-between',
    }

    return (
        <>
            <SimpleGrid columns={{ base:2, sm: 3, md: 4, lg: 6 }} spacing="10px" p="3" >
                {images.map((img, index) => (
                    <Box key={index} rounded="5px" overflow="hidden" position="relative" display="flex" maxHeight='144px'>
                        <img src={img} alt={`Logo ${index + 1}`} />
                        <div style={{ ...StyleCard }} className='text-white px-2'>
                            <span>9 Wickets</span>
                            <FcLike size={21} />
                        </div>
                    </Box>
                ))}
            </SimpleGrid>
        </>
    )
}


export default TableCards;