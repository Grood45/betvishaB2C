import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const ReferralCard = ({ layer, commission, referrals, earnings, enabled, onToggleEnabled, onUpdateCommission }) => {
  const [inputCommission, setInputCommission] = useState(commission);

  const handleChangeCommission = (e) => {
    const value = e.target.value;
    setInputCommission(value);
  };

  const handleUpdateCommission = () => {
    onUpdateCommission(layer, parseFloat(inputCommission));
  };
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
        <button onClick={() => onToggleEnabled(layer)} className={`px-4 py-1 text-xs rounded ${
          enabled ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>{enabled ? 'Enabled' : 'Disabled'}</button>
      </div>
      <div style={{backgroundColor:bg}} className={`flex p-2 mt-4 font-bold text-white justify-between w-[100%]`}><p>Commision</p>
      <p>10%</p>
      </div>
     

      <div className="mb-2 mt-5">
        <label htmlFor={`commission_${layer}`} className="block mb-1">Commission (%)</label>
        <input type="number" id={`commission_${layer}`} value={inputCommission} onChange={handleChangeCommission} className={`border ${border} rounded w-full px-3 py-1 outline-none`} />
      </div>
   
      <button onClick={handleUpdateCommission} className="mt-4 px-4 py-1 text-sm bg-blue-500 text-white rounded-md">Update Commission</button>
    </div>
  );
};

const ReferralSetting = () => {
  const dummyData = [
    { layer: "Deposit Commission", commission: 5, referrals: 100, earnings: 500, enabled: true },
    { layer: "Bet Placed Commission", commission: 3, referrals: 80, earnings: 240, enabled: false },
    { layer: "Bet Win Commission", commission: 2, referrals: 50, earnings: 100, enabled: true },
    { layer: "Bet loose Commission", commission: 1, referrals: 30, earnings: 30, enabled: false }
  ];

  const [referralData, setReferralData] = useState(dummyData);
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
      <h1 style={{color:iconColor}} className={`text-2xl font-bold mb-4 `}>Referral Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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





export default ReferralSetting