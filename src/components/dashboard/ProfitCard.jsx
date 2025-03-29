// Total Royalty Earned
import { useState, useEffect } from "react";
import axios from "axios";
import 'boxicons/css/boxicons.min.css';
export const ProfitCard = () => {
  const [profitData, setProfitData] = useState({
    totalRoyalty: 0,
    growth: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfitData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/books/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });

        setProfitData({
          totalRoyalty: response.data.totalRoyaltyEarned || 0,
          growth: response.data.currentMonthGrowth || 0
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profit data:", err);
        setError("Failed to load profit data");
        setLoading(false);
      }
    };

    fetchProfitData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="col-lg-6 col-md-12 col-6 mb-4">
      <div className="card">
        <div className="card-body">
          <div className="card-title d-flex align-items-start justify-content-between">
            <div className="avatar flex-shrink-0">
              <img
                aria-label="dashboard icon image"
                src="/assets/img/icons/unicons/chart-success.png"
                alt="chart success"
                className="rounded"
              />
            </div>
             
          </div>
          <span className="fw-medium d-block mb-1">Total Royalty Earned</span>
          <h3 className="card-title mb-2">₹{profitData.totalRoyalty.toLocaleString()}</h3>
          <small className="text-success fw-medium">
            <i className="bx bx-up-arrow-alt"></i> +{profitData.growth.toFixed(2)}%
          </small>
        </div>
      </div>
    </div>
  );
};
