import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { 
  GET_ALL_WORKERS, 
  GET_ALL_REVIEWS, 
  GET_NEARBY_WORKERS, 
} from "../../graphQl/queries/userQueries.js";
import { GET_AVAILABLE_WORKERS } from "../../graphQl/queries/workerQueries.js";
import { useNavigate } from "react-router-dom";
import { TextField, Pagination, FormControlLabel, Checkbox, Chip, Tooltip } from '@mui/material';
import { notify } from "../../utils/CreateToast.jsx";
import placeholder from './../../assets/Images/placeholder.jpg';
import "./serviceStats.css";
import { useSelector } from "react-redux";

const Services = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    availableOnly: false,
    highRatingOnly: false,
    nearbyOnly: false,
  });

  const workersPerPage = 8;

  const { loading, error, data } = useQuery(GET_ALL_WORKERS, {
    fetchPolicy: "network-only",
    skip: filters.nearbyOnly || filters.availableOnly
  });

  const { loading: nearbyLoading, error: nearbyError, data: nearbyData } = useQuery(GET_NEARBY_WORKERS, {
    variables: { userId: user.id },
    fetchPolicy: "network-only",
    skip: !filters.nearbyOnly,
  });

  const { loading: availableLoading, error: availableError, data: availableData } = useQuery(GET_AVAILABLE_WORKERS, {
    fetchPolicy: "network-only",
    skip: !filters.availableOnly,
  });

  const { loading: reviewLoading, error: reviewError, data: reviewData } = useQuery(GET_ALL_REVIEWS, {
    fetchPolicy: "network-only"
  });

  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleFilterChange = (filterName) => {
    setFilters({
      ...filters,
      [filterName]: !filters[filterName],
    });
    setPage(1);
  };
  
  const getAverageRating = (workerId) => {
    const workerReviews = reviewData?.reviews.filter(review => review.worker_id === workerId);
    if (!workerReviews || workerReviews.length === 0) return { average: 0, total: 0 };
    const totalRating = workerReviews.reduce((acc, review) => acc + review.rating, 0);
    const average = totalRating / workerReviews.length;
    return { average, total: workerReviews.length };
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const workers = (() => {
    if (filters.nearbyOnly && filters.availableOnly) {
      return nearbyData?.getNearbyWorkers?.filter(worker => worker.is_available == 'available');
    }
    if (filters.nearbyOnly) {
      return nearbyData?.getNearbyWorkers;
    }
    if (filters.availableOnly) {
      return availableData?.getAvailableWorkers;
    }
    return data?.workers;
  })();

  const filteredWorkers = workers
    ?.filter(worker => worker.profession.toLowerCase().startsWith(searchQuery))
    .filter(worker => (filters.highRatingOnly ? getAverageRating(worker.id).average >= 4 : true));

  const indexOfLastWorker = page * workersPerPage;
  const indexOfFirstWorker = indexOfLastWorker - workersPerPage;
  const currentWorkers = filteredWorkers?.slice(indexOfFirstWorker, indexOfLastWorker);

  if (loading || reviewLoading || (filters.nearbyOnly && nearbyLoading) || (filters.availableOnly && availableLoading)) {
    return <p className="loading">Loading services...</p>;
  }

  if (error || reviewError || nearbyError || availableError) {
    notify({ message: "Failed to fetch services.", type: "error" });
    return <p className="error">Error loading services</p>;
  }

  return (
    <div className="services-container">
      <div className="services-header">
        <TextField
          variant="outlined"
          placeholder="Search by Profession..."
          size="small"
          value={searchQuery}
          onChange={handleSearch}
          className="services-search"
        />
        <div className="services-filters">
          <FormControlLabel
            control={<Checkbox checked={filters.availableOnly} onChange={() => handleFilterChange('availableOnly')} />}
            label="Available Only"
          />
          <FormControlLabel
            control={<Checkbox checked={filters.highRatingOnly} onChange={() => handleFilterChange('highRatingOnly')} />}
            label="4+ Star Rating"
          />
          <FormControlLabel
            control={<Checkbox checked={filters.nearbyOnly} onChange={() => handleFilterChange('nearbyOnly')} />}
            label="Nearby Only"
          />
        </div>
      </div>

      <div className="services-grid">
        {currentWorkers.map((worker) => {
          const { average, total } = getAverageRating(worker.id);
          return (
            <div
              key={worker.id}
              className="service-card"
              onClick={() => navigate("/workerDetails", 
                {
                  state: worker.id
                }
              )}
            >
              <img src={worker.profile_image || placeholder} alt={worker.name} />
              <div className="service-card-content">
                <Tooltip title={worker.name} arrow>
                  <p>{truncateText(worker.name, 15)}</p>
                </Tooltip>
                <p><strong>Profession:</strong>
                  <Tooltip title={worker.profession} arrow>
                    {truncateText(worker.profession, 10)}
                  </Tooltip>
                </p>
                <div className="service-rating">
                  <p>{average.toFixed(1)} ({total} reviews)</p>
                </div>
                <div className="service-availability">
                  <Chip
                    label={worker.is_available === 'available' ? '✅ Available' : '❌ Not Available'}
                    color={worker.is_available === 'available' ? 'success' : 'error'}
                    size="small"
                  />
                </div>
                <button><small>View Details</small></button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="services-pagination">
        <Pagination
          count={Math.ceil(filteredWorkers.length / workersPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </div>
  );
};

export default Services;
