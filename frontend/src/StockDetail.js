import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import SearchBar from "./components/SearchBar";

// Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

import "chartjs-adapter-luxon";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function StockDetail() {
  const { symbol } = useParams();
  const navigate = useNavigate();

  const [interval, setInterval] = useState("1M");
  const [summary, setSummary] = useState(null);
  const [lineData, setLineData] = useState(null);

  // ✅ Exchange toggle
  const [exchange, setExchange] = useState("NSE");

  // Risk tooltip
  const [showRiskInfo, setShowRiskInfo] = useState(false);
  const riskRef = useRef(null);

  /* ================= FETCH SUMMARY ================= */
  useEffect(() => {
    axios
      .get(
        `http://127.0.0.1:8000/stock/${symbol}?exchange=${exchange}`
      )
      .then(res => setSummary(res.data));
  }, [symbol, exchange]);

  /* ================= FETCH CHART ================= */
  useEffect(() => {
    axios
      .get(
        `http://127.0.0.1:8000/stock/${symbol}/chart?interval=${interval}&exchange=${exchange}`
      )
      .then(res => setLineData(res.data));
  }, [symbol, interval, exchange]);

  /* ================= CLOSE TOOLTIP ON OUTSIDE CLICK ================= */
  useEffect(() => {
    const handler = e => {
      if (riskRef.current && !riskRef.current.contains(e.target)) {
        setShowRiskInfo(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!summary || !lineData) {
    return <p style={{ padding: 20 }}>Loading...</p>;
  }

  /* ================= SIGNAL ================= */
  const changePercent =
    ((summary.close - summary.open) / summary.open) * 100;

  let signal = "HOLD";
  let signalColor = "#eab308";

  if (changePercent > 0.5) {
    signal = "BUY";
    signalColor = "#22c55e";
  } else if (changePercent < -0.5) {
    signal = "SELL";
    signalColor = "#ef4444";
  }

  /* ================= RISK ================= */
  const volatility =
    ((summary.high - summary.low) / summary.open) * 100;

  let risk = "LOW";
  let riskColor = "#22c55e";

  if (volatility > 2) {
    risk = "HIGH";
    riskColor = "#ef4444";
  } else if (volatility > 1) {
    risk = "MEDIUM";
    riskColor = "#eab308";
  }

  /* ================= CHART ================= */
  const lineChartData = {
    labels: lineData.labels,
    datasets: [
      {
        data: lineData.prices,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.15)",
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    interaction: { mode: "index", intersect: false },
    plugins: {
      tooltip: {
        backgroundColor: "#020617",
        titleColor: "#e5e7eb",
        bodyColor: "#e5e7eb",
        displayColors: false,
        callbacks: {
          label: ctx => `₹${ctx.parsed.y}`
        }
      },
      legend: { display: false }
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: false }
    }
  };

  return (
    <div className="container">

      {/* ===== TOP BAR ===== */}
      <div className="top-bar">
        <button onClick={() => navigate(-1)}>⬅ Back</button>
        <SearchBar />
      </div>

      {/* ===== SYMBOL + EXCHANGE ===== */}
      <div className="symbol-row">
        <h1>{symbol}</h1>

        <div className="exchange-toggle">
          {["NSE", "BSE"].map(ex => (
            <button
              key={ex}
              className={exchange === ex ? "active" : ""}
              onClick={() => setExchange(ex)}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* ===== PRICE ===== */}
      <div style={{ marginBottom: 10 }}>
        <span style={{ fontSize: 28, fontWeight: 700 }}>
          ₹{summary.close}
        </span>{" "}
        <span
          style={{
            color: changePercent >= 0 ? "#22c55e" : "#ef4444",
            fontWeight: 600
          }}
        >
          {changePercent >= 0 ? "+" : ""}
          {changePercent.toFixed(2)}%
        </span>{" "}
        <span style={{ color: "#94a3b8" }}>{interval}</span>
      </div>

      {/* ===== INTERVAL ===== */}
      <div style={{ marginBottom: 16 }}>
        {["1D", "1W", "1M", "3M"].map(i => (
          <button
            key={i}
            onClick={() => setInterval(i)}
            style={{
              marginRight: 8,
              padding: "6px 12px",
              borderRadius: 6,
              border: "none",
              background: interval === i ? "#22c55e" : "#334155",
              color: "white",
              cursor: "pointer"
            }}
          >
            {i}
          </button>
        ))}
      </div>

      {/* ===== SUMMARY ===== */}
      <div className="summary-card">
        <div className="summary-item">
          <span className="label">Open</span>
          <span className="value">{summary.open}</span>
        </div>
        <div className="summary-item">
          <span className="label">High</span>
          <span className="value high">{summary.high}</span>
        </div>
        <div className="summary-item">
          <span className="label">Low</span>
          <span className="value low">{summary.low}</span>
        </div>
        <div className="summary-item">
          <span className="label">Close</span>
          <span className="value">{summary.close}</span>
        </div>
        <div className="summary-item">
          <span className="label">Volume</span>
          <span className="value">{summary.volume}</span>
        </div>
      </div>

      {/* ===== SIGNAL + RISK ===== */}
      <div
        className="card"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16
        }}
      >
        <div>
          <span style={{ color: "#94a3b8", fontSize: 13 }}>Signal</span>
          <div style={{ fontSize: 18, fontWeight: 700, color: signalColor }}>
            {signal}
          </div>
        </div>

        <div ref={riskRef} style={{ position: "relative", textAlign: "right" }}>
          <span style={{ color: "#94a3b8", fontSize: 13 }}>Risk</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: riskColor }}>
              {risk}
            </span>
            <span
              onClick={() => setShowRiskInfo(v => !v)}
              style={{ cursor: "pointer" }}
            >
              ℹ️
            </span>
          </div>

          {showRiskInfo && (
            <div
              style={{
                position: "absolute",
                top: 30,
                right: 0,
                width: 260,
                background: "#020617",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                padding: 10,
                fontSize: 13,
                color: "#e5e7eb",
                zIndex: 10
              }}
            >
              <strong>Risk Explanation</strong>
              <p style={{ margin: "6px 0 0", color: "#94a3b8" }}>
                Risk is based on recent price volatility. Higher volatility
                implies larger price swings and increased short-term risk.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ===== PRICE TREND ===== */}
      <div className="card">
        <h3>Price Trend</h3>
        <Line data={lineChartData} options={lineChartOptions} />
      </div>
    </div>
  );
}

export default StockDetail;
