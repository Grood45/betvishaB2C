import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
  } from '@chakra-ui/react'

import trophy from '../assets/trophy.jpeg';
import check from '../assets/check.png'
import pending from '../assets/pending.png'
function ReferEarnStatusModal({refferData}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
      <>
        <p className='font-semibol text-sm cursor-pointer underline' onClick={onOpen}>More</p>
  
        <Modal size={['sm', 'sm', 'md']} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent style={{paddingTop:'20px'}}>
           {
           (refferData?.steps_completed?.is_registered &&refferData?.steps_completed?.is_deposited&&refferData?.steps_completed?.is_bonus_added)?
            <p className='text-center font-semibold px-3 mt-5 text-sm md:text-lg'>Congratulations you get <span className='text-green-600 '>100 INR</span> as  cash bonus  through the demouser01 </p>
           : <p className='text-center font-semibold sm:px-8 mt-5 text-sm md:text-lg'>Status of your refferal through the demouser01</p>}
            <ModalCloseButton />
            <ModalBody>
             <div className='p-2 flex flex-col justify-center items-center'>
             {(refferData?.steps_completed?.is_registered &&refferData?.steps_completed?.is_deposited&&refferData?.steps_completed?.is_bonus_added)? <img src={trophy} alt="" />:
          
            <div className='flex w-[100%] m-auto flex-col gap-4'>
                <div className='flex w-[100%] gap-[40px]  items-center'>
                    <img  src={refferData?.steps_completed?.is_registered?check:pending} className='h-[35px] w-[35px]'/>
                    <span>:</span>
                    <p className=' text-sm md:text-lg font-medium'>Signup process is completed</p> 

                </div>
                <div className='flex w-[100%] gap-[40px] items-center'>
                    <img  src={refferData?.steps_completed?.is_deposited?check:pending} className='h-[35px] w-[35px]'/>
                    <span>:</span>
                    <p className='text-sm md:text-lg font-medium'>First deposit is incomplete <span className='text-green-600 font-bold'>1000 INR</span></p> 

                </div>
                <div className='flex w-[100%] gap-[40px] items-center'>
                    <img  src={refferData?.steps_completed?.is_bonus_added?check:pending} className='h-[35px] w-[35px]'/>
                    <span>:</span>
                    <p className='text-sm md:text-lg font-medium'>First Turnover is incomplete <span className='text-green-600 font-bold'>1000 INR</span></p> 

                </div>
             </div>}


                {refferData.bonus_awarded?<p className='text-center flex items-center gap-2 text-xs font-bold mt-5 mb-5'>Your refferal is Successfully completed. <img src={check} className='h-[30px] w-[30px]' /></p>:
            <p className='text-center flex items-center gap-2 text-xs font-bold mt-5 mb-5'>Your refferal is pending. <img src={pending} className='h-[30px] w-[30px]' /></p>}

             </div>
            </ModalBody>
  
           
          </ModalContent>
        </Modal>
      </>
    )
  }

export default ReferEarnStatusModal