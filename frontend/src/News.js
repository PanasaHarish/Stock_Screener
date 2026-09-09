import { useEffect, useState } from "react";
import axios from "axios";

function News() {
  const [news, setNews] = useState([]);
  const [filter, setFilter] = useState("latest");

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/news?filter=${filter}`)
      .then(res => setNews(res.data));
  }, [filter]);

  return (
    <div className="container">
      <h1>Market News</h1>
      <p style={{ color: "#94a3b8" }}>
        Live Indian stock market news (Moneycontrol & ET)
      </p>

      {/* ===== FILTER BUTTONS ===== */}
      <div style={{ marginBottom: 20 }}>
        {["latest", "today", "week"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              marginRight: 10,
              padding: "8px 14px",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              background: filter === f ? "#22c55e" : "#334155",
              color: "white"
            }}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ===== NEWS LIST ===== */}
      {news.map((n, i) => (
        <div
          key={i}
          className="card"
          style={{ marginBottom: 14 }}
        >
          <h3 style={{ marginBottom: 6 }}>{n.title}</h3>
          <p style={{ fontSize: 13, color: "#94a3b8" }}>
            {n.source} • {n.published}
          </p>
          <a
            href={n.link}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#38bdf8", fontSize: 14 }}
          >
            Read full article →
          </a>
        </div>
      ))}

      {/* ===== MARKET VIDEOS ===== */}
      <h2 style={{ marginTop: 30 }}>Market Videos</h2>

      <div className="cards">
        <div className="card">
          <h4>CNBC TV18 Live</h4>
          <a
            href="https://www.youtube.com/@CNBCTV18India"
            target="_blank"
            rel="noreferrer"
          >
            Open YouTube →
          </a>
        </div>

        <div className="card">
          <h4>Moneycontrol</h4>
          <a
            href="https://www.youtube.com/@moneycontrol"
            target="_blank"
            rel="noreferrer"
          >
            Open YouTube →
          </a>
        </div>

        <div className="card">
          <h4>ET Now</h4>
          <a
            href="https://www.youtube.com/@ETNow"
            target="_blank"
            rel="noreferrer"
          >
            Open YouTube →
          </a>
        </div>
      </div>
    </div>
  );
}

export default News;
