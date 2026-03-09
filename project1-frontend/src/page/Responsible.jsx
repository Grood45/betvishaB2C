import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Grid, Heading,Flex, Spinner} from "@chakra-ui/react";
import FaqTabs from "../component/All-Page-Tabs/FaqTabs";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
const Responsible = () => {
    const ListStyle = {
        lineHeight: "30px",
    }
    const listItems = [
        {
            title: "Here are the precautions followed by royaldeltin:",
            subTitle:"",
            listContent: [
                "We do not allow persons under 18 to participate in royaldeltin or promote our products or services to minors. Our advertising, sponsorship, and marketing activities are not intended to attract persons under the age of 18.",
                "Underage persons should not have access to usernames, passwords, and banking information if you share your computer with them. Software like NetNanny and Cyber Patrol can limit gambling access. www.cybersitter.com",
                "To ensure that all our members are of legal age, we conduct regular checks to determine their age. royaldeltin needs to obtain additional information to verify that the member is of legal age.",
                "There is no misrepresentation or misrepresentation of our products or services in our advertising campaigns or ads. The members are informed about the risk and the chances of winning. Even though services are provided for payment, excessive spending is not encouraged.",
                "Our voluntary self-exclusion service allows members who wish to set limits on their gambling to close their accounts or restrict their gambling activities. As soon as your account has been self-excluded, it will be closed until the selected period has passed. After the self-exclusion period ends, you will be able to resume using the website's Services.",
                "Before the self-exclusion period ends, members can request that the restrictions be removed from their account; however, the final decision rests with the Company.",
                "Member must not open a new account during the self-exclusion period and accept that the Company shall not be liable financially or otherwise if the member continues to gamble or use a new Account under a different name or address during the self-exclusion period. An account may be unblocked before the self-exclusion period ends in exceptional circumstances."
            ],
            bottomTile:[
                ""
            ]

        },
        {
            title: "Responsible Gambling Tips",
            subTitle:"The purpose of gambling is to have fun. To keep yourself safe, here are some tips:",
            listContent: [
                "Gambling isn't a way to make money.",
                "You should always gamble with money you can afford to lose.",
                "Do not chase after losses.",
                "Set a time limit and a money limit.",
                "If you are depressed or upset, don't gamble.",
                "Maintain a healthy balance between gambling and other activities.",
                "Alcohol and gambling do not mix well."
            ],
            bottomTile:[
                ""
            ]

        },
        {
            title: "Gambling Problem Warnings",
            subTitle:"An individual with a gambling problem may exhibit the following signs:",
            listContent: [
                "Gambling is constantly in your mind or in your conversation.",
                "Excessive gambling. Spending more money or time than you can afford.",
                "Having difficulty controlling, stopping, or reducing gambling.",
                "Having a sense of emptiness or loss when not gambling.",
                "Losing money and gambling more in an attempt to recover it.",
                "To gain money for gambling, one borrows money, sells things, and commits criminal acts.",
                "Increased debt, unpaid bills, or other financial problems due to gambling. Often gambling until all of your money is gone.",
                "Gambling for longer periods of time or with larger amounts of money to get the same feeling of excitement.",
                "Experiencing extreme highs from gambling wins and extreme lows from gambling losses.",
                "Using gambling to escape personal problems, relieve anxiety, depression, anger, or loneliness.",
                "It is more difficult to deal with normal, everyday activities without getting irritated or losing patience.",
                "Arguments over money and gambling with friends or family.",
                "The refusal to discuss gambling with others or the deception of others to cover up gambling.",
                "Hiding bills, past due notices, winnings, or losses from your partner or family member.",
                "Rather than attending social events with family or friends, you gamble.",
                "Indulging in gambling and neglecting family and household duties.",
                "Suicidal thoughts caused by gambling addiction.",
            ],
            bottomTile:[
                "Reach us anytime through support.inr@royaldeltin.com or live chat."
            ]

        },

    ];

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
              }/api/navigation/get-all-navigation?name=Responsible Gaming&site_auth_key=${import.meta.env.VITE_API_SITE_AUTH_KEY}`,
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

export default Responsible;
