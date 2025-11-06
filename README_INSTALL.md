# Installation Guide – install.py

Yritystili – Helsinki eBike Service Oy -sovelluksen asennus- ja käynnistysskripti.

## 📋 Yleiskuvaus

`install.py` on tekstipohjainen Python-skripti, joka helpottaa Expo-projektin asennusta ja käynnistämistä. Skripti tarjoaa sekä interaktiivisen valikon että komentorivi-liput automaatiota varten.

## 🚀 Pikaopas

### Interaktiivinen käyttö

Yksinkertaisesti suorita:

```bash
python3 install.py
```

Tämä näyttää tekstipohjaisen valikon neljällä vaihtoehdolla.

### Automaattinen käyttö (komentoriviliput)

```bash
# Full guided install (automaattinen)
python3 install.py --auto

# Quick start (suora käynnistys)
python3 install.py --quick

# Asenna vain riippuvuudet
python3 install.py --install-only
```

## 📖 Vaihtoehdot

### Option 1: Full Guided Install and Start

**Interaktiivinen**: Valitse `1` valikossa  
**Komentorivi**: `python3 install.py --auto`

Tämä vaihtoehto suorittaa täydellisen ohjatun asennuksen ja käynnistyksen:

1. **Työkalutarkistus**: Tarkistaa että `node`, `npm`, `npx` ja `git` ovat asennettu
2. **Engines-tarkistus**: Validoi `package.json` engines-vaatimukset
3. **Riippuvuuksien asennus**: Asentaa riippuvuudet käyttäen `npm` tai `yarn`
4. **Expo-kirjautuminen**: 
   - Tarkistaa `EXPO_TOKEN` ympäristömuuttuja
   - Tarkistaa olemassa oleva Expo-kirjautuminen
   - Antaa ohjeet kirjautumiseen tarvittaessa
5. **Backend-käynnistys**: 
   - Etsii `server.js` tiedostoa
   - Tarkistaa backend-skriptit `package.json`:sta
   - Antaa ohjeet backendin käynnistämiseen
6. **Expo Dev Server**: Käynnistää `npx expo start --tunnel`
7. **QR-koodi**: Näyttää QR-koodin (jos `pyqrcode` on asennettu)

**Käyttötapaukset**:
- Ensimmäinen asennus uudelle kehittäjälle
- CI/CD-putki (käytä `--auto` lippua)
- Täydellinen ympäristön tarkistus

### Option 2: Quick Start

**Interaktiivinen**: Valitse `2` valikossa  
**Komentorivi**: `python3 install.py --quick`

Nopea käynnistys kehittäjille, joilla riippuvuudet on jo asennettu:

1. Käynnistää suoraan Expo dev-serverin (`npx expo start --tunnel`)
2. Näyttää QR-koodin Expo Go -sovellusta varten

**Käyttötapaukset**:
- Päivittäinen kehitystyö kun riippuvuudet on jo asennettu
- Nopea uudelleenkäynnistys
- Testaus

### Option 3: Install Dependencies Only

**Interaktiivinen**: Valitse `3` valikossa  
**Komentorivi**: `python3 install.py --install-only`

Asentaa vain projektin riippuvuudet:

1. Tarkistaa työkalut (`node`, `npm`, `git`)
2. Asentaa riippuvuudet käyttäen `npm install` tai `yarn install`

**Käyttötapaukset**:
- Riippuvuuksien päivitys
- Ongelmanratkaisu riippuvuusongelmissa
- CI/CD build-vaihe

### Option 4: Exit

**Interaktiivinen**: Valitse `4` valikossa

Poistuu skriptistä ilman toimenpiteitä.

## 🛠️ Vaatimukset

### Pakolliset

- **Python 3.x**: Skriptin suorittamiseen
- **Node.js**: JavaScript runtime (suositeltu v18+)
- **npm**: Node package manager (tulee Node.js:n mukana)
- **npx**: Package runner (tulee Node.js:n mukana)
- **Git**: Versionhallinta

### Valinnaiset

- **Yarn**: Vaihtoehtoinen package manager (npm toimii myös)
- **pyqrcode**: QR-koodin näyttämiseen terminaalissa
  ```bash
  pip install pyqrcode pypng
  ```

## 🎯 Esimerkkejä

### Ensimmäinen asennus

```bash
# Kloonaa repo
git clone https://github.com/AnomFIN/mobilebanks.git
cd mobilebanks

# Suorita full guided install
python3 install.py --auto
```

### Päivittäinen kehitystyö

```bash
# Quick start kun riippuvuudet on jo asennettu
python3 install.py --quick
```

### CI/CD-pipeline

```yaml
# .github/workflows/example.yml
steps:
  - name: Install dependencies
    run: python3 install.py --install-only
  
  - name: Run tests
    run: npm test
```

### Riippuvuuksien päivitys

```bash
# Asenna vain riippuvuudet
python3 install.py --install-only
```

## 🔧 Ominaisuudet

### Työkalutarkistus

Skripti tarkistaa automaattisesti että kaikki vaaditut työkalut ovat asennettu ja näyttää niiden versiot:

```
Tarkistetaan työkalut...
✓ Node.js löytyi (versio: v18.17.0)
✓ npm löytyi (versio: 9.6.7)
✓ npx löytyi (versio: 9.6.7)
✓ Git löytyi (versio: 2.40.0)
```

Jos jokin työkalu puuttuu, skripti antaa asennusohjeet.

### Package Manager -valinta

Skripti valitsee automaattisesti:
- **Yarn**: Jos `yarn` on asennettu JA `yarn.lock` löytyy
- **npm**: Muussa tapauksessa (oletus)

### Expo-kirjautuminen

Skripti tukee useita tapoja Expo-kirjautumiseen:

1. **EXPO_TOKEN ympäristömuuttuja**:
   ```bash
   export EXPO_TOKEN=your_token_here
   python3 install.py --auto
   ```

2. **Olemassa oleva kirjautuminen**:
   Skripti tarkistaa `npx expo whoami`

3. **Manuaalinen kirjautuminen**:
   Skripti antaa ohjeet: `npx expo login`

### QR-koodi

Jos `pyqrcode` on asennettu, skripti näyttää QR-koodin suoraan terminaalissa:

```bash
pip install pyqrcode pypng
python3 install.py --quick
```

Ilman `pyqrcode`:ta Expo näyttää QR-koodin automaattisesti.

### Backend-tuki

Skripti tunnistaa backend-palvelimen:

1. **server.js**: Jos tiedosto löytyy projektin juuresta
2. **Backend-skriptit**: Jos `package.json` sisältää `server` tai `backend` skriptin

Skripti antaa ohjeet backendin käynnistämiseen erikseen.

## 🎨 Värikoodit

Skripti käyttää ANSI-värikoodeja selkeän visuaalisen palautteen antamiseen:

- 🟢 **Vihreä (✓)**: Onnistuneet toiminnot
- 🔴 **Punainen (✗)**: Virheet
- 🟡 **Keltainen (⚠)**: Varoitukset
- 🔵 **Sininen (ℹ)**: Informaatio
- 🟦 **Syaani**: Otsikot ja korostukset

## ❗ Virheiden käsittely

### Työkalu puuttuu

```
✗ Node.js ei löytynyt!
⚠ Varmista että kaikki työkalut on asennettu:
  - Node.js: https://nodejs.org/
  - npm tulee Node.js:n mukana
  - Git: https://git-scm.com/
```

### Riippuvuuksien asennus epäonnistui

```
✗ Riippuvuuksien asennus epäonnistui!
```

Ratkaisuja:
1. Tarkista internet-yhteys
2. Poista `node_modules` ja yritä uudelleen:
   ```bash
   rm -rf node_modules package-lock.json
   python3 install.py --install-only
   ```
3. Tarkista npm-rekisterin saatavuus

### package.json ei löytynyt

```
✗ package.json ei löytynyt!
```

Varmista että suoritat skriptin projektin juurihakemistossa.

## 🔍 Vianmääritys

### Skripti ei käynnisty

```bash
# Tarkista Python-versio
python3 --version

# Pitäisi näyttää Python 3.x
```

### Expo ei käynnisty

```bash
# Tyhjennä Metro bundler cache
npx expo start -c

# Tai käytä skriptiä
python3 install.py --quick
```

### QR-koodi ei näy

```bash
# Asenna pyqrcode
pip install pyqrcode pypng

# Tai anna Expon näyttää QR-koodi
# (Expo näyttää sen joka tapauksessa)
```

### Backend ei käynnisty

Backend on käynnistettävä erikseen:

```bash
# Jos server.js löytyy
node server.js

# Tai jos package.json sisältää backend-skriptin
npm run server
# tai
npm run backend
```

## 📱 Käyttö mobiililaitteella

1. Asenna **Expo Go** -sovellus:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Käynnistä dev-serveri:
   ```bash
   python3 install.py --quick
   ```

3. Skannaa QR-koodi:
   - **iOS**: Käytä Camera-sovellusta
   - **Android**: Käytä Expo Go -sovellusta

## 🚀 CI/CD-integraatio

### GitHub Actions esimerkki

```yaml
name: Build and Test

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.x'
      
      - name: Install dependencies
        run: python3 install.py --install-only
      
      - name: Run tests
        run: npm test
```

### GitLab CI esimerkki

```yaml
stages:
  - install
  - test

install:
  stage: install
  script:
    - python3 install.py --install-only
  artifacts:
    paths:
      - node_modules/

test:
  stage: test
  dependencies:
    - install
  script:
    - npm test
```

## 💡 Vinkkejä

1. **Ensimmäinen asennus**: Käytä `--auto` lippua täydelliseen asennukseen
2. **Päivittäinen kehitys**: Käytä `--quick` lippua nopeaan käynnistykseen
3. **Riippuvuusongelmissa**: Käytä `--install-only` lippua
4. **CI/CD**: Käytä `--install-only` build-vaiheessa
5. **EXPO_TOKEN**: Aseta ympäristömuuttuja automaattista kirjautumista varten

## 🔗 Linkit

- **Projektin README**: [README.md](README.md)
- **Setup-ohje**: [SETUP.md](SETUP.md)
- **Expo dokumentaatio**: https://docs.expo.dev/
- **Node.js**: https://nodejs.org/
- **npm**: https://www.npmjs.com/

## 📞 Tuki

Jos kohtaat ongelmia:

1. Tarkista että kaikki vaatimukset on asennettu
2. Lue virheilmoitukset huolellisesti
3. Kokeile tyhjentää cache: `npx expo start -c`
4. Kokeile asentaa riippuvuudet uudelleen:
   ```bash
   rm -rf node_modules package-lock.json
   python3 install.py --install-only
   ```

---

**Yritystili – Helsinki eBike Service Oy**  
Built with ❤️ using Expo and React Native
