import { useState, useEffect } from "react";
import { StarFill } from "react-bootstrap-icons";
import { getBookCover } from "../utils/imageUtils";
import "../pages/AuthorBooks.css";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "../services/apiConfig";

export const AuthorBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found");

        const response = await fetch(getApiUrl("books"), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch books");
        const data = await response.json();
        setBooks(data.books);
        setError(null);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleOrderBookClick = () => {
    console.log("Navigating to author-book-purchase page");
    navigate("/author-book-purchase");
  };

  const renderRating = (rating) => {
    return [...Array(5)].map((_, index) => (
      <StarFill
        key={index}
        className={`${
          index < rating ? "text-warning" : "text-secondary opacity-25"
        } me-1`}
        size={16}
      />
    ));
  };

  if (loading) {
    return (
      <div className="container-fluid py-5">
        <div className="row min-vh-50 d-flex justify-content-center align-items-center">
          <div className="col-12 text-center">
            <div className="spinner-grow text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted fw-light">
              Fetching your published books...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div
              className="alert alert-danger shadow-sm border-0 d-flex align-items-center"
              role="alert"
            >
              <i className="bx bx-error-circle fs-3 me-3"></i>
              <div>
                <h5 className="alert-heading mb-1">
                  Unable to load your books
                </h5>
                <p className="mb-0 fw-light">{error}</p>
                <button
                  className="btn btn-sm btn-outline-danger mt-3"
                  onClick={() => window.location.reload()}
                >
                  <i className="bx bx-refresh me-1"></i> Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-md-4">
      <header className="row mb-4 mb-lg-5 align-items-center">
        <div className="col-md-8">
          <h3 className="fw-bold text-primary mb-2 animate__animated animate__fadeIn">
            Your Published Books
          </h3>
          <p className="text-muted lead fw-light animate__animated animate__fadeIn animate__delay-1s">
            Manage your collection and track performance metrics
          </p>
        </div>
        <div className="col-md-4 d-flex justify-content-md-end mt-3 mt-md-0">
          <button
            className="btn btn-primary px-4 py-2 shadow-sm animate__animated animate__fadeIn animate__delay-2s"
            onClick={handleOrderBookClick}
          >
            <i className="bx bx-shopping-bag me-2"></i> Order Book
          </button>
        </div>
      </header>

      {books.length === 0 ? (
        <div className="row justify-content-center py-5">
          <div className="col-md-8 col-lg-6 text-center">
            <div className="py-5">
              <i
                className="bx bx-book-open text-muted"
                style={{ fontSize: "4rem" }}
              ></i>
              <h5 className="mt-4">No books published yet</h5>
              <p className="text-muted">
                Start your publishing journey by adding your first book.
              </p>
              <button className="btn btn-primary mt-3">
                <i className="bx bx-plus me-2"></i> Publish Your First Book
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          {books.map((book, index) => (
            <div key={book.id || index} className="col-12 mb-4">
              <div
                className="card broad-card shadow-sm"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="row g-0 align-items-center">
                  {/* Book Cover Column */}
                  <div className="col-md-3 text-center p-3">
                    <img
                      src={getBookCover(book)}
                      alt={book.title}
                      className="img-fluid rounded-start book-cover-broad"
                      loading="lazy"
                    />
                  </div>
                  {/* Book Details Column */}
                  <div className="col-md-9">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5
                          className="card-title fw-bold text-truncate"
                          title={book.title}
                        >
                          {book.title}
                        </h5>
                        <div className="d-flex">
                          {renderRating(book.publication.rating)}
                        </div>
                      </div>
                      <p className="card-text">
                        <small className="text-muted">
                          Published on{" "}
                          {new Date(
                            book.publication.publishedDate
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </small>
                      </p>
                      <div className="mb-3">
                        <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-medium">
                          {book.category}
                        </span>
                      </div>
                      <div className="d-flex flex-wrap gap-3 mb-3">
                        <div className="d-flex align-items-center bg-light rounded-pill px-3 py-2">
                          <span className="text-muted small me-2">Price</span>
                          <span className="fw-bold text-success">
                            ₹{Number(book.price).toLocaleString()}
                          </span>
                        </div>
                        <div className="d-flex align-items-center bg-light rounded-pill px-3 py-2">
                          <span className="text-muted small me-2">Stock</span>
                          <span className="fw-bold">{book.stock} units</span>
                        </div>
                        <div className="d-flex align-items-center bg-light rounded-pill px-3 py-2">
                          <span className="text-muted small me-2">ISBN</span>
                          <span className="badge bg-info rounded-pill">
                            {book.isbn}
                          </span>
                        </div>
                      </div>
                      <div className="marketplace-links d-flex flex-wrap gap-2 mb-3">
                        <a
                          href={book.marketplaceLinks?.amazon}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-dark btn-amazon"
                        >
                          <i className="fab fa-amazon me-2"></i>Amazon
                        </a>
                        <a
                          href={book.marketplaceLinks?.flipkart}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary btn-flipkart"
                        >
                          <i className="fas fa-shopping-bag me-2"></i>Flipkart
                        </a>
                      </div>
                      <div className="performance-metrics d-flex flex-wrap bg-light rounded-4 p-3">
                        <div className="me-4">
                          <div className="text-muted small mb-1">
                            Sold Copies
                          </div>
                          <div className="h5 mb-0 text-success">
                            {(book.soldCopies || 0).toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted small mb-1">Earnings</div>
                          <div className="h5 mb-0 text-success">
                            ₹{Number(book.royalties || 0).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuthorBooks;