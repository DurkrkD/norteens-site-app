# Norteens

Aplicativo de orientação de carreira para adolescentes brasileiros.

- **Frontend** (este repositório): React + Vite + Tailwind.
- **Backend**: Node/Express + PostgreSQL, em `../server` (repositório separado).

## Rodando localmente

1. Instale as dependências do frontend: `npm install`.
2. Suba o backend (em outro terminal, dentro da pasta `server`):
   ```bash
   node app.js
   ```
   Ele escuta em `http://localhost:3000`. **Não use `npm start`** nessa pasta — hoje ele aponta para um arquivo antigo (`server.js`) sem relação com a API real.
3. Suba o frontend:
   ```bash
   npm run dev
   ```
   Abra a URL local impressa pelo Vite (normalmente `http://localhost:5173`).

O frontend fala com o backend por um único cliente, `src/api/norteensClient.js`, que aponta para `http://localhost:3000`.

## Variáveis de ambiente do backend

Configuradas em `server/.env`:

- `DB_PASSWORD`: senha do Postgres local.
- `JWT_SECRET`: segredo usado para assinar os tokens de login.
- `RESEND_API_KEY`: chave da conta no [Resend](https://resend.com), usada para enviar o e-mail de redefinição de senha.
- `EMAIL_FROM`: remetente dos e-mails (ex: `Norteens <onboarding@resend.dev>`).
- `FRONTEND_URL`: URL do frontend, usada para montar o link de redefinição de senha.

## Scripts úteis

- `npm run lint` / `npm run lint:fix`
- `npm run typecheck`
- `npm run build` / `npm run preview`
