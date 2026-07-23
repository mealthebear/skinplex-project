function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function verifyOTP(inputCode, storedCode, expiryTimestamp) {
  if (!storedCode || !expiryTimestamp) return false;
  if (Date.now() > expiryTimestamp) return false;
  return inputCode === storedCode;
}

function getOTPExpiration() {
  return Date.now() + 5 * 60 * 1000;
}

module.exports = {
  generateOTP,
  verifyOTP,
  getOTPExpiration,
};
