# Yritystili – Helsinki eBike Service Oy

A stunning, investor-ready mobile banking application built with Expo Go featuring a premium fintech UI design inspired by Apple Pay and Revolut.

## 🎨 Design Highlights

- **Minimalist Fintech Aesthetic**: Clean, modern interface with premium feel
- **Dark Theme**: Black background (#000000) with white text for elegance
- **Neon-Green Accents**: Vibrant #00FFAE for CTAs and highlights
- **Elegant Shadows**: Subtle neon-green glows for depth
- **Smooth Animations**: 60fps animations using React Native Reanimated
- **Haptic Feedback**: Tactile responses on all interactions
- **Responsive Design**: Safe area support for modern devices

## 📱 Features

### 4 Complete Screens

1. **Home Screen**
   - Account balance overview with gradient card
   - Quick actions (Send, Request, Exchange, Top Up)
   - Recent transaction list
   - Profile access

2. **New Payment Screen**
   - Available balance display
   - Quick contact selection
   - Payment form with recipient, amount, and message
   - Quick amount presets (€10, €25, €50, €100)
   - Large Send CTA button

3. **Statement Screen**
   - Income/expense summary cards
   - Filterable transaction list (All, Income, Expenses)
   - Detailed transaction information
   - Category and date metadata

4. **Receipt Screen**
   - Professional digital receipt
   - Transaction details with QR code
   - Share, Download, and Print options
   - Company branding

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Expo Go app on your mobile device ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Installation

#### Vaihtoehto A: Käyttöönotto-assistentti (suositeltu)

Käytä `install.py`-skriptiä helppoon ja ohjattuun asennukseen:

1. **Clone the repository**
   ```bash
   git clone https://github.com/AnomFIN/mobilebanks.git
   cd mobilebanks
   ```

2. **Käynnistä käyttöönotto-assistentti**
   ```bash
   python3 install.py
   ```

   Valitse valikosta:
   - **1) Full guided install and start** - Tarkistaa työkalut, asentaa riippuvuudet ja käynnistää serverin
   - **2) Quick start** - Käynnistää serverin suoraan (vaatii asennetut riippuvuudet)
   - **3) Install dependencies only** - Asentaa vain riippuvuudet
   - **4) Exit** - Poistu

3. **Tai käytä komentoriviliput**
   ```bash
   # Automaattinen asennus ja käynnistys
   python3 install.py --auto
   
   # Nopea käynnistys
   python3 install.py --quick
   
   # Asenna vain riippuvuudet
   python3 install.py --install-only
   ```

4. **Scannaa QR-koodi**
   - Expo Go -sovelluksella (Android)
   - Kamerasovelluksella (iOS)

#### Vaihtoehto B: Manuaalinen asennus

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

4. **Open on your device**
   - Scan the QR code with Expo Go (Android)
   - Scan the QR code with your Camera app (iOS)

### Alternative Launch Methods

```bash
# Open in web browser
npm run web

# Open in Android emulator
npm run android

# Open in iOS simulator (macOS only)
npm run ios
```

## 🏗️ Project Structure

```
mobilebanks/
├── app/                      # Expo Router screens
│   ├── _layout.tsx          # Tab navigation
│   ├── index.tsx            # Home screen
│   ├── payment.tsx          # New Payment screen
│   ├── statement.tsx        # Statement screen
│   └── receipt.tsx          # Receipt screen
├── assets/                   # Images and icons
├── types/                    # TypeScript declarations
│   └── vector-icons.d.ts    # Icon type definitions
├── constants.ts             # Theme (colors, spacing, shadows)
├── mockData.ts              # Offline transaction data
├── types.ts                 # TypeScript interfaces
├── babel.config.js          # Babel configuration
├── app.json                 # Expo configuration
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript configuration
├── README.md                # This file
├── UI_DESIGN.md             # Detailed UI documentation
└── FEATURES.md              # Feature documentation
```

## 🎯 Key Technologies

- **Expo SDK 54**: Latest Expo framework
- **React Native 0.81**: Cross-platform mobile framework
- **TypeScript**: Type safety and better DX
- **Expo Router**: File-based navigation
- **Expo Haptics**: Tactile feedback
- **Expo Linear Gradient**: Beautiful gradients
- **React Native Reanimated**: Smooth 60fps animations
- **React Native Safe Area Context**: Proper safe area handling
- **@expo/vector-icons**: Icon library

## 📊 Mock Data

The app includes offline mock data:
- **Account**: €12,847.50 balance with Finnish IBAN
- **Transactions**: 10+ realistic transactions including:
  - eBike rentals and subscriptions
  - Salary deposits
  - Shopping expenses
  - Restaurant bills
  - Utility payments
  - Freelance income

## 🎨 Design System

### Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Black | `#000000` | Background |
| White | `#FFFFFF` | Primary text |
| Neon Green | `#00FFAE` | Accents, CTAs |
| Dark Gray | `#0A0A0A` | Card backgrounds |
| Gray | `#1A1A1A` | Secondary backgrounds |
| Light Gray | `#333333` | Borders |

### Typography
- **XXXL**: 48px (Large amounts)
- **XXL**: 32px (Primary amounts)
- **XL**: 24px (Section headers)
- **LG**: 18px (Screen titles)
- **MD**: 16px (Body text)
- **SM**: 14px (Secondary text)
- **XS**: 12px (Metadata)

### Spacing
Based on 8px grid: 4px, 8px, 16px, 24px, 32px, 48px

## 🎬 Animations

### Scale Animation
- **Usage**: Button presses, card taps
- **Duration**: 200ms (100ms down + 100ms up)
- **Scale**: 1.0 → 0.95 → 1.0

### Fade Animation
- **Usage**: Content switching (filters)
- **Duration**: 300ms (150ms out + 150ms in)
- **Opacity**: 1.0 → 0.3 → 1.0

## 📳 Haptic Feedback

- **Light Impact**: Navigation, list items
- **Medium Impact**: Primary actions, quick actions
- **Success Notification**: Payment sent, downloads

## 📖 Documentation

- **[README.md](README.md)**: This file - setup and overview
- **[UI_DESIGN.md](UI_DESIGN.md)**: Comprehensive UI design documentation
- **[FEATURES.md](FEATURES.md)**: Detailed feature documentation

## 🔒 Security

This is a demo app with mock data:
- ✅ No security vulnerabilities (CodeQL verified)
- ✅ No external API calls
- ✅ No sensitive data storage
- ⚠️ Not production-ready (no real authentication)

For production, you would need:
- Biometric authentication
- Encrypted storage
- Secure API communication
- Transaction signing
- Account verification

## 🧪 Testing

### Manual Testing Checklist
- [ ] Navigate between all 4 tabs
- [ ] Test balance card animation
- [ ] Test quick actions
- [ ] Fill and submit payment form
- [ ] Test quick contact selection
- [ ] Test quick amount buttons
- [ ] Switch between statement filters
- [ ] View transaction details
- [ ] Test receipt share functionality
- [ ] Verify haptic feedback (physical device only)

### TypeScript Check
```bash
npx tsc --noEmit
```

## 🐛 Troubleshooting

### Metro bundler issues
```bash
# Clear cache and restart
npx expo start -c
```

### Dependency issues
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
```bash
# Check compilation
npx tsc --noEmit
```

### Platform-specific issues
- **Haptics**: Only work on physical devices (not simulators)
- **Web**: Some features like haptics don't work on web
- **iOS**: Requires macOS for iOS simulator

## 📱 Device Compatibility

- **iOS**: 13.0+
- **Android**: 5.0+ (API level 21+)
- **Web**: Modern browsers (Chrome, Safari, Firefox, Edge)

## 📄 License

Private project for Helsinki eBike Service Oy

## 👨‍💻 Development

### Available Scripts

```bash
npm start         # Start Expo development server
npm run android   # Open on Android
npm run ios       # Open on iOS
npm run web       # Open in web browser
```

### Code Quality

- TypeScript for type safety
- Consistent code style
- Component-based architecture
- Proper error handling
- Comprehensive documentation

## 🌟 Highlights

✅ **4 complete screens** with full functionality  
✅ **Premium UI design** matching Apple Pay + Revolut  
✅ **Smooth 60fps animations** with Reanimated  
✅ **Haptic feedback** on all interactions  
✅ **Offline-first** with mock data  
✅ **Type-safe** with TypeScript  
✅ **Well-documented** code and features  
✅ **Zero security vulnerabilities**  
✅ **Investor-ready** presentation  

## 🚀 Next Steps

To extend this app:
1. Integrate with a real backend API
2. Add authentication (biometric/PIN)
3. Implement real payment processing
4. Add push notifications
5. Create budget tracking features
6. Add card management
7. Implement recurring payments
8. Add transaction search
9. Create export functionality
10. Add multi-currency support

## 📞 Support

For questions or issues:
- Check the documentation files
- Review the TypeScript errors with `npx tsc --noEmit`
- Clear Metro cache with `npx expo start -c`
- Reinstall dependencies if needed

---

**Built with ❤️ using Expo and React Native**

Designed for Helsinki eBike Service Oy | Yritystili Banking App
