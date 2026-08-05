# Auth Flow

Aplicação full-stack de exemplo com autenticação via JWT e um CRUD de cadastros com preenchimento automático de endereço via CEP. O backend é uma API em Laravel e o frontend é uma SPA em React + TypeScript.

## Visão geral

- **Login** com e-mail/senha, emitindo um token JWT próprio (implementação customizada, sem depender de pacotes de terceiros para assinatura/validação).
- **Rotas protegidas** por middleware que valida o token em todas as requisições autenticadas.
- **CRUD de cadastros** (nome, e-mail, endereço) com paginação de 5 itens por página.
- **Busca de CEP** (via [ViaCEP](https://viacep.com.br/)) com cache de 30 dias no backend, usada para autopreencher o formulário no frontend.
- Ambiente de backend **dockerizado** (PHP-FPM + Nginx + PostgreSQL).

## Tecnologias utilizadas

### Backend
- PHP 8.5 / **Laravel 13**
- PostgreSQL 18
- PHPUnit (testes em `tests/Feature` e `tests/Unit`)
- Nginx (servidor web) + PHP-FPM (via Docker)

### Frontend
- React 19 + TypeScript
- Vite (build tool e dev server, com proxy de `/api` para o backend)
- Fetch API nativa para chamadas HTTP (sem axios)

### Infraestrutura
- Docker / Docker Compose (serviços `app`, `nginx` e `database`)

## Estrutura do projeto

```
backend/    # API Laravel (PHP)
frontend/   # SPA React + TypeScript (Vite)
docker/     # Dockerfiles e configurações (Nginx, PHP)
docker-compose.yml
```

## Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose
- [Node.js](https://nodejs.org/) 18+ e npm (para rodar o frontend)

## Como clonar e executar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/henriquef96/auth-flow
cd auth-flow
```

### 2. Subir os containers

Na raiz do projeto:

```bash
docker compose up -d --build
```

Isso sobe três serviços:

| Serviço    | Descrição                          | Porta local |
|------------|-------------------------------------|-------------|
| `app`      | PHP-FPM (Laravel)                   | 9000        |
| `nginx`    | Servidor web, expõe a API           | 8000        |
| `database` | PostgreSQL                          | 5432        |

O `entrypoint.sh` do container `app` instala automaticamente as dependências do Composer no primeiro start, além de gerar a chave de app, migração e inserçaõ de dados fake.

O seeder cria um usuário de teste:
- **E-mail:** `admin@authflow.test`
- **Senha:** `admin@test`

### 3. Rodar o frontend

O frontend não está dockerizado, deve ser executado localmente:

```bash
cd frontend
npm install
npm run dev
```

A aplicação abrirá em `http://localhost:5173` (padrão do Vite), com o proxy de `/api` apontando para `http://127.0.0.1:8000` (o Nginx do Docker).

## Scripts úteis

**Backend** (dentro de `backend/`):
```bash
php artisan test      # roda a suíte de testes (PHPUnit)
```

**Endpoints disponíveis**

| Método | Rota                  | Autenticado | Descrição                          |
|--------|------------------------|:-----------:|--------------------------------------|
| POST   | `/api/login`           | Não         | Autentica e retorna o token JWT       |
| GET    | `/api/me`              | Sim         | Retorna os dados do usuário logado    |
| GET    | `/api/cep/{cep}`       | Não         | Consulta um CEP (com cache)           |
| GET    | `/api/cadastros`       | Sim         | Lista cadastros (paginado, 5/página)  |
| POST   | `/api/cadastros`       | Sim         | Cria um cadastro                      |
| PUT    | `/api/cadastros/{id}`  | Sim         | Atualiza um cadastro                  |
| DELETE | `/api/cadastros/{id}`  | Sim         | Remove um cadastro                    |

**Frontend** (dentro de `frontend/`):
```bash
npm run dev       # dev server
npm run build     # build de produção
```

