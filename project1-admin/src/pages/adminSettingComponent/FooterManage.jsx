import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import CreateLink from "../../Modals/CreateLink";
import { useSelector } from "react-redux";
import { fetchGetRequest } from "../../api/api";
import { useToast } from "@chakra-ui/react";
import QuestionAnswer from "../../component/QuestionAnwer";
import FooterPaymentTerms from "./FooterPaymentTerms";
import { useTranslation } from "react-i18next";
import { checkPermission } from "../../../utils/utils";
const FooterManage = () => {
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
  const [footerData, setFooterData] = useState([]);
  const toast = useToast();
  const [faq, setFaq] = useState([{ question: "", answer: "" }]);
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(false);

  const getFooterData = async () => {
    setLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/navigation/get-all-navigation`;
    try {
      let response = await fetchGetRequest(url);
      setFooterData(response.data);

      setLoading(false);
    } catch (error) {
      toast({
        description: `${error?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    getFooterData();
  }, []);
  const user = useSelector((state) => state.authReducer);

  const adminData = user.user || {};
  const isOwnerAdmin = adminData?.role_type === "owneradmin";

  const permissionDetails = user?.user?.permissions;

  let hasPermission = checkPermission(permissionDetails, "footerContentManage");
  let check = !isOwnerAdmin ? hasPermission : true;

  return (
    <div className={` flex flex-col gap-10 `}>
      <div className="bg-white shadow-md rounded px-3 lg:px-8  pt-6 pb-8 mb-4">
        <div className="flex justify-between items-center ">
          <h2 className="text-lg font-semibold mb-4">
            {t(`Create`)} {t(`footer`)} {t(`Link`)}
          </h2>
          {/* <CreateLink type="1" /> */}
        </div>

        <div className="grid sm:grid-cols-2 mt-1 md:grid-cols-3 lg:grid-cols-4  gap-6">
          {footerData &&
            footerData?.length > 0 &&
            footerData?.map((item) => (
              <div
                style={{ border: `1px solid ${border}` }}
                key={item._id}
                className="mb-4  p-2 "
              >
                <div className="flex justify-between items-center">
                  <p className="block text-sm font-medium text-gray-700">
                    {t(item?.name)}
                  </p>
                  {check && (
                    <div className="flex items-center gap-1">
                      <CreateLink
                        type="2"
                        data={item}
                        getFooterData={getFooterData}
                      />
                      {/* <MdDelete
                style={{ color: iconColor, fontSize: "20px" }}
                className="cursor-pointer"
              /> */}
                    </div>
                  )}
                </div>

                <div className="flex items-center mt-2">
                  <input
                    type="text"
                    style={{ border: `1px solid ${border}` }}
                    value={item?.link}
                    className={`shadow appearance-none border rounded w-[100%]   py-1 px-3 text-gray-700 leading-tight outline-none`}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="bg-white shadow-md rounded p-4 mb-4">
        <FooterPaymentTerms />
      </div>
      <div className="bg-white shadow-md rounded px-3 lg:px-8  pt-6 pb-8 mb-4">
        <QuestionAnswer faq={faq} setFaq={setFaq} />
      </div>
    </div>
  );
};

export default FooterManage;
