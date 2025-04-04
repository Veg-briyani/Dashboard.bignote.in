import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const TransactionsCard = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [timeframe, setTimeframe] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch recent purchases
  useEffect(() => {
    const fetchPurchases = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use the environment variable for the API URL
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/author/fake-purchases?page=${currentPage}&timeframe=${timeframe}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Set API response for debug mode
        setApiResponse(response);

        // Check if response has the structure shown in your example
        if (response.data && response.data.purchases) {
          setPurchases(response.data.purchases);
          setTotalPages(response.data.totalPages || 1);
          setCurrentPage(response.data.currentPage || 1);
        } else if (Array.isArray(response.data)) {
          // Fallback if the response is a direct array
          setPurchases(response.data);
        } else {
          setPurchases([]);
        }
      } catch (error) {
        console.error("Error fetching purchases:", error);
        setError(error.response?.data?.message || "Failed to load purchases");
        setPurchases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [timeframe, currentPage]);

  // Generate placeholder avatar based on name
  const getAvatar = (name) => {
    if (!name) return `/assets/img/avatars/1.png`;
    
    // Use a hash of the name to get a consistent avatar ID
    const hashCode = name.split('').reduce(
      (acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0
    );
    const avatarId = Math.abs(hashCode % 8) + 1; // 1-8 range
    return `/assets/img/avatars/${avatarId}.png`;
  };

  // Handle timeframe filter
  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
    setCurrentPage(1); // Reset to first page when changing timeframe
  };

  // Toggle debug mode
  const toggleDebugMode = (e) => {
    e.preventDefault();
    setIsDebugMode(!isDebugMode);
  };

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  // Format date with proper timezone handling
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle empty state
  if (!loading && (!purchases || purchases.length === 0)) {
    return (
      <div className="col-md-6 col-lg-4 order-2 mb-4">
        <div className="card h-100">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title m-0 me-2">Recent Book Purchases</h5>
            {/* <button 
              className="btn btn-sm btn-outline-primary" 
              onClick={toggleDebugMode}
            >
              {isDebugMode ? "Hide Debug" : "Debug"}
            </button> */}
          </div>
          
          {isDebugMode && (
            <div className="card-body border-top">
              <h6 className="text-primary">Debug Information</h6>
              <div className="mb-3">
                <p className="mb-1"><strong>Error:</strong> {error || 'No error'}</p>
                <p className="mb-1"><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
                <p className="mb-1"><strong>Timeframe:</strong> {timeframe}</p>
                <p className="mb-1"><strong>Current Page:</strong> {currentPage}</p>
                <p className="mb-1"><strong>API Response:</strong></p>
                <pre className="bg-light p-2 rounded" style={{maxHeight: '200px', overflow: 'auto'}}>
                  {apiResponse ? JSON.stringify(apiResponse.data, null, 2) : 'No response data'}
                </pre>
              </div>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-sm btn-primary" 
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </button>
                <button 
                  className="btn btn-sm btn-outline-secondary" 
                  onClick={() => handleTimeframeChange(timeframe)}
                >
                  Retry Request
                </button>
              </div>
            </div>
          )}
          
          <div className="card-body text-center py-5">
            <div className="mb-3">
              <i className="bx bx-shopping-bag fs-1 text-muted"></i>
            </div>
            <h6 className="text-muted">No recent purchases</h6>
            <p className="text-muted mb-0">Book purchases will appear here as your books are sold.</p>
            
            {error && (
              <div className="alert alert-danger mt-3 text-start">
                <small><strong>Error:</strong> {error}</small>
                <button 
                  className="btn btn-sm btn-outline-danger mt-2 d-block mx-auto"
                  onClick={() => handleTimeframeChange(timeframe)}
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-md-6 col-lg-4 order-2 mb-4">
      <div className="card h-100">
        <div className="card-header d-flex align-items-center justify-content-between">
          <h5 className="card-title m-0 me-2">Recent Book Purchases</h5>
          <div className="d-flex align-items-center">
            {/* <button 
              className="btn btn-sm btn-outline-primary me-2" 
              onClick={toggleDebugMode}
            >
              {isDebugMode ? "Hide Debug" : "Debug"}
            </button> */}
            <div className="dropdown">
              <button
                className="btn p-0"
                type="button"
                id="transactionID"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="bx bx-dots-vertical-rounded"></i>
              </button>
              <div className="dropdown-menu dropdown-menu-end" aria-labelledby="transactionID">
                <a 
                  className={`dropdown-item ${timeframe === 'all' ? 'active' : ''}`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleTimeframeChange('all');
                  }}
                >
                  All Time
                </a>
                <a 
                  className={`dropdown-item ${timeframe === 'month' ? 'active' : ''}`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleTimeframeChange('month');
                  }}
                >
                  Last Month
                </a>
                <a 
                  className={`dropdown-item ${timeframe === 'week' ? 'active' : ''}`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleTimeframeChange('week');
                  }}
                >
                  Last Week
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {isDebugMode && (
          <div className="card-body border-top border-bottom">
            <h6 className="text-primary">Debug Information</h6>
            <div className="mb-3">
              <p className="mb-1"><strong>Purchases Count:</strong> {purchases?.length || 0}</p>
              <p className="mb-1"><strong>Error:</strong> {error || 'No error'}</p>
              <p className="mb-1"><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
              <p className="mb-1"><strong>Timeframe:</strong> {timeframe}</p>
              <p className="mb-1"><strong>Current Page:</strong> {currentPage} of {totalPages}</p>
              <p className="mb-1"><strong>API Response:</strong></p>
              <pre className="bg-light p-2 rounded" style={{maxHeight: '200px', overflow: 'auto'}}>
                {apiResponse ? JSON.stringify(apiResponse.data, null, 2) : 'No response data'}
              </pre>
            </div>
            <button 
              className="btn btn-sm btn-primary" 
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        )}
        
        <div className="card-body">
          {loading ? (
            <div className="text-center py-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error && !isDebugMode ? (
            <div className="text-center py-3">
              <div className="text-danger mb-2">
                <i className="bx bx-error-circle fs-3"></i>
              </div>
              <p className="text-muted">{error}</p>
              <button 
                className="btn btn-sm btn-outline-primary" 
                onClick={() => handleTimeframeChange(timeframe)}
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {(Array.isArray(purchases) ? purchases : []).map((purchase) => (
                <div key={purchase._id || purchase.id} className="d-flex align-items-center mb-3">
                  <img
                    src={purchase.avatar || getAvatar(purchase.customerName)}
                    alt={`${purchase.customerName}'s avatar`}
                    className="rounded-circle me-3"
                    width="42"
                    height="42"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/assets/img/avatars/1.png";
                    }}
                  />
                  <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                    <div className="me-2">
                      <h6 className="mb-0">{purchase.customerName}</h6>
                      <small className="text-muted d-block">{purchase.bookTitle}</small>
                      <small className="text-muted d-block">
                        {formatDate(purchase.createdAt || purchase.date)}
                      </small>
                    </div>
                    <div className="user-progress">
                      <small className="fw-medium">₹{((purchase.price || purchase.amount) || 0).toFixed(2)}</small>
                      <span className={`badge bg-label-${purchase.status === 'completed' ? 'success' : 'warning'} ms-2`}>
                        {purchase.status}
                      </span>
                      {purchase.isReal === false && (
                        <span className="badge bg-label-info ms-1" title="Created by admin">
                          <i className="bx bx-star"></i>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                  <button 
                    className="btn btn-sm btn-outline-primary" 
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                  >
                    <i className="bx bx-chevron-left"></i> Previous
                  </button>
                  <span className="text-muted small">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button 
                    className="btn btn-sm btn-outline-primary" 
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next <i className="bx bx-chevron-right"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsCard;