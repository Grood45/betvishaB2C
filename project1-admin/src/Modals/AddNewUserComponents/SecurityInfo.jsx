import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Switch } from "@chakra-ui/react";

const SecurityInfo = ({ formData, setFormData, handleChange, handleGeneratePassword }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700 mb-2">
                        <Lock size={16} className="text-gray-500" /> Password *
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••••••"
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-[15px] pr-16"
                        />
                        <div className="absolute right-3 top-[10px] flex items-center gap-3">
                            <button type="button" onClick={handleGeneratePassword} className="text-[13px] text-blue-500 font-semibold cursor-pointer">Gen</button>
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-500 hover:text-gray-700">
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg> Confirm Password *
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirm_password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            placeholder="••••••••••••"
                            className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-[15px] pr-10
                            ${formData.password && formData.password !== formData.confirm_password && formData.confirm_password.length > 0 ? "border-red-500" : "border-gray-300"}`}
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-[10px] text-gray-500 hover:text-gray-700">
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {formData.password && formData.password !== formData.confirm_password && formData.confirm_password.length > 0 && <p className="text-xs text-red-500 mt-1">Passwords do not match</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3.5 border border-gray-200 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-green-200 bg-green-50 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12" /></svg>
                        </div>
                        <div>
                            <h4 className="text-[13px] font-bold text-gray-800">KYC Required</h4>
                            <p className="text-[11px] text-gray-500 font-medium">User must complete KYC</p>
                        </div>
                    </div>
                    <Switch size="md" colorScheme="blue" isChecked={formData.kyc_required} onChange={(e) => setFormData(prev => ({ ...prev, kyc_required: e.target.checked }))} />
                </div>

                <div className="flex items-center justify-between p-3.5 border border-gray-200 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-yellow-200 bg-yellow-50 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                        </div>
                        <div>
                            <h4 className="text-[13px] font-bold text-gray-800">Official User</h4>
                            <p className="text-[11px] text-gray-500 font-medium">Mark as official user</p>
                        </div>
                    </div>
                    <Switch size="md" colorScheme="blue" isChecked={formData.official_user} onChange={(e) => setFormData(prev => ({ ...prev, official_user: e.target.checked }))} />
                </div>
            </div>
        </div>
    );
};

export default SecurityInfo;
