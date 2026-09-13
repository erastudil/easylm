# Security

Report vulnerabilities to **humansandai@atomicmail.io**.
Do not file public GitHub issues for SSRF, XSS, or auth bypasses until we have a fix out.

## What we mean

- Chat tokens are generated in the browser.
- Optional Hands send the lookup you asked for to a public API via this origin's `/api/*` routes or a CORS endpoint.
- Parental PIN is a salted PBKDF2 hash in `localStorage`. It is a household speed-bump. DevTools on this device can still wipe it.

## Known residual

`/api/fetch` is wiki-hosts only (Wikipedia, Wikiquote, Wikisource) and requires a browser Origin on the allowlist. A DNS-rebinding host with a 0-TTL swap between lookup and connect is still a theoretical race on those wiki names. Do not point Hands at untrusted short-TTL names.

## Scope

In scope: `https://easylm.vercel.app`, this repository, `/api/*`.
Out of scope: model weight hosts, third-party search instances you configure, social-engineering the PIN off a shared computer.
