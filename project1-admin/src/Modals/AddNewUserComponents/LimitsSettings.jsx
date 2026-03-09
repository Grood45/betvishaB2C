import React from "react";

const LimitsSettings = ({ formData, handleChange }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
                        Exposure Limit (Bet Limit) *
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-500 font-medium">₹</span>
                        <input type="number" name="exposure_limit" value={formData.exposure_limit} onChange={handleChange} className="w-full pl-8 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-[15px]" />
                    </div>
                </div>
                <div>
                    <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                        Daily Max Deposit Limit *
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-500 font-medium">₹</span>
                        <input type="number" name="daily_max_deposit_limit" value={formData.daily_max_deposit_limit} onChange={handleChange} className="w-full pl-8 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-[15px]" />
                    </div>
                </div>
                <div>
                    <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                        Daily Max Withdrawal Limit *
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-500 font-medium">₹</span>
                        <input type="number" name="daily_max_withdrawal_limit" value={formData.daily_max_withdrawal_limit} onChange={handleChange} className="w-full pl-8 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-[15px]" />
                    </div>
                </div>
                <div>
                    <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                        Welcome Bonus
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-500 font-medium">₹</span>
                        <input type="number" name="welcome_bonus" value={formData.welcome_bonus} onChange={handleChange} className="w-full pl-8 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-[15px]" />
                    </div>
                </div>
                <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" x2="4" y1="22" y2="15" /></svg>
                        Referral Code (Optional)
                    </label>
                    <input type="text" name="referral_code" value={formData.referral_code} onChange={handleChange} placeholder="REF123" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-[15px]" />
                </div>
                <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                        Admin Notes (Optional)
                    </label>
                    <textarea name="admin_notes" value={formData.admin_notes} onChange={handleChange} placeholder="Add any special notes about this user..." rows={4} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-[15px] resize-none"></textarea>
                </div>
            </div>
        </div>
    );
};

export default LimitsSettings;
