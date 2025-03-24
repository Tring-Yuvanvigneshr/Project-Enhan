import React from "react";
import { Link, useLocation } from "react-router-dom";
import { logout } from '../../redux/slices/authSlice';
import { useDispatch } from "react-redux";
import "./sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch()
  // const  { name }  = useSelector(state => state.customer.customerDetails)

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="c-custom-sidebar">
      <div className="custom-navbar">
        <div className="custom-logo">
          <span className="custom-company-name">
            Locos
          </span>
          <span>
            {}
          </span>
        </div>
      </div>

      <nav>
        <ul className="custom-nav-list">
          <li>
            <Link
              to="/dashboard"
              className={location.pathname === "/dashboard" ? "custom-active" : ""}
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              to="/services"
              className={location.pathname === "/services" ? "custom-active" : ""}
            >
              Services
            </Link>
          </li>
          <li>
            <Link
              to="/history"
              className={location.pathname === "/history" ? "custom-active" : ""}
            >
              Service History
            </Link>
          </li>
          <li>
            <Link to="/" onClick={handleLogout}>Logout</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
