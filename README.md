# React Handbook

Code for my application https://play.google.com/store/apps/details?id=dev.misha98857.react_article

## Tech stack

- **Angular 21** (standalone components, signals, esbuild builder `@angular/build:application`)
- **Ionic 8** + **Capacitor 8** (Android target)
- **@ngrx/signals** stores
- **@ngx-translate** i18n
- **Vitest 4** + **@analogjs/vitest-angular** + **jsdom** for unit tests
- **ESLint 9** (flat config) + Prettier
- **TypeScript 5.9**

Build output: `www/` (consumed by Capacitor).

## Quick start (Docker)

The easiest way to start the dev server is via docker-compose. Make sure
[Docker](https://www.docker.com/products/docker-desktop/) is installed:

```bash
git clone https://github.com/misha98857/react-handbook.git
cd react-handbook
docker compose up
```

Then open http://localhost:9000.

## Local development

Requires Node.js 20+ and npm.

```bash
git clone https://github.com/misha98857/react-handbook.git
cd react-handbook
npm install
npm start                 # dev server on http://localhost:4200 (development configuration)
```

Run the app with live-reload on a connected Android device/emulator:

```bash
npm run android:liveserver
```

## Production build

```bash
npm run build             # ng build --configuration=production -> www/
```

## Build & install Android app

```bash
npm run sync              # production build + npx ionic capacitor sync
npm run android-studio    # opens the android/ project in Android Studio
```

Then build the APK / AAB from Android Studio.

## Tests

Unit tests run on **Vitest** with the Analog Angular plugin (jsdom environment).
The suite covers stores (`src/store/**`), services (`src/features/services/**`)
and pipes (`src/shared/**/pipes/**`).

```bash
npm test                  # vitest in watch mode
npm run test:run          # single CI run
npm run test:coverage     # single run + v8 coverage report into ./coverage
```

Coverage thresholds (statements / branches / functions / lines): **80 / 75 / 80 / 80**.
Configuration lives in `vitest.config.ts`; the test bootstrap is `src/test-setup.ts`.

## Linting

```bash
npm run lint              # ESLint 9 flat config (eslint.config.js)
```

## Content

Article content is generated from the official React documentation sources
(`reactjs/react.dev` and its localized forks) by the pipeline under
`scripts/content/`. Supported locales: **en, ru, es, fr, ja, ko, tr, pt-br,
uk, zh-hans**.

Structure of the generated JSON:

```json5
[
  {
    key: 'Learn React', // Topic title
    values: [
      {
        key: 'learn', // Stable slug (used as URL id)
        title: 'Quick Start', // Subtopic title
        value: '<article>...</article>', // Subtopic HTML
        path: '/react/learn', // Page path
        nav: [
          '/react', // Previous page
          '/react/learn-thinking-in-react', // Next page
        ],
        examples: ['learn-001', 'learn-002'], // Sandpack example ids (optional)
      },
    ],
  },
]
```

### Content pipeline

```bash
npm run content:install                   # one-time: install scripts/content/ deps
npm run content:fetch                     # shallow-clone all supported locales
npm run content:fetch -- --lang en        # or a subset
npm run content:build -- --lang en        # render MDX -> articles.json + examples.json
npm run content:build -- --lang en --section learn --max 10
npm run content:validate                  # cross-check every locale
```

Generated artefacts live under `src/shared/assets/articles/react/` (one
`<lang>.articles.json` and `<lang>.examples.json` per locale) and
`src/shared/assets/images/react/` (referenced assets).

### Interactive code playground

`<Sandpack>` examples from react.dev are rendered as inline placeholders. Tapping
one opens a lazy-loaded modal that executes the snippet inside a sandboxed
`<iframe>` using bundled React UMD + `@babel/standalone`. Examples that require
extra npm packages fall back to an "Open in CodeSandbox" link.

```bash
npm run playground:vendors                # one-time: download React + Babel UMD
```

Assets land in `src/shared/assets/playground/vendor/`.

## Project layout

```
src/
  app/                 # bootstrap, root component, theme
  pages/               # route-level components (articles, article, menu, search, ...)
  widgets/             # reusable UI blocks
  features/services/   # injectable services (LanguageService, ArticlesService, ...)
  store/               # @ngrx/signals stores
  shared/              # pipes, translate, assets, common helpers
  entities/            # domain models / DTOs
  test-setup.ts        # Vitest bootstrap (Zone + Angular TestBed env)
```

## License

This product is licensed under
the [GNU General Public License v3.0](https://github.com/misha98857/react-handbook/blob/main/LICENSE).
