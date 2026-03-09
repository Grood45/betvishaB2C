import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { SimpleGrid, Box, Heading, Text, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Image, Table, Thead, Tbody, Tr, Th, Td, List, ListItem } from '@chakra-ui/react';
import img1 from "../../assets/images/promotion/10001.jpeg";
import img2 from "../../assets/images/promotion/10002.jpeg";
import img3 from "../../assets/images/promotion/10003.jpeg";
import img4 from "../../assets/images/promotion/10004.jpeg";
import logo1 from "../../assets/images/promotion/1.png";
import logo2 from "../../assets/images/promotion/2.png";
import logo3 from "../../assets/images/promotion/3.png";
import { FcLike } from "react-icons/fc"
import axios from 'axios';
import Skeleton from '../Skeleton/Skeleton';

function PromotionCards() {
    const images = [img1, img2, img3, img4];
    const { bgGray, PrimaryText, whiteText, secondaryText } = useSelector((state) => state.theme);
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState(null);
const [promotionLoading,setPromotionLoading]=useState(false)
const [promotions, setPromotions] = useState([]);
    // Extra content for each promotion
  
    function formatText(input) {
        // Split the input text by underscore
        const words = input?.split('_');
        // Capitalize the first letter of each word
        const capitalizedWords = words?.map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        );
        // Join the words with a space
        const formattedText = capitalizedWords?.join(' ');
        return formattedText;
      }
    const getPromotionData = async () => {
        setPromotionLoading(true);
        try {
          // Make GET request to the API endpoint using Axios
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/promotion/get-all-promotion-user`, {
            params: {
              site_auth_key: import.meta.env.VITE_API_SITE_AUTH_KEY ,
              status: true,
            },
          });
          // Parse the response data
          const responseData = response.data;
    
          // Save the retrieved user data
          setPromotions(responseData.promotions);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
            setPromotionLoading(false);
        }
      };
    
      useEffect(() => {
        getPromotionData();
      }, []);

      
    const paragraphStyle = {
        fontSize: '13px',
        lineHeight: '22px',
        fontFamily: 'Verdana, sans-serif'
    };
    const tableStyle = {
        evenRowStyle: {
            backgroundColor: "#f2f2f2",
        },
    }

    const openModal = (promotion) => {
        setSelectedPromotion(promotion);
        setIsOpen(true);
    };

    const closeModal = () => {
        setSelectedPromotion(null);
        setIsOpen(false);
    };

    return (
        <>
            <div className=' grid grid-cols-1 md:grid-cols-2 p-[10px] gap-3 lg:grid-cols-2'  >
            {promotionLoading? (
          Array.from({ length: 6}).map((_, index) => (
            <Skeleton key={index} height={'150px'} />
          ))
        ):
                (promotions.map((item, index) => (
                    <div  className='bg-[#F2F2F2]  h-[100%] rounded-[5px]  ' key={index}   onClick={() => openModal(item)}>
                        <img src={item.image} className='rounded-tl-[5px] h-[100px]  md:h-[187px] rounded-tr-[5px]' alt={`Logo ${index + 1}`} style={{  width: "100%"}} />
                        <div className='px-2' style={{ overflow: 'hiden', padding: '10px', }}>
                            <Heading as="h6">{formatText(item.category)}</Heading>
                            
                            <div className='leading-1 text-xs md:text-sm'>{item?.description.slice(0,120)}...</div>
                        </div>
                    </div>
                )))}
            
            </div>
            <Modal size={{base:'full',md:"md"}} isOpen={isOpen} onClose={closeModal}>
                <ModalOverlay />
                <ModalContent maxW={{ base: "100%", xl: "800px" }} maxH={{ base: "100vh", xl: "90%" }} height="100%"  overflow="hidden" position="relative">
                    <ModalHeader></ModalHeader>
                    <ModalCloseButton />
                    <ModalBody overflowY="auto" height={{ base: "100%", xl: "calc(100% - 115px)" }}
                        css={{
                            '&::-webkit-scrollbar': { width: '10px', borderRadius: '8px' },
                            '&::-webkit-scrollbar-track': { backgroundColor: '#e3e5e6' },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: '#ffaa00',
                                borderRadius: '8px',
                                height: '20px !important'
                            }
                        }}
                        p="30px 0 0 0"
                    >
                       <Box  padding="0 30px 150px">
                       <Image borderRadius="5px" className='h-[200px] w-[100%]' src={selectedPromotion?.image} alt="Promotion Image" />
                        <p className='text-[30px] mt-3 font-bold'>{formatText(selectedPromotion?.category)}</p>
                        <Text>
                            <span style={paragraphStyle}>{selectedPromotion?.description}</span>
                        </Text>
                        <Heading as="h6" mt={5}>Eligibility</Heading>
                        <Text>
                            <span style={paragraphStyle}>{selectedPromotion?.eligibility}</span>
                        </Text>
                        <Table variant="striped" mt={2}>
                            <Thead>
                                <Tr>
                                    <Th><Heading  as="h6">Bonus Rules</Heading></Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {/* {selectedPromotion?.tableRows.map((row, index) => ( */}
                                    <Tr >
                                    <ul dangerouslySetInnerHTML={{ __html: selectedPromotion?.rules }} />
                                       
                                    </Tr>
                                {/* ))} */}
                            </Tbody>
                        </Table>
                        <Box mt={8} className='flex justify-between'>
                            <p className=''>
Started Date:-

                            <span style={{ display: "inline-block", fontSize: ".9rem" }} className='font-bold ml-1'>{selectedPromotion?.start_date}</span>

                            </p>
                            <p>
                                End Date:
                            <span style={{ fontWeight: "700", display: "inline-block", fontSize: ".9rem" }} className='font-bold ml-1'>{selectedPromotion?.end_date}</span>

                            </p>
                        </Box>
                        {/* <Heading as="h6" mt={4}>{selectedPromotion?.eligibility}</Heading> */}
                        <Box className='flex'>
                            <Image src={logo1} alt="" width="52px" padding="10px" />
                            <Image src={logo2} alt="" width="52px" padding="10px" />
                            <Image src={logo3} alt="" width="52px" padding="10px" />
                        </Box>
                        {/* <Heading as="h6" mt={8}>{selectedPromotion?.orderListHeading}</Heading> */}
                        <List styleType="decimal">
                            {/* {selectedPromotion?.orderListPoints.map((point, index) => (
                                <ListItem style={paragraphStyle} mb="8px" key={index}>{point}</ListItem>
                            ))} */}
                        </List>
                       </Box>
                        <Box  display={{ base: "none", xl: "block" }}  maxW="800px" maxH="90%" overflow="hidden" position="absolute" left="0" bottom="0" width="100%">
                            <Flex align="center" justify="center" minHeight="60px" backgroundColor="#000000">
                                <Text as="div" style={{color:whiteText}} className="promotion-modal-support-footer">
                                    Need assistance? Please contact our{' '}
                                    <Text as="span" style={{color:secondaryText}}>
                                        Customer care
                                    </Text>
                                </Text>
                            </Flex>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}

export default PromotionCards;
