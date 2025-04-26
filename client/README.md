# ReactJS + Vite Client Application

You need to have an `.env` file with the following parameters/properties:

      VITE_SERVER_URL=http://localhost:5000
      VITE_FMP_API_KEY=your_fmp_api_key_here

Replace the text "your_fmp_api_key_here" with your API-Key for FMP (Financial Modeling Prep) API.

## Application Flow

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

### ⭐ UI/UX Notes

- All icons have hover tooltips: ⭐ Favorite / 🗑️ Delete.
- Favorite icon toggles ON/OFF visually.
- Trash icon deletes immediately.
- Logout clears local storage and navigates to Login.
