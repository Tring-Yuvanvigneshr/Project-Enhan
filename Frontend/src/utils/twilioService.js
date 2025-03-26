import axios from "axios";

export const sendOtp = async (phone) => {
    try {
        const response = await axios.post('http://localhost:5000/api/send-otp', {
            "phone": phone
        })
        return response.data;       
    } catch (error) {
        return new Error("Otp not send successfully")
    }
}

export const verifyOtp = async (phone, otp) => {
    try {
        const response = await axios.post('http://localhost:5000/api/verify-otp', {
            phone,
            otp
        })
        return true
    } catch (error) {
        return false
    }
}