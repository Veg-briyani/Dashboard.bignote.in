import { useState, useEffect } from "react";
import { StarFill } from "react-bootstrap-icons";
import { getBookCover } from '../utils/imageUtils';
import '../pages/AuthorBooks.css';
import { useNavigate } from 'react-router-dom';
import { getApiUrl, getFetchOptions } from "../services/apiConfig";

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

  const renderRating = (rating) => {
    return [...Array(5)].map((_, index) => (
      <StarFill
        key={index}
        className={`${index < rating ? "text-warning" : "text-secondary opacity-25"} me-1`}
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
            <p className="mt-3 text-muted fw-light">Fetching your published books...</p>
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
            <div className="alert alert-danger shadow-sm border-0 d-flex align-items-center" role="alert">
              <i className="bx bx-error-circle fs-3 me-3"></i>
              <div>
                <h5 className="alert-heading mb-1">Unable to load your books</h5>
                <p className="mb-0 fw-light">{error}</p>
                <button className="btn btn-sm btn-outline-danger mt-3" onClick={() => window.location.reload()}>
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
          <h3 className="fw-bold text-primary mb-2 animate__animated animate__fadeIn">Your Published Books</h3>
          <p className="text-muted lead fw-light animate__animated animate__fadeIn animate__delay-1s">
            Manage your collection and track performance metrics
          </p>
        </div>
        <div className="col-md-4 d-flex justify-content-md-end mt-3 mt-md-0">
          <button 
            className="btn btn-primary px-4 py-2 shadow-sm animate__animated animate__fadeIn animate__delay-2s"
          >
            <i className="bx bx-shopping-bag me-2"></i> Order Book
          </button>
        </div>
      </header>

      {books.length === 0 ? (
        <div className="row justify-content-center py-5">
          <div className="col-md-8 col-lg-6 text-center">
            <div className="py-5">
              <i className="bx bx-book-open text-muted" style={{ fontSize: "4rem" }}></i>
              <h5 className="mt-4">No books published yet</h5>
              <p className="text-muted">Start your publishing journey by adding your first book.</p>
              <button className="btn btn-primary mt-3">
                <i className="bx bx-plus me-2"></i> Publish Your First Book
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {books.map((book, index) => (
            <div key={book.id} className="col">
              <div 
                className="card h-100 border-0 shadow-sm book-card" 
                style={{ 
                  animationDelay: `${index * 0.1}s` 
                }}
              >
                <div className="position-relative">
                  <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-start pt-3 pb-0">
                    <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-medium">
                      {book.category}
                    </span>
                    <div className="d-flex">{renderRating(book.publication.rating)}</div>
                  </div>
                  
                  <div className="text-center position-relative my-3">
                    <div className="book-cover-wrapper">
                      <img
                        src={getBookCover(book)}
                        alt={book.title}
                        className="book-cover rounded shadow"
                        loading="lazy"
                      />
                      <div className="book-hover-overlay d-flex justify-content-center align-items-center">
                        <button className="btn btn-sm btn-light me-2">
                          <i className="bx bx-edit"></i>
                        </button>
                        <button className="btn btn-sm btn-light">
                          <i className="bx bx-show"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-body pt-0">
                  <h5 className="book-title fw-bold mb-3 text-truncate" title={book.title}>
                    {book.title}
                  </h5>
                  
                  <div className="book-details mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2 bg-light rounded-pill px-3 py-2">
                      <span className="text-muted small">Price</span>
                      <span className="fw-bold text-success">₹{Number(book.price).toLocaleString()}</span>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center mb-2 bg-light rounded-pill px-3 py-2">
                      <span className="text-muted small">Stock</span>
                      <span className="fw-bold">{book.stock} units</span>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center bg-light rounded-pill px-3 py-2">
                      <span className="text-muted small">ISBN</span>
                      <span className="badge bg-info rounded-pill">{book.isbn}</span>
                    </div>
                  </div>
                  
                  <div className="publication-date d-flex align-items-center mb-3 text-muted small">
                    <i className="bx bx-calendar me-2"></i>
                    Published on {new Date(book.publication.publishedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>

                <div className="card-footer bg-transparent border-0 pb-4">
                  <div className="marketplace-links d-grid gap-2 mb-4">
                    <a
                      href={book.marketplaceLinks.amazon}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-dark btn-amazon"
                    >
                      <i className="fab fa-amazon me-2"></i> Amazon
                    </a>
                    <a
                      href={book.marketplaceLinks.flipkart}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary btn-flipkart"
                    >
                      <i className="fas fa-shopping-bag me-2"></i> Flipkart
                    </a>
                  </div>

                  <div className="performance-metrics bg-light rounded-4 p-3">
                    <div className="row text-center">
                      <div className="col-6 border-end">
                        <div className="text-muted small mb-1">Sold Copies</div>
                        <div className="h5 mb-0 text-success">{book.soldCopies.toLocaleString()}</div>
                      </div>
                      <div className="col-6">
                        <div className="text-muted small mb-1">Earnings</div>
                        <div className="h5 mb-0 text-success">₹{Number(book.royalties).toLocaleString()}</div>
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

// CSS to be added to your global stylesheet
const styles = `
/* Core Styles */
.book-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
  overflow: hidden;
}

.book-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
}

/* Book Cover Styling */
.book-cover-wrapper {
  position: relative;
  display: inline-block;
  perspective: 1000px;
}

.book-cover {
  height: 180px;
  width: 130px;
  object-fit: cover;
  transition: transform 0.4s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transform-style: preserve-3d;
}

.book-cover-wrapper:hover .book-cover {
  transform: rotateY(10deg);
}

.book-hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.book-cover-wrapper:hover .book-hover-overlay {
  opacity: 1;
  pointer-events: auto;
}

.book-title {
  font-size: 1.1rem;
  line-height: 1.4;
  color: #333;
}

/* Marketplace Buttons */
.btn-amazon {
  border-width: 2px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-amazon:hover {
  background-color: #ff9900;
  border-color: #ff9900;
  color: white;
}

.btn-flipkart {
  border-width: 2px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-flipkart:hover {
  background-color: #047bd5;
  border-color: #047bd5;
  color: white;
}

/* Performance Metrics */
.performance-metrics {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) inset;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Adjustments */
@media (max-width: 767px) {
  .book-cover {
    height: 160px;
    width: 115px;
  }
}

@media (min-width: 992px) {
  .book-details > div {
    transition: transform 0.2s ease;
  }
  
  .book-details > div:hover {
    transform: translateX(5px);
  }
}

/* Add Animate.css library for enhanced animations */
/* Import in your index.html: */
/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" /> */
`;

export default AuthorBooks;