# Reach Handbook

Code for my application https://play.google.com/store/apps/details?id=dev.misha98857.react_article

## Quick Start

1. Clone project

```bash
git clone https://github.com/misha98857/react-handbook.git
```

2. Install dependencies

```bash
npm install
```

3. Run local server

```bash
npm start
```

## Build android app

1. Build application and sync with android folder

```bash
npm run sync
```

2. Open android studio by command

```bash
npm run android
```

## Roadmap

I have a really tight deadline. Here are some planned changes related to cleaning up the project:

1. Remove all void/async/await from the project. It's Angular with RxJS, and these should be avoided.
2. Move all dispatches from widgets/pages to the feature slice.
3. Fix some known issues and make the code cleaner.
