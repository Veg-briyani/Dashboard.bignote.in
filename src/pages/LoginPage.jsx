import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { authAPI } from '../services/api';

const LoginPage = () => {
  const { login } = useAuth();

  const handleLogin = async (formData) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);
      const { token, user } = response.data;
      
      localStorage.setItem("token", token);
      // Pass the entire user object to login
      login(user);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.login(formData);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="authentication-wrapper authentication-basic container-p-y">
      <div className="authentication-inner">
        <div className="card">
          <div className="card-body">
            <h4 className="mb-2">Welcome to Dashboard! 👋</h4>
            <p className="mb-4">Please sign-in to your account</p>

            {error && <div className="alert alert-danger">{error}</div>}

            <form className="mb-3" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary d-grid w-100">
                Sign in
              </button>
            </form>

            <p className="text-center">
              <span>New on our platform?</span>
              <a href="/register">
                <span>Create an account</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;