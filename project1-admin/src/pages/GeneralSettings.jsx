import {
  Button,
  CircularProgress,
  Input,
  Select,
  Switch,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const GeneralSettings = () => {
  const [country, setCountry] = useState("");
  const toast = useToast();
  const [loading, setLoading] = useState(false);
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

  const [rules, setRules] = useState({
    _id: "652a38fb2a2e359a326f3cd3",
    title: "",
    agree_policy: true,
    bet_max: 1000,
    bet_min: 10,
    color: "#FF5733",
    currency: "",
    currency_symbol: "$",
    email_notification: true,
    email_verification: true,
    force_secure_password: true,
    force_ssl: true,
    max_profit: 5000,
    min_profit: 0, // Replace with an appropriate value
    sms_notification: false,
    sms_verification: false,
    strong_password: true,
    timezone: "India",
    user_registration: true,
    user_resistration: false, // Typo in the property name, assuming you meant 'user_registration'
    withdraw_max: 2000,
    withdraw_min: 50,
    bet_timing: 4000,
  });

  //   const fetchGeneralSetting = async () => {
  //     try {
  //       const data = await fetchGetRequest(
  //         `${process.env.NEXT_PUBLIC_BASE_URL}/api/rules/get-rules/652a38fb2a2e359a326f3cd3`
  //       );

  //       setRules(data.data);
  //     } catch (error) {}
  //   };

  useEffect(() => {
    // fetchGeneralSetting();
  }, []);

  const handleUpdateRule = async () => {
    setLoading(true);
    const payload = { ...rules, counntry: country };
    // try {
    //   const response = await sendPatchRequest(
    //     `${process.env.NEXT_PUBLIC_BASE_URL}/api/rules/update-rules/652a38fb2a2e359a326f3cd3`,
    //     payload
    //   );
    //   let data = response.data;
    //   setRules(data);
    //   setLoading(false);
    //   toast({
    //     title: response.message,
    //     status: "success",
    //     position: "top",
    //     duration: 4000,
    //     isClosable: true,
    //   });
    // } catch (error) {
    //   setLoading(false);
    //   toast({
    //     title: error.message,
    //     status: "error",
    //     position: "top",
    //     duration: 4000,
    //     isClosable: true,
    //   });
    // }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    setRules({ ...rules, [name]: value });
  };
  const handleCountry = (e) => {
    setCountry(e.target.value);
  };

  const [selectedColor, setSelectedColor] = useState("#003FA7");
  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
  };
  const handleSwitch = (e) => {
    const { name, checked } = e.target;
    setRules({ ...rules, [name]: checked });
  };

  return (
    <div className="p-4">
      <p
      
      style={{color:iconColor}}
      className={`font-semibold   text-lg`}>General Setting</p>
      <div
        className={` rounded-[8px] font-semibold px-5 py-6 bg-white mt-4 w-[100%]  `}
      >
        <div className="grid  sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Site Title</p>
            <input
            style={{border:`1px solid ${border}`}}
              className={`  p-2 rounded-[8px] outline-none  text-sm `}
              placeholder="Baji Live"
              name="title"
              value={rules?.title}
              onChange={handleChange}
            />
          </div>
          <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Currency</p>
            <input
            style={{border:`1px solid ${border}`}}

              className={`  p-2 rounded-[8px] outline-none  text-sm `}
              placeholder="currency"
              name="currency"
              value={rules?.currency}
              onChange={handleChange}
            />
          </div>
          <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Currency Symbol</p>
            <input
            style={{border:`1px solid ${border}`}}

              className={` border p-2 rounded-[8px] outline-none  text-sm `}
              placeholder="currency symbol"
              name="currency_symbol"
              value={rules?.currency_symbol}
              onChange={handleChange}
            />
          </div>
          <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Timezone</p>
            <select
            style={{border:`1px solid ${border}`}}

              className={` border p-2 rounded-[8px] outline-none  text-sm `}
              onChange={handleCountry}
              color={"white"}
              placeholder="Select a time zone"
              value={rules?.timezone}
            >
              <option value="Asia/Dhaka">Asia/Dhaka</option>

              <option value="Asia/Dubai">Asia/Dubai</option>
              <option value="Asia/Colombo">Asia/Colombo</option>
              {/* Add more options here if needed */}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 mt-6 gap-4">
        <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Bet Minimum Limit</p>
            <input
            style={{border:`1px solid ${border}`}}

              className={` border p-2 rounded-[8px] outline-none  text-sm `}
              placeholder="Bet Minimum Limit"
              name="bet_min"
              type="number"
              value={rules?.bet_min}
              onChange={handleChange}
            />
          </div>
          <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Bet Maximum Limit</p>
            <input
            style={{border:`1px solid ${border}`}}

              className={` border p-2 rounded-[8px] outline-none  text-sm `}
              placeholder="Bet Maximum Limit"
              name="bet_max"
              value={rules?.bet_max}
              onChange={handleChange}
              type="number"
            />
          </div>
          <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Match Odds Delay (1 Second = 1000</p>
            <input
            style={{border:`1px solid ${border}`}}

              className={` border p-2 rounded-[8px] outline-none text-sm `}
              placeholder="Bet Minimum Limit"
              name="bet_min"
              type="number"
              value={rules?.bet_min}
              onChange={handleChange}
            />
          </div>
       
          <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Bookmaker Delay (1 Second = 1000)</p>
            <input
            style={{border:`1px solid ${border}`}}

              className={` border p-2 rounded-[8px] outline-none  text-sm `}
              placeholder="Bet Maximum Limit"
              value={rules?.bet_timing}
              name="bet_timing"
              onChange={handleChange}
              type="number"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 mt-6 gap-4">
        <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Match Odds max Bet (Single Shot)</p>
            <input
            style={{border:`1px solid ${border}`}}

              className={`  p-2 rounded-[8px] outline-none  text-sm `}
              placeholder="Bet Minimum Limit"
              name="bet_min"
              type="number"
              value={rules?.bet_min}
              onChange={handleChange}
            />
          </div>
          <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Session Delay (1 Second = 1000)
</p>
            <input
            style={{border:`1px solid ${border}`}}

              className={`  p-2 rounded-[8px] outline-none  text-sm `}
              placeholder="Bet Minimum Limit"
              name="bet_min"
              type="number"
              value={rules?.bet_min}
              onChange={handleChange}
            />
          </div>
          <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Premmium Delay (1 Second = 1000)</p>
            <input
            style={{border:`1px solid ${border}`}}

              className={`  p-2 rounded-[8px] outline-none  text-sm `}
              placeholder="Bet Maximum Limit"
              name="bet_max"
              value={rules?.bet_max}
              onChange={handleChange}
              type="number"
            />
          </div>
          <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Other Betfair Market Delay(1 Second = 1000)</p>
            <input
            style={{border:`1px solid ${border}`}}

              className={`  p-2 rounded-[8px] outline-none  text-sm `}
              placeholder="Bet Maximum Limit"
              value={rules?.bet_timing}
              name="bet_timing"
              onChange={handleChange}
              type="number"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 mt-6 gap-4">
        <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Bookmaker Max Bet (Single Shot)
</p>
            <input
            style={{border:`1px solid ${border}`}}

              className={`  p-2 rounded-[8px] outline-none  text-sm `}
              placeholder="Bet Minimum Limit"
              name="bet_min"
              type="number"
              value={rules?.bet_min}
              onChange={handleChange}
            />
          </div>
          <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Session max bet (Single Shot)</p>
            <input
            style={{border:`1px solid ${border}`}}

              className={`  p-2 rounded-[8px] outline-none  text-sm `}
              placeholder="Bet Minimum Limit"
              name="bet_min"
              type="number"
              value={rules?.bet_min}
              onChange={handleChange}
            />
          </div>
          <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Premium Max bet (Single Shot)
</p>
            <input
            style={{border:`1px solid ${border}`}}

              className={`  p-2 rounded-[8px] outline-none  text-sm `}
              placeholder="Bet Maximum Limit"
              name="bet_max"
              value={rules?.bet_max}
              onChange={handleChange}
              type="number"
            />
          </div>
          <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Other Betfair Market Max Bet (Single Shot)</p>
            <input
            style={{border:`1px solid ${border}`}}

              className={`  p-2 rounded-[8px] outline-none  text-sm `}
              placeholder="Bet Maximum Limit"
              value={rules?.bet_timing}
              name="bet_timing"
              onChange={handleChange}
              type="number"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 mt-6 gap-4">
        <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Match Odds Max Odds</p>
            <input
            style={{border:`1px solid ${border}`}}

              className={`  p-2 rounded-[8px] outline-none  text-sm `}
              placeholder="Bet Minimum Limit"
              name="bet_min"
              type="number"
              value={rules?.bet_min}
              onChange={handleChange}
            />
          </div>
          <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Other Betfair Market Max Odds</p>
            <input
            style={{border:`1px solid ${border}`}}

              className={`  p-2 rounded-[8px] outline-none  text-sm `}
              placeholder="Bet Minimum Limit"
              name="bet_min"
              type="number"
              value={rules?.bet_min}
              onChange={handleChange}
            />
          </div>
          <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Match Odds max Profit</p>
            <input
            style={{border:`1px solid ${border}`}}

              className={`  p-2 rounded-[8px] outline-none  text-sm `}
              placeholder="Bet Maximum Limit"
              name="bet_max"
              value={rules?.bet_max}
              onChange={handleChange}
              type="number"
            />
          </div>
          <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Bookmaker Max Profit</p>
            <input
            style={{border:`1px solid ${border}`}}

              className={`  p-2 rounded-[8px] outline-none  text-sm `}
              placeholder="Bet Maximum Limit"
              value={rules?.bet_timing}
              name="bet_timing"
              onChange={handleChange}
              type="number"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 mt-6 gap-4">
        <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Session max Profit (Per Market)</p>
            <input
            style={{border:`1px solid ${border}`}}

              className={`  p-2 rounded-[8px] outline-none  text-sm `}
              placeholder="Bet Minimum Limit"
              name="bet_min"
              type="number"
              value={rules?.bet_min}
              onChange={handleChange}
            />
          </div>
          <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Premium Max profit (Per Market)
</p>
            <input
            style={{border:`1px solid ${border}`}}

              className={`  p-2 rounded-[8px] outline-none  text-sm `}
              placeholder="Bet Minimum Limit"
              name="bet_min"
              type="number"
              value={rules?.bet_min}
              onChange={handleChange}
            />
          </div>
          <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Other Betfair Market Max Profit (Per Market)</p>
            <input
            style={{border:`1px solid ${border}`}}

              className={`  p-2 rounded-[8px] outline-none  text-sm `}
              placeholder="Bet Maximum Limit"
              name="bet_max"
              value={rules?.bet_max}
              onChange={handleChange}
              type="number"
            />
          </div>
          <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Minimum Volume For Betfair Market</p>
            <input
            style={{border:`1px solid ${border}`}}

              className={`  p-2 rounded-[8px] outline-none  text-sm `}
              placeholder="Bet Maximum Limit"
              value={rules?.bet_timing}
              name="bet_timing"
              onChange={handleChange}
              type="number"
            />
          </div>
        </div>

        <div className="flex grid-cols-1 md:grid-cols-2 mt-6 gap-4">
          <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Withdraw Minimum Limit</p>
            <input
            style={{border:`1px solid ${border}`}}

              className={`  p-2 rounded-[8px] outline-none text-sm `}
              placeholder="Withdraw Minimum Limit"
              value={rules?.withdraw_min}
              type="number"
            />
          </div>
          <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Withdraw Maximum Limit</p>
            <input
            style={{border:`1px solid ${border}`}}

              className={`  p-2 rounded-[8px] outline-none  text-sm `}
              placeholder="Withdraw Maximum Limit"
              type="number"
              value={rules?.withdraw_max}
              onChange={handleChange}
              name="withdraw_max"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mt-6 gap-4">
          <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Force Secure Password</p>
            <Switch
              isChecked={rules?.force_secure_password === true ? true : false}
              colorScheme="blue"
              name="force_secure_password"
              onChange={handleSwitch}
              size="lg"
            />
          </div>
          <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Agree policy</p>
            <Switch
              isChecked={rules?.agree_policy === true ? true : false}
              colorScheme="blue"
              name="agree_policy"
              onChange={handleSwitch}
              size="lg"
            />
          </div>
          <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">User Registration</p>
            <Switch
              isChecked={rules?.user_registration === true ? true : false}
              colorScheme="blue"
              name="user_registration"
              onChange={handleSwitch}
              size="lg"
            />
          </div>
          <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Force SSL</p>
            <Switch
              isChecked={rules?.force_ssl === true ? true : false}
              colorScheme="blue"
              name="force_ssl"
              onChange={handleSwitch}
              size="lg"
            />
          </div>
          <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Email Verification</p>
            <Switch
              isChecked={rules?.email_verification === true ? true : false}
              colorScheme="blue"
              name="email_notification"
              onChange={handleSwitch}
              size="lg"
            />
          </div>
          <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Email Notification</p>
            <Switch
              isChecked={rules?.email_notification === true ? true : false}
              colorScheme="blue"
              name="email_notification"
              onChange={handleSwitch}
              size="lg"
            />
          </div>
          <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">SMS Verification</p>
            <Switch
              isChecked={rules?.sms_notification === true ? true : false}
              colorScheme="blue"
              name="sms_notification"
              onChange={handleSwitch}
              size="lg"
            />
          </div>
          <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">SMS Notification</p>
            <Switch
              isChecked={rules?.sms_verification === true ? true : false}
              colorScheme="blue"
              name="sms_verification"
              onChange={handleSwitch}
              size="lg"
            />
          </div>
          <div className="flex w-[100%] flex-col gap-2">
            <p className=" text-xs text-semibold">Strong Password</p>
            <Switch
              isChecked={rules?.strong_password === true ? true : false}
              colorScheme="blue"
              name="strong_password"
              onChange={handleSwitch}
              size="lg"
            />
          </div>
        </div>

        <button
          onClick={handleUpdateRule}
          className={`w-[100%] ${bg} text-white p-2 mt-5 rounded-lg`}
        >
          {loading ? (
            <CircularProgress isIndeterminate color="blue.300" />
          ) : (
            "Save Change"
          )}
        </button>
      </div>
    </div>
  );
};

export default GeneralSettings;
