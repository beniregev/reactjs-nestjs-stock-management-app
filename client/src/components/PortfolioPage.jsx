import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { userStore } from "../store/userStore";
import { useNavigate } from "react-router-dom";
import { Table, Button, Input, message } from "antd";
import { StarOutlined, StarFilled, DeleteOutlined } from "@ant-design/icons";
import API from "../api/api";

export const PortfolioPage = observer(() => {
  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userStore.user) {
      navigate("/");
      return;
    }
    fetchStocks();
  }, [navigate]);

  const fetchStocks = async () => {
    const res = await API.get(`/stocks?email=${userStore.user.email}`);
    setStocks(res.data);
  };

  const handleAddStock = async () => {
    if (!search) return;
    await API.post("/stocks", {
      email: userStore.user.email,
      symbol: search.toUpperCase(),
      companyName: search, // Ideally, you should fetch real company name
    });
    setSearch("");
    fetchStocks();
    message.success("Stock added!");
  };

  const handleToggleFavorite = async (symbol) => {
    await API.patch(
      `/stocks/favorite?email=${userStore.user.email}&symbol=${symbol}`
    );
    fetchStocks();
  };

  const handleDelete = async (symbol) => {
    await API.delete(`/stocks?email=${userStore.user.email}&symbol=${symbol}`);
    fetchStocks();
    message.success("Stock deleted!");
  };

  const handleLogout = () => {
    userStore.logout();
    navigate("/");
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
      align: "center",
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <Button
            icon={record.isFavorite ? <StarFilled /> : <StarOutlined />}
            onClick={() => handleToggleFavorite(record.symbol)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.symbol)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="p-4 flex justify-between items-center bg-white shadow">
        <h2 className="text-xl">
          Hey {userStore.user.fullName}, your stock portfolio
        </h2>
        <Button type="primary" danger onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="p-6 flex justify-center gap-6">
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Search stock..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={handleAddStock}>Add</Button>
        </div>

        <Table
          dataSource={stocks}
          columns={columns}
          rowKey="symbol"
          onRow={(record) => ({
            onClick: () => navigate(`/details/${record.symbol}`),
          })}
          className="w-2/3"
          pagination={false}
        />
      </div>
    </div>
  );
});
