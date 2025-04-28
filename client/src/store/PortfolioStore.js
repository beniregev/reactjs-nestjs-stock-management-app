import { makeAutoObservable } from "mobx";
import { 
  fetchPortfolio, 
  toggleFavoriteStock, 
  deleteStockFromPortfolio, 
  searchLocalStocks, 
  searchGlobalStocks, 
  addMultipleStocksToPortfolio 
} from "../api/portfolioApi";

const keyUserEmail = "stockMgr-email";
const stringEmpty = "";

class PortfolioStore {
  username = stringEmpty;
  portfolio = [];
  selectedStock = null;
  searchLocation = "local";
  searchField = "symbol";
  searchQuery = stringEmpty;
  isGlobalSearch = false; // NEW: to track if we are displaying global search results
  selectedStocks = new Set(); // NEW: set to track selected checkboxes

  constructor() {
    makeAutoObservable(this);
  }

  setUsername(username) {
    this.username = username;
    localStorage.setItem(keyUserEmail, username.email);
  }

  getUserName() {
    if (!this.username) {
      const userEmail = localStorage.getItem(keyUserEmail);
      this.username = userEmail !== stringEmpty ? { email: userEmail } : stringEmpty;
    }
    return this.username;
  }

  setSearchLocation(location) {
    this.searchLocation = location;
    if (location === 'local') {
      this.isGlobalSearch = false;
    }
  }

  setSearchQuery(query) {
    this.searchQuery = query;
  }

  setSearchField(fieldName) {
    this.searchField = fieldName;
  }

  toggleStockSelection(symbol) {
    if (this.selectedStocks.has(symbol)) {
      this.selectedStocks.delete(symbol);
    } else {
      this.selectedStocks.add(symbol);
    }
  }

  clearSelection() {
    this.selectedStocks.clear();
  }

  logout() {
    this.username = '';
    this.portfolio = [];
    this.selectedStock = null;
    this.isGlobalSearch = false;
    this.clearSelection();
    localStorage.setItem(keyUserEmail, stringEmpty);
  }

  async fetchPortfolio() {
    if (!this.getUserName() || this.getUserName() === stringEmpty) return;
    this.portfolio = await fetchPortfolio(this.username);
    this.isGlobalSearch = false;
  }

  async toggleFavorite(symbol) {
    await toggleFavoriteStock(this.username, symbol);
    await this.fetchPortfolio();
  }

  async deleteStock(symbol) {
    await deleteStockFromPortfolio(this.username, symbol);
    await this.fetchPortfolio();
  }

  async searchStocks() {
    if (this.searchLocation === 'local') {
      if (!this.searchQuery) {
        await this.fetchPortfolio();
        return;
      }
      const result = await searchLocalStocks(this.username, this.searchField, this.searchQuery);
      this.portfolio = result;
      this.isGlobalSearch = false;
    } else {
      if (!this.searchQuery) return; // Don't search with empty query in global
      const result = await searchGlobalStocks(this.searchField, this.searchQuery);
      console.log("Global Search Result", result);
      this.portfolio = result;
      this.isGlobalSearch = true;
    }
    this.clearSelection();
  }

  async addSelectedStocks() {
    if (this.selectedStocks.size === 0) return;

    const stocksToAdd = this.portfolio
      .filter(stock => this.selectedStocks.has(stock.symbol))
      .map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
      }));

    await addMultipleStocksToPortfolio(this.username, stocksToAdd);

    this.setSearchLocation('local');
    this.setSearchQuery('');
    await this.fetchPortfolio();
    this.clearSelection();
  }

  selectStock(stock) {
    this.selectedStock = stock;
  }
}

const portfolioStore = new PortfolioStore();
export default portfolioStore;
