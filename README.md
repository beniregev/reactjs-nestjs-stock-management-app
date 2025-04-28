# ReactJS + NestJS + MongoDB Stocks Management Project

## Status 

### Completed

- **Server:** NestJS + Mongoose + MongoDB + Validation + OpenAPI documentation (Swagger).
- **Client:** ReactJS (Vite) + MobX + Ant Design + TailwindCSS + PostCSS + Axios.
  - Not in requirements: LoginPage to enter user-name and email (username) that is used to distinct between portfolios of different users.
  - When "Login" is clicked the user is navigated to the Portfolio Page.
- (Requirement) Portfolio Page - Done.
  - When the Portfolio page is open the user's portfolio is retrieved and displayed.
  - SearchBar: Not a requirement but, good UX. 
    - The user can select where to search? Local = The portfolio in MongoDBto; Global = Using FMP API.
    - The user can select what how to search? By Stock symbol or company name.
    - The user type the search text and click the button to search.
    - The search result is shown in a list/table under the SearchBar.
  - Showing the user portfolio: stock symbol, company name, flag for favorite.
  - For search results from a global search a column is added to select the stocks to add to the user's portfolio.

### Open Issues

- REQUIREMENT: Clicking a stock in the portfolio will show it's details - 85% Complete, page design and testing are left.
- Add single, or multiple, stock(s) to the portfolio by searching using the FMP API for stocks - WIP - INCOMPLETE.
  - UI: Search for stocks by stock symbol or company name using the FMP API - Done.
  - UI: Select the stocks to add to the portfolio - Done.
  - BE: flow to add multiple stocks to support the UI/UX - WIP. 85% Done, having an issue with the endpoint.
- When searching locally the search text can be empty and the entire user portfolio will be retrieve from MongoDB - 90%+ completed.
  - Need to include the condition in the function to retrieve the stocks locally - TO DO.
- Mark/unmark stock as favorite - 90% Completed, clicking the button doesn't work, suspecting that calling the endpoint (PATCH) returns an error.
- Some other issues I want to improve to improve the UX.

## ReactJS + Vite Client Application

You need to have an `.env` file with the following parameters/properties:

      VITE_SERVER_URL=http://localhost:5000
      VITE_FMP_API_KEY=your_fmp_api_key_here

Replace the text "your_fmp_api_key_here" with your API-Key for FMP (Financial Modeling Prep) API.

### Application Flow

When you run the client application it will show you a login page. In that page you need to type your full name and an email in a valid format (there's no check for the email, just to have a unique username).

Click "Login" button and you will get the list of stocks currently in your Portfolio. The list is retrieved from MongoDB Atlas by the username (the email that you typed in the login page).

The stocks list includes the following columns:

- Symbol (Stock Symbol).
- Company Name.
- Options:
  - ⭐ icon (Favorite).
  - 🗑️ icon (delete).
  
Click on any of the stocks to open the "Stock Details Page" with the following details:

- Stock Name (dynamic `{stock name}`).
- Stock details:
  - Symbol
  - Latest Quote
  - Today's change percentage (%)

#### ⭐ UI/UX Notes

- All icons have hover tooltips: ⭐ Favorite / 🗑️ Delete.
- Favorite icon toggles ON/OFF visually.
- Trash icon deletes immediately.
- Logout clears local storage and navigates to Login.

## Server: NestJS + Mongoose + MongoDB Atlas

You need to have an `.env` file with the following properties/parameters:

    MONGO_URI=mongodb+srv://<your-mongo-url-here>
    FMP_API_KEY=your-fmp-api-key-here
    SERVER_PORT=3000
    CLIENT_PORT=5713

## Running The Project

### Prerequisites

- Make sure you are connected to the internet and have access to FMP API, including a valid API-Key.
- Make sure you have environment variables defined with correct values, I used `.env` file in both the _client_ and _server_ folders.
- Make sure you installed all the dependencies for the client and server applications, run `npm install`, or `npm i`, in both the _client_ and _server_ folders.

### Run The ReactJS Client Application

Run the following command in the client folder of the project: `npm run dev`. I created the ReactJS application using Vite, thus the default port is `5173`, if you have something running on it the the application will run on the next available port after it in sequence (i.e., `5174`, `5175`, etc.).

## Run The NestJS Server Application

**Important:** Make sure your MongoDB Atlas is running

Navigate the the _server_ folder and run the following command: `npm run start:dev`.

You should see in the terminal something similar to the following:

    [Nest] 21216  - 04/27/2025, 6:26:37 PM     LOG [NestFactory] Starting Nest application...
    [Nest] 21216  - 04/27/2025, 6:26:37 PM     LOG [InstanceLoader] AppModule dependencies initialized +16ms
    [Nest] 21216  - 04/27/2025, 6:26:37 PM     LOG [InstanceLoader] MongooseModule dependencies initialized +1ms
    [Nest] 21216  - 04/27/2025, 6:26:37 PM     LOG [InstanceLoader] ConfigHostModule dependencies initialized +0ms
    [Nest] 21216  - 04/27/2025, 6:26:37 PM     LOG [InstanceLoader] ConfigModule dependencies initialized +1ms
    [Nest] 21216  - 04/27/2025, 6:26:37 PM     LOG [InstanceLoader] ConfigModule dependencies initialized +0ms
    [Nest] 21216  - 04/27/2025, 6:26:39 PM     LOG [InstanceLoader] MongooseCoreModule dependencies initialized +2005ms
    [Nest] 21216  - 04/27/2025, 6:26:39 PM     LOG [InstanceLoader] MongooseModule dependencies initialized +15ms
    [Nest] 21216  - 04/27/2025, 6:26:39 PM     LOG [InstanceLoader] StockModule dependencies initialized +0ms
    [Nest] 21216  - 04/27/2025, 6:26:41 PM     LOG [NestApplication] Nest application successfully started +2008ms

### Swagger Documentation (OpenAPI)

Navigate to `http://localhost:3000/api`, when `3000` is the port number of your server application. If the port number of your server application is not `3000` the replace the `3000` with the port number of your server application.
