import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const testConnection = async () => {
      try {
        setIsConnected(true);
      } catch (error) {
        console.error("Connection test:", error);
        if (error.code === "ERR_NETWORK") {
          setError("Cannot connect to server");
        }
      }
    };
    testConnection();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isConnected) {
      setError("Server connection failed");
      return;
    }

    try {
      const userRole = await login(email, password);
      if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="authentication-wrapper authentication-basic">
      <div className="authentication-inner py-4">
        <div className="card">
          <div className="card-body">
            <h4 className="mb-2">Welcome to dashbaord! 👋</h4>
            <p className="mb-4">Please sign-in to your account</p>
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary d-grid w-100"
                disabled={!isConnected}
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
