import { useState, useEffect } from "react";
import { dashboardAPI } from "../../services/dashboardAPI";

export const WelcomeCard = () => {
  const [userData, setUserData] = useState({
    totalBooks: 0,
    totalInventory: 0,
    authorName: "Author", // Default value
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await dashboardAPI.getSummary();
        const { overallStats, authorName } = response.data;

        // Add null checks and provide default values
        const stats =
          overallStats && overallStats[0]
            ? overallStats[0]
            : { totalBooks: 0, totalInventory: 0 };

        setUserData({
          totalBooks: stats.totalBooks,
          totalInventory: stats.totalInventory,
          authorName: authorName || "Author", // Use fetched name or default
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Set default values on error
        setUserData({
          totalBooks: 0,
          totalInventory: 0,
          authorName: "Author",
        });
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="col-lg-8 mb-4 order-0">
      <div className="card">
        <div className="d-flex align-items-end row">
          <div className="col-sm-7">
            <div className="card-body">
              <h5 className="card-title text-primary">
                Welcome {userData.authorName}! 🎉
              </h5>
              <p className="mb-4">
                Welcome to your Author Dashboard, {userData.authorName}! Track
                your performance and engage with your
                audience all in one place.
              </p>
              <a href="#" className="btn btn-sm btn-outline-primary">
                View Profile
              </a>
            </div>
          </div>
          <div className="col-sm-5 text-center text-sm-left">
            <div className="card-body pb-0 px-0 px-md-4">
              <img
                src="/assets/img/illustrations/man-with-laptop-light.png"
                height="140"
                alt="View Badge User"
                data-app-dark-img="illustrations/man-with-laptop-dark.png"
                data-app-light-img="illustrations/man-with-laptop-light.png"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
