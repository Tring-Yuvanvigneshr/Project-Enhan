import gql from "graphql-tag";

export const GET_CUSTOMER_DETAILS = gql`
  query GetCustomerDetails($userId: ID!) {
    getCustomerDetails(userId: $userId) {
      id
      name
      phone 
      address
      city
      location
      created_at
    }
  }
`;

export const GET_CUSTOMER_DETAILS_BY_USERID = gql`
  query GetCustomerDetails($userId: ID!) {
    getCustomerDetailsByUserid(userId: $userId) {
      id
      name
      phone
      address
      city
      location
      created_at
      latitude
      longitude
    }
  }
`;

export const GET_ALL_WORKERS = gql`
  query {
    workers{
    id
    name
    phone
    profession
    experience
    location
    is_available
    available_from
    available_to
    created_at
  }
  }
`;

export const GET_ALL_REVIEWS = gql`
  query{
  reviews {
    customer_id
    worker_id
    rating
    comment
    created_at
    id
  }
}
`

export const GET_NEARBY_WORKERS = gql`
  query GetNearbyWorkers($userId: ID!) {
    getNearbyWorkers(userId: $userId) {
      id
      name
      address
      phone
      profession
      experience
      is_available
      city
      available_from
      available_to
      distance
    }
  }
`;




// for worker


export const GET_BOOKINGS_BY_WORKER = gql`
  query GetBookingsByWorker($worker_id: ID!) {
    getBookingsByWorker(worker_id: $worker_id) {
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

export const GET_WORKER_DETAILS = gql`
  query getWorkerDetails($id: ID!) {
    workerForworker(id: $id) {
      id
      name
      profession
      is_available
      available_from
      available_to
      phone
      experience
      city
      address
      latitude
      longitude
    }
  }
`;


