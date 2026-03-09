const crypto = require("crypto");

// Function to create a valid AES-256 key from the provided secret key
const generateAESKey = (secretKey) => {
  return crypto.createHash("sha256").update(secretKey).digest().slice(0, 32);
};

// Function to create a token with a given secret key and input string (Encrypt)
const EncodeToken = (secretKey, inputString) => {
  try {
    const key = generateAESKey(secretKey);
    const iv = crypto.randomBytes(16); // Generate a random initialization vector (IV)
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(inputString, "utf8", "hex");
    encrypted += cipher.final("hex");
    return {
      isValid: true,
      encrypted: iv.toString("hex") + encrypted,
      message: "Encode successfully",
    }; // Concatenate IV with the encrypted data
  } catch (error) {
    return { isValid: false, encrypted: null, message: error.message }; // Concatenate IV with the encrypted data
  }
};

// Function to decode a token back to the original input string (Decrypt)
const DecodeToken = (secretKey, encryptedToken) => {
  try {
    const key = generateAESKey(secretKey);
    const iv = Buffer.from(encryptedToken.slice(0, 32), "hex"); // Extract IV from the encrypted token
    const encryptedData = encryptedToken.slice(32); // Extract the encrypted data portion
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return { isValid: true, decrypted, message: "Decode successfully" };
  } catch (error) {
    return { isValid: true, decrypted: null, message: error.message };
  }
};

module.exports = { EncodeToken, DecodeToken };
// // Example usage
// const secretKey = 'your_secret_key'; // Replace 'your_secret_key' with your actual secret key
// const inputString = 'playzilla';
// const encryptedToken = createToken(secretKey, inputString);
// console.log('Encrypted Token:', encryptedToken.encrypted);

// // Decoding back to the original input
// const decodedInput = decodeToken(secretKey,encryptedToken.encrypted);
// console.log('Decoded Input:', decodedInput.decrypted);
