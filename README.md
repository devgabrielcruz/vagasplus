# VagasPlus

Portal brasileiro de vagas: área pública (busca, listagem, página da vaga compartilhável) e painel administrativo (`/admin`) com ciclo de vida completo das vagas, incluindo expiração automática.

**Stack:** Laravel 13 · Inertia 3 + Vue 3 (TypeScript, SSR) · Tailwind CSS 4 · Lucide · Vite · MySQL (produção) / SQLite (desenvolvimento e testes) · PHPUnit.

## Instalação (desenvolvimento)

```bash
composer install
npm install
cp .env.example .env && php artisan key:generate
touch database/database.sqlite          # SQLite local (padrão do .env.example de dev)
php artisan migrate:fresh --seed        # (migrations foram ajustadas: recrie o banco local)
# cria tabelas + categorias iniciais
php artisan admin:create voce@exemplo.com --name="Seu Nome"   # pede a senha (mín. 12 caracteres)
php artisan db:seed --class=DemoJobsSeeder   # OPCIONAL: vagas fictícias (recusa rodar em produção)
npm run build && php artisan serve      # ou: npm run dev
```

Painel: `http://localhost:8000/admin/login`. Não existe cadastro público; administradores só são criados via `admin:create`.

## Banco de dados: MySQL em produção

No `.env` de produção:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=vagasplus
DB_USERNAME=...
DB_PASSWORD=...
```

A extensão `pdo_mysql` do PHP é necessária. As migrations e consultas são portáveis (sem SQL específico de SQLite). **Atenção:** o desenvolvimento e os testes foram executados em SQLite; rode `php artisan migrate` e a suíte de testes contra um MySQL de homologação antes de ir ao ar.

## Expiração e agendamento (obrigatório em produção)

Duas rotinas rodam pelo scheduler do Laravel (`routes/console.php`):

| Comando | Frequência | Função |
|---|---|---|
| `php artisan jobs:publish-scheduled` | a cada minuto | publica vagas agendadas cujo horário chegou |
| `php artisan jobs:expire` | a cada 5 minutos | marca como expiradas as vagas vencidas (idempotente) |

Configure **um único** cron no servidor:

```
* * * * * cd /caminho/do/projeto && php artisan schedule:run >> /dev/null 2>&1
```

Mesmo que o cron falhe, o site não exibe vagas vencidas: todas as consultas públicas filtram por `status`, `published_at <= agora` e `expires_at > agora` (`JobPosting::scopeActive`). O cron apenas mantém status, histórico e painel consistentes.

## Regras de ciclo de vida

Estados: rascunho → agendada → publicada → expirada → arquivada. Toda mudança passa por `App\Services\JobLifecycle`:

- Uma vaga expirada **nunca** volta sozinha: só por *Renovar*, com confirmação explícita de que continua aberta (registrada no histórico).
- Validade padrão 30 dias e máxima 90 (editáveis em `/admin/configuracoes`); presets 7/15/30/60 ou data personalizada.
- Vaga expirada: URL responde 200 com página de "oportunidade encerrada" (`noindex`, sem botão de candidatura, sem `JobPosting`, com vagas semelhantes). Vaga arquivada: 410. Rascunho/agendada futura: 404.
- Editar o conteúdo não altera status, datas nem slug; `published_at` (no VagasPlus), `source_published_at` (data original) e `created_at` são independentes.

## SEO

Metadados, canonical, Open Graph e JSON-LD `JobPosting` (só para vagas ativas) renderizados no servidor. `/sitemap.xml` lista apenas páginas e vagas ativas; `/robots.txt` bloqueia `/admin`. Buscas filtradas ficam `noindex,follow`; localidades com menos de 3 vagas ativas também.

### SSR em produção

```bash
npm ci && npm run build && npx vite build --ssr
php artisan inertia:start-ssr     # mantenha sob Supervisor/systemd
```

Sem o servidor SSR, o Inertia cai automaticamente para renderização no cliente (as páginas funcionam, mas sem HTML pré-renderizado para os buscadores).

## Testes

```bash
php artisan test        # 62 testes
npx vue-tsc --noEmit    # tipos do front-end
```

## Publicidade

Os espaços (`AdSlot`) estão sempre presentes, rotulados "Publicidade", com altura reservada e separados dos cards. Sem configuração mostram "Anuncie aqui" (venda direta); com `ADS_ENABLED=true`, `ADS_CLIENT_ID` e `ADS_SLOT_*` exibem AdSense. Posições e variáveis em [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md).

## Plataforma de contratação

Cada vaga tem uma plataforma (Gupy, LinkedIn, Indeed, Sólides, InHire, Vagas.com, Catho, InfoJobs, site da empresa, e-mail, outra). Candidatura por **e-mail** não tem link: o botão abre `mailto:`. O filtro `?plataforma=gupy` funciona na listagem e na home. Rotas novas: `/categorias`.

## Checklist de produção

- `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL` com `https://`, `SESSION_SECURE_COOKIE=true`
- `php artisan config:cache route:cache view:cache` e `php artisan migrate --force`
- Cron do scheduler e processo SSR ativos
- Apontar o servidor web para `public/`; permissões de escrita só em `storage/` e `bootstrap/cache/`
- Configurar e-mail (`MAIL_*`) quando forem ativadas notificações de expiração (a arquitetura de eventos em `job_posting_events` já está pronta)

## Limitações conhecidas

- Sem imagem Open Graph padrão (usa o logotipo da empresa quando informado).
- Sem notificações por e-mail de vagas prestes a expirar (apenas indicadores no painel).
- Interface revisada apenas por build/tipos/testes; vale uma revisão visual e de acessibilidade em navegador real.

## Importar vaga de link ou texto

Em **Nova vaga** há o painel "Importar de link ou texto". Ordem de leitura:

1. **Dados estruturados** da página (JSON-LD `JobPosting`, padrão do Google Vagas, usado por Gupy, Greenhouse, Lever e outros): gratuito, sem IA.
2. **Gemini** como reserva (páginas sem dados estruturados ou texto colado). Opcional: defina `GEMINI_API_KEY` no `.env` (chave gratuita em https://aistudio.google.com) e, se quiser, `GEMINI_MODEL` (padrão `gemini-3.5-flash-lite`). Sem a chave, o sistema segue funcionando só com o passo 1.

O resultado sempre preenche o formulário para revisão; nada é publicado automaticamente. Salário só é preenchido se estiver explícito, e o link de candidatura é o endereço informado (nunca um link ditado pela IA). A busca de páginas bloqueia endereços internos (proteção SSRF). LinkedIn e Indeed bloqueiam leitura automática: nesses casos, cole o texto. Resultados iguais ficam em cache por 30 minutos para poupar a cota gratuita.

### Chave do Gemini (recomendado)

Cadastre em **/admin/configuracoes → IA para importar vagas**: cole a chave (gratuita em https://aistudio.google.com/apikey), escolha o modelo (padrão `gemini-3.5-flash-lite`) e use **Testar conexão**. A chave é guardada criptografada no banco e nunca volta ao navegador; a do painel tem prioridade sobre `GEMINI_API_KEY` do `.env`. Páginas sem dados estruturados e textos colados vão para o Gemini; se a IA falhar (cota, erro), o importador segue com as regras simples e avisa.
