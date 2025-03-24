import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, gql } from "@apollo/client";
import { toast } from "react-toastify";
import { GET_BOOKINGS_BY_WORKER } from "../../graphQl/queries/userQueries";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import "./BookingDetails.css";

const GET_CUSTOMER_DETAILS = gql`
  query getCustomerDetails($userId: ID!) {
    getCustomerDetails(userId: $userId) {
      id
      name
      phone
      address
      city
    }
  }
`;

const UPDATE_BOOKING_STATUS = gql`
  mutation updateBookingStatus($id: ID!, $status: String!) {
    updateBookingStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const worker = useSelector(state => state.worker.workerDetails);

  const { data: bookingData } = useQuery(GET_BOOKINGS_BY_WORKER, {
    variables: { worker_id: worker?.id },
    fetchPolicy: "network-only"
  });

  const curr = bookingData?.getBookingsByWorker?.find(b => b.id === id);

  const { data: customerData } = useQuery(GET_CUSTOMER_DETAILS, {
    variables: { userId: curr?.customer_id },
    fetchPolicy: "network-only"
  });

  const [updateStatus] = useMutation(UPDATE_BOOKING_STATUS);

  const booking = bookingData?.getBookingsByWorker?.find(b => b.id === id) || [];
  const customer = customerData?.getCustomerDetails;

  const handleUpdateStatus = async (status) => {
    try {
      const { data } = await updateStatus({
        variables: {
          id: booking.id,
          status
        }
      });

      if (data?.updateBookingStatus) {
        toast.success(`Booking ${status}`);
        navigate("/bookings");
      }
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  return (
    <div className="booking-details-container">
      <h3 className="booking-details-header">Booking Details</h3>

      <div className="booking-details-content">
        <div className="booking-details-section">
          <h4>Booking Information</h4>
          <label><strong>Job Description:</strong></label>
          <textarea
            value={booking.job_description}
            readOnly
            className="job-description-textarea"
          />
          <p><strong>Scheduled Time:</strong> {new Date(parseInt(booking.scheduled_time)).toLocaleString()}</p>
          <p><strong>Payment Status:</strong> {booking.payment_status}</p>
          <p><strong>Status:</strong> {booking.status}</p>
          <p><strong>Booking Date:</strong> {new Date(parseInt(booking.created_at)).toLocaleString()}</p>
          <p><strong>Completed Time:</strong> {booking.completed_time ? new Date(parseInt(booking.completed_time)).toLocaleString() : 'Not Completed'}</p>
        </div>

        <div className="customer-details">
          <h4>Customer Details</h4>
          <p><strong>Name:</strong> {customer?.name}</p>
          <p><strong>Phone:</strong> {customer?.phone}</p>
          <textarea
            value={customer?.address}
            readOnly
            className="job-description-textarea"
          />
        </div>
      </div>

      <div className="booking-action-buttons">
        {booking.status === "pending" && (
          <>
            <button 
              className="btn btn-accept" 
              onClick={() => handleUpdateStatus("accepted")}
            >
              Accept
            </button>

            <button 
              className="btn btn-reject" 
              onClick={() => handleUpdateStatus("cancelled")}
            >
              Reject
            </button>
          </>
        )}

        {booking.status === "accepted" && (
          <button 
            className="btn btn-complete" 
            onClick={() => handleUpdateStatus("completed")}
          >
            ✔️ Mark as Completed
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingDetails;
