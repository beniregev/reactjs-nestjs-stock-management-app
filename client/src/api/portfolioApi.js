import axios from "axios";

const API_BASE = import.meta.env.VITE_SERVER_URL;
const FMP_API_KEY = import.meta.env.VITE_FMP_API_KEY;

export const fetchPortfolio = async (userData) => {
  const { data } = await axios.get(`${API_BASE}/portfolio?email=${encodeURIComponent(userData.email)}`);
  console.log("fetchPortfolio(" + userData.email + ")", data);
  return data;
};

export const toggleFavoriteStock = async (email, symbol) => {
  console.log("toggleFavoriteStock -- email", email, "symbol", symbol);
  await axios.post(`${API_BASE}/portfolio/favorite`, { email, symbol, isFavorite: true });
};

export const deleteStockFromPortfolio = async (email, symbol) => {
  console.log("deleteStockFromPortfolio -- email", email, "symbol", symbol);
  await axios.delete(`${API_BASE}/portfolio/delete`, { params: { email, symbol } });
};

export const searchLocalStocks = async (email, field, query) => {
  console.log("searchLocalStocks -- email", email, "field", field, "query", query);
  const queryParam = field === 'symbol' ? query.toUpperCase() : query;
  const { data } = await axios.get(`${API_BASE}/portfolio/search`, { params: { email, field, query: queryParam } });
  return data;
};

export const searchGlobalStocks = async (field, query) => {
  console.log("searchGlobalStocks -- field", field, "query", query);
  const formattedQuery = field === 'symbol' ? query.toUpperCase() : query;
  const endpoint = field === 'symbol'
    ? `https://financialmodelingprep.com/api/v3/search?query=${formattedQuery}&limit=10&apikey=${FMP_API_KEY}`
    : `https://financialmodelingprep.com/api/v3/search-name?query=${formattedQuery}&limit=10&apikey=${FMP_API_KEY}`;

  const { data } = await axios.get(endpoint);
  return data.map(stock => ({
    symbol: stock.symbol,
    companyName: stock.name,
    isFavorite: false,
  }));
};

export const addStocksToPortfolio = async (username, symbols) => {
  const response = await axios.post('/api/portfolio/add-multiple', {
    email: username.email,
    symbols: symbols,
  });
  return response.data;
}