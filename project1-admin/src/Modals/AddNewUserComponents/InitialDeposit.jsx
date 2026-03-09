import React from "react";

const InitialDeposit = ({ formData, setFormData, handleChange }) => {
    const summaryTotal = Number(formData.initial_deposit || 0) + Number(formData.welcome_bonus || 0);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
                <div className="mx-auto w-[52px] h-[52px] bg-white border border-gray-200 rounded-2xl shadow-sm flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800">Add Initial Deposit</h3>
                <p className="text-[13px] text-gray-500 font-medium">Set the user's first deposit amount (minimum 1 INR)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                    <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700 mb-2">
                        <span className="font-serif font-bold text-gray-500 text-lg leading-4">$</span>
                        Initial Deposit Amount *
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-500 font-medium">₹</span>
                        <input type="number" min="1" name="initial_deposit" value={formData.initial_deposit} onChange={handleChange} className="w-full pl-8 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-[15px]" />
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium mt-1">Minimum: 1 INR • No maximum limit</p>
                </div>

                <div className="row-span-2">
                    <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                        Deposit Method
                    </label>
                    <div className="flex flex-col gap-3">
                        {['Bank Transfer', 'Credit/Debit Card', 'Digital Wallet', 'Cryptocurrency', 'Cash Deposit'].map(method => (
                            <div
                                key={method}
                                onClick={() => setFormData(prev => ({ ...prev, deposit_method: method }))}
                                className={`p-3.5 border rounded-xl text-[14px] cursor-pointer flex items-center gap-3 font-semibold transition-colors
                           ${formData.deposit_method === method ? 'bg-indigo-500 text-white border-indigo-500 shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}
                            >
                                {method === 'Bank Transfer' && <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="12" x="2" y="6" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg>}
                                {method === 'Credit/Debit Card' && <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>}
                                {method === 'Digital Wallet' && <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>}
                                {method === 'Cryptocurrency' && <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" /><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" /><path d="m2 16 6 6" /><circle cx="16" cy="9" r="2.9" /><circle cx="6" cy="5" r="3" /></svg>}
                                {method === 'Cash Deposit' && <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>}
                                {method}
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                        Deposit Notes (Optional)
                    </label>
                    <textarea name="deposit_notes" value={formData.deposit_notes} onChange={handleChange} placeholder="Add notes about this deposit transaction..." rows={4} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-[15px] resize-none"></textarea>
                </div>
            </div>

            <div className="mt-8 bg-white p-5 rounded-2xl border border-gray-200">
                <h4 className="flex items-center gap-2 text-[14px] font-bold text-gray-800 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><line x1="8" x2="16" y1="6" y2="6" /><line x1="8" x2="16" y1="10" y2="10" /><line x1="8" x2="12" y1="14" y2="14" /></svg>
                    Account Summary
                </h4>
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                        <p className="text-[12px] font-medium text-gray-500 mb-1 leading-3">Initial Deposit</p>
                        <p className="text-[16px] font-extrabold text-gray-800 tracking-tight">₹{Number(formData.initial_deposit).toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                        <p className="text-[12px] font-medium text-gray-500 mb-1 leading-3">Welcome Bonus</p>
                        <p className="text-[16px] font-extrabold text-green-600 tracking-tight">+₹{Number(formData.welcome_bonus).toLocaleString('en-IN')}</p>
                    </div>

                    <div className="col-span-2 mt-4">
                        <p className="text-[12px] font-medium text-gray-500 mb-1 leading-3">Total Wallet Balance</p>
                        <p className="text-[20px] font-extrabold text-blue-500 tracking-tight">₹{summaryTotal.toLocaleString('en-IN')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InitialDeposit;
