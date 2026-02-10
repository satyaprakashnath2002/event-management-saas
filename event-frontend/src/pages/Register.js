import React, { useState } from "react";
import AuthService from "../services/AuthService";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await AuthService.register({
        name: user.name,
        email: user.email,
        password: user.password,
      });

      alert(response.data.message || "Registration successful!");
      navigate("/login");
    } catch (err) {
      console.error("API error:", err.response || err);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="card shadow-lg p-4 border-0" style={{ width: "100%", maxWidth: "450px", borderRadius: "20px" }}>
        <h3 className="text-center mb-4 fw-bold">Create Account</h3>

        {error && <div className="alert alert-danger p-2 small text-center">{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label small fw-bold">Full Name</label>
            <input type="text" name="name" className="form-control rounded-pill" required placeholder="John Doe" onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">Email Address</label>
            <input type="email" name="email" className="form-control rounded-pill" required placeholder="name@example.com" onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">Password</label>
            <input type="password" name="password" className="form-control rounded-pill" required placeholder="Min 6 characters" onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">Confirm Password</label>
            <input type="password" name="confirmPassword" className="form-control rounded-pill" required placeholder="Re-type password" onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-info w-100 fw-bold text-white rounded-pill mb-3 py-2">
            Sign Up
          </button>

          <p className="text-center small text-muted">
            Already have an account? <Link to="/login" className="text-info text-decoration-none fw-bold">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
