import { useState } from "react";

function Resources() {
  const [lang, setLang] = useState("EN");

  const content = {
    EN: {
      title: "Stock Market Learning Resources",
      intro:
        "This page is designed for beginners to clearly understand the stock market, how investing works, and where to learn safely.",

      marketIntro:
        "Before investing money, it is very important to understand what the stock market is and how it works in simple terms.",

      market: {
        title: "What is the Stock Market?",
        points: [
          "The stock market is a platform where company shares are bought and sold.",
          "Buying a share means you own a small part of that company.",
          "Companies raise money from the public by selling shares.",
          "Investors earn money through price growth and dividends."
        ]
      },

      investIntro:
        "Once you understand the basics of the stock market, the next step is learning how to start investing safely.",

      invest: {
        title: "How to Start Investing?",
        points: [
          "Open a Demat account and Trading account with a registered broker.",
          "Start with long-term investing instead of daily trading.",
          "Invest only in companies you understand.",
          "Never invest money you cannot afford to lose."
        ]
      }
    },

    TE: {
      title: "స్టాక్ మార్కెట్ నేర్చుకునే వనరులు",
      intro:
        "స్టాక్ మార్కెట్‌ను సులభంగా అర్థం చేసుకుని సురక్షితంగా పెట్టుబడి పెట్టేందుకు ఈ పేజీ ఉపయోగపడుతుంది.",

      marketIntro:
        "డబ్బు పెట్టుబడి పెట్టే ముందు స్టాక్ మార్కెట్ ఎలా పనిచేస్తుందో అర్థం చేసుకోవడం చాలా ముఖ్యం.",

      market: {
        title: "స్టాక్ మార్కెట్ అంటే ఏమిటి?",
        points: [
          "స్టాక్ మార్కెట్ అనేది కంపెనీ షేర్లను కొనుగోలు & అమ్మే స్థలం.",
          "ఒక షేర్ కొనుగోలు చేస్తే, మీరు ఆ కంపెనీలో భాగస్వామి అవుతారు.",
          "కంపెనీలు ప్రజల నుండి డబ్బు సమీకరించేందుకు షేర్లు విక్రయిస్తాయి.",
          "లాభాలు షేర్ ధర పెరగడం లేదా డివిడెండ్స్ ద్వారా వస్తాయి."
        ]
      },

      investIntro:
        "స్టాక్ మార్కెట్ ప్రాథమికాలు అర్థమయ్యాక పెట్టుబడి ఎలా ప్రారంభించాలో తెలుసుకోవాలి.",

      invest: {
        title: "స్టాక్‌లలో పెట్టుబడి ఎలా ప్రారంభించాలి?",
        points: [
          "మొదట డీమ్యాట్ & ట్రేడింగ్ ఖాతా తెరవాలి.",
          "డే ట్రేడింగ్ కాకుండా దీర్ఘకాల పెట్టుబడులతో మొదలుపెట్టాలి.",
          "మీకు అర్థమయ్యే కంపెనీల్లోనే పెట్టుబడి పెట్టాలి.",
          "నష్టపోయినా భరించగలిగే డబ్బుతో మాత్రమే పెట్టుబడి పెట్టాలి."
        ]
      }
    }
  };

  return (
    <div className="container">
      {/* ===== HEADER ===== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20
        }}
      >
        <h1>{content[lang].title}</h1>

        {/* LANGUAGE SWITCH */}
        <div>
          <button
            onClick={() => setLang("EN")}
            style={{
              marginRight: 8,
              padding: "6px 12px",
              borderRadius: 6,
              border: "none",
              background: lang === "EN" ? "#22c55e" : "#334155",
              color: "white"
            }}
          >
            English
          </button>
          <button
            onClick={() => setLang("TE")}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "none",
              background: lang === "TE" ? "#22c55e" : "#334155",
              color: "white"
            }}
          >
            తెలుగు
          </button>
        </div>
      </div>

      <p style={{ color: "#94a3b8", marginBottom: 24 }}>
        {content[lang].intro}
      </p>

      {/* ===== WHAT IS STOCK MARKET ===== */}
      <div className="card" style={{ marginBottom: 20 }}>
        <p style={{ color: "#94a3b8" }}>{content[lang].marketIntro}</p>

        <h3>{content[lang].market.title}</h3>
        <ul>
          {content[lang].market.points.map((p, i) => (
            <li key={i} style={{ marginBottom: 6, color: "#cbd5f5" }}>
              {p}
            </li>
          ))}
        </ul>

        <h4 style={{ marginTop: 12 }}>YouTube (Beginner Friendly)</h4>
        <ul>
          <li>
            <a
              href="https://www.youtube.com/@ZerodhaVarsity"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#38bdf8" }}
            >
              Zerodha Varsity – Stock Market Basics (English)
            </a>
          </li>
          <li>
            <a
              href="https://www.youtube.com/@DayTraderTelugu"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#38bdf8" }}
            >
              Day Trader Telugu – Stock Market Basics (Telugu)
            </a>
          </li>
        </ul>
      </div>

      {/* ===== HOW TO START INVESTING ===== */}
      <div className="card" style={{ marginBottom: 30 }}>
        <p style={{ color: "#94a3b8" }}>{content[lang].investIntro}</p>

        <h3>{content[lang].invest.title}</h3>
        <ul>
          {content[lang].invest.points.map((p, i) => (
            <li key={i} style={{ marginBottom: 6, color: "#cbd5f5" }}>
              {p}
            </li>
          ))}
        </ul>

        <h4 style={{ marginTop: 12 }}>YouTube (Step-by-Step)</h4>
        <ul>
          <li>
            <a
              href="https://www.youtube.com/@ZerodhaVarsity"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#38bdf8" }}
            >
              How to Start Investing in India (English)
            </a>
          </li>
          <li>
            <a
              href="https://www.youtube.com/@TradingChanakya"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#38bdf8" }}
            >
              Trading Chanakya – Investing Guide (Telugu)
            </a>
          </li>
        </ul>
      </div>

      {/* ===== OFFICIAL LINKS ===== */}
      <h2>Official Links</h2>
      <div className="cards">
        <ResourceCard title="NSE (Official)" link="https://www.nseindia.com" />
        <ResourceCard title="BSE (Official)" link="https://www.bseindia.com" />
        <ResourceCard
          title="SEBI Investor Education"
          link="https://investor.sebi.gov.in"
        />
      </div>

      {/* ===== LEARNING LINKS ===== */}
      <h2 style={{ marginTop: 30 }}>Learning & Tools</h2>
      <div className="cards">
        <ResourceCard
          title="Zerodha Varsity"
          link="https://zerodha.com/varsity"
        />
        <ResourceCard
          title="TradingView India"
          link="https://in.tradingview.com"
        />
      </div>
    </div>
  );
}

function ResourceCard({ title, link }) {
  return (
    <div className="card">
      <h4>{title}</h4>
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        style={{ color: "#38bdf8" }}
      >
        Open →
      </a>
    </div>
  );
}

export default Resources;
