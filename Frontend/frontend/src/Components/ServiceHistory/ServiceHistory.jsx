import React, { useState } from 'react';
import './serviceHistory.css';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Rating,
} from '@mui/material';

const GET_BOOKINGS_BY_CUSTOMER = gql`
  query GetBookingsByCustomer($customerId: ID!) {
    getBookingsByCustomer(customer_id: $customerId) {
      id
      job_description
      scheduled_time
      status
      worker_id
    }
  }
`;

const ADD_REVIEW = gql`
  mutation AddReview($customerId: ID!, $workerId: ID!, $rating: Int!, $comment: String!) {
    addReview(
      customer_id: $customerId
      worker_id: $workerId
      rating: $rating
      comment: $comment
    ) {
      id
      customer_id
      worker_id
      rating
      comment
      created_at
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


const ServiceHistory = () => {
  const customer = useSelector(state => state.customer.customerDetails);

  const { data, refetch } = useQuery(GET_BOOKINGS_BY_CUSTOMER, {
    variables: { customerId: customer.id },
    fetchPolicy: "network-only",
  });

  const [cancelBooking] = useMutation(UPDATE_BOOKING_STATUS);
  const [addReview] = useMutation(ADD_REVIEW);

  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingIdToCancel, setBookingIdToCancel] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleCancelBooking = (id) => {
    setBookingIdToCancel(id);
    setOpenConfirmationDialog(true);
  };

  const handleConfirmCancelBooking = async () => {
    try {
      await cancelBooking({
        variables: {
          id: bookingIdToCancel,
          status: 'cancelled'
        }
      });

      toast.success("Booking canceled successfully.");
      refetch();
      setOpenConfirmationDialog(false);
    } catch (error) {
      toast.error("Failed to cancel the booking.");
    }
  };

  const handleOpenFeedbackDialog = (booking) => {
    setSelectedBooking(booking);
    setOpenFeedbackDialog(true);
  };

  const handleSubmitFeedback = async () => {
    if (rating === 0 || comment.trim() === '') {
      toast.error("Please provide a rating and a comment.");
      return;
    }

    try {
      await addReview({
        variables: {
          customerId: customer.id,
          workerId: selectedBooking.worker_id,
          rating,
          comment: comment.trim(),
        },
      });

      toast.success("Review submitted successfully.");
      setOpenFeedbackDialog(false);
      setRating(0);
      setComment('');
      refetch();
    } catch (error) {
      toast.error("Failed to submit the review.");
    }
  };

  const bookings = data?.getBookingsByCustomer || [];

  const handlecolor = (status) => {
    if(status === 'cancelled'){
      return "red"
    }
    else if( status === 'accepted'){
      return "blue"
    }
    else if( status === 'pending' ){
      return "yellow"
    }
    else{ 
      return "green"
    }
  }

  return (
    <div className="service-history">
      <h2>Your Service History</h2>
      <div className="booking-cards">
        {bookings.length > 0 ? (
          bookings.map((item) => (
            <Card key={item.id} className="booking-card">
              <CardContent>
                <div>
                  <Typography
                    variant="h6"
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '250px'
                    }}
                  >
                    {item.job_description}
                  </Typography>

                  <Typography variant="body2">
                    Date: {new Date(parseInt(item.scheduled_time)).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    Status: <strong style={{ color: handlecolor(item.status) }}>{item.status}</strong>
                  </Typography>
                </div>


                <div>
                  { (item.status === 'pending' || item.status === 'accepted') && (
                    <button
                      className='cancel-booking-btn'
                      onClick={() => handleCancelBooking(item.id)}
                    >
                      Cancel Booking
                    </button>
                  )}

                  {item.status === 'completed' && (
                    <button
                      className='review-booking-btn'
                      onClick={() => handleOpenFeedbackDialog(item)}
                    >
                      Add Review
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography>No job records found.</Typography>
        )}
      </div>

      <Dialog
        open={openConfirmationDialog}
        onClose={() => setOpenConfirmationDialog(false)}
      >
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this booking?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmationDialog(false)} color="secondary">
            No
          </Button>
          <Button onClick={handleConfirmCancelBooking} color="error">
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog> 

      <Dialog open={openFeedbackDialog} onClose={() => setOpenFeedbackDialog(false)}>
        <DialogTitle>Add Review</DialogTitle>
        <DialogContent>
          <Rating
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
          />
          <TextField
            label="Comment"
            multiline
            rows={3}
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFeedbackDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmitFeedback} color="primary">
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ServiceHistory;
