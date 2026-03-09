import React from "react";
import {
  Box,
  Text,
  Select,
  Flex,
  Badge,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import InfoMobileHeader from "../component/InfoMobileHeader";
import InfoAndPayment from "./InfoAndPayment";
import { useSelector } from "react-redux";
const Inbox = () => {
  const data = [
    {
      title: "CMD Platform Maintenance Notice",
      date: "2024-05-17 07:42:27",
      start: "2024-05-18 01:44 AM to 6:44 PM (IST) on 19/05/2024",
    },
    {
      title: "CZ Game Platform Maintenance Announcement",
      date: "2024-05-16 08:04:45",
    },
    {
      title: "WE Game Platform Maintenance Announcement",
      date: "2024-05-16 08:02:53",
    },
    {
      title: "tg game platform will be under maintenance",
      date: "2024-05-15 11:20:11",
      start:
        "Dear Games, tg game platform Maintenance starts from 06:30 AM to 06:30 AM on 17.05.2024",
    },
    {
      title: "Cyclki game platform will be under maintenance",
      date: "2024-05-15 11:18:08",
      start:
        "Dear Games, Cyclki Game platform Maintenance starts from 08:20 AM to 07:00 AM (IST) on 16/05/2024",
    },
    {
      title: "Sgo game platform will be under maintenance",
      date: "2024-05-15 08:09:09",
      start:
        "Dear Games, Sgo Game platform Maintenance starts from 05:00 AM to 06:00 PM (IST) on 16/05/2024",
    },
    {
      title: "Dg game platform will be under maintenance",
      date: "2024-05-15 08:23:21",
      start:
        "Dear Games, DG Game platform Maintenance starts from 04:30 AM to 07:30 AM (IST) on 16/05/2024",
    },
    {
      title: "Pock game platform will be under maintenance",
      date: "2024-05-14 08:22:27",
      start:
        "Dear Games, POCK Game platform Maintenance starts from 11:00AM to 08:30 PM (IST) on 16/05/2024",
    },
    {
      title: "SEXY game platform will be under maintenance",
      date: "2024-05-15 05:04:44",
      start:
        "Dear Games, SEXY Game platform Maintenance starts from 09:30 AM to 06:30 PM (IST) on 16/05/2024",
    },
    {
      title: "TBB game platform will be under maintenance",
      date: "2024-05-15 05:20:19",
      start:
        "Dear Games, TBB Game platform Maintenance starts from 05:30 AM to 07:30 AM (IST) on 16/05/2024",
    },
  ];
  const { bgColor1, bgGray, progressBar, secondaryText } = useSelector(
    (state) => state.theme
  );
  return (
    <Box
      style={{ backgroundColor: bgColor1,width:"100%" }}
      className="main_page"
      paddingTop="155px"
      px={{base:"0px",md:"10px"}}

    >
      <Box style={{width:"100%"}}>
        <Flex
          style={{ backgroundColor: bgColor1,width:"100%" }}
          flexDirection={{ base: "column", xl: "row" }}
        >
          <InfoAndPayment />
          {/* <InfoMobileHeader></InfoMobileHeader> */}
          <Box display="flex"
              flexDirection={"column"}
              mb={0}
              gap={'8px'}
              ml={{base:"0",md:2}}
              borderRadius={"8px"}
          style={{ backgroundColor: bgGray }} 
          padding={{base:"8px",md:"20px"}}

              >
      <div className='text-center mt-2 text-xl font-bold md:hidden'> Inbox</div>

            <Box
            display="flex"
            alignItems="center"
            mb={4}
            mt={2}
            ml={2}
            margin={'auto'}
          style={{width:"100%"}}

            >
              <Select bg={bgColor1} placeholder="System" width={{base:"100%"}} >
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>
            </Box>
            <Box  overflowX="auto">
              <Box borderWidth={1} bg={bgColor1} borderRadius={8} overflow="hidden">
                {data.map((item, index) => (
                  <Box key={index} p={2} borderBottomWidth={1}>
                    <Text fontWeight="bold">{item.title}</Text>
                    <Text>{item.date}</Text>
                    {item.start && <Text>{item.start}</Text>}
                  </Box>
                ))}
              </Box>
            </Box>
            {/* <Pagination mt={4}>
        <PaginationContainer>
        <PaginationPrevious>Previous</PaginationPrevious>
          <PaginationPageGroup isInline alignItems="baseline">
            <PaginationPage page={1} isCurrentPage />
            <PaginationPage page={2} />
            <PaginationPage page={3} />
            <PaginationPage page={4} />
            <PaginationPage page={5} />
            <PaginationPage page={6} />
            <PaginationPage page={7} />
            </PaginationPageGroup>
          <PaginationNext>Next</PaginationNext>
        </PaginationContainer>
      </Pagination> */}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default Inbox;

// import React from 'react';
// import {
//   Box,
//   Text,
//   Select,
//   ButtonGroup,
//   Button,
// } from '@chakra-ui/react';

// const Pagination = ({ currentPage, totalPages, onPageChange }) => {
//   const pageNumbers = [];

//   for (let i = 1; i <= totalPages; i++) {
//     pageNumbers.push(i);
//   }

//   return (
//     <ButtonGroup spacing={4} mt={4}>
//       <Button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
//         Previous
//       </Button>
//       {pageNumbers.map((pageNumber) => (
//         <Button
//           key={pageNumber}
//           onClick={() => onPageChange(pageNumber)}
//           colorScheme={currentPage === pageNumber ? 'blue' : 'gray'}
//         >
//           {pageNumber}
//         </Button>
//       ))}
//       <Button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
//         Next
//       </Button>
//     </ButtonGroup>
//   );
// };

// const Inbox = () => {
//   const [currentPage, setCurrentPage] = React.useState(1);
//   const [itemsPerPage] = React.useState(5);
//   const totalPages = Math.ceil(data.length / itemsPerPage);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

//   // ... (rest of the component code)

//   return (
//     <Box>
//       {/* ... */}
//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={handlePageChange}
//       />
//     </Box>
//   );
// };

// export default Inbox;
