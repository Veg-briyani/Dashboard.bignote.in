import PropTypes from "prop-types";
import { useState, useEffect, useMemo } from "react";
import EditProfileModal from "../components/EditProfileModal";
import { getApiUrl, getFetchOptions } from "../services/apiConfig";

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
            accountType: "Savings", // This seems to be missing in the API, default to Savings
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
    // You might want to show a success message here
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

  if (!authorData) return null;

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="row">
        {/* Profile Header */}
        <div className="col-12">
          <div className="card mb-4 overflow-hidden">
            <div className="user-profile-header-banner position-relative">
              <div
                className="w-100 rounded-top"
                style={{
                  height: "200px",
                  background:
                    "linear-gradient(135deg, #4e73df 0%, #224abe 100%)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* SVG pattern overlay */}
                <svg
                  width="100%"
                  height="100%"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    opacity: 0.1,
                  }}
                >
                  <defs>
                    <pattern
                      id="bookPattern"
                      x="0"
                      y="0"
                      width="100"
                      height="100"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M30,10 L70,10 L70,90 L30,90 Z"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                      />
                      <path d="M30,20 L70,20" stroke="white" strokeWidth="1" />
                      <path d="M30,30 L70,30" stroke="white" strokeWidth="1" />
                      <path d="M30,40 L70,40" stroke="white" strokeWidth="1" />
                      <path d="M30,50 L70,50" stroke="white" strokeWidth="1" />
                      <path d="M30,60 L70,60" stroke="white" strokeWidth="1" />
                      <path d="M30,70 L70,70" stroke="white" strokeWidth="1" />
                      <path d="M30,80 L70,80" stroke="white" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#bookPattern)" />
                </svg>

                {/* Floating book elements */}
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
                  <path d="M20,50 L40,45 L40,85 L20,90 Z" fill="white" />
                  <path d="M120,30 L140,25 L140,65 L120,70 Z" fill="white" />
                  <path d="M220,60 L240,55 L240,95 L220,100 Z" fill="white" />
                  <path d="M320,40 L340,35 L340,75 L320,80 Z" fill="white" />
                </svg>

                {/* Wave pattern at bottom */}
                <svg
                  width="100%"
                  height="40"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    opacity: 0.3,
                  }}
                >
                  <path
                    d="M0,20 Q80,0 160,20 T320,20 T480,20 T640,20 T800,20 T960,20 T1120,20 V40 H0 Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>

            <div className="user-profile-header d-flex flex-column flex-sm-row text-sm-start text-center mb-4 position-relative">
              <div
                className="flex-shrink-0 mt-n2 mx-sm-0 mx-auto position-relative"
                style={{ zIndex: 1 }}
              >
                <img
                  src={
                    authorData.profile.profilePhoto ||
                    "/assets/img/avatars/1.png"
                  }
                  alt="Author"
                  className="d-block ms-0 ms-sm-4 rounded-circle user-profile-img shadow-lg"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    border: "4px solid white",
                    transform: "translateY(-50%)",
                  }}
                />
              </div>

              <div className="flex-grow-1 mt-3 mt-sm-5 px-4">
                <div className="d-flex align-items-md-end align-items-sm-start align-items-center justify-content-md-between justify-content-start flex-md-row flex-column gap-4">
                  <div className="user-profile-info">
                    <h2 className="mb-2 text-gradient text-primary">
                      {authorData.name}
                    </h2>
                    <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-sm-start">
                      <div className="badge bg-label-primary rounded-pill px-3 py-2">
                        <i className="bx bx-pen me-1"></i> Published Author
                      </div>
                      <div
                        className={`badge ${
                          authorData.kycStatus === "approved"
                            ? "bg-label-success"
                            : "bg-label-warning"
                        } rounded-pill px-3 py-2`}
                      >
                        <i className="bx bx-check-circle me-1"></i>
                        {authorData.kycStatus === "approved"
                          ? "KYC Verified"
                          : "KYC Pending"}
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary btn-lg shadow-sm"
                    aria-label="Edit profile"
                    onClick={() => setShowEditModal(true)}
                  >
                    <i className="bx bx-edit me-2"></i> Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="col-12 mb-4">
          <div className="nav-align-top nav-tabs-shadow nav-tabs-bordered">
            <ul
              className="nav nav-tabs"
              role="tablist"
              style={{ overflowX: "auto", flexWrap: "nowrap" }}
            >
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeSection === "profile" ? "active" : ""
                  }`}
                  role="tab"
                  onClick={() => setActiveSection("profile")}
                  aria-selected={activeSection === "profile"}
                >
                  <i className="bx bx-user me-1"></i> Profile
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeSection === "kyc" ? "active" : ""
                  }`}
                  role="tab"
                  onClick={() => setActiveSection("kyc")}
                  aria-selected={activeSection === "kyc"}
                >
                  <i className="bx bx-id-card me-1"></i> KYC Details
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeSection === "bank" ? "active" : ""
                  }`}
                  role="tab"
                  onClick={() => setActiveSection("bank")}
                  aria-selected={activeSection === "bank"}
                >
                  <i className="bx bx-credit-card me-1"></i> Bank Details
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Profile Section */}
        {activeSection === "profile" && (
          <>
            <div className="col-xl-4 col-lg-5 col-md-5">
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="mb-4 text-uppercase fw-bold text-primary">
                    Contact Information
                  </h5>
                  <div className="d-grid gap-3">
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
                        value: authorData.address?.street,
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center p-3 bg-light rounded-3 hover-scale"
                      >
                        <i
                          className={`bx ${item.icon} fs-5 text-muted me-3`}
                        ></i>
                        <div>
                          <div className="small text-muted">{item.label}</div>
                          <div className="fw-medium">{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  
                </div>
              </div>
            </div>

            <div className="col-xl-8 col-lg-7 col-md-7">
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="mb-4 text-uppercase fw-bold text-primary">
                    About the Author
                  </h5>
                  <div className="mb-4 bg-light rounded-3 p-4">
                    <p className="lead mb-0">
                      {authorData.profile.bio || "No bio available."}
                    </p>
                  </div>

                  <h5 className="mb-4 text-uppercase fw-bold text-primary">
                    Latest Publications
                  </h5>
                  <div className="row g-4">
                    {sortedBooks.length > 0 ? (
                      sortedBooks.map((book) => (
                        <div key={book.id} className="col-12">
                          <div className="card border shadow-none hover-shadow-sm">
                            <div className="card-body">
                              <div className="d-flex align-items-center gap-3">
                                <div className="bg-primary rounded-3 p-3">
                                  <i className="bx bx-book-open fs-2 text-white"></i>
                                </div>
                                <div className="flex-grow-1">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">{book.title}</h5>
                                    <div className="badge bg-label-primary rounded-pill">
                                      <i className="bx bx-star me-1"></i>
                                      {book.publication.rating
                                        ? book.publication.rating.toFixed(1)
                                        : "0.0"}
                                    </div>
                                  </div>
                                  <small className="text-muted">
                                    Published{" "}
                                    {new Date(
                                      book.publication.publishedDate
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </small>
                                  <p className="mt-2 mb-0">
                                    {book.publication.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-12 text-center">
                        <p className="text-muted">No publications available.</p>
                      </div>
                    )}
                  </div>

                  {sortedBooks.length > 0 && (
                    <div className="mt-4 text-center">
                      <button className="btn btn-outline-primary">
                        <i className="bx bx-book-alt me-2"></i> View All
                        Publications
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* KYC Status Alert */}
            {authorData.kycStatus === "pending" && (
              <div className="col-12">
                <div className="alert alert-warning mt-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <i className="bx bx-time-five me-2"></i>
                      Your KYC verification is pending. Please complete your KYC
                      to access all features.
                    </div>
                    <button
                      className="btn btn-outline-warning btn-sm"
                      onClick={() => setActiveSection("kyc")}
                    >
                      Complete KYC
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* KYC Section */}
        {activeSection === "kyc" && (
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title text-primary">KYC Details</h5>
                <div className="badge bg-success px-3 py-2">
                  <i className="bx bx-check-shield me-1"></i>
                  APPROVED
                </div>
              </div>
              <div className="card-body">
                {/* Main status card */}
                <div className="card bg-light border-0 mb-4">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <div className="rounded-circle p-2 bg-success me-3">
                        <i className="bx bx-check text-white fs-4"></i>
                      </div>
                      <div>
                        <h5 className="mb-0">KYC Verification Status</h5>
                        <p className="text-muted mb-0">
                          Last updated: {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
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
                      Your KYC verification is complete. You have full access to
                      all platform features.
                    </p>
                  </div>
                </div>

                {/* Document Verification Cards */}
                <div className="row g-4">
                  {/* Aadhaar Card */}
                  <div className="col-md-6">
                    <div className="card border shadow-sm h-100">
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center mb-3">
                          <div
                            className="rounded-circle bg-white bg-opacity-100 d-flex align-items-center justify-content-center"
                            style={{ width: "60px", height: "60px" }}
                          >
                            <i className="bx bx-id-card text-primary fs-3"></i>
                          </div>

                          <div>
                            <h5 className="mb-1">Aadhaar Card</h5>
                            {authorData.aadhaarNumber && (
                              <p className="text-muted mb-0 small">
                                Number:{" "}
                                {authorData.aadhaarNumber.replace(
                                  /\d(?=\d{4})/g,
                                  "*"
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="alert alert-success mb-0 d-flex align-items-center">
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
                    <div className="card border shadow-sm h-100">
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center mb-3">
                          <div className="rounded-circle bg-white bg-opacity-100 p-3 me-3">
                            <i className="bx bx-credit-card-front text-primary fs-3"></i>
                          </div>
                          <div>
                            <h5 className="mb-1">PAN Card</h5>
                            {authorData.panNumber && (
                              <p className="text-muted mb-0 small">
                                Number: {authorData.panNumber.substring(0, 2)}
                                ******{authorData.panNumber.substring(8)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="alert alert-success mb-0 d-flex align-items-center">
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
          </div>
        )}

        {/* Bank Section */}
        {activeSection === "bank" && (
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title text-primary">
                  Bank Account Details
                </h5>
                <div className="badge bg-success">
                  <i className="bx bx-check-circle me-1"></i> Verified
                </div>
              </div>
              <div className="card-body">
                {/* Status card */}
                <div className="card bg-light border-0 mb-4">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <div className="rounded-circle p-2 bg-success me-3">
                        <i className="bx bx-check text-white fs-4"></i>
                      </div>
                      <div>
                        <h5 className="mb-0">Bank Account Verification</h5>
                        <p className="text-muted mb-0">
                          Last updated: {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
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
                      Your bank account has been verified successfully. You can
                      receive payments and royalties.
                    </p>
                  </div>
                </div>

                <div className="card border shadow-sm mb-4">
                  <div className="card-body p-4">
                    <div className="row g-4">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center mb-2">
                          <i className="bx bx-bank text-primary fs-5 me-2"></i>
                          <h6 className="mb-0">Bank Name</h6>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          value={
                            authorData.bankAccount?.bankName || "Not Available"
                          }
                          readOnly
                        />
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center mb-2">
                          <i className="bx bx-credit-card text-primary fs-5 me-2"></i>
                          <h6 className="mb-0">Account Number</h6>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          value={
                            authorData.bankAccount?.accountNumber
                              ? authorData.bankAccount.accountNumber.replace(
                                  /.(?=.{4})/g,
                                  "*"
                                )
                              : "Not Available"
                          }
                          readOnly
                        />
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center mb-2">
                          <i className="bx bx-list-ul text-primary fs-5 me-2"></i>
                          <h6 className="mb-0">Account Type</h6>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          value={
                            authorData.bankAccount?.accountType || "Savings"
                          }
                          readOnly
                        />
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center mb-2">
                          <i className="bx bx-code-alt text-primary fs-5 me-2"></i>
                          <h6 className="mb-0">IFSC Code</h6>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          value={
                            authorData.bankAccount?.ifscCode || "Not Available"
                          }
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="alert alert-success mt-4 d-flex align-items-center">
                      <i className="bx bx-shield-quarter fs-4 me-3"></i>
                      <div>
                        <strong>Secure Banking</strong>
                        <p className="mb-0">
                          Your bank details are encrypted and stored securely.
                          Only you can access your complete bank information.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add the EditProfileModal component */}
      <EditProfileModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        authorData={authorData}
        onUpdate={handleProfileUpdate}
        onPhotoUpdate={handlePhotoUpdate} // Make sure this line is present!
      />
    </div>
  );
};

AuthorDetails.propTypes = {
  // Add prop types if component receives any props
};
