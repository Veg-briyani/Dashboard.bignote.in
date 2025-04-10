import PropTypes from "prop-types";
import { useState, useEffect, useMemo } from "react";
import EditProfileModal from "../components/EditProfileModal";
import { getApiUrl } from "../services/apiConfig";

const authorDataPropTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phoneNumber: PropTypes.string.isRequired,
  profile: PropTypes.shape({
    location: PropTypes.string,
    memberSince: PropTypes.string,
    bio: PropTypes.string,
    address: PropTypes.string,
  }).isRequired,
  photo: PropTypes.string,
  authorStats: PropTypes.shape({
    numberOfPublications: PropTypes.number,
    averageRating: PropTypes.number,
    numberOfFollowers: PropTypes.number,
    totalWorks: PropTypes.number,
  }).isRequired,
  achievements: PropTypes.arrayOf(PropTypes.string),
  bankAccount: PropTypes.shape({
    bankName: PropTypes.string,
    accountNumber: PropTypes.string,
    accountType: PropTypes.string,
  }).isRequired,
  kycDetails: PropTypes.shape({
    kycStatus: PropTypes.oneOf(["pending", "verified", "rejected"]),
    authMethod: PropTypes.string,
    documentType: PropTypes.string,
    documentNumber: PropTypes.string,
  }).isRequired,
};

export const AuthorDetails = () => {
  const [authorData, setAuthorData] = useState({
    profile: {},
    authorStats: {},
    bankAccount: {},
    kycStatus: "pending",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [books, setBooks] = useState([]);
  const [activeSection, setActiveSection] = useState("profile");
  
  const handlePhotoUpdate = (photoUrl) => {
    console.log("Updating profile photo to:", photoUrl);
    setAuthorData((prevData) => ({
      ...prevData,
      profile: {
        ...prevData.profile,
        profilePhoto: photoUrl,
      },
    }));
  };

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const response = await fetch(getApiUrl("auth/profile"), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch author data");

        const data = await response.json();
        setAuthorData({
          ...data,
          // Add these formatted properties
          kycDetails: {
            kycStatus: data.kycStatus || "pending",
            authMethod: data.authMethod || "email",
            documentType: data.aadhaarVerified
              ? "Aadhaar Card"
              : data.panVerified
              ? "PAN Card"
              : "Not Verified",
            documentNumber: data.aadhaarVerified
              ? data.aadhaarNumber
              : data.panVerified
              ? data.panNumber
              : "Not Available",
          },
          bankAccount: {
            bankName: data.bankAccount?.bankName || "Not Available",
            accountNumber: data.bankAccount?.accountNumber || "Not Available",
            accountType: "Savings",
            ifscCode: data.bankAccount?.ifscCode || "Not Available",
            verified: data.bankAccount?.verified || false,
          },
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(getApiUrl("books"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch books");
        const data = await response.json();
        setBooks(data.books);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };

    authorData && fetchBooks();
  }, [authorData]);

  const sortedBooks = useMemo(
    () =>
      [...books].sort(
        (a, b) =>
          new Date(b.publication.publishedDate).getTime() -
          new Date(a.publication.publishedDate).getTime()
      ),
    [books]
  );

  const handleProfileUpdate = (updatedData) => {
    setAuthorData(updatedData);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid px-3 py-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!authorData) return null;

  return (
    <div className="container-fluid px-3 px-md-4 py-4">
      {/* Profile Header */}
      <div className="card rounded-4 border-0 shadow-sm mb-4 overflow-hidden">
        {/* Enhanced Banner */}
        <div className="user-profile-header-banner position-relative">
          <div
            className="w-100 rounded-top"
            style={{
              height: "220px",
              background: "linear-gradient(135deg, #4e73df 0%, #224abe 100%)",
              position: "relative",
              overflow: "hidden",
              boxShadow: "inset 0 0 40px rgba(0,0,0,0.1)"
            }}
          >
            {/* Animated particles */}
            <div className="position-absolute w-100 h-100" style={{ overflow: "hidden" }}>
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="position-absolute bg-white rounded-circle"
                  style={{
                    width: `${Math.floor(Math.random() * 8) + 3}px`,
                    height: `${Math.floor(Math.random() * 8) + 3}px`,
                    top: `${Math.floor(Math.random() * 220)}px`,
                    left: `${Math.floor(Math.random() * 100)}%`,
                    opacity: Math.random() * 0.5 + 0.1,
                    animation: `float ${Math.floor(Math.random() * 20) + 10}s linear infinite`,
                  }}
                />
              ))}
            </div>

            {/* Enhanced book pattern overlay with more depth */}
            <svg
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                opacity: 0.15,
              }}
            >
              <defs>
                <pattern
                  id="bookPattern"
                  x="0"
                  y="0"
                  width="120"
                  height="120"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M30,10 L90,10 L90,110 L30,110 Z"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <path d="M30,25 L90,25" stroke="white" strokeWidth="1" />
                  <path d="M30,40 L90,40" stroke="white" strokeWidth="1" />
                  <path d="M30,55 L90,55" stroke="white" strokeWidth="1" />
                  <path d="M30,70 L90,70" stroke="white" strokeWidth="1" />
                  <path d="M30,85 L90,85" stroke="white" strokeWidth="1" />
                  <path d="M30,100 L90,100" stroke="white" strokeWidth="1" />
                </pattern>
                <linearGradient id="bookShine" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="white" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="white" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="white" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#bookPattern)" />
            </svg>

            {/* Improved 3D floating book elements */}
            <svg
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                opacity: 0.2,
              }}
            >
              {/* Book 1 with shine effect */}
              <g transform="translate(20,50) rotate(-5)">
                <path d="M0,0 L60,0 L60,80 L0,80 Z" fill="#fff" fillOpacity="0.7" />
                <path d="M0,0 L60,0 L60,80 L0,80 Z" fill="url(#bookShine)" />
                <path d="M10,10 L50,10 M10,20 L50,20 M10,30 L50,30 M10,40 L50,40 M10,50 L40,50"
                  stroke="white" strokeWidth="1" strokeOpacity="0.5" />
              </g>
              
              {/* Book 2 */}
              <g transform="translate(120,30) rotate(3)">
                <path d="M0,0 L50,0 L50,70 L0,70 Z" fill="#fff" fillOpacity="0.6" />
                <path d="M0,0 L50,0 L50,70 L0,70 Z" fill="url(#bookShine)" />
                <path d="M10,10 L40,10 M10,20 L40,20 M10,30 L40,30 M10,40 L30,40"
                  stroke="white" strokeWidth="1" strokeOpacity="0.5" />
              </g>
              
              {/* Book 3 */}
              <g transform="translate(220,60) rotate(-8)">
                <path d="M0,0 L55,0 L55,75 L0,75 Z" fill="#fff" fillOpacity="0.6" />
                <path d="M0,0 L55,0 L55,75 L0,75 Z" fill="url(#bookShine)" />
                <path d="M10,15 L45,15 M10,30 L45,30 M10,45 L45,45 M10,60 L35,60"
                  stroke="white" strokeWidth="1" strokeOpacity="0.5" />
              </g>
              
              {/* Book 4 */}
              <g transform="translate(320,40) rotate(5)">
                <path d="M0,0 L45,0 L45,65 L0,65 Z" fill="#fff" fillOpacity="0.7" />
                <path d="M0,0 L45,0 L45,65 L0,65 Z" fill="url(#bookShine)" />
                <path d="M10,10 L35,10 M10,25 L35,25 M10,40 L35,40 M10,55 L25,55"
                  stroke="white" strokeWidth="1" strokeOpacity="0.5" />
              </g>
            </svg>

            {/* Enhanced wave pattern */}
            <svg
              preserveAspectRatio="none"
              width="100%"
              height="80"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              style={{
                position: "absolute",
                bottom: -1,
                left: 0,
              }}
            >
              <path
                d="M0,40 C320,100 520,0 720,50 C920,100 1120,20 1200,40 V120 H0 Z"
                fill="white"
                fillOpacity="0.85"
              />
              <path
                d="M0,60 C280,120 520,30 720,80 C920,30 1020,80 1200,60 V120 H0 Z"
                fill="white"
                fillOpacity="0.6"
              />
              <path
                d="M0,80 C240,100 480,60 720,90 C960,120 1120,90 1200,80 V120 H0 Z"
                fill="white"
                fillOpacity="1"
              />
            </svg>
          </div>
          
          {/* Add subtle animation css */}
          <style jsx>{`
            @keyframes float {
              0% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
              100% { transform: translateY(0px); }
            }
          `}</style>
        </div>
        
        {/* Author Info with left-aligned photo */}
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-3">
            {/* Profile Picture - Left aligned with enhanced styling */}
            <div className="position-relative mt-n5">
              <div className="profile-photo-container" style={{
                width: "120px",
                height: "120px",
                position: "relative",
              }}>
                <img
                  src={authorData.profile.profilePhoto || "/assets/img/avatars/1.png"}
                  alt="Author"
                  className="rounded-circle border-4 border-white shadow-lg"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: 2,
                    position: "relative"
                  }}
                />
                {/* Decorative ring around profile photo - theme color */}
                <div className="photo-ring" style={{
                  position: "absolute",
                  top: "-8px",
                  left: "-8px",
                  right: "-8px",
                  bottom: "-8px",
                  borderRadius: "50%",
                  background: "#4e73df", /* Primary theme color */
                  opacity: 0.7,
                  zIndex: 1
                }}></div>
                
                {/* Floating verification badge for verified authors */}
                {authorData.kycStatus === "approved" && (
                  <div className="position-absolute bg-success rounded-circle d-flex align-items-center justify-content-center shadow-sm" 
                    style={{ 
                      width: "32px", 
                      height: "32px", 
                      right: 0, 
                      bottom: "5px", 
                      border: "2px solid white",
                      zIndex: 3 
                    }}>
                    <i className="bx bx-check text-white fs-5"></i>
                  </div>
                )}
              </div>
            </div>
            
            {/* Author Details with normal color name shifted right */}
            <div className="flex-grow-1 text-center text-md-start mt-2 mt-md-0">
              <div className="d-flex justify-content-center justify-content-md-start ps-md-3">
                <h2 className="fw-bold text-primary mb-3">
                  {authorData.name}
                </h2>
              </div>
              
              <p className="text-muted mb-3">
                <i className="bx bx-map-pin me-1"></i>
                {authorData.address?.city || "Location not specified"} • 


              </p>
              
              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start mb-3">
                <div className="badge bg-primary bg-opacity-85 rounded-pill px-3 py-2 shadow-sm">
                  <i className="bx bx-pen me-1"></i> Published Author
                </div>
                <div
                  className={`badge ${
                    authorData.kycStatus === "approved"
                      ? "bg-success"
                      : "bg-warning"
                  } bg-opacity-85 rounded-pill px-3 py-2 shadow-sm`}
                >
                  <i className="bx bx-check-circle me-1"></i>
                  {authorData.kycStatus === "approved"
                    ? "KYC Verified"
                    : "KYC Pending"}
                </div>
                
                {/* Stats badges */}
                {authorData.authorStats?.numberOfPublications > 0 && (
                  <div className="badge bg-info bg-opacity-85 rounded-pill px-3 py-2 shadow-sm">
                    <i className="bx bx-book me-1"></i>
                    {authorData.authorStats.numberOfPublications} Publications
                  </div>
                )}
                
                {authorData.authorStats?.averageRating > 0 && (
                  <div className="badge bg-warning text-dark bg-opacity-85 rounded-pill px-3 py-2 shadow-sm">
                    <i className="bx bx-star me-1"></i>
                    {authorData.authorStats.averageRating.toFixed(1)} Rating
                  </div>
                )}
              </div>
            </div>
            
            {/* Edit Profile Button with enhanced styling */}
            <div className="text-center text-md-end ms-md-auto">
              <button
                className="btn btn-primary rounded-pill shadow-sm hover-scale"
                onClick={() => setShowEditModal(true)}
                style={{
                  background: "linear-gradient(45deg, #4e73df, #224abe)",
                  border: "none",
                  transition: "all 0.3s ease"
                }}
              >
                <i className="bx bx-edit me-2"></i> Edit Profile
              </button>
            </div>
          </div>
        </div>
        
        {/* Add hover effect for the button */}
        <style jsx>{`
          .hover-scale:hover {
            transform: scale(1.05);
          }
        `}</style>
      </div>

      {/* Navigation Tabs */}
      <div className="card rounded-4 border-0 shadow-sm mb-4">
        <div className="card-body p-0">
          <ul className="nav nav-pills nav-fill">
            <li className="nav-item">
              <button
                className={`nav-link rounded-0 py-3 ${
                  activeSection === "profile" ? "active" : ""
                }`}
                onClick={() => setActiveSection("profile")}
              >
                <i className="bx bx-user d-block d-md-inline mb-1 mb-md-0 me-md-2 fs-5"></i>
                <span>Profile</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link rounded-0 py-3 ${
                  activeSection === "kyc" ? "active" : ""
                }`}
                onClick={() => setActiveSection("kyc")}
              >
                <i className="bx bx-id-card d-block d-md-inline mb-1 mb-md-0 me-md-2 fs-5"></i>
                <span>KYC</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link rounded-0 py-3 ${
                  activeSection === "bank" ? "active" : ""
                }`}
                onClick={() => setActiveSection("bank")}
              >
                <i className="bx bx-credit-card d-block d-md-inline mb-1 mb-md-0 me-md-2 fs-5"></i>
                <span>Banking</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Content Sections */}
      {activeSection === "profile" && (
        <>
          {/* KYC Status Alert */}
          {authorData.kycStatus === "pending" && (
            <div className="alert alert-warning d-flex align-items-center justify-content-between mb-4 rounded-4 shadow-sm">
              <div className="d-flex align-items-center">
                <i className="bx bx-time-five fs-4 me-3"></i>
                <span>Your KYC verification is pending</span>
              </div>
              <button
                className="btn btn-sm btn-warning rounded-pill"
                onClick={() => setActiveSection("kyc")}
              >
                Complete KYC
              </button>
            </div>
          )}

          <div className="row g-4">
            {/* Contact Information */}
            <div className="col-lg-4">
              <div className="card h-100 rounded-4 border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title fw-bold text-primary mb-4">
                    <i className="bx bx-phone-call me-2"></i>Contact Information
                  </h5>
                  
                  <div className="d-flex flex-column gap-3">
                    {[
                      {
                        icon: "bx-envelope",
                        label: "Email",
                        value: authorData.email,
                      },
                      {
                        icon: "bx-phone",
                        label: "Phone",
                        value: authorData.phoneNumber,
                      },
                      {
                        icon: "bx-map",
                        label: "Address",
                        value: authorData.address?.street || "Not available",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="p-3 bg-light rounded-3 transition-all hover-shadow"
                      >
                        <div className="d-flex align-items-center">
                          <div className="rounded-circle bg-white p-2 shadow-sm me-3">
                            <i className={`bx ${item.icon} text-primary fs-5`}></i>
                          </div>
                          <div>
                            <div className="text-muted small">{item.label}</div>
                            <div className="fw-medium text-break">{item.value}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* About & Publications */}
            <div className="col-lg-8">
              <div className="card rounded-4 border-0 shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="card-title fw-bold text-primary mb-3">
                    <i className="bx bx-user-voice me-2"></i>About the Author
                  </h5>
                  <div className="bg-light rounded-4 p-4 mb-4">
                    <p className="mb-0">
                      {authorData.profile.bio || "No bio available."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card rounded-4 border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title fw-bold text-primary d-flex align-items-center justify-content-between mb-4">
                    <span><i className="bx bx-book me-2"></i>Latest Publications</span>
                    {sortedBooks.length > 0 && (
                      <button className="btn btn-sm btn-outline-primary rounded-pill">
                        View All
                      </button>
                    )}
                  </h5>
                  
                  {sortedBooks.length > 0 ? (
                    <div className="d-flex flex-column gap-3">
                      {sortedBooks.slice(0, 3).map((book) => (
                        <div key={book.id} className="card border-0 shadow-sm hover-shadow">
                          <div className="card-body">
                            <div className="d-flex gap-3">
                              <div className="rounded bg-primary p-3 d-flex align-items-center justify-content-center" style={{ minWidth: "60px", height: "60px" }}>
                                <i className="bx bx-book-open fs-3 text-white"></i>
                              </div>
                              <div>
                                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-1">
                                  <h6 className="mb-0 mb-1 mb-sm-0 me-sm-2">{book.title}</h6>
                                  <div className="badge bg-primary rounded-pill">
                                    <i className="bx bx-star me-1"></i>
                                    {book.publication.rating
                                      ? book.publication.rating.toFixed(1)
                                      : "0.0"}
                                  </div>
                                </div>
                                <small className="text-muted d-block mb-1">
                                  {new Date(book.publication.publishedDate).toLocaleDateString("en-US", {
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </small>
                                <p className="mb-0 small">
                                  {book.publication.description && book.publication.description.length > 100
                                    ? `${book.publication.description.substring(0, 100)}...`
                                    : book.publication.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="mb-3">
                        <i className="bx bx-book-content fs-1 text-muted"></i>
                      </div>
                      <p className="text-muted">No publications available yet.</p>
                      <button className="btn btn-sm btn-outline-primary rounded-pill">
                        Publish Your First Book
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* KYC Section */}
      {activeSection === "kyc" && (
        <div className="card rounded-4 border-0 shadow-sm">
          <div className="card-header bg-transparent d-flex justify-content-between align-items-center py-3">
            <h5 className="card-title text-primary mb-0">
              <i className="bx bx-check-shield me-2"></i>KYC Verification
            </h5>
            <div className="badge bg-success rounded-pill px-3 py-2">
              <i className="bx bx-check me-1"></i>APPROVED
            </div>
          </div>
          <div className="card-body p-4">
            {/* Status Card */}
            <div className="card bg-light border-0 rounded-4 mb-4">
              <div className="card-body p-4">
                <div className="d-flex flex-column flex-md-row align-items-md-center mb-3">
                  <div className="rounded-circle p-2 bg-success me-md-3 mb-3 mb-md-0 align-self-center align-self-md-start">
                    <i className="bx bx-check text-white fs-4"></i>
                  </div>
                  <div>
                    <h5 className="mb-1">KYC Verification Status</h5>
                    <p className="text-muted mb-3 mb-md-2">
                      Last updated: {new Date().toLocaleDateString()}
                    </p>
                    <div className="progress mb-3" style={{ height: "8px" }}>
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: "100%" }}
                        aria-valuenow="100"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <p className="mb-0">
                      Your KYC verification is complete. You have full access to all platform features.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Cards */}
            <div className="row g-4">
              {/* Aadhaar Card */}
              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100 rounded-4">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                        <i className="bx bx-id-card text-primary fs-3"></i>
                      </div>
                      <div>
                        <h5 className="mb-1">Aadhaar Card</h5>
                        {authorData.aadhaarNumber && (
                          <p className="text-muted mb-0 small">
                            Number: {authorData.aadhaarNumber.replace(/\d(?=\d{4})/g, "*")}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="alert alert-success mb-0 d-flex align-items-center rounded-3">
                      <i className="bx bx-check-circle me-2 fs-5"></i>
                      <div>
                        <strong>VERIFIED</strong>
                        <p className="mb-0 small">
                          Your Aadhaar has been verified successfully.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PAN Card */}
              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100 rounded-4">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                        <i className="bx bx-credit-card-front text-primary fs-3"></i>
                      </div>
                      <div>
                        <h5 className="mb-1">PAN Card</h5>
                        {authorData.panNumber && (
                          <p className="text-muted mb-0 small">
                            Number: {authorData.panNumber.substring(0, 2)}******{authorData.panNumber.substring(8)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="alert alert-success mb-0 d-flex align-items-center rounded-3">
                      <i className="bx bx-check-circle me-2 fs-5"></i>
                      <div>
                        <strong>VERIFIED</strong>
                        <p className="mb-0 small">
                          Your PAN has been verified successfully.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bank Section */}
      {activeSection === "bank" && (
        <div className="card rounded-4 border-0 shadow-sm">
          <div className="card-header bg-transparent d-flex justify-content-between align-items-center py-3">
            <h5 className="card-title text-primary mb-0">
              <i className="bx bx-bank me-2"></i>Bank Account
            </h5>
            <div className="badge bg-success rounded-pill px-3 py-2">
              <i className="bx bx-check-circle me-1"></i>Verified
            </div>
          </div>
          <div className="card-body p-4">
            {/* Status Card */}
            <div className="card bg-light border-0 rounded-4 mb-4">
              <div className="card-body p-4">
                <div className="d-flex flex-column flex-md-row align-items-md-center mb-3">
                  <div className="rounded-circle p-2 bg-success me-md-3 mb-3 mb-md-0 align-self-center align-self-md-start">
                    <i className="bx bx-check text-white fs-4"></i>
                  </div>
                  <div>
                    <h5 className="mb-1">Bank Account Verification</h5>
                    <p className="text-muted mb-3 mb-md-2">
                      Last updated: {new Date().toLocaleDateString()}
                    </p>
                    <div className="progress mb-3" style={{ height: "8px" }}>
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: "100%" }}
                        aria-valuenow="100"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <p className="mb-0">
                      Your bank account has been verified successfully. You can receive payments and royalties.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Details Card */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="d-flex align-items-center mb-2">
                        <i className="bx bx-bank text-primary me-2"></i>
                        <span>Bank Name</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg rounded-3"
                        value={authorData.bankAccount?.bankName || "Not Available"}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="d-flex align-items-center mb-2">
                        <i className="bx bx-credit-card text-primary me-2"></i>
                        <span>Account Number</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg rounded-3"
                        value={
                          authorData.bankAccount?.accountNumber
                            ? authorData.bankAccount.accountNumber.replace(/.(?=.{4})/g, "*")
                            : "Not Available"
                        }
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="d-flex align-items-center mb-2">
                        <i className="bx bx-list-ul text-primary me-2"></i>
                        <span>Account Type</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg rounded-3"
                        value={authorData.bankAccount?.accountType || "Savings"}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="d-flex align-items-center mb-2">
                        <i className="bx bx-code-alt text-primary me-2"></i>
                        <span>IFSC Code</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg rounded-3"
                        value={authorData.bankAccount?.ifscCode || "Not Available"}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="alert alert-success d-flex flex-column flex-md-row align-items-md-center rounded-4">
              <i className="bx bx-shield-quarter fs-1 me-md-4 mb-3 mb-md-0 align-self-center"></i>
              <div>
                <h5 className="alert-heading">Secure Banking</h5>
                <p className="mb-0">
                  Your bank details are encrypted and stored securely. Only you can access your complete bank information.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        authorData={authorData}
        onUpdate={handleProfileUpdate}
        onPhotoUpdate={handlePhotoUpdate}
      />
    </div>
  );
};

export default AuthorDetails;