import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage } from "./components/LoginPage";
import { PortfolioPage } from "./components/PortfolioPage";
import { StockDetailsPage } from "./components/StockDetailsPage";
import "./App.css";

export function App() {
  return (
    <>
      <h1 className="bg-indigo-600 text-shadow-indigo-500 p-6 rounded-4xl">
        React + Nest + MongoDB Stocks Management
      </h1>
      <Router>
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
