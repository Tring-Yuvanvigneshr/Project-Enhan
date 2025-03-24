import React, { useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_BOOKINGS_BY_WORKER } from '../../graphQl/queries/userQueries.js';
import { GET_FILTERED_BOOKINGS_BY_WORKER } from '../../graphQl/queries/workerQueries.js';
import './serviceHistory.css';
import { useSelector } from 'react-redux';
import { FormControl, MenuItem, Select } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const WServiceHistory = () => {
  const [filterStatus, setFilterStatus] = useState("")
  const [bookings, setBookings] = useState([])
  const navigate = useNavigate()
  const worker = useSelector(state => state.worker.workerDetails)


  const { loading: allLoading, error: allError, data: workerBookingsData } = useQuery(GET_BOOKINGS_BY_WORKER, {
    variables: { worker_id: worker?.id },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setBookings(data?.getBookingsByWorker || [])
    }
  })

  const workerBookings = workerBookingsData?.getBookingsByWorker || [];

  const [fetchFilteredBookings, { loading: filterLoading, error: filterError }] = useLazyQuery(GET_FILTERED_BOOKINGS_BY_WORKER, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setBookings(data?.getFilteredBookingsByWorker || [])
    }
  })

  const handleFilterChange = (event) => {
    const status = event.target.value;
    setFilterStatus(status);
  
    if (status) {
      fetchFilteredBookings({ variables: { worker_id: worker?.id, status } });
    } else {
      setBookings(workerBookings);
    }
  };
  

  const handleCardClick = (booking) => {
    navigate(`/booking-details/${booking.id}`)
  }


  if (allLoading || filterLoading) return <div className='loading'>Loading...</div>;
  if (allError || filterError) return <div className='error'>Failed to fetch service history</div>;

  return (
    <div className='service-history'>
      <div className='filter-container'>
        <h2>Service History</h2>
        <FormControl size="small" className='filter-dropdown'>
          <Select value={filterStatus} onChange={handleFilterChange} displayEmpty>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="accepted">Accepted</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className='booking-list'>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className='booking-card' onClick={() => { handleCardClick(booking) }}>
              <div className='left-section'>
                <div><strong>Job:</strong> {booking.job_description}</div>
                <div><strong>Status:</strong>
                  <span className={`status-${booking.status.toLowerCase()}`}> {booking.status}</span>
                </div>
                <div><strong>Payment:</strong> {booking.payment_status}</div>
                <div><strong>Booking In:</strong> {new Date(parseInt(booking.created_at)).toLocaleString()}</div>
              </div>

              <div className='right-section'>
                <div><strong>Scheduled:</strong> {new Date(parseInt(booking.scheduled_time)).toLocaleString()}</div>
                {booking.completed_time && (
                  <div><strong>Completed:</strong> {new Date(parseInt(booking.completed_time)).toLocaleString()}</div>
                )}
                <button className='view-details-btn'>View Details →</button>
              </div>
            </div>
          ))
        ) : (
          <p>No service history available.</p>
        )}
      </div>
    </div>
  );
};

export default WServiceHistory;


