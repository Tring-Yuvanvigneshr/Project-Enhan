import gql from "graphql-tag";

export const GET_AVAILABLE_WORKERS = gql`
  query GetAvailableWorkers {
    getAvailableWorkers {
      id
      name
      phone
      profession
      experience
      is_available
      available_from
      available_to
      address
      city
    }
  },
`;


export const GET_FILTERED_BOOKINGS_BY_WORKER = gql`
  query GetFilteredBookingsByWorker($worker_id: ID!, $status: String!) {
    getFilteredBookingsByWorker(worker_id: $worker_id, status: $status) {
      id
      customer_id
      worker_id
      status
      job_description
      scheduled_time
      completed_time
      payment_status
      created_at
    }
  }
`;

