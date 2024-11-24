import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  IconChevronDown,
  IconSend,
  IconDownload,
  IconShoppingCart,
  IconTrendingUp,
  IconHistory,
} from "@tabler/icons-react";
import axios from "axios";
import Btc from "../../images/hero/bitcoin.png";
import Eth from "../../images/hero/ethereum.png";

function Hero() {
  const [data, setData] = useState([]);
  const [coinsLoad, setCoinsLoad] = useState(true);
  const [totalAmount, setTotalAmount] = useState(null); // Updated: null to differentiate no user from 0 amount
  const [userMessage, setUserMessage] = useState(""); // State to show message if userId not found

  const marketUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=4&page=1&sparkline=false`;
  const apiBaseUrl = "https://crypto-ault.onrender.com/api/auth";

  function numberWithCommas(x) {
    if (x === null || x === undefined) {
      return "0"; // Default value or message
    }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await axios.get(marketUrl);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    };

    const fetchWalletTotal = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setUserMessage("Please sign up or log in to start using your wallet!");
          return;
        }
        const response = await axios.get(`${apiBaseUrl}/${userId}`);
        const userData = response.data;
        setTotalAmount(userData.send || 0.0);
      } catch (error) {
        console.error("Error fetching wallet total:", error);
        setUserMessage("Unable to fetch wallet details. Please try again later.");
      }
    };

    fetchMarketData();
    fetchWalletTotal();
  }, [marketUrl, apiBaseUrl]);

  return (
    <>
      <section id="home" className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-content__text" style={{ marginTop: "100px" }}>
              <img className="btc-float" src={Btc} alt="floating-el" />
              {userMessage ? (
                <h6 className="user-message">{userMessage}</h6>
              ) : (
                <h6>
                  <span>Main Wallet Total:</span>
                  <br />
                  <span className="wallet-total">
                    {numberWithCommas(totalAmount)}
                    <br />$
                  </span>
                  <span>Crypto currencies</span>
                </h6>
              )}
              <img className="eth-float" src={Eth} alt="floating-el" />
            </div>

            <a className="mobile-btn-hero" href="#market">
              See Prices <IconChevronDown />
            </a>

            <div onLoad={() => setCoinsLoad(false)} className="coin-slider">
              {coinsLoad && <span className="loader"></span>}
              {data.map((item) => (
                <Link
                  to={`/coin/${item.id}`}
                  key={item.id}
                  className="slider-coin"
                >
                  <img src={item?.image} alt={item?.name} />
                  <p className="slider-coin__name">
                    {item?.name}{" "}
                    <span
                      className={
                        "slider-coin__price " +
                        (item.price_change_percentage_24h <= 0
                          ? "red-text"
                          : "green-text")
                      }
                    >
                      {item?.price_change_percentage_24h?.toFixed(2) + "%"}
                    </span>
                  </p>
                  <p className="slider-coin__price">
                    {"$ " + numberWithCommas(item.current_price?.toFixed(2))}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* <div className="hero-actions">
            <div className="action">
              <IconSend size={40} />
              <p>Send</p>
            </div>
            <div className="action">
              <IconDownload size={40} />
              <p>Receive</p>
            </div>
            <div className="action">
              <IconShoppingCart size={40} />
              <p>Buy</p>
            </div>
            <div className="action">
              <IconTrendingUp size={40} />
              <p>Sell</p>
            </div>
            <div className="action">
              <IconHistory size={40} />
              <p>History</p>
            </div>
          </div> */}
        </div>
      </section>

      <style jsx>{`
        .wallet-total {
          font-size: 24px;
          font-weight: bold;
          color: #28a745;
        }
        .user-message {
          font-size: 18px;
          color: #ff5722;
          font-weight: 500;
          text-align: center;
        }
        .hero-content__text h6 {
          font-size: 18px;
          line-height: 1.5;
          color: #555;
          margin-bottom: 20px;
        }
        .hero-actions {
          display: flex;
          justify-content: space-around;
          margin-top: 30px;
        }
        .action {
          text-align: center;
        }
        .action p {
          margin-top: 10px;
          font-size: 14px;
          font-weight: 500;
        }
      `}</style>
    </>
  );
}

export default Hero;
