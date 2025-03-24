import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/authSlice";
import { SIGN_IN } from "../../graphQl/mutation/userMutation";
import "./SignIn.css";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const [toastData, setToastData] = useState({
    message: '',
    type: 'info'
  });

  const handleClose = () => {
    setOpen(false);
  };

  const notify = ({ message, type = "info" }) => {
    setToastData({ message, type });
    setOpen(true);
  };

  const [signIn, { loading }] = useMutation(SIGN_IN, {
    onCompleted: (data) => {
      if (data.signIn) {
        const { token, user } = data.signIn;
        dispatch(setUser({ token, user }));

        if (user.role === "customer") {
          navigate("/dashboard");
        } else if (user.role === "worker") {
          navigate("/bookings");
        } else {
          notify({ message: "Invalid role!", type: "error" });
        }
        notify({ message: "Login Successfully", type: "success" });
      }
    },
    onError: (error) => {
      notify({ message: error.message, type: "error" });
    },
  });

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      notify({ message: "Please fill all fields", type: "warning" });
      return;
    }

    try {
      await signIn({ variables: { email, password } });
    } catch (error) {
      console.log("SignIn Error: ", error);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <div className="login-box">
          <h2 className="loginHeadder">Sign In</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className="password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              type="button"
              className="password-toggle"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button id="login-btn" type="submit">
            Sign In
          </button>
          <p>
            Don't have an account?{" "}
            <span>
              <Link to="/signUp">Sign Up</Link>
            </span>
          </p>
        </div>
      </form>

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={toastData.type} sx={{ width: '100%' }}>
          {toastData.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SignIn;
