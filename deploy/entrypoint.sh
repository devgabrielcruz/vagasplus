#!/bin/sh
# Inicialização do contêiner de teste: prepara o volume (/data), migra o banco, cria o admin e sobe o servidor.
set -e
cd /app

DATA="${DATA_DIR:-/data}"

if [ -z "$APP_KEY" ]; then
    echo "ERRO: defina a variável APP_KEY (gere com: php artisan key:generate --show)." >&2
    exit 1
fi

mkdir -p "$DATA/public"

# Primeira execução: banco de exemplo (sem dados pessoais). Nas seguintes, o banco do volume é mantido.
if [ ! -f "$DATA/database.sqlite" ]; then
    if [ -f deploy/seed/database.sqlite ]; then
        cp deploy/seed/database.sqlite "$DATA/database.sqlite"
        echo "Banco de exemplo copiado para $DATA/database.sqlite"
    else
        touch "$DATA/database.sqlite"
    fi
fi

# Logos enviados ficam no volume (storage/app/public -> /data/public) e são servidos por public/storage.
rm -rf storage/app/public
ln -s "$DATA/public" storage/app/public
ln -sfn /app/storage/app/public public/storage

php artisan migrate --force --no-interaction

# Administrador de teste (opcional): a senha precisa ter pelo menos 12 caracteres.
if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ]; then
    # Se falhar (ex.: senha curta), o site sobe mesmo assim: só o login do admin fica indisponível.
    php artisan admin:create "$ADMIN_EMAIL" --name="${ADMIN_NAME:-Administrador}" --password="$ADMIN_PASSWORD" --no-interaction \
        || echo "AVISO: administrador NÃO criado. Corrija ADMIN_EMAIL/ADMIN_PASSWORD (senha com 12+ caracteres) e faça um novo deploy." >&2
fi

php artisan config:cache
php artisan route:cache
php artisan view:cache

# Agendador (publica vagas agendadas e expira as vencidas).
php artisan schedule:work >/proc/1/fd/1 2>&1 &

exec frankenphp run --config /etc/caddy/Caddyfile --adapter caddyfile
