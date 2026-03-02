# GDS – Design system

React + TypeScript -pohjainen design system. Tyylit (värit, typografia, spacing, radii) Figmasta; komponentit ja teema yhdistetty GDS-pakettiin.

## Käyttöönotto toisessa projektissa (npm)

```bash
npm install @renegademaster-droid/gds @chakra-ui/react @emotion/react next-themes react react-dom
```

Kääri sovelluksen juuri `<Provider>`-komponenttiin:

```tsx
import { Provider } from "@renegademaster-droid/gds"

root.render(
  <Provider>
    <App />
  </Provider>,
)
```

Julkinen API: [docs/PUBLIC-API.md](docs/PUBLIC-API.md). Kirjaston build: `npm run build:lib` (tuottaa `dist/`).

## Esittelysivu (GitHub Pages)

**Vaihtoehto A – GitHub Actions (suositus)**  
Pushaa `main`-haara (tai aja workflow manuaalisesti): Actions buildaa ja deployaa. Repon **Settings → Pages → Build and deployment → Source**: valitse **GitHub Actions**. Sivu: `https://renegademaster-droid.github.io/gdesignsystem/`.

**Vaihtoehto B – gh-pages-haara**  
Aja paikallisesti: `npm run deploy`. Repon **Settings → Pages**: Source **Deploy from a branch**, branch **gh-pages**, folder **/ (root)**.

## Figma-tokenien synkaus

Hae tokenit Figma Desktop MCP:llä (`get_variable_defs`), tallenna vastaus `scripts/figma-response.json` (ja dark-moodille `scripts/figma-response-dark.json`), sitten `npm run sync-figma-tokens`. Yksityiskohtaat: [docs/FIGMA-TOKENS-SUUNNITELMA.md](docs/FIGMA-TOKENS-SUUNNITELMA.md).

## Ikonit (GDS)

Ikonit sijaitsevat `src/assets` (SVG). Käyttö: `import { Icon } from "@/components/icons"` ja `<Icon name="star" color="brand.solid" size="5" />`. Väri käyttää Figman semanttisia tokeneita (esim. `fg.default`, `fg.muted`, `brand.solid`). Ikonit ovat osa GDS-kokonaispakettia; esittelysivulla on osio "Icons (GDS)".

---

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
