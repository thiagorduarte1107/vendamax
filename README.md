# 💼 VendaMax - Gestão Inteligente de Vendas

Sistema completo de gestão comercial desenvolvido com **Angular 17** e **Angular Material**, com design minimalista profissional.

## ✨ Funcionalidades

### 🏠 Dashboard
- Métricas em tempo real (vendas, faturamento, despesas, créditos)
- Cards com ícones coloridos e trends
- Alertas de estoque baixo
- Ações rápidas para navegação
- Design minimalista preto e branco

### 📦 Gestão Completa
- **Produtos** - CRUD com modais, controle de estoque, categorias
- **Clientes** - Cadastro com sistema de crédito e limite
- **Vendas** - Carrinho de compras, múltiplas formas de pagamento
- **Categorias** - Organização de produtos
- **Contas a Receber** - Controle de recebíveis com status
- **Contas a Pagar** - Gestão de despesas e fornecedores

### 🎯 Modais Profissionais
- Formulários reativos com validação em tempo real
- Máscara de moeda brasileira (R$) automática
- Design consistente e responsivo
- Ícones coloridos intuitivos
- Feedback visual claro

## 🛠️ Tecnologias

- **Angular 17.3.0** - Framework principal
- **Angular Material 17.3.0** - Componentes UI
- **TypeScript 5.4.2** - Linguagem
- **RxJS 7.8.0** - Programação reativa
- **Chart.js 4.4.0** - Gráficos (removido)
- **ng2-charts 5.0.4** - Integração Chart.js (removido)

### 🎨 Design System
- **Tema:** Minimalista Preto & Branco
- **Fontes:** Inter (sans-serif), JetBrains Mono (monospace)
- **Ícones:** Material Icons com cores vibrantes
- **Paleta:** Ícones coloridos em fundo neutro
- **Inspiração:** Apple, Notion, Figma

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm start

# Acessar
http://localhost:4200
```

### Build para Produção

```bash
# Build otimizado
npm run build

# Arquivos em dist/anota-ai-angular/
```

### Testes

```bash
# Executar testes unitários
npm test

# Executar testes com coverage
npm run test -- --code-coverage
```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── components/          # Componentes da aplicação
│   │   ├── login/          # Autenticação
│   │   ├── layout/         # Layout principal com sidebar
│   │   ├── dashboard/      # Dashboard com métricas
│   │   ├── products/       # Produtos + ProductDialog
│   │   ├── clients/        # Clientes + ClientDialog
│   │   ├── sales/          # Vendas com carrinho
│   │   ├── categories/     # Categorias + CategoryDialog
│   │   ├── accounts-receivable/  # Contas a receber + Dialog
│   │   └── accounts-payable/     # Contas a pagar + Dialog
│   ├── directives/         # Diretivas customizadas
│   │   └── currency-mask.directive.ts  # Máscara de moeda
│   ├── services/           # Serviços Angular
│   ├── models/             # Interfaces TypeScript
│   ├── guards/             # Guards de rota
│   ├── data/               # Dados mockados
│   ├── app.module.ts       # Módulo principal
│   └── app-routing.module.ts  # Rotas
├── assets/                 # Assets estáticos
├── environments/           # Configurações de ambiente
├── index.html             # HTML principal
├── main.ts                # Bootstrap
└── styles.scss            # Estilos globais + Design System
```

## 🔐 Login

**Modo Demo:** Use qualquer email e senha para fazer login.

Exemplo:
- Email: `admin@example.com`
- Senha: `123`

## 📊 Funcionalidades Implementadas

### ✅ Autenticação
- [x] Login com validação
- [x] Guard de rotas
- [x] Armazenamento de sessão
- [x] Logout

### ✅ Dashboard
- [x] Cards de métricas com trends
- [x] Gráfico de vendas mensais
- [x] Alertas de estoque
- [x] Ações rápidas

### ✅ CRUD Completo
- [x] Produtos com categorias e estoque
- [x] Clientes com limite de crédito
- [x] Vendas com carrinho de compras
- [x] Categorias de produtos
- [x] Contas a receber com clientes
- [x] Contas a pagar com fornecedores

### ✅ Modais e Formulários
- [x] ProductDialog - Criar/Editar produto
- [x] ClientDialog - Criar/Editar cliente
- [x] CategoryDialog - Criar/Editar categoria
- [x] AccountReceivableDialog - Nova conta a receber
- [x] AccountPayableDialog - Nova conta a pagar
- [x] Máscara de moeda brasileira (R$)
- [x] Validações em tempo real
- [x] Feedback visual de erros

### ✅ UX Melhorias
- [x] Avatar com iniciais do usuário
- [x] Menu dropdown profissional
- [x] Logo SVG customizado (VendaMax)
- [x] Ícones coloridos por categoria
- [x] Hover states em todos os elementos
- [x] Transições suaves
- [x] Scrollbar customizada

## 🎨 UI/UX

### Design Minimalista Profissional
- **Tema:** Preto e Branco com ícones coloridos
- **Tipografia:** Inter (UI) + JetBrains Mono (números)
- **Ícones:** Material Icons com cores vibrantes
- **Layout:** Sidebar fixa + Toolbar com avatar
- **Responsivo:** Mobile, Tablet, Desktop

### Componentes Customizados
- **Avatar:** Iniciais do usuário com gradiente
- **Cards:** Sombras sutis e bordas arredondadas
- **Modais:** Design consistente com validação
- **Tabelas:** Hover states e ações inline
- **Formulários:** Máscaras automáticas e validação

### Paleta de Cores
```scss
--background: 0 0% 100%           // Branco
--text-primary: 0 0% 9%           // Preto
--icon-primary: 221 83% 53%       // Azul
--icon-success: 142 76% 36%       // Verde
--icon-warning: 38 92% 50%        // Laranja
--icon-danger: 0 84% 60%          // Vermelho
--icon-purple: 271 81% 56%        // Roxo
```

## 📚 Scripts Disponíveis

```bash
npm start          # Desenvolvimento (porta 4200)
npm run build      # Build produção
npm test           # Testes unitários
npm run watch      # Build com watch
npm run lint       # Linter
```

## 🔧 Configuração

### Ambiente de Desenvolvimento

O projeto usa:
- Angular CLI para build e dev server
- Karma + Jasmine para testes
- ESLint para linting
- TypeScript strict mode

### Variáveis de Ambiente

Crie um arquivo `.env` se necessário (atualmente não usado).

## 📝 Dados Mockados

O sistema inclui dados de exemplo:
- 8 produtos com categorias
- 5 clientes
- 3 vendas
- 5 categorias
- Contas a receber e pagar

## 🚀 Deploy

### Vercel
```bash
npm i -g vercel
vercel --prod
```

### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod
```

### Docker
```bash
docker build -t anota-ai .
docker run -p 4200:4200 anota-ai
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob licença MIT.

## 🙏 Agradecimentos

- Angular Team
- Angular Material
- Chart.js
- Comunidade Open Source

## 🎯 Diferenciais

### Design Profissional
- ✨ Tema minimalista inspirado em produtos premium
- 🎨 Ícones coloridos que facilitam identificação
- 📱 Totalmente responsivo
- ⚡ Transições e animações suaves

### Experiência do Usuário
- 💰 Máscara de moeda automática em todos os campos
- ✅ Validação em tempo real
- 🔍 Feedback visual claro
- 🚀 Performance otimizada

### Código Limpo
- 📦 Componentes modulares e reutilizáveis
- 🎯 TypeScript com strict mode
- 🔧 Diretivas customizadas
- 📚 Código bem documentado

---

**Desenvolvido com ❤️ usando Angular 17**

**Nome:** VendaMax - Gestão Inteligente  
**Versão:** 1.0.0  
**Última atualização:** Novembro 2025  
**Status:** ✅ Produção
