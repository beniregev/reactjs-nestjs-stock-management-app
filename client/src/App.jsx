import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage } from "./components/LoginPage";
import { PortfolioPage } from "./components/PortfolioPage";
import { StockDetailsPage } from "./components/StockDetailsPage";
import "./App.css";

export function App() {
  return (
    <>
      <h3 className="bg-indigo-600 text-white p-3 rounded-3xl">
        React + Nest + MongoDB Stocks Management
      </h3>
      <Router className="rounded-2xl">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/details/:symbol" element={<StockDetailsPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
