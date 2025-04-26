import { makeAutoObservable } from "mobx";
import { fetchPortfolio, toggleFavoriteStock, deleteStockFromPortfolio, searchLocalStocks, searchGlobalStocks } from "../api/portfolioApi";

class PortfolioStore {
  username = '';
  portfolio = [];
  selectedStock = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUsername(username) {
    this.username = username;
  }

  logout() {
    this.username = '';
    this.portfolio = [];
    this.selectedStock = null;
  }

  async fetchPortfolio() {
    if (!this.username) return;
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

  async searchStocks(searchType, searchField, query) {
    if (searchType === 'local') {
      const result = await searchLocalStocks(this.username, searchField, query);
      this.portfolio = result;
    } else {
      const result = await searchGlobalStocks(searchField, query);
      this.portfolio = result;
    }
  }

  selectStock(stock) {
    this.selectedStock = stock;
  }
}

const portfolioStore = new PortfolioStore();
export default portfolioStore;
