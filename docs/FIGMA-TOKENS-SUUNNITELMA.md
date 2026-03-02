# Figma-tokenien integrointi teemaan – suunnitelma

Tavoite: Figman Variables (värit, typografia, spacing jne.) haetaan ja synkataan GDS-teemaan niin, että design system käyttää Figman määrittelyjä.

---

## 1. Dataflow

```
Figma (Variables)
       │
       ▼
get_variable_defs (Figma Desktop MCP)
       │
       ▼
Mapping / muunnos (Figma-polku → teeman rakenne)
       │
       ▼
theme.tokens + theme.semanticTokens (src/theme)
       │
       ▼
GDS-komponentit (colorPalette, textStyle, spacing…)
```

- **Lähde:** Figma-tiedosto, Variables-paneeli. Valinta: koko tiedosto (nodeId tyhjä) tai tietty sivu/frame.
- **Haku:** `get_variable_defs` palauttaa esim. `{ "polku/nimi": arvo }` (väri hex, spacing px/rem jne.).
- **Kohde:** GDS-teeman `theme.tokens` ja tarvittaessa `theme.semanticTokens`.

---

## 2. Nimeäminen: Figma ↔ teema

Käytössä on teeman token-nimeäminen Figmassa.

| Teema (GDS)              | Figma Variable -esimerkki   | Huomio |
|--------------------------|----------------------------|--------|
| `colors.brand.500`       | `colors/brand/500` tai `brand/500` | Väri hex |
| `spacing.4`              | `spacing/4`                | Rem/px |
| `fontSizes.md`           | `fontSizes/md`             | Rem/px |
| `fontWeights.semibold`   | `fontWeights/semibold`     | 400, 600… |
| `fonts.body`             | `fonts/body`               | Font family -nimi |
| `radii.md`               | `radii/md`                 | Rem/px |
| `lineHeights.normal`     | `lineHeights/normal`       | Lukuarvo tai rem |

- Figma käyttää usein **polkumerkintää** (slash tai piste). Mapping-funktio muuntaa esim. `colors/brand/500` → `tokens.colors.brand.500`.
- Arvot: värit → hex/rgb, mitat → rem (teema käyttää rem) tai numeerinen (lineHeight).

---

## 3. Token-kategoriat

Mitä synkataan (prioriteetti):

| Kategoria        | theme.tokens        | Figma Variable -tyyppi | Huomio |
|------------------|---------------------|-------------------------|--------|
| **colors**       | `tokens.colors`     | COLOR                   | Raw + semanttiset (brand.solid jne.) |
| **spacing**      | `tokens.spacing`    | FLOAT (px/rem)          | 0, 1, 2, 4, 6, 8… |
| **fontSizes**    | `tokens.fontSizes`  | FLOAT                   | xs, sm, md, lg… |
| **fontWeights**  | `tokens.fontWeights` | FLOAT                   | normal, medium, semibold… |
| **fonts**        | `tokens.fonts`      | STRING                  | body, heading, mono |
| **lineHeights**  | `tokens.lineHeights`| FLOAT / STRING          | normal, tall, short… |
| **radii**        | `tokens.radii`      | FLOAT                   | none, sm, md, lg, full |
| **letterSpacings** | `tokens.letterSpacings` | FLOAT               | Vapaaehtoinen |
| **shadows**      | `tokens.shadows`    | STRING / COMPLEX         | Vapaaehtoinen |
| **durations**    | `tokens.durations`  | FLOAT                   | Animaatiot |

Aloitus: **colors**, **spacing**, **fontSizes**, **fontWeights**, **fonts**, **lineHeights**, **radii**.

---

## 4. Semanttiset tokenit (värit)

- Figma Variables on usein **vain raakoja** (esim. `brand/500`).
- Teema tarvitsee **semanttiset** (brand.solid, brand.contrast…) jotta `colorPalette="brand"` toimii.

Vaihtoehdot:

- **A)** Figmassa määritellään myös semanttiset (esim. `brand/solid` → sama arvo kuin 600). Mapping suoraan semanticTokens.colors.brand.
- **B)** Semantiikka jää koodiin: raaka värit Figmasta → teemaan; semanticTokens.brand (solid, contrast, fg…) lasketaan tai määritellään paikallisesti (kuten nyt brand-semantiikka).

Suositus alkuun: **B** – raaka brand-värit Figmasta, semanttiset säilyvät teemassa (säännöt: solid = 600, contrast = white jne.).

---

## 5. Tiedostorakenne

Vaihtoehdot:

| Vaihtoehto | Kuvaus |
|------------|--------|
| **A) Yksi teematiedosto** | Kaikki `src/theme/index.ts`. Figman tokenit kopioidaan/kirjoitetaan sinne (manuaalisesti tai scriptillä). |
| **B) Eroteltu tokens + teema** | `src/theme/figma-tokens.ts` (tai .json) – Figmasta haetut raakat arvot. `index.ts` lukee nämä ja kutsuu `defineTokens` / `defineSemanticTokens`. |
| **C) JSON export + build** | Figma Variables → JSON (manuaali tai API). Build-vaiheessa skripti lukee JSONin ja generoi `figma-tokens.ts` tai päivittää teeman. |

Suositus: **B** – `src/theme/figma-tokens.ts` (tai JSON) sisältää haetut arvot; `index.ts` rakentaa teeman niistä. Synkointi tehdään kerran kerrallaan (Cursor + MCP) tai pienen skriptin kautta.

Esimerkkirakenne:

```
src/theme/
  index.ts           # createSystem(defaultConfig, figmaThemeConfig)
  figma-tokens.ts    # raaka data: figmaColors, figmaSpacing, figmaTypography…
  map-figma-to-chakra.ts  # (vapaaehtoinen) polku → teema-objekti
```

---

## 6. Synkointitapa

| Tapa | Toiminta | Hyvä kun |
|------|----------|----------|
| **Automaattinen (Cursor)** | Pyydä: **"get_variable_defs ja päivitä figma-tokens"**. Assistant kutsuu MCP:n, tallentaa tuloksen `scripts/figma-response.json` ja ajaa `npm run sync-figma-tokens` → `figma-tokens.ts` päivittyy. | Joka kerta kun haet tokenit. |
| **Manuaalinen (skripti)** | 1) Kutsu get_variable_defs Cursorissa. 2) Kopioi vastaus → `scripts/figma-response.json`. 3) Aja `npm run sync-figma-tokens`. | Jos et pyydä assistantia tekemään kaikkea. |

Toistaiseksi synkaus on **MCP-pohjaista** (Figma Desktop -plugin / get_variable_defs). Figma REST API Variables vaatii Enterprise-tilin.

---

## 7. Mapping-sääntöjä (Figma → teema)

- **Polku:** `"colors/brand/500"` → `colors.brand.500` (objektirakenne).
- **Arvot:**  
  - Väri: hex säilyy (tarkista että Figma palauttaa hex).  
  - Pituudet: Figma px → rem (esim. 16 → `"1rem"`) jos teema odottaa rem.
- **Puuttuvat:** Jos jokin token puuttuu Figmasta, käytetään defaultConfig-arvoa (merge).

---

## 8. Toteutusvaiheet

1. **Päätös nimeämisestä Figmassa**  
   Vahvista Variables-ryhmät ja nimet (esim. `colors/brand/50` … `colors/brand/950`, `spacing/1` … `spacing/24`).

2. **Hae yksi esimerkkidata**  
   Kutsu `get_variable_defs` (Figma auki, oikea tiedosto). Tallenna vastaus ja tarkista avainten muoto (polut) ja arvot (tyyppi).

3. **Luo `figma-tokens`-rakenne**  
   - Tiedosto: `src/theme/figma-tokens.ts` (tai .json).  
   - Struktuuri: esim. `figmaColors`, `figmaSpacing`, `figmaFontSizes`… oikeilta nimiltään.

4. **Mapping-funktio**  
   Muuntaa figma-tokens-objektin teeman `defineTokens`-kutsujen argumenteiksi (nested `{ value: "..." }`). Voit tehdä yhden generoivan funktion per kategoria (colors, spacing, …).

5. **Integroi teemaan**  
   `index.ts`: luo `figmaThemeConfig` figma-tokenista (defineConfig + defineTokens), merge defaultConfigin kanssa createSystem(defaultConfig, figmaThemeConfig). Brand-semantiikka pysyy (tai tulee Figmasta jos valitset A).

6. **Dokumentoi käyttö**  
   Lyhyt README tai kommentti: miten Figma-tokenit haetaan ja miten synkaus tehdään (manuaali vs. skripti).

7. **(Myöhemmin)** Automaattinen synkaus  
   Jos haluat: Figma Plugin tai Node-skripti + API key → päivittää `figma-tokens.ts` tai JSON.

---

## 9. Yhteenveto

| Asia | Päätös / suositus |
|------|--------------------|
| Nimeäminen | Teema-yhteensopiva Figma (colors/brand/500, spacing/4, …). |
| Semantiikka (värit) | Raaka värit Figmasta; brand-semantiikka (solid, contrast…) teemassa koodissa. |
| Tiedostot | `src/theme/figma-tokens.ts` + `index.ts` käyttää niitä. |
| Synkaus | Aluksi manuaalinen (get_variable_defs → päivitä figma-tokens). Skripti myöhemmin. |
| Kategoriat | Aloitetaan: colors, spacing, fontSizes, fontWeights, fonts, lineHeights, radii. |

Seuraava konkreettinen askel: **hae get_variable_defs -tulos** yhdestä Figma-tiedostostasi ja tarkista avainten muoto; sen jälkeen voidaan kirjoittaa mapping ja `figma-tokens.ts`-rakenne tarkalleen.

---

## 10. Dark-tila ja _dark-mäppäykset

Teema käyttää semanttisissa tokeneissa arvoja `_light` ja `_dark`; color mode määrittää kumpi tulee käyttöön.

### Nykyinen logiikka (`map-figma-to-chakra.ts`)

- **Figma antaa vain light-arvot** (yksi arvo per token, esim. `bg/default`, `text/fg`). Synkassa ei ole erillisiä dark-muuttujia.
- **Brand-semantiikka:** `ensureBrandSemantic` asettaa sekä `_light` että `_dark` (esim. brand.solid, brand.subtle) raaka brand-paletin perusteella.
- **bg, fg, border:** Jos Figmasta tulee vain `_light`, funktio `ensureDarkSemantic` täydentää puuttuvan `_dark`-arvon gray- ja statuspalettien viittauksilla (esim. bg.default → gray.950, fg → gray.50, border.default → gray.700).
- **Muut paletit (gray, red, blue, …):** `ensurePaletteDarkSemantic` täydentää paletin semantiikan `_dark`-arvot saman paletin tummilla shadeilla (esim. subtle → 800, muted → 700).

### Figma Variables – dark-tokenit (toteutettu)

Mapping lukee Figman semanttiset dark-tokenit, kun ne ovat mukana `get_variable_defs` -vastauksessa.

**Tuetut avainmuodot:**

- **Suffiksi _dark:** sama polku + `_dark`, esim. `bg/default_dark`, `text/fg_muted_dark`, `border/subtle_dark`, `gray/fg_dark`.
- **Polku /dark:** sama polku + `/dark`, esim. `bg/default/dark`, `text/fg/dark`.

Esim. Figmassa voit määritellä Variables-kokoelmassa Light- ja Dark-moodit. Jos export (tai MCP) antaa dark-arvot erillisinä avaimina, käytä jompaa kumpaa muodosta. Synkissä (`sync-figma-tokens.js`) dark-avaimet säilyvät; `mapFigmaSemanticColors` asettaa `_dark`-arvon, kun löytää light-avaimen ja vastaavan dark-avaimen.

Jos dark-arvoa ei löydy Figmasta, käytetään edelleen koodissa olevaa fallbackia (`ensureDarkSemantic` / `ensurePaletteDarkSemantic`).

### Testaus

- Dark-tila vaatii GDS:n color mode -vaihtimen (esim. `ColorModeProvider`). Teeman semanttiset tokenit käyttävät jo `_dark`-arvoja, kun color mode on dark.
