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
    setSelectedStocks([]);
  };

  const handleStockClick = (stock) => {
    if (!portfolioStore.isGlobalSearch) {
      portfolioStore.selectStock(stock);
      // navigate("/details");
      navigate("/details/" + stock.symbol);
    }
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

        {/* Stock List */}
        <div className="bg-white rounded-lg shadow p-6">
          {/* Stock List - Headers */}
          <div className="flex justify-between font-bold mb-4">
            {portfolioStore.isGlobalSearch && <div className="w-1/12"></div>}
            <div className="w-1/4 text-left text-black">Symbol</div>
            <div className="w-1/4 text-left text-black">Name</div>
            <div className="w-1/4 text-left text-black">Currency</div>
            <div className="w-1/4 text-left text-black">Exchange</div>
            {!portfolioStore.isGlobalSearch && (
              <div className="w-1/12 text-right text-black">Actions</div>
            )}
          </div>
          {/* Stock List - Lines */}
          <div className="max-h-96 overflow-y-auto">
            {portfolioStore.portfolio.length === 0 ? (
              <div className="text-center text-black">
                No stocks to display.
              </div>
            ) : (
              portfolioStore.portfolio.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex justify-between items-center py-2 border-t text-black hover:bg-gray-300 cursor-pointer"
                  onClick={() => handleStockClick(stock)}
                >
                  {portfolioStore.isGlobalSearch && (
                    <div className="w-1/12 text-center">
                      <Checkbox
                        checked={portfolioStore.selectedStocks.has(
                          stock.symbol
                        )}
                        onChange={() =>
                          portfolioStore.toggleStockSelection(stock.symbol)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  )}
                  <div className="w-1/4 text-left">{stock.symbol}</div>
                  <div className="w-1/4 text-left">{stock.companyName}</div>
                  <div className="w-1/4 text-left">{stock.currency}</div>
                  <div className="w-1/4 text-left">{stock.exchange}</div>
                  {!portfolioStore.isGlobalSearch && (
                    <div className="w-1/12 flex space-x-2 justify-end items-center">
                      <Tooltip title="Favorite">
                        <Button
                          icon={
                            stock.is_favorite ? (
                              <StarFilled />
                            ) : (
                              <StarOutlined />
                            )
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            portfolioStore.toggleFavorite(stock._id);
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
          {portfolioStore.isGlobalSearch && (
            <div className="flex justify-center mt-4">
              <Button
                type="primary"
                style={{ backgroundColor: "blue", color: "white" }}
                onClick={() => portfolioStore.addSelectedStocks()}
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
