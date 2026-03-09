export const countryCurrencyMap = {
    "India": { code: "IN", currency: "INR", dialCode: "+91" },
    "Bangladesh": { code: "BD", currency: "BDT", dialCode: "+880" },
    "Pakistan": { code: "PK", currency: "PKR", dialCode: "+92" },
    "Nepal": { code: "NP", currency: "NPR", dialCode: "+977" },
    "Sri Lanka": { code: "LK", currency: "LKR", dialCode: "+94" },
    "United Arab Emirates": { code: "AE", currency: "AED", dialCode: "+971" },
    "United Kingdom": { code: "GB", currency: "GBP", dialCode: "+44" },
    "United States": { code: "US", currency: "USD", dialCode: "+1" },
    "Australia": { code: "AU", currency: "AUD", dialCode: "+61" },
    "Singapore": { code: "SG", currency: "SGD", dialCode: "+65" },
    "Thailand": { code: "TH", currency: "THB", dialCode: "+66" },
    "Indonesia": { code: "ID", currency: "IDR", dialCode: "+62" },
};

export const initialState = {
    // Step 1: Basic Info
    username: "",
    email: "",
    phone: "",
    country: "India",
    currency: "INR",
    user_type: "Self Registered", // Self Registered, Admin Created, B2B Partner, Franchise, Agent

    // Step 2: Security
    password: "",
    confirm_password: "",
    kyc_required: true,
    official_user: false,

    // Step 3: Limits & Settings
    exposure_limit: 50000,
    daily_max_deposit_limit: 100000,
    daily_max_withdrawal_limit: 50000,
    welcome_bonus: 1000,
    referral_code: "",
    admin_notes: "",

    // Step 4: Initial Deposit
    initial_deposit: 1,
    deposit_method: "Bank Transfer", // Bank Transfer, Credit/Debit Card, Digital Wallet, Cryptocurrency, Cash Deposit
    deposit_notes: "",
};
