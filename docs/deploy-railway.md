# Site de teste no Railway

Guia para colocar o VagasPlus no ar para testes. O projeto já traz o `Dockerfile`, o `railway.json` e a pasta `deploy/`.

> **Custo.** O Railway não é gratuito para sempre: o cadastro dá um crédito único de US$ 5 válido por 30 dias; depois, o plano Free dá US$ 1 por mês de crédito, ou o Hobby custa US$ 5/mês com US$ 5 de uso incluído. Confira os valores atuais em <https://railway.com/pricing>. Acompanhe **Usage** no painel para não ser surpreendido.

## O que vai para o ar

- O site com o banco de exemplo `deploy/seed/database.sqlite`, uma cópia do seu banco local **sem** usuários, sessões, envios de vaga e sem a chave do Gemini. Para gerar de novo: `php deploy/make-seed.php`.
- O banco e os logos enviados ficam num **volume** (`/data`), então sobrevivem a novos deploys. A cópia de exemplo só é usada na primeira vez.
- O agendador (`schedule:work`) roda dentro do contêiner.

## Passo a passo

1. **Gere o `APP_KEY`** (uma vez, na sua máquina):
   ```
   php artisan key:generate --show
   ```
   Guarde o valor (`base64:...`).

2. **Envie o código para um repositório privado no GitHub.** O projeto ainda não é um repositório git:
   ```
   git init
   git add .
   git status        # confira: .env e database/database.sqlite NÃO devem aparecer
   git commit -m "Primeiro commit"
   ```
   Crie o repositório **privado** no GitHub e faça o `git push`.

3. **No Railway:** *New Project → Deploy from GitHub repo* e escolha o repositório. O Railway usa o `Dockerfile` sozinho.

4. **Volume:** no serviço, *Settings → Volumes → Add Volume*, com o ponto de montagem **`/data`**.

5. **Variáveis** (aba *Variables*):

   | Variável | Valor |
   |---|---|
   | `APP_KEY` | o valor do passo 1 |
   | `TRUSTED_PROXIES` | `*` |
   | `ADMIN_EMAIL` | seu e-mail de admin |
   | `ADMIN_PASSWORD` | senha com **12+ caracteres** |
   | `GEMINI_API_KEY` | sua chave do Gemini (para as ferramentas de IA) |
   | `APP_URL` | a URL pública, depois do passo 6 (ex.: `https://xxxx.up.railway.app`) |

6. **Domínio:** *Settings → Networking → Generate Domain*. Copie a URL para `APP_URL` e faça um novo deploy (*Redeploy*).

7. **Teste:** abra `/up` (deve responder OK), `/vagas` e `/admin/login`.

## Observações

- **Uma réplica só.** O SQLite no volume não suporta várias instâncias ao mesmo tempo.
- **Economizar crédito:** o Railway tem a opção de "dormir" o serviço quando não há acesso (*Settings → Serverless*, se disponível no seu plano). Dormindo, o primeiro acesso demora alguns segundos.
- **AdSense:** no banco de exemplo ele está **desligado**. Não ative anúncios num domínio de teste.
- **Logs:** saem no painel do Railway (*Deployments → View logs*).
- **Se o deploy falhar**, copie o log de build/deploy: esta imagem não pôde ser construída na máquina onde foi escrita, então pode precisar de um pequeno ajuste.
