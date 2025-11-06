# SumUp - Running Instructions

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

## Installation & Running

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

This will start the Expo development server.

### 3. View the App

#### Option A: Expo Go (Mobile)
1. Install Expo Go app on your iOS or Android device
2. Scan the QR code displayed in the terminal
3. The app will load on your device

#### Option B: iOS Simulator
```bash
npm run ios
```
Requires macOS with Xcode installed

#### Option C: Android Emulator
```bash
npm run android
```
Requires Android Studio and Android SDK

#### Option D: Web Browser
```bash
npm run web
```
Opens the app in your default web browser

## Features Implemented

### ✅ Complete Rebrand to "SumUp"
- App title changed to "SumUp" in app.json
- All visible UI updated with SumUp branding
- Modern white/blue/cyan color theme

### ✅ Updated Greeting
- Changed from "Hyvää päivää" to "Hei, Aku Ankka"
- Added "Tilinomistaja: Firma Oy" below greeting in small font
- Visible on HeaderBar component across all screens

### ✅ Beautiful New Theme
- **Background**: White (#FFFFFF)
- **Primary Blue**: #0A84FF
- **Accent Cyan**: #00D1FF
- **Text**: Black/Dark (#0B0B0B)
- **Soft shadows and rounded corners**
- **Gradient cards with smooth transitions**

### ✅ Five Main Screens

#### 1. Etusivu (Home)
- Balance card with gradient
- Quick action buttons
- Recent transactions list
- Navigate to receipt by tapping transactions

#### 2. Maksut (Payments)
- Recipient input
- Amount input with quick presets (10€, 25€, 50€, 100€, 250€)
- Description field
- Success modal animation
- Mock payment creation

#### 3. Raportit (Reports)
- Income/Expense summary cards with gradients
- Period selector (Week/Month/Year)
- Chart placeholder (static)
- Filter tabs (All/Income/Expenses)
- Export/Share buttons (mock)
- Filtered transaction list

#### 4. Kuitti (Receipt)
- Detailed transaction information
- QR code placeholder
- Share/Download/Print actions
- Beautiful receipt layout

#### 5. Asetukset (Settings)
- Profile section with greeting and owner info
- Dark mode toggle (visual only, not implemented)
- Haptics toggle (functional)
- Animations toggle (functional)
- Quick action links

### ✅ Reusable Components
- `HeaderBar`: Shows SumUp logo, greeting, and owner info
- `Card`: Gradient card wrapper with shadows

### ✅ Frontend-Only Implementation
- **No backend code**
- **No API calls**
- **No persistent storage**
- All data is mocked locally
- State managed with React hooks and Context API

## Technical Stack
- **React Native**: 0.81.5
- **Expo**: ~54.0.22
- **TypeScript**: 5.9.2
- **Navigation**: Expo Router 6.0.14
- **Animations**: react-native-reanimated 4.1.3
- **UI Enhancements**: expo-linear-gradient, expo-haptics

## Mock Data
All transactions and account data are stored in:
- `src/context/AccountContext.tsx` - Account state and payment creation
- Initial balance: €14,574.32
- Account number: FI21 1234 5678 9012 34

## Navigation
Bottom tab navigation with 5 tabs:
1. Etusivu (Home) 🏠
2. Maksut (Payments) 📤
3. Raportit (Reports) 📊
4. Kuitti (Receipt) 📄
5. Asetukset (Settings) ⚙️

## Notes
- This is a frontend-only implementation with no backend services
- All actions are simulated locally
- No environment variables or API keys needed
- Smooth animations and haptic feedback included
- Fully responsive and works on iOS, Android, and Web
