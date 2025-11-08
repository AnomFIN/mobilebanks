# SumUp Mobile Banking App

A polished, frontend-only mobile banking UI built with React Native, Expo, and TypeScript, featuring a modern white/blue/cyan color theme.

## Features

- **Modern UI Design**: Clean white background with blue (#0A84FF) primary color and cyan (#00D1FF) accent
- **Premium Components**: Gradient cards, smooth animations, and soft shadows
- **Complete Screens**:
  - **Etusivu (Home)**: Balance card, quick actions, recent transactions
  - **Maksut (Payments)**: Contact picker, amount presets, success modal
  - **Raportit (Reports)**: Summary cards, range picker, category breakdown
  - **Asetukset (Settings)**: Account info, preferences, toggles
  - **Kuitti (Receipt)**: Transaction details with QR code and share functionality

## Tech Stack

- **React Native**: 0.81.5
- **Expo**: ~54.0.22
- **TypeScript**: ~5.9.2
- **Navigation**: expo-router 6.0.14
- **Animations**: React Native Animated API & react-native-reanimated 4.1.3
- **UI Components**: expo-linear-gradient, expo-haptics

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo Go app (on your mobile device) or iOS Simulator / Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AnomFIN/mobilebanks.git
   cd mobilebanks
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device**
   - Scan the QR code with Expo Go app (Android) or Camera app (iOS)
   - Or press `i` for iOS simulator or `a` for Android emulator

## Project Structure

```
mobilebanks/
├── app/                      # Expo Router screens
│   ├── _layout.tsx          # Navigation layout with tabs
│   ├── index.tsx            # Home screen (Etusivu)
│   ├── payment.tsx          # Payment screen (Maksut)
│   ├── raportit.tsx         # Reports screen (Raportit)
│   ├── asetukset.tsx        # Settings screen (Asetukset)
│   └── receipt.tsx          # Receipt screen (Kuitti)
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Card.tsx        # Gradient card with animations
│   │   └── HeaderBar.tsx   # SumUp branded header
│   ├── context/            # React Context providers
│   │   └── AccountContext.tsx
│   ├── screens/            # Screen components (also in app/)
│   │   ├── Raportit.tsx
│   │   └── Asetukset.tsx
│   └── theme/              # Theme configuration
│       └── theme.tsx       # Colors, spacing, typography
├── types.ts                # TypeScript type definitions
└── mockData.ts             # Mock transaction data
```

## Key Features

### Theme System
- Custom theme provider with light/dark mode support (visual only)
- Consistent color palette, spacing, and typography
- Reusable style constants

### Animations
- Smooth entry animations for cards
- Interactive button feedback with haptics
- Modal transitions

### Accessibility
- Proper accessibility labels on all interactive elements
- High contrast color combinations
- Screen reader support

## Mock Data

All data is mocked locally - no backend integration. The app demonstrates:
- Account balance and transactions
- Payment creation (updates local state)
- Transaction history filtering
- Reports and analytics

## Important Notes

- **Frontend Only**: This is a UI-only implementation with no backend, API calls, or persistence
- **No Secrets**: No API keys, environment variables, or sensitive data
- **Mock Data**: All transactions and account info are hardcoded for demonstration
- **Theme**: Optimized for light mode with white/blue/cyan color scheme

## Development

### TypeScript
The project uses TypeScript for type safety. Check types with:
```bash
npx tsc --noEmit
```

### Linting
```bash
# Add if you have eslint configured
npm run lint
```

## Screenshots

*(Screenshots would go here when available)*

## License

This project is for demonstration purposes.

## Contact

For questions or issues, please contact the repository owner.
