import { useTheme } from "../contexts/ThemeContext";
// ... other imports

function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <nav className="navbar">
      {/* ... existing navbar content ... */}
      <button
        className="btn btn-icon btn-secondary ms-2"
        onClick={toggleDarkMode}
      >
        {darkMode ? (
          <i className="bx bx-sun"></i>
        ) : (
          <i className="bx bx-moon"></i>
        )}
      </button>
      {/* ... existing navbar content ... */}
    </nav>
  );
}
