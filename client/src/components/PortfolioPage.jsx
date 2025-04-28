import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { Input, Button, Radio, Tooltip, Checkbox } from "antd";
import {
  SearchOutlined,
  LogoutOutlined,
  StarOutlined,
  StarFilled,
  DeleteOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import portfolioStore from "../store/PortfolioStore";

export const PortfolioPage = observer(() => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [selectedStocks, setSelectedStocks] = useState([]);

  const optionsLocation = [
    { label: "Local", value: "local" },
    { label: "Global", value: "global" },
  ];
  const optionsField = [
    { label: "Stock", value: "symbol" },
    { label: "Company", value: "company" },
  ];

  useEffect(() => {
    portfolioStore.fetchPortfolio();
  }, []);

  const handleLogout = () => {
    portfolioStore.logout();
    navigate("/");
  };

  const handleSearch = () => {
    portfolioStore.setSearchQuery(searchText);
    portfolioStore.searchStocks();
    setSelectedStocks([]); // clear selections on new search
  };

  const handleStockClick = (stock) => {
    if (portfolioStore.searchLocation === "global") return; // disable click in global search
    portfolioStore.selectStock(stock);
    navigate("/details");
  };

  const handleCheckboxChange = (stockSymbol, checked) => {
    if (checked) {
      setSelectedStocks([...selectedStocks, stockSymbol]);
    } else {
      setSelectedStocks(selectedStocks.filter((s) => s !== stockSymbol));
    }
  };

  const handleAddSelectedStocks = async () => {
    await portfolioStore.addStocksToPortfolio(selectedStocks);
    setSelectedStocks([]);
    setSearchText("");
    portfolioStore.setSearchLocation("local");
    portfolioStore.fetchPortfolio();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <div className="w-full max-w-5xl">
        {/* Top bar with Logout */}
        <div className="flex justify-end mb-6">
          <Button
            type="primary"
            danger
            onClick={handleLogout}
            icon={<LogoutOutlined />}
          >
            Logout
          </Button>
        </div>

        {/* Search Bar Section */}
        <div className="flex items-center justify-between mb-6 space-x-2 bg-white p-4 rounded-lg shadow">
          {/* Radio Group 1: Local / Global */}
          <Radio.Group
            block
            options={optionsLocation}
            defaultValue="local"
            optionType="button"
            buttonStyle="solid"
            onChange={(e) => portfolioStore.setSearchLocation(e.target.value)}
            value={portfolioStore.searchLocation}
            className="flex pl-2 pr-2"
          />

          {/* Radio Group 2: Symbol / Company Name */}
          <Radio.Group
            block
            options={optionsField}
            defaultValue="symbol"
            optionType="button"
            buttonStyle="solid"
            onChange={(e) => portfolioStore.setSearchField(e.target.value)}
            value={portfolioStore.searchField}
            className="flex ml-4 mr-4 pl-2 pr-2"
          />

          {/* Search Input */}
          <Input
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-1/3"
          />

          {/* Search Button */}
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            className="p-px"
          />
        </div>

        {/* Stock List Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between font-bold mb-4">
            {portfolioStore.searchLocation === "global" && (
              <div className="w-1/12 text-center text-black">Select</div>
            )}
            <div className="w-1/2 text-left text-black">Symbol</div>
            <div className="w-1/2 text-left text-black">Company Name</div>
            {portfolioStore.searchLocation === "local" && (
              <div className="text-right text-black">Actions</div>
            )}
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
            {portfolioStore.portfolio.length === 0 ? (
              <div className="text-center text-black">
                No stocks to display.
              </div>
            ) : (
              portfolioStore.portfolio.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex justify-between items-center py-2 border-t text-black hover:bg-gray-300"
                  onClick={() => handleStockClick(stock)}
                >
                  {portfolioStore.searchLocation === "global" && (
                    <div className="w-1/12 text-center">
                      <Checkbox
                        checked={selectedStocks.includes(stock.symbol)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleCheckboxChange(stock.symbol, e.target.checked);
                        }}
                      />
                    </div>
                  )}
                  <div className="w-1/2 text-left">{stock.symbol}</div>
                  <div className="w-1/2 text-left">{stock.name}</div>
                  {portfolioStore.searchLocation === "local" && (
                    <div className="flex space-x-2 justify-end items-center">
                      <Tooltip title="Favorite">
                        <Button
                          icon={
                            stock.isFavorite ? <StarFilled /> : <StarOutlined />
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            portfolioStore.toggleFavorite(
                              stock._id,
                              stock.isFavorite
                            );
                          }}
                        />
                      </Tooltip>
                      <Tooltip title="Delete">
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            portfolioStore.deleteStock(stock._id);
                          }}
                        />
                      </Tooltip>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Add Button */}
          {portfolioStore.searchLocation === "global" &&
            portfolioStore.portfolio.length > 0 && (
              <div className="flex justify-end mt-4">
                <Button
                  type="primary"
                  style={{ backgroundColor: "blue", color: "white" }}
                  onClick={handleAddSelectedStocks}
                  className="text-2xl"
                >
                  Add Selected Stocks
                </Button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
});
