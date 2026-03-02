# GDS – julkinen API (npm-paketti)

Mitä paketista exportataan, jotta käyttäjä voi ottaa GDS:n käyttöönsä mahdollisimman helposti.

---

## Yksi komento + yksi kääre

Käyttöönotto on kaksi askelta:

1. **Yksi asennuskomento** (projektin juuressa):
   ```bash
   npm install @gofore/gds @chakra-ui/react @emotion/react next-themes react react-dom
   ```

2. **Yksi kääre koodissa** – kääri sovelluksen juuri `<Provider>`-komponenttiin (esim. `main.tsx` tai `_app.tsx`).

Sen jälkeen GDS on käytössä: teema (Figma-tokenit), dark/light-väritila, Toaster ja **ikonit**. Ikonit tulevat paketin mukana: `Icon`-komponentti ja kaikki GDS-ikonit (SVG) ovat osa pakettia – käyttäjän ei tarvitse asentaa erikseen mitään ikoneihin.

---

## Käyttöönotto (koodi)

```tsx
import { Provider } from "@gofore/gds"

root.render(
  <Provider>
    <App />
  </Provider>,
)
```

`Provider` sisältää: GDS-teeman (Figma-tokenit), dark/light-väritilan ja Toasterin. Tämän jälkeen sovellus käyttää GDS-tyylejä.

---

## Exportit

| Export | Käyttö |
|--------|--------|
| **Provider** | Käärii koko sovelluksen (teema + color mode + toaster). **Tarvitaan aina.** |
| **system** | GDS-teema; käytetään vain jos haluat oman providerin (edellyttää teeman injektoinnin). |
| **Icon** | GDS-ikonit (Figma-värit). **Ikonit tulevat paketin mukana** – kaikki SVG-ikonit on sisällytetty. `<Icon name="star" color="brand.solid" size="5" />` |
| **iconNames** | Lista ikonien nimistä (esim. `"star"`, `"user"`). |
| **ColorModeButton** | Valmis dark/light-vaihtonappi. |
| **useColorMode** | Hook: `colorMode`, `setColorMode`, `toggleColorMode`. |
| **useColorModeValue** | Hook: arvo light/dark-moodin mukaan. |

Tyypit: **IconName**, **IconProps**, **ColorMode**, **UseColorModeReturn**, **ColorModeProviderProps** (tarvittaessa).

---

## Peer-dependencies (käyttäjän asentaa)

```
@chakra-ui/react
@emotion/react
next-themes
react
react-dom
```

---

## Yhteenveto

Tarpeellinen minimi: **Provider** + halutessaan **Icon** (ikonit mukana paketissa), **ColorModeButton** ja **useColorMode** / **useColorModeValue**. Muuta ei tarvita käyttöönottoon.
