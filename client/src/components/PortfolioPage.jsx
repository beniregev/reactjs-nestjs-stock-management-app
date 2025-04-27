import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { Input, Button, Radio, Tooltip } from "antd";
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
  };

  const handleStockClick = (stock) => {
    portfolioStore.selectStock(stock);
    navigate("/details");
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
            className="flex"
          />

          {/* Radio Group 2: Symbol / Company Name */}
          <Radio.Group
            block
            options={optionsField}
            defaultValue="stock"
            optionType="button"
            buttonStyle="solid"
            onChange={(e) => portfolioStore.setSearchField(e.target.value)}
            value={portfolioStore.searchField}
            className="flex ml-4 mr-4"
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
          />
        </div>

        {/* Stock List Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between font-bold mb-4">
            <div className="w-1/2 text-left">Symbol</div>
            <div className="w-1/2 text-left">Company Name</div>
            <div className="text-right">Actions</div>
          </div>
          {portfolioStore.portfolio.length === 0 ? (
            <div className="text-center text-gray-500">
              No stocks to display.
            </div>
          ) : (
            portfolioStore.portfolio.map((stock) => (
              <div
                key={stock._id}
                className="flex justify-between items-center py-2 border-t hover:bg-gray-100 cursor-pointer"
                onClick={() => handleStockClick(stock)}
              >
                <div className="w-1/2 text-left">{stock.symbol}</div>
                <div className="w-1/2 text-left">{stock.name}</div>
                <div className="flex space-x-2 justify-end items-center">
                  <Tooltip title="Favorite">
                    <Button
                      icon={
                        stock.is_favorite ? <StarFilled /> : <StarOutlined />
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        portfolioStore.toggleFavorite(
                          stock._id,
                          stock.is_favorite
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
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
});
