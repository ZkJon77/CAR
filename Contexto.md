# 📋 Contexto — Garagem de Carros

## Visão Geral
Sistema web de gerenciamento de carros (Garagem de Carros) com API REST (Node.js + MongoDB) e frontend (HTML/CSS/JS).
O backend funciona como API serverless na Vercel e o frontend consome os endpoints para listar, cadastrar, editar e excluir carros.

## Status Atual
🟡 10 de 13 etapas concluídas. Aguardando connection string MongoDB para testes.

## O que já foi feito
- ✅ Estrutura completa de pastas (`api/` + `frontend/`)
- ✅ Conexão MongoDB com cache serverless (`config/db.js`)
- ✅ Modelo Mongoose com validações (`models/Car.js`)
- ✅ 5 rotas CRUD com tratamento de erros (`routes/garagem.js`)
- ✅ Express configurado com CORS, JSON parser, health check (`index.js`)
- ✅ Configuração Vercel para deploy serverless (`vercel.json`)
- ✅ Package.json com 4 dependências (express, mongoose, dotenv, cors)
- ✅ Frontend HTML semântico com formulário e grid de cards (`index.html`)
- ✅ CSS dark mode com gradientes, animações e responsivo (`style.css`)
- ✅ JS com CRUD via fetch, toast, loading, formatação BRL (`app.js`)
- ✅ Documentação da API com exemplos cURL e PowerShell (`api.md`)
- ✅ `.env.example` com placeholders

## O que falta
- ⬜ Testar API com MongoDB real (Etapa 7)
- ⬜ Testar integração frontend ↔ API (Etapa 11)
- ⬜ Revisão final (Etapa 13)

## Decisões Técnicas
- **Backend:** Node.js + Express + Mongoose + CORS + dotenv
- **Frontend:** HTML/CSS/JS puros, sem frameworks
- **Deploy:** Vercel (serverless functions via `@vercel/node`)
- **Banco:** MongoDB Atlas (connection string via `MONGODB_URI`)
- **Foto:** armazenada como URL (string), com placeholder 🚗 quando ausente
- **Preço:** formatado no frontend como `R$ 120.000,00` via `Intl.NumberFormat`
- **Segurança:** escape de HTML no frontend para prevenir XSS
- **Conexão DB:** cache de conexão para evitar múltiplas conexões em serverless
- **Ordenação:** carros mais recentes primeiro (`sort({ criadoEm: -1 })`)

## Última atualização
29/09/2026 — Etapas 1-6, 8-10 e 12 concluídas.
