import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const EditProfileModal = ({
  show,
  onClose,
  authorData,
  onUpdate,
  onPhotoUpdate,
}) => {
  // State initialization with form data
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
    profile: {
      bio: "",
      profilePhoto: "",
    },
    bankAccount: {
      accountNumber: "",
      ifscCode: "",
      bankName: "",
    },
    aadhaarNumber: "",
    panNumber: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState("personal");
  const [photoPreview, setPhotoPreview] = useState("");

  // Load data when modal opens or authorData changes
  useEffect(() => {
    if (authorData && show) {
      setFormData({
        name: authorData.name || "",
        phoneNumber: authorData.phoneNumber || "",
        address: {
          street: authorData.address?.street || "",
          city: authorData.address?.city || "",
          state: authorData.address?.state || "",
          country: authorData.address?.country || "",
          zipCode: authorData.address?.zipCode || "",
        },
        profile: {
          bio: authorData.profile?.bio || "",
          profilePhoto: authorData.profile?.profilePhoto || "",
        },
        bankAccount: {
          accountNumber: authorData.bankAccount?.accountNumber || "",
          ifscCode: authorData.bankAccount?.ifscCode || "",
          bankName: authorData.bankAccount?.bankName || "",
        },
        aadhaarNumber: authorData.aadhaarNumber || "",
        panNumber: authorData.panNumber || "",
      });
      
      // Set photo preview
      setPhotoPreview(authorData.profile?.profilePhoto || "");
      
      // Clear messages when modal opens
      setErrorMessage("");
      setSuccessMessage("");
      
      // Reset to first tab when opening
      setActiveTab("personal");
    }
  }, [authorData, show]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested objects (address, bankAccount, profile)
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      
      // Special case for profile photo
      if (parent === "profile" && child === "profilePhoto") {
        setPhotoPreview(value);
      }
      
      setFormData((prevState) => ({
        ...prevState,
        [parent]: {
          ...prevState[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Create a copy of formData for API submission
      const submitData = {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        profile: {
          bio: formData.profile.bio,
          profilePhoto: formData.profile.profilePhoto,
        },
        // Also include profilePhoto at the root level as a fallback
        profilePhoto: formData.profile.profilePhoto,
      };

      console.log("Submitting profile update:", submitData);

      // First update basic profile information
      const profileResponse = await fetch(
        "http://localhost:5000/api/auth/profile",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitData),
        }
      );

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const profileData = await profileResponse.json();
      console.log("Profile updated successfully:", profileData);
      setSuccessMessage("Profile updated successfully!");

      // If KYC/bank info is provided, make a separate request to update that
      if (
        formData.aadhaarNumber ||
        formData.panNumber ||
        formData.bankAccount.accountNumber ||
        formData.bankAccount.ifscCode ||
        formData.bankAccount.bankName
      ) {
        const kycData = {
          bankAccount: formData.bankAccount,
          kycInformation: {
            aadhaarNumber: formData.aadhaarNumber,
            panNumber: formData.panNumber,
          },
        };

        // Update to use the correct endpoint and method
        const kycResponse = await fetch(
          "http://localhost:5000/api/auth/kyc/update-request",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(kycData),
          }
        );

        if (!kycResponse.ok) {
          // If KYC update fails, show a warning but don't block the overall update
          console.warn(
            "KYC information update failed, but profile was updated successfully"
          );
        } else {
          console.log("KYC information updated successfully");
          setSuccessMessage(
            "Profile and KYC information updated successfully!"
          );
        }
      }

      // Always update profile photo in UI immediately regardless of API response
      if (
        formData.profile.profilePhoto &&
        typeof onPhotoUpdate === "function"
      ) {
        onPhotoUpdate(formData.profile.profilePhoto);
      } else if (formData.profile.profilePhoto) {
        console.warn("onPhotoUpdate is not a function or not provided");
      }

      // Merge the updated data with the existing authorData
      const mergedData = { ...authorData, ...profileData.user };

      // Manually ensure profile photo is updated in the merged data
      if (formData.profile.profilePhoto) {
        mergedData.profile = {
          ...mergedData.profile,
          profilePhoto: formData.profile.profilePhoto,
        };
      }

      onUpdate(mergedData);

      // Close modal after a short delay to show success message
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage(
        error.message || "An error occurred while updating your profile"
      );

      // Still update the photo in UI even if API call fails
      // This provides fallback UI consistency
      if (formData.profile.profilePhoto) {
        onPhotoUpdate(formData.profile.profilePhoto);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
          <div className="modal-header bg-light border-bottom py-3">
            <h5 className="modal-title d-flex align-items-center text-dark">
              <i className="bx bx-edit-alt fs-4 me-2 text-primary"></i>
              <span>Edit Author Profile</span>
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
              style={{ opacity: 1 }}
            ></button>
          </div>
          
          <div className="modal-body p-0">
            {/* Tab Navigation */}
            <div className="bg-light border-bottom">
              <ul className="nav nav-pills nav-fill">
                <li className="nav-item">
                  <button
                    className={`nav-link rounded-0 py-3 ${activeTab === "personal" ? "active" : ""}`}
                    onClick={() => setActiveTab("personal")}
                  >
                    <i className="bx bx-user d-block d-md-inline mb-1 mb-md-0 me-md-2 fs-5"></i>
                    <span>Personal</span>
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link rounded-0 py-3 ${activeTab === "address" ? "active" : ""}`}
                    onClick={() => setActiveTab("address")}
                  >
                    <i className="bx bx-map d-block d-md-inline mb-1 mb-md-0 me-md-2 fs-5"></i>
                    <span>Address</span>
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link rounded-0 py-3 ${activeTab === "financial" ? "active" : ""}`}
                    onClick={() => setActiveTab("financial")}
                  >
                    <i className="bx bx-credit-card d-block d-md-inline mb-1 mb-md-0 me-md-2 fs-5"></i>
                    <span>Banking & KYC</span>
                  </button>
                </li>
              </ul>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-4">
                {errorMessage && (
                  <div className="alert alert-danger d-flex align-items-center rounded-3 mb-4" role="alert">
                    <i className="bx bx-error-circle fs-4 me-2"></i>
                    <div>{errorMessage}</div>
                  </div>
                )}

                {successMessage && (
                  <div className="alert alert-success d-flex align-items-center rounded-3 mb-4" role="alert">
                    <i className="bx bx-check-circle fs-4 me-2"></i>
                    <div>{successMessage}</div>
                  </div>
                )}

                {/* Personal Information Tab */}
                {activeTab === "personal" && (
                  <div className="tab-pane fade show active">
                    <div className="row g-4">
                      <div className="col-12">
                        <div className="d-flex flex-column flex-md-row align-items-center gap-4 mb-2">
                          {/* Profile Photo Preview */}
                          <div className="profile-photo-container position-relative mb-3 mb-md-0">
                            <div 
                              className="rounded-circle border border-3 border-primary overflow-hidden shadow-sm" 
                              style={{
                                width: "120px",
                                height: "120px",
                                background: "#f8f9fa",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              {photoPreview ? (
                                <img 
                                  src={photoPreview} 
                                  alt="Profile Preview" 
                                  className="w-100 h-100 object-fit-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/assets/img/avatars/1.png";
                                  }}
                                />
                              ) : (
                                <i className="bx bx-user text-primary" style={{ fontSize: "3rem" }}></i>
                              )}
                            </div>
                          </div>
                          
                          {/* Profile Details */}
                          <div className="flex-grow-1">
                            <div className="mb-3">
                              <label className="form-label">
                                <i className="bx bx-image-alt text-primary me-1"></i>
                                Profile Photo URL
                              </label>
                              <input
                                type="text"
                                className="form-control form-control-lg rounded-3"
                                name="profile.profilePhoto"
                                value={formData.profile.profilePhoto}
                                onChange={handleChange}
                                placeholder="Enter URL for your profile photo"
                              />
                              <small className="text-muted">Enter a valid image URL for your profile photo</small>
                            </div>
                          </div>
                        </div>

                        <hr className="my-4" />
                        
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label fw-medium">
                              <i className="bx bx-user text-primary me-1"></i>
                              Full Name
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg rounded-3"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              placeholder="Enter your full name"
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-medium">
                              <i className="bx bx-phone text-primary me-1"></i>
                              Phone Number
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg rounded-3"
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={handleChange}
                              placeholder="Enter your phone number"
                            />
                          </div>
                          <div className="col-12">
                            <label className="form-label fw-medium">
                              <i className="bx bx-notepad text-primary me-1"></i>
                              Bio
                            </label>
                            <textarea
                              className="form-control rounded-3"
                              name="profile.bio"
                              value={formData.profile.bio}
                              onChange={handleChange}
                              rows="4"
                              placeholder="Tell readers about yourself..."
                            ></textarea>
                            <small className="text-muted">
                              This bio will be displayed on your public profile
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Address Information Tab */}
                {activeTab === "address" && (
                  <div className="tab-pane fade show active">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label fw-medium">
                          <i className="bx bx-home text-primary me-1"></i>
                          Street Address
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg rounded-3"
                          name="address.street"
                          value={formData.address.street}
                          onChange={handleChange}
                          placeholder="Enter your street address"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium">
                          <i className="bx bx-buildings text-primary me-1"></i>
                          City
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg rounded-3"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleChange}
                          placeholder="Enter your city"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium">
                          <i className="bx bx-map text-primary me-1"></i>
                          State/Province
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg rounded-3"
                          name="address.state"
                          value={formData.address.state}
                          onChange={handleChange}
                          placeholder="Enter your state or province"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium">
                          <i className="bx bx-globe text-primary me-1"></i>
                          Country
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg rounded-3"
                          name="address.country"
                          value={formData.address.country}
                          onChange={handleChange}
                          placeholder="Enter your country"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium">
                          <i className="bx bx-envelope text-primary me-1"></i>
                          Postal/Zip Code
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg rounded-3"
                          name="address.zipCode"
                          value={formData.address.zipCode}
                          onChange={handleChange}
                          placeholder="Enter your zip/postal code"
                        />
                      </div>
                      
                      <div className="col-12 mt-3">
                        <div className="alert alert-info rounded-3 d-flex align-items-center">
                          <i className="bx bx-info-circle fs-4 me-3"></i>
                          <div>
                            <strong>Privacy Note:</strong> Your address information is kept secure and will only be used for official communications and royalty payments.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank and KYC Information Tab */}
                {activeTab === "financial" && (
                  <div className="tab-pane fade show active">
                    {/* Bank Information */}
                    <div className="bg-light p-4 rounded-4 mb-4">
                      <h6 className="text-primary mb-3 d-flex align-items-center">
                        <i className="bx bx-bank fs-4 me-2"></i>
                        Bank Account Details
                      </h6>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label fw-medium">Bank Name</label>
                          <input
                            type="text"
                            className="form-control form-control-lg rounded-3"
                            name="bankAccount.bankName"
                            value={formData.bankAccount.bankName}
                            onChange={handleChange}
                            placeholder="Enter your bank name"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-medium">Account Number</label>
                          <input
                            type="text"
                            className="form-control form-control-lg rounded-3"
                            name="bankAccount.accountNumber"
                            value={formData.bankAccount.accountNumber}
                            onChange={handleChange}
                            placeholder="Enter your account number"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-medium">IFSC Code</label>
                          <input
                            type="text"
                            className="form-control form-control-lg rounded-3"
                            name="bankAccount.ifscCode"
                            value={formData.bankAccount.ifscCode}
                            onChange={handleChange}
                            placeholder="Enter IFSC code"
                          />
                        </div>
                      </div>
                    </div>

                    {/* KYC Information */}
                    <div className="bg-light p-4 rounded-4">
                      <h6 className="text-primary mb-3 d-flex align-items-center">
                        <i className="bx bx-id-card fs-4 me-2"></i>
                        KYC Information
                      </h6>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label fw-medium">Aadhaar Number</label>
                          <input
                            type="text"
                            className="form-control form-control-lg rounded-3"
                            name="aadhaarNumber"
                            value={formData.aadhaarNumber}
                            onChange={handleChange}
                            pattern="^\d{12}$"
                            title="Aadhaar number must be 12 digits"
                            placeholder="Enter 12-digit Aadhaar number"
                          />
                          <small className="text-muted">Format: 12 digits with no spaces</small>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-medium">PAN Number</label>
                          <input
                            type="text"
                            className="form-control form-control-lg rounded-3"
                            name="panNumber"
                            value={formData.panNumber}
                            onChange={handleChange}
                            pattern="^[A-Z]{5}\d{4}[A-Z]$"
                            title="Invalid PAN format"
                            placeholder="Enter PAN number"
                          />
                          <small className="text-muted">Format: ABCDE1234F</small>
                        </div>
                        
                        <div className="col-12 mt-3">
                          <div className="alert alert-warning rounded-3 d-flex align-items-center">
                            <i className="bx bx-shield-quarter fs-4 me-3"></i>
                            <div>
                              <strong>KYC Verification:</strong> Your KYC information will be verified by our team. Complete verification is required for receiving royalty payments.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer / Buttons */}
              <div className="modal-footer bg-light py-3">
                <div className="d-flex gap-2 w-100 justify-content-between">
                  <div>
                    {activeTab === "personal" ? (
                      <button
                        type="button"
                        className="btn btn-outline-secondary rounded-pill px-4"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-outline-primary rounded-pill px-4"
                        onClick={() => {
                          if (activeTab === "address") setActiveTab("personal");
                          if (activeTab === "financial") setActiveTab("address");
                        }}
                      >
                        <i className="bx bx-chevron-left me-1"></i>
                        Previous
                      </button>
                    )}
                  </div>
                  
                  <div>
                    {activeTab !== "financial" ? (
                      <button
                        type="button"
                        className="btn btn-primary rounded-pill px-4"
                        onClick={() => {
                          if (activeTab === "personal") setActiveTab("address");
                          if (activeTab === "address") setActiveTab("financial");
                        }}
                      >
                        Next
                        <i className="bx bx-chevron-right ms-1"></i>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="btn btn-success rounded-pill px-4"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Saving Changes...
                          </>
                        ) : (
                          <>
                            <i className="bx bx-check me-1"></i>
                            Save All Changes
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

EditProfileModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  authorData: PropTypes.object,
  onUpdate: PropTypes.func.isRequired,
  onPhotoUpdate: PropTypes.func.isRequired,
};

export default EditProfileModal;