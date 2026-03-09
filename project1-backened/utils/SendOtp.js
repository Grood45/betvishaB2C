// const sendEmail = async (email, message, name, service) => {
//     const transpoter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: "masaiyans@gmail.com",
//         pass: "entxlrxzocseekld",
//       },
//     });

//     const mailoption = {
//       from: "masaiyans@gmail.com",
//       to: email,
//       subject: `NO-REPLY`,
//       text:
//       `
//       My name is ${name} and I'm writing to you today because I'm interested in your ${service} services.

//       ${message}
//       `
//     };

//    await transpoter.sendMail(mailoption, (err, info) => {
//       if (err) return console.log("error", err);
//       console.log("sent mail to company",info.response);
//       return{ "mail send": info.response};
//     });
//   };

const nodemailer = require("nodemailer");

const getFormattedDateTime = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const now = new Date();

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes.toString().padStart(2, "0");

  const day = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();

  return `${formattedHours}:${formattedMinutes}${ampm}, ${day}, ${date}/${month}/${year}`;
};
const sendEmail = async (recipientEmail, name, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "luckyydaddyy@gmail.com",
        pass: "utjh jopy cgzi pfps",
      },
    });

    const Date_time = getFormattedDateTime();

    const mailOptions = {
      from: "luckyydaddyy@gmail.com",
      to: recipientEmail,
      subject: "Your One-Time Password (OTP)",
      html: `
          <h1>One-Time Password (OTP) Request</h1>
          <p>Hello ${name},</p>
          <p>Your One-Time Password (OTP) request has been received. Please use the following OTP to proceed:</p>
          <h2>${otp}</h2>
          <p>This OTP is valid for a single use and should not be shared with anyone else.</p>
          <p>If you did not request this OTP, please ignore this email.</p>
          <p>Thank you,</p>
          <p>Winpride.in</p>
          <p>Sent on: ${Date_time}</p>
        `,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`Sent email to ${recipientEmail}:`, info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = {
  sendEmail,
};