const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendVerificationCode(phoneNumber, otp) {
  try {
    const message = await client.messages.create({
      body: `Your verification code is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
    return message.sid;
  } catch (error) {
    throw new Error("Failed to send OTP");
  }
}

module.exports = { sendVerificationCode };
