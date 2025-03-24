import React from "react";
import { useQuery } from "@apollo/client";
import { GET_CUSTOMER_DETAILS_BY_USERID } from "../../graphQl/queries/userQueries";
import ProfileInfo from "../ProfileInfo/ProfileInfo";
import { useDispatch, useSelector } from "react-redux";
import { setCustomerDetails } from "../../redux/slices/customerSlice";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const { data } = useQuery(GET_CUSTOMER_DETAILS_BY_USERID, {
    variables: { userId: user.id },
    fetchPolicy: "network-only",  
  });

  if (data?.getCustomerDetailsByUserid) {
      dispatch(setCustomerDetails(data.getCustomerDetailsByUserid));
  } else {
      navigate(`/signIn`);
  }

  return (
    <div className="dashboard-container">
      <ProfileInfo />
    </div>
  );
};

export default Dashboard;
