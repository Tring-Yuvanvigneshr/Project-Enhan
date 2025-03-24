import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_CUSTOMER } from "../../graphQl/mutation/customerMutation.js";
import { useLocation, useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import { useDispatch } from "react-redux";
import { setCustomerDetails } from "../../redux/slices/customerSlice";
import { sendOtp, verifyOtp } from '../..//utils/twilioService.js'
import "./customerForm.css";

const CustomerForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const id = location.state

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    latitude: 0,
    longitude: 0,
    locationSet: false,
    otp: ""
  });

  const [otpSend, setOtpSend] = useState(false)
  const [createCustomer] = useMutation(CREATE_CUSTOMER);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setFormData({
            ...formData,
            latitude,
            longitude,
            locationSet: true,
          });

          showToast("Location fetched successfully!", "success");

          try {
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${import.meta.env.VITE_OPENCAGE_API_KEY}`
            );
            const data = await response.json();

            const city = data.results[0].components.city || data.results[0].components.state;
            const address = data.results[0].formatted;

            setFormData((prev) => ({
              ...prev,
              city,
              address,
            }));

            showToast("Address fetched successfully!", "success");
          } catch (error) {
            showToast("Failed to fetch address.", "error");
          }
        },
        () => {
          showToast("Failed to fetch location. Please allow location access.", "error");
        }
      );
    } else {
      showToast("Geolocation is not supported by this browser.", "error");
    }
  }

  const sendOTP = async () => {
    let ph = formData.phone
    ph = `+91${ph}`

    if (formData.phone.length !== 10) {
      showToast("Phone number must be 10 digits!", "error")
      return;
    }

    try {
      const res = await sendOtp(ph)
      showToast("Otp send succesfully", "success")
      setOtpSend(true)
    }
    catch (e) {
      showToast("Connot send otp", "error")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpSend) {
      showToast("Please send OTP first!", "error");
      return;
    }

    const isOtpValid = await verifyOtp(`+91${formData.phone}`, formData.otp);

    if (!isOtpValid) {
      showToast("Invalid OTP!", "error");
      return;
    }

    if (formData.name.trim() === "") {
      showToast("Name is required.", "error");
      return false;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      showToast("Phone number must be exactly 10 digits.", "error");
      return false;
    }

    if (formData.address.trim() === "") {
      showToast("Address is required.", "error");
      return false;
    }

    if (formData.city.trim() === "") {
      showToast("City is required.", "error");
      return false;
    }

    if (!formData.locationSet) {
      showToast("Please fetch your current location.", "error");
      return false;
    }

    try {
      const { data } = await createCustomer({
        variables: {
          userId: id,
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          latitude: formData.latitude,
          longitude: formData.longitude,
        },
      });

      dispatch(setCustomerDetails(data.createCustomer));

      showToast("Customer profile created successfully!", "success");
      navigate("/dashboard");
    } catch (err) {
      showToast("Failed to create customer profile!", "error");
    }
  };

  const showToast = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="profile-info">
      <h3>Create Customer Profile</h3>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
        />

        <label>Phone Number</label>
        <div className="phone-container">
          <input disabled value={`+91`}></input>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <button type="button" onClick={sendOTP} className="send-otp-btn">Send otp</button>
        </div>

        {otpSend && <div>
          <label>Enter your otp</label>

          <input
            type="text"
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            required
          />
        </div>
        }

        <label>Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter your complete address"
          required
        />

        <label>City</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="Enter your city"
        />

        <label>Set Location</label>
        <button
          type="button"
          className={`get-location-btn ${formData.locationSet ? 'success' : ''}`}
          onClick={handleGetLocation}
        >
          {formData.locationSet ? "Location Set ✔" : "Get Current Location"}
        </button>

        <button type="submit" className="save-btn">
          Create Customer Profile
        </button>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CustomerForm;
