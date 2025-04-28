import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Button, message } from "antd";
import axios from "axios";
import portfolioStore from "../store/PortfolioStore";

export const StockDetailsPage = observer(() => {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!portfolioStore.getUserName() || !portfolioStore.getUserName().email) {
      navigate("/");
      return;
    }
    fetchStockDetails();
  }, [navigate]);

  const fetchStockDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${
          import.meta.env.VITE_FMP_API_KEY
        }`
      );
      if (res.data.length > 0) {
        setStockData(res.data[0]);
      } else {
        message.error("Stock not found");
        navigate("/portfolio");
      }
    } catch (error) {
      console.error("Error fetching stock details:", error);
      message.error("Failed to fetch stock details.");
      navigate("/portfolio");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    portfolioStore.logout();
    navigate("/");
  };

  const handleBack = () => {
    navigate("/portfolio");
  };

  const renderRow = (label, value) => (
    <div className="flex justify-between mb-2">
      <span className="font-bold text-black">{label}:</span>
      <span className="bg-blue-500 text-white px-2 py-1 rounded">{value}</span>
    </div>
  );

  return (
    <div
      id="stock-details-page"
      className="min-w-[450px] h-[510px] flex flex-col bg-gray-300"
    >
      <div className="p-4 flex justify-between items-center bg-white shadow rounded-2xl">
        <div>
          <Button onClick={handleBack} type="primary" className="mr-3">
            Back to Portfolio
          </Button>
        </div>
        <Button type="primary" danger onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div
        id="details-container"
        className="flex justify-center flex-1 p-2 mt-2"
      >
        {loading ? (
          <p>Loading...</p>
        ) : stockData ? (
          <div
            id="stock-details"
            className="bg-white p-5 rounded-xl shadow-md w-full max-w-lg"
          >
            {/* Line 1: Symbol, Name, Exchange */}
            <div className="flex flex-col mb-2">
              <h3 className="bg-blue-700 font-bold mb-2">
                <span>{stockData.symbol}</span> <span>({stockData.name})</span>
              </h3>
              <p className="bg-blue-400 font-bold text-black">
                Exchange: <span>{stockData.exchange}</span>
              </p>
            </div>

            {/* Line 2: Previous Close, Open */}
            {renderRow(
              "Previous Close",
              `$${stockData.previousClose.toFixed(2)}`
            )}
            {renderRow("Open", `$${stockData.open.toFixed(2)}`)}

            {/* Line 3: Quote Latest (Current Price) */}
            {renderRow("Price", `$${stockData.price.toFixed(2)}`)}

            {/* Line 4: Today's Change % */}
            {renderRow(
              "Today's Change %",
              `${stockData.changesPercentage.toFixed(2)}%`
            )}

            {/* Line 5: Day High, Day Low */}
            {renderRow(
              "Day High/Low",
              `$${stockData.dayHigh.toFixed(2)}` +
                ` / ` +
                `$${stockData.dayLow.toFixed(2)}`
            )}

            {/* Line 6: Year High, Year Low */}
            {renderRow(
              "Year High/Low",
              `$${stockData.yearHigh.toFixed(2)}` +
                ` / ` +
                `$${stockData.yearLow.toFixed(2)}`
            )}
          </div>
        ) : (
          <p>Stock data not available.</p>
        )}
      </div>
    </div>
  );
});
