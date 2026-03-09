import React, { useState } from 'react';
import { FaCopy } from 'react-icons/fa6';
import { HiOutlineSpeakerphone } from 'react-icons/hi';
import { MdDelete } from 'react-icons/md';
import { useSelector } from 'react-redux';
import AddNewPromotion from '../Modals/AddNewPromotion';
import { useTranslation } from 'react-i18next';

const ReferralCard = ({ layer, commission, referrals, earnings, enabled, onToggleEnabled, onUpdateCommission }) => {
  const [inputCommission, setInputCommission] = useState(commission);

  const handleChangeCommission = (e) => {
    const value = e.target.value;
    setInputCommission(value);
  };
const { t, i18n } = useTranslation();


 
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

  return (
    <div 
    style={{border: `1px solid ${border}`}} 
    
    className={`p-4  rounded-lg shadow-md mb-4`}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold"> {layer}</h2>
        <div className='flex items-center gap-4'>
        <MdDelete fontSize={"25px"} cursor={"pointer"} color={iconColor} />
        <button onClick={() => onToggleEnabled(layer)} className={`px-4 py-1 text-xs rounded ${
          enabled ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>{enabled ? 'Enabled' : 'Disabled'}</button>
        </div>
     
      </div>
      <div 
      style={{backgroundColor:bg}}
      className={`flex p-2 mt-4  font-bold text-white justify-between w-[100%]`}><p>{t(`Commission`)}</p>
      <p>10%</p>
      </div>
     

      <div className={`flex p-2 mt-4  justify-between w-[100%]`}><p className='font-semibold'>{t(`Promotion`)} {t(`Code`)}</p>
      {/* <p className='flex items-center font-bold gap-3'>ADR123 <FaCopy cursor={"pointer"} color="gray" /></p> */}
      </div>
   
    </div>
  );
};

const PromotionManage = () => {
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
    
  const dummyData = [
    { layer: "Deposit Commission", commission: 5, referrals: 100, earnings: 500, enabled: true },
    { layer: "Bet Placed Commission", commission: 3, referrals: 80, earnings: 240, enabled: false },
    { layer: "Bet Win Commission", commission: 2, referrals: 50, earnings: 100, enabled: true },
    { layer: "Bet loose Commission", commission: 1, referrals: 30, earnings: 30, enabled: false }
  ];

  const [referralData, setReferralData] = useState(dummyData);

  const toggleEnabled = (layer) => {
    const updatedData = referralData.map(item =>
      item.layer === layer ? { ...item, enabled: !item.enabled } : item
    );
    setReferralData(updatedData);
  };

  const updateCommission = (layer, commission) => {
    const updatedData = referralData.map(item =>
      item.layer === layer ? { ...item, commission } : item
    );
    setReferralData(updatedData);
  };

  return (
    <div className="w-[100%] mx-auto px-4 py-8">
        <div className='flex justify-between items-center'>
      <h1
      style={{color:iconColor}}
      
      className={`text-2xl font-bold mb-4 `}>Promotion Settings</h1>
<AddNewPromotion/>
        </div>
      <div className="grid grid-cols-1 mt-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {referralData.map((item, index) => (
          <ReferralCard
            key={index}
            layer={item.layer}
            commission={item.commission}
            referrals={item.referrals}
            earnings={item.earnings}
            enabled={item.enabled}
            onToggleEnabled={toggleEnabled}
            onUpdateCommission={updateCommission}
          />
        ))}
      </div>
    </div>
  );
};





export default PromotionManage