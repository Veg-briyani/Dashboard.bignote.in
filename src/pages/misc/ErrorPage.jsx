import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// SVG Icons
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

const HomeIcon = () => (
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
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);

  // Handle auto-redirect countdown
  useEffect(() => {
    const timer = countdown > 0
      ? setInterval(() => setCountdown(prev => prev - 1), 1000)
      : navigate("/dashboard");

    return () => clearInterval(timer);
  }, [countdown, navigate]);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Memoized styles
  const styles = React.useMemo(
    () => ({
      container: {
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr",
        background: "linear-gradient(to bottom right, #eef2ff, #ede9fe)", // Light Indigo/Violet gradient
      },
      containerResponsive: {
        gridTemplateColumns: "repeat(2, 1fr)", // Two columns on large screens
      },
      contentPanel: {
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        color: "#000000",
      },
      logo: {
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        color: "#6366f1", // Indigo
        marginBottom: "2rem",
      },
      logoText: {
        fontSize: "1.5rem",
        fontWeight: "bold",
      },
      errorCode: {
        fontSize: "8rem",
        fontWeight: "bold",
        lineHeight: "1",
        color: "#6366f1", // Indigo
        marginBottom: "1rem",
        fontFamily: "serif",
      },
      title: {
        fontSize: "2rem",
        fontWeight: "bold",
        color: "#111827",
        marginBottom: "1rem",
        textAlign: "center",
      },
      subtitle: {
        color: "#4b5563",
        fontSize: "1.1rem",
        maxWidth: "28rem",
        textAlign: "center",
        marginBottom: "2.5rem",
      },
      buttonsContainer: {
        display: "flex",
        gap: "1rem",
        flexWrap: "wrap",
        justifyContent: "center",
      },
      primaryButton: {
        backgroundColor: "#6366f1", // Indigo
        color: "#ffffff",
        padding: "0.75rem 1.5rem",
        borderRadius: "0.5rem",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        border: "none",
        cursor: "pointer",
        transition: "background-color 0.3s",
        textDecoration: "none",
      },
      secondaryButton: {
        color: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        padding: "0.75rem 1.5rem",
        borderRadius: "0.5rem",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        border: "1px solid",
        borderColor: "#818cf8",
        cursor: "pointer",
        transition: "background-color 0.3s",
        textDecoration: "none",
      },
      countdownText: {
        marginTop: "2rem",
        fontSize: "0.9rem",
        color: "#6b7280",
      },
      illustrationPanel: {
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
      illustrationContent: {
        position: "relative",
        zIndex: "10",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },
      lostBookContainer: {
        position: "relative",
        width: "20rem",
        height: "20rem",
        margin: "2rem auto",
      },
      bookPage: {
        position: "absolute",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: "0.25rem",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        animation: "float 6s ease-in-out infinite",
      },
      page1: {
        width: "10rem",
        height: "14rem",
        left: "10%",
        top: "10%",
        transform: "rotate(-10deg)",
        animationDelay: "0s",
      },
      page2: {
        width: "8rem",
        height: "12rem",
        left: "40%",
        top: "20%",
        transform: "rotate(5deg)",
        animationDelay: "0.5s",
      },
      page3: {
        width: "9rem",
        height: "13rem",
        left: "25%",
        top: "35%",
        transform: "rotate(-5deg)",
        animationDelay: "1s",
      },
      magnifyingGlass: {
        position: "absolute",
        right: "5%",
        bottom: "15%",
        width: "8rem",
        height: "8rem",
        borderRadius: "50%",
        border: "0.5rem solid rgba(255, 255, 255, 0.3)",
        animation: "float 8s ease-in-out infinite",
        animationDelay: "1.5s",
      },
      magnifyingHandle: {
        position: "absolute",
        width: "0.8rem",
        height: "6rem",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        bottom: "-60%",
        left: "75%",
        transform: "rotate(-45deg)",
        borderRadius: "1rem",
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
      pattern: {
        position: "absolute",
        inset: "0",
        opacity: "0.1",
        pointerEvents: "none",
      },
      quoteMark: {
        fontSize: "5rem",
        lineHeight: "1",
        opacity: "0.3",
        fontFamily: "serif",
        marginBottom: "-2rem",
      },
      quote: {
        fontSize: "1.2rem",
        maxWidth: "24rem",
        textAlign: "center",
        fontStyle: "italic",
        opacity: "0.9",
        marginBottom: "1rem",
      },
      quoteAuthor: {
        fontSize: "0.9rem",
        opacity: "0.8",
      },
    }),
    []
  );

  return (
    <div
      style={{
        ...styles.container,
        ...(isLargeScreen ? styles.containerResponsive : {}),
      }}
    >
      {/* Content Section */}
      <div style={styles.contentPanel}>
        <Link to="/" style={styles.logo}>
          <BookOpenIcon />
          <span style={styles.logoText}>Author Dashboard</span>
        </Link>

        <div style={styles.errorCode}>404</div>
        <h1 style={styles.title}>Page Not Found</h1>
        <p style={styles.subtitle}>
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>

        <div style={styles.buttonsContainer}>
          <Link to="/dashboard" style={styles.primaryButton}>
            <HomeIcon />
            <span>Go to Dashboard</span>
          </Link>
          <button onClick={() => navigate(-1)} style={styles.secondaryButton}>
            <ArrowLeftIcon />
            <span>Go Back</span>
          </button>
        </div>

        <p style={styles.countdownText}>
          Redirecting to dashboard in {countdown} seconds...
        </p>
      </div>

      {/* Illustration Section (only on large screens) */}
      {isLargeScreen && (
        <div style={styles.illustrationPanel}>
          <div style={styles.illustrationContent}>
            {/* Floating Elements */}
            <div style={styles.floatingCircle1}></div>
            <div style={styles.floatingCircle2}></div>

            {/* Lost Pages Illustration */}
            <div style={styles.lostBookContainer}>
              <div style={{...styles.bookPage, ...styles.page1}}></div>
              <div style={{...styles.bookPage, ...styles.page2}}></div>
              <div style={{...styles.bookPage, ...styles.page3}}></div>
              
              <div style={styles.magnifyingGlass}>
                <div style={styles.magnifyingHandle}></div>
              </div>
            </div>

            {/* Quote */}
            <div style={styles.quoteMark}>"</div>
            <p style={styles.quote}>
              The greatest part of a writer's time is spent in reading, in order to write;
              a man will turn over half a library to make one book.
            </p>
            <div style={styles.quoteAuthor}>- Samuel Johnson</div>
          </div>

          {/* Pattern Background */}
          <div style={styles.pattern}>
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20L0 20z' fill='%23FFFFFF' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E\")",
                backgroundRepeat: "repeat",
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Animation Keyframes */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(var(--rotation, 0deg)); }
            50% { transform: translateY(-15px) rotate(var(--rotation, 0deg)); }
          }
        `}
      </style>
    </div>
  );
};

export default NotFoundPage;