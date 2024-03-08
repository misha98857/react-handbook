# Reach Handbook

Code for my application https://play.google.com/store/apps/details?id=dev.misha98857.react_article

## Quick Start

The easiest way to start running the server with the application is by running our docker-compose file. Before executing
the installation command, make sure you have [Docker](https://www.docker.com/products/docker-desktop/) installed on your
machine:

1. Clone the project:

```bash
git clone https://github.com/misha98857/react-handbook.git
```

2. Start the development server:

```bash
docker compose up
```

3. Go to http://localhost:9000 to access the application from your browser.

## Development

1. Clone the project:

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

## TODO

1. Migrate to [SignalStore](https://ngrx.io/guide/signals/signal-store)
2. Move article title to the article body
3. Add a "Return to Home" button in the header

## License

This product is licensed under
the [GNU General Public License v3.0](https://github.com/misha98857/react-handbook/blob/main/LICENSE).
