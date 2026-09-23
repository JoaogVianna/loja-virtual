# 🛒 Loja Virtual — Projeto de Estudo Full Stack

Projeto de estudo com o objetivo de praticar banco de dados relacional integrado a uma aplicação web completa, do zero: modelagem, API REST, autenticação e interface.

## 🚀 Tecnologias

**Backend**
- Node.js + Express
- PostgreSQL (driver `pg`, sem ORM — queries SQL escritas manualmente)
- JWT (autenticação) + bcrypt (hash de senha)
- Transações SQL (`BEGIN` / `COMMIT` / `ROLLBACK`)

**Frontend**
- React + Vite
- Axios (consumo da API)
- Lucide React (ícones)

## ✨ Funcionalidades

- Cadastro e login de usuários (JWT)
- CRUD completo de produtos (criar, listar, editar, excluir)
- Gerenciamento de categorias
- Carrinho de compras
- Finalização de pedido com transação atômica: verificação e baixa de estoque, cálculo de total, tudo ou nada (rollback em caso de falha)
- Histórico de pedidos por usuário
- Rotas sensíveis protegidas por autenticação (middleware JWT)

## 🗂️ Estrutura do banco de dados

6 tabelas relacionadas: `usuarios`, `categorias`, `produtos`, `estoque`, `pedidos`, `itens_pedido`, com chaves estrangeiras e regras de integridade (`CHECK` para preços e quantidades não-negativos).

## 📦 Como rodar localmente

### Pré-requisitos
- Node.js
- PostgreSQL

### Backend

\`\`\`bash
cd backend
npm install
cp .env.example .env
# edite o .env com suas credenciais do PostgreSQL

# crie o banco de dados
psql -U postgres -c "CREATE DATABASE loja_virtual;"

# rode os scripts de criação das tabelas (ver seção "Modelagem" abaixo)

node src/index.js
\`\`\`

### Frontend

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

Acesse `http://localhost:5173`.

## 🧠 Principais aprendizados

- Modelagem de banco relacional com chaves estrangeiras e integridade referencial
- Transações SQL para garantir consistência em operações com múltiplas tabelas
- `FOR UPDATE` para evitar condição de corrida em baixa de estoque simultânea
- Autenticação stateless com JWT e proteção de rotas via middleware
- Consumo de API REST em React com Axios e interceptors

## 📸 Screenshots

_(adicione aqui prints da tela de produtos, login e carrinho)_

## 👤 Autor

João Vianna
