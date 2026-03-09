import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, useDisclosure } from '@chakra-ui/react';
import { HiOutlineSpeakerphone } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

function AddNewBonus() {
    const {
        color,
         primaryBg,
         iconColor,
         secondaryBg,
         bg,
         hoverColor,
         hover,
         text,
         font,
         border,
       } = useSelector((state) => state.theme);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newPromotion, setNewPromotion] = useState({ layer: "", commission: 0, referrals: 0, earnings: 0, enabled: false });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPromotion(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const { t, i18n } = useTranslation();

  const addNewPromotion = () => {
    // Handle adding the new promotion here
    onClose(); // Close the modal after adding
  };

  return (
    <>
      <button style={{backgroundColor:bg}} onClick={onOpen} className={` px-2 py-2 rounded-md flex items-center gap-1  text-sm font-semibold text-white `}><HiOutlineSpeakerphone />{t(`Add`)} {t(`New`)} {t(`Cashback`)}</button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t(`Add`)} {t(`New`)} {t(`Cashback`)}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
             
              <div className="mb-4">
                <label htmlFor="commission" className="block text-sm font-medium text-gray-700">{t(`Cashback`)} {t(`Commission`)} %</label>
                <input type="number" placeholder='enter you casback commision ' name="commission" id="commission"  onChange={handleInputChange} className={`mt-1 p-2 border outline-none rounded-md w-full ${border}`} />
              </div>
              <div className="mb-4">
                <label htmlFor="referrals" className={`block text-sm font-medium text-gray-700`}>{t(`Lose`)} {t(`Bet`)} {t(`Amount`)}</label>
                <input type="number" placeholder='enter you loose bet amount ' name="referrals" id="referrals"  onChange={handleInputChange} className={`mt-1 p-2 border outline-none rounded-md w-full ${border}`} />
              </div>
             
            </form>
          </ModalBody>

          <ModalFooter className={` w-[100%] flex gap-3 justify-between`}>
            <button style={{backgroundColor:bg}} onClick={addNewPromotion}  className={`  text-white font-semibold p-1 w-[100%] px-4 rounded-[6px]  `} mr={3}>{t(`Add`)} {t(`Cashback`)}</button>
            <button onClick={onClose} className={` bg-white  border ${border} font-semibold p-1 px-4 w-[100%] rounded-[6px]  `}>{t(`Cancel`)}</button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddNewBonus;
