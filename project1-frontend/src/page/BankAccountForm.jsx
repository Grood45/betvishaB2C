import React, { useState } from 'react';
import {
    Flex,
    FormControl,
    FormLabel,
    Input,
    Select,
    Button,
    Box,
    Spinner
} from '@chakra-ui/react';
import { useSelector } from "react-redux";
import InfoAndPayment from "./InfoAndPayment";
import BankTab from '../component/All-Page-Tabs/BankTabs';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { updateBankDetails } from '../APIServices/APIServices';
import { useTranslation } from 'react-i18next';
// import { toast, ToastContainer } from 'react-toastify';


const BankAccountForm = () => {

    const banks = [
        'State Bank of India (SBI)',
        'ICICI Bank',
        'HDFC Bank',
        'Axis Bank',
        'Punjab National Bank (PNB)',
        'Bank of Baroda (BOB)',
        'Canara Bank',
        'Union Bank of India',
        'Bank of India (BOI)',
        'IDBI Bank',
        'Central Bank of India',
        'Indian Bank',
        'Bank of Maharashtra',
        'UCO Bank',
        'Indian Overseas Bank (IOB)',
        'Punjab & Sind Bank',
        'Kotak Mahindra Bank',
        'IndusInd Bank',
        'Yes Bank',
        'RBL Bank',
        'Federal Bank',
        'IDFC First Bank',
        'Bandhan Bank',
        'South Indian Bank',
        'DCB Bank',
        'Nainital Bank',
        'Jammu & Kashmir Bank',
        'Karur Vysya Bank',
        'City Union Bank',
        'Dhanlaxmi Bank',
        'Federal Bank',
        'HDFC Bank'
    ];
    const [loading,setLoading]=useState(false)

    const {
        bgColor1,
        bgGray,
        greenBtn,
        PrimaryText,
        whiteText
    } = useSelector((state) => state.theme);
    const User= useSelector((state) => state.auth.user);
    const settings = useSelector((state) => state?.auth?.settings)
    const navigate = useNavigate()
    const {t} =useTranslation()
    const singleUserDetail=useSelector((state)=>state.auth)
    const formik = useFormik({
        initialValues: {
          accountName: User?.user?.first_name,
          selectedBank: '',
          bankBranch: '',
          accountNumber: '',
          ifscCode: '',
        },

        validationSchema: Yup.object({
        //   accountName: Yup.string().required('Account Name is required'),
          selectedBank: Yup.string().required('Please select Bank'),
          bankBranch: Yup.string().required('Please Enter Bank Branch Name'),
          accountNumber: Yup.string()
            .required('Please Enter Your Account Number')
            .matches(/^\d{11,16}$/, 'Account Number must be between 11 to 16 digits'),
          ifscCode: Yup.string()
            .required('Please Enter IFSC Code')
            .matches(/^[A-Za-z]{4}\d{7}$/, 'IFSC Code must be 4 alphabets followed by 7 digits'),
        }),
        onSubmit: async (values) => {
            setLoading(true)

            try {
                const bankDetails = {
                    bank_name: values.selectedBank,
                    bank_holder: values.accountName,
                    account_number: values.accountNumber,
                    ifsc_code: values.ifscCode,
                    branch_code: values.bankBranch,
                };

                const response = await updateBankDetails(User?.data?.token, User?.data?.usernameToken, bankDetails);
                if(response.status===200){
                    toast({
                        title: response.message || 'Bank Added successfully!!!',
                        status: "success",
                        duration: 2000,
                        isClosable: true,
                        position: "top",
                      });
                }
                else{
                    toast({
                        title: response.message || 'An error occurred while updating the password!!!',
                        status: "warning",
                        duration: 2000,
                        isClosable: true,
                        position: "top",
                      });
                   
                }
            }catch (error) {
                toast({
                    title: error.message || 'Error updating Bank details!!!',
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                    position: "top",
                  });
                console.error('Error updating Bank details', error);
             }
             finally{
                setLoading(false)
             }
        },
      });
      

    return (
        <Box style={{ backgroundColor: bgColor1 }} className="md:main_page mt-0 md:pt-[155px]"  >

            <Box px={{base:"8px"}}>

                <Flex>
                    <InfoAndPayment />
                    <Box maxW="100%">
                        <div style={{ backgroundColor: bgColor1 }}>
                            <Flex flexDirection='column'>
                                <BankTab></BankTab>
                                <div className='md:my-3 md:mx-3'  >
                                    <Flex gap="10px" flexDirection="column" style={{ textAlign: 'left' }}>
                                        <div  className="md:p-3 w-[100%] md:bg-[#F2F2F2] md:w-[700px] rounded-[5px] md:px-[15px] py-[24px] "  >
                                            <Box display="flex" flexDirection="column">
                                                <form onSubmit={formik.handleSubmit}>
                                                    <p className='pb-4 text-sm font-medium' >{t(`To change your Bank Account please contact our`)} <span className='font-bold'>{t(`Customer Support`)}</span></p>
                                                    <div className='w-[100%] mb-4  flex flex-col md:flex-row justify-between md:items-center' >
                                                        <p className='font-bold md:font-normal'>{t(`Account Name`)}</p>
                                                        <div  className='w-[100%] md:w-[70%]' align="end">
                                                        <Input
                                                            width="100%"
                                                            name="accountName"
                                                            value={User?.user?.first_name}
                                                            // onChange={formik.handleChange}
                                                            // onBlur={formik.handleBlur}
                                                            className='rounded-full'
                                                            borderRadius={{base:'40px',md:"4px"}}
                                                            bg={{base:bgGray,md:whiteText}}
                                                            readOnly={singleUserDetail?.singleUserData?.bank_verified}
                                                        />
                                                        {formik.touched.accountName && formik.errors.accountName ? (
                                                            <div style={{ color: 'red', fontSize: '0.8em',  alignItems:"end"}}>{formik.errors.accountName}</div>
                                                        ) : null}
                                                        </div>
                                                       
                                                    </div>
                                                    <div className='w-[100%] mb-4  flex flex-col md:flex-row justify-between md:items-center' >
                                                        <p className='font-bold md:font-normal'>{t(`Select Bank`)}</p>
                                                        <div  className='w-[100%] md:w-[70%]' align="end">
                                                        {!singleUserDetail?.singleUserData?.bank_verified?<Select
                                                            width="100%"
                                                            name="selectedBank"
                                                            value={formik.values.selectedBank}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            borderRadius={{base:'40px',md:"4px"}}
                                                            bg={{base:bgGray,md:whiteText}}
                                                           

                                                        >
                                                            <option>{t(`Select Bank`)}</option>
                                                           {!singleUserDetail?.singleUserData?.bank_name&& banks.map((bank, index) => (
                                                                <option key={index} value={bank}>
                                                                    {bank}
                                                                </option>
                                                            ))}
                                                        </Select>: <Input
                                                            width="100%"
                                                            value={singleUserDetail?.singleUserData?.bank_name}
                                                           
                                                            className='rounded-full'
                                                            borderRadius={{base:'40px',md:"4px"}}
                                                            bg={{base:bgGray,md:whiteText}}
                                                            readOnly={singleUserDetail?.singleUserData?.bank_verified}
                                                        />}
                                                        {formik.touched.selectedBank && formik.errors.selectedBank ? (
                                                            <div style={{ color: 'red', fontSize: '0.8em' }}>{formik.errors.selectedBank}</div>
                                                        ) : null}
                                                            </div>

                                                    </div>
                                                    <div className='w-[100%] mb-4  flex flex-col md:flex-row justify-between md:items-center' >

                                                    <p className='font-bold md:font-normal'>{t(`Bank Branch`)}</p>
                                                    <div  className='w-[100%] md:w-[70%]' align="end">
                                                       {!singleUserDetail?.singleUserData?.bank_verified? <Input
                                                            width="100%"
                                                            name="bankBranch"
                                                            value={formik.values.bankBranch}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            borderRadius={{base:'40px',md:"4px"}}
                                                            bg={{base:bgGray,md:whiteText}}
                                                            readOnly={singleUserDetail?.singleUserData?.bank_verified}

                                                        />:
                                                        <Input
                                                            width="100%"
                                                            value={singleUserDetail?.singleUserData?.branch_code}
                                                            
                                                            borderRadius={{base:'40px',md:"4px"}}
                                                            bg={{base:bgGray,md:whiteText}}
                                                            readOnly={singleUserDetail?.singleUserData?.bank_verified}

                                                        />}
                                                        {formik.touched.bankBranch && formik.errors.bankBranch ? (
                                                            <div style={{ color: 'red', fontSize: '0.8em' }}>{formik.errors.bankBranch}</div>
                                                        ) : null}
                                                            </div>

                                                    </div>
                                                    <div className='w-[100%] mb-4  flex flex-col md:flex-row justify-between md:items-center' >

                                                        <p className='font-bold md:font-normal'>{t(`Account Number`)}</p>
                                                        <div  className='w-[100%] md:w-[70%]' align="end">
                                                        {!singleUserDetail?.singleUserData?.bank_verified?<Input
                                                            width="100%"
                                                            name="accountNumber"
                                                            value={formik.values.accountNumber}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            borderRadius={{base:'40px',md:"4px"}}
                                                            bg={{base:bgGray,md:whiteText}}
                                                            readOnly={singleUserDetail?.singleUserData?.bank_verified}

                                                        />:
                                                         <Input
                                                            width="100%"
                                                            name="accountNumber"
                                                            value={singleUserDetail?.singleUserData?.account_number}
                                                            
                                                            borderRadius={{base:'40px',md:"4px"}}
                                                            bg={{base:bgGray,md:whiteText}}
                                                            readOnly={singleUserDetail?.singleUserData?.bank_verified}

                                                        />}
                                                        {formik.touched.accountNumber && formik.errors.accountNumber ? (
                                                            <div style={{ color: 'red', fontSize: '0.8em' }}>{formik.errors.accountNumber}</div>
                                                        ) : null}
                                                            </div>

                                                    </div>
                                                    <div className='w-[100%] mb-4  flex flex-col md:flex-row justify-between md:items-center' >

                                                    <p className='font-bold md:font-normal'>{t(`IFSC Code`)}</p>
                                                    <div  className='w-[100%] md:w-[70%]' align="end">
                                                        {!singleUserDetail?.singleUserData?.bank_verified?<Input
                                                            width="100%"
                                                            name="ifscCode"
                                                            value={formik.values.ifscCode}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            borderRadius={{base:'40px',md:"4px"}}
                                                            bg={{base:bgGray,md:whiteText}}
                                                            readOnly={singleUserDetail?.singleUserData?.bank_verified}

                                                        />:<Input
                                                        width="100%"
                                                        name="ifscCode"
                                                        value={singleUserDetail?.singleUserData?.ifsc_code}
                                                       
                                                        borderRadius={{base:'40px',md:"4px"}}
                                                        bg={{base:bgGray,md:whiteText}}
                                                        readOnly={singleUserDetail?.singleUserData?.bank_verified}

                                                    />}
                                                        {formik.touched.ifscCode && formik.errors.ifscCode ? (
                                                            <div style={{ color: 'red', fontSize: '0.8em' }}>{formik.errors.ifscCode}</div>
                                                        ) : null}
                                                            </div>
                                                        
                                                    </div>
                                                    <Flex width="100%" mb={4}>
                                                        <Box width="30%"></Box>
                                                        <Box width="70%" align="end">
                                                            <Link to="https://bankifsccode.com/">
                                                                {t(`What is my IFSC Code`)}?
                                                            </Link>
                                                        </Box>
                                                    </Flex>
                                                    <div className='w-[100%] mb-4  flex flex-col md:flex-row justify-between md:items-center' >

                                                    <p className='font-bold md:font-normal'></p>
                                                      {!singleUserDetail?.singleUserData?.bank_verified && <Button
                                                            bg={greenBtn}
                                                            color={whiteText}
                                                            fontSize={{ base: ".9rem", xl: "16px" }}
                                                            width={{base:"100%",md:"70%"}}
                                                            borderRadius={{base:'40px',md:"4px"}}
                                                            minW={{ base: "85px", xl: "140px" }}
                                                            height={{ base: "40px", xl: "50px" }}
                                                            margin={{ base: "5px 0 5px", xl: "5px" }}
                                                            type="submit"
                                                        >
                                                           {loading?<Spinner/>: (t(`Add Bank`)) }
                                                        </Button>}
                                                    </div>
                                                </form>
                                            </Box>
                                        </div>
                                    </Flex>
                                </div>
                            </Flex>
                        </div>
                    </Box>
                </Flex>
            </Box>
            {/* <ToastContainer /> */}
        </Box>
    );
};

export default BankAccountForm;
