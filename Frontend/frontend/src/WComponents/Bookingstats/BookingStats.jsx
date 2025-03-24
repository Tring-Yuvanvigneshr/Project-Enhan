import React, { useEffect, useState } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import { GET_BOOKINGS_BY_WORKER, GET_WORKER_DETAILS } from "../../graphQl/queries/userQueries";
import { useDispatch, useSelector } from "react-redux";
import { setWorkerDetails } from "../../redux/slices/workerSlice";
import "./bookingStats.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";


const UPDATE_WORKER_AVAILABILITY = gql`
  mutation updateWorkerAvailability($id: ID!, $is_available: String!) {
    updateWorkerAvailability(id: $id, is_available: $is_available) {
      id
      is_available
    }
  }
`;

const BookingStats = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const { data } = useQuery(GET_WORKER_DETAILS, {
    variables: { id: user.id },
    fetchPolicy: "network-only"
  });

  const [updateAvailability] = useMutation(UPDATE_WORKER_AVAILABILITY);

  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (data?.workerForworker) {
      dispatch(setWorkerDetails(data.workerForworker));
    }
  }, [data, dispatch]);

  const worker = useSelector(state => state.worker.workerDetails);

  const { data: bookingData } = useQuery(GET_BOOKINGS_BY_WORKER, {
    variables: { worker_id: worker?.id },
    fetchPolicy: "network-only",
  });

  // console.log(bookingData?.getBookingsByWorker)
  const bookings = bookingData?.getBookingsByWorker.filter((curr) => curr.status == 'pending' || curr.status == 'accepted') || [];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending": return "orange";
      case "completed": return "green";
      case "cancelled": return "red";
      default: return "gray";
    }
  };

  const handleAvailabilityToggle = async (status) => {
    try {
      const { data } = await updateAvailability({
        variables: {
          id: worker.id,
          is_available: status ? "available" : "unavailable"
        }
      });

      if (data?.updateWorkerAvailability) {
        dispatch(setWorkerDetails({
          ...worker,
          is_available: data.updateWorkerAvailability.is_available
        }));

        toast.success(`Updated to ${status ? 'Available' : 'Unavailable'}`);
        setShowDropdown(false);
      }
    } catch (error) {
      toast.error("Failed to update availability.");
    }
  };

  const handleCardClick = (booking) => {
    navigate(`/booking-details/${booking.id}`);
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text
  }



  return (
    <div className="booking-stats-container">

      <div className="top-navbar">
        <h2 className="heading">My Bookings</h2>

        <div className="availability-dropdown">
          <button
            className={`dropdown-btn ${worker?.is_available ? 'available' : 'unavailable'}`}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {worker?.is_available === 'available' ? 'Available' : 'Unavailable'}
          </button>

          {showDropdown && (
            <div className="dropdown-menu active">
              <p
                className={worker?.is_available === 'available' ? 'active' : ''}
                onClick={() => handleAvailabilityToggle(true)}
              >
                Available
              </p>
              <p
                className={worker?.is_available === 'unavailable' ? 'active' : ''}
                onClick={() => handleAvailabilityToggle(false)}
              >
                Unavailable
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="worker-details">
        <p><strong>Name: </strong>
          {worker?.name.length > 15 ? <Tooltip title={worker?.name} arrow>
            {truncateText(worker?.name, 15)}
          </Tooltip> : worker?.name}
        </p>
        <p><strong>Profession:</strong> {worker?.profession}</p>
        <p><strong>Availability:</strong> {worker?.is_available == 'available' ? 'Available' : 'Unavailable'}</p>
      </div>

      <h3>All Bookings</h3>
      <div className="booking-cards-container">
        {bookings.length === 0 ? (
          <p className="no-booking-text">No bookings found.</p>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="booking-card"
              onClick={() => handleCardClick(booking)}
            >
              <div className="card-header">
                <h4>{booking.job_description}</h4>
              </div>
              <span
                className="status"
                style={{ backgroundColor: getStatusColor(booking.status) }}
              >
                {booking.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingStats;
