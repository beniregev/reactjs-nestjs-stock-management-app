import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage } from "./components/LoginPage";
import { PortfolioPage } from "./components/PortfolioPage";
import { StockDetailsPage } from "./components/StockDetailsPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/details/:symbol" element={<StockDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
