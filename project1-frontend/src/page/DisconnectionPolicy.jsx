import { ListItem, Box, UnorderedList, OrderedList, Text, Heading } from "@chakra-ui/react";
import FaqTabs from "../component/All-Page-Tabs/FaqTabs";

const DisconnectionPolicy = () => {
    const ListStyle = {
        lineHeight: "30px",
    }
    const listItems = [
        "Disconnections are inevitable, but players should try to rejoin the game as soon as possible. Ask your Internet Service Provider how to avoid disconnects.",
        "Bets will not be valid if a disconnect occurs before they are placed.",
        "A bet that has been placed successfully will remain valid in the event of a disconnection. After reconnecting, the results will be shown in the game history table.",
        "Customer Service can verify bets placed and game results, but will not alter the outcomes.",
        "Customer Service should be contacted if players experience continuous interruptions.",
        "This policy may be modified, altered, discontinued, canceled, refused, or voided at royaldeltin's sole discretion."
    ];

    const MainPolicy = [
        {
            mainHeading: "Online Slot & E-Games",
            subTitle: "When the Spin Button is pressed after placing a bet:",
            listContent: [
                "Our random number generator will decide the game's result if no further action is required from you; or",
                "The game won't provide the result if you need to take further action.",
                "Your game will continue from where you left it once you reconnect to the network. Upon reconnecting to our network, you will be able to see the game results in My History."
            ],
            bottomTitle: [
                "Games with a choice of jackpots (where available)",
                "The game will randomly select one jackpot for you if you are disconnected and cannot reconnect during the allotted period. Before winning the jackpot, the jackpot has likely been reset since the refresh period is short.",
            ]
        },
        {
            mainHeading: "Online Casino Games",
            subTitle: "If a disconnection occurs during the course of the game, play will continue as normal. Your winnings will be displayed in the respective game's history table once you have connected.",
            listContent: [],
            bottomTitle: [""]
        },
        {
            mainHeading: "Sports Betting Games",
            subTitle: "If the Place Bet Button is not pressed, no funds will be taken from your bankroll. In case of disconnection after pressing the Place Bet Button:",
            listContent: [
                "before the bet confirmation appears;",
                "during a bet countdown; or",
                "after reconnecting to our network, if the bet needs manual approval;",
            ],
            bottomTitle: ["You can check the sportsbook bet history table to see if your bet was accepted partially or fully."]
        }
    ]
    return (
        <Box className="main_page">
            <FaqTabs></FaqTabs>
            <Box p="10px">
                <Text>
                    Internet communication problems may cause sudden disconnections. To protect our players from unjustifiable loss, we have designed our software to prevent intentional disconnections and system abuse.
                </Text>
            </Box>
            <Box p="3px 10px">
                <Text lineHeight="1.5">
                    Poor reception and weak internet connections make it impossible to guarantee uninterrupted connection, so our software has been designed to handle such situations. Please read and understand the disconnection policy:
                </Text>
                <UnorderedList styleType="none" pl={0} m="0">
                    {listItems.map((item, index) => (
                        <ListItem key={index} py={1}
                            sx={{
                                "&::before": {
                                    content: '"-"',
                                    paddingRight: "4px", // Adjust spacing as needed
                                },
                            }}
                            style={{ ...ListStyle, }}
                            display="list-item">
                            {item}
                        </ListItem>
                    ))}
                </UnorderedList>
            </Box>
            <Box>
            <OrderedList >
                {MainPolicy.map((item, index) => (
                   <Box key={index} px="10px" mb="15px">
                    
                    <ListItem fontWeight="700" >{item.mainHeading}</ListItem>
                        {item.subTitle && <Text pl="6px">{item.subTitle}</Text>}
                        {item.listContent.length > 0 && (
                            <OrderedList pl="6px" listStyleType="lower-roman">
                                {item.listContent.map((content, idx) => (
                                    <ListItem key={idx} style={{ ...ListStyle, }}
                                        sx={{
                                            "&::marker": {
                                                fontWeight: "bold",
                                                marginRight: "4px", // Adjust spacing as needed
                                            },
                                        }}
                                    >
                                        {content}
                                    </ListItem>
                                ))}
                            </OrderedList>
                        )}
                        {/* {item.bottomTitle.length > 0 && <Text>{item.bottomTitle}</Text>} */}
                        {item.bottomTitle.length > 0 && (
                            <>
                                {item.bottomTitle.map((content, idx) => (
                                    <Text key={idx}>{content}</Text>
                                ))}
                            </>
                        )}
                    
                   </Box>
                ))}
                </OrderedList>
            </Box>

        </Box>
    );
}

export default DisconnectionPolicy;
