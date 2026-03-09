const express = require("express");
const { Get_all_payment_method, Update_payment_method, Add_Payment_method, get_image_link, Delete_payment_method, Update_payment_method_status, Get_all_payment_method_admin, Check_Admin_amount } = require("../controllers/transactioncontroller/payment.controller");
const { upload } = require("../middlewares/multer.middleware");


const PaymentRouter = express.Router();

PaymentRouter.post('/get-payment-method',Get_all_payment_method)
PaymentRouter.patch('/update-payment-method/:_id',Update_payment_method)
PaymentRouter.use(express.urlencoded({extended:false}))
PaymentRouter.post("/add-method",Add_Payment_method)
PaymentRouter.post("/image-url",upload.single('post_img'),get_image_link)
PaymentRouter.delete('/delete-payment-method/:id',Delete_payment_method)
PaymentRouter.patch('/update_payment_method_status/:_id',Update_payment_method_status)
PaymentRouter.get('/get-payment-method-admin',Get_all_payment_method_admin)
PaymentRouter.post('/check-admin-amount',Check_Admin_amount)

module.exports={PaymentRouter}