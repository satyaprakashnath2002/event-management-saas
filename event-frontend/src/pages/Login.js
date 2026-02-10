import React, { useState } from "react";
import AuthService from "../services/AuthService";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await AuthService.login(user);
      alert("Login successful!");
      navigate("/dashboard"); // change to your dashboard route
    } catch (err) {
      console.error("API error:", err.response || err);
      setError(err.response?.data || "Invalid email or password");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="card shadow-lg p-4 border-0" style={{ width: "100%", maxWidth: "450px", borderRadius: "20px" }}>
        <h3 className="text-center mb-4 fw-bold">Login</h3>

        {error && <div className="alert alert-danger p-2 small text-center">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label small fw-bold">Email Address</label>
            <input type="email" name="email" className="form-control rounded-pill" required placeholder="name@example.com" onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">Password</label>
            <input type="password" name="password" className="form-control rounded-pill" required placeholder="Your password" onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-info w-100 fw-bold text-white rounded-pill mb-3 py-2">
            Login
          </button>

          <p className="text-center small text-muted">
            Don't have an account? <Link to="/register" className="text-info text-decoration-none fw-bold">Sign Up here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
