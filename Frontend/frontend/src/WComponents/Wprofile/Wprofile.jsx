import React, { useState, useEffect } from 'react'
import './wProfile.css'
import { toast } from "react-toastify";
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from "@apollo/client";
import { sendOtp, verifyOtp } from '../../utils/twilioService'
import { UPDATE_WORKER_DETAILS } from './../../graphQl/mutation/workerMutation.js';
import { GET_WORKER_DETAILS } from './../../graphQl/queries/userQueries.js';
import { HARD_DELETE_USER } from '../../graphQl/mutation/userMutation.js'

const Wprofile = () => {

    const { user } = useSelector(state => state.auth);

    const { data, loading, error } = useQuery(GET_WORKER_DETAILS, {
        variables: { id: user?.id },
        fetchPolicy: "network-only",
    });

    const [otpSend, setOtpSend] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        profession: "",
        experience: "",
        latitude: "",
        longitude: "",
        address: "",
        city: "",
        available_from: "",
        available_to: "",
        locationSet: false,
        otp: "",
    })

    useEffect(() => {
        if (data?.workerForworker) {
            setFormData((prev) => ({
                ...prev,
                name: data.workerForworker.name || "",
                phone: data.workerForworker.phone || "",
                profession: data.workerForworker.profession || "",
                experience: data.workerForworker.experience || "",
                latitude: data.workerForworker.latitude || "",
                longitude: data.workerForworker.longitude || "",
                address: data.workerForworker.address || "",
                city: data.workerForworker.city || "",
                available_from: data.workerForworker.available_from || "",
                available_to: data.workerForworker.available_to || "",
            }));
        }
    }, [data]);

    const [updateWorkerDetails] = useMutation(UPDATE_WORKER_DETAILS);
    const [hardDeleteWorker] = useMutation(HARD_DELETE_USER, {
        onCompleted: () => {
            toast.success("Account deleted successfully!");
            navigate("/signUp");
        },
        onError: () => {
            toast.error("Failed to delete account!");
        },
    });
    const [showDeleteModal, setDeleteModal] = useState(false);
    const [inputText, setInputText] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "available_to") {
            if (value <= formData.available_from) {
                toast("Available To must be later than Available From!", "error");
                return;
            }
        }

        setFormData({
            ...formData,
            [name]: value,
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

                    toast.success("Location fetched successfully!");

                    try {
                        const response = await fetch(
                            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${import.meta.env.VITE_OPENCAGE_API_KEY}`
                        );
                        const data = await response.json()

                        const city =
                            data.results[0].components.city ||
                            data.results[0].components.state
                        const address = data.results[0].formatted

                        setFormData((prev) => ({
                            ...prev,
                            city,
                            address,
                        }));

                        toast.success("Address fetched successfully!");
                    } catch (error) {
                        toast.error("Failed to fetch address. Enter manually.")
                    }
                },
                (error) => {
                    toast.error("Failed to fetch location. Allow location access.")
                }
            );
        } else {
            toast.error("Geolocation is not supported by this browser.")
        }
    }

    const sendOTP = async () => {
        let ph = formData.phone
        ph = `+91${ph}`

        if (!/^[0-9]{10}$/.test(formData.phone)) {
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

        // if (!otpSend) {
        //     toast.error("Please send OTP first!");
        //     return;
        // }

        // const isOtpValid = await verifyOtp(`+91${formData.phone}`, formData.otp);

        // if (!isOtpValid) {
        //     toast.error("Invalid OTP!");
        //     return;
        // }

        if (formData.profession.trim() === "") {
            showToast("Please select a profession!")
            return;
        }

        else if (formData.experience < 0) {
            toast.error("Experience cannot be negative!")
            return;
        }

        else if (formData.experience > 50) {
            toast.error("Maximum experience range is 50")
            return;
        }

        else if (!/^[0-9]{10}$/.test(formData.phone)) {
            toast.error("Phone number must be 10 digits!")
            return;
        }

        else {
            try {
                await updateWorkerDetails({
                    variables: {
                        userId: user.id,
                        name: formData.name,
                        phone: formData.phone,
                        profession: formData.profession,
                        experience: parseInt(formData.experience),
                        address: formData.address,
                        city: formData.city,
                        latitude: formData.latitude,
                        longitude: formData.longitude,
                        available_from: formData.available_from,
                        available_to: formData.available_to,
                    },
                });

                toast.success("Worker details updated successfully!");
            } catch (error) {
                toast.error("Failed to update details!");
            }
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await hardDeleteWorker({ variables: { id: user.id } });
        } catch (err) {
            console.error("Error deleting account:", err);
        }
    };


    return (
        <div className='wProfile-container'>
            <div className="profile-info">
                <h3>Update Your Profile</h3>
                <form onSubmit={handleSubmit}>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
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

                    <label>Profession</label>
                    <select
                        name="profession"
                        value={formData.profession}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Profession</option>
                        <option value="Plumber">Plumber</option>
                        <option value="Electrician">Electrician</option>
                        <option value="Carpenter">Carpenter</option>
                        <option value="Mechanic">Mechanic</option>
                        <option value="Painter">Painter</option>
                        <option value="Cleaner">Cleaner</option>
                        <option value="AC Technician">AC Technician</option>
                        <option value="Appliance Repairer">Appliance Repairer</option>
                        <option value="Gardener">Gardener</option>
                    </select>

                    <label>Experience (in years)</label>
                    <input
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        required
                    />

                    <label>Available From</label>
                    <input
                        type="time"
                        name="available_from"
                        value={formData.available_from}
                        onChange={handleChange}
                        required
                    />

                    <label>Available To</label>
                    <input
                        type="time"
                        name="available_to"
                        value={formData.available_to}
                        onChange={handleChange}
                        min={formData.available_from}
                        required
                    />

                    <label>Set Location</label>
                    <button
                        type="button"
                        className={`get-location-btn ${formData.locationSet ? "success" : ""
                            }`}
                        onClick={handleGetLocation}
                    >
                        {formData.locationSet ? "Location Set ✔" : "Get Current Location"}
                    </button>

                    <label>City</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                    />

                    <label>Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />

                    <button type="submit" className="save-btn">
                        Update Profile
                    </button>
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
        </div>
    )
}

export default Wprofile;