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

## Content structure

```json5
[
  {
    key: 'Installation', // Topic title
    values: [
      {
        key: 'Getting Started', // Subtopic title
        value: '<div>html content</div>', // Subtopic content
        path: '/react/getting-started', // Page path
        nav: [
          '/react', // Previous page
          '/react/add-react-to-a-website', // Next page
        ],
      },
    ],
  },
]
```

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
