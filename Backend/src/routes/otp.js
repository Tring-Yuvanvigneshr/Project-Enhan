const express = require("express");
const { sendVerificationCode } = require("../helper/twilioService");
const crypto = require("crypto");
const pool = require("../config/db");

const router = express.Router();
const OTP_EXPIRY_MINUTES = 5; 


router.post("/send-otp", async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  const otp = crypto.randomInt(1000, 9999).toString();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000); 

  try {
    await pool.query(
      `INSERT INTO otp_verifications (phone, otp, expires_at)
       VALUES ($1, $2, $3)
       ON CONFLICT (phone) DO UPDATE 
       SET otp = EXCLUDED.otp, expires_at = EXCLUDED.expires_at, created_at = CURRENT_TIMESTAMP`,
      [phone, otp, expiresAt]
    );

    await sendVerificationCode(phone, otp);
    res.json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ error: "Phone and OTP are required" });
  }

  try {
    const result = await pool.query(
      `SELECT otp, expires_at FROM otp_verifications WHERE phone = $1`,
      [phone]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid OTP or phone number" });
    }

    const { otp: storedOtp, expires_at: expiresAt } = result.rows[0];

    if (new Date() > new Date(expiresAt)) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    if (storedOtp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    await pool.query(`DELETE FROM otp_verifications WHERE phone = $1`, [phone]);

    res.json({ message: "OTP verified successfully!" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
});

module.exports = router;
