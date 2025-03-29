import { useState, useEffect } from "react";
import axios from "axios";

export const SalesCard = () => {
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    growth: 0,
  });

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/books/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });

        setSalesData({
          totalSales: response.data.copiesSold || 0,
          growth: response.data.currentMonthGrowth || 0,
        });
      } catch (error) {
        console.error("Error fetching sales data:", error.response?.data || error.message);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <div className="col-lg-6 col-md-12 col-6 mb-4">
      <div className="card">
        <div className="card-body">
          <div className="card-title d-flex align-items-start justify-content-between">
            <div className="avatar flex-shrink-0">
              <img
                aria-label="dashboard icon image"
                src="/assets/img/icons/unicons/wallet-info.png"
                alt="Credit Card"
                className="rounded"
              />
            </div>
            <div className="dropdown">{/* ... dropdown content ... */}</div>
          </div>
          <span>Copies Sold</span>
          <h3 className="card-title text-nowrap mb-1">
            {salesData.totalSales.toLocaleString()} copies
          </h3>
          <small className={`text-${salesData.growth >= 0 ? "success" : "danger"} fw-medium`}>
            <i className={`bx bx-${salesData.growth >= 0 ? "up" : "down"}-arrow-alt`}></i>{" "}
            {salesData.growth.toFixed(2)}%
          </small>
        </div>
      </div>
    </div>
  );
};
