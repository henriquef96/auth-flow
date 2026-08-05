#!/bin/sh

set -e

cd /var/www/html

echo "=================================="
echo "Inicializando Laravel..."
echo "=================================="

echo "Configurando permissões..."

mkdir -p storage/framework/cache/data
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p storage/logs
mkdir -p bootstrap/cache

chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache


if [ ! -f ".env" ]; then
    echo "Criando arquivo .env..."
    cp .env.example .env
fi


if [ ! -f "vendor/autoload.php" ]; then
    echo "Instalando dependências do Composer..."

    export COMPOSER_PROCESS_TIMEOUT=0

    if [ "$APP_ENV" = "production" ]; then
        echo "Ambiente de Produção detectado: instalando sem pacotes de desenvolvimento..."
        composer install \
            --no-interaction \
            --prefer-dist \
            --optimize-autoloader \
            --no-dev
    else
        echo "Ambiente de Desenvolvimento detectado: instalando com todas as dependências..."
        composer install \
            --no-interaction \
            --prefer-dist \
            --optimize-autoloader
    fi
fi

echo "Aguardando PostgreSQL..."

DB_HOST_PROD=${DB_HOST:-postgres_db}
DB_USER_PROD=${DB_USERNAME:-postgres}

until pg_isready -h "$DB_HOST_PROD" -p 5432 -U "$DB_USER_PROD"; do
    sleep 2
done

echo "PostgreSQL disponível."

if [ -z "$APP_KEY" ] && ! grep -q "APP_KEY=base64" .env; then
    echo "Gerando APP_KEY..."
    php artisan key:generate --force
else
    echo "APP_KEY já configurada, ignorando geração."
fi

echo "Executando migrations..."
php artisan migrate --seed --force

if [ -n "$PORT" ] && [ -f "/etc/nginx/conf.d/default.conf" ]; then
    echo "Configurando a porta do Nginx para ${PORT}..."
    sed -i "s/listen 80;/listen ${PORT};/g" /etc/nginx/conf.d/default.conf
    sed -i "s/\${PORT}/${PORT}/g" /etc/nginx/conf.d/default.conf
fi

echo "=================================="
echo "Laravel iniciado com sucesso!"
echo "=================================="

nginx &
exec "$@"