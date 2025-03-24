import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useMutation } from "@apollo/client";
import { UPDATE_CUSTOMER } from "../../graphQl/mutation/customerMutation";
import { HARD_DELETE_USER } from "../../graphQl/mutation/userMutation"
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { sendOtp, verifyOtp } from '../../utils/twilioService'
import "react-toastify/dist/ReactToastify.css";
import "./profile.css";

const ProfileInfo = () => {
  const customerDetails = useSelector((state) => state.customer.customerDetails);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [otpSend, setOtpSend] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    latitude: 0,
    longitude: 0,
    locationSet: false,
    otp: "",
  });

  const [showDeleteModal, setDeleteModal] = useState(false);
  const [inputText, setInputText] = useState("");

  const [updateCustomer] = useMutation(UPDATE_CUSTOMER);
  const [hardDeleteCustomer] = useMutation(HARD_DELETE_USER, {
    onCompleted: () => {
      toast.success("Account deleted successfully!");
      navigate("/signUp");
    },
    onError: () => {
      toast.error("Failed to delete account!");
    },
  });

  useEffect(() => {
    if (customerDetails) {
      setFormData({
        name: customerDetails.name || "",
        email: user.email || "",
        mobile: customerDetails.phone || "",
        address: customerDetails.address || "",
        city: customerDetails.city || "",
        latitude: customerDetails.latitude || 0,
        longitude: customerDetails.longitude || 0,
        locationSet: !!customerDetails.latitude,
      });
    }
  }, [customerDetails]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {

    // if (!otpSend) {
    //     toast.error("Please send OTP first!");
    //     return;
    // }

    // const isOtpValid = await verifyOtp(`+91${formData.mobile}`, formData.otp);

    // if (!isOtpValid) {
    //     toast.error("Invalid OTP!");
    //     return;
    // }

    if (formData.name.trim() === "") {
      toast.error("Name cannot be empty.");
      return false;
    }

    if (!/^[0-9]{10}$/.test(formData.mobile)) {
      toast.error("Phone number must be 10 digits!")
      return false;
    }

    return true;
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

            toast.success("Address fetched successfully!");
          } catch (error) {
            toast.error("Failed to fetch address.");
          }
        },
        () => {
          toast.error("Failed to fetch location. Please allow location access.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const sendOTP = async () => {
    let ph = formData.mobile
    ph = `+91${ph}`

    if (!/^[0-9]{10}$/.test(formData.mobile)) {
      toast.error("Phone number must be 10 digits!")
      return;
    }

    try {
      const res = await sendOtp(ph)
      toast.success("Otp send succesfully")
      setOtpSend(true)
    }
    catch (e) {
      toast.error("Connot send otp")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await updateCustomer({
        variables: {
          userId: user.id,
          name: formData.name,
          phone: formData.mobile,
          address: formData.address,
          city: formData.city,
          latitude: formData.latitude,
          longitude: formData.longitude,
        },
      });
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile!");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await hardDeleteCustomer({ variables: { id: user.id } });
    } catch (err) {
      console.error("Error deleting account:", err);
    }
  };

  return (
    <div className="profile-info">
      <h3>Update Profile Information</h3>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="email" value={formData.email} disabled />

        <label>Mobile No</label>
        <div className="phone-container">
          <input disabled value={`+91`}></input>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
          <button type="button" className="send-otp-btn" onClick={sendOTP}>Send otp</button>
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
        <textarea name="address" value={formData.address} onChange={handleChange} required />

        <label>City</label>
        <input type="text" name="city" value={formData.city} onChange={handleChange} required />

        <button type="button" className={`get-location-btn ${formData.locationSet ? 'success' : ''}`} onClick={handleGetLocation}>
          {formData.locationSet ? "Location Set ✔" : "Get Current Location"}
        </button>

        <button type="submit" className="save-btn">Update Profile</button>
      </form>

      <button onClick={() => setDeleteModal(true)} className="delete-btn">
        Delete Account
      </button>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Whoa, there!</h2>
            <p>
              Once you delete your account, there's no getting it back.
              <br />
              Make sure you want to do this.
            </p>
            <input
              type="text"
              placeholder="Confirm by typing DELETE"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              required
            />
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={() => setDeleteModal(false)}>
                CANCEL
              </button>
              <button
                className="delete-btn"
                onClick={handleDeleteAccount}
                disabled={inputText !== "DELETE"}
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;
