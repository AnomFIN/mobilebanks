# Yritystili – Helsinki eBike Service Oy

A stunning Expo Go mobile banking app with a minimalist fintech UI design, featuring offline mock data, haptics, and smooth animations.

## Features

- **4 Main Screens:**
  - **Home**: View account balance, recent transactions, and quick actions
  - **New Payment**: Send money with quick contact selection and amount presets
  - **Statement**: Browse transaction history with filtering options
  - **Receipt**: View detailed transaction receipts with sharing options

- **Premium Design:**
  - Black/white base with neon-green accent (#00FFAE)
  - Elegant shadows and smooth transitions
  - Styled like Apple Pay meets Revolut
  - Responsive and investor-ready UI

- **Enhanced UX:**
  - Haptic feedback on interactions
  - Smooth animations using React Native Reanimated
  - Offline functionality with mock data
  - Safe area support for modern devices

## Tech Stack

- React Native with Expo SDK 54
- TypeScript for type safety
- Expo Router for navigation
- Expo Haptics for tactile feedback
- Expo Linear Gradient for premium visual effects
- React Native Reanimated for smooth animations

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open the app:
   - Scan the QR code with Expo Go (Android)
   - Scan the QR code with Camera app (iOS)
   - Press `w` to open in web browser
   - Press `a` to open in Android emulator
   - Press `i` to open in iOS simulator

## Project Structure

```
├── app/
│   ├── _layout.tsx       # Tab navigation layout
│   ├── index.tsx         # Home screen
│   ├── payment.tsx       # New Payment screen
│   ├── statement.tsx     # Statement screen
│   └── receipt.tsx       # Receipt screen
├── constants.ts          # Theme colors, spacing, and styles
├── mockData.ts          # Offline mock transaction data
├── types.ts             # TypeScript type definitions
└── assets/              # App icons and images
```

## Mock Data

The app uses offline mock data including:
- Account balance and details
- 10+ sample transactions
- Various transaction categories (Transport, Shopping, Food, etc.)
- Income and expense tracking

## Design System

- **Primary Color**: Black (#000000)
- **Secondary Color**: White (#FFFFFF)
- **Accent Color**: Neon Green (#00FFAE)
- **Typography**: System fonts with various weights
- **Spacing**: Consistent 8px-based spacing scale
- **Border Radius**: Smooth rounded corners (8px-24px)
- **Shadows**: Neon-green tinted shadows for depth

## License

Private project for Helsinki eBike Service Oy
