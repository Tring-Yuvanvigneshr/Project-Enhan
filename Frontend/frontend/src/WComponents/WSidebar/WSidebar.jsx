import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./wsidebar.css";
import Navbar from './../Wnavbar/Wnavbar.jsx';
import { useDispatch } from "react-redux";
import { logout } from '../../redux/slices/authSlice';


const WSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch()
  // const { name } = useSelector((state) => state.worker.workerDetails)

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      <Navbar />
      <div className="custom-sidebar">
        <nav>
          <ul className="custom-nav-list">
            <li>
              <Link
                to="/bookings"
                className={location.pathname === "/bookings" ? "custom-active" : ""}
              >
                Bookings
              </Link>
            </li>
            <li>
              <Link
                to="/wHistory"
                className={location.pathname === "/wHistory" ? "custom-active" : ""}
              >
                Service History
              </Link>
            </li>
            <li>
              <Link
                to="/wProfile"
                className={location.pathname === "/wProfile" ? "custom-active" : ""}
              >
                Profile
              </Link>
            </li>
            <li>
              <Link to="/" onClick={handleLogout} className="custom-logout">
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>


  );
};

export default WSidebar;
