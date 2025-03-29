import { useState, useEffect } from "react";
import axios from "axios";

export const ProfileReport = () => {
  const [yearlyData, setYearlyData] = useState([]);
  const [currentYearData, setCurrentYearData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const { yearlyPerformance } = response.data;
        
        if (yearlyPerformance && yearlyPerformance.length > 0) {
          // Sort by most recent year first
          const sortedYearlyData = [...yearlyPerformance].sort((a, b) => b.year - a.year);
          setYearlyData(sortedYearlyData);
          
          // Set current year data (most recent year)
          const mostRecentYear = sortedYearlyData[0];
          setCurrentYearData(mostRecentYear);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate total revenue for the year
  const totalRevenue = currentYearData?.monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0) || 0;
  
  // Calculate growth percentage
  const calculateGrowth = () => {
    // If we have data for at least 2 years
    if (yearlyData.length >= 2) {
      const currentYearTotal = currentYearData?.monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0) || 0;
      
      // Get previous year data
      const previousYearData = yearlyData[1];
      const previousYearTotal = previousYearData?.monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0) || 0;
      
      // Calculate growth percentage
      if (previousYearTotal > 0) {
        return ((currentYearTotal - previousYearTotal) / previousYearTotal) * 100;
      }
    }
    
    // Default growth percentage if we can't calculate
    return 0;
  };
  
  const growthPercentage = calculateGrowth();

  return (
    <div className="col-12 mb-4">
      <div className="card">
        <div className="card-body p-4">
          {loading ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex flex-column">
                <div className="d-flex align-items-center mb-2">
                  <h5 className="card-title mb-0 me-2">Revenue Summary</h5>
                  <span className="badge bg-label-primary rounded-pill">
                    {currentYearData?.year || 'N/A'}
                  </span>
                </div>
                
                <div className="d-flex align-items-baseline">
                  <h3 className="display-6 fw-bold mb-0 me-2">₹{(totalRevenue/1000).toFixed(1)}k</h3>
                  <div className={`badge ${growthPercentage >= 0 ? 'bg-success' : 'bg-danger'} rounded-pill py-1 px-2`}>
                    <i className={`bx ${growthPercentage >= 0 ? 'bx-up-arrow-alt' : 'bx-down-arrow-alt'} me-1`}></i>
                    {Math.abs(growthPercentage).toFixed(1)}%
                  </div>
                </div>
              </div>
              
              <div className="text-end">
                <div className="rounded-circle  bg-primary-100 bg-opacity-10 p-3 d-inline-flex">
                  <i className="bx bx-dollar-circle text-primary fs-1"></i>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};