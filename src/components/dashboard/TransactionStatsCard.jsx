import { useState, useEffect } from "react";
import axios from "axios";
import { getApiUrl, getAuthHeaders } from "../../services/apiConfig";

export const TransactionStatsCard = () => {
  const [royaltyData, setRoyaltyData] = useState({
    royaltyReceived: 0,
    approvedPayouts: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Verify that the authentication token exists.
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        // Fetch profile data for royaltyReceived using the API config
        const profileResponse = await axios.get(getApiUrl("auth/profile"), {
          headers: getAuthHeaders(),
        });

        // Extract royaltyReceived from the profile response
        const { royaltyReceived } = profileResponse.data;

        // Fetch payout history for calculating total approved payouts
        const payoutsResponse = await axios.get(getApiUrl("royalties"), {
          headers: getAuthHeaders(),
        });

        // Calculate total approved payouts (status "approved" or "completed")
        const approvedPayouts = payoutsResponse.data
          .filter(
            (payout) =>
              payout.status.toLowerCase() === "approved" ||
              payout.status.toLowerCase() === "completed"
          )
          .reduce((total, payout) => total + payout.amount, 0);

        setRoyaltyData({
          royaltyReceived: royaltyReceived || 0,
          approvedPayouts: approvedPayouts || 0,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        let errorMessage = "Failed to load royalty data";

        if (error.response) {
          // Server responded with an error status code
          errorMessage =
            error.response.data?.message ||
            `Server error: ${error.response.status}`;
        } else if (error.request) {
          // Request made but no response received
          errorMessage =
            "Unable to connect to server. Please check your internet connection.";
        } else {
          // Error setting up the request
          errorMessage = error.message;
        }

        setRoyaltyData({
          royaltyReceived: 0,
          approvedPayouts: 0,
          loading: false,
          error: errorMessage,
        });
      }
    };

    fetchData();
  }, []);

  if (royaltyData.loading) {
    return (
      <div className="col-md-6 col-lg-4 mb-4">
        <div className="card">
          <div className="card-body d-flex justify-content-center align-items-center p-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (royaltyData.error) {
    return (
      <div className="col-md-6 col-lg-4 mb-4">
        <div className="card">
          <div className="card-body">
            <div className="alert alert-danger mb-0">{royaltyData.error}</div>
          </div>
        </div>
      </div>
    );
  }

  // Helper to format amounts to 2 decimal places
  const formatAmount = (amount) => {
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Destructure amounts for display
  const totalEarnings = royaltyData.royaltyReceived;
  const totalPayouts = royaltyData.approvedPayouts;

  return (
    <div className="col-6 mb-4">
      <div className="card">
        <div className="card-body">
          <div className="card-title d-flex align-items-start justify-content-between">
            <i className="bx bx-check-circle text-success fs-3"></i>
            <div className="dropdown">
              <button
                aria-label="Click me"
                className="btn p-0"
                type="button"
                id="cardOpt2"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="bx bx-dots-vertical-rounded"></i>
              </button>
              <div className="dropdown-menu" aria-labelledby="cardOpt2">
                <a aria-label="view more" className="dropdown-item" href="#">
                  View Payout History
                </a>
              </div>
            </div>
          </div>
          <span className="fw-medium d-block mb-1">Total royalty received</span>
          <h3 className="card-title mb-2 text-success">
            ₹{formatAmount(totalPayouts)}
          </h3>
          <small className="text-muted fw-medium d-flex align-items-center">
            <i className="bx bx-money-withdraw me-1"></i>
            Approved payout
          </small>
        </div>
      </div>
    </div>
  );
};
