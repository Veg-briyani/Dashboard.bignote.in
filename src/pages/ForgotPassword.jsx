import React, { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

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

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
  const { darkMode } = useTheme();

  // State variables
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);

  // Handle window resize
  React.useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!email) throw new Error("Please enter your email address");
      
      await forgotPassword(email);
      setSuccess("Password reset instructions have been sent to your email. Please check your inbox, including spam folder.");
      setEmail("");
    } catch (err) {
      console.error("Forgot password error:", err);
      setError(err.response?.data?.message || err.message || "Failed to send password reset instructions. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [email, forgotPassword]);

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
        padding: "0.75rem",
        backgroundColor: darkMode ? "rgba(5, 150, 105, 0.2)" : "rgba(5, 150, 105, 0.1)",
        borderRadius: "0.375rem",
        marginBottom: "1rem",
        display: "flex",
        alignItems: "center",
        color: darkMode ? "#34d399" : "#065f46",
        fontSize: "0.875rem",
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
      rightPanel: {
        display: "flex",
        background: "linear-gradient(to bottom right, #6366f1, #8b5cf6)",
        padding: "3rem",
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      },
      rightPanelContent: {
        maxWidth: "42rem",
        textAlign: "center",
        position: "relative",
        zIndex: "10",
        display: "flex",
        flexDirection: "column",
        gap: "3rem",
      },
      floatingCircle1: {
        position: "absolute",
        top: "-5rem",
        left: "-5rem",
        width: "12rem",
        height: "12rem",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: "9999px",
        mixBlendMode: "screen",
        filter: "blur(24px)",
      },
      floatingCircle2: {
        position: "absolute",
        bottom: "5rem",
        right: "-5rem",
        width: "8rem",
        height: "8rem",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: "9999px",
        filter: "blur(16px)",
      },
      deskIllustration: {
        position: "relative",
        height: "350px",
        width: "100%",
        marginTop: "2rem",
      },
      desk: {
        position: "absolute",
        bottom: "0",
        left: "50%",
        transform: "translateX(-50%)",
        width: "80%",
        height: "60%",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderTopLeftRadius: "1rem",
        borderTopRightRadius: "1rem",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      },
      laptop: {
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        top: "-2rem",
        width: "60%",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        padding: "1rem",
        borderRadius: "0.5rem",
      },
      laptopScreen: {
        height: "8rem",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: "0.375rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      screenText: {
        fontSize: "0.875rem",
        fontStyle: "italic",
        opacity: "0.75",
      },
      books: {
        position: "absolute",
        left: "2rem",
        bottom: "2rem",
        display: "flex",
        gap: "0.5rem",
        alignItems: "flex-end",
      },
      book1: {
        width: "1.5rem",
        height: "2.5rem",
        backgroundColor: "rgba(224, 231, 255, 0.3)",
        borderRadius: "0.125rem",
      },
      book2: {
        width: "1.5rem",
        height: "3rem",
        backgroundColor: "rgba(199, 210, 254, 0.3)",
        borderRadius: "0.125rem",
      },
      book3: {
        width: "1.5rem",
        height: "2rem",
        backgroundColor: "rgba(224, 231, 255, 0.3)",
        borderRadius: "0.125rem",
      },
      coffee: {
        position: "absolute",
        right: "2rem",
        bottom: "2rem",
      },
      coffeeCup: {
        width: "1.5rem",
        height: "2rem",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderTopLeftRadius: "9999px",
        borderTopRightRadius: "9999px",
      },
      coffeePlate: {
        width: "2rem",
        height: "0.5rem",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: "9999px",
        marginTop: "0px",
      },
      floatingBook: {
        position: "absolute",
        top: "3rem",
        left: "50%",
        transform: "translateX(-50%)",
        animation: "float 6s ease-in-out infinite",
      },
      statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1rem",
        marginTop: "2rem",
      },
      statCard: {
        padding: "1rem",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: "0.5rem",
      },
      statValue: {
        fontSize: "1.5rem",
        fontWeight: "bold",
      },
      statLabel: {
        fontSize: "0.875rem",
      },
      statBar: {
        marginTop: "0.5rem",
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: "9999px",
        height: "0.25rem",
        overflow: "hidden",
      },
      statFill: {
        backgroundColor: "rgba(165, 180, 252, 1)",
        borderRadius: "9999px",
        height: "100%",
      },
      pattern: {
        position: "absolute",
        inset: "0",
        opacity: "0.1",
        pointerEvents: "none",
      },
      containerResponsive: {
        gridTemplateColumns: "repeat(2, 1fr)",
      },
    }),
    [darkMode]
  );

  return (
    <div
      style={{
        ...styles.container,
        ...(isLargeScreen ? styles.containerResponsive : {}),
      }}
    >
      {/* Left Section - Forgot Password Form */}
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
              Enter your email address and we'll send you instructions to reset your password
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
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form} noValidate>
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-required="true"
                disabled={loading}
              />
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
                  <span style={styles.loadingSpinner}></span>
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <Link to="/auth/login" style={styles.backLink}>
            <ArrowLeftIcon />
            Back to Login
          </Link>
        </div>
      </div>

      {/* Right Section - Illustration */}
      {isLargeScreen && (  
        <div style={styles.rightPanel}>
          <div style={styles.rightPanelContent}>
            <div style={styles.floatingCircle1}></div>
            <div style={styles.floatingCircle2}></div>
            
            <div style={styles.deskIllustration}>
              <div style={styles.desk}>
                <div style={styles.laptop}>
                  <div style={styles.laptopScreen}>
                    <span style={styles.screenText}>Your next chapter...</span>
                  </div>
                </div>
                <div style={styles.books}>
                  <div style={styles.book1}></div>
                  <div style={styles.book2}></div>
                  <div style={styles.book3}></div>
                </div>
                <div style={styles.coffee}>
                  <div style={styles.coffeeCup}></div>
                  <div style={styles.coffeePlate}></div>
                </div>
              </div>
              <div style={styles.floatingBook}>
                <svg
                  style={{
                    width: "5rem",
                    height: "5rem",
                    color: "rgba(255, 255, 255, 0.2)",
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>

            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statValue}>12k</div>
                <div style={styles.statLabel}>Reads Today</div>
                <div style={styles.statBar}>
                  <div style={{ ...styles.statFill, width: "75%" }}></div>
                </div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>98%</div>
                <div style={styles.statLabel}>Uptime</div>
                <div style={styles.statBar}>
                  <div style={{ ...styles.statFill, width: "98%" }}></div>
                </div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>3</div>
                <div style={styles.statLabel}>Drafts</div>
                <div style={styles.statBar}>
                  <div style={{ ...styles.statFill, width: "30%" }}></div>
                </div>
              </div>
            </div>

            <div style={styles.pattern}>
              <div style={{
                width: "100%",
                height: "100%",
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20L0 20z' fill='%23FFFFFF' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E\")",
                backgroundRepeat: "repeat",
              }}></div>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}
      </style>
    </div>
  );
};

export default ForgotPassword;