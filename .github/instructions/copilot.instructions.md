You are working in the repository: anomfin/mobilebanks.

GOAL  
Enhance and finalize a polished mobile-first crypto banking demo app.  
The app already uses EUR and BTC values, but NO real blockchain or wallet is implemented.  
Everything must remain MOCK / SIMULATED while looking like a real fintech/crypto mobile bank.

GENERAL PRINCIPLES  
- DO NOT integrate any real wallets, Web3 libraries, blockchain RPCs, APIs, private keys, or seed phrases.  
- All data (balances, price movements, transactions, charts) must be fully simulated client-side.  
- Present the UI and UX like a real mobile banking / crypto portfolio app.  
- Keep all code self-contained inside this repository (no references to private repos).

UI REQUIREMENTS  
- Modern mobile-first styling (PWA-friendly).  
- Bottom navigation with tabs (existing or create if missing):  
  1. Overview  
  2. Portfolio  
  3. Activity  
  4. Settings  

- All views must feel responsive and real, with smooth animations and charts.

FEATURE REQUIREMENTS  
1) OVERVIEW  
- Show total demo “net worth” with EUR + BTC.  
- Show daily/weekly % changes (mocked).  
- Display a BTC price chart (mocked random-walk data).  
- Include cards/features that *look* real but are demo only.  
- Use a clear but subtle reminder: “DEMO — No real transactions”.

2) PORTFOLIO  
- Show holdings for BTC + optional fictional tokens (e.g. PINJA token or any other demo asset).  
- Display current mock price, 24h change, total value, small sparkline chart.  
- Timeframe selector (24h/7d/30d) should update charts using subsets of the simulated dataset.

3) ACTIVITY  
- Display log of simulated “transactions”: buy, sell, convert, deposit, withdraw.  
- All records are stored in localStorage or an in-memory module.  
- Include filter chips (All / Buys / Sells / Conversions).  
- Status always: “Completed — Demo”.

4) SETTINGS  
- Dark mode toggle (persist in localStorage).  
- Toggle between:
  - “Realistic volatility” (ups and downs)  
  - “Always-up demo mode” (steady growth with small occasional dips)
- “Reset demo data” button that clears localStorage and reseeds the mock state.  
- About section explaining that this is a demo app with mock data.

MOCK DATA ENGINE  
Build or extend an internal mock-data module that:  
- Stores current BTC price, demo holdings, and transaction history.  
- Generates BTC price history using a pseudo-random walk algorithm:  
  - Slight upward long-term trend  
  - Adjustable volatility based on settings  
  - Occasional dips or spikes  
- Updates current price on app load or on a short interval timer.  
- Returns data through simple helper functions like:  
  - getCurrentBTCPrice()  
  - getPortfolio()  
  - getPriceHistory(timeframe)  
  - getTransactions()  
  - applyMockMarketTick()

INTERACTIONS  
- Any action (Buy/Sell/Send/Receive/etc.) must open a modal/toast:  
  “Demo only — No real crypto functionality.”  
- No sensitive fields. No private keys. No seed phrases.

TECHNICAL GUIDELINES  
- Keep code modular and easy to extend.  
- Use components for repeated UI elements (cards, charts, lists).  
- Must run as a mobile PWA when added to home screen (iOS/Android).  
- Ensure the repo remains completely public-safe and contains no references to private models or repos.

TASKS FOR COPILOT  
1. Analyze current project structure and identify missing components.  
2. Create/finish the mock data engine for BTC + optional secondary tokens.  
3. Implement or refine the Overview/Portfolio/Activity/Settings views to look production-grade.  
4. Implement chart rendering for historical data (simple line/sparkline).  
5. Add settings toggles (dark mode + volatility mode) with persistence.  
6. Add consistent “Demo Only” UX indicators.  
7. Polish responsiveness and animations for a clean neobank experience.

Your output should be clean, maintainable code aligned with the existing repo.
