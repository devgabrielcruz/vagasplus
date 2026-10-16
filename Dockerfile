# syntax=docker/dockerfile:1
# Imagem de TESTE para hospedar o VagasPlus (Railway, Render, Koyeb, Fly...). Veja docs/deploy-railway.md.

# 1) Front-end (Vite)
FROM node:22-alpine AS assets
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2) Dependências PHP (sem dev)
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction --ignore-platform-reqs
COPY . .
RUN composer dump-autoload --optimize --no-dev --classmap-authoritative --ignore-platform-reqs

# 3) Servidor: FrankenPHP (Caddy + PHP 8.3)
FROM dunglas/frankenphp:1-php8.3
RUN install-php-extensions pdo_sqlite intl opcache zip bcmath

WORKDIR /app
COPY . .
COPY --from=vendor /app/vendor ./vendor
COPY --from=assets /app/public/build ./public/build
COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY deploy/entrypoint.sh /usr/local/bin/entrypoint
RUN sed -i 's/\r$//' /usr/local/bin/entrypoint && chmod +x /usr/local/bin/entrypoint \
    && mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache

ENV APP_ENV=production \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr \
    LOG_LEVEL=info \
    DB_CONNECTION=sqlite \
    DB_DATABASE=/data/database.sqlite \
    SESSION_DRIVER=database \
    CACHE_STORE=database \
    QUEUE_CONNECTION=sync \
    SESSION_SECURE_COOKIE=true \
    INERTIA_SSR_ENABLED=false \
    DATA_DIR=/data

EXPOSE 8080
ENTRYPOINT ["entrypoint"]
