import { makeAutoObservable } from "mobx";
import {
  fetchPortfolio,
  toggleFavoriteStock,
  deleteStockFromPortfolio,
  searchLocalStocks,
  searchGlobalStocks,
  addStocksToPortfolio
} from "../api/portfolioApi";

class PortfolioStore {
  username = '';
  portfolio = [];
  selectedStock = null;
  searchLocation = "local";
  searchField = "symbol";
  searchQuery = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUsername(username) {
    this.username = username;
  }

  setSearchLocation(location) {
    this.searchLocation = location;
  }

  setSearchQuery(query) {
    this.searchQuery = query;
  }

  setSearchField(fieldName) {
    this.searchField = fieldName;
  }

  logout() {
    this.username = '';
    this.portfolio = [];
    this.selectedStock = null;
  }

  async fetchPortfolio() {
    if (!this.username || this.username === "" || this.username.email === "") return;
    this.portfolio = await fetchPortfolio(this.username);
  }

  async toggleFavorite(symbol) {
    await toggleFavoriteStock(this.username, symbol);
    await this.fetchPortfolio();
  }

  async deleteStock(symbol) {
    await deleteStockFromPortfolio(this.username, symbol);
    await this.fetchPortfolio();
  }

  // async searchStocks(searchType, searchField, query) {
  async searchStocks() {
    if (this.searchLocation === 'local') {
      const result = await searchLocalStocks(this.username, this.searchField, this.searchQuery);
      this.portfolio = result;
    } else {
      const result = await searchGlobalStocks(this.searchField, this.searchQuery);
      this.portfolio = result;
    }
  }

  async addStocksToPortfolio(selectedSymbols) {
    if (selectedSymbols.length === 0) return;
    await addStocksToPortfolio(this.username, selectedSymbols);
  }

  selectStock(stock) {
    this.selectedStock = stock;
  }
}

const portfolioStore = new PortfolioStore();
export default portfolioStore;
