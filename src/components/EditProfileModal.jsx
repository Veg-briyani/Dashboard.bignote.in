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
      // Clear messages when modal opens
      setErrorMessage("");
      setSuccessMessage("");
    }
  }, [authorData, show]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested objects (address, bankAccount, profile)
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
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
      // Try both formats to maximize chances of success
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
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Profile</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="alert alert-success" role="alert">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {/* Personal Information */}
                <div className="col-12">
                  <h6 className="text-primary">Personal Information</h6>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">About/Bio</label>
                  <textarea
                    className="form-control"
                    name="profile.bio"
                    value={formData.profile.bio}
                    onChange={handleChange}
                    rows="3"
                  ></textarea>
                </div>
                <div className="col-12">
                  <label className="form-label">Profile Photo URL</label>
                  <input
                    type="text"
                    className="form-control"
                    name="profile.profilePhoto"
                    value={formData.profile.profilePhoto}
                    onChange={handleChange}
                  />
                </div>

                {/* Address Information */}
                <div className="col-12 mt-3">
                  <h6 className="text-primary">Address Information</h6>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Street</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Zip Code</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleChange}
                  />
                </div>

                {/* Bank Information */}
                <div className="col-12 mt-3">
                  <h6 className="text-primary">Bank Information</h6>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Bank Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="bankAccount.bankName"
                    value={formData.bankAccount.bankName}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Account Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="bankAccount.accountNumber"
                    value={formData.bankAccount.accountNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">IFSC Code</label>
                  <input
                    type="text"
                    className="form-control"
                    name="bankAccount.ifscCode"
                    value={formData.bankAccount.ifscCode}
                    onChange={handleChange}
                  />
                </div>

                {/* KYC Information */}
                <div className="col-12 mt-3">
                  <h6 className="text-primary">KYC Information</h6>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Aadhaar Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="aadhaarNumber"
                    value={formData.aadhaarNumber}
                    onChange={handleChange}
                    pattern="^\d{12}$"
                    title="Aadhaar number must be 12 digits"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">PAN Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleChange}
                    pattern="^[A-Z]{5}\d{4}[A-Z]$"
                    title="Invalid PAN format"
                  />
                </div>
              </div>

              <div className="modal-footer mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
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
