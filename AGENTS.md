# AGENTS.md

## Project Context

Norteens is a career-orientation app for Brazilian teenagers. Treat this as user-owned application code, keep changes focused on the user's request, and preserve existing project conventions.

- **Frontend** (this repo): React + Vite + Tailwind.
- **Backend**: Node/Express + PostgreSQL, in the sibling `../server` directory (a single flat `app.js`, no framework beyond Express — every route repeats its own inline JWT check, there's no router-level auth middleware except `apenasAdmin`).

This app started as a Base44 platform prototype. **That dependency has been fully removed** — there is no Base44 SDK, CLI, hosted backend, or `base44/` project folder anymore. Do not reintroduce Base44 packages, imports, or references to base44.com.

## Key Files

- `src/api/norteensClient.js`: the only API client — talks to the Express backend at `http://localhost:3000`.
- `src/lib/AuthContext.jsx`: auth state, backed by `norteens.me()`.
- `../server/app.js`: all backend routes (auth, perfil, profissões, famosos, comunidade, teste comportamental, feedback, upload, redefinição de senha).
- `../server/conexao.js`: PostgreSQL connection pool.
- `../server/email.js`: Resend-based email sending (password reset).

## Working Notes

- Run the frontend with `npm run dev` (Vite). Run the backend with `node app.js` from `../server` — **not** `npm start` there, which currently points to an unrelated leftover file (`server.js`) with no real routes.
- The behavioral test (`Teste.jsx`) is intentionally deterministic (DISC-style, 4 fixed profiles) — it must never call an LLM or produce a different result for the same answers.
- Run `npm run lint` and `npm run typecheck` before finishing frontend changes.
