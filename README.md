BTC Bot

A stunning Node mobile banking app with a minimalist fintech UI design, featuring offline mock data, haptics, and smooth animations.

<img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
<img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />

---

## 🚀 CryptoVault v1.03 - Web Demo

**CryptoVault** on ammattimainen krypto lompakko demo C-A-T (Cryptocurrency Automated Trading) automaattikaupankäynnillä. Tämä on staattinen UI-demo joka toimii GitHub Pagesilla ilman backend-integraatiota.

### 🔗 Käynnistä Demo

Avaa selaimessa: `web/crypto-v103.html`

```bash
# Yksinkertainen käynnistys (avaa tiedosto selaimessa)
open web/crypto-v103.html

# Tai käytä paikallista palvelinta
python3 -m http.server 8080
# Sitten avaa: http://localhost:8080/web/crypto-v103.html
```

### 🔐 Demo-kirjautuminen

- **Käyttäjänimi:** `demo`
- **Salasana:** `demo123`

### ✨ CryptoVault v1.03 Ominaisuudet

| Ominaisuus | Kuvaus |
|------------|--------|
| 🔐 **Login/Register** | Mock-autentikaatio localStoragella |
| 💰 **Portfolio** | BTC-saldo 6-8 desimaalin tarkkuudella |
| 📈 **Portfolio Chart** | Satunnainen demo-käyrä (24h/7pv toggle) |
| 🤖 **C-A-T System** | Automaattinen arbitraasikaupankäynti |
| 💳 **Buy/Sell/Swap** | Kaupankäynti modalit validaatiolla |
| ↑↓ **Send/Receive** | Siirrot mock JSON-backendillä |
| 🎨 **Dark Theme** | Tumma teema oletuksena |
| 🇫🇮 **Suomi** | Koko UI suomeksi |
| 📥 **CSV Export** | Vie tapahtumat CSV-tiedostona |
| 🧪 **Simulate** | Simuloi 1 viikon kehitys |
| ⌨️ **Pikanäppäimet** | P=Portfolio, T=Trade, W=Wallet |

### 📁 Mock Database

Demo käyttää `data/mock_db.json` + localStorage synkronointia:

```json
{
  "users": [{ "id": "user_1", "username": "demo", ... }],
  "wallets": {
    "main": { "btc": 0.52341234 },
    "cat": { "btc": 0.12345678 }
  },
  "transactions": [...],
  "cat_activity": [...],
  "prices": { "BTC": { "mock_eur": 89000 } }
}
```

**Kuinka mock-data toimii:**
1. Ensin ladataan `data/mock_db.json`
2. Jos localStorage sisältää muutoksia, ne ylikirjoittavat JSON-datan
3. Kaikki muutokset (transaktiot, asetukset) tallennetaan localStorageen
4. "Palauta demo-tila" nollaa localStoragen

### 🧪 QA Testaus

1. **Verkkoviive simulaatio**: Asetukset → "Simuloi verkkoviive" toggle
2. **Manuaalinen hinnan muokkaus**: Kauppa-sivulla "Muokkaa hintaa" työkalu
3. **Tapahtumasimulttori**: Historia → "Simuloi 1 viikon kehitys"

### ⚠️ Huomioitavaa

- Tämä on **DEMO** - ei oikeaa kryptovaluuttaa
- GitHub Pages ei salli server-side kirjoituksia → localStorage käytössä
- Mock API-kutsut simuloivat 400-1200ms viivettä (valinnainen)
- Kaikki sensitive-kentät ovat demoa varten

---

## ✨ Features

### 4 Main Screens
- **Home**: View account balance, recent transactions, and quick actions
- **New Payment**: Send money with quick contact selection and amount presets
- **Statement**: Browse transaction history with filtering options
- **Receipt**: View detailed transaction receipts with sharing options

### Premium Design
- Black/white base with neon-green accent (#00FFAE)
- Elegant shadows and smooth transitions
- Styled like Apple Pay meets Revolut
- Responsive and investor-ready UI

### Enhanced UX
- Haptic feedback on interactions
- Smooth animations using React Native Reanimated
- Offline functionality with mock data
- Safe area support for modern devices

## 🚀 Quick Start

### Vaihtoehto 1: Käyttöönotto-assistentti (suositeltu)

Käytä `install.py`-skriptiä helppoon asennukseen ja käynnistykseen:

```bash
# Interaktiivinen valikko
python3 install.py

# Tai suoraan automaattinen asennus
python3 install.py --auto

# Nopea käynnistys (jos riippuvuudet on jo asennettu)
python3 install.py --quick

# Asenna vain riippuvuudet
python3 install.py --install-only
```

Skripti tarjoaa seuraavat toiminnot:
- **Full guided install and start**: Tarkistaa työkalut, asentaa riippuvuudet ja käynnistää Expo serverin
- **Quick start**: Käynnistää Expo serverin suoraan (olettaa riippuvuudet asennetuksi)
- **Install dependencies only**: Asentaa vain npm-riippuvuudet

### Vaihtoehto 2: Manuaalinen asennus

```bash
# Install dependencies
npm install

# Start development server
npm start

# Scan QR code with Expo Go app
```

**Alternative**: Use the Python installation script for automatic port conflict handling:
```bash
python3 install.py
```
This script automatically handles port conflicts on Windows and other platforms.

**Detailed instructions**: See [SETUP.md](SETUP.md)

### Web Version Quick Start

Launch the web version with a simple launcher:

**Windows Users:** See [WINDOWS_QUICK_START.md](WINDOWS_QUICK_START.md) for step-by-step guide

```bash
# Windows: Double-click
Launch_Web_Server.bat

# Or run Python script directly
python3 launch_web_server.py
```

Choose between:
- **Local network** - Access via localhost or local IP
- **Public internet** - Share via ngrok tunnel

**Documentation:**
- [WINDOWS_QUICK_START.md](WINDOWS_QUICK_START.md) - Complete Windows guide with troubleshooting
- [WEB_LAUNCHER_README.md](WEB_LAUNCHER_README.md) - Technical documentation for all platforms

## 📚 Documentation

- **[README_INSTALL.md](README_INSTALL.md)**: install.py käyttöohjeet / Install.py script guide (tekstipohjainen valikko, Windows-parannukset, porttikäsittely)
- **[SETUP.md](SETUP.md)**: Complete setup guide and quick start
- **[WEB_LAUNCHER_README.md](WEB_LAUNCHER_README.md)**: Web server launcher guide (local & public access)
- **[README_INSTALL.md](README_INSTALL.md)**: install.py käyttöohjeet (tekstipohjainen valikko, Windows-parannukset, porttikäsittely)
- **[INSTALL_SCRIPT.md](INSTALL_SCRIPT.md)**: Python installation script documentation (vanha versio)
- **[UI_DESIGN.md](UI_DESIGN.md)**: Comprehensive UI design documentation
- **[FEATURES.md](FEATURES.md)**: Detailed feature documentation

## 🎨 Design System

| Element | Value |
|---------|-------|
| Primary Color | Black (#000000) |
| Secondary Color | White (#FFFFFF) |
| Accent Color | Neon Green (#00FFAE) |
| Font Sizes | 12px - 48px |
| Spacing | 4px - 48px (8px grid) |
| Border Radius | 8px - 24px |

## 🏗️ Tech Stack

- React Native with Expo SDK 54
- TypeScript for type safety
- Expo Router for navigation
- Expo Haptics for tactile feedback
- Expo Linear Gradient for premium visual effects
- React Native Reanimated for smooth animations

## 📊 Mock Data

The app uses offline mock data including:
- Account balance: €12,847.50
- 10+ sample transactions (eBike rentals, salary, shopping, etc.)
- Various transaction categories
- Income and expense tracking

## 📱 Screenshots

The app features:
- **Home Screen**: Balance card with gradient, quick actions, recent transactions
- **Payment Screen**: Contact selection, amount input, quick presets
- **Statement Screen**: Income/expense cards, filterable transaction list
- **Receipt Screen**: Professional receipt with QR code, share options

## 🔒 Security

- ✅ Zero security vulnerabilities (CodeQL verified)
- ✅ No external API calls
- ✅ Type-safe TypeScript implementation
- ⚠️ Demo app - not production-ready

## 🎯 Project Goals

Created to demonstrate:
- Modern React Native development
- Premium UI/UX design
- Smooth animations and haptics
- Proper TypeScript typing
- Offline-first architecture
- Professional code organization

## 📄 License

Private project for Helsinki eBike Service Oy

---

**Built with ❤️ using Expo and React Native**

