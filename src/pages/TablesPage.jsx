import { useState, useEffect } from "react";
import axiosInstance from "../services/api";

// Main component for displaying book inventory and sales data in a table format
export const TablesPage = () => {
  // State for search functionality
  const [searchQuery, setSearchQuery] = useState("");
  // State for sorting configuration (which column to sort by and direction)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  // State for book data and loading
  const [bookData, setBookData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch book data from backend
  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await axiosInstance.get("/books");
        const booksData = response.data.books;

        // Transform the data to match our table structure
        const combinedData = booksData.map((book) => {
          // Calculate royalty as sold copies * price
          const royaltyEarned = book.soldCopies * book.price;

          return {
            id: book._id,
            bookName: book.title,
            mrp: book.price,
            quantityLeft: book.stock,
            coverImage: book.coverImage || "https://via.placeholder.com/48x64",
            salesData: {
              totalSold: book.soldCopies,
              royaltyEarned: royaltyEarned, // Using the calculated royalty instead of book.royalties
              monthlyGrowth: book.lastMonthSale,
            },
          };
        });

        setBookData(combinedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching book data:", err);
        setError("Failed to load book data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, []);

  // Handler for column sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Sort the data based on current sort configuration
  const sortedData = [...bookData].sort((a, b) => {
    if (sortConfig.key === "royaltyEarned") {
      // Special handling for nested royaltyEarned property
      const valueA = a.salesData.royaltyEarned;
      const valueB = b.salesData.royaltyEarned;

      if (valueA < valueB) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    } else if (sortConfig.key === "booksSold") {
      // Special handling for nested totalSold property
      const valueA = a.salesData.totalSold;
      const valueB = b.salesData.totalSold;

      if (valueA < valueB) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    } else if (sortConfig.key) {
      // Standard sorting for direct properties
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
    }
    return 0;
  });

  // Filter data based on search query
  const filteredData = sortedData.filter((book) =>
    book.bookName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper function to display sort direction arrows
  const getSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "↑" : "↓";
    }
    return "↕";
  };

  // Helper function for stock status
  const getStockStatus = (quantity) => {
    if (quantity <= 10) return "text-danger";
    if (quantity <= 30) return "text-warning";
    return "text-success";
  };

  if (loading)
    return (
      <div className="card">
        <div className="card-body text-center">Loading book data...</div>
      </div>
    );
  if (error)
    return (
      <div className="card">
        <div className="card-body text-center text-danger">{error}</div>
      </div>
    );

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Books Inventory & Sales</h5>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Cover</th>
              <th
                onClick={() => handleSort("bookName")}
                style={{ cursor: "pointer" }}
              >
                Book Name {getSortArrow("bookName")}
              </th>
              <th
                onClick={() => handleSort("mrp")}
                style={{ cursor: "pointer" }}
              >
                Price {getSortArrow("mrp")}
              </th>
              <th
                onClick={() => handleSort("quantityLeft")}
                style={{ cursor: "pointer" }}
              >
                Stock {getSortArrow("quantityLeft")}
              </th>
              <th
                onClick={() => handleSort("royaltyEarned")}
                style={{ cursor: "pointer" }}
              >
                Royalty {getSortArrow("royaltyEarned")}
              </th>
              <th
                onClick={() => handleSort("booksSold")}
                style={{ cursor: "pointer" }}
              >
                Sold {getSortArrow("booksSold")}
              </th>
              <th>Sales Progress</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((book) => {
              const totalInventory =
                book.quantityLeft + book.salesData.totalSold || 0;
              const salesPercentage =
                totalInventory > 0
                  ? (book.salesData.totalSold / totalInventory) * 100
                  : 0;

              return (
                <tr key={book.id}>
                  <td>
                    <img
                      src={book.coverImage || book.image}
                      alt={book.bookName}
                      className="rounded shadow"
                      width="48"
                      height="64"
                    />
                  </td>
                  <td>
                    <div className="fw-semibold">{book.bookName}</div>
                    <small className="text-muted">ID: #{book.id}</small>
                  </td>
                  <td className="fw-medium">₹{book.mrp.toFixed(2)}</td>
                  <td>
                    <span
                      className={`badge ${getStockStatus(
                        book.quantityLeft
                      )} bg-label-primary`}
                    >
                      {book.quantityLeft} in stock
                    </span>
                  </td>
                  <td className="text-success fw-medium">
                    ₹
                    {book.salesData.royaltyEarned?.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    }) || "0.00"}
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <span className="fw-medium me-2">
                        {book.salesData.totalSold || 0}
                      </span>
                      <div className="progress w-100" style={{ height: "8px" }}>
                        <div
                          className="progress-bar bg-primary"
                          role="progressbar"
                          style={{ width: `${salesPercentage}%` }}
                          aria-valuenow={salesPercentage}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="avatar avatar-sm">
                        <div
                          className={`avatar-initial bg-label-${
                            book.salesData.monthlyGrowth >= 0
                              ? "success"
                              : "danger"
                          } rounded`}
                        >
                          <i
                            className={`bx bx-trending-${
                              book.salesData.monthlyGrowth >= 0 ? "up" : "down"
                            }`}
                          ></i>
                        </div>
                      </div>
                      <div className="ms-2">
                        <small className="text-muted">Last Month</small>
                        <div className="fw-medium">
                          {book.salesData.monthlyGrowth >= 0 ? "+" : ""}
                          {book.salesData.monthlyGrowth || 0}%
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <div className="text-center p-5">
            <h6 className="text-muted">
              No books found matching your search criteria
            </h6>
          </div>
        )}
      </div>
    </div>
  );
};
