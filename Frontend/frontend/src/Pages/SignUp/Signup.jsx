    import React, { useState } from "react";
    import { Link, useNavigate } from "react-router-dom";
    import { useMutation } from "@apollo/client";
    import { useDispatch } from "react-redux";
    import { setUser } from "../../redux/slices/authSlice";
    import { REGISTER_USER, SIGN_IN } from "../../graphQl/mutation/userMutation";
    import validator from "validator";
    import { Snackbar, Alert } from "@mui/material";
    import "./signUp.css";
    import { FaEye } from "react-icons/fa";
    import { FaEyeSlash } from "react-icons/fa";


    const SignUp = () => {
        const [userDetails, setUserDetails] = useState({
            email: "",
            password: "",
            role: "customer"
        });

        const [errorMessage, setErrorMessage] = useState(null);
        const [emailError, setEmailError] = useState(null);
        const [openToast, setOpenToast] = useState(false);
        const [toastMessage, setToastMessage] = useState("");
        const [toastSeverity, setToastSeverity] = useState("success");
        const [showPassword, setShowPassword] = useState(false)

        const navigate = useNavigate();
        const dispatch = useDispatch();

        const [registerUser, { loading }] = useMutation(REGISTER_USER, {
            onCompleted: async (data) => {
                showToast("Sign-up successful!", "success");

                await signIn({
                    variables: {
                        email: userDetails.email,
                        password: userDetails.password
                    }
                });
            },
            onError: (error) => {
                if (error.message.includes("duplicate key value")) {
                    showToast("Email already exists", "error");
                } else {
                    showToast("Sign-up unsuccessful!", "error");
                }
            }
        });

        const [signIn] = useMutation(SIGN_IN, {
            onCompleted: (data) => {
                if (data.signIn) {
                    const { token, user } = data.signIn;

                    dispatch(setUser({ token, user }));

                    if (user.role === "worker") {
                        navigate("/workerForm", { state: user.id });
                    } else {
                        navigate("/customerForm", { state: user.id });
                    }
                }
            },
            onError: (error) => {
                showToast("Sign-in unsuccessful!", "error");
            }
        });

        const showToast = (message, severity) => {
            setToastMessage(message);
            setToastSeverity(severity);
            setOpenToast(true);
        };

        const validatePassword = (e) => {
            const password = e.target.value;
            if (validator.isStrongPassword(password, {
                minLength: 8, minLowercase: 1,
                minUppercase: 1, minNumbers: 1, minSymbols: 1
            })) {
                setErrorMessage(null);
                setUserDetails({ ...userDetails, password });
            } else {
                setErrorMessage("Your password is weak");
                setUserDetails({ ...userDetails, password: "" });
            }
        };

        const validateEmail = (e) => {
            const email = e.target.value;
            if (!validator.isEmail(email)) {
                setEmailError("Enter a valid Email!");
                setUserDetails({ ...userDetails, email: "" });
                return;
            }

            setEmailError(null);
            setUserDetails({ ...userDetails, email });
        };

        const handleRoleSelection = (role) => {
            setUserDetails({ ...userDetails, role });
        };

        const handleSubmit = async (e) => {
            e.preventDefault();

            if (!userDetails.email || !userDetails.password) {
                showToast("Please enter all details", "error");
                return;
            }

            try {
                await registerUser({ variables: userDetails });
            } catch (error) {
                console.error("Error registering user:", error);
            }
        };

        return (
            <div className="signup-wrapper">
                <div className="signup-container">
                    <center><h2 className="signup-header">Sign Up</h2></center>
                    <div className="role-selection">
                        <div>
                            <button
                                className={`role-btn ${userDetails.role === "customer" ? "selected" : ""}`}
                                onClick={() => handleRoleSelection("customer")}
                                type="button"
                            >
                                User
                            </button>
                            <button
                                className={`role-btn ${userDetails.role === "worker" ? "selected" : ""}`}
                                onClick={() => handleRoleSelection("worker")}
                                type="button"
                            >
                                Worker
                            </button>
                        </div>
                    </div>

                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" placeholder="Enter your email" onChange={validateEmail} />
                    {emailError && <span className="error-signUp">{emailError}</span>}

                    <label htmlFor="password">Password</label>
                    <div className="password-container-signup">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            className="password-input-signup"
                            onChange={validatePassword}
                        />
                        <button
                            onClick={() => setShowPassword(!showPassword)}
                            type="button"
                            className="password-toggle-signup"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {errorMessage && <span className="error-signUp">{errorMessage}</span>}

                    <button className="register-btn" onClick={handleSubmit} disabled={emailError || errorMessage}>
                        {loading ? "Registering..." : "Register"}
                    </button>

                    <p className="signin-redirect">
                        Already have an account? <Link to={'/signIn'}>Sign In</Link>
                    </p>

                    <Snackbar
                        open={openToast}
                        autoHideDuration={4000}
                        onClose={() => setOpenToast(false)}
                    >
                        <Alert
                            onClose={() => setOpenToast(false)}
                            severity={toastSeverity}
                            variant="filled"
                        >
                            {toastMessage}
                        </Alert>
                    </Snackbar>
                </div>
            </div>
        );
    };

    export default SignUp;
