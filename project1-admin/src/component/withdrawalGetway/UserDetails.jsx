import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { useSelector } from "react-redux";


const initialField = {
  name: "",
  type: "",
  required: "",
};

function UserDetails({ formFields, setFormFields }) {
  // Function logic here
  const handleAddField = () => {
    setFormFields([...formFields, initialField]);
  };

  const handleRemoveField = (index) => {
    const updatedFields = formFields.filter((_, i) => i !== index);
    setFormFields(updatedFields);
  };
  const { t, i18n } = useTranslation();

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedFields = [...formFields];
    updatedFields[index] = { ...updatedFields[index], [name]: value };
    setFormFields(updatedFields);
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
     
    className={` w-[95%] md:w-[85%] bg-white flex font-semibold flex-col gap-6 m-auto mt-5  rounded-[12px] pb-3 md:pb-0`}

    >
      <div className="mt-5">
        <div className="w-[100%] flex px-3 gap-3 justify-between">
          <p className=" text-sm font-bold">{t(`User`)} {t(`Details`)}</p>
          <button
            onClick={handleAddField}
            style={{backgroundColor:bg}}
            className={`flex gap-3 text-xs items-center  text-white rounded-[10px] p-2 px-3`}

           
          >
            <span>
              <AiOutlinePlus color="white" />
            </span>{" "}
            {t(`Add`)} {t(`new`)} {t(`Gateway`)}
            </button>
        </div>
      </div>
      <div className="mb-4">
        {formFields?.map((field, index) => (
          <div
            key={index}
            className="w-[100%] flex flex-col md:flex-row px-4 mt-2 gap-3 justify-between"
          >
            <div className="text-xs w-[100%]  flex flex-col gap-2">
              <label>{t(`Field`)} {t(`Name`)}</label>
              <input
               name="name"
                value={field.name}
                onChange={(e) => handleInputChange(index, e)}
                placeholder="Field Name"
              style={{border:`1px solid ${border}`}}

                className={`w-[100%] text-xs  outline-none rounded-[12px] p-2`}
              />
            </div>
            <div 
              
            
            className={`text-xs w-[100%] bg-white flex flex-col gap-2`}>
              <label>{t(`Input`)} {t(`Type`)}</label>
              <select
                name="type"
               
                value={field.type}
                onChange={(e) => handleInputChange(index, e)}
                placeholder="Input Text"
              style={{border:`1px solid ${border}`}}

                className={`w-[100%] text-xs  outline-none rounded-[12px] p-2`}>
                <option className=" text-black m-auto" value={""}>
                  {t(`Select`)} {t(`Option`)}
                </option>
                <option className=" text-black" value={"file"}>
                  {t(`File`)}
                </option>
                <option className=" text-black" value={"text"}>
                  {t(`Text`)}
                </option>
                <option className=" text-black" value={"number"}>
                  {t(`Number`)}
                </option>
              </select>
            </div>
            <div className="text-xs w-[100%]  flex flex-col gap-2">
              <label>{t(`Input`)} {t(`Required`)}</label>
              <select

                name="required"
                value={field.required}
                onChange={(e) => handleInputChange(index, e)}
                placeholder="Required"
              style={{border:`1px solid ${border}`}}

                className={`w-[100%] text-xs outline-none rounded-[12px] p-2`}
              >
                <option className=" text-black" value={""}>
                  {t(`Select`)} {t(`Option`)}
                </option>
                <option className=" text-black" value={"true"}>
                  {t(`Required`)}
                </option>
                <option className=" text-black" value={"false"}>
                  {t(`Not`)} {t(`Required`)}
                </option>
              </select>
            </div>
            {formFields.length > 1 && (
              <span className="cursor-pointer">
                <AiOutlineMinus
                  color=""
                  onClick={() => handleRemoveField(index)}
                />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserDetails;
