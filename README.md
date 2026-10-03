# Norteens

Aplicativo de orientação de carreira para adolescentes brasileiros.

- **Frontend** (este repositório): React + Vite + Tailwind.
- **Backend**: Node/Express + PostgreSQL, em `../server` (repositório separado).

## Abrir o site no seu PC (jeito fácil)

Dois cliques em **`C:\dev\Abrir Norteens.cmd`**. Ele liga o banco, a API e o site e abre o navegador
em `http://localhost:5173`. Fechar a janela dele desliga o site.

## Colocar online

Passo a passo em [`../server/DEPLOY.md`](../server/DEPLOY.md) (Render + Neon, grátis).
O endereço da API vem da variável `VITE_API_URL` (o Render preenche sozinho); sem ela, o site usa
`http://localhost:3000`.

## Rodando localmente (passo a passo manual)

1. **Ligue o banco**: dê dois cliques em `C:\dev\postgres\iniciar-banco.cmd`.
   Ele abre o PostgreSQL numa janela minimizada ("PostgreSQL Norteens") — deixe-a aberta
   enquanto usar o app. Para desligar, `C:\dev\postgres\parar-banco.cmd`.
   (O banco não liga sozinho com o Windows: rode o `iniciar-banco.cmd` depois de reiniciar o PC.)
2. Instale as dependências do frontend: `npm install`.
3. Suba o backend (em outro terminal, dentro da pasta `server`):
   ```bash
   npm start        # ou: npm run dev  (reinicia sozinho ao salvar arquivos)
   ```
   Ele escuta em `http://localhost:3000`.
4. Suba o frontend:
   ```bash
   npm run dev
   ```
   Abra a URL local impressa pelo Vite (normalmente `http://localhost:5173`).

O frontend fala com o backend por um único cliente, `src/api/norteensClient.js`, que aponta para `http://localhost:3000`.

## Banco de dados

- Dados em `C:\dev\postgres\data` (PostgreSQL 18, ordenação `pt-BR`), binários em `C:\dev\postgres\pgsql`.
- O schema completo está em `server/schema.sql` (pode ser rodado de novo sem estragar nada):
  ```bash
  psql -U postgres -h localhost -d norteens_dev -f schema.sql
  ```
- Para tornar alguém admin: `UPDATE usuarios SET papel = 'admin' WHERE email = '...';`
- Para ver os dados no pgAdmin: servidor `localhost`, porta `5432`, usuário `postgres`,
  senha = `DB_PASSWORD` do `server/.env`.

## Variáveis de ambiente do backend

Configuradas em `server/.env`:

- `DB_PASSWORD`: senha do Postgres local.
- `JWT_SECRET`: segredo usado para assinar os tokens de login.
- `RESEND_API_KEY`: chave da conta no [Resend](https://resend.com), usada para enviar o e-mail de redefinição de senha.
- `EMAIL_FROM`: remetente dos e-mails (ex: `Norteens <onboarding@resend.dev>`).
- `FRONTEND_URL`: URL do frontend, usada para montar o link de redefinição de senha.

## Scripts úteis

- `npm run lint` / `npm run lint:fix`
- `npm run typecheck` — hoje acusa ~190 avisos de tipo nos componentes de interface
  (`src/components/ui`), que são JavaScript sem tipagem; não são bugs. Use para pegar
  erros como "Cannot find name" (variável inexistente), que esses sim são bugs.
- `npm run build` / `npm run preview`
