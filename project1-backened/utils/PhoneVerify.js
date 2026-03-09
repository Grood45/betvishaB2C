const randomstring = require("randomstring");
const twilio = require("twilio");

// Twilio credentials (replace with your own)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = new twilio(accountSid, authToken);

const userOTPMap = {}; // In-memory storage for simplicity, use a database in production

// Step 1: Generate and Send OTP
const SendOtp = async (req, res) => {
  const phoneNumber = req.body.phoneNumber;

  // Generate a random 6-digit OTP
  const OTP = randomstring.generate({ length: 6, charset: "numeric" });

  // Store OTP with expiration time (e.g., 5 minutes)
  const expirationTime = Date.now() + 5 * 60 * 1000;
  userOTPMap[phoneNumber] = { OTP, expirationTime };

  try {
    // Send OTP to the user's phone number via Twilio
    await client.messages.create({
      body: `Your OTP is: ${OTP}`,
      from: twilioPhoneNumber,
      to: phoneNumber,
    });

    res.json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP." });
  }
};