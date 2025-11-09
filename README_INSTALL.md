# install.py - Käyttöohjeet

Tekstipohjainen asennus- ja käynnistysskripti Expo/Node -projektille.

## Ominaisuudet

### Tekstipohjainen valikko
Skripti tarjoaa interaktiivisen valikon neljällä vaihtoehdolla:

1. **Full guided install and start** (oletus)
   - Tarkistaa Node.js ja npm asennuksen
   - Tarkistaa package.json engines-vaatimukset
   - Asentaa riippuvuudet (npm ci / npm install / yarn install)
   - Tarkistaa Expo-kirjautumisen (EXPO_TOKEN tai `expo whoami`)
   - Käynnistää backendin jos löytyy (backend/server/api -hakemisto)
   - Käynnistää Expo dev-serverin ja näyttää QR-koodin
   - Käsittelee porttikonflikti automaattisesti (interaktiivinen vahvistus)

2. **Quick start (no input)**
   - Käynnistää Expo dev-serverin suoraan
   - Ei asenna riippuvuuksia (olettaa jo asennetuksi)
   - Automaattinen porttien käsittely (ei interaktiivisia kysymyksiä)

3. **Install dependencies only**
   - Tarkistaa Node.js ja npm
   - Asentaa vain riippuvuudet
   - Ei käynnistä sovellusta

4. **Exit**
   - Poistuu ohjelmasta

### Komentorivivaihtoehdot (liput)

Skripti tukee myös automaattista suoritusta ilman interaktiivista valikkoa:

```bash
# Automaattinen full guided install
python3 install.py --auto

# Nopea käynnistys (olettaa riippuvuudet asennetuksi)
python3 install.py --quick

# Asenna vain riippuvuudet
python3 install.py --install-only
```

### Windows-yhteensopivuus

Skripti on parannettu toimimaan Windowsissa ilman `FileNotFoundError`-virheitä:

- `normalize_cmd(cmd)` funktio muuttaa komentolistat merkkijonoiksi Windowsissa
- `shell=True` käytetään Windowsissa, jotta npm/npx (.cmd/.bat) löytyvät
- `popen()` ja `run()` apufunktiot käyttävät `normalize_cmd`:ia automaattisesti

## Käyttö

### Interaktiivinen valikko (suositeltu)

```bash
python3 install.py
```

Skripti näyttää valikon ja kysyy mitä haluat tehdä. Oletus on vaihtoehto 1 (Full guided install).

### Automaattinen asennus ja käynnistys

```bash
python3 install.py --auto
```

Suorittaa täydellisen asennuksen ja käynnistyksen ilman kysymyksiä.

### Nopea käynnistys

```bash
python3 install.py --quick
```

Käynnistää Expo dev-serverin suoraan. Olettaa että riippuvuudet on jo asennettu.

### Vain riippuvuuksien asennus

```bash
python3 install.py --install-only
```

Asentaa vain npm-riippuvuudet ilman sovelluksen käynnistystä.

## Porttikonflikti

### Automaattinen käsittely

Skripti tunnistaa automaattisesti jos Expo-portti (oletus 8081) on jo käytössä:

- **Interaktiivisessa tilassa** (`--auto` tai vaihtoehto 1): Kysyy käyttäjältä hyväksynnän seuraavan portin käyttöön
- **Ei-interaktiivisessa tilassa** (`--quick` tai vaihtoehto 2): Yrittää automaattisesti seuraavaa porttia

Skripti yrittää enintään 3 porttia (8081, 8082, 8083).

### Manuaalinen portin valinta

Jos haluat käyttää tiettyä porttia, voit käynnistää Expon manuaalisesti:

```bash
# Käynnistä Expo portilla 8082
npx expo start --port 8082

# Käynnistä Expo tunnel-tilassa portilla 8082
npx expo start --tunnel --port 8082
```

### Portin vapauttaminen

Jos portti on jumissa, voit vapauttaa sen:

**Linux/macOS:**
```bash
# Etsi prosessi portilla 8081
lsof -ti:8081

# Tapa prosessi
kill -9 $(lsof -ti:8081)
```

**Windows (PowerShell):**
```powershell
# Etsi prosessi portilla 8081
netstat -ano | findstr :8081

# Tapa prosessi (korvaa <PID> prosessi-ID:llä)
taskkill /PID <PID> /F
```

## Expo-kirjautuminen

Skripti tukee kahta tapaa kirjautua Expoon:

### 1. EXPO_TOKEN ympäristömuuttuja

```bash
# Aseta EXPO_TOKEN (suositeltu CI/CD-ympäristöissä)
export EXPO_TOKEN="your-expo-token"

# Suorita skripti
python3 install.py --auto
```

### 2. Interaktiivinen kirjautuminen

Kun suoritat `--auto` tai vaihtoehdon 1, skripti:
1. Tarkistaa onko EXPO_TOKEN asetettu
2. Tarkistaa onko jo kirjautunut (`npx expo whoami`)
3. Kysyy haluatko kirjautua (`npx expo login`)

Kirjautuminen ei ole pakollinen kehityksessä.

## QR-koodi

Skripti yrittää näyttää QR-koodin terminalissa, jotta voit skannata sen Expo Go -sovelluksella.

### QR-koodin riippuvuudet

```bash
# Asenna Python-paketit (jos puuttuvat)
pip install pyqrcode pypng
```

Skripti asentaa nämä automaattisesti jos puuttuvat.

## Backend-käynnistys

Jos projektissa on backend-hakemisto (`backend/`, `server/`, `api/`), skripti yrittää käynnistää sen automaattisesti:

- Jos löytyy `package.json` ja `start`-skripti: `npm run start`
- Muuten etsii entry pointia: `index.js`, `server.js`, `app.js`

Backend käynnistetään taustalla samaan aikaan Expo-serverin kanssa.

## Riippuvuudet

Skripti yrittää asentaa riippuvuudet seuraavassa järjestyksessä:

1. **npm ci** (jos `package-lock.json` löytyy)
2. **npm install** (jos npm löytyy)
3. **yarn install** (jos `yarn.lock` löytyy ja yarn on asennettu)

## Ongelmatilanteet

### "Node.js ei löydy"
- Asenna Node.js: https://nodejs.org/
- Suositeltu versio: 18.x tai uudempi

### "npm ei löydy"
- npm tulee yleensä Node.js:n mukana
- Varmista että Node.js on asennettu oikein

### "Riippuvuuksien asennus epäonnistui"
- Tarkista internet-yhteys
- Tyhjennä npm cache: `npm cache clean --force`
- Poista `node_modules` ja yritä uudelleen: `rm -rf node_modules && npm install`

### "Expo-käynnistys epäonnistui"
- Tarkista että riippuvuudet on asennettu: `python3 install.py --install-only`
- Varmista että portti 8081 on vapaa (tai käytä `--port`)
- Tarkista Expo-versio: `npx expo --version`

### FileNotFoundError Windowsissa (vanha versio)
- Päivitetty versio korjaa tämän automaattisesti
- Käytä `normalize_cmd()` ja `popen()`/`run()` funktioita

## Esimerkkejä

### Ensimmäinen asennus
```bash
# Interaktiivinen asennus ja käynnistys
python3 install.py

# Valitse: 1 (Full guided install and start)
```

### Päivittäinen kehitys
```bash
# Nopea käynnistys (riippuvuudet jo asennettu)
python3 install.py --quick
```

### CI/CD-ympäristö
```bash
# Automaattinen asennus ilman interaktiota
export EXPO_TOKEN="your-token"
python3 install.py --auto
```

### Vain riippuvuuksien päivitys
```bash
# Asenna/päivitä riippuvuudet
python3 install.py --install-only
```

## Lisätietoja

- Paina `Ctrl+C` lopettaaksesi sovelluksen
- Skripti sulkee automaattisesti Expo-serverin ja backendin (jos käynnistetty)
- Kaikki virheet ja varoitukset näytetään terminaalissa

## Kehittäjille

### normalize_cmd(cmd)
Palauttaa tuplen `(cmd_for_subprocess, shell_flag)`:
- Windowsissa: lista → merkkijono, `shell=True`
- Unix: lista → lista, `shell=False`

### popen(cmd, ...)
Käynnistää prosessin käyttäen `normalize_cmd`:ia. Palauttaa `subprocess.Popen`.

### run(cmd, ...)
Suorittaa komennon käyttäen `normalize_cmd`:ia. Palauttaa `(returncode, output)`.

---

**Tekijät:** Helsinki eBike Service Oy  
**Versio:** 2.0 (Windows-parannukset ja porttikäsittely)
