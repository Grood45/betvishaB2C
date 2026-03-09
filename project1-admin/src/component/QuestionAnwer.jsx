import { useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import ReactQuill from "react-quill";
import { useSelector } from "react-redux";
import { fetchGetRequest, sendPatchRequest } from "../api/api";
import LoadingSpinner from "./loading/LoadingSpinner";
import { useTranslation } from "react-i18next";
import { checkPermission } from "../../utils/utils";

function QuestionAnswer() {
  const { bg, border } = useSelector((state) => state.theme);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const { t, i18n } = useTranslation();

  const [type, setType] = useState("FAQ");
  const toast = useToast();
  const [categoryData, setCategoryData] = useState([]);

  const [updateId, setUpdateId] = useState("");
  const addFaq = () => {
    setCategoryData((prevCategoryData) => {
      return prevCategoryData.map((category) => {
        const updatedCategory = { ...category };
        updatedCategory.qna = [
          ...updatedCategory.qna,
          { question: "", answer: "" },
        ];
        return updatedCategory;
      });
    });
  };

  const removeFaq = (faqIndex) => {
    setCategoryData((prevCategoryData) => {
      const updatedCategoryData = [...prevCategoryData];
      const updatedQna = [...updatedCategoryData[0].qna];
      updatedQna.splice(faqIndex, 1);
      updatedCategoryData[0].qna = updatedQna;
      return updatedCategoryData;
    });
  };

  const getFooterData = async () => {
    setLoading1(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/navigation/get-all-navigation?name=${type}`;
    try {
      let response = await fetchGetRequest(url);
      if (response?.data) {
        setCategoryData(response?.data[0]?.data);
        setUpdateId(response?.data[0]?._id);
      }
      setLoading1(false);
    } catch (error) {
      console.log(error);
      setLoading1(false);
    }
  };

  useEffect(() => {
    getFooterData();
  }, [type]);

  const handleUpdate = async () => {
    setLoading(true);
    const payload = {
      data: [
        {
          title: categoryData[0]?.title,
          description: categoryData[0]?.description,
          qna: categoryData[0]?.qna.map((item) => ({
            question: item.question,
            answer: item.answer,
          })),
        },
      ],
    };

    try {
      const url = `${
        import.meta.env.VITE_API_URL
      }/api/navigation/update-navigation/${updateId}`;

      const response = await sendPatchRequest(url, payload);

      toast({
        description: `Updated Successfully`,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });

      setLoading(false);
    } catch (error) {
      console.log(error, "error");

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

  const handleTitleChange = (event) => {
    const { value } = event.target;
    setCategoryData((prevCategoryData) => {
      const updatedCategoryData = [...prevCategoryData];
      updatedCategoryData[0].title = value;
      return updatedCategoryData;
    });
  };

  const handleDescriptionChange = (event) => {
    const { value } = event.target;
    setCategoryData((prevCategoryData) => {
      const updatedCategoryData = [...prevCategoryData];
      updatedCategoryData[0].description = value;
      return updatedCategoryData;
    });
  };

  const handleQuestionChange = (index, event) => {
    const { value } = event.target;
    setCategoryData((prevCategoryData) => {
      const updatedCategoryData = [...prevCategoryData];
      const updatedQna = [...updatedCategoryData[0].qna];
      updatedQna[index].question = value;
      updatedCategoryData[0].qna = updatedQna;
      return updatedCategoryData;
    });
  };

  const handleAnswerChange = (index, value) => {
    setCategoryData((prevCategoryData) => {
      const updatedCategoryData = [...prevCategoryData];
      const updatedQna = [...updatedCategoryData[0].qna];
      updatedQna[index].answer = value;
      updatedCategoryData[0].qna = updatedQna;
      return updatedCategoryData;
    });
  };

  const user = useSelector((state) => state.authReducer);

  const adminData = user.user || {};
  const isOwnerAdmin = adminData?.role_type === "owneradmin";

  const permissionDetails = user?.user?.permissions;

  let hasPermission = checkPermission(permissionDetails, "footerContentManage");
  let check = !isOwnerAdmin ? hasPermission : true;

  return (
    <div className="w-[100%] flex flex-col gap-6 m-auto mt-5 rounded-[20px] ">
      <div className="mt-5">
        <div className="flex flex-col items-center gap-2 justify-center">
          <p className="font-bold">
            {t(`Select`)} {t(`Category`)}
          </p>
          <select
            style={{ border: `1px solid ${border}` }}
            onChange={(e) => setType(e.target.value)}
            className="w-[200px] outline-none p-2 rounded-[6px]"
          >
            <option value="FAQ">{t(`FAQ`)}</option>
            <option value="About Us">{t(`About Us`)}</option>
            <option value="Contact Us">{t(`Contact Us`)}</option>
            {/* <option value="Sitemap">Sitemap</option> */}
            <option value="Terms Conditions">{t(`Terms & Conditions`)}</option>
            <option value="Responsible Gaming">
              {t(`Responsible Gaming`)}
            </option>
            <option value="Privacy Policy">{t(`Privacy Policy`)}</option>
            <option value="Complaints">{t(`Complaints`)}</option>
            <option value="Cookie Policy">{t(`Cookie Policy`)}</option>
          </select>
        </div>
        {check && (
          <div className="w-[100%] mt-5 md:mt-0 flex px-3 gap-3 justify-end ">
            <button
              onClick={addFaq}
              style={{ backgroundColor: bg }}
              className=" flex gap-3 text-xs items-center text-white  rounded-[10px] p-2 px-3"
            >
              <span>
                <AiOutlinePlus color="white" />
              </span>{" "}
              {t(`Add`)} {t(`Question`)}
            </button>
          </div>
        )}
      </div>
      {loading1 && (
        <div className="flex justify-center items-center w-full mt-4">
          <LoadingSpinner size="xl" color={"green"} thickness={"6px"} />
        </div>
      )}
      <div>
        <div
          style={{ border: `2px solid ${border}` }}
          className="p-2 py-4 rounded-md"
        >
          <div className="flex px-4 gap-1 flex-col">
            <label className="font-bold text-sm  text-blue-600 ">
              {t(`Title`)}
            </label>
            <input
              style={{ border: `1.5px solid ${border}` }}
              placeholder="Title"
              value={(categoryData && categoryData[0]?.title) || ""}
              className=" w-[100%]  text-xs border  outline-none rounded-[8px] p-2"
              onChange={handleTitleChange}
            />
          </div>
          <div className="flex px-4 gap-1 flex-col mt-4">
            <label className="font-bold text-sm text-blue-600 ">
              {t(`Description`)}
            </label>
            <textarea
              style={{ border: `1.5px solid ${border}` }}
              placeholder="Description"
              className=" w-[100%]  text-xs min-h-[60px] border  outline-none rounded-[10px] p-2"
              value={(categoryData && categoryData[0]?.description) || ""}
              onChange={handleDescriptionChange}
            />
          </div>
        </div>

        {categoryData &&
          categoryData.length > 0 &&
          categoryData[0].qna?.length &&
          categoryData[0]?.qna?.map((item, index) => (
            <div
              key={index}
              style={{ border: `2px solid ${border}` }}
              className="w-[100%] flex-col mt-5  md:flex-row px-4 p-2 rounded-md gap-3 items-center justify-between "
            >
              <div className="text-xs w-[100%] flex flex-col gap-2">
                <label className="font-bold text-[16px] text-red-500">
                  {t(`Question`)}-{index + 1}
                </label>
                <div className="flex justify-between w-[100%]  items-center">
                  <input
                    style={{ border: `1.5px solid ${border}` }}
                    placeholder="Question"
                    className="w-[100%] md:w-[50%] text-xs border  outline-none rounded-[10px] p-3"
                    value={item?.question}
                    onChange={(event) => handleQuestionChange(index, event)}
                  />
                  {index > 0 && (
                    <span
                      onClick={() => removeFaq(index)}
                      className="flex cursor-pointer rounded-md p-1 bg-red-500 ml-3"
                    >
                      <MdDelete color="white" size="25px" />
                    </span>
                  )}
                </div>
              </div>

              <div className="text-xs w-[100%] md:w-[100%] mt-6 flex flex-col gap-2">
                <label className="font-bold text-[16px] text-green-500">
                  {t(`Answer`)}:-
                </label>
                <ReactQuill
                  theme="snow"
                  value={item?.answer || ""}
                  onChange={(value) => handleAnswerChange(index, value)}
                  modules={{
                    toolbar: [
                      [{ header: "1" }, { header: "2" }, { font: [] }],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["bold", "italic", "underline"],
                      [{ color: [] }],
                      ["link", "image"],
                      ["clean"],
                    ],
                  }}
                  style={{ minHeight: "100px", width: "100%", color: "black" }}
                />
              </div>
            </div>
          ))}
      </div>

      {check && (
        <div className="">
          <button
            style={{ backgroundColor: bg }}
            onClick={handleUpdate}
            disabled={loading}
            className="w-[100%] p-2 rounded-lg font-bold text-sm text-white"
          >
            {loading ? (
              <LoadingSpinner color={"white"} thickness={"4px"} size="sm" />
            ) : (
              `${t(`Update`)}`
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default QuestionAnswer;
