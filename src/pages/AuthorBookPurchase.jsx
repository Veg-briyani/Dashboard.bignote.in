import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getApiUrl, getAuthHeaders } from '../services/apiConfig';

const AuthorBookPurchase = () => {
  // State management
  const [books, setBooks] = useState([]);
  const [profitData, setProfitData] = useState({
    totalRoyalty: 0,
    growth: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [quantity, setQuantity] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [processing, setProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();

  // Fetch author's books and profit data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");
        
        // Add balance fetching
        await fetchBalance();
        
        // Fetch books
        const booksResponse = await fetch(getApiUrl("books"), {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!booksResponse.ok) throw new Error("Failed to fetch books");
        const booksData = await booksResponse.json();
        
        // Ensure we're getting an array
        setBooks(Array.isArray(booksData) ? booksData : booksData?.books || []);
        
        // Fetch profit data using axios
        const profitResponse = await axios.get(getApiUrl("books/dashboard"), {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setProfitData({
          totalRoyalty: profitResponse.data.totalRoyaltyEarned || 0,
          growth: profitResponse.data.currentMonthGrowth || 0
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate order total
  const calculateTotal = () => {
    if (!selectedBook) return 0;
    return selectedBook.price * quantity;
  };

  // Check if wallet has sufficient balance
  const hasSufficientBalance = () => {
    return profitData.totalRoyalty >= calculateTotal();
  };

  // Handle order submission
  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate selected book
      if (!selectedBook || !selectedBook._id) {
        toast.error('Please select a valid book');
        return;
      }

      setProcessing(true);

      const response = await axios.post(getApiUrl("orders"), {
        bookId: selectedBook._id,
        quantity,
        paymentMethod
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.data.paymentMethod === 'razorpay') {
        // Handle Razorpay integration
        const options = {
          key: response.data.razorpayKeyId, // Key ID from backend
          amount: response.data.amount, // Amount in smallest currency unit
          currency: "INR",
          name: "Author Dashboard",
          description: `Purchase of ${quantity} copies of ${selectedBook.title}`,
          order_id: response.data.orderId,
          handler: async function (razorpayResponse) {
            try {
              // Send payment verification to backend
              const verifyPayment = await axios.post(
                getApiUrl("orders/verify-payment"),
                {
                  razorpayOrderId: razorpayResponse.razorpay_order_id,
                  razorpayPaymentId: razorpayResponse.razorpay_payment_id,
                  razorpaySignature: razorpayResponse.razorpay_signature,
                  bookId: selectedBook._id,
                  quantity: quantity
                },
                {
                  headers: { 
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                  }
                }
              );
              
              if (verifyPayment.data.success) {
                await fetchUpdatedProfitData();
                toast.success('Payment successful! Your order has been placed.');
                setOrderSuccess(true);
                setTimeout(() => {
                  navigate('/orders');
                }, 2000);
              } else {
                toast.error('Payment verification failed. Please contact support.');
                setOrderError('Payment verification failed');
              }
            } catch (error) {
              console.error('Verification error:', error);
              toast.error('Payment verification failed. Please try again.');
              setOrderError('Payment verification failed');
            }
          },
          prefill: {
            name: response.data.user?.name || "",
            email: response.data.user?.email || "",
          },
          theme: {
            color: "#696cff"
          },
          modal: {
            ondismiss: function() {
              setProcessing(false);
              setOrderError('Payment cancelled');
            }
          }
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
      } else {
        toast.success('Order placed successfully using wallet!');
        setOrderSuccess(true);
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
      }
    } catch (error) {
      console.error('Order error:', error);
      const errorMessage = error.response?.data?.message || 'Order failed. Please try again.';
      
      if (error.response?.data?.details) {
        toast.error(
          <div>
            <p>{errorMessage}</p>
            <ul>
              {error.response.data.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>
        );
      } else {
        toast.error(errorMessage);
      }
      
      setOrderError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };
  
  // Fetch updated profit data
  const fetchUpdatedProfitData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const response = await axios.get(getApiUrl("books/dashboard"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProfitData({
        totalRoyalty: response.data.totalRoyaltyEarned || 0,
        growth: response.data.currentMonthGrowth || 0
      });
    } catch (err) {
      console.error("Error fetching profit data:", err);
    }
  };
  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(getApiUrl("auth/profile"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setBalance(response.data.walletBalance || 0);
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  }
  // Reset modal state
  const resetModal = () => {
    setShowModal(false);
    setSelectedBook(null);
    setQuantity(2);
    setPaymentMethod('wallet');
    setOrderSuccess(false);
    setOrderError(null);
  };

  // Open order modal
  const openOrderModal = (book) => {
    setSelectedBook(book);
    setQuantity(paymentMethod === 'wallet' ? 2 : 3);
    setShowModal(true);
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    // Set default quantity based on payment method
    setQuantity(method === 'wallet' ? 2 : 3);
  };

  // Add format function (or import from utilities)
  const formatAmount = (amount) => {
    return Number(amount).toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    });
  };

  if (loading) {
    return (
      <div className="container-xxl flex-grow-1 container-p-y d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-1">Purchase Your Books</h4>
                  <p className="text-muted mb-0">Order copies of your published books for personal distribution</p>
                </div>
                <div className="d-flex align-items-center">
                  <div className="me-4 bg-label-success p-2 rounded">
                    <div className="d-flex align-items-center">
                      <i className="bx bx-wallet fs-3 me-2"></i>
                      <div>
                        <span className="fw-semibold">₹{formatAmount(balance)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="btn-group">
                    <button
                      type="button"
                      className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <i className="bx bx-grid-alt me-1"></i> Grid
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setViewMode('list')}
                    >
                      <i className="bx bx-list-ul me-1"></i> List
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Books Display */}
      {viewMode === 'grid' ? (
        <div className="row g-4">
          {(books || []).map((book) => (
            <div key={book.id} className="col-xl-3 col-lg-4 col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex flex-column align-items-center">
                    <img
                      src={book.coverImage || "/assets/img/book-placeholder.png"}
                      alt={book.title}
                      className="img-fluid rounded shadow-sm mb-3"
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                    <h5 className="text-center mb-1">{book.title}</h5>
                    <p className="text-muted small mb-2">ISBN: {book.isbn}</p>
                    <div className="d-flex gap-1 mb-3">
                      {book.formats && book.formats.map((format, i) => (
                        <span key={i} className="badge bg-label-secondary">{format}</span>
                      ))}
                    </div>
                    <p className="fw-semibold text-primary mb-3">₹{book.price.toFixed(2)} per copy</p>
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => openOrderModal(book)}
                    >
                      <i className="bx bx-cart-add me-1"></i> Order Copies
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>ISBN</th>
                  <th>Formats</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(books || []).map((book) => (
                  <tr key={book.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={book.coverImage || "/assets/img/book-placeholder.png"}
                          alt={book.title}
                          className="rounded me-3"
                          style={{ height: "48px", width: "36px", objectFit: "cover" }}
                        />
                        <span>{book.title}</span>
                      </div>
                    </td>
                    <td>{book.isbn}</td>
                    <td>
                      <div className="d-flex gap-1">
                        {book.formats && book.formats.map((format, i) => (
                          <span key={i} className="badge bg-label-secondary">{format}</span>
                        ))}
                      </div>
                    </td>
                    <td>₹{book.price.toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => openOrderModal(book)}
                      >
                        <i className="bx bx-cart-add me-1"></i> Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Modal */}
      {showModal && selectedBook && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary bg-opacity-10 ">
                <h5 className="modal-title text-white">Order Book Copies</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={resetModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {orderSuccess ? (
                  <div className="text-center p-4">
                    <div className="mb-4">
                      <i className="bx bx-check-circle text-success display-1"></i>
                    </div>
                    <h4 className="mb-2">Order Successful!</h4>
                    <p className="mb-4">Your order for {quantity} copies of "{selectedBook.title}" has been placed successfully.</p>
                    <div className="alert alert-light border">
                      <small>Your order download links will be available in your dashboard within 24 hours.</small>
                    </div>
                    <button
                      className="btn btn-primary mt-3"
                      onClick={resetModal}
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="d-flex align-items-center mb-4 p-3 bg-light rounded">
                      <img
                        src={selectedBook.coverImage || "/assets/img/book-placeholder.png"}
                        alt={selectedBook.title}
                        className="rounded me-3"
                        style={{ height: "72px", width: "54px", objectFit: "cover" }}
                      />
                      <div>
                        <h6 className="mb-1">{selectedBook.title}</h6>
                        <div className="text-muted small mb-1">ISBN: {selectedBook.isbn}</div>
                        <div className="text-primary">₹{selectedBook.price.toFixed(2)} per copy</div>
                      </div>
                    </div>

                    <div className="nav nav-tabs mb-3">
                      <button
                        className={`nav-link ${paymentMethod === 'wallet' ? 'active' : ''}`}
                        onClick={() => handlePaymentMethodChange('wallet')}
                      >
                        <i className="bx bx-wallet me-1"></i> Wallet
                        <span className="badge bg-label-success ms-2">₹{formatAmount(balance)}</span>
                      </button>
                      <button
                        className={`nav-link ${paymentMethod === 'razorpay' ? 'active' : ''}`}
                        onClick={() => handlePaymentMethodChange('razorpay')}
                      >
                        <i className="bx bx-credit-card me-1"></i> Razorpay
                      </button>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="quantity" className="form-label">Quantity</label>
                      <div className="input-group">
                        <button
                          className="btn btn-outline-primary"
                          type="button"
                          onClick={(e) => { e.preventDefault(); setQuantity(Math.max(1, quantity - 1)); }}
                        >
                          <i className="bx bx-minus"></i>
                        </button>
                        <input
                          type="number"
                          className="form-control text-center"
                          id="quantity"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          min="1"
                        />
                        <button
                          className="btn btn-outline-primary"
                          type="button"
                          onClick={(e) => { e.preventDefault(); setQuantity(quantity + 1); }}
                        >
                          <i className="bx bx-plus"></i>
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                        <span className="fw-semibold">Total Amount:</span>
                        <span className="fs-5 fw-bold text-primary">₹{calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>

                    {paymentMethod === 'wallet' && !hasSufficientBalance() && (
                      <div className="alert alert-warning mb-3">
                        <i className="bx bx-error-circle me-2"></i>
                        Insufficient royalty balance. Please add funds or choose Razorpay.
                      </div>
                    )}

                    {orderError && (
                      <div className="alert alert-danger mb-3">
                        <i className="bx bx-error-circle me-2"></i>
                        {orderError}
                      </div>
                    )}

                    <div className="alert alert-light border mb-3">
                      <div className="d-flex">
                        <i className="bx bx-lock-alt text-muted me-2 fs-5"></i>
                        <small>Your payment information is encrypted and securely processed. This transaction is PCI DSS compliant.</small>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {!orderSuccess && (
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={resetModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleOrderSubmit}
                    disabled={
                      processing ||
                      (paymentMethod === 'wallet' && !hasSufficientBalance())
                    }
                  >
                    {processing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : (
                      <>Complete Order</>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Mock data structure (for reference)
const mockBookStructure = {
  id: "book123",
  title: "The Creative Process",
  isbn: "978-1234567890",
  coverImage: "/assets/img/covers/book1.jpg",
  price: 299.99,
  formats: ["Paperback", "Hardcover"]
};

export default AuthorBookPurchase;