import React, { useState, useEffect, useCallback } from "react"; // Added useCallback
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { GoogleLogin } from '@react-oauth/google';

// --- SVG Icons (Unchanged) ---
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
    {" "}
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>{" "}
    <circle cx="12" cy="12" r="3"></circle>{" "}
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
    {" "}
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>{" "}
    <line x1="1" y1="1" x2="23" y2="23"></line>{" "}
  </svg>
);
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
    {" "}
    <circle cx="12" cy="12" r="10"></circle>{" "}
    <line x1="12" y1="8" x2="12" y2="12"></line>{" "}
    <line x1="12" y1="16" x2="12.01" y2="16"></line>{" "}
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
    {" "}
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>{" "}
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>{" "}
  </svg>
);
const PenToolIcon = () => ( // Keep this if used elsewhere, otherwise it's unused here
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
    {" "}
    <path d="M12 19l7-7 3 3-7 7-3-3z"></path>{" "}
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>{" "}
    <path d="M2 2l7.586 7.586"></path> <circle cx="11" cy="11" r="2"></circle>{" "}
  </svg>
);
const MailIcon = () => ( // Keep this if used elsewhere, otherwise it's unused here
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
    {" "}
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>{" "}
    <polyline points="22,6 12,13 2,6"></polyline>{" "}
  </svg>
);
// Google Icon (Example using inline SVG for consistency, replace if needed)
const GoogleIcon = () => ( // Keep this if used elsewhere, otherwise it's unused here
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.35,11.1H12.18V13.83H18.67C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,5 12,5C14.5,5 16.72,5.86 18.09,7.18L19.46,5.82C17.57,4.05 15,3 12,3C7.03,3 3,6.58 3,12C3,17.42 7.03,21 12,21C17,21 20.7,17.59 20.7,12.43C20.7,11.91 21.35,11.1 21.35,11.1Z" />
  </svg>
);


const Login = () => {
  const navigate = useNavigate();
  // Updated function names to match AuthContext
  const { login, requestOTP, verifyOTP, googleLogin, forgotPassword } = useAuth();
  const { darkMode } = useTheme();

  // State Variables
  const [loginMode, setLoginMode] = useState("password"); // "password" or "otp"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); // Loading for main submit
  const [otpLoading, setOtpLoading] = useState(false); // Loading for sending OTP
  const [otpSent, setOtpSent] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);
  // State variable for the countdown timer
  const [otpCountdown, setOtpCountdown] = useState(0); // Initial countdown is 0 seconds

  // --- Effects ---
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    if (redirect) setRedirectUrl(redirect);

    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Add this useEffect to handle the countdown timer
  useEffect(() => {
    // Only run countdown if greater than 0
    if (otpCountdown > 0) {
      const timer = setTimeout(() => {
        setOtpCountdown(otpCountdown - 1);
      }, 1000);
      
      // Cleanup the timer
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]); // Re-run effect when countdown changes

  // --- Handlers ---

  // Handle sending OTP
  const handleSendOtp = useCallback(async () => {
    if (!phoneNumber || otpLoading || otpCountdown > 0) return; // Prevent sending if no number, already loading, or in countdown
    
    // Format phone number to match backend validation requirements
    // Remove all non-digit characters except leading +
    const formattedPhoneNumber = phoneNumber.replace(/^(\+?)/, '$1').replace(/[^\d+]/g, '');
    
    // Validate phone number format before sending
    if (!/^\+?[1-9]\d{1,14}$/.test(formattedPhoneNumber)) {
      setError("Please enter a valid phone number (e.g. +919305366856)");
      return;
    }
    
    setOtpLoading(true);
    setError("");
    try {
      await requestOTP(formattedPhoneNumber); // Use formatted phone number
      setOtpSent(true);
      // Start countdown for 60 seconds
      setOtpCountdown(60);
      // Optionally: Add a success message or focus the OTP input field
      // console.log("OTP sent successfully");
    } catch (err) {
      console.error("OTP request error:", err); // Add logging
      setError(err.response?.data?.message || err.message || "Failed to send OTP. Please check the number and try again.");
      setOtpSent(false); // Reset otpSent state on error
    } finally {
      setOtpLoading(false);
    }
  }, [phoneNumber, otpLoading, otpCountdown, requestOTP, setError]);



  // Handle main form submission (Email/Password or OTP)
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (loginMode === "password") {
        if (!email || !password) throw new Error("Please fill in both email and password.");
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail"); // Remove if not checked
        }
        await login(email, password);
      } else if (loginMode === "otp") {
        if (!phoneNumber || !otp) throw new Error("Please provide phone number and OTP.");
        if (!otpSent) throw new Error("Please request an OTP first.");
        if (otp.length !== 6) throw new Error("OTP must be 6 digits."); // Example validation

        // Format phone number consistently, same as in handleSendOtp
        const formattedPhoneNumber = phoneNumber.replace(/^(\+?)/, '$1').replace(/[^\d+]/g, '');
        
        // Validate phone number format before verification
        if (!/^\+?[1-9]\d{1,14}$/.test(formattedPhoneNumber)) {
          throw new Error("Please enter a valid phone number (e.g. +919305366856)");
        }

        await verifyOTP(formattedPhoneNumber, otp); // Use formatted phone number
      }

      // Navigate on successful login/verification
      navigate(redirectUrl ? `${redirectUrl}` : "/dashboard");

    } catch (err) {
      console.error("Authentication error:", err);
      setError(err.response?.data?.message || err.message || "Authentication failed. Please check your credentials.");
      // Don't clear OTP input on failed verification attempt, user might just mistype
      // if (loginMode === "otp") setOtp(""); // Consider if you want this behavior
    } finally {
      setLoading(false);
    }
  }, [loginMode, email, password, phoneNumber, otp, otpSent, rememberMe, redirectUrl, navigate, login, verifyOTP, setError]);

  // --- Inline Styles Definition (Memoized) ---
  const styles = React.useMemo(
    () => ({
      // --- Base Styles ---
      container: {
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr", // Default to single column
        background: darkMode
          ? "#111827" // Dark Gray
          : "linear-gradient(to bottom right, #eef2ff, #ede9fe)", // Light Indigo/Violet gradient
      },
      leftPanel: {
        padding: "2rem", // Adjust padding for smaller screens
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh", // Ensure panel takes height
      },
      formContainer: {
        maxWidth: "28rem",
        width: "100%",
        color: darkMode ? "#ffffff" : "#000000",
      },
      header: { textAlign: "center", marginBottom: "2rem" },
      logo: {
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        color: "#6366f1", // Use theme color?
        marginBottom: "1.5rem",
      },
      title: {
        fontSize: "2rem",
        fontWeight: "bold",
        fontFamily: "serif",
        color: darkMode ? "#ffffff" : "#111827",
        marginBottom: "0.5rem",
      },
      subtitle: {
        color: darkMode ? "#d1d5db" : "#4b5563",
        fontSize: "0.9rem",
      },
      errorContainer: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.75rem",
        backgroundColor: darkMode ? "#5f2120" : "#fee2e2",
        color: darkMode ? "#fecaca" : "#b91c1c",
        borderRadius: "0.5rem",
        marginBottom: "1.5rem",
        border: `1px solid ${darkMode ? "#b91c1c" : "#fecaca"}`,
        fontSize: "0.875rem",
      },
      form: { marginBottom: "1.5rem" },
      inputGroup: { marginBottom: "1rem", position: "relative" },
      label: {
        display: "block",
        fontSize: "0.875rem",
        fontWeight: "500",
        color: darkMode ? "#d1d5db" : "#374151",
        marginBottom: "0.5rem",
      },
      input: { // General input style
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
      passwordContainer: { position: "relative" },
      passwordInput: { // Specific style for password to allow space for eye icon
        width: "100%",
        padding: "0.75rem 1rem",
        paddingRight: "3rem", // Space for eye icon
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
        cursor: "pointer",
        color: darkMode ? "#9ca3af" : "#9ca3af",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0.5rem", // Increased padding for easier click
      },
      checkboxContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1.5rem",
      },
      checkboxLabel: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        cursor: "pointer",
      },
      checkbox: { accentColor: "#6366f1", width: "1rem", height: "1rem" },
      rememberMeText: {
        fontSize: "0.875rem",
        color: darkMode ? "#d1d5db" : "#4b5563",
        userSelect: "none", // Prevent text selection
      },
      forgotPassword: {
        fontSize: "0.875rem",
        color: darkMode ? "#a5b4fc" : "#6366f1",
        textDecoration: "none",
        transition: "color 0.3s",
      }, // Removed underline, add hover later via CSS if needed
      submitButton: {
        width: "100%",
        backgroundColor: "#6366f1",
        color: "#ffffff",
        padding: "0.875rem",
        borderRadius: "0.5rem",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        border: "none",
        cursor: "pointer",
        transition: "background-color 0.3s, opacity 0.3s", // Added opacity transition
        marginBottom: "1.5rem",
      },
      submitButtonDisabled: {
        backgroundColor: darkMode ? "#4338ca" : "#a5b4fc", // Keep distinct disabled color
        cursor: "not-allowed",
        opacity: 0.7, // Use opacity for disabled state
      },
      divider: { display: "flex", alignItems: "center", margin: "1.5rem 0" },
      dividerLine: {
        flex: "1",
        height: "1px",
        backgroundColor: darkMode ? "#4b5563" : "#d1d5db",
      },
      dividerText: {
        padding: "0 0.75rem",
        color: darkMode ? "#9ca3af" : "#6b7280",
        fontSize: "0.8rem",
        whiteSpace: "nowrap",
      },
      socialButtons: {
        display: "flex",
        gap: "1rem",
        justifyContent: "center",
        marginBottom: "1.5rem",
      },
      socialButton: { // Style for the wrapper around GoogleLogin if needed
        padding: "0", // Reset padding if GoogleLogin provides its own
        border: "none",
        // border: "1px solid",
        // borderColor: darkMode ? "#4b5563" : "#d1d5db",
        borderRadius: "0.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        backgroundColor: "transparent",
        // transition: "background-color 0.3s",
        // color: darkMode ? "#d1d5db" : "#374151",
      },
      registerText: {
        fontSize: "0.875rem",
        color: darkMode ? "#d1d5db" : "#4b5563",
        textAlign: "center",
      },
      registerLink: {
        fontWeight: "500",
        color: darkMode ? "#a5b4fc" : "#6366f1",
        textDecoration: "none",
      }, // Removed underline
      rightPanel: { // Styles for the right panel container
        display: "flex",
        background: "linear-gradient(to bottom right, #6366f1, #8b5cf6)",
        paddingTop: "0rem",
        paddingRight: "3rem",
        paddingBottom: "3rem",
        paddingLeft: "3rem",
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
      // --- Floating circles, illustrations etc. (Unchanged from original) ---
      floatingCircle1: { position: "absolute", top: "-5rem", left: "-5rem", width: "12rem", height: "12rem", backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: "9999px", mixBlendMode: "screen", filter: "blur(24px)", },
      floatingCircle2: { position: "absolute", bottom: "5rem", right: "-5rem", width: "8rem", height: "8rem", backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: "9999px", filter: "blur(16px)", },
      deskIllustration: { position: "relative", height: "350px", width: "100%", marginTop: "2rem", },
      desk: { position: "absolute", bottom: "0", left: "50%", transform: "translateX(-50%)", width: "80%", height: "60%", backgroundColor: "rgba(255, 255, 255, 0.05)", borderTopLeftRadius: "1rem", borderTopRightRadius: "1rem", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", },
      laptop: { position: "absolute", left: "50%", transform: "translateX(-50%)", top: "-2rem", width: "60%", backgroundColor: "rgba(255, 255, 255, 0.1)", padding: "1rem", borderRadius: "0.5rem", },
      laptopScreen: { height: "8rem", backgroundColor: "rgba(255, 255, 255, 0.2)", borderRadius: "0.375rem", display: "flex", alignItems: "center", justifyContent: "center", },
      screenText: { fontSize: "0.875rem", fontStyle: "italic", opacity: "0.75", },
      books: { position: "absolute", left: "2rem", bottom: "2rem", display: "flex", gap: "0.5rem", alignItems: "flex-end", },
      book1: { width: "1.5rem", height: "2.5rem", backgroundColor: "rgba(224, 231, 255, 0.3)", borderRadius: "0.125rem", },
      book2: { width: "1.5rem", height: "3rem", backgroundColor: "rgba(199, 210, 254, 0.3)", borderRadius: "0.125rem", },
      book3: { width: "1.5rem", height: "2rem", backgroundColor: "rgba(224, 231, 255, 0.3)", borderRadius: "0.125rem", },
      coffee: { position: "absolute", right: "2rem", bottom: "2rem" },
      coffeeCup: { width: "1.5rem", height: "2rem", backgroundColor: "rgba(255, 255, 255, 0.2)", borderTopLeftRadius: "9999px", borderTopRightRadius: "9999px", },
      coffeePlate: { width: "2rem", height: "0.5rem", backgroundColor: "rgba(255, 255, 255, 0.2)", borderRadius: "9999px", marginTop: "0px", },
      floatingBook: { position: "absolute", top: "3rem", left: "50%", transform: "translateX(-50%)", animation: "float 6s ease-in-out infinite", },
      logoContainer: { marginBottom: "2rem" },
      logoImage: { width: "5rem", height: "5rem", objectFit: "contain", borderRadius: "0.75rem", marginBottom: "1rem", margin: "0 auto", },
      logoTitle: { fontSize: "1.5rem", fontWeight: "bold" },
      logoSubtitle: { fontSize: "0.875rem", opacity: "0.8" },
      progressCard: { position: "relative", backgroundColor: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(4px)", borderRadius: "0.75rem", padding: "1.5rem", maxWidth: "20rem", margin: "0 auto", transform: "none", transition: "transform 0.3s", },
      progressHeader: { display: "flex", alignItems: "center", gap: "1rem" },
      progressIcon: { flexShrink: "0", width: "3rem", height: "3rem", borderRadius: "9999px", backgroundColor: "rgba(255, 247, 237, 1)", display: "flex", alignItems: "center", justifyContent: "center", },
      progressInfo: { textAlign: "left", flexGrow: 1 },
      progressTitle: { fontWeight: "600" },
      progressText: { fontSize: "0.875rem", opacity: "0.9" },
      progressBar: { marginTop: "0.5rem", width: "100%", backgroundColor: "rgba(255, 255, 255, 0.2)", borderRadius: "9999px", height: "0.5rem", overflow: "hidden", },
      progressFill: { backgroundColor: "rgba(165, 180, 252, 1)", borderRadius: "9999px", height: "100%", width: "80%", },
      statsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginTop: "2rem", },
      statCard: { padding: "1rem", backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: "0.5rem", transform: "none", transition: "transform 0.3s, background-color 0.3s", },
      statValue: { fontSize: "1.5rem", fontWeight: "bold" },
      statLabel: { fontSize: "0.875rem" },
      statBar: { marginTop: "0.5rem", width: "100%", backgroundColor: "rgba(255, 255, 255, 0.2)", borderRadius: "9999px", height: "0.25rem", overflow: "hidden", },
      statFill: { backgroundColor: "rgba(165, 180, 252, 1)", borderRadius: "9999px", height: "100%", },
      quote: { marginTop: "3rem", fontStyle: "italic", opacity: "0.9" },
      quoteAuthor: { marginTop: "0.5rem", fontSize: "0.875rem" },
      pattern: { position: "absolute", inset: "0", opacity: "0.1", pointerEvents: "none", },
      loadingSpinner: { display: "inline-block", width: "1.25rem", height: "1.25rem", borderRadius: "9999px", border: "3px solid currentColor", borderRightColor: "transparent", animation: "spin 1s linear infinite", verticalAlign: "middle", marginRight: "0.5rem", },
      
      // Modal styles
      modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      },
      modalContent: {
        backgroundColor: darkMode ? "#1f2937" : "white",
        padding: "2rem",
        borderRadius: "0.5rem",
        width: "90%",
        maxWidth: "450px",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      },
      modalTitle: {
        fontSize: "1.5rem",
        fontWeight: "bold",
        marginBottom: "1.5rem",
        color: darkMode ? "#f3f4f6" : "#1f2937",
      },
      forgotPasswordForm: {
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      },
      modalButtons: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "1rem",
        marginTop: "1rem",
      },
      modalCancelButton: {
        padding: "0.5rem 1rem",
        border: "1px solid",
        borderColor: darkMode ? "#4b5563" : "#d1d5db",
        borderRadius: "0.375rem",
        backgroundColor: "transparent",
        color: darkMode ? "#d1d5db" : "#4b5563",
        cursor: "pointer",
        transition: "all 0.2s",
      },
      modalSubmitButton: {
        padding: "0.5rem 1rem",
        border: "none",
        borderRadius: "0.375rem",
        backgroundColor: darkMode ? "#6366f1" : "#4f46e5",
        color: "white",
        fontWeight: "500",
        cursor: "pointer",
        transition: "all 0.2s",
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
      // --- New/Modified Styles ---
      switchModeButton: { // Style for the "Use OTP/Password instead?" link
        background: "none",
        border: "none",
        color: darkMode ? "#a5b4fc" : "#6366f1",
        cursor: "pointer",
        fontSize: "0.875rem",
        textDecoration: "underline",
        padding: "0.25rem 0",
        marginTop: "-0.5rem", // Adjust spacing after input group
        marginBottom: "1rem", // Spacing before next element
        display: "inline-block", // Make it sit like text
        textAlign: "left", // Align left
        width: "auto", // Don't take full width
      },
      otpInputGroupContainer: { // Container for OTP label, input, and resend button
        marginBottom: "1rem", // Same as other input groups
      },
      otpLabelContainer: { // Flex container for label and resend button
         display: 'flex',
         justifyContent: 'space-between',
         alignItems: 'center', // Vertically align items
         marginBottom: '0.5rem', // Space below label row
      },
      otpInput: { // Style specifically for OTP input if different from general input
          // Inherits from styles.input, add specifics if needed
          letterSpacing: '0.5rem', // Add spacing between OTP digits
          textAlign: 'center',
      },
      // Removed otpInputDisabled style as input styling handles it
      // Removed sendOtpButton style as it's replaced by otpResendButton
      // Removed sendOtpButtonDisabled style
      otpResendButton: { // Style for the "Send/Resend OTP" button next to label
        background: "none",
        border: "none",
        color: darkMode ? "#a5b4fc" : "#6366f1",
        cursor: "pointer",
        fontSize: "0.875rem",
        fontWeight: "500", // Make it slightly bolder
        padding: "0.25rem 0", // Minimal padding
        textAlign: 'right',
        // textDecoration: "underline", // Optional underline
        whiteSpace: "nowrap",
        display: "flex", // Align icon/text if needed
        alignItems: "center",
        justifyContent: "center",
        transition: "color 0.3s",
      },
      otpResendButtonDisabled: { // Style when OTP button is disabled
          color: darkMode ? "#6b7280" : "#9ca3af", // Greyed out color
          cursor: "not-allowed",
          opacity: 0.7,
      },
      // --- Styles applied based on screen size state ---
      containerResponsive: {
        gridTemplateColumns: "repeat(2, 1fr)", // Two columns on large screens
      },
      rightPanelVisible: { // Ensure right panel is visible when it should be
          display: "flex", // Should already be flex from base styles
      },
      // phoneInput style is covered by general styles.input
    }),
    [darkMode] // Recalculate styles only when darkMode changes
  );

  return (
    <div
      style={{
        ...styles.container,
        ...(isLargeScreen ? styles.containerResponsive : {}), // Apply responsive styles
      }}
    >
      {/* Left Section - Login Form */}
      <div style={styles.leftPanel}>
        <div style={styles.formContainer}>
          <div style={styles.header}>
            <div style={styles.logo}>
              <BookOpenIcon />
              <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                {redirectUrl ? "Authentication Required" : "App Portal"}
              </span>
            </div>
            <h1 style={styles.title}>Welcome Back</h1>
            <p style={styles.subtitle}>
              {redirectUrl ? "Login to continue" : "Access your account"}
            </p>
          </div>

          {error && (
            <div style={styles.errorContainer}>
              <AlertCircleIcon />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form} noValidate>
            {/* == Conditional Input Section == */}

            {loginMode === "password" ? (
              // --- Email/Password Inputs ---
              <>
                <div style={styles.inputGroup}>
                  <label htmlFor="email" style={styles.label}>Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    style={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-required="true"
                    aria-invalid={!!error && error.toLowerCase().includes('email')} // Accessibility
                  />
                </div>

                 {/* Password Input (Only shown in password mode) */}
                <div style={styles.inputGroup}>
                   <label htmlFor="password" style={styles.label}>Password</label>
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
                       aria-invalid={!!error && error.toLowerCase().includes('password')} // Accessibility
                     />
                     <button
                       type="button"
                       onClick={() => setShowPassword(s => !s)}
                       style={styles.eyeButton}
                       aria-label={showPassword ? "Hide password" : "Show password"} // Accessibility
                     >
                       {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                     </button>
                   </div>
                 </div>

                <div style={styles.forgotPasswordContainer}>
                  {/* <div style={styles.rememberMeContainer}>
                    <input
                      id="rememberMe"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={styles.checkbox}
                    />
                    <label htmlFor="rememberMe" style={styles.checkboxLabel}>
                      Remember me
                    </label>
                  </div>
                   */}
                </div>
              </>
            ) : (
              // --- Phone/OTP Inputs ---
              <>
                <div style={styles.inputGroup}>
                  <label htmlFor="phone" style={styles.label}>Phone Number</label>
                  <input
                    id="phone"
                    type="tel" // Use tel type for phone numbers
                    placeholder="+1 234 567 8900" // Example format
                    style={styles.input}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    aria-required="true"
                    disabled={otpSent && !otpLoading} // Disable phone number input after OTP is sent? Optional.
                  />
                </div>

                {/* OTP Input Group */}
                <div style={styles.otpInputGroupContainer}>
                   <div style={styles.otpLabelContainer}>
                       <label htmlFor="otp" style={styles.label}>OTP Code</label>
                       <button
                         type="button"
                         onClick={handleSendOtp}
                         style={{
                             ...styles.otpResendButton,
                             ...(!phoneNumber || otpLoading || otpCountdown > 0 ? styles.otpResendButtonDisabled : {}) // Apply disabled style
                         }}
                         disabled={!phoneNumber || otpLoading || otpCountdown > 0} // Disable if no phone, OTP is loading, or countdown active
                       >
                         {otpLoading ? (
                             <>
                               <span style={{...styles.loadingSpinner, width:'1rem', height:'1rem', marginRight:'0.25rem', border:'2px solid currentColor', borderRightColor:'transparent'}}></span>
                               Sending...
                             </>
                          ) : otpCountdown > 0 ? (
                            `Resend in ${otpCountdown}s`
                          ) : otpSent ? 
                            "Resend OTP" 
                          : 
                            "Send OTP"
                         }
                       </button>
                   </div>
                   <input
                     id="otp"
                     type="text" // Use text to allow custom input handling
                     inputMode="numeric" // Hint for numeric keyboard on mobile
                     placeholder="123456"
                     style={styles.otpInput} // Use specific OTP input style
                     value={otp}
                     onChange={(e) => {
                         // Only allow digits and limit length
                         const digits = e.target.value.replace(/\D/g, '');
                         setOtp(digits.slice(0, 6));
                     }}
                     maxLength={6}
                     required
                     aria-required="true"
                     disabled={!otpSent || loading} // Disable until OTP is sent or while verifying
                   />
                 </div>
              </>
            )}

            {/* == Mode Switch Button == */}
            <button
              type="button"
              onClick={() => {
                setLoginMode(prev => (prev === "password" ? "otp" : "password"));
                // Reset states when switching modes
                setError("");
                setPassword("");
                setPhoneNumber("");
                setOtp("");
                setOtpSent(false);
                setOtpLoading(false); // Reset OTP loading state too
                setOtpCountdown(0); // Reset countdown
              }}
              style={styles.switchModeButton}
            >
              {loginMode === "password"
                ? "Use Phone / OTP instead?"
                : "Use Email / Password instead?"}
            </button>

            {/* == Common Form Elements == */}

            {/* Remember Me & Forgot Password (Only shown in password mode) */}
            {loginMode === "password" && (
                <div style={styles.checkboxContainer}>
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      style={styles.checkbox}
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span style={styles.rememberMeText}>Remember me</span>
                  </label>
                  {/* Add link functionality later */}
                  <a href="/auth/forgot-password" style={styles.forgotPassword} onClick={() => window.location.href = '/auth/forgot-password'}>
                    Forgot password?
                  </a>

                </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                ...styles.submitButton,
                ...(loading ? styles.submitButtonDisabled : {}) // Apply disabled style when loading
              }}
              disabled={loading || (loginMode === 'otp' && otpLoading)} // Disable during main load or OTP sending
            >
              {loading ? (
                <>
                  <span style={styles.loadingSpinner}></span>
                  Processing...
                </>
              ) : loginMode === "password" ? (
                "Sign In"
              ) : (
                "Verify OTP & Sign In"
              )}
            </button>
          </form>

          {/* Social Login and Registration Links */}
          <div style={styles.divider}>
            <div style={styles.dividerLine}></div>
            <span style={styles.dividerText}>Or continue with</span>
            <div style={styles.dividerLine}></div>
          </div>

          <div style={styles.socialButtons}>
              {/* Google Login Button */}
             <div style={styles.socialButton}> {/* Optional wrapper div */}
               <GoogleLogin
                 onSuccess={credentialResponse => {
                   console.log("Google Login Success:", credentialResponse);
                   setLoading(true); // Set loading state for Google login flow
                   googleLogin(credentialResponse.credential)
                     .then(() => {
                       navigate(redirectUrl ? redirectUrl : "/dashboard");
                     })
                     .catch(err => {
                        console.error("Google Login Error:", err);
                        setError(err.message || "Google login failed.");
                        setLoading(false);
                     });
                 }}
                 onError={() => {
                   console.log('Google Login Failed');
                   setError("Google login failed. Please try again.");
                 }}
                 // theme={darkMode ? 'filled_black' : 'outline'} // Optional theme based on dark mode
                 // size="large" // Optional size
                 // shape="rectangular" // Optional shape
               />
             </div>

              {/* Development Test Login Button (Keep or remove as needed) */}
             {/* <div style={{ marginTop: '15px', textAlign: 'center', width: '100%' }}>
               <button
                 onClick={() => {
                   // WARNING: Bypasses actual auth - for dev only!
                   localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2UzZDdjYjg4YTNhYTI1Y2FjMzVhYTgiLCJlbWFpbCI6ImR5ZGV2YW5zaEBnbWFpbC5jb20iLCJpYXQiOjE3NDMzODkzMzMsImV4cCI6MTc0Mzk5NDEzM30.Exy4j0HD_Q_112aJIeKAXt2gle75uv5XNydyu9jMnSA');
                   navigate(redirectUrl ? redirectUrl : "/dashboard");
                 }}
                 style={{
                   padding: '8px 16px',
                   backgroundColor: '#4CAF50', // Green
                   color: 'white',
                   border: 'none',
                   borderRadius: '4px',
                   cursor: 'pointer',
                   fontSize: '14px', // Smaller font size
                   display: 'block', // Make it block level
                   margin: '0 auto', // Center it
                   width: 'fit-content', // Fit content width
                 }}
               >
                 DEV: Test Login (Bypass Auth)
               </button>
               <p style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                 (For development only)
               </p>
             </div> */}
           </div>


          <p style={styles.registerText}>
            Don't have an account?{" "}
            <a href="/auth/signup" style={styles.registerLink}>Sign up</a>
          </p>


        </div>
      </div>

      {/* Right Section - Publication Showcase (Conditionally Rendered) */}
         {isLargeScreen && (  
          <div style={styles.rightPanel}>
            <div style={styles.rightPanelContent}>
           {/* Floating Elements */}
            <div style={styles.floatingCircle1}></div>
            <div style={styles.floatingCircle2}></div>
            {/* Illustration */}
            <div style={styles.deskIllustration}>
              <div style={styles.desk}>
                <div style={styles.laptop}>
                  {" "}
                  <div style={styles.laptopScreen}>
                    {" "}
                    <span style={styles.screenText}>
                      {" "}
                      Your next chapter...{" "}
                    </span>{" "}
                  </div>{" "}
                </div>
                <div style={styles.books}>
                  {" "}
                  <div style={styles.book1}></div>{" "}
                  <div style={styles.book2}></div>{" "}
                  <div style={styles.book3}></div>{" "}
                </div>
                <div style={styles.coffee}>
                  {" "}
                  <div style={styles.coffeeCup}></div>{" "}
                  <div style={styles.coffeePlate}></div>{" "}
                </div>
              </div>
              <div style={styles.floatingBook}>
                {" "}
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
                  {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />{" "}
                </svg>{" "}
              </div>
            </div>
            {/* Logo */}         
            {/* Progress Card */}        
            {/* Stats Grid */}
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                {" "}
                <div style={styles.statValue}>12k</div>{" "}
                <div style={styles.statLabel}>Reads Today</div>{" "}
                <div style={styles.statBar}>
                  {" "}
                  <div style={{ ...styles.statFill, width: "75%" }}></div>{" "}
                </div>{" "}
              </div>
              <div style={styles.statCard}>
                {" "}
                <div style={styles.statValue}>98%</div>{" "}
                <div style={styles.statLabel}>Uptime</div>{" "}
                <div style={styles.statBar}>
                  {" "}
                  <div style={{ ...styles.statFill, width: "98%" }}></div>{" "}
                </div>{" "}
              </div>
              <div style={styles.statCard}>
                {" "}
                <div style={styles.statValue}>3</div>{" "}
                <div style={styles.statLabel}>Drafts</div>{" "}
                <div style={styles.statBar}>
                  {" "}
                  <div style={{ ...styles.statFill, width: "30%" }}></div>{" "}
                </div>{" "}
              </div>
            </div>
            {/* Quote */}
            {/* <div style={styles.quote}>
              {" "}
              &quot;The first draft is just you telling yourself the
              story.&quot;{" "}
              <div style={styles.quoteAuthor}>- Terry Pratchett</div>{" "}
            </div> */}
          </div>
          {/* Pattern */}
          <div style={styles.pattern}>
            {" "}
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20L0 20z' fill='%23FFFFFF' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E\")",
                backgroundRepeat: "repeat",
              }}
            ></div>{" "}
          </div>
        </div>
      )} 

      {/* Keyframes for animations (should be defined in a CSS file or styled-components) */}
      <style>
      {`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0px); }
          50% { transform: translate(0, -15px); }
        }
        // Add hover styles etc. here if not using a CSS-in-JS lib that handles them
        // Example:
        // a:hover { text-decoration: underline; }
        // button:hover:not(:disabled) { opacity: 0.9; }
      `}
      </style>
    </div>
  );
};

export default Login;