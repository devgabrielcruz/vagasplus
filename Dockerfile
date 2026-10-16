# syntax=docker/dockerfile:1
# Imagem de TESTE para hospedar o VagasPlus (Railway, Render, Koyeb, Fly...). Veja docs/deploy-railway.md.

# 1) Front-end (Vite)
FROM node:22-alpine AS assets
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2) Servidor: FrankenPHP (Caddy + PHP 8.4).
# O Laravel 13 usa Symfony 8, que exige PHP >= 8.4.1. As dependências são instaladas AQUI, com o mesmo PHP e as mesmas
# extensões da execução, para que qualquer incompatibilidade quebre no build e não só ao iniciar.
FROM dunglas/frankenphp:1-php8.4
RUN install-php-extensions pdo_sqlite intl opcache zip bcmath
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction

COPY . .
RUN composer dump-autoload --optimize --no-dev --classmap-authoritative
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
