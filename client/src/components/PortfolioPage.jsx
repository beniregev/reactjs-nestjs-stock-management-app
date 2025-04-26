import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { Button, Table, Tooltip, Input, Radio } from "antd";
import {
  StarOutlined,
  StarFilled,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import portfolioStore from "../stores/portfolioStore";

export const PortfolioPage = observer(() => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState("local"); // 'local' or 'global'
  const [searchField, setSearchField] = useState("symbol"); // 'symbol' or 'companyName'
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!portfolioStore.username) {
      navigate("/");
    } else {
      portfolioStore.fetchPortfolio();
    }
  }, [navigate]);

  const handleLogout = () => {
    portfolioStore.logout();
    navigate("/");
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    await portfolioStore.searchStocks(searchType, searchField, searchQuery);
  };

  const columns = [
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
      align: "left",
    },
    {
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
      align: "left",
    },
    {
      title: "Options",
      key: "options",
      align: "right",
      render: (text, record) => (
        <div className="flex gap-2 justify-end">
          <Tooltip title="Favorite">
            {record.isFavorite ? (
              <StarFilled
                className="text-yellow-500 cursor-pointer"
                onClick={() => portfolioStore.toggleFavorite(record.symbol)}
              />
            ) : (
              <StarOutlined
                className="cursor-pointer"
                onClick={() => portfolioStore.toggleFavorite(record.symbol)}
              />
            )}
          </Tooltip>
          <Tooltip title="Delete">
            <DeleteOutlined
              className="text-red-500 cursor-pointer"
              onClick={() => portfolioStore.deleteStock(record.symbol)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleRowClick = (record) => {
    portfolioStore.selectStock(record);
    navigate("/details");
  };

  return (
    <div className="min-h-screen flex flex-col p-4">
      <div className="flex justify-end">
        <Button type="primary" danger onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="mt-4">
        <SearchBar
          searchType={searchType}
          setSearchType={setSearchType}
          searchField={searchField}
          setSearchField={setSearchField}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />
      </div>

      <div className="flex justify-center mt-6">
        <div className="w-full max-w-5xl">
          <Table
            dataSource={portfolioStore.portfolio.slice()}
            columns={columns}
            rowKey="symbol"
            pagination={false}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}
          />
        </div>
      </div>
    </div>
  );
});
