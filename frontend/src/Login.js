import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // ✅ DEMO credentials (frontend-only)
    if (email === "harish@gmail.com" && password === "harish123") {
      localStorage.setItem("loggedIn", "true");
      setIsLoggedIn(true);
      navigate("/");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #020617, #020617)"
      }}
    >
      <div
        style={{
          width: 360,
          padding: 30,
          borderRadius: 12,
          background: "#0f172a",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
        }}
      >
        <h2 style={{ color: "white", marginBottom: 6 }}>
          Smart Screener
        </h2>
        <p style={{ color: "#94a3b8", marginBottom: 20 }}>
          Login to your account
        </p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ color: "#cbd5f5", fontSize: 14 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ color: "#cbd5f5", fontSize: 14 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 8,
              border: "none",
              background: "#22c55e",
              color: "#022c22",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: 6,
  borderRadius: 8,
  border: "1px solid #334155",
  background: "#020617",
  color: "white",
  outline: "none"
};

export default Login;
