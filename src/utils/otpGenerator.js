// 🔢 GENERATE 6 DIGIT OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ⏱️ OTP EXPIRY (5 minutes)
export const otpExpiryTime = () => {
  return new Date(Date.now() + 5 * 60 * 1000);
};