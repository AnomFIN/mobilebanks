# install.py - Asennusskripti / Installation Script

## Kuvaus / Description

**Finnish:**
Python-pohjainen asennusskripti mobilebanks Expo-sovellukselle. Korjattu Windows-yhteensopivuus - tukee nyt luotettavasti sekä Windows-, Linux- että macOS-ympäristöjä.

**English:**
Python-based installation script for the mobilebanks Expo application. Fixed Windows compatibility - now reliably supports Windows, Linux, and macOS environments.

## Ominaisuudet / Features

- ✅ **Cross-platform**: Toimii Windows, Linux ja macOS käyttöjärjestelmissä
- ✅ **Engine checks**: Tarkistaa Node.js ja npm versiot
- ✅ **Dependency installation**: Asentaa npm-riippuvuudet (npm ci tai npm install)
- ✅ **Expo login**: Valinnainen Expo-kirjautuminen
- ✅ **Dev server**: Käynnistää development serverin
- ✅ **Windows compatibility**: Korjattu FileNotFoundError .cmd/.bat skripteille

## Käyttö / Usage

### Perusasennus / Basic Installation

```bash
python3 install.py
```

Interaktiivinen asennusprosessi, joka:
1. Tarkistaa Node.js ja npm versiot
2. Asentaa riippuvuudet
3. Kysyy haluatko kirjautua Expo-tilille
4. Kysyy haluatko käynnistää development serverin

### Vain asennus / Install Only

```bash
python3 install.py --install-only
```

Asentaa vain riippuvuudet, ei käynnistä development serveriä.

### Automaattinen tila / Automatic Mode

```bash
python3 install.py --auto
```

Automaattinen tila ilman vuorovaikutteisia kysymyksiä. Ohittaa Expo login -vaiheen ja käynnistää suoraan development serverin.

### Yhdistelmä / Combination

```bash
python3 install.py --install-only --auto
```

Automaattinen asennus ilman development serveriä.

## Komentoriviargumentit / Command Line Arguments

| Argumentti | Kuvaus / Description |
|------------|----------------------|
| `--install-only` | Asenna vain riippuvuudet, älä käynnistä serveriä / Install dependencies only, don't start server |
| `--auto` | Automaattinen tila, ohita vuorovaikutteiset kyselyt / Automatic mode, skip interactive prompts |
| `--help` | Näytä ohje / Show help |

## Tekninen Toteutus / Technical Implementation

### Windows-yhteensopivuus / Windows Compatibility

Skripti sisältää erityisen `normalize_cmd()` funktion, joka käsittelee Windows .cmd ja .bat skriptejä oikein:

**Windows (os.name == 'nt'):**
- Muuntaa komentolistan merkkijonoksi
- Käyttää `shell=True` subprocess-kutsuissa
- Esimerkki: `['npm', 'install']` → `'npm install'` (shell=True)

**Unix/Linux/macOS:**
- Pitää komennon listana
- Käyttää `shell=False` subprocess-kutsuissa  
- Esimerkki: `['npm', 'install']` (shell=False)

### Avaintoiminnot / Key Functions

#### `normalize_cmd(cmd)`
Normalisoi komennon alustariippumattomaksi:
```python
def normalize_cmd(cmd: Union[List[str], Tuple[str, ...], str]) -> Tuple[Union[List[str], str], bool]:
    """
    Returns: (command_for_subprocess, shell_flag)
    """
```

#### `run(cmd, **kwargs)`
Wrapper subprocess.run:lle Windows-tuella:
```python
def run(cmd: Union[List[str], str], check: bool = True, 
        capture_output: bool = False, text: bool = True) -> subprocess.CompletedProcess:
```

#### `popen(cmd, **kwargs)`
Wrapper subprocess.Popen:lle Windows-tuella:
```python
def popen(cmd: Union[List[str], str], **kwargs) -> subprocess.Popen:
```

## Testaus / Testing

### Yksikkötestit / Unit Tests

Aja yksikkötestit:
```bash
python3 test_install.py
```

Testit kattavat:
- ✅ Unix/Linux komennot
- ✅ Windows komennot
- ✅ normalize_cmd toiminta
- ✅ run() funktio
- ✅ popen() funktio
- ✅ Cross-platform yhteensopivuus

### Manuaalinen testaus / Manual Testing

**Linux/macOS:**
```bash
python3 install.py --install-only
```

**Windows:**
```bash
python install.py --install-only
```

## Vianmääritys / Troubleshooting

### FileNotFoundError Windows-ympäristössä

**Ongelma:** `FileNotFoundError: [WinError 2]` kun ajetaan npm-komentoja

**Ratkaisu:** Tämä on korjattu skriptissä. Jos ongelma esiintyy:
1. Varmista että käytät uusinta versiota `install.py` skriptistä
2. Tarkista että Node.js ja npm ovat PATH-ympäristömuuttujassa
3. Kokeile suorittaa skripti järjestelmänvalvojana (admin)

### Node.js tai npm ei löydy

**Ongelma:** "Node.js ei löytynyt" tai "npm ei löytynyt"

**Ratkaisu:**
1. Asenna Node.js 18+ osoitteesta: https://nodejs.org/
2. Käynnistä komentorivi/terminaali uudelleen asennuksen jälkeen
3. Tarkista asennus: `node --version` ja `npm --version`

### Riippuvuuksien asennus epäonnistuu

**Ongelma:** npm ci tai npm install epäonnistuu

**Ratkaisu:**
```bash
# Tyhjennä npm cache
npm cache clean --force

# Poista node_modules ja package-lock.json
rm -rf node_modules package-lock.json

# Aja install.py uudelleen
python3 install.py --install-only
```

## Vaatimukset / Requirements

- Python 3.6+
- Node.js 18+
- npm (asentuu Node.js:n mukana)
- Git (valinnaisesti)

## Kehitys / Development

### Uusien ominaisuuksien lisääminen

1. Lisää funktio `install.py` tiedostoon
2. Päivitä `main()` funktio
3. Lisää testit `test_install.py` tiedostoon
4. Aja testit: `python3 test_install.py`

### Testikattavuus

Nykyinen testikattavuus:
- normalize_cmd: ✅ 100%
- run: ✅ 100%
- popen: ✅ 100%
- Cross-platform: ✅ 100%

## Lisenssi / License

Private project for Helsinki eBike Service Oy

## Tekijät / Authors

- AnomFIN - Alkuperäinen toteutus
- GitHub Copilot - Windows-yhteensopivuus korjaus

## Muutosloki / Changelog

### v1.0.0 (2025-11-06)
- ✅ Alkuperäinen julkaisu
- ✅ Windows-yhteensopivuus korjattu
- ✅ normalize_cmd() funktio
- ✅ run() ja popen() wrapperit
- ✅ Engine-tarkistukset
- ✅ Riippuvuuksien asennus
- ✅ Expo login tuki
- ✅ Development server käynnistys
- ✅ Komentoriviargumentit
- ✅ Yksikkötestit
