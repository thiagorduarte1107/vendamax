# 🎨 VendaMax - Design System

Documentação completa do sistema de design minimalista do VendaMax.

## 📐 Princípios de Design

### Minimalismo
- Foco no conteúdo
- Elementos essenciais apenas
- Espaçamento generoso
- Hierarquia visual clara

### Profissionalismo
- Cores neutras (preto e branco)
- Ícones coloridos para destaque
- Tipografia moderna e legível
- Consistência em todos os componentes

### Inspiração
- **Apple** - Minimalismo e elegância
- **Notion** - Organização e clareza
- **Figma** - Interface limpa e funcional

## 🎨 Paleta de Cores

### Cores Base
```scss
// Backgrounds
--background: 0 0% 100%              // #FFFFFF - Branco puro
--background-secondary: 0 0% 98%     // #FAFAFA - Cinza muito claro
--card: 0 0% 100%                    // #FFFFFF - Branco

// Textos
--text-primary: 0 0% 9%              // #171717 - Preto
--text-secondary: 0 0% 45%           // #737373 - Cinza médio
--text-tertiary: 0 0% 64%            // #A3A3A3 - Cinza claro

// Bordas
--border: 0 0% 90%                   // #E5E5E5 - Cinza muito claro
--border-strong: 0 0% 80%            // #CCCCCC - Cinza claro
--divider: 0 0% 93%                  // #EDEDED - Cinza quase branco
```

### Cores de Ícones (Vibrantes)
```scss
--icon-primary: 221 83% 53%          // #3B82F6 - Azul
--icon-primary-bg: 221 83% 53% / 0.1 // Azul transparente

--icon-success: 142 76% 36%          // #16A34A - Verde
--icon-success-bg: 142 76% 36% / 0.1 // Verde transparente

--icon-warning: 38 92% 50%           // #F59E0B - Laranja
--icon-warning-bg: 38 92% 50% / 0.1  // Laranja transparente

--icon-danger: 0 84% 60%             // #EF4444 - Vermelho
--icon-danger-bg: 0 84% 60% / 0.1    // Vermelho transparente

--icon-purple: 271 81% 56%           // #A855F7 - Roxo
--icon-purple-bg: 271 81% 56% / 0.1  // Roxo transparente
```

### Uso das Cores

| Elemento | Cor | Uso |
|----------|-----|-----|
| **Vendas** | Azul | Ícones de vendas, produtos |
| **Sucesso** | Verde | Confirmações, status positivo |
| **Alerta** | Laranja | Avisos, estoque baixo |
| **Erro** | Vermelho | Erros, exclusões |
| **Premium** | Roxo | Recursos especiais |

## 📝 Tipografia

### Fontes

#### Inter (Sans-serif)
```scss
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```
**Uso:** Interface geral, textos, labels

#### JetBrains Mono (Monospace)
```scss
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
```
**Uso:** Valores monetários, números, códigos

### Tamanhos de Fonte
```scss
--text-xs: 0.75rem      // 12px
--text-sm: 0.875rem     // 14px
--text-base: 1rem       // 16px
--text-lg: 1.125rem     // 18px
--text-xl: 1.25rem      // 20px
--text-2xl: 1.5rem      // 24px
--text-3xl: 1.875rem    // 30px
```

### Pesos de Fonte
```scss
--font-light: 300
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
--font-extrabold: 800
```

### Hierarquia Tipográfica

| Elemento | Tamanho | Peso | Uso |
|----------|---------|------|-----|
| **H1** | 1.875rem | 600 | Títulos de página |
| **H2** | 1.25rem | 600 | Títulos de seção |
| **Body** | 1rem | 400 | Texto geral |
| **Small** | 0.875rem | 400 | Textos secundários |
| **Caption** | 0.75rem | 500 | Legendas, hints |

## 🔲 Espaçamento

### Sistema de Espaçamento (rem)
```scss
--spacing-0: 0
--spacing-1: 0.25rem    // 4px
--spacing-2: 0.5rem     // 8px
--spacing-3: 0.75rem    // 12px
--spacing-4: 1rem       // 16px
--spacing-5: 1.25rem    // 20px
--spacing-6: 1.5rem     // 24px
--spacing-8: 2rem       // 32px
--spacing-10: 2.5rem    // 40px
--spacing-12: 3rem      // 48px
```

### Border Radius
```scss
--radius-sm: 0.25rem    // 4px
--radius: 0.5rem        // 8px
--radius-md: 0.75rem    // 12px
--radius-lg: 1rem       // 16px
--radius-xl: 1.5rem     // 24px
--radius-full: 9999px   // Círculo
```

## 🎭 Sombras

```scss
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)
```

## 🧩 Componentes

### Cards
```scss
background: hsl(var(--card))
border: 1px solid hsl(var(--border))
border-radius: var(--radius)
box-shadow: var(--shadow-sm)
padding: 1.5rem
```

### Botões

#### Primary
```scss
background: hsl(var(--text-primary))
color: hsl(var(--background))
padding: 0.5rem 1rem
border-radius: var(--radius)
font-weight: 500
```

#### Secondary
```scss
background: transparent
border: 1px solid hsl(var(--border))
color: hsl(var(--text-primary))
```

### Inputs
```scss
border: 1px solid hsl(var(--border))
border-radius: var(--radius)
padding: 0.75rem
font-size: var(--text-base)
background: hsl(var(--background))

// Focus
border-color: hsl(var(--icon-primary))
outline: 2px solid hsl(var(--icon-primary) / 0.1)
```

### Modais (Dialogs)
```scss
width: 600px
max-width: 90vw
border-radius: var(--radius-lg)
box-shadow: var(--shadow-xl)

// Header
padding: 1.5rem
border-bottom: 1px solid hsl(var(--border))

// Content
padding: 1.5rem
max-height: 60vh
overflow-y: auto

// Footer
padding: 1rem 1.5rem
border-top: 1px solid hsl(var(--border))
background: hsl(var(--background-secondary))
```

## 🎯 Ícones

### Categorias de Ícones

| Categoria | Cor | Exemplos |
|-----------|-----|----------|
| **Ações Principais** | Azul | add, edit, save |
| **Sucesso** | Verde | check, done, verified |
| **Avisos** | Laranja | warning, alert |
| **Perigo** | Vermelho | delete, error, close |
| **Informação** | Roxo | info, help |

### Tamanhos
```scss
--icon-sm: 1rem      // 16px
--icon-base: 1.25rem // 20px
--icon-lg: 1.5rem    // 24px
--icon-xl: 2rem      // 32px
```

## 🎨 Avatar

### Gradiente
```scss
background: linear-gradient(135deg, 
  hsl(var(--icon-primary)), 
  hsl(var(--icon-purple))
)
```

### Tamanhos
- **Small:** 32px (2rem)
- **Medium:** 40px (2.5rem)
- **Large:** 48px (3rem)
- **XLarge:** 56px (3.5rem)

## 📱 Responsividade

### Breakpoints
```scss
--mobile: 640px
--tablet: 768px
--desktop: 1024px
--wide: 1280px
```

### Grid
```scss
// Mobile: 1 coluna
// Tablet: 2 colunas
// Desktop: 3-4 colunas
```

## ✨ Animações

### Transições
```scss
--transition-fast: 150ms ease
--transition-base: 200ms ease
--transition-slow: 300ms ease
```

### Hover States
```scss
// Lift
transform: translateY(-2px)
box-shadow: var(--shadow-lg)

// Scale
transform: scale(1.02)

// Opacity
opacity: 0.8
```

## 🎭 Estados

### Hover
- Sombra aumentada
- Cor mais escura
- Transform sutil

### Focus
- Outline colorido
- Border destacado
- Background alterado

### Disabled
- Opacity: 0.5
- Cursor: not-allowed
- Cores dessaturadas

### Error
- Border vermelho
- Ícone vermelho
- Mensagem de erro

## 📋 Máscaras e Validações

### Máscara de Moeda
```typescript
// Input: 1234
// Output: R$ 12,34

// Input: 123456
// Output: R$ 1.234,56
```

### Validações
- Required: Campo obrigatório
- Email: Formato de email
- Min/Max: Valores mínimos/máximos
- Pattern: Regex customizado

## 🎯 Boas Práticas

### Do's ✅
- Use variáveis CSS para cores
- Mantenha espaçamento consistente
- Use ícones coloridos para destaque
- Aplique transições suaves
- Valide formulários em tempo real

### Don'ts ❌
- Não use cores hardcoded
- Não misture unidades (px, rem, em)
- Não abuse de animações
- Não ignore estados de erro
- Não quebre a hierarquia visual

## 📚 Referências

- [Inter Font](https://fonts.google.com/specimen/Inter)
- [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)
- [Material Icons](https://fonts.google.com/icons)
- [Angular Material](https://material.angular.io/)

---

**VendaMax Design System v1.0**  
**Última atualização:** Novembro 2025
