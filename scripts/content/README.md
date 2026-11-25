# Content pipeline

This folder contains the build-time pipeline that converts the upstream
[react.dev](https://github.com/reactjs/react.dev) MDX sources (plus the
localized forks) into the `*.articles.json` / `*.examples.json` bundles
consumed by the Angular app.

## Layout

````
scripts/content/
├── sources/               # cloned react.dev repos (git-ignored)
│   └── en/                # reactjs/react.dev
│   └── ru/                # reactjs/ru.react.dev
│   └── ...
├── fetch-sources.mjs      # shallow-clone / fast-forward every locale
├── build-articles.mjs     # MDX → HTML emitter (per locale)
├── locales.json           # declared locales + upstream repos + pinned ref
├── lib/
│   ├── mdx.mjs            # unified pipeline factory
│   ├── sidebar.mjs        # sidebarLearn/sidebarReference → ArticleGroup[]
│   ├── slug.mjs           # /learn/x → /react/learn-x, link rewriting
│   └── transformers/
│       ├── callouts.mjs   # Note/Pitfall/DeepDive/Gotcha/Wip
│       ├── code.mjs       # ```jsx``` → .gatsby-highlight (Prism-ready)
│       ├── sandpack.mjs   # <Sandpack> → placeholder + examples-store entry
│       ├── console-block.mjs
│       ├── challenges.mjs
│       └── misc.mjs       # <Intro>, <YouWillLearn>, <LearnMore>, ...
└── package.json           # pipeline-local deps, isolated from the Angular app

staging output: src/shared/assets/articles/react-dev/<lang>.articles.json
                src/shared/assets/articles/react-dev/<lang>.examples.json
````

## Commands

Run from the repo root (they proxy into `scripts/content/`):

```bash
npm run content:install   # one-off: install pipeline-local deps
npm run content:fetch     # clone / fast-forward every declared locale
npm run content:build     # build all locales                (staging)
npm run content:build -- --lang en   # build a single locale
npm run content:validate  # schema + dead-link check on the staging output
npm run content:promote   # move staging JSONs into src/shared/assets/articles/react/
```

The pipeline is **decoupled** from the Angular `package.json` so that the
MDX toolchain (unified / remark-mdx / rehype / refractor) does not leak into
the mobile bundle. It has its own `node_modules/` under
`scripts/content/node_modules/`.

## Locales

See `scripts/content/locales.json`. Only locales with an actively maintained
`*.react.dev` fork are declared:

| Locale  | Upstream                  |
| ------- | ------------------------- |
| en      | reactjs/react.dev         |
| ru      | reactjs/ru.react.dev      |
| es      | reactjs/es.react.dev      |
| ja      | reactjs/ja.react.dev      |
| ko      | reactjs/ko.react.dev      |
| zh-hans | reactjs/zh-hans.react.dev |
| tr      | reactjs/tr.react.dev      |
| fr      | reactjs/fr.react.dev      |
| pt-br   | reactjs/pt-br.react.dev   |
| uk      | reactjs/uk.react.dev      |

Missing pages in a localized fork fall back to the English source (marked
with `"fallback": true` in the emitted JSON).
