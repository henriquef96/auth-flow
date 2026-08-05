#!/bin/sh

set -e

if [ ! -d "vendor" ]; then
    echo "Instalando dependências do Composer..."
    composer install --no-interaction --prefer-dist
fi

exec "$@"