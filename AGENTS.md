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
- `../server/conexao.js`: PostgreSQL connection pool (has a `pool.on('error')` handler — keep it, or a dropped idle connection crashes the API).
- `../server/email.js`: Resend-based email sending (password reset). The Resend SDK returns `{ error }` instead of throwing — always check it.
- `../server/schema.sql`: the full, idempotent database schema. Update it whenever a route needs a new table/column.
- `C:\dev\postgres\`: local PostgreSQL 18 (data in `data\`, binaries in `pgsql\`, start/stop via `iniciar-banco.cmd` / `parar-banco.cmd`). It is not a Windows service.

## Working Notes

- Start the DB with `C:\dev\postgres\iniciar-banco.cmd`, the backend with `npm start` (or `npm run dev`) in `../server`, the frontend with `npm run dev` here.
- Never start PostgreSQL with a bare `pg_ctl start` from a terminal that will close: new backend processes then fail with `0xC0000142` and every connection resets. `iniciar-banco.cmd` launches it in its own console via `Start-Process` for that reason.
- User roles are only `usuario` and `admin` (enforced by a CHECK constraint). Base44-era `"dono"` / `role` checks are gone — use `papel === "admin"`.
- The behavioral test (`Teste.jsx`) is intentionally deterministic (DISC-style, 4 fixed profiles) — it must never call an LLM or produce a different result for the same answers.
- Run `npm run lint` before finishing frontend changes (must pass clean). `npm run typecheck` reports ~190 type-annotation gaps in the untyped JS UI components; ignore those, but treat any `TS2304 Cannot find name` as a real bug.
