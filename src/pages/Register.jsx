import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "author",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending registration data:", formData);
      const response = await authAPI.register(formData);
      console.log("Registration response:", response);

      if (response.data) {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
        navigate("/auth/login");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="authentication-wrapper authentication-basic px-4">
      <div className="authentication-inner">
        <div className="card">
          <div className="card-body">
            <h4 className="mb-2">Adventure starts here 🚀</h4>
            <p className="mb-4">Make your app management easy and fun!</p>

            <form className="mb-3" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3 form-password-toggle">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <button className="btn btn-primary d-grid w-100" type="submit">
                Sign up
              </button>
            </form>

            <p className="text-center">
              <span>Already have an account? </span>
              <a href="/auth/login">
                <span>Sign in instead</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
