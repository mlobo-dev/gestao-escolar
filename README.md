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
- **Web (Recomendado para teste imediato)**:
  ```bash
  npm run web
  ```
- **Android/iOS (Expo Go)**:
  ```bash
  npm run start
  ```
  *(Escaneie o QR Code com o app Expo Go).*

### Testes
Para rodar a suíte de testes unitários:
```bash
npm test
```

## 🏗️ Arquitetura

O projeto segue princípios de **Clean Code** e **S.O.L.I.D.**, com separação clara de responsabilidades:
- `app/`: Roteamento e telas (Expo Router).
- `src/components/`: Componentes de UI reutilizáveis.
- `src/store/`: Gerenciamento de estado global e lógica de persistência.
- `src/mocks/`: Configuração do servidor de simulação MirageJS.
- `src/types/`: Definições globais de TypeScript.

---
Desenvolvido com foco em excelência técnica e experiência do usuário.
