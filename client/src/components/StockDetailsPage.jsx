import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { userStore } from "../store/userStore";
import { Button } from "antd";
import axios from "axios";

export const StockDetailsPage = observer(() => {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userStore.user) {
      navigate("/");
      return;
    }
    fetchStockDetails();
  }, []);

  const fetchStockDetails = async () => {
    const res = await axios.get(
      `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${
        import.meta.env.VITE_FMP_API_KEY
      }`
    );
    setStockData(res.data[0]);
  };

  const handleLogout = () => {
    userStore.logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="p-4 flex justify-between items-center bg-white shadow">
        <h2 className="text-xl">Stock Details: {symbol}</h2>
        <Button type="primary" danger onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="flex justify-center items-center flex-1">
        {stockData ? (
          <div className="bg-white p-10 rounded-xl shadow-md w-96 text-center">
            <h1 className="text-2xl font-bold mb-4">{stockData.name}</h1>
            <p>Symbol: {stockData.symbol}</p>
            <p>Latest Price: ${stockData.price}</p>
            <p>Change: {stockData.change}%</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
});
