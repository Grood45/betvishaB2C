import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import coin from "../../assets/rupees.png";
import logo from "../../assets/logo.png";
import { BsFillCalendar2DateFill } from "react-icons/bs";
import {
  Button,
  Input,
  Progress,
  Radio,
  RadioGroup,
  Select,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { fetchGetRequest } from "../../api/api";
import { useTranslation } from "react-i18next";
import { convertToUniversalTime, formatDate, getGameProvider } from "../../../utils/utils";
import { IoMdCloudDownload } from "react-icons/io";
import html2pdf from "html2pdf.js";
const ProfitLossByUser = () => {
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
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [pagination, setPagination] = useState({});
  const [activeCategory, setActiveCategory] = useState("-1");
  const totalPages = pagination.totalPages;
  const [totalGGr, setTotalGGR] = useState({});
  const [limit, setLimit] = useState(20);
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([]);
  const [providerId, setProviderId] = useState("");
  const [username, setUsername] = useState("");
  const [currency, setCurrency] = useState("");
  const [siteData, setSiteData] = useState({});
  const [providerData, setProviderData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(""); // Default value for Week

  const handleOptionChange = (value, id) => {
    setSelectedOption(value);
    setActiveCategory(id);
    setCurrentPage(1)
  };
  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const [search, setSearch] = useState("");
  const toast = useToast();

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
    setCurrentPage(1)
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const getProfitUserData = async () => {
    setLoading(true);

    const formattedFromDate = fromDate
      ? new Date(fromDate).toISOString().split("T")[0]
      : "";
    const formattedToDate = toDate
      ? new Date(toDate).toISOString().split("T")[0]
      : "";

    let url = `${
      import.meta.env.VITE_API_URL
    }/api/bet/get-ggr-report-by-date?start_date=${formattedFromDate}&end_date=${formattedToDate}&limit=${limit}&page=${currentPage}`;

    if (username) {
      url += `&username=${username}`;
    }
    if (currency) {

      url += `&currency=${currency}`;
    }
    if (providerId) {

      url += `&provider_id=${providerId}`;
    }
    if (formattedFromDate && formattedToDate) {
      
      url += `&from=${formattedFromDate}&to=${formattedToDate}`;
    } else {
      url += `&filter=${selectedOption}`;
    }

    try {
      let response = await fetchGetRequest(url);
      setLoading(false);
      if (response) {
        setData(response.records);
        setTotalGGR(response?.graphData[0]);
        setPagination(response.pagination);
      }
    } catch (error) {
      setLoading(false);
      toast({
        description: `${error?.data?.message || error?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      console.log(error);
    }
  };
  const getAllCasinoProvider = async () => {
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/casinoprovider/get-provider?limit=200`;

    try {
      let response = await fetchGetRequest(url);
      const data = response.data;
      setProviderData(data);
    } catch (error) {
      toast({
        description: `${error?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCasinoProvider();
  }, []);
  useEffect(() => {
    let id;
    id = setTimeout(() => {
      getProfitUserData();
    }, 200);

    return () => clearTimeout(id);
  }, [
    currentPage,
    toDate,
    limit,
    providerId,
    username,
    selectedOption,
    currency,
  ]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const filterByDay = [
    {
      id: 1,
      title: "24H",
      value: "day",
    },
    {
      id: 2,
      title: "7 Days",
      value: "week",
    },
    {
      id: 3,
      title: "30 DAYS",
      value: "last_30_days",
    },
    {
      id: 4,
      title: "TODAY",
      value: "day",
    },
    {
      id: 5,
      title: "YESTERDAY",
      value: "yesterday",
    },
    {
      id: 6,
      title: "THIS MONTH",
      value: "this_month",
    },
    {
      id: 7,
      title: "PREVIOUS MONTH",
      value: "last_month",
    },
  ];

  const { selectedWebsite, siteDetails } = useSelector(
    (state) => state.websiteReducer
  );
  let filteredData = siteDetails.filter((item) => item.selected === true);

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
  ];
  const handleDownloadReport = async () => {
    const formattedFromDate = fromDate
      ? new Date(fromDate).toISOString().split("T")[0]
      : "";
    const formattedToDate = toDate
      ? new Date(toDate).toISOString().split("T")[0]
      : "";

    let url = `${
      import.meta.env.VITE_API_URL
    }/api/bet/get-bet-report-for-pdf?start_date=${formattedFromDate}&end_date=${formattedToDate}`;

    if (username) {
      url += `&username=${username}`;
    }
    if (currency) {
      url += `&currency=${currency}`;
    }
    if (formattedFromDate && formattedToDate) {
      url += `&from=${formattedFromDate}&to=${formattedToDate}`;
    } else {
      url += `&filter=${selectedOption}`;
    }

    try {
      let response = await fetchGetRequest(url);
      const { data, graphData } = response;

      // Convert tabular data to HTML table
      const tableHtml = generateTableHtml(data);

      // Convert HTML to PDF with custom styling
      const options = {
        filename: "report.pdf",
        html2canvas: {},
        jsPDF: { orientation: "landscape" },
        image: { type: "jpeg", quality: 0.98 },
        pagebreak: { mode: "avoid-all" },
        margin: [10, 10],
        html2pdf: {
          width: 700,
          height: 900,
          html2canvas: { scale: 2 },
          pagebreak: { before: ".break-page" },
          jsPDF: { unit: "px", format: "a4" },
        },
      };

      html2pdf().set(options).from(tableHtml).save();

      toast({
        description: `Download successful`,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    } catch (error) {
      toast({
        description: `${error?.data?.message || error?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      console.log(error);
    }
  };

  // Function to generate HTML table from tabular data
  const generateTableHtml = (records) => {
    if (!Array.isArray(records) || records.length === 0) {
      return "<p>No records found</p>";
    }

    const tableRows = records.map((record,index) => {
      // Calculate the difference between Amount and WinLoss
      const winLossDiff = record.WinLoss === "0" ? record.Amount :record?.WinLoss;
      // Determine the class based on winLossDiff
      const value = record ? record.WinLoss === "0" ? "-" : "+" : "";

      const winLossClass = record.WinLoss === "0" ? "text-red-600 font-bold" : "text-green-500 font-bold";

      // Determine the class for the Status column
      const statusClass =
        record.WinLoss === "0" ? "text-red-500" : "text-green-500";
         const statusData=record?.WinLoss==="0"?"Lose":"Win"
      // Get the game provider name based on GpId
      const gameProviderName = getGameProvider(record.GpId);

      return `
        <tr class="text-xs">
          <td class="border text-xs px-4 py-2">${index}</td>
          <td class="border px-4 py-2">${record.GameId}</td>
          <td class="border px-4 py-2">${record.GpId}</td>
          <td class="border px-4 py-2">${record.Username}</td>
          <td class="border px-4 py-2">${filteredData[0].site_name}</td>
          <td class="border px-4 py-2">${record.Currency}</td>
          <td class="border px-4 py-2 ${winLossClass}"> ${value} ${winLossDiff}</td>

          <td class="border px-4 py-2">${record.BetTime}</td>

          <td class="border px-4 py-2 ${statusClass} font-bold">(${statusData})</td>

         
          
         
        </tr>
      `;
    });

    const tableHtml = `
      <div>
        <p class="font-bold text-center text-lg my-4">Player Wise Report Card</p>
        <table class="w-full">
          <thead>
            <tr>
              <th class="px-4 py-2 bg-gray-200">S.No</th>
              <th class="px-4 py-2 bg-gray-200">Game Code</th>
              <th class="px-4 py-2 bg-gray-200">Provider Code</th>
              <th class="px-4 py-2 bg-gray-200">Display Name</th>
              <th class="px-4 py-2 bg-gray-200">Partner</th>
              <th class="px-4 py-2 bg-gray-200">Currency</th>
              <th class="px-4 py-2 bg-gray-200">P/L</th>
              <th class="px-4 py-2 bg-gray-200">Created Date</th>
              <th class="px-4 py-2 bg-gray-200">Result</th>


            </tr>
          </thead>
          <tbody>
            ${tableRows.join("")}
          </tbody>
        </table>
      </div>
    `;

    return tableHtml;
  };

  // Function to generate HTML table from tabular data

  return (
    <div>
      <div>
        <p
          style={{ color: iconColor }}
          className={`font-bold   w-[100%]    flex items-center gap-2 rounded-[6px]   text-md`}
        >
          <BsFillCalendar2DateFill
            style={{ color: iconColor }}
            fontSize={"15px"}
          />
          {t(`Player Wise Report`)}
        </p>
      </div>
      <div className=" mt-5 rounded-2xl bg-white shadow-sm min-h-[200px] p-5 py-6">
        <div className="flex flex-wrap  items-center gap-2 ">
          {filterByDay?.map((item) => {
            return (
              <div>
                <button
                  onClick={() => handleOptionChange(item?.value, item?.id)}
                  style={{
                    backgroundColor: activeCategory === item?.id ? bg : "",
                    border: `1px solid ${border}`,
                  }}
                  className={`text-xs p-2 ${
                    activeCategory === item?.id ? "text-white" : ""
                  } font-semibold min-w-[70px]  rounded-md  `}
                >
                  {item?.title}
                </button>
              </div>
            );
          })}
        </div>
        <div className="flex gap-2 mt-6  md:w-[630px] items-center">
          <div className="flex w-[100%] flex-col  items-start ">
            <p className="font-bold text-sm">
              {t(`From`)} {t(`Date`)}
            </p>
            <input
              type="date"
              style={{ border: `1px solid ${border}` }}
              // min={today}
              className={` outline-none w-[100%]  rounded px-3 text-xs py-1`}
              value={fromDate}
              onChange={handleFromDateChange}
            />
          </div>
          <div className="flex w-[100%] flex-col  items-start ">
            <p className="font-bold text-sm">
              {t(`To`)} {t(`Date`)}
            </p>
            <input
              type="date"
              style={{ border: `1px solid ${border}` }}
              // min={today}
              className={` ml-2 outline-none w-[100%] rounded px-3 py-1 text-xs `}
              value={toDate}
              onChange={handleToDateChange}
            />
          </div>
        </div>

        <div className="w-[100%] mt-6 flex flex-wrap sm:flex-nowrap justify-between items-center gap-4">
          <div className="flex w-[100%] flex-col  items-start ">
            <p className="font-bold text-sm">
              {" "}
              {t(`Provider`)} {t(`Wise`)}
            </p>
            <Select
              onChange={(e) => {
                setProviderId(e.target.value)
                setCurrentPage(1)
              }}
              height={"30px"}
              style={{ border: `1px solid ${border}` }}
            >
              <option value="">
                {t(`Select`)} {t(`Provider`)}
              </option>

              {providerData?.map((item) => {
                return <option value={item.gpId}>{item?.gpName}</option>;
              })}
            </Select>
          </div>
          <div className="flex w-[100%] flex-col  items-start ">
            <p className="font-bold text-sm">
              {t(`Currency`)} {t(`wise`)}
            </p>
            {/* <Select
              onChange={(e) =>{ 
                setCurrency(e.target.value)
                setCurrentPage(1)
              }}
              height={"30px"}
              style={{ border: `1px solid ${border}` }}
            >
              <option value="">
                {t(`Select`)} {t(`Currency`)}
              </option>
              {currencyOptions?.map((item) => {
                return <option value={item.value}>{item?.label}</option>;
              })}
            </Select> */}
            <Select 
             height={"30px"}
             style={{ border: `1px solid ${border}` }}
            >
              <option>INR</option>
            </Select>
          </div>
          
          <div className="flex w-[100%] flex-col  items-start ">
            {/* <p className="font-bold text-sm">{t(`Company`)} {t(`Group`)}</p>
            <Select
              disabled
              height={"30px"}
              style={{ border: `1px solid ${border}` }}
            >
              <option>{filteredData[0]?.site_name}</option>
            </Select> */}
          </div>
        </div>

        <div className="flex justify-between w-[100%] mt-5  items-center">
          <div className="flex  flex-col items-start ">
            <p className="text-sm font-bold">{t(`Search`)}</p>
            <div className="flex items-center gap-2">
              <input
                onChange={(e) => {
                  setUsername(e.target.value)
                  setCurrentPage(1)
                
                }}
                style={{ border: `1px solid ${border}` }}
                className=" w-[100%] sm:w-[400px] outline-none rounded-md p-[5px] text-sm"
                placeholder="enter username"
              />

              <span
                style={{ backgroundColor: bg }}
                className="px-1 py-[2px] rounded-md cursor-pointer"
              >
                <IoMdCloudDownload
                  onClick={handleDownloadReport}
                  fontSize={"25px"}
                  color="white"
                />
              </span>
            </div>
          </div>
          <div className="flex pr-5  gap-2">
            <p className="flex text-xs font-bold">
              {t(`Total`)} {t(`GGR`)}:{" "}
              <span className="font-medium">{totalGGr?.ggr}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="  ">
        <div
          className={`h-[100%] overflow-scroll rounded-[8px] md:rounded-[16px] bg-white p-3   w-[100%]  mt-5`}
        >
          {loading && (
            <Progress size="xs" isIndeterminate colorScheme="#e91e63" />
          )}

          <table className={`w-[100%]  `}>
            <tr
              style={{ borderBottom: `1px solid ${border}` }}
              className={`text-center p-2 rounded-md  h-[30px]  text-[10px] font-bold `}
            >
              <th className="text-left w-[100px]">
                {t(`S.No`)} 
              </th>
              <th className="min-w-[60px]">{t(`Game Code`)} </th>
              <th className="min-w-[50px]">{t(`Provider`)} {t(`Code`)}</th>
              <th className="min-w-[50px]">{t(`Display`)} {t(`Name`)}</th>
              <th className="min-w-[50px]">{t(`Partner`)} {t(`Name`)}</th>
              <th className="min-w-[50px]">{t(`Currency`)} {t(`Name`)}</th>
              <th className="min-w-[50px]">{t(`P/L`)}</th>
              <th className="min-w-[50px]">{t(`Created`)} {t(`Date`)}</th>
              <th className="min-w-[50px]">{t(`Result`)} </th>


            </tr>
            <tbody className=" ">
              {data &&
                data.map((item,index) => {
                  const timePart = item.BetTime.split(' ')[1];
                  const seccondPart=item.BetTime.split(' ')[2]
                  const time12Hour = `${timePart} ${seccondPart}`;
                  const time24Hour = convertToUniversalTime(time12Hour);
                  return (
                    <tr
                      key={item?._id}
                      style={{ borderBottom: `1px solid ${border}` }}
                      className={`text-center  h-[60px] m-auto   text-xs `}
                    >
                      <td className="text-left">{index}</td>
                      <td className="">{item?.GameId}</td>
                      <td className="">{item?.GpId}</td>


                      <td className="">
                        <div className="flex  flex-col ">
                          <p>{item.Username}</p>
                        </div>
                      </td>
<td>
  {/* {filteredData[0]?.site_name} */}
  LuckyDaddy
</td>
<td>
  {item?.Currency}
</td>
<td className={` ${item?.WinLoss=='0'?"text-red-500":"text-green-600"} font-bold `}>
{item?.WinLoss=='0'?"-":"+"} {item?.WinLoss=='0'?item?.Amount:item?.WinLoss}
</td>
                      <td>
                        <div className="flex flex-col items-center justify-center gap-1">
                          <p>{formatDate(item?.BetTime.split(" ")[0])}</p>
                          <p className="text-xs font-bold">
                            ({time24Hour})
                          </p>
                        </div>
                      </td>
                      <td className={` ${item?.WinLoss=='0'?"text-red-500":"text-green-600"} font-bold `} >
                         {item?.WinLoss=='0'?"Lose":"Win"}
                      </td>

                     
                    </tr>
                  );
                })}
            </tbody>
           
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p style={{ color: iconColor }} className="text-xs font-semibold ">
          {t(`Showing`)} 1 {t(`to`)} {limit} {t(`of`)} {pagination.totalPages}{" "}
          {t(`Entries`)}
        </p>
        <div
          className={`text-[16px]   text-sm font-semibold flex  mt-5 mr-5 justify-end gap-3 align-middle items-center`}
        >
          <button
            type="button"
            style={{
              backgroundColor: bg,
              border: `1px solid ${border}`,
              color: "white",
              fontSize: "12px",
            }}
            className={`ml-1 px-2 py-[4px] cursor-pointer  rounded-[5px] text-[20px]`}
            onClick={() => handlePrevPage()}
            disabled={currentPage == 1}
          >
            {"<"}
          </button>
          {t(`Page`)} <span>{currentPage}</span> of{" "}
          <span>{pagination?.totalPages}</span>
          <button
            onClick={() => handleNextPage()}
            type="button"
            className={`ml-1 px-2 py-[4px] cursor-pointer rounded-[5px] text-[20px]`}
            style={{
              backgroundColor: bg,
              border: `1px solid ${border}`,
              color: "white",
              fontSize: "12px",
            }}
            disabled={currentPage == pagination?.totalPages}
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfitLossByUser;
