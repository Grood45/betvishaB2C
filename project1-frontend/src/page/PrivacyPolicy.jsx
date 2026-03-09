import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Grid, Heading,Flex, Spinner} from "@chakra-ui/react";
import FaqTabs from "../component/All-Page-Tabs/FaqTabs";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";

const PrivacyPolicy = () => {
  const settings = useSelector((state) => state?.auth?.settings); 
  const userData = useSelector((state) => state?.auth?.user); 
  // const { data } = useSelector((state) => state?.auth?.user);
const data =userData?.user
const [loading,setLoading]=useState(false)
const [dataPrivacy,setPrivacyData]=useState([])

 
const getPrivacyPoicy = async () => {
        setLoading(true);
        try {
          let response = await axios.get(
            `${
              import.meta.env.VITE_API_URL
            }/api/navigation/get-all-navigation?name=Privacy Policy&site_auth_key=${import.meta.env.VITE_API_SITE_AUTH_KEY}`,
            {
              headers: {
                token: data?.token,
                usernametoken: data?.usernameToken,
              }
            }
          );
          setPrivacyData(response?.data.data[0]?.data[0]);
          setLoading(false);
        } catch (error) {
          console.error("Error getting payment data:", error);
        //   toast.error(error?.response?.data?.message);
    
          setLoading(false);
        }
      };


      useEffect(()=>{
        getPrivacyPoicy()

      },[])

  return (
   <Box className="main_page">
    <FaqTabs></FaqTabs>
    <div className="flex">
       <div className="accordian_wr w-[100%] flex p-1 ">
      <Accordion allowToggle  className="grid grid-cols-1  md:grid-cols-2 justify-between w-[100%] lg:gap-x-[100px] xl:gap-x-[150px] m-auto">
        {loading?<div className="ml-6"><Spinner/></div>:""}
       {dataPrivacy?.qna?.map((item,index)=>{
        return  <AccordionItem key={index} border="0" className="w-[100%]">
        <h6>
          <AccordionButton fontWeight="400" px="10px" style={{display:"flex",alignItems:"start"}}>
          <Box as='span'>{index+1}.</Box>
            <Box as='span' flex='1' textAlign='left'>
           {item?.question}
            </Box>
            
            <AccordionIcon />
          </AccordionButton>
        </h6>
        <AccordionPanel p="10px 30px 25px">
        <div dangerouslySetInnerHTML={{ __html:item?.answer }} />

        </AccordionPanel>
      </AccordionItem>
       })}
       
      </Accordion>
       </div>
       </div>
       
   </Box>
  );
}

export default PrivacyPolicy;
