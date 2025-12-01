# 🚀 VendaMax

Sistema completo de gestão comercial com frontend Angular 17 e backend Spring Boot.

---

## 📦 Repositórios

- **Frontend:** https://github.com/thiagorduarte1107/vendamaxfrontend (este repositório)
- **Backend:** https://github.com/thiagorduarte1107/vendasmaxbackend

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Estrutura do Repositório](#estrutura-do-repositório)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Configuração](#instalação-e-configuração)
- [Credenciais de Acesso](#credenciais-de-acesso)
- [Funcionalidades](#funcionalidades)
- [Deploy](#deploy)

---

## 📖 Sobre o Projeto

**VendaMax** é um sistema completo de gestão comercial que oferece:

- 📊 Dashboard com métricas em tempo real
- 🛍️ Gestão de produtos e categorias
- 👥 Cadastro de clientes
- 💰 Controle de vendas e PDV
- 📦 Gestão de estoque
- 💳 Controle financeiro
- 👤 Gerenciamento de usuários e permissões
- 📈 Relatórios e análises
- 🔐 Autenticação JWT com controle de acesso

---

## 📁 Estrutura do Repositório

```
vendamaxfrontend/
├── Frontend/              # Código Angular 17
│   ├── src/              # Código fonte
│   ├── angular.json      # Configuração Angular
│   └── package.json      # Dependências
│
├── database/             # Scripts SQL
│   ├── README.md         # Documentação dos scripts
│   ├── create-database-sqlserver.sql
│   ├── insert-test-data.sql
│   └── ...
│
├── Docs/                 # Documentação (local, não commitada)
│   ├── README.md
│   ├── BACKEND-PLAN.md
│   ├── BRAINSTORM.md
│   └── ...
│
├── vercel.json           # Configuração Vercel
└── README.md             # Este arquivo
```

---

## 🛠️ Tecnologias

### **Frontend**
- **Angular 17**
- **TypeScript**
- **Angular Material**
- **RxJS**
- **Chart.js**
- **jsPDF**
- **SCSS**

### **Backend** (repositório separado)
- **Spring Boot 3.2**
- **Java 17**
- **SQL Server 2022**
- **JWT Authentication**
- **Swagger/OpenAPI**

---

## ✅ Pré-requisitos

- **Node.js 18+** e **npm**
- **Git**
- **Backend API** rodando (veja: https://github.com/thiagorduarte1107/vendasmaxbackend)

---

## 🚀 Instalação e Configuração

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/thiagorduarte1107/vendamaxfrontend.git
cd vendamaxfrontend
```

### 2️⃣ Instalar Dependências

```bash
cd Frontend
npm install
```

### 3️⃣ Configurar URL do Backend

Edite o arquivo `Frontend/src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'  // URL do backend
};
```

### 4️⃣ Iniciar o Frontend

```bash
npm start
```

O frontend estará disponível em: **http://localhost:4200**

> **⚠️ Importante:** Certifique-se de que o backend está rodando antes de iniciar o frontend.

---

## 🔐 Credenciais de Acesso

### 👤 Usuário de Teste

Após iniciar a aplicação, use as seguintes credenciais para fazer login:

| Campo | Valor |
|-------|-------|
| **Email** | `teste@vendamax.com` |
| **Senha** | `password` |
| **Perfil** | ADMIN (acesso total) |

### 🔧 Criar Novo Usuário

Para criar novos usuários, consulte a documentação do backend:
https://github.com/thiagorduarte1107/vendasmaxbackend

---

## 📁 Estrutura do Projeto

```
vendamaxfrontend/
├── Frontend/                   # Aplicação Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/           # Componentes da UI
│   │   │   ├── guards/               # Guards de rota
│   │   │   ├── interceptors/         # HTTP Interceptors
│   │   │   ├── mappers/              # Mapeadores DTO <-> Model
│   │   │   ├── models/               # Interfaces TypeScript
│   │   │   ├── pages/                # Páginas principais
│   │   │   └── services/             # Serviços Angular
│   │   ├── assets/                   # Recursos estáticos
│   │   └── environments/             # Configurações de ambiente
│   ├── angular.json
│   ├── package.json
│   └── README.md
│
├── database/                   # Scripts SQL (referência)
│   ├── create-database-sqlserver.sql
│   └── insert-vendas-hoje.sql
│
└── README.md                   # Este arquivo
```

---

## 🎯 Funcionalidades

### 📊 Dashboard
- Visão geral de vendas, produtos e clientes
- Gráficos de desempenho
- Métricas em tempo real

### 🛍️ Produtos
- Cadastro completo de produtos
- Gestão de categorias
- Controle de estoque
- Preços e margens

### 👥 Clientes
- Cadastro de clientes (PF/PJ)
- Histórico de compras
- Limite de crédito
- Endereços múltiplos

### 💰 Vendas
- PDV (Ponto de Venda) completo
- Múltiplas formas de pagamento
- Desconto e acréscimo
- Impressão de cupom

### 📦 Estoque
- Controle de entrada/saída
- Movimentações
- Inventário
- Alertas de estoque baixo

### 💳 Financeiro
- Contas a pagar/receber
- Fluxo de caixa
- Relatórios financeiros

### 👤 Usuários
- Gestão de usuários
- Perfis de acesso (ADMIN, MANAGER, SELLER, CASHIER)
- Permissões granulares
- Logs de atividade

### 📈 Relatórios
- Relatórios de vendas
- Relatórios de produtos
- Relatórios financeiros
- Exportação em PDF

---

## 📚 Documentação da API

Para documentação completa da API, consulte o repositório do backend:
**https://github.com/thiagorduarte1107/vendasmaxbackend**

---

## 🌐 URLs

| Serviço | URL |
|---------|-----|
| **Frontend** | http://localhost:4200 |
| **Backend API** | http://localhost:8080/api |

---

## 📝 Scripts Úteis

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm start

# Build para produção
npm run build

# Executar testes
npm test

# Lint
npm run lint
```

---

## 🐛 Solução de Problemas

### Frontend não conecta ao backend

1. Verifique se o backend está rodando em `http://localhost:8080/api`
2. Confirme a URL da API em `Frontend/src/environments/environment.ts`
3. Verifique o console do navegador para erros de CORS
4. Certifique-se de que o backend está configurado corretamente

### Erro de login

1. Use as credenciais corretas: `teste@vendamax.com` / `password`
2. Verifique se o backend está processando a requisição
3. Consulte os logs do backend para mais detalhes

### Problemas de build

1. Limpe o cache: `npm cache clean --force`
2. Remova `node_modules`: `rm -rf node_modules`
3. Reinstale: `npm install`

---

## 📄 Licença

Este projeto é proprietário e confidencial.

---

## 👨‍💻 Desenvolvido por

**VendaMax Team**

---

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação ou entre em contato com a equipe de desenvolvimento.

---

**🎉 Bem-vindo ao VendaMax! Sistema completo de gestão comercial.**
