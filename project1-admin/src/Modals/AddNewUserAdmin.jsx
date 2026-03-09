import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
} from "@chakra-ui/react";
import { IoEyeSharp } from "react-icons/io5";
import { IoEyeOffSharp } from "react-icons/io5";
import { IoIosPersonAdd } from "react-icons/io";

import adduser from "../assets/addnewuser.png";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { fetchGetRequest, sendPostRequest } from "../api/api";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import { retrieveUserDetails } from "../redux/middleware/localstorageconfig";
import Select from "react-select";
import countryList from "react-select-country-list";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useTranslation } from "react-i18next";

const initialState = {
  username: "",
  phone: "",
  email: "",
  password: "",
  confirm_password: "",
  amount: 0,
  role_type: "",
  country: "",
  exposure_limit: "",
  currency: "",
};
function AddNewUserAdmin({ setAllAdminData }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    color,
    primaryBg,
    secondaryBg,
    bg,
    hoverColor,
    hover,
    text,
    font,
    border,
  } = useSelector((state) => state.theme);
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [phone, setPhoneNumber] = useState();
  const [valid, setValid] = useState(false);
  const [userExist, setUserExist] = useState(false);
  const [value, setValue] = useState("");
  const toast = useToast();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};
  const adminLayer = user?.adminLayer;
  const adminLayer1 = user;
  const { selectedWebsite, siteDetails } = useSelector((state) => state.websiteReducer)
  let filteredData = siteDetails?.filter(item => item?.selected === true);

  const CreateAdmin = async (e) => {
    e.preventDefault();

    if (formData?.password !== formData?.confirm_password) {
      toast({
        description: "Both password are not same",
        status: "warning",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      return;
    } else if (userExist) {
      toast({
        description: "User name should be unique",
        status: "warning",
        duration: 4000,
        position: "top",
        isClosable: true,
      });

      return;
    } else if (valid) {
      toast({
        description: "Not a valid user name",
        status: "warning",
        duration: 4000,
        position: "top",
        isClosable: true,
      });

      return;
    }
    const payload = {
      password: formData?.password,
      role_type: adminData?.parent_admin_role_type,
      username: formData?.username,
      amount: 0,
      parent_admin_id: adminData?.admin_id,
      email: `${formData?.username.toLowerCase().replace(/\s+/g, '')}@admin.com`, // Generate unique email
      exposure_limit: "",
      country: "india",
      phone: '',
      share_percentage: 0,
      currency: "INR",
      site_auth_key: filteredData[0]?.site_auth_key
    };

    const url = `${import.meta.env.VITE_API_URL}/api/admin/create-admin-user`;
    setLoading(true);
    try {
      let response = await sendPostRequest(url, payload);
      toast({
        description: response.message,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });

      setLoading(false);
      setAllAdminData((prev) => [response.data, ...prev]);
      setFormData(initialState);
      onClose();
    } catch (error) {
      console.log(error, "error sf");
      toast({
        description: `${error?.data?.message || error?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  // const currencyOptions = [
  //   { value: "AED", label: "United Arab Emirates Dirham (AED)" },
  //   { value: "AUD", label: "Australian Dollar (AUD)" },
  //   { value: "BDT", label: "Bangladeshi Taka (BDT)" },
  //   { value: "BND", label: "Brunei Dollar (BND)" },
  //   { value: "BRL", label: "Brazilian Real (BRL)" },
  //   { value: "CAD", label: "Canadian Dollar (CAD)" },
  //   { value: "CHF", label: "Swiss Franc (CHF)" },
  //   { value: "CLP", label: "Chilean Peso (CLP)" },
  //   { value: "CNY", label: "Chinese Yuan (CNY)" },
  //   { value: "COP", label: "Colombian Peso (COP)" },
  //   { value: "DZD", label: "Algerian Dinar (DZD)" },
  //   { value: "EUR", label: "Euro (EUR)" },
  //   { value: "GBP", label: "British Pound (GBP)" },
  //   { value: "HKD", label: "Hong Kong Dollar (HKD)" },
  //   { value: "IDR", label: "Indonesian Rupiah (IDR)" },
  //   { value: "IDO", label: "Indian Rupee (IDO)" },
  //   { value: "INR", label: "Indian Rupee (INR)" },
  //   { value: "JPY", label: "Japanese Yen (JPY)" },
  //   { value: "KRW", label: "South Korean Won (KRW)" },
  //   { value: "KHR", label: "Cambodian Riel (KHR)" },
  //   { value: "LAK", label: "Laotian Kip (LAK)" },
  //   { value: "LKR", label: "Sri Lankan Rupee (LKR)" },
  //   { value: "MAD", label: "Moroccan Dirham (MAD)" },
  //   { value: "MMK", label: "Myanmar Kyat (MMK)" },
  //   { value: "MNT", label: "Mongolian Tugrik (MNT)" },
  //   { value: "MYK", label: "Malaysian Ringgit (MYK)" },
  //   { value: "MXN", label: "Mexican Peso (MXN)" },
  //   { value: "MYR", label: "Malaysian Ringgit (MYR)" },
  //   { value: "NGN", label: "Nigerian Naira (NGN)" },
  //   { value: "NOK", label: "Norwegian Krone (NOK)" },
  //   { value: "NPR", label: "Nepalese Rupee (NPR)" },
  //   { value: "NZD", label: "New Zealand Dollar (NZD)" },
  //   { value: "PEN", label: "Peruvian Nuevo Sol (PEN)" },
  //   { value: "PKR", label: "Pakistani Rupee (PKR)" },
  //   { value: "RUB", label: "Russian Ruble (RUB)" },
  //   { value: "SEK", label: "Swedish Krona (SEK)" },
  //   { value: "THB", label: "Thai Baht (THB)" },
  //   { value: "TRY", label: "Turkish Lira (TRY)" },
  //   { value: "UCC", label: "Ukrainian Hryvnia (UCC)" },
  //   { value: "USD", label: "United States Dollar (USD)" },
  //   { value: "VES", label: "Venezuelan Bolívar (VES)" },
  //   { value: "VND", label: "Vietnamese Dong (VND)" },
  //   { value: "VNO", label: "Vanuatu Vatu (VNO)" },
  //   { value: "ZAR", label: "South African Rand (ZAR)" },
  // ];

  const currencyOptions = [
    {
      value: "ALL",
      label: "Albanian Lek (ALL)",
      countriesUsedCurrency: ["Albania"],
    },
    {
      value: "ADP",
      label: "Andorran Peseta (ADP)",
      countriesUsedCurrency: ["Andorra"],
    },
    {
      value: "AOA",
      label: "Angolan Kwanza (AOA)",
      countriesUsedCurrency: ["Angola"],
    },
    {
      value: "ARS",
      label: "Argentine Peso (ARS)",
      countriesUsedCurrency: ["Argentina"],
    },
    {
      value: "XCD",
      label: "East Caribbean Dollar (XCD)",
      countriesUsedCurrency: [
        "Antigua  Deis",
        "Dominica",
        "Grenada",
        "St Kitts & Nevis",
        "St Lucia",
      ],
    },

    {
      value: "AMD",
      label: "Armenian Dram (AMD)",
      countriesUsedCurrency: ["Armenia"],
    },
    {
      value: "AED",
      label: "United Arab Emirates Dirham (AED)",
      countriesUsedCurrency: ["United Arab Emirates"],
    },
    {
      value: "AFN",
      label: "Afghanistan (AFN)",
      countriesUsedCurrency: ["Afghanistan"],
    },

    {
      value: "AUD",
      label: "Australian Dollar (AUD)",
      countriesUsedCurrency: ["Australia", "Nauru", "Kiribati", "Tuvalu"],
    },

    {
      value: "AZN",
      label: "Azerbaijani Manat (AZN)",
      countriesUsedCurrency: ["Azerbaijan"],
    },
    {
      value: "BSD",
      label: "Bahamian Dollar (BSD)",
      countriesUsedCurrency: ["Bahamas"],
    },
    {
      value: "BHD",
      label: "Bahraini Dinar (BHD)",
      countriesUsedCurrency: ["Bahrain"],
    },
    {
      value: "BBD",
      label: "Barbadian Dollar (BBD)",
      countriesUsedCurrency: ["Barbados"],
    },
    {
      value: "BYN",
      label: "Belarusian Ruble (BYN)",
      countriesUsedCurrency: ["Belarus"],
    },
    {
      value: "BDT",
      label: "Bangladeshi Taka (BDT)",
      countriesUsedCurrency: ["Bangladesh"],
    },
    {
      value: "BND",
      label: "Brunei Dollar (BND)",
      countriesUsedCurrency: ["Brunei"],
    },

    {
      value: "BZD",
      label: "Belize Dollar (BZD)",
      countriesUsedCurrency: ["Belize"],
    },

    {
      value: "BMD",
      label: "Bermudian Dollar (BMD)",
      countriesUsedCurrency: ["Bermuda"],
    },
    {
      value: "INR",
      label: "Indian Rupee (INR)",
      countriesUsedCurrency: ["Bhutan"],
    },
    {
      value: "BOB",
      label: "Bolivian Boliviano (BOB)",
      countriesUsedCurrency: ["Bolivia"],
    },
    {
      value: "BAM",
      label: "Bosnia-Herzegovina Convertible Mark (BAM)",
      countriesUsedCurrency: ["Bosnia Herzegovina"],
    },
    {
      value: "BWP",
      label: "Botswana Pula (BWP)",
      countriesUsedCurrency: ["Botswana"],
    },
    {
      value: "BRL",
      label: "Brazilian Real (BRL)",
      countriesUsedCurrency: ["Brazil"],
    },

    {
      value: "BGN",
      label: "Bulgarian Lev (BGN)",
      countriesUsedCurrency: ["Bulgaria"],
    },
    {
      value: "XOF",
      label: "West African CFA Franc (XOF)",
      countriesUsedCurrency: [
        "Burkina",
        "Benin",
        "Guinea-Bissau",
        "Ivory Coast",
        "Mali",
        "Niger",
        "Senegal",
        "Togo",
      ],
    },
    {
      value: "BIF",
      label: "Burundian Franc (BIF)",
      countriesUsedCurrency: ["Burundi"],
    },
    {
      value: "XAF",
      label: "Central African CFA Franc (XAF)",
      countriesUsedCurrency: [
        "Cameroon",
        "Central African Republic",
        "Chad",
        "Congo",
        "Equatorial Guinea",
        "Gabon",
      ],
    },
    {
      value: "CVE",
      label: "Cape Verdean Escudo (CVE)",
      countriesUsedCurrency: ["Cape Verde"],
    },
    {
      value: "KYD",
      label: "Cayman Islands Dollar (KYD)",
      countriesUsedCurrency: ["Cayman Islands"],
    },

    {
      value: "CLP",
      label: "Chilean Peso (CLP)",
      countriesUsedCurrency: ["Chile"],
    },
    {
      value: "CNY",
      label: "Chinese Yuan (CNY)",
      countriesUsedCurrency: ["China"],
    },
    {
      value: "COP",
      label: "Colombian Peso (COP)",
      countriesUsedCurrency: ["Colombia"],
    },
    {
      value: "KMF",
      label: "Comorian Franc (KMF)",
      countriesUsedCurrency: ["Comoros"],
    },
    {
      value: "CDF",
      label: "Congolese Franc (CDF)",
      countriesUsedCurrency: ["Congo (Democratic Rep)"],
    },
    {
      value: "CRC",
      label: "Costa Rican Colón (CRC)",
      countriesUsedCurrency: ["Costa Rica"],
    },
    {
      value: "HRK",
      label: "Croatian Kuna (HRK)",
      countriesUsedCurrency: ["Croatia"],
    },
    {
      value: "CUP",
      label: "Cuban Peso (CUP)",
      countriesUsedCurrency: ["Cuba"],
    },
    {
      value: "CYP",
      label: "Cypriot Pound (CYP)",
      countriesUsedCurrency: ["Cyprus"],
    },
    {
      value: "CAD",
      label: "Canadian Dollar (CAD)",
      countriesUsedCurrency: ["Canada"],
    },

    {
      value: "CZK",
      label: "Czech Koruna (CZK)",
      countriesUsedCurrency: ["Czech Republic"],
    },
    {
      value: "DKK",
      label: "Danish Krone (DKK)",
      countriesUsedCurrency: ["Denmark"],
    },
    {
      value: "DOP",
      label: "Dominican Peso (DOP)",
      countriesUsedCurrency: ["Dominican Republic"],
    },
    {
      value: "DJF",
      label: "Djiboutian Franc (DJF)",
      countriesUsedCurrency: ["Djibouti"],
    },

    {
      value: "DZD",
      label: "Algerian Dinar (DZD)",
      countriesUsedCurrency: ["Algeria"],
    },
    {
      value: "EUR",
      label: "Germany (EUR)",
      countriesUsedCurrency: [
        "Austria",
        "Belgium",
        "Cyprus",
        "Estonia",
        "Monaco",
        "Montenegro",
        "Finland",
        "France",
        "Germany",
        "Greece",
        "Ireland",
        "Italy",
        "Kosovo",
        "Latvia",
        "San Marino",
        "Lithuania",
        "Vatican City",
        "Luxembourg",
        "Malta",
        "Netherlands",
        "Portugal",
        "Slovakia",
        "Slovenia",
        "Spain",
        "Ireland (Republic)",
      ],
    },
    {
      value: "LBP",
      label: "Lebanese Pound (LBP)",
      countriesUsedCurrency: ["Lebanon"],
    },
    {
      value: "LSL",
      label: "Lesotho Loti (LSL)",
      countriesUsedCurrency: ["Lesotha"],
    },
    {
      value: "LRD",
      label: "Liberian Dollar (LRD)",
      countriesUsedCurrency: ["Liberia"],
    },
    {
      value: "LYD",
      label: "Libyan Dinar (LYD)",
      countriesUsedCurrency: ["Libya"],
    },

    {
      value: "CHF",
      label: "Swiss Franc (CHF)",
      countriesUsedCurrency: ["Liechtenstein", "Switzerland"],
    },
    {
      value: "MKD",
      label: "Macedonian Denar (MKD)",
      countriesUsedCurrency: ["Macedonia"],
    },
    {
      value: "MGA",
      label: "Malagasy Ariary (MGA)",
      countriesUsedCurrency: ["Madagascar"],
    },
    {
      value: "MWK",
      label: "Malawian Kwacha (MWK)",
      countriesUsedCurrency: ["Malawi"],
    },
    {
      value: "MYR",
      label: "Malaysian Ringgit (MYR)",
      countriesUsedCurrency: ["Malaysia"],
    },
    {
      value: "MRO",
      label: "Mauritanian Ouguiya (MRO)",
      countriesUsedCurrency: ["Mauritania"],
    },
    {
      value: "MUR",
      label: "Mauritian Rupee (MUR)",
      countriesUsedCurrency: ["Mauritius"],
    },
    {
      value: "MZN",
      label: "Mozambican Metical (MZN)",
      countriesUsedCurrency: ["Mozambique"],
    },
    {
      value: "MMK",
      label: "Myanmar Kyat (MMK)",
      countriesUsedCurrency: ["Myanmar (Burma)", "Myanmar"],
    },
    {
      value: "NAD",
      label: "Namibian Dollar (NAD)",
      countriesUsedCurrency: ["Namibia"],
    },

    {
      value: "NIO",
      label: "Nicaraguan Córdoba (NIO)",
      countriesUsedCurrency: ["Nicaragua"],
    },
    {
      value: "OMR",
      label: "Omani Rial (OMR)",
      countriesUsedCurrency: ["Oman"],
    },
    {
      value: "ERN",
      label: "Eritrean Nakfa (ERN)",
      countriesUsedCurrency: ["Eritrea"],
    },
    {
      value: "ETB",
      label: "Ethiopian Birr (ETB)",
      countriesUsedCurrency: ["Ethiopia"],
    },
    {
      value: "FJD",
      label: "Fijian Dollar (FJD)",
      countriesUsedCurrency: ["Fiji"],
    },
    {
      value: "GMD",
      label: "Gambian Dalasi (GMD)",
      countriesUsedCurrency: ["Gambia"],
    },
    {
      value: "GEL",
      label: "Georgian Lari (GEL)",
      countriesUsedCurrency: ["Georgia"],
    },
    {
      value: "GHS",
      label: "Ghanaian Cedi (GHS)",
      countriesUsedCurrency: ["Ghana"],
    },
    {
      value: "GTQ",
      label: "Guatemalan Quetzal (GTQ)",
      countriesUsedCurrency: ["Guatemala"],
    },
    {
      value: "GNF",
      label: "Guinean Franc (GNF)",
      countriesUsedCurrency: ["Guinea"],
    },
    {
      value: "GYD",
      label: "Guyanese Dollar (GYD)",
      countriesUsedCurrency: ["Guyana"],
    },
    {
      value: "HTG",
      label: "Haitian Gourde (HTG)",
      countriesUsedCurrency: ["Haiti"],
    },
    {
      value: "HNL",
      label: "Honduran Lempira (HNL)",
      countriesUsedCurrency: ["Honduras"],
    },
    {
      value: "HUF",
      label: "Hungarian Forint (HUF)",
      countriesUsedCurrency: ["Hungary"],
    },
    {
      value: "ISK",
      label: "Icelandic Króna (ISK)",
      countriesUsedCurrency: ["Iceland"],
    },
    {
      value: "IRR",
      label: "Iranian Rial (IRR)",
      countriesUsedCurrency: ["Iran"],
    },
    {
      value: "IQD",
      label: "Iraqi Dinar (IQD)",
      countriesUsedCurrency: ["Iraq"],
    },
    {
      value: "GBP",
      label: "British Pound (GBP)",
      countriesUsedCurrency: ["United Kingdom"],
    },
    {
      value: "HKD",
      label: "Hong Kong Dollar (HKD)",
      countriesUsedCurrency: ["Hong Kong"],
    },

    {
      value: "IDR",
      label: "Indonesian Rupiah (IDR)",
      countriesUsedCurrency: ["Indonesia"],
    },
    {
      value: "IDO",
      label: "Indian Rupee (IDO)",
      countriesUsedCurrency: ["India"],
    },
    {
      value: "INR",
      label: "Indian Rupee (INR)",
      countriesUsedCurrency: ["India"],
    },
    {
      value: "JPY",
      label: "Japanese Yen (JPY)",
      countriesUsedCurrency: ["Japan"],
    },
    {
      value: "KRW",
      label: "South Korean Won (KRW)",
      countriesUsedCurrency: ["South Korea", "Korea South"],
    },

    {
      value: "KHR",
      label: "Cambodian Riel (KHR)",
      countriesUsedCurrency: ["Cambodia"],
    },
    {
      value: "LAK",
      label: "Laotian Kip (LAK)",
      countriesUsedCurrency: ["Laos"],
    },
    {
      value: "LKR",
      label: "Sri Lankan Rupee (LKR)",
      countriesUsedCurrency: ["Sri Lanka"],
    },
    {
      value: "ILS",
      label: "Israeli Shekel (ILS)",
      countriesUsedCurrency: ["Israel"],
    },
    {
      value: "JMD",
      label: "Jamaican Dollar (JMD)",
      countriesUsedCurrency: ["Jamaica"],
    },
    {
      value: "JOD",
      label: "Jordanian Dinar (JOD)",
      countriesUsedCurrency: ["Jordan"],
    },
    {
      value: "KZT",
      label: "Kazakhstani Tenge (KZT)",
      countriesUsedCurrency: ["Kazakhstan"],
    },
    {
      value: "KES",
      label: "Kenyan Shilling (KES)",
      countriesUsedCurrency: ["Kenya"],
    },

    {
      value: "KPW",
      label: "North Korean Won (KPW)",
      countriesUsedCurrency: ["Korea North"],
    },

    {
      value: "KWD",
      label: "Kuwaiti Dinar (KWD)",
      countriesUsedCurrency: ["Kuwait"],
    },
    {
      value: "KGS",
      label: "Kyrgyzstani Som (KGS)",
      countriesUsedCurrency: ["Kyrgyzstan"],
    },
    {
      value: "MAD",
      label: "Moroccan Dirham (MAD)",
      countriesUsedCurrency: ["Morocco"],
    },

    {
      value: "MNT",
      label: "Mongolian Tugrik (MNT)",
      countriesUsedCurrency: ["Mongolia"],
    },
    {
      value: "MYK",
      label: "Malaysian Ringgit (MYK)",
      countriesUsedCurrency: ["Malaysia"],
    },
    {
      value: "MXN",
      label: "Mexican Peso (MXN)",
      countriesUsedCurrency: ["Mexico"],
    },

    {
      value: "NGN",
      label: "Nigerian Naira (NGN)",
      countriesUsedCurrency: ["Nigeria"],
    },
    {
      value: "NOK",
      label: "Norwegian Krone (NOK)",
      countriesUsedCurrency: ["Norway"],
    },
    {
      value: "NPR",
      label: "Nepalese Rupee (NPR)",
      countriesUsedCurrency: ["Nepal"],
    },
    {
      value: "NZD",
      label: "New Zealand Dollar (NZD)",
      countriesUsedCurrency: ["New Zealand"],
    },
    {
      value: "PEN",
      label: "Peruvian Nuevo Sol (PEN)",
      countriesUsedCurrency: ["Peru"],
    },
    {
      value: "PKR",
      label: "Pakistani Rupee (PKR)",
      countriesUsedCurrency: ["Pakistan"],
    },
    {
      value: "RUB",
      label: "Russian Ruble (RUB)",
      countriesUsedCurrency: ["Russian Federation"],
    },
    {
      value: "SEK",
      label: "Swedish Krona (SEK)",
      countriesUsedCurrency: ["Sweden"],
    },
    {
      value: "THB",
      label: "Thai Baht (THB)",
      countriesUsedCurrency: ["Thailand"],
    },
    {
      value: "TRY",
      label: "Turkish Lira (TRY)",
      countriesUsedCurrency: ["Turkey"],
    },
    {
      value: "UCC",
      label: "Ukrainian Hryvnia (UCC)",
      countriesUsedCurrency: ["Ukraine"],
    },
    {
      value: "USD",
      label: "Germany,United States Dollar (USD)",
      countriesUsedCurrency: [
        "Germany",
        "Panama",
        "United States",
        "East Timor",
        "Ecuador",
        "El Salvador",
        "Guatemala",
        "Haiti",
        "Honduras",
        "Jamaica",
        "Jordan",
        "Marshall Islands",
        "Micronesia",
        "Palau",
      ],
    },
    {
      value: "VES",
      label: "Venezuelan Bolívar (VES)",
      countriesUsedCurrency: ["Venezuela"],
    },
    {
      value: "PGK",
      label: "Papua New Guinean Kina (PGK)",
      countriesUsedCurrency: ["Papua New Guinea"],
    },
    {
      value: "PYG",
      label: "Paraguayan Guarani (PYG)",
      countriesUsedCurrency: ["Paraguay"],
    },
    {
      value: "PHP",
      label: "Philippine Peso (PHP)",
      countriesUsedCurrency: ["Philippines"],
    },
    {
      value: "PLN",
      label: "Polish Złoty (PLN)",
      countriesUsedCurrency: ["Poland"],
    },
    {
      value: "QAR",
      label: "Qatari Riyal (QAR)",
      countriesUsedCurrency: ["Qatar"],
    },
    {
      value: "RON",
      label: "Romanian Leu (RON)",
      countriesUsedCurrency: ["Romania"],
    },
    {
      value: "RWF",
      label: "Rwandan Franc (RWF)",
      countriesUsedCurrency: ["Rwanda"],
    },

    {
      value: "WST",
      label: "Samoan Tala (WST)",
      countriesUsedCurrency: ["Samoa"],
    },

    {
      value: "STN",
      label: "São Tomé & Príncipe Dobra (STN)",
      countriesUsedCurrency: ["Sao Tome & Principe"],
    },
    {
      value: "SAR",
      label: "Saudi Riyal (SAR)",
      countriesUsedCurrency: ["Saudi Arabia"],
    },
    {
      value: "RSD",
      label: "Serbian Dinar (RSD)",
      countriesUsedCurrency: ["Serbia"],
    },
    {
      value: "SCR",
      label: "Seychellois Rupee (SCR)",
      countriesUsedCurrency: ["Seychelles"],
    },
    {
      value: "SLL",
      label: "Sierra Leonean Leone (SLL)",
      countriesUsedCurrency: ["Sierra Leone"],
    },
    {
      value: "VND",
      label: "Vietnamese Dong (VND)",
      countriesUsedCurrency: ["Vietnam"],
    },
    {
      value: "VNO",
      label: "Vanuatu Vatu (VNO)",
      countriesUsedCurrency: ["Vanuatu"],
    },
    {
      value: "SGD",
      label: "Singapore Dollar (SGD)",
      countriesUsedCurrency: ["Singapore"],
    },
    {
      value: "SBD",
      label: "Solomon Islands Dollar (SBD)",
      countriesUsedCurrency: ["Solomon Islands"],
    },
    {
      value: "SOS",
      label: "Somali Shilling (SOS)",
      countriesUsedCurrency: ["Somalia"],
    },
    {
      value: "SSP",
      label: "South Sudanese Pound (SSP)",
      countriesUsedCurrency: ["South Sudan"],
    },
    {
      value: "SDG",
      label: "Sudanese Pound (SDG)",
      countriesUsedCurrency: ["Sudan"],
    },
    {
      value: "SRD",
      label: "Surinamese Dollar (SRD)",
      countriesUsedCurrency: ["Suriname"],
    },
    {
      value: "SZL",
      label: "Swazi Lilangeni (SZL)",
      countriesUsedCurrency: ["Swaziland"],
    },
    {
      value: "SYP",
      label: "Syrian Pound (SYP)",
      countriesUsedCurrency: ["Syria"],
    },
    {
      value: "TWD",
      label: "New Taiwan Dollar (TWD)",
      countriesUsedCurrency: ["Taiwan"],
    },
    {
      value: "TJS",
      label: "Tajikistani Somoni (TJS)",
      countriesUsedCurrency: ["Tajikistan"],
    },
    {
      value: "TZS",
      label: "Tanzanian Shilling (TZS)",
      countriesUsedCurrency: ["Tanzania"],
    },
    {
      value: "TOP",
      label: "Tongan Pa'anga (TOP)",
      countriesUsedCurrency: ["Tonga"],
    },
    {
      value: "TTD",
      label: "Trinidad and Tobago Dollar (TTD)",
      countriesUsedCurrency: ["Trinidad & Tobago"],
    },
    {
      value: "TND",
      label: "Tunisian Dinar (TND)",
      countriesUsedCurrency: ["Tunisia"],
    },
    {
      value: "TMT",
      label: "Turkmenistani Manat (TMT)",
      countriesUsedCurrency: ["Turkmenistan"],
    },

    {
      value: "UGX",
      label: "Ugandan Shilling (UGX)",
      countriesUsedCurrency: ["Uganda"],
    },
    {
      value: "UYU",
      label: "Uruguayan Peso (UYU)",
      countriesUsedCurrency: ["Uruguay"],
    },
    {
      value: "UZS",
      label: "Uzbekistani Som (UZS)",
      countriesUsedCurrency: ["Uzbekistan"],
    },

    {
      value: "YER",
      label: "Yemeni Rial (YER)",
      countriesUsedCurrency: ["Yemen"],
    },
    {
      value: "ZMW",
      label: "Zambian Kwacha (ZMW)",
      countriesUsedCurrency: ["Zambia"],
    },
    {
      value: "ZWL",
      label: "Zimbabwean Dollar (ZWL)",
      countriesUsedCurrency: ["Zimbabwe"],
    },
    {
      value: "ZAR",
      label: "South African Rand (ZAR)",
      countriesUsedCurrency: ["South Africa"],
    },
  ]
  const CheckUsernameExistence = async () => {
    const paylaod = {
      username: formData.username,
      type: "admin",
    };
    let url = `${import.meta.env.VITE_API_URL}/api/admin/exist-or-not`;
    try {
      let response = await sendPostRequest(url, paylaod);

      setUserExist(response?.data?.exists || response?.exists);
    } catch (error) {
      setUserExist(error?.data?.exists || error?.exists);
      // toast({
      //   description: `${error?.data?.message}`,

      //   status: "error",
      //   duration: 4000,
      //   position: "top",
      //   isClosable: true,
      // });
      console.log(error);
    }
  };

  function checkUsername(username) {
    let hasAlpha = false;
    let hasNum = false;

    for (let char of username) {
      if (!isNaN(char)) {
        hasNum = true;
      } else {
        hasAlpha = true;
      }

      if (hasAlpha && hasNum) {
        return true;
      }
    }

    return false;
  }
  useEffect(() => {
    // Define a function to perform username validation
    const validateUsername = () => {
      if (formData.username.length > 3 && checkUsername(formData.username)) {
        setValid(false);
        CheckUsernameExistence();
      } else {
        setValid(true);
      }
    };

    let timer;
    if (formData.username.length > 3) {
      timer = setTimeout(validateUsername, 300);
    } else {
      setValid(false);
    }

    return () => clearTimeout(timer); // Cleanup function to clear the timer
  }, [formData.username]);

  const options = useMemo(() => countryList().getData(), []);

  const changeHandler = (value) => {
    setValue(value);
    setFormData((prevFormData) => ({ ...prevFormData, country: value?.label }));
  };
  useEffect(() => {
    changeHandler();
    setFormData((prevFormData) => ({ ...prevFormData, phone: phone }));
  }, [phone]);

  return (
    <>
      <div
        onClick={onOpen}
        className="flex items-end  p-[2px]   rounded-[6px] justify-end"
      >
        <button
          style={{ backgroundColor: bg }}
          className={`flex items-center p-2 gap-2 rounded-[6px] text-xs md:text-sm text-white font-bold `}
        >
          <IoIosPersonAdd fontSize="20px" />
          {t(`Add`)} {t(`New`)} {t(`Admin`)}
        </button>
      </div>
      <Modal size={["sm", "md"]} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <div className=" flex flex-col items-center justify-center mt-5">
              <div className="flex items-center flex-col">
                <img className="w-[60px]" src={adduser} alt="" />
                <p className="text-sm font-semibold">{t(`Add`)} {t(`New`)} {t(`Admin`)}</p>
              </div>
              <div className="w-[100%] mt-6">
                <form onSubmit={CreateAdmin}>
                  <div className="mb-3 flex gap-4">
                    {/* <div>
                        <label
                          className="block mb-1 font-semibold text-sm"
                          htmlFor="user_id"
                        >
                          User ID:
                        </label>
                        <input
                          className="w-full px-3 py-1 outline-none border rounded-md"
                          type="text"
                          id="user_id"
                          name="user_id"
                          value={formData.user_id}
                          onChange={handleChange}
                          required
                        />
                      </div> */}

                    <div className="w-full">
                      <label
                        className="block mb-1 font-semibold text-sm"
                        htmlFor="username"
                      >
                        {t(`Username`)}:
                      </label>
                      <input
                        className={`w-full px-3 ${valid ? "border-red-500" : ""
                          }   py-1 outline-none border rounded-md`}
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                      {userExist ? (
                        <p className="text-xs font-semibold text-red-500">
                          {t(`username already exist`)}
                        </p>
                      ) : (
                        <p className="text-[9px] font-semibold">
                          {t(`User name must be contains alphabet amd numeric value eg. xyz123`)}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* <div className="mb-4 flex gap-4">
                    <div>
                      <label
                        className="block mb-1 text-sm font-semibold "
                        htmlFor="email"
                      >
                        {t(`Email`)}:
                      </label>
                      <input
                        className="w-full px-3 py-1 outline-none border rounded-md"
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="block mb-1 text-sm font-semibold"
                        htmlFor="phone"
                      >
                        {t(`Phone`)}:
                      </label>
                      <PhoneInput
                        placeholder="Enter phone number"
                        value={phone}
                        className="p-2 text-sm"
                        onChange={setPhoneNumber}
                      />
                    </div>
                  </div> */}
                  {/* <div className="mb-4  flex gap-4">
                    <div className="w-[50%]">
                      <label
                        className="block mb-1 text-sm font-semibold"
                        htmlFor="country"
                      >
                        {t(`Country`)}:
                      </label>

                      <Select
                        options={options}
                        value={value}
                        onChange={changeHandler}
                      />
                    </div>

                    <div>
                      <label
                        className="block mb-1 text-sm font-semibold"
                        htmlFor="exposure_limit"
                      >
                        {t(`Company Site`)}:
                      </label>
                      <input
                        className="w-full px-3 text py-1 outline-none border rounded-md"
                        type=""
                        id="exposure_limit"
                        disabled
                        name="exposure_limit"
                        value={filteredData[0]?.site_name}
                        required
                      >
                        </input>
                    </div>
                  </div> */}
                  <div className="mb-4 flex gap-4">
                    <div>
                      <label
                        className="block mb-1 font-semibold text-sm"
                        htmlFor="password"
                      >
                        {t(`Password`)}:
                      </label>
                      <div className="relative">
                        <input
                          className="w-full px-3 py-1 outline-none border rounded-md"
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        <button
                          className="absolute top-0 right-0 mr-2 mt-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                          onClick={() => setShowPassword(!showPassword)}
                          type="button"
                        >
                          {showPassword ? (
                            <IoEyeSharp
                              cursor={"pointer"}
                              fontSize="20px"
                              color="gray"
                            />
                          ) : (
                            <IoEyeOffSharp
                              cursor={"pointer"}
                              fontSize="20px"
                              color="gray"
                            />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        className="block mb-1 font-semibold text-sm"
                        htmlFor="confirm_password"
                      >
                        {t(`Confirm Password`)}:
                      </label>
                      <div className="relative">
                        <input
                          className="w-full px-3 py-1 outline-none border rounded-md"
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirm_password"
                          name="confirm_password"
                          value={formData.confirm_password}
                          onChange={handleChange}
                          required
                        />
                        <button
                          className="absolute top-0 right-0 mr-2 mt-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          type="button"
                        >
                          {showConfirmPassword ? (
                            <IoEyeSharp
                              cursor={"pointer"}
                              fontSize="20px"
                              color="gray"
                            />
                          ) : (
                            <IoEyeOffSharp
                              cursor={"pointer"}
                              fontSize="20px"
                              color="gray"
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* <div className="mb-0 flex gap-4">
                    <div className="mb-4">
                      <label
                        className="block mb-1 text-sm font-semibold"
                        htmlFor="deposit_amount"
                      >
                        {t(`Deposit`)} {t(`Amount`)}:
                      </label>
                      <input
                        className="w-full px-3 py-1 outline-none border rounded-md"
                        type="number"
                        id="deposit_amount"
                        name="amount"
                        value={formData?.deposit_amount?.toFixed(2)}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="block mb-1 text-sm font-semibold"
                        htmlFor="exposure_limit"
                      >
                        {t(`Select`)} {t(`Currency`)}:
                      </label>
                      <select
                        value={formData?.currency}
                        onChange={handleChange}
                        name="currency"
                        className="w-full px-3 py-[6px] text-sm outline-none border rounded-md"
                      >
                        <option value="">{t(`Select`)} {t(`Currency`)}</option>
                        {currencyOptions
                          .slice() // create a shallow copy of the array to avoid mutating the original
                          .sort((a, b) => a.label.localeCompare(b.label)) // sort alphabetically based on labels
                          .map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div> */}
                  {/* <div className="flex gap-4">

                  <div className="w-[100%]">
                    <label
                      className="block mb-1 text-sm font-semibold mt-0"
                      htmlFor="select_layer"
                    >
                      {t(`Select Layer`)}:
                    </label>
                    <select
                      className="w-full px-3 py-1 outline-none border rounded-md"
                      id="select_layer"
                      name="role_type"
                      value={formData.role_type}
                      onChange={handleChange}
                      required
                    >
                      <option>{t(`Select Layer`)} </option>

                      {adminLayer?.slice(0, -1).map((ele) => (
  <option value={ele}>{t(ele)}</option>
))}
                    </select>
                  </div>
                  <div className="mb-4 w-[100%]">
                      <label
                        className="block mb-1 text-sm font-semibold"
                        htmlFor="share_percentage"
                      >
                        {t(`Share`)} {t(`%`)}:
                      </label>
                      <input
                        className="w-full px-3 py-1 outline-none border rounded-md"
                        type="number"
                        id="share_percentage"
                        name="share_percentage"
                        value={formData?.share_percentage}
                        onChange={handleChange}
                        required
                      />
                    </div>
</div> */}

                  <div className="flex my-5 mt-6 gap-2 justify-between">
                    <button
                      className="bg-gray-300 font-semibold  w-[100%] py-[6px] rounded-md mr-2"
                      type="button"
                      onClick={onClose}
                    >
                      {t(`Cancel`)}
                    </button>
                    <button
                      style={{ backgroundColor: bg }}
                      className={` w-[100%] text-white px-4 font-semibold py-[6px] rounded-md"`}
                      type="submit"
                    >
                      {loading ? (
                        <LoadingSpinner
                          color="white"
                          size="sm"
                          thickness={"2px"}
                        />
                      ) : (
                        `${t(`Create`)}`
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddNewUserAdmin;
