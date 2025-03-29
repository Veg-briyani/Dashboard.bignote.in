import ReactApexChart from "react-apexcharts";
import { useState, useEffect } from "react";
import axios from "axios";

export const AuthorStatistics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookStats, setBookStats] = useState({
    totalBooks: 0,
    totalEarnings: 0,
    totalInventory: 0,
    avgRoyalty: 0,
    categories: {},
  });

  const [chartOptions, setChartOptions] = useState({
    chart: {
      height: 165,
      type: "donut",
    },
    labels: [],
    series: [],
    colors: ["#696cff", "#71dd37", "#fdb528"],
    stroke: {
      width: 5,
      colors: ["#fff"],
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      padding: {
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
      },
    },
  });

  useEffect(() => {
    const fetchBookStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found");

        const response = await axios.get("http://localhost:5000/api/books", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const books = response.data.books;

        // Calculate statistics
        const stats = {
          totalBooks: books.length,
          totalEarnings: books.reduce((sum, book) => sum + book.royalties, 0),
          totalInventory: books.reduce((sum, book) => sum + book.stock, 0),
          avgRoyalty: 20, // Default value as per the design
          categories: {},
        };

        // Calculate category distribution
        books.forEach((book) => {
          if (!stats.categories[book.category]) {
            stats.categories[book.category] = {
              count: 1,
              copies: book.soldCopies + book.stock,
            };
          } else {
            stats.categories[book.category].count++;
            stats.categories[book.category].copies +=
              book.soldCopies + book.stock;
          }
        });

        setBookStats(stats);

        // Update chart options
        setChartOptions((prev) => ({
          ...prev,
          labels: Object.keys(stats.categories),
          series: Object.values(stats.categories).map((cat) => cat.copies),
        }));

        setLoading(false);
      } catch (err) {
        console.error("Error fetching book stats:", err);
        setError("Failed to load statistics");
        setLoading(false);
      }
    };

    fetchBookStats();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="col-md-6 col-lg-4 col-xl-4 order-0 mb-4">
      <div className="card h-100">
        <div className="card-header d-flex align-items-center justify-content-between pb-0">
          <div className="card-title mb-0">
            <h5 className="m-0 me-2">Author Statistics</h5>
            <small className="text-muted">
              Total Books Published: {bookStats.totalBooks}
            </small>
          </div>
          <div className="dropdown">
            <button
              aria-label="Click me"
              className="btn p-0"
              type="button"
              id="authorStatistics"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="bx bx-dots-vertical-rounded"></i>
            </button>
            <div
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="authorStatistics"
            >
              <a aria-label="refresh" className="dropdown-item" href="#">
                Refresh
              </a>
              <a aria-label="download" className="dropdown-item" href="#">
                Download Report
              </a>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3"></div>
          <div className="d-flex justify-content-between mb-4">
            <div className="d-flex flex-column">
              <span className="fw-semibold">₹{bookStats.totalEarnings}</span>
              <small className="text-muted">Total Earnings</small>
            </div>
            <div className="d-flex flex-column">
              <span className="fw-semibold">{bookStats.totalInventory}</span>
              <small className="text-muted">Total Inventory</small>
            </div>
            <div className="d-flex flex-column">
              <span className="fw-semibold">{80}%</span>
              <small className="text-muted">Avg. Royalty</small>
            </div>
          </div>

          <ul className="p-0 m-0">
            {Object.entries(bookStats.categories)
              .sort(([, a], [, b]) => b.copies - a.copies)
              .map(([category, data], index) => (
                <li key={category} className="d-flex mb-4 pb-1">
                  <div className="avatar flex-shrink-0 me-3">
                    <span
                      className={`avatar-initial rounded bg-label-${
                        index === 0
                          ? "primary"
                          : index === 1
                          ? "success"
                          : "warning"
                      }`}
                    >
                      <i
                        className={`bx ${
                          index === 0
                            ? "bx-book"
                            : index === 1
                            ? "bx-star"
                            : "bx-moon"
                        }`}
                      ></i>
                    </span>
                  </div>
                  <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                    <div className="me-2">
                      <h6 className="mb-0">{category}</h6>
                      <small className="text-muted">
                        {data.count} Book{data.count !== 1 ? "s" : ""}
                      </small>
                    </div>
                    <div className="user-progress">
                      <small className="fw-medium">{data.copies} copies</small>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
