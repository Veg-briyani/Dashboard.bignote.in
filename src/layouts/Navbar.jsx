import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import NotificationBell from "../components/NotificationBell";
import getGreetingMessage from "../utils/greetingHandler";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get first name if full name is available
  const firstName = user?.name ? user.name.split(" ")[0] : "User";
  const greetingMessage = getGreetingMessage(firstName);

  // Handle clicking outside of dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      // Redirect handled by auth context
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav
      className={`layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center ${
        darkMode ? "bg-dark-navbar text-white" : "bg-navbar-theme"
      }`}
      id="layout-navbar"
    >
      {/* Mobile Menu Toggle */}
      <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
        <a
          aria-label="toggle sidebar"
          className="nav-item nav-link px-0 me-xl-4"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            // Implement your mobile menu toggle logic here if needed
          }}
        >
          <i className="bx bx-menu bx-sm"></i>
        </a>
      </div>

      {/* Main Navbar Content */}
      <div
        className={`navbar-nav-right d-flex align-items-center ${
          darkMode ? "text-white" : ""
        }`}
        id="navbar-collapse"
      >
        {/* Greeting Section */}
        <div className="d-flex align-items-center me-auto">
          {greetingMessage}
        </div>

        {/* Right-aligned items */}
        <ul className="navbar-nav flex-row align-items-center ms-auto">
          {/* Notification Bell */}
          <li className="nav-item me-3">
            <div className="nav-link position-relative">
              <NotificationBell />
            </div>
          </li>

          {/* User Dropdown */}
          <li
            className="nav-item navbar-dropdown dropdown-user dropdown"
            ref={dropdownRef}
          >
            <a
              aria-label="User profile"
              className="nav-link dropdown-toggle hide-arrow"
              href="/Details"
              onClick={(e) => {
                e.preventDefault();
                setIsDropdownOpen(!isDropdownOpen);
              }}
              aria-expanded={isDropdownOpen}
            >
              <div className="avatar">
                <img
                  src={
                    user?.profile?.profilePhoto || "../assets/img/avatars/1.png"
                  }
                  className="rounded-circle"
                  style={{
                    maxWidth: "40px",
                    width: "40px",
                    height: "40px",
                    objectFit: "cover",
                  }}
                  alt="User avatar"
                />
              </div>
            </a>
            <ul
              className={`dropdown-menu dropdown-menu-end ${
                darkMode ? "dropdown-menu-dark" : ""
              } ${isDropdownOpen ? "show" : ""}`}
              style={{
                position: "absolute",
                inset: "0px 0px auto auto",
                margin: "0px",
                transform: "translate3d(0px, 40px, 0px)",
              }}
            >
              <li>
                <div className="dropdown-item">
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <div className="avatar">
                        <img
                          src={
                            user?.profile?.profilePhoto ||
                            "../assets/img/avatars/1.png"
                          }
                          className="rounded-circle"
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                          }}
                          alt="User avatar"
                        />
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <span className="fw-medium d-block">
                        {user?.name || "User"}
                      </span>
                      <small className="text-muted">
                        {user?.role || "Author"}
                      </small>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="dropdown-divider"></div>
              </li>
              <li>
                <Link
                  className="dropdown-item"
                  to="/Details"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <i className="bx bx-user me-2"></i>
                  <span className="align-middle">My Profile</span>
                </Link>
              </li>
              <li>
                <Link
                  className="dropdown-item"
                  to="/books"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <i className="bx bx-book-content me-2"></i>
                  <span className="align-middle">My Books</span>
                </Link>
              </li>
              <li>
                <Link
                  className="dropdown-item"
                  to="/payout-request"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <i className="bx bx-money me-2"></i>
                  <span className="align-middle">Payouts</span>
                </Link>
              </li>
              {user?.role === "admin" && (
                <li>
                  <Link
                    className="dropdown-item"
                    to="/admin"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <i className="bx bx-shield me-2"></i>
                    <span className="align-middle">Admin Panel</span>
                  </Link>
                </li>
              )}
              <li>
                <div className="dropdown-divider"></div>
              </li>
              <li>
                <a className="dropdown-item" href="#" onClick={handleLogout}>
                  <i className="bx bx-power-off me-2"></i>
                  <span className="align-middle">Log Out</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;