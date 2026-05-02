# Gestão Escolar 🍎

Uma aplicação premium de gestão de escolas públicas, desenvolvida como parte do desafio técnico Prover. O projeto utiliza as tecnologias mais modernas do ecossistema React Native para entregar uma experiência fluida, offline-first e com alta qualidade de código.

## 🚀 Tecnologias Utilizadas

- **Plataforma**: Expo SDK 55
- **Framework**: React Native (React 19)
- **Navegação**: Expo Router (File-based navigation)
- **UI & Styling**: Gluestack UI v2 + NativeWind v4 (Tailwind CSS)
- **Estado**: Zustand com persistência em AsyncStorage
- **Mock API**: MirageJS para simulação completa de backend
- **Testes**: Jest + Testing Library
- **Qualidade**: TypeScript + ESLint + Prettier

## ✨ Funcionalidades

- **Gestão de Escolas (CRUD)**: Listagem, criação, edição e exclusão de unidades escolares.
- **Gestão de Turmas (CRUD)**: Registro de turmas vinculadas a escolas específicas (Nome, Turno e Ano Letivo).
- **Busca em Tempo Real**: Filtro inteligente de escolas por nome ou endereço.
- **Persistência Offline**: Todos os dados são salvos localmente, permitindo o uso em áreas sem conectividade.
- **Interface Premium**: Design moderno com foco em usabilidade e responsividade.

## 📦 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
1. Clone o repositório.
2. Acesse a pasta `gestao-escolar`.
3. Instale as dependências:
   ```bash
   npm install --force
   ```
   *(Nota: O uso de `--force` é recomendado devido à versão bleeding-edge do React 19 e SDK 55 em algumas bibliotecas nativas).*

### Execução
## 🛠️ Detalhes Técnicos & Mock API

### MirageJS (Backend Simulado)
O projeto utiliza **MirageJS** para interceptar as requisições HTTP e retornar dados simulados. Isso permite que o app funcione de forma totalmente independente de um servidor real.

- **Configuração**: Localizada em `src/mocks/server.ts`.
- **Endpoints**:
  - `GET /api/schools`: Retorna a lista de escolas.
  - `POST /api/schools`: Cria uma nova escola.
  - `PUT /api/schools/:id`: Atualiza uma escola.
  - `DELETE /api/schools/:id`: Remove uma escola.
  - `GET /api/schools/:id/classes`: Retorna as turmas de uma escola.
  - `POST /api/classes`: Cria uma nova turma.

### Persistência Offline
Utilizamos **Zustand** com o middleware `persist` e o **AsyncStorage**. 
- Quando o app é aberto pela primeira vez, ele carrega dados do MirageJS.
- Quaisquer alterações (Criação, Edição, Exclusão) são persistidas localmente.
- Isso garante que os dados não sejam perdidos ao fechar o app, mesmo em ambiente de teste.

## 🏗️ Arquitetura (200% Completion)

O projeto foi estruturado seguindo o padrão de **Feature-based Architecture**:
- **Domain-Driven Design (Inspirado)**: Separação de lógica por domínios (School, Class).
- **Hooks Patterns**: Toda a lógica de comunicação com o mock e estado está encapsulada em hooks como `useSchools` e `useClasses`.
- **Atomic Design Principles**: Componentes organizados por complexidade.

## 🧪 Suíte de Testes
Rodamos testes unitários para garantir que a lógica de negócio (Hooks e Utils) e os componentes de UI estejam funcionando:
```bash
npm test
```

---
Desenvolvido com foco em excelência técnica, performance e design premium. 🚀
