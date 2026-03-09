import { useState } from "react";
import { FormControl, FormLabel, Input, Button, Flex, Box } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { BiSolidHide } from "react-icons/bi";


const ChangePassword2 = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

  };
  const {
    bgColor1,
    bgGray,
    warning,
    greenBtn,
    PrimaryText,
    whiteText
  } = useSelector((state) => state.theme)
  const inputdiv = {
    fontSize: '1rem',
    fontWeight: 700,
    borderRadius: '5px',
    height: '50px',
    padding: '0 10px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flexWrap: 'wrap',
    minWidth: 0,
    width: '100%',
    marginTop: '10px',
    marginBottom: '10px',
    '::placeholder': {
      color: '#000000de',
    },
    outlineColor: '#ffaa00',
  };
  const ListStyle = {
    lineHeight: "30px",
  }
  return (
    <Flex flexDirection="column">
      <Box maxW="100%" my={3}>
        <Flex gap="10px" flexDirection="column" style={{ textAlign: 'left' }}>
          <Box className="p-3" maxW={{ base: "100%", xl: "800px" }} height="auto" padding="15px 34px" borderRadius="5px" bg={bgGray}>
            <Box display="flex" flexDirection="column">
              <Flex>
                <Box width="250px" margin="5px" fontWeight="700">Old Password</Box>
                <Box width="calc(100% - 250px)">
                  <Box style={{ width: '100%', textAlign: "end", position:"relative" }} >
                    <input
                      style={{ ...inputdiv, backgroundColor: bgColor1, }}
                      className="inputdiv rounded text-black-700"
                      type="text"
                    />
                    <BiSolidHide className='absolute' style={{ top: 'calc(50% - 9px)', right: '5px', }} size={24} />
                  </Box>
                </Box>
              </Flex>
              <Flex>
                <Box width="250px" margin="5px" fontWeight="700">New Password</Box>
                <Box width="calc(100% - 250px)">
                  <Box style={{ width: '100%', textAlign: "end", position:"relative" }} >
                    <input
                      style={{ ...inputdiv, backgroundColor: bgColor1, }}
                      className="inputdiv rounded text-black-700"
                      type="text"
                    />
                     <BiSolidHide className='absolute' style={{ top: 'calc(50% - 9px)', right: '5px', }} size={24} />
                  </Box>
                </Box>
              </Flex>
              <Flex>
                <Box width="250px" margin="5px" fontWeight="700">Confirm Password</Box>
                <Box width="calc(100% - 250px)">
                  <Box style={{ width: '100%', textAlign: "end", position:"relative" }} >
                    <input
                      style={{ ...inputdiv, backgroundColor: bgColor1, }}
                      className="inputdiv rounded text-black-700"
                      type="text"
                    />
                    <BiSolidHide className='absolute' style={{ top: 'calc(50% - 9px)', right: '5px', }} size={24} />
                  </Box>
                  <Box paddingTop="10px">
                    <Button bg={{ base: greenBtn }} _hover={{ bg: { base: greenBtn } }}
                      color={{ base: PrimaryText, xl: whiteText }}
                      fontSize={{ base: ".9rem", xl: "16px" }}
                      borderRadius={{ base: "25px", xl: "5px" }}
                      minW={{ base: "100%", xl: "100%" }}
                      height={{ base: "40px", xl: "50px" }}
                      margin={{ base: "5px 0 5px", xl: "5px" }}
                      flex="1"
                      textShadow="0 2px 3px rgba(0, 0, 0, .3)"
                      textTransform="uppercase"
                    >
                      Update Password
                    </Button>
                  </Box>
                </Box>
              </Flex>
            </Box>
          </Box>

        </Flex>
      </Box>



    </Flex>
  );
};

export default ChangePassword2;
