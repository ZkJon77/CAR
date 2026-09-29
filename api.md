# 📡 API — Car Manager

## Base URL

- **Local:** `http://localhost:3000`
- **Produção (Vercel):** `https://seu-projeto.vercel.app`

## Autenticação

Nenhuma — API pública.

---

## Endpoints

### 🏠 Health Check

```
GET /
```

**Resposta 200:**
```json
{
  "message": "🚗 Car Manager API está rodando!",
  "endpoints": {
    "listar": "GET /api/cars",
    "buscar": "GET /api/cars/:id",
    "criar": "POST /api/cars",
    "atualizar": "PUT /api/cars/:id",
    "deletar": "DELETE /api/cars/:id"
  }
}
```

---

### 📋 Listar todos os carros

```
GET /api/cars
```

**Resposta 200:**
```json
[
  {
    "_id": "64abc123def456789012345",
    "marca": "Toyota",
    "modelo": "Corolla",
    "preco": 120000,
    "foto": "https://exemplo.com/corolla.jpg",
    "criadoEm": "2026-09-29T14:00:00.000Z",
    "__v": 0
  }
]
```

> Retorna array vazio `[]` se não houver carros cadastrados.

---

### 🔍 Buscar carro por ID

```
GET /api/cars/:id
```

**Parâmetros:**
| Parâmetro | Tipo   | Descrição                    |
|-----------|--------|------------------------------|
| `id`      | String | ID do carro (MongoDB ObjectId) |

**Resposta 200:**
```json
{
  "_id": "64abc123def456789012345",
  "marca": "Toyota",
  "modelo": "Corolla",
  "preco": 120000,
  "foto": "https://exemplo.com/corolla.jpg",
  "criadoEm": "2026-09-29T14:00:00.000Z"
}
```

**Resposta 404:**
```json
{ "error": "Carro não encontrado." }
```

---

### ➕ Criar carro

```
POST /api/cars
```

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "marca": "Honda",
  "modelo": "Civic",
  "preco": 135000,
  "foto": "https://exemplo.com/civic.jpg"
}
```

| Campo    | Tipo   | Obrigatório | Descrição              |
|----------|--------|-------------|------------------------|
| `marca`  | String | ✅ Sim      | Marca do carro         |
| `modelo` | String | ✅ Sim      | Modelo do carro        |
| `preco`  | Number | ✅ Sim      | Preço em R$ (>= 0)    |
| `foto`   | String | ❌ Não      | URL da foto do carro   |

**Resposta 201:**
```json
{
  "_id": "64bcd456ghi789012345678",
  "marca": "Honda",
  "modelo": "Civic",
  "preco": 135000,
  "foto": "https://exemplo.com/civic.jpg",
  "criadoEm": "2026-09-29T14:05:00.000Z"
}
```

**Resposta 400 (campos ausentes):**
```json
{ "error": "Campos obrigatórios ausentes: marca, preco." }
```

---

### ✏️ Atualizar carro

```
PUT /api/cars/:id
```

**Headers:**
```
Content-Type: application/json
```

**Body (JSON) — envie apenas os campos a alterar:**
```json
{
  "preco": 140000,
  "foto": "https://exemplo.com/civic-novo.jpg"
}
```

**Resposta 200:**
```json
{
  "_id": "64bcd456ghi789012345678",
  "marca": "Honda",
  "modelo": "Civic",
  "preco": 140000,
  "foto": "https://exemplo.com/civic-novo.jpg",
  "criadoEm": "2026-09-29T14:05:00.000Z"
}
```

**Resposta 404:**
```json
{ "error": "Carro não encontrado." }
```

---

### 🗑️ Deletar carro

```
DELETE /api/cars/:id
```

**Resposta 204:** (Sem conteúdo — sucesso)

**Resposta 404:**
```json
{ "error": "Carro não encontrado." }
```

---

## Códigos de Erro

| Código | Significado                        |
|--------|------------------------------------|
| 200    | Sucesso (listar, buscar, atualizar) |
| 201    | Criado com sucesso                 |
| 204    | Deletado com sucesso (sem body)    |
| 400    | Campos obrigatórios ausentes       |
| 404    | Carro não encontrado / Rota inválida |
| 500    | Erro interno do servidor           |

---

## Como testar com cURL

### Criar um carro
```bash
curl -X POST http://localhost:3000/api/cars \
  -H "Content-Type: application/json" \
  -d '{"marca":"Fiat","modelo":"Uno","preco":45000,"foto":"https://exemplo.com/uno.jpg"}'
```

### Listar todos
```bash
curl http://localhost:3000/api/cars
```

### Buscar por ID
```bash
curl http://localhost:3000/api/cars/SEU_ID_AQUI
```

### Atualizar
```bash
curl -X PUT http://localhost:3000/api/cars/SEU_ID_AQUI \
  -H "Content-Type: application/json" \
  -d '{"preco":48000}'
```

### Deletar
```bash
curl -X DELETE http://localhost:3000/api/cars/SEU_ID_AQUI
```

---

## Como testar com PowerShell

### Criar um carro
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/cars" -Method POST -ContentType "application/json" -Body '{"marca":"Fiat","modelo":"Uno","preco":45000}'
```

### Listar todos
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/cars" -Method GET
```

### Deletar
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/cars/SEU_ID_AQUI" -Method DELETE
```

---

## Variáveis de Ambiente

| Variável       | Descrição                              | Exemplo                                                                  |
|----------------|----------------------------------------|--------------------------------------------------------------------------|
| `MONGODB_URI`  | Connection string do MongoDB Atlas     | `mongodb+srv://user:pass@cluster.xxx.mongodb.net/car-manager`           |
| `PORT`         | Porta do servidor (padrão: 3000)       | `3000`                                                                   |
