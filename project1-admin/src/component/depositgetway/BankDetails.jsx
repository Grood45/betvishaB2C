import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { useSelector } from "react-redux";

function BankDetails({gateways, setGateways}) {
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
  const { t, i18n } = useTranslation();

  const addGateway = () => {
    setGateways([...gateways, { fieldName: "", fieldValue: "" }]);
  };

  const removeGateway = (index) => {
    const updatedGateways = [...gateways];
    updatedGateways.splice(index, 1);
    setGateways(updatedGateways);
  };

  const handleFieldChange = (
    index,
    fieldName,
    fieldValue
  ) => {
    const updatedGateways = [...gateways];
    updatedGateways[index] = { fieldName, fieldValue };
    setGateways(updatedGateways);
  };


  return (
    <div
      
      className={` w-[95%] md:w-[85%] bg-white font-semibold flex flex-col gap-6 m-auto mt-5 rounded-[12px] p-4`}
    >
      <div className="mt-5">
        <div className="w-[100%] flex px-3 gap-3 justify-between ">
          <p className="text-sm font-bold ">{t(`Admin`)} {t(`Bank`)} {t(`Details`)}</p>
          <button
            onClick={addGateway}
           style={{backgroundColor:bg}}
            className={`flex gap-3 text-xs items-center  text-white rounded-[10px] p-2 px-3`}
          >
            <span>
              <AiOutlinePlus style={{color:"white"}} />
            </span>{" "}
            {t(`Add`)} {t(`new`)} {t(`Gateway`)}
          </button>
        </div>
      </div>
      {gateways?.map((gateway, index) => (
        <div
          key={index}
          className="w-[100%] flex flex-col md:flex-row px-4 gap-3 items-center justify-between "
        >
          <div className="text-xs w-[100%] md:w-[50%] flex flex-col gap-2">
            <label>{t(`Field`)} {t(`Name`)}</label>
            <input
            
              placeholder="Field Name"
             style={{border:`1px solid ${border}`}}

              className={`w-[100%] text-xs  outline-none rounded-[12px] p-2`}
              value={gateway.fieldName}
              onChange={(e) =>
                handleFieldChange(index, e.target.value, gateway.fieldValue)
              }
            />
          </div>
          <div className="text-xs w-[100%] md:w-[50%] flex flex-col gap-2">
            <label>{t(`Field`)} {t(`Value`)}</label>
            <input
              
              placeholder="Field Value"
             style={{border:`1px solid ${border}`}}

              className={`w-[100%] text-xs outline-none rounded-[12px] p-2`}

              value={gateway.fieldValue}
              onChange={(e) =>
                handleFieldChange(index, gateway.fieldName, e.target.value)
              }
            />
          </div>
          {index > 0 && (
            <span className="flex items-center rounded-[10px] p-2 px-3 cursor-pointer">
              <AiOutlineMinus
                color="black"
                onClick={() => removeGateway(index)}
              />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default BankDetails;
