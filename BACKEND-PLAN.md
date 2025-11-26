# 🚀 BACKEND - VENDAMAX API

## 📋 Stack Tecnológica

### Core
- **Java:** 17 (LTS)
- **Framework:** Spring Boot 3.2.x
- **Build Tool:** Maven
- **Banco de Dados:** PostgreSQL 15+
- **ORM:** Spring Data JPA + Hibernate

### Segurança
- **Autenticação:** JWT (JSON Web Tokens)
- **Spring Security:** 6.x
- **Criptografia:** BCrypt para senhas

### Documentação
- **API Docs:** Swagger/OpenAPI 3.0
- **SpringDoc:** springdoc-openapi-starter-webmvc-ui

### Storage
- **Upload de Imagens:** Cloudinary ou AWS S3
- **Cache:** Redis (opcional)

### Validação & Utilitários
- **Bean Validation:** Jakarta Validation API
- **Lombok:** Redução de boilerplate
- **MapStruct:** Mapeamento de DTOs

### Testes
- **JUnit 5:** Testes unitários
- **Mockito:** Mocks
- **TestContainers:** Testes de integração com PostgreSQL
- **REST Assured:** Testes de API

---

## 🏗️ Arquitetura

### Padrão: Layered Architecture (Camadas)

```
┌─────────────────────────────────────┐
│         Controller Layer            │  ← REST Controllers
├─────────────────────────────────────┤
│          Service Layer              │  ← Business Logic
├─────────────────────────────────────┤
│        Repository Layer             │  ← Data Access (JPA)
├─────────────────────────────────────┤
│          Entity Layer               │  ← Domain Models
└─────────────────────────────────────┘
```

### Estrutura de Pacotes

```
com.vendamax.api
├── config/              # Configurações (Security, CORS, etc)
├── controller/          # REST Controllers
├── dto/                 # Data Transfer Objects
│   ├── request/
│   └── response/
├── entity/              # Entidades JPA
├── repository/          # Repositories (Spring Data JPA)
├── service/             # Business Logic
│   └── impl/
├── security/            # JWT, UserDetails, etc
├── exception/           # Custom Exceptions & Handler
├── mapper/              # DTOs Mappers
└── util/                # Utilitários
```

---

## 📊 SPRINTS DE DESENVOLVIMENTO

### Sprint 1: Setup & Autenticação (Semana 1)
**Objetivo:** Estrutura base e autenticação JWT

#### 1.1 Setup do Projeto
- [ ] Criar projeto Spring Boot via Spring Initializr
- [ ] Configurar `pom.xml` com todas as dependências
- [ ] Configurar `application.yml` (dev, prod)
- [ ] Setup PostgreSQL local/Docker
- [ ] Configurar Flyway para migrations

#### 1.2 Entidades Base
- [ ] User (id, name, email, password, role, active, createdAt, updatedAt)
- [ ] Role (ADMIN, MANAGER, SELLER, CASHIER)
- [ ] Permission (módulos: PRODUCTS, SALES, CUSTOMERS, etc)
- [ ] UserPermission (relacionamento User-Permission)

#### 1.3 Autenticação JWT
- [ ] JwtTokenProvider (geração e validação de tokens)
- [ ] JwtAuthenticationFilter (interceptar requisições)
- [ ] SecurityConfig (configuração Spring Security)
- [ ] AuthController (login, register, refresh token)
- [ ] AuthService (lógica de autenticação)
- [ ] UserDetailsServiceImpl

#### 1.4 Testes
- [ ] Testes unitários de AuthService
- [ ] Testes de integração de AuthController
- [ ] Testes de geração/validação JWT

**Entregáveis:**
- ✅ API de Login funcionando
- ✅ JWT gerado e validado
- ✅ Proteção de rotas por role

---

### Sprint 2: CRUD Básicos (Semana 2)
**Objetivo:** Implementar CRUDs principais

#### 2.1 Módulo de Produtos
- [ ] Entity: Product (id, name, description, price, cost, stock, category, image, barcode, active)
- [ ] Repository: ProductRepository
- [ ] Service: ProductService
- [ ] Controller: ProductController
- [ ] DTOs: ProductRequestDTO, ProductResponseDTO
- [ ] Endpoints:
  - `POST /api/products` - Criar produto
  - `GET /api/products` - Listar (paginado, filtros)
  - `GET /api/products/{id}` - Buscar por ID
  - `PUT /api/products/{id}` - Atualizar
  - `DELETE /api/products/{id}` - Deletar (soft delete)
  - `POST /api/products/{id}/upload` - Upload de imagem

#### 2.2 Módulo de Categorias
- [ ] Entity: Category (id, name, description, active)
- [ ] Repository: CategoryRepository
- [ ] Service: CategoryService
- [ ] Controller: CategoryController
- [ ] Endpoints CRUD completo

#### 2.3 Módulo de Clientes
- [ ] Entity: Customer (id, name, email, phone, cpf, address, active)
- [ ] Repository: CustomerRepository
- [ ] Service: CustomerService
- [ ] Controller: CustomerController
- [ ] Endpoints CRUD completo

#### 2.4 Validações
- [ ] Bean Validation em todos os DTOs
- [ ] Validações customizadas (CPF, email único, etc)
- [ ] Exception Handler global

**Entregáveis:**
- ✅ CRUD de Produtos funcionando
- ✅ CRUD de Categorias funcionando
- ✅ CRUD de Clientes funcionando
- ✅ Validações implementadas

---

### Sprint 3: Vendas & Estoque (Semana 3)
**Objetivo:** Sistema de vendas e controle de estoque

#### 3.1 Módulo de Vendas
- [ ] Entity: Sale (id, customer, user, total, discount, status, paymentMethod, createdAt)
- [ ] Entity: SaleItem (id, sale, product, quantity, price, subtotal)
- [ ] Entity: Payment (id, sale, method, amount, installments, status)
- [ ] Repository: SaleRepository, SaleItemRepository, PaymentRepository
- [ ] Service: SaleService
- [ ] Controller: SaleController
- [ ] Endpoints:
  - `POST /api/sales` - Criar venda
  - `GET /api/sales` - Listar vendas (filtros: data, cliente, status)
  - `GET /api/sales/{id}` - Detalhes da venda
  - `PUT /api/sales/{id}/cancel` - Cancelar venda
  - `GET /api/sales/daily-report` - Relatório do dia

#### 3.2 Controle de Estoque
- [ ] Entity: StockMovement (id, product, type, quantity, reason, user, createdAt)
- [ ] Service: StockService
- [ ] Controller: StockController
- [ ] Endpoints:
  - `POST /api/stock/entry` - Entrada de estoque
  - `POST /api/stock/exit` - Saída de estoque
  - `GET /api/stock/movements` - Histórico de movimentações
  - `GET /api/stock/alerts` - Produtos com estoque baixo

#### 3.3 Caixa
- [ ] Entity: CashRegister (id, user, openedAt, closedAt, openingBalance, closingBalance, status)
- [ ] Entity: CashMovement (id, cashRegister, type, amount, description, createdAt)
- [ ] Service: CashRegisterService
- [ ] Controller: CashRegisterController
- [ ] Endpoints:
  - `POST /api/cash/open` - Abrir caixa
  - `POST /api/cash/close` - Fechar caixa
  - `POST /api/cash/withdrawal` - Sangria
  - `POST /api/cash/deposit` - Suprimento
  - `GET /api/cash/current` - Caixa atual

**Entregáveis:**
- ✅ Sistema de vendas completo
- ✅ Controle de estoque automático
- ✅ Gestão de caixa funcionando

---

### Sprint 4: Financeiro & Relatórios (Semana 4)
**Objetivo:** Módulos financeiros e relatórios

#### 4.1 Contas a Receber
- [ ] Entity: AccountReceivable (id, customer, sale, amount, dueDate, paidDate, status)
- [ ] Service: AccountReceivableService
- [ ] Controller: AccountReceivableController
- [ ] Endpoints CRUD + filtros

#### 4.2 Contas a Pagar
- [ ] Entity: AccountPayable (id, supplier, amount, dueDate, paidDate, category, status)
- [ ] Service: AccountPayableService
- [ ] Controller: AccountPayableController
- [ ] Endpoints CRUD + filtros

#### 4.3 Dashboard & Relatórios
- [ ] Service: DashboardService
- [ ] Controller: DashboardController
- [ ] Endpoints:
  - `GET /api/dashboard/metrics` - Métricas principais
  - `GET /api/dashboard/sales-chart` - Dados para gráfico de vendas
  - `GET /api/dashboard/top-products` - Produtos mais vendidos
  - `GET /api/reports/sales` - Relatório de vendas (PDF/Excel)
  - `GET /api/reports/stock` - Relatório de estoque
  - `GET /api/reports/financial` - Relatório financeiro

#### 4.4 Notificações
- [ ] Entity: Notification (id, user, title, message, type, read, createdAt)
- [ ] Service: NotificationService
- [ ] Controller: NotificationController
- [ ] Endpoints CRUD + marcar como lida

**Entregáveis:**
- ✅ Contas a receber/pagar funcionando
- ✅ Dashboard com métricas
- ✅ Relatórios em PDF/Excel
- ✅ Sistema de notificações

---

## 🔐 Segurança

### Configurações
```yaml
# JWT
jwt:
  secret: ${JWT_SECRET:your-secret-key-change-in-production}
  expiration: 86400000 # 24 horas
  refresh-expiration: 604800000 # 7 dias

# CORS
cors:
  allowed-origins: http://localhost:4200
  allowed-methods: GET,POST,PUT,DELETE,OPTIONS
  allowed-headers: "*"
```

### Roles & Permissions
```java
ADMIN:      Acesso total
MANAGER:    Gestão + Relatórios
SELLER:     Vendas + Clientes + Produtos (leitura)
CASHIER:    PDV + Caixa
```

---

## 📦 Dependências (pom.xml)

```xml
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>

    <!-- Database -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>
    <dependency>
        <groupId>org.flywaydb</groupId>
        <artifactId>flyway-core</artifactId>
    </dependency>

    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.3</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.12.3</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.12.3</version>
    </dependency>

    <!-- Utilities -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
    </dependency>
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
        <version>1.5.5.Final</version>
    </dependency>

    <!-- Documentation -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.3.0</version>
    </dependency>

    <!-- Testing -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

---

## 🗄️ Modelo de Dados (Principais Entidades)

### User
```java
@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue
    private Long id;
    private String name;
    @Column(unique = true)
    private String email;
    private String password;
    @Enumerated(EnumType.STRING)
    private Role role;
    private Boolean active;
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

### Product
```java
@Entity
@Table(name = "products")
public class Product {
    @Id @GeneratedValue
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal cost;
    private Integer stock;
    private String barcode;
    private String imageUrl;
    @ManyToOne
    private Category category;
    private Boolean active;
}
```

### Sale
```java
@Entity
@Table(name = "sales")
public class Sale {
    @Id @GeneratedValue
    private Long id;
    @ManyToOne
    private Customer customer;
    @ManyToOne
    private User user;
    private BigDecimal total;
    private BigDecimal discount;
    @Enumerated(EnumType.STRING)
    private SaleStatus status;
    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL)
    private List<SaleItem> items;
    @CreationTimestamp
    private LocalDateTime createdAt;
}
```

---

## 🚀 Deploy

### Ambientes
1. **Development:** localhost:8080
2. **Staging:** Railway/Render (staging)
3. **Production:** Railway/Render (prod)

### CI/CD
- GitHub Actions para build e testes
- Deploy automático no Railway/Render
- Variáveis de ambiente via secrets

---

## 📈 Próximos Passos

1. ✅ **Setup do Projeto** (Sprint 1 - Semana 1)
2. ⏳ **Autenticação JWT** (Sprint 1 - Semana 1)
3. ⏳ **CRUDs Básicos** (Sprint 2 - Semana 2)
4. ⏳ **Vendas & Estoque** (Sprint 3 - Semana 3)
5. ⏳ **Financeiro & Relatórios** (Sprint 4 - Semana 4)

---

## 🎯 Meta Final

**Backend completo em 4 semanas com:**
- ✅ API REST completa
- ✅ Autenticação JWT
- ✅ 10+ módulos implementados
- ✅ Documentação Swagger
- ✅ Testes automatizados
- ✅ Deploy em produção

**Estimativa:** 4 semanas de desenvolvimento full-time

---

**🚀 VAMOS COMEÇAR O BACKEND!**
