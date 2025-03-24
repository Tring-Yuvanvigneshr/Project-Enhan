import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery, useMutation, gql } from "@apollo/client";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import 'react-toastify/dist/ReactToastify.css';
import "./workerDetails.css";
import placeholder from './../../assets/Images/placeholder.jpg';
import { Tooltip } from "@mui/material";

const GET_WORKER = gql`
  query GetWorker($id: ID!) {
    worker(id: $id) {
      id
      name
      profession
      experience
      is_available
      available_from
      available_to
      address
      city
    }
  }
`;

const GET_REVIEWS_BY_WORKER = gql`
  query GetReviewsByWorker($workerId: ID!) {
    reviewsByWorker(worker_id: $workerId) {
      id
      rating
      comment
      created_at
    }
  }
`;

const GET_BOOKING_BY_CUSTOMER_AND_WORKER = gql`
  query GetBookingByCustomerAndWorker($customerId: ID!, $workerId: ID!) {
    getBookingByCustomerAndWorker(customer_id: $customerId, worker_id: $workerId) {
      id
      status
    }
  }
`;

const CREATE_BOOKING = gql`
  mutation CreateBooking(
    $customerId: ID!
    $workerId: ID!
    $jobDescription: String!
    $scheduledTime: String!
  ) {
    createBooking(
      customer_id: $customerId
      worker_id: $workerId
      job_description: $jobDescription
      scheduled_time: $scheduledTime
    ) {
      id
    }
  }
`;

const WorkerDetails = () => {
    const location = useLocation()
    const id = location.state
    const [showModal, setShowModal] = useState(false);
    const [jobDescription, setJobDescription] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");

    const customer = useSelector((state) => state.customer.customerDetails);
    // const user = useSelector((state) => state.auth.user)


    const { data: workerData } = useQuery(GET_WORKER, {
        variables: { id },
        fetchPolicy: "network-only",
    });

    const { data: reviewData } = useQuery(GET_REVIEWS_BY_WORKER, {
        variables: { workerId: id },
        fetchPolicy: "network-only",
    });

    const { data: bookingData, refetch } = useQuery(GET_BOOKING_BY_CUSTOMER_AND_WORKER, {
        variables: {
            customerId: customer.id,
            workerId: id
        },
        fetchPolicy: "network-only",
    });

    const [createBooking] = useMutation(CREATE_BOOKING);

    const worker = workerData?.worker;
    const reviews = reviewData?.reviewsByWorker;
    const existingBooking = bookingData?.getBookingByCustomerAndWorker;

    console.log(existingBooking)

    const handleBooking = async () => {
        if (!jobDescription || !scheduledTime) {
            toast.error("Please fill in all fields.");
            return;
        }

        try {
            await createBooking({
                variables: {
                    customerId: customer.id,
                    workerId: id,
                    jobDescription,
                    scheduledTime,
                },
            });

            toast.success("Booking successful!");
            setShowModal(false);
            setJobDescription("");
            setScheduledTime("");

            await refetch();
        } catch (error) {
            console.error("Booking failed", error);
            toast.error("Booking failed. Please try again.");
        }
    };

    const getBookingStatus = () => {
        if (!existingBooking) return "📅 Book Now";

        const status = existingBooking?.status;
        if (status === "completed" || status === "canceled") {
            return "📅 Book Now";
        }
        if (status === "pending" || status === "accepted") {
            return "✅ Booked";
        }
    };

    const isButtonDisabled = () => {
        if (worker?.is_available === 'unavailable') return true;
        if (existingBooking?.status === "pending" || existingBooking?.status === "accepted") {
            return true;
        }
        return false;
    }

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + "...";
        }
        return text;
    };


    return (
        <div className="worker-container">
            <div className="worker-details-container">
                <div className="worker-left">
                    <div className="worker-profile">
                        <img
                            src={placeholder}
                            alt="Worker"
                            className="worker-image"
                        />
                        <div className="worker-info">
                            <h2>{worker?.name.length > 15 ? <Tooltip title={worker?.name} arrow>
                                <h6>
                                    {truncateText(worker?.name, 15)}
                                </h6>
                            </Tooltip> : worker?.name}
                            </h2>
                            <p><strong>Profession:</strong> {worker?.profession}</p>
                            <p><strong>Experience:</strong> {worker?.experience} years</p>
                            <p><strong>Available From:</strong> {worker?.available_from}</p>
                            <p><strong>Available To:</strong> {worker?.available_to}</p>
                            <p><strong>Status:</strong> {worker?.is_available === 'available' ? "Available" : "Not Available"}</p>
                        </div>
                    </div>

                    <div className="reviews-section">
                        <h3>Customer Reviews</h3>
                        {reviews?.length > 0 ? (
                            reviews.map((review, index) => (
                                <div key={index} className="review-card">
                                    <textarea className="review-text" readOnly>{review.comment}</textarea>
                                    <p className="review-rating">⭐ {review.rating}/5</p>
                                    <p className="review-date">
                                        {new Date(parseInt(review.created_at)).toLocaleDateString()}
                                    </p>
                                    <hr />
                                </div>
                            ))
                        ) : (
                            <p>No reviews yet.</p>
                        )}
                    </div>
                </div>

                <div className="worker-right">
                    <div className="booking-section">
                        <h3>Booking Details</h3>
                        <p><strong>Availability:</strong> {worker?.is_available === 'available' ? "Available Now" : "Not Available"}</p>
                        <button
                            className="booking-button"
                            onClick={() => setShowModal(true)}
                            disabled={isButtonDisabled()}
                        >
                            {getBookingStatus()}
                        </button>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={() => setShowModal(false)}>&times;</span>
                        <h2>Booking Details</h2>

                        {/* <div className="info-message">
                            <p><strong>⚠️ Note:</strong> Your personal information including:</p>
                            <ul>
                                <li>✅ Your Name: <strong>{user?.name}</strong></li>
                                <li>✅ Your Phone Number: <strong>{user?.phone}</strong></li>
                                <li>✅ Your Address: <strong>{user?.address}</strong></li>
                                <li>✅ Your Job Description (added below)</li>
                            </ul>
                            <p><strong>will be shared with the worker once you confirm the booking.</strong></p>
                        </div> */}

                        <textarea
                            placeholder="Job description (e.g., Fix kitchen tap)"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />

                        <input
                            type="datetime-local"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                            min={new Date().toISOString().slice(0, 16)}
                        />

                        <div className="booking-buttons">
                            <button className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="confirm-button" onClick={handleBooking}>Confirm Booking</button>
                        </div>
                    </div>
                </div>

            )}
        </div>
    );
};

export default WorkerDetails;
