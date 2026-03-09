import React, { useState } from "react";
import { User, Mail, Phone, Globe, CircleDollarSign, Shield, UserPlus, CheckCircle } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { countryCurrencyMap } from "./constants";

const BasicInfo = ({
    formData,
    setFormData,
    handleChange,
    handlePhoneInput,
    handleGenerateUsername,
    formErrors,
    setFormErrors,
    validUsername,
    userExist
}) => {
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {/* Username */}
                <div className="flex flex-col">
                    <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700 mb-2">
                        <User size={16} className="text-gray-400" />
                        Username *
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={(e) => { handleChange(e); setFormErrors(prev => ({ ...prev, username: null })); }}
                            placeholder="player1736"
                            className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-[15px]
                                ${formErrors.username ? "border-red-500" : "border-gray-200"}
                            `}
                        />
                        <button
                            type="button"
                            onClick={handleGenerateUsername}
                            className="absolute right-3 top-[10px] text-[13px] text-blue-500 font-semibold cursor-pointer hover:text-blue-600 transition-colors"
                        >
                            Generate
                        </button>
                    </div>
                    {formErrors.username && <p className="text-xs text-red-500 mt-1 flex items-center gap-1 font-medium italic"> {formErrors.username}</p>}
                    {validUsername === false && <p className="text-[10px] text-red-500 mt-1 font-semibold italic">Username must contain both letters and numbers.</p>}
                    {userExist && <p className="text-[10px] text-red-500 mt-1 font-semibold italic">Username already taken.</p>}
                </div>

                {/* Email */}
                <div className="flex flex-col">
                    <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700 mb-2">
                        <Mail size={16} className="text-gray-400" />
                        Email Address *
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => { handleChange(e); setFormErrors(prev => ({ ...prev, email: null })); }}
                        placeholder="khan1234@gmail.com"
                        className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-[15px]
                            ${formErrors.email ? "border-red-500" : "border-gray-200"}`}
                    />
                    {formErrors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1 font-medium italic"> {formErrors.email}</p>}
                </div>

                {/* Phone */}
                <div className="flex flex-col">
                    <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700 mb-2">
                        <Phone size={16} className="text-gray-400" />
                        Phone Number *
                    </label>
                    <div className={`flex border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent
                            ${formErrors.phone ? "border-red-500" : "border-gray-200"}`}>
                        <div className={`bg-gray-50 px-3 py-2.5 flex items-center justify-center border-r min-w-[50px] text-[15px] font-medium text-gray-700
                              ${formErrors.phone ? "border-red-500" : "border-gray-200"}`}>
                            {countryCurrencyMap[formData.country]?.dialCode || ""}
                        </div>
                        <input
                            type="text"
                            value={formData.phone}
                            onChange={(e) => { handlePhoneInput(e); setFormErrors(prev => ({ ...prev, phone: null })); }}
                            placeholder="66546454898"
                            className="flex-1 w-full px-3 py-2.5 outline-none text-[15px]"
                        />
                    </div>
                    {formErrors.phone && <p className="text-xs text-red-500 mt-1 flex items-center gap-1 font-medium italic"> {formErrors.phone}</p>}
                </div>

                {/* Country */}
                <div className="flex flex-col relative">
                    <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700 mb-2">
                        <Globe size={16} className="text-gray-400" />
                        Country *
                    </label>
                    <div
                        className="w-full p-2.5 border border-gray-200 rounded-lg cursor-pointer flex justify-between items-center bg-white"
                        onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    >
                        <div className="flex items-center gap-2 text-[15px]">
                            {formData.country && (
                                <ReactCountryFlag countryCode={countryCurrencyMap[formData.country].code} svg style={{ width: '1.2em', height: '1.2em' }} />
                            )}
                            <span className="text-gray-800 font-medium">{formData.country || "Select Country"}</span>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-400 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6" /></svg>
                    </div>

                    {isCountryDropdownOpen && (
                        <div className="absolute z-[100] top-[75px] w-full bg-[#1e2333] border border-gray-700 rounded-lg shadow-2xl overflow-y-auto max-h-[250px] animate-in fade-in zoom-in-95 duration-200">
                            {Object.keys(countryCurrencyMap).sort().map((country) => (
                                <div
                                    key={country}
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, country }));
                                        setIsCountryDropdownOpen(false);
                                    }}
                                    className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer text-sm text-gray-200 hover:bg-[#2b3145] transition-colors
                                       ${formData.country === country ? 'bg-[#2b3145] font-semibold text-blue-400' : ''}`}
                                >
                                    <ReactCountryFlag countryCode={countryCurrencyMap[country].code} svg style={{ width: '1.2em', height: '1.2em' }} />
                                    <span>{country}</span>
                                    {formData.country === country && <CheckCircle size={14} className="ml-auto" />}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Currency */}
                <div className="flex flex-col">
                    <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700 mb-2">
                        <CircleDollarSign size={16} className="text-gray-400" />
                        Currency (Auto-mapped)
                    </label>
                    <div className="w-full p-2.5 border border-gray-100 bg-gray-50 rounded-lg text-[15px] font-semibold outline-none flex items-center gap-1.5">
                        <span className="text-gray-800">{formData.currency}</span>
                        <span className="text-gray-400 font-medium text-[13px]">(Mapped from {formData.country})</span>
                    </div>
                </div>

                {/* User Type */}
                <div className="flex flex-col">
                    <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700 mb-2">
                        <Shield size={16} className="text-gray-400" />
                        User Type *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { id: 'Self Registered', icon: User },
                            { id: 'Admin Created', icon: Shield },
                            { id: 'B2B Partner', icon: Globe },
                            { id: 'Franchise', icon: UserPlus },
                            { id: 'Agent', icon: User }
                        ].map((type) => (
                            <div
                                key={type.id}
                                onClick={() => setFormData(prev => ({ ...prev, user_type: type.id }))}
                                className={`py-2 px-3 border rounded-xl text-[14px] cursor-pointer font-semibold flex items-center gap-2.5 transition-all
                                    ${formData.user_type === type.id
                                        ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                            >
                                <type.icon size={16} />
                                <span className="truncate">{type.id}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BasicInfo;
