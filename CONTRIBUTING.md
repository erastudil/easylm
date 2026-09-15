# Contributing

EasyLM is a browser app. Chat, memory, and Studio stay on the device that opened the tab. The official copy stays $0. Donations only. AGPL-3.0-or-later.

## License

Patches are AGPL-3.0-or-later. You keep your copyright. We do not ask you to sign it over.

Sign every commit with the Developer Certificate of Origin:

```
Signed-off-by: Name <email>
```

A pull request that tries to move this tree to MIT, Apache, a dual license, or a corporate CLA will be closed.

## Run

Node 18+, npm 9+.

```
npm install
npm test
```

`npm test` compiles the Stacks and courses, then runs vitest. A pane that ships has a test, or a one-line reason it cannot.

Local glass: `npm run dev`. Production bundle: `npm run build`.

## What a patch is

Hands that can run offline stay offline unless the user turned a network door on. Quiz keys live in `src/data/answers_compiled.ts` and never enter a model prompt. Layout wraps onto the next row; the page scrolls vertically. Button labels are nouns: Studio, Learn, History.

Studio lessons introduce the mechanism in ordinary words, then the name.

`COVENANT.md` is the $0 line. A patch that adds a company seat or a paywall on the official app is off this gift.

## First patches

Issues labeled `good first issue`. Typical work: a Studio walk that fails, a Hands call that 403s on a new origin, a wrap bug on a narrow window.

## Security

Report XSS, SSRF, or PIN bypass to **humansandai@atomicmail.io**. Do not file those as public issues until a fix is out. `SECURITY.md` is the rest.
