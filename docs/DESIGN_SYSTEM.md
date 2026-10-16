# VagasPlus Design System (v2)

Fonte da verdade: `resources/css/app.css` (tokens + primitivas) e `resources/js/components/`.

## Princípios
Claridade antes de decoração · hierarquia por tipografia e espaço (não por bordas) · cor com significado · acessível por padrão (foco visível, AA, alvos ≥ 44px, `prefers-reduced-motion`).

## Tokens
| Camada | Exemplos |
|---|---|
| Marca | `navy-950…50` (institucional) |
| Ação | `action-700/600/500/200/100/50` (botões, links, foco) |
| Neutros semânticos | `surface`, `card`, `ink`, `muted`, `subtle`, `line`, `line-strong` |
| Estado | `success`, `warning`, `danger`, `info` (`-700` texto, `-50` fundo) |
| Raio | `control` 10 · `card` 16 · `panel` 24 |
| Elevação | `shadow-xs`, `card`, `lift` (hover), `pop` (overlays) |
| Fonte | Inter (400–800) |

Regra: componentes usam tokens semânticos, nunca hex soltos. A única exceção são as cores de identificação de plataforma (`App\Enums\Platform::color()`).

## Tipografia
`t-display` (hero) · `t-h1` · `t-h2` · `t-h3` · `t-eyebrow` · corpo 15px/leading-7 (`prose-job` para HTML de vagas).

## Primitivas
- **Botões:** `btn-primary`, `btn-secondary`, `btn-ghost`, `btn-dark`, `btn-danger` + `btn-sm` / `btn-lg`.
- **Campos:** `field`, `label`, `hint`, `error-text` (via `<Field>`, que liga label, dica e erro por `aria-describedby`).
- **Superfícies:** `card`, `panel`. **Selos:** `badge`, `chip`.

## Componentes de produto
`JobCard` (logo, selo da plataforma, chips, salário) · `CompanyLogo` (logo ou iniciais com cor estável) · `PlatformBadge` (`chip` | `plain` | `large`) · `PlatformFilterStrip` · `FilterBar` · `Pagination` · `Breadcrumbs` · `EmptyState` · `StatusBadge` · `ConfirmDialog` · `RichEditor` · `AdSlot`.

## Anúncios (`AdSlot`)
Sempre presentes, rotulados "Publicidade", com altura reservada (sem salto de layout) e fora da grade de cards.

| Posição (`placement`) | Formato | Onde |
|---|---|---|
| `home-top` | leaderboard 728×90 | logo abaixo do hero |
| `home-mid` | leaderboard | entre categorias e vagas recentes |
| `categories-top` | leaderboard | topo de `/categorias` |
| `list-top` | leaderboard | logo acima das vagas na listagem |
| `list-card` | card (mesmo tamanho de uma vaga) | no meio da lista (ou ao fim, se houver poucas vagas) |
| `list-card-2` | card | segundo card, só em listas com mais de 9 vagas |
| `job-side` | square 300×250 | lateral da vaga, logo abaixo de "Compartilhar" (desktop) |
| `job-bottom` | leaderboard | fim da vaga |

Sem configuração, cada espaço mostra **"Anuncie aqui"** (venda direta, link `mailto` ao e-mail de contato). Para ativar AdSense: `ADS_ENABLED=true`, `ADS_CLIENT_ID=ca-pub-…` e um ID de unidade por posição (`ADS_SLOT_HOME_TOP`, `ADS_SLOT_HOME_MID`, `ADS_SLOT_LIST_TOP`, `ADS_SLOT_LIST_CARD`, `ADS_SLOT_LIST_CARD_2`, `ADS_SLOT_JOB_SIDE`, `ADS_SLOT_JOB_BOTTOM`, `ADS_SLOT_CATEGORIES_TOP`). O botão de candidatura nunca fica dentro ou abaixo de um anúncio.
