import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
  } from '@chakra-ui/react'
import { MdLock } from 'react-icons/md'
import {Link} from "react-router-dom"
import { useSelector } from 'react-redux'
function InboxModal() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { bgColor1, bgGray } = useSelector((state) => state.theme);

    return (
      <>
        <Button onClick={onOpen}  gap="15px" height="auto" fontSize="14px"  minW={{ base: "100%", xl: "100%" }} bg="transparent" _hover={{ bg: 'transparent', }} justifyContent="center">
          <Link  className={` `}
            style={{ display: "flex", gap: "15px", backgroundColor: bgGray }}
          >
            <MdLock size={28} />
            <p className='text-black ' style={{color:"black"}}>Profile</p>
          </Link>
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
              <Button variant='ghost'>Secondary Action</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }

export default InboxModal