import React, { useState, useEffect } from "react";
import axios from "axios";
import "boxicons/css/boxicons.min.css";

export const PaymentCard = () => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        // Use the VITE_API_URL environment variable
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${apiUrl}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Extract wallet balance from profile response
        const { walletBalance } = response.data;
        setWalletBalance(walletBalance || 0);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching wallet data:", err);
        setError("Failed to load wallet data");
        setLoading(false);
      }
    };

    fetchWalletBalance();
  }, []);

  if (loading) {
    return (
      <div className="col-lg-6 col-md-12 col-6 mb-4">
        <div className="card h-100">
          <div className="card-body d-flex justify-content-center align-items-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-lg-6 col-md-12 col-6 mb-4">
        <div className="card h-100">
          <div className="card-body">
            <div className="alert alert-danger mb-0">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  // Format wallet balance to 2 decimal places if it has decimals
  const formattedBalance = Number.isInteger(walletBalance)
    ? walletBalance.toLocaleString()
    : walletBalance.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

  return (
    <div className="col-lg-6 col-md-12 col-6 mb-4">
      <div className="card h-100">
        <div className="card-body">
          <div className="card-title d-flex align-items-start justify-content-between mb-3">
            <img
              aria-label="dashboard icon image"
              src="/assets/img/icons/unicons/wallet-info.png"
              alt="chart success"
              className="rounded"
              style={{ width: '39px', height: '40px' }} // Set desired width and height
            />
            <div className="dropdown">
              <button
                aria-label="Click me"
                className="btn p-0"
                type="button"
                id="cardOpt4"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >

              </button>
               
            </div>
          </div>
          <span className="d-block text-muted mb-1">Wallet Balance</span>
          <h3 className="card-title text-nowrap mb-2 fw-bold text-primary">
            ₹{formattedBalance}
          </h3>
          <div className="d-flex align-items-center">
            <span className="badge bg-label-success rounded-pill">
              Available
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
