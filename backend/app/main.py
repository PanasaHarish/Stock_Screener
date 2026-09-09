from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import feedparser
from datetime import datetime, timedelta

app = FastAPI()

# ================== CORS ==================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================== ROOT ==================
@app.get("/")
def root():
    return {"status": "Smart Screener Backend Running"}

# ================== INDICES ==================
@app.get("/indices")
def get_indices():
    indices = {
        "NIFTY 50": "^NSEI",
        "SENSEX": "^BSESN",
        "BANK NIFTY": "^NSEBANK",
        "NIFTY IT": "^CNXIT",
        "NIFTY FMCG": "^CNXFMCG",
        "NIFTY AUTO": "^CNXAUTO",
        "NIFTY PHARMA": "^CNXPHARMA",
        "NIFTY METAL": "^CNXMETAL",
        "NIFTY FIN SERVICE": "^CNXFIN"
    }

    result = {}
    for name, symbol in indices.items():
        data = yf.Ticker(symbol).history(period="1d")
        if data.empty:
            continue

        last = data.iloc[-1]
        change = last["Close"] - last["Open"]
        percent = (change / last["Open"]) * 100

        result[name] = {
            "price": round(last["Close"], 2),
            "change": round(change, 2),
            "percent": round(percent, 2),
            "trend": "Bullish" if change > 0 else "Bearish"
        }

    return result

# ================== BULLISH ==================
@app.get("/bullish")
def bullish_stocks():
    symbols = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK"]
    result = []

    for sym in symbols:
        data = yf.Ticker(sym + ".NS").history(period="1d")
        if data.empty:
            continue

        last = data.iloc[-1]
        change = last["Close"] - last["Open"]
        percent = (change / last["Open"]) * 100

        if change > 0:
            result.append({
                "symbol": sym,
                "price": round(last["Close"], 2),
                "change": round(change, 2),
                "percent": round(percent, 2)
            })

    return result

# ================== BEARISH ==================
@app.get("/bearish")
def bearish_stocks():
    symbols = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK"]
    result = []

    for sym in symbols:
        data = yf.Ticker(sym + ".NS").history(period="1d")
        if data.empty:
            continue

        last = data.iloc[-1]
        change = last["Close"] - last["Open"]
        percent = (change / last["Open"]) * 100

        if change < 0:
            result.append({
                "symbol": sym,
                "price": round(last["Close"], 2),
                "change": round(change, 2),
                "percent": round(percent, 2)
            })

    return result

# ================== STOCK DETAIL ==================
@app.get("/stock/{symbol}")
def stock_detail(symbol: str, exchange: str = "NSE"):
    index_map = {
        "NIFTY50": "^NSEI",
        "SENSEX": "^BSESN",
        "BANKNIFTY": "^NSEBANK",
        "NIFTYIT": "^CNXIT",
        "NIFTYFMCG": "^CNXFMCG",
        "NIFTYAUTO": "^CNXAUTO",
        "NIFTYPHARMA": "^CNXPHARMA",
        "NIFTYMETAL": "^CNXMETAL",
        "NIFTYFIN": "^CNXFIN"
    }

    if symbol in index_map:
        ticker = index_map[symbol]
    else:
        ticker = symbol + (".NS" if exchange == "NSE" else ".BO")

    hist = yf.Ticker(ticker).history(period="1d")
    if hist.empty:
        return {"error": "No data found"}

    last = hist.iloc[-1]

    return {
        "symbol": symbol,
        "exchange": exchange,
        "open": round(last["Open"], 2),
        "high": round(last["High"], 2),
        "low": round(last["Low"], 2),
        "close": round(last["Close"], 2),
        "volume": int(last["Volume"]) if "Volume" in last else 0
    }

# ================== CHART ==================
@app.get("/stock/{symbol}/chart")
def stock_chart(symbol: str, interval: str = "1M", exchange: str = "NSE"):
    index_map = {
        "NIFTY50": "^NSEI",
        "SENSEX": "^BSESN",
        "BANKNIFTY": "^NSEBANK",
        "NIFTYIT": "^CNXIT",
        "NIFTYFMCG": "^CNXFMCG",
        "NIFTYAUTO": "^CNXAUTO",
        "NIFTYPHARMA": "^CNXPHARMA",
        "NIFTYMETAL": "^CNXMETAL",
        "NIFTYFIN": "^CNXFIN"
    }

    if symbol in index_map:
        ticker = index_map[symbol]
    else:
        ticker = symbol + (".NS" if exchange == "NSE" else ".BO")

    if interval == "1D":
        hist = yf.Ticker(ticker).history(period="1d", interval="5m")
        return {
            "labels": hist.index.strftime("%H:%M").tolist(),
            "prices": hist["Close"].round(2).tolist()
        }

    period_map = {"1W": "5d", "1M": "1mo", "3M": "3mo"}
    hist = yf.Ticker(ticker).history(period=period_map.get(interval, "1mo"))

    return {
        "labels": hist.index.strftime("%Y-%m-%d").tolist(),
        "prices": hist["Close"].round(2).tolist()
    }

# ================== MARKET NEWS ==================
@app.get("/news")
def market_news(filter: str = "latest"):
    feeds = [
        {
            "source": "Moneycontrol",
            "url": "https://www.moneycontrol.com/rss/marketreports.xml"
        },
        {
            "source": "Economic Times",
            "url": "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms"
        }
    ]

    news = []
    now = datetime.utcnow()

    for feed in feeds:
        parsed = feedparser.parse(feed["url"])

        for entry in parsed.entries[:15]:
            published = None
            if hasattr(entry, "published_parsed"):
                published = datetime(*entry.published_parsed[:6])

            if filter == "today" and published:
                if published.date() != now.date():
                    continue

            if filter == "week" and published:
                if published < now - timedelta(days=7):
                    continue

            news.append({
                "title": entry.title,
                "link": entry.link,
                "source": feed["source"],
                "published": published.strftime("%d %b %Y, %I:%M %p") if published else "N/A"
            })

    return news
