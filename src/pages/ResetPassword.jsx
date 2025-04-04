import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import "./ResetPassword.css";

// SVG Icons
const AlertCircleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const BookOpenIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const CheckIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const EyeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useTheme();
  const { verifyResetToken, resetPassword: resetPasswordAuth } = useAuth();
  const [token, setToken] = useState("");
  
  // Form state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenIsValid, setTokenIsValid] = useState(null); // null = checking, true = valid, false = invalid
  const [tokenExpired, setTokenExpired] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);

  // Extract token from URL on component mount
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    // Get token and make sure it's properly decoded
    const tokenFromUrl = decodeURIComponent(queryParams.get("token") || "");
    
    if (!tokenFromUrl) {
      setTokenIsValid(false);
      setError("Invalid or missing reset token. Please request a new password reset link.");
      return;
    }
    
    // Store the decoded token
    setToken(tokenFromUrl);
    
    // Skip token verification since the endpoint doesn't exist
    // Instead, we'll just assume the token is valid and let the reset attempt handle validation
    setTokenIsValid(true);
    console.log("Skipping token verification (endpoint not available)");
  }, [location.search]);

  // Handle window resize
  React.useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Password validation function
  const validatePassword = (pass) => {
    if (pass.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(pass)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(pass)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(pass)) {
      return "Password must contain at least one number";
    }
    return "";
  };

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate passwords
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      console.log("Resetting password with token:", token);
      
      const cleanToken = token.trim(); // Remove any whitespace
      console.log("Clean token for password reset:", cleanToken);
      
      // Use the correct endpoint URL with proper prefix
      const response = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: cleanToken, newPassword: password }),
      });
      
      const data = await response.json();
      console.log("Password reset response:", data);
      
      setSuccess(data.message || "Password has been reset successfully");
      setPassword("");
      setConfirmPassword("");
      
      // Don't automatically redirect - let the user click the button
      // This gives them time to read the success message
    } catch (err) {
      console.error("Password reset error:", err);
      if (err.response?.data?.expired) {
        setTokenExpired(true);
        setError("This password reset link has expired. Please request a new one.");
      } else {
        setError(err.response?.data?.message || "Failed to reset password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [token, password, confirmPassword, navigate]);

  // Styles
  const styles = React.useMemo(
    () => ({
      container: {
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr",
        background: darkMode
          ? "#111827"
          : "linear-gradient(to bottom right, #eef2ff, #ede9fe)",
      },
      leftPanel: {
        padding: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      formContainer: {
        width: "100%",
        maxWidth: "28rem",
        padding: "2rem",
        backgroundColor: darkMode ? "#1f2937" : "white",
        borderRadius: "0.75rem",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
      header: {
        marginBottom: "2rem",
        textAlign: "center",
      },
      logo: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        marginBottom: "1.5rem",
        color: darkMode ? "#a5b4fc" : "#6366f1",
      },
      title: {
        fontSize: "1.5rem",
        fontWeight: "700",
        color: darkMode ? "#f3f4f6" : "#111827",
        marginBottom: "0.5rem",
      },
      subtitle: {
        fontSize: "0.875rem",
        color: darkMode ? "#9ca3af" : "#6b7280",
      },
      errorContainer: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.75rem",
        backgroundColor: darkMode ? "rgba(254, 202, 202, 0.2)" : "rgba(254, 202, 202, 0.5)",
        borderRadius: "0.375rem",
        marginBottom: "1rem",
        color: darkMode ? "#ef4444" : "#b91c1c",
        fontSize: "0.875rem",
      },
      successContainer: {
        padding: "1.5rem",
        backgroundColor: darkMode ? "rgba(5, 150, 105, 0.1)" : "rgba(240, 253, 244, 1)",
        borderRadius: "0.5rem",
        marginBottom: "1.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "0.75rem",
        color: darkMode ? "#34d399" : "#065f46",
        fontSize: "1rem",
      },
      successIcon: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "64px",
        height: "64px",
        borderRadius: "50%",
        backgroundColor: darkMode ? "rgba(5, 150, 105, 0.2)" : "rgba(5, 150, 105, 0.1)",
        marginBottom: "0.5rem",
      },
      form: {
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      },
      inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      },
      label: {
        fontSize: "0.875rem",
        fontWeight: "500",
        color: darkMode ? "#d1d5db" : "#374151",
      },
      input: {
        width: "100%",
        padding: "0.75rem 1rem",
        borderRadius: "0.5rem",
        border: "1px solid",
        borderColor: darkMode ? "#4b5563" : "#d1d5db",
        backgroundColor: darkMode ? "#1f2937" : "#ffffff",
        color: darkMode ? "#ffffff" : "#000000",
        outline: "none",
        transition: "border-color 0.3s",
        boxSizing: "border-box",
      },
      passwordContainer: {
        position: "relative",
      },
      passwordInput: {
        width: "100%",
        padding: "0.75rem 1rem",
        paddingRight: "3rem",
        borderRadius: "0.5rem",
        border: "1px solid",
        borderColor: darkMode ? "#4b5563" : "#d1d5db",
        backgroundColor: darkMode ? "#1f2937" : "#ffffff",
        color: darkMode ? "#ffffff" : "#000000",
        outline: "none",
        transition: "border-color 0.3s",
        boxSizing: "border-box",
      },
      eyeButton: {
        position: "absolute",
        right: "0.5rem",
        top: "50%",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        color: darkMode ? "#9ca3af" : "#6b7280",
        cursor: "pointer",
        padding: "0.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      submitButton: {
        padding: "0.75rem 1rem",
        backgroundColor: darkMode ? "#6366f1" : "#4f46e5",
        color: "white",
        borderRadius: "0.5rem",
        border: "none",
        fontWeight: "500",
        cursor: "pointer",
        transition: "background-color 0.3s",
        marginTop: "0.5rem",
      },
      loadingSpinner: {
        display: "inline-block",
        width: "1.25rem",
        height: "1.25rem",
        borderRadius: "9999px",
        border: "3px solid currentColor",
        borderRightColor: "transparent",
        animation: "spin 1s linear infinite",
        verticalAlign: "middle",
        marginRight: "0.5rem",
      },
      backLink: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        color: darkMode ? "#a5b4fc" : "#6366f1",
        textDecoration: "none",
        fontSize: "0.875rem",
        marginTop: "1.5rem",
        width: "fit-content",
      },
      passwordStrength: {
        marginTop: "0.5rem",
      },
      passwordRequirement: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        fontSize: "0.75rem",
        color: darkMode ? "#9ca3af" : "#6b7280",
        marginTop: "0.25rem",
      },
      validRequirement: {
        color: darkMode ? "#34d399" : "#059669",
      },
      containerResponsive: {
        gridTemplateColumns: "repeat(2, 1fr)", // Two columns on large screens
      },
    }),
    [darkMode]
  );

  // Password requirement checks
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && password !== "";

  return (
    <div
      style={{
        ...styles.container,
        ...(isLargeScreen ? styles.containerResponsive : {}),
      }}
    >
      {/* Left Section - Reset Password Form */}
      <div style={styles.leftPanel}>
        <div style={styles.formContainer}>
          <div style={styles.header}>
            <div style={styles.logo}>
              <BookOpenIcon />
              <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                App Portal
              </span>
            </div>
            <h1 style={styles.title}>Reset Your Password</h1>
            <p style={styles.subtitle}>
              Create a new secure password for your account
            </p>
          </div>

          {error && (
            <div style={styles.errorContainer}>
              <AlertCircleIcon />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={styles.successContainer}>
              <div style={styles.successIcon}>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "600", margin: "0 0 8px", color: darkMode ? "#34d399" : "#065f46" }}>Success!</h2>
              <p style={{ marginBottom: "1rem" }}>{success}</p>
              <Link 
                to="/auth/login" 
                style={{
                  ...styles.submitButton,
                  backgroundColor: "#059669",
                  borderColor: "#059669",
                  textDecoration: "none",
                  display: "inline-block",
                  padding: "0.75rem 1.5rem",
                }}
              >
                Return to Login
              </Link>
            </div>
          )}

          {tokenIsValid === null && !error && (
            <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
              <div style={{ margin: "0 auto 1rem", width: "48px", height: "48px" }}>
                <div 
                  className="spin-animation"
                  style={{
                    width: "48px",
                    height: "48px",
                    border: `4px solid ${darkMode ? "#1f2937" : "#f3f4f6"}`,
                    borderTopColor: "#3b82f6",
                    borderRadius: "50%",
                  }}
                ></div>
              </div>
              <p style={{ fontSize: "1rem", color: darkMode ? "#d1d5db" : "#4b5563" }}>Verifying your reset link...</p>
            </div>
          )}

          {tokenIsValid && !success && (
            <form onSubmit={handleSubmit} style={styles.form} noValidate>
              <div style={styles.inputGroup}>
                <label htmlFor="password" style={styles.label}>
                  New Password
                </label>
                <div style={styles.passwordContainer}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    style={styles.passwordInput}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-required="true"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    style={styles.eyeButton}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label htmlFor="confirmPassword" style={styles.label}>
                  Confirm Password
                </label>
                <div style={styles.passwordContainer}>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    style={styles.passwordInput}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    aria-required="true"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    style={styles.eyeButton}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {/* Password requirements */}
              <div style={styles.passwordStrength}>
                <div
                  style={{
                    ...styles.passwordRequirement,
                    ...(hasMinLength ? styles.validRequirement : {}),
                  }}
                >
                  {hasMinLength ? <CheckIcon /> : <span>•</span>}
                  <span>At least 8 characters</span>
                </div>
                <div
                  style={{
                    ...styles.passwordRequirement,
                    ...(hasUpperCase ? styles.validRequirement : {}),
                  }}
                >
                  {hasUpperCase ? <CheckIcon /> : <span>•</span>}
                  <span>Contains uppercase letter</span>
                </div>
                <div
                  style={{
                    ...styles.passwordRequirement,
                    ...(hasLowerCase ? styles.validRequirement : {}),
                  }}
                >
                  {hasLowerCase ? <CheckIcon /> : <span>•</span>}
                  <span>Contains lowercase letter</span>
                </div>
                <div
                  style={{
                    ...styles.passwordRequirement,
                    ...(hasNumber ? styles.validRequirement : {}),
                  }}
                >
                  {hasNumber ? <CheckIcon /> : <span>•</span>}
                  <span>Contains number</span>
                </div>
                <div
                  style={{
                    ...styles.passwordRequirement,
                    ...(passwordsMatch ? styles.validRequirement : {}),
                  }}
                >
                  {passwordsMatch ? <CheckIcon /> : <span>•</span>}
                  <span>Passwords match</span>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  ...styles.submitButton,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spin-animation" style={{
                      display: "inline-block",
                      width: "1.25rem",
                      height: "1.25rem",
                      marginRight: "0.5rem",
                      borderRadius: "50%",
                      border: "2px solid rgba(255, 255, 255, 0.3)",
                      borderTopColor: "#ffffff",
                    }}></span>
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}

          {(tokenIsValid === false || tokenExpired) && (
            <div style={{ textAlign: "center", padding: "1rem" }}>
              <div style={styles.errorIcon}>
                <AlertCircleIcon width={48} height={48} />
              </div>
              <h2 style={{ margin: "15px 0", color: "#d32f2f" }}>
                {tokenExpired
                  ? "Expired Link"
                  : "Invalid Link"}
              </h2>
              <p>
                {tokenExpired
                  ? "This password reset link has expired."
                  : "Invalid reset link."}
              </p>
              <p style={{ marginTop: "1rem" }}>
                Please request a new password reset link.
              </p>
              <Link
                to="/auth/forgot-password"
                style={{
                  ...styles.submitButton,
                  display: "inline-block",
                  textDecoration: "none",
                  textAlign: "center",
                  marginTop: "1rem",
                }}
              >
                Request New Link
              </Link>
            </div>
          )}

          <Link to="/auth/login" style={styles.backLink}>
            <ArrowLeftIcon />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
