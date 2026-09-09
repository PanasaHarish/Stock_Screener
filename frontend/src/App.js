import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

import StockDetail from "./StockDetail";
import SearchBar from "./components/SearchBar";
import News from "./News";
import Resources from "./Resources";
import Login from "./Login";

const indexSymbolMap = {
  "NIFTY 50": "NIFTY50",
  SENSEX: "SENSEX",
  "BANK NIFTY": "BANKNIFTY",
  "NIFTY IT": "NIFTYIT",
  "NIFTY FMCG": "NIFTYFMCG",
  "NIFTY AUTO": "NIFTYAUTO",
  "NIFTY PHARMA": "NIFTYPHARMA",
  "NIFTY METAL": "NIFTYMETAL",
  "NIFTY FIN SERVICE": "NIFTYFIN"
};

function App() {
  const [indices, setIndices] = useState({});
  const [bullish, setBullish] = useState([]);
  const [bearish, setBearish] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );

  const navigate = useNavigate();

  // ================= FETCH HOME DATA =================
  useEffect(() => {
    if (!isLoggedIn) return;

    axios.get("http://127.0.0.1:8000/indices").then(res => setIndices(res.data));
    axios.get("http://127.0.0.1:8000/bullish").then(res => setBullish(res.data));
    axios.get("http://127.0.0.1:8000/bearish").then(res => setBearish(res.data));
  }, [isLoggedIn]);

  // ================= SEARCH =================
  const handleSearch = value => {
    if (!value) return;
    navigate(`/stock/${value.toUpperCase()}`);
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // ================= HOME =================
  const Home = () => (
    <div className="container">

      {/* ===== HEADER ===== */}
      <div className="header">
        <h1 style={{ margin: 0 }}>Smart Screener</h1>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

          {/* 🔐 LOGIN / LOGOUT */}
          {!isLoggedIn ? (
            <button
              onClick={() => navigate("/login")}
              style={buttonGreen}
            >
              🔐 Login
            </button>
          ) : (
            <button
              onClick={handleLogout}
              style={buttonRed}
            >
              🚪 Logout
            </button>
          )}

          <button onClick={() => navigate("/news")} style={buttonDark}>
            📰 News
          </button>

          <button onClick={() => navigate("/resources")} style={buttonDark}>
            📚 Resources
          </button>

          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* ===== MARKET INDICES ===== */}
      <div className="section">
        <h2>Market Indices</h2>
        <div className="cards">
          {Object.entries(indices).map(([name, data]) => (
            <div
              key={name}
              className="card"
              onClick={() => navigate(`/stock/${indexSymbolMap[name]}`)}
              style={{ cursor: "pointer" }}
            >
              <h4>{name}</h4>
              <p>{data.price}</p>
              <p className={data.trend === "Bullish" ? "bullish" : "bearish"}>
                {data.change} ({data.percent}%)
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== BULLISH ===== */}
      <div className="section">
        <h2>Bullish Stocks</h2>
        <div className="cards">
          {bullish.map(s => (
            <div
              key={s.symbol}
              className="card"
              onClick={() => navigate(`/stock/${s.symbol}`)}
            >
              <h4>{s.symbol}</h4>
              <p>{s.price}</p>
              <p className="bullish">
                +{s.change} ({s.percent}%)
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== BEARISH ===== */}
      <div className="section">
        <h2>Bearish Stocks</h2>
        <div className="cards">
          {bearish.map(s => (
            <div
              key={s.symbol}
              className="card"
              onClick={() => navigate(`/stock/${s.symbol}`)}
            >
              <h4>{s.symbol}</h4>
              <p>{s.price}</p>
              <p className="bearish">
                {s.change} ({s.percent}%)
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );

  // ================= ROUTES =================
  return (
    <Routes>
      <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

      <Route
        path="/"
        element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
      />

      <Route
        path="/news"
        element={isLoggedIn ? <News /> : <Navigate to="/login" />}
      />

      <Route
        path="/resources"
        element={isLoggedIn ? <Resources /> : <Navigate to="/login" />}
      />

      <Route
        path="/stock/:symbol"
        element={isLoggedIn ? <StockDetail /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

// ===== BUTTON STYLES =====
const buttonDark = {
  padding: "10px 14px",
  borderRadius: 8,
  background: "#1e293b",
  color: "white",
  border: "1px solid rgba(255,255,255,0.15)",
  cursor: "pointer",
  fontWeight: 600
};

const buttonGreen = {
  padding: "10px 14px",
  borderRadius: 8,
  background: "#22c55e",
  color: "#022c22",
  border: "none",
  cursor: "pointer",
  fontWeight: 700
};

const buttonRed = {
  padding: "10px 14px",
  borderRadius: 8,
  background: "#ef4444",
  color: "white",
  border: "none",
  cursor: "pointer",
  fontWeight: 700
};

export default App;
