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
import Records from '../page/Records'

import { useSelector } from 'react-redux'
import { IoDocumentsOutline } from 'react-icons/io5'
import { useTranslation } from 'react-i18next'
function RecordsModal() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { bgColor1, bgGray } = useSelector((state) => state.theme);
const {t} =useTranslation()
    return (
      <>
        <Button onClick={onOpen}  gap="15px" height="auto" fontSize="14px"  minW={{ base: "100%", xl: "100%" }} bg="transparent" _hover={{ bg: 'transparent', }} justifyContent="center">
          <Link  className={` `}
            style={{ display: "flex", gap: "15px", backgroundColor: bgGray }}
          >
            <IoDocumentsOutline size={28} />
            <p className='text-black ' style={{color:"black"}}>{t(`Records`)}</p>
          </Link>
        </Button>
        <Modal size={"full"} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
          <ModalHeader style={{textAlign:"center",fontSize:"16px"}}>{t(`Records`)}</ModalHeader>

<ModalCloseButton />
<div className=''>
<Records/>

</div>
          </ModalContent>
        </Modal>
      </>
    )
  }


export default RecordsModal