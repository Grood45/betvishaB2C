import { HiOutlineLink } from 'react-icons/hi'; // Example icon for link
import { IoLogoFacebook } from 'react-icons/io5'; // Import individual icons for each platform
import { IoLogoWhatsapp } from 'react-icons/io5';
// import { IoLogoTelegram } from 'react-icons/io5';
import { IoLogoInstagram } from 'react-icons/io5';
import React,{useState} from "react"
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
const LayerManage = () => {
    const { color,primaryBg,iconColor,secondaryBg, bg,hoverColor,hover,text, font, border } = useSelector(state => state.theme);
    const user = useSelector((state) => state.authReducer);
    const adminData = user.user || {};
    const adminLayer = user.adminLayer;

    const { t, i18n } = useTranslation();

const handleSubmit=()=>{

}

  return (
    <div className="w-[100%] px-2">
      <form onSubmit={handleSubmit} className={`bg-white shadow-md rounded px-3 lg:px-8  pt-6 pb-8 mb-4 border `}>
        <h2 style={{color:iconColor}} className="text-lg font-semibold mb-4">{t(`All`)} {t(`Layer`)} {t(`Manage`)}</h2>
        <div className='grid grid-cols-2 justify-between w-[100%] gap-3'>

        {adminLayer.map((item,index) => (
          <div key={item.id} className="mb-4 w-[100%]">
            <p className="block text-sm font-bold text-gray-700">
             {index+1}
            </p>
            <div className="flex items-center mt-2">
              <input
                type="text"
                // placeholder={`Enter your ${item.layer} name`}
                value={t(item)}
                readOnly
                style={{border:`1px solid ${border}`}}
                className={`shadow appearance-none  rounded w-[100%]    py-2 text-sm font-semibold px-3 text-gray-700 leading-tight outline-none`}
              />
            
            </div>
          </div>
        ))}
        </div>
        <button type="submit" className={`${bg} text-white font-bold py-2 text-xs px-8 rounded focus:outline-none focus:shadow-outline`}>
          {t(`Update`)}
        </button>
      </form>
    </div>
  );
};


export default LayerManage