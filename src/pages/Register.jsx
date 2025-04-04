import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { GoogleLogin } from '@react-oauth/google';

// --- SVG Icons ---
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

const Register = () => {
  const navigate = useNavigate();
  const { signup, requestSignupOTP, verifySignupOTP, googleSignup } = useAuth();
  const { darkMode } = useTheme();

  // State Variables
  const [signupMode, setSignupMode] = useState("password");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);
  const [otpCountdown, setOtpCountdown] = useState(0);

  // Effects
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
    if (redirect) navigate(redirect);
  }, [navigate]);

  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => {
        setOtpCountdown(otpCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  // Handlers
  const handleSendOtp = useCallback(async () => {
    if (!phoneNumber || otpLoading || otpCountdown > 0) return;
    
    const formattedPhoneNumber = phoneNumber.replace(/^(\+?)/, '$1').replace(/[^\d+]/g, '');
    
    if (!/^\+?[1-9]\d{1,14}$/.test(formattedPhoneNumber)) {
      setError("Please enter a valid phone number (e.g. +919305366856)");
      return;
    }
    
    setOtpLoading(true);
    setError("");
    try {
      await requestSignupOTP(formattedPhoneNumber);
      setOtpSent(true);
      setOtpCountdown(60);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to send OTP");
      setOtpSent(false);
    } finally {
      setOtpLoading(false);
    }
  }, [phoneNumber, otpLoading, otpCountdown, requestSignupOTP]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (signupMode === "password") {
        if (password !== confirmPassword) throw new Error("Passwords do not match");
        if (!name || !email) throw new Error("Please fill in all fields");
        await signup(name, email, password);
      } else if (signupMode === "otp") {
        if (!phoneNumber || !otp) throw new Error("Phone number and OTP required");
        const formattedPhoneNumber = phoneNumber.replace(/^(\+?)/, '$1').replace(/[^\d+]/g, '');
        await verifySignupOTP(formattedPhoneNumber, otp);
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }, [signupMode, name, email, password, confirmPassword, phoneNumber, otp, navigate, signup, verifySignupOTP]);

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
        minHeight: "100vh",
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
        color: "#6366f1",
        marginBottom: "1.5rem",
      },
      title: {
        fontSize: "2rem",
        fontWeight: "bold",
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
      input: {
        width: "100%",
        padding: "0.75rem 1rem",
        borderRadius: "0.5rem",
        border: "1px solid",
        borderColor: darkMode ? "#4b5563" : "#d1d5db",
        backgroundColor: darkMode ? "#1f2937" : "#ffffff",
        color: darkMode ? "#ffffff" : "#000000",
      },
      passwordContainer: { position: "relative" },
      passwordInput: {
        width: "100%",
        padding: "0.75rem 1rem",
        paddingRight: "3rem",
        borderRadius: "0.5rem",
        border: "1px solid",
        borderColor: darkMode ? "#4b5563" : "#d1d5db",
        backgroundColor: darkMode ? "#1f2937" : "#ffffff",
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
      },
      checkboxContainer: {
        display: "flex",
        alignItems: "center",
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
      },
      submitButton: {
        width: "100%",
        backgroundColor: "#6366f1",
        color: "#ffffff",
        padding: "0.875rem",
        borderRadius: "0.5rem",
        fontWeight: "500",
        border: "none",
        cursor: "pointer",
        marginBottom: "1.5rem",
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
      },
      socialButtons: {
        display: "flex",
        gap: "1rem",
        justifyContent: "center",
        marginBottom: "1.5rem",
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
      },
      rightPanel: {
        display: "flex",
        background: "linear-gradient(to bottom right, #6366f1, #8b5cf6)",
        padding: "3rem",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      },
      rightPanelContent: {
        maxWidth: "42rem",
        textAlign: "center",
        position: "relative",
        zIndex: 10,
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
    }),
    [darkMode]
  );

  return (
    <div style={{ ...styles.container, ...(isLargeScreen && { gridTemplateColumns: "repeat(2, 1fr)" }) }}>
      <div style={styles.leftPanel}>
        <div style={styles.formContainer}>
          <div style={styles.header}>
            <div style={styles.logo}>
              <BookOpenIcon />
              <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                Get Started
              </span>
            </div>
            <h1 style={styles.title}>Create New Account</h1>
            <p style={styles.subtitle}>Start your free trial today</p>
          </div>

          {error && (
            <div style={styles.errorContainer}>
              <AlertCircleIcon />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            {signupMode === "password" ? (
              <>
                <div style={styles.inputGroup}>
                  <label htmlFor="name" style={styles.label}>Full Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    style={styles.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

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
                  />
                </div>

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
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label htmlFor="confirmPassword" style={styles.label}>
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    style={styles.input}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div style={styles.inputGroup}>
                  <label htmlFor="phone" style={styles.label}>Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    style={styles.input}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label htmlFor="otp" style={styles.label}>OTP Code</label>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      style={{
                        ...styles.registerLink,
                        cursor: phoneNumber && !otpLoading && otpCountdown === 0 ? 'pointer' : 'not-allowed',
                        opacity: phoneNumber && !otpLoading && otpCountdown === 0 ? 1 : 0.6
                      }}
                      disabled={!phoneNumber || otpLoading || otpCountdown > 0}
                    >
                      {otpLoading ? 'Sending...' : otpCountdown > 0 ? `Resend in ${otpCountdown}s` : 'Send OTP'}
                    </button>
                  </div>
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    placeholder="123456"
                    style={styles.input}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                  />
                </div>
              </>
            )}

            <button
              type="button"
              onClick={() => setSignupMode(prev => prev === "password" ? "otp" : "password")}
              style={{
                background: "none",
                border: "none",
                color: darkMode ? "#a5b4fc" : "#6366f1",
                cursor: "pointer",
                margin: "1rem 0",
              }}
            >
              {signupMode === "password"
                ? "Use Phone Number instead?"
                : "Use Email instead?"}
            </button>

            {signupMode === "password" && (
              <div style={styles.checkboxContainer}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    style={styles.checkbox}
                    required
                  />
                  <span style={styles.rememberMeText}>
                    I agree to the Terms of Service and Privacy Policy
                  </span>
                </label>
              </div>
            )}

            <button
              type="submit"
              style={{
                ...styles.submitButton,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>Or continue with</span>
            <div style={styles.dividerLine} />
          </div>

          <div style={styles.socialButtons}>
            <GoogleLogin
              onSuccess={credentialResponse => {
                googleSignup(credentialResponse.credential)
                  .then(() => navigate("/dashboard"))
                  .catch(err => setError(err.message));
              }}
              onError={() => setError("Google signup failed")}
              theme={darkMode ? "filled_black" : "outline"}
            />
          </div>

          <p style={styles.registerText}>
            Already have an account?{" "}
            <a href="/auth/login" style={styles.registerLink}>Log in</a>
          </p>
        </div>
      </div>

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

export default Register;