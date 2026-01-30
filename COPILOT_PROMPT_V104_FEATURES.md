# Copilot Prompt: Add v104 Unique Features to v103

## OVERVIEW
This prompt adds all the features that exist in crypto-v104.html but are missing in crypto-v103.html, while preserving v103's existing functionality.

## PROMPT FOR COPILOT

```
@copilot I need you to enhance crypto-v103.html by adding the following features from crypto-v104.html:

### PRIORITY 1: VISUAL & UI ENHANCEMENTS

1. **Replace Color Scheme**
   - Change primary color from #3b82f6 (blue) to #6366f1 (indigo) throughout the CSS
   - Update --primary, --primary-light, --primary-dark variables
   - Enhance glassmorphism effects with backdrop-filter: blur(20px)

2. **Add Landing Page (Pre-Login)**
   - Create a professional landing/welcome screen that shows BEFORE login
   - Include: Hero section with tagline, version badge (v1.04+), "What's New" highlights
   - Add feature showcase grid with 3 cards highlighting key features
   - Landing should transition to login form, then to main app after authentication

3. **Add FAQ Accordion Section**
   - Add a new FAQ section in Settings screen
   - Implement toggleFAQ(button) function for expand/collapse
   - Include 10+ common questions about the demo app
   - Each FAQ item should have smooth expand/collapse animation

### PRIORITY 2: NEW FUNCTIONAL FEATURES

4. **Implement Referral Program System**
   - Add new "Referral" screen/tab in bottom navigation
   - Create referral code generation: generateReferralCode() - 8 character alphanumeric
   - Display unique referral code prominently
   - Show referral link with tracking: https://example.com/?ref=YOUR_CODE
   - Add "Copy Link" button with copyReferralLink() function
   - Display stats: Clicks, Signups, Estimated Bonus (EUR)
   - Store referral data in localStorage:
     ```javascript
     referralProfile: {
       code: string,
       createdAt: timestamp,
       clicks: number,
       signups: number,
       estimatedBonus: number
     }
     ```
   - Implement handleReferralClick(code) to track when someone uses a referral link

5. **Add Risk Profile Management**
   - Add "Risk Profile" section to Settings
   - Three options: Conservative, Balanced, Aggressive
   - Implement setRiskProfile(profile) function
   - Store selected profile in localStorage settings
   - Visual selection UI with radio buttons or click-to-select cards

6. **Implement AI Market Brain Analytics**
   - Add "AI Market Brain" widget to Dashboard
   - Display risk level indicator (Low/Medium/High) based on user's risk profile
   - Show contextual market analysis text that changes based on risk profile
   - Example: Conservative → "Market stable, recommending cautious approach"
   - Example: Aggressive → "Opportunity detected, optimal for growth"

### PRIORITY 3: ENHANCED COMPONENTS

7. **Transaction History Filtering**
   - Upgrade History/Transactions screen with tab filters
   - Add 4 filter tabs: All, Deposits, Trades, Withdrawals
   - Implement filterHistory(filter) function
   - Each tab should filter transactions by type
   - Add active tab highlighting

8. **First Run Modal**
   - Create showFirstRunModal() function
   - Display modal on first app visit (check localStorage flag)
   - Welcome message explaining demo features
   - "Get Started" button to dismiss and set flag

9. **Update Navigation Structure**
   - Rename "Home" to "Dashboard"
   - Rename "Transactions" to "History"
   - Add new "Referral" tab
   - Keep "Settings"
   - Update all screen IDs and navigation handlers accordingly

### PRIORITY 4: DATABASE & STORAGE

10. **Extend localStorage Data Structure**
    - Add referral profile storage methods
    - Add settings.riskProfile field
    - Add firstRunComplete flag
    - Ensure all new data persists across sessions

### IMPLEMENTATION GUIDELINES

- **DO NOT remove any existing v103 features** (CAT trading, portfolio charts, etc.)
- **Maintain compatibility** with existing localStorage data
- **Keep all existing screens functional** (just add new ones)
- **Use v103's code structure** (same patterns and conventions)
- **Ensure mobile-first responsive design** (max-width: 430px)
- **No external API calls** - all features must work offline
- **All data simulated locally** - no real crypto or backend

### TESTING REQUIREMENTS

After implementation, verify:
- [ ] Landing page appears before login
- [ ] FAQ accordion expands/collapses smoothly
- [ ] Referral code generates and displays correctly
- [ ] Risk profile saves and affects Market Brain analysis
- [ ] History filters work correctly
- [ ] All v103 features still work (CAT, portfolio, transactions)
- [ ] localStorage persists all new data
- [ ] No console errors
- [ ] Works offline (no network calls)

### EXPECTED RESULT

The enhanced file should have:
- All v103 functionality preserved
- Modern landing page from v104
- Referral program fully functional
- AI Market Brain with risk profiles
- FAQ section in settings
- Premium indigo color scheme
- Enhanced glassmorphism effects
- Better transaction filtering

Total file size: ~150-180KB (v103 is 143KB, adding ~20-40KB for new features)
```

## ALTERNATIVE SHORTER PROMPT

If you want a more concise version:

```
@copilot Add these v104 features to crypto-v103.html while keeping all v103 functionality:

1. Change primary color to #6366f1 (indigo)
2. Add landing page with hero and feature showcase before login
3. Add FAQ accordion in Settings (10+ items with toggleFAQ() function)
4. Add Referral screen with: code generation, link copying, click/signup tracking, bonus display
5. Add Risk Profile settings (Conservative/Balanced/Aggressive) with setRiskProfile()
6. Add AI Market Brain widget showing risk analysis based on profile
7. Add transaction History filters (All/Deposits/Trades/Withdrawals tabs)
8. Add First Run modal (showFirstRunModal() on first visit)
9. Update navigation: Home→Dashboard, Transactions→History, add Referral tab
10. Extend localStorage for referral data and risk profiles

Keep all v103 features (CAT, portfolio, charts). Everything works offline with localStorage only.
```

## FEATURE-BY-FEATURE PROMPTS

If you want to add features incrementally, use these individual prompts:

### 1. Landing Page
```
@copilot Add a professional landing page to crypto-v103.html that appears before login. Include:
- Hero section with app name "CryptoVault Neo-Bank" and tagline
- Version badge showing "v1.04"
- "What's New" section with 3-4 bullet points
- Feature showcase grid (3 cards: Referral Program, AI Analytics, Risk Management)
- Login form button that transitions to authentication
Use indigo color scheme (#6366f1) and glassmorphism effects.
```

### 2. Referral Program
```
@copilot Add a complete Referral Program to crypto-v103.html:
- New "Referral" tab in bottom navigation
- Generate 8-char alphanumeric referral codes: generateReferralCode()
- Display referral code and link: https://example.com/?ref=CODE
- "Copy Link" button with clipboard API
- Stats display: Clicks, Signups, Bonus (EUR)
- Store in localStorage: {code, createdAt, clicks, signups, estimatedBonus}
- Handle ?ref=CODE URL parameter to track referral usage
```

### 3. Risk Profiles & AI Market Brain
```
@copilot Add Risk Profile and AI Market Brain to crypto-v103.html:
- Add "Risk Profile" section in Settings with 3 options: Conservative, Balanced, Aggressive
- Save selected profile to localStorage
- Add "AI Market Brain" widget to Dashboard showing:
  - Risk level indicator based on profile
  - Contextual analysis (e.g., "Market stable" for Conservative)
- Implement setRiskProfile(profile) function
```

### 4. FAQ Accordion
```
@copilot Add FAQ accordion to Settings screen in crypto-v103.html:
- Create expandable FAQ section with 10+ questions
- Implement toggleFAQ(button) for smooth expand/collapse
- Questions about demo features, data persistence, safety
- Use arrow icons that rotate on expand
- Only one FAQ open at a time (accordion behavior)
```

### 5. History Filters
```
@copilot Add transaction filtering to History screen in crypto-v103.html:
- Add 4 filter tabs: All, Deposits, Trades, Withdrawals
- Implement filterHistory(filter) function
- Highlight active tab
- Filter transactions array by type
- Update transaction list display based on selected filter
```

---

## SUMMARY

**Features in v104 NOT in v103:**
1. Landing page with hero
2. FAQ accordion (10+ items)
3. Referral program (complete system)
4. Risk profiles (Conservative/Balanced/Aggressive)
5. AI Market Brain analytics
6. History transaction filters
7. First run modal
8. Indigo color scheme (#6366f1)
9. Enhanced glassmorphism
10. Navigation restructure (Dashboard/History/Referral/Settings)

**Use the appropriate prompt above based on your needs:**
- Full prompt for complete implementation
- Short prompt for quick reference
- Feature-by-feature prompts for incremental development
