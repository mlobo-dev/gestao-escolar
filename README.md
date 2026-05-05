<p align="center">
  <img src="./assets/images/logo.png" width="150" alt="EduManager Logo" />
</p>

# Gestão Escolar 🍎

[![React Native](https://img.shields.io/badge/React_Native-0.83.6-61DAFB?logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK_55-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Gluestack UI](https://img.shields.io/badge/Gluestack-UI-F43F5E)](https://gluestack.io/)

Uma aplicação robusta de gestão de escolas públicas, desenvolvida para o desafio técnico Prover. O projeto utiliza o ecossistema Expo com **Development Client** para entregar uma experiência fluida, offline-first e com alta fidelidade visual.

---

## ✨ Principais Funcionalidades

- 🏫 **Gestão de Escolas**: Cadastro, edição, listagem e exclusão de unidades escolares.
- 📚 **Gestão de Turmas**: Controle total de turmas associadas a cada escola.
- 🔐 **Autenticação Keycloak**: Integração segura com protocolo OIDC.
- 🌍 **Internacionalização**: Suporte completo para PT-BR e EN.
- 🌗 **Modo Escuro/Claro**: Interface adaptativa e persistente.
- 📴 **Offline-first**: Sincronização e persistência de dados local com AsyncStorage.
- 🔍 **Busca Avançada**: Filtros em tempo real em todas as listagens.

---

## 🚀 Tecnologias Utilizadas

| Camada | Ferramentas |
| :--- | :--- |
| **Framework** | Expo SDK 55 + React Native 0.83 |
| **Linguagem** | TypeScript (Estrito) |
| **UI/UX** | Gluestack UI + NativeWind (Tailwind) |
| **Estado** | Zustand + Persist Middleware |
| **Backend Mock** | MirageJS |
| **Autenticação** | Keycloak (expo-auth-session) |
| **Testes** | Jest + React Testing Library |

---

## 🛠️ Requisitos Mínimos (Ambiente)

Antes de iniciar, certifique-se de ter o ambiente de desenvolvimento React Native configurado:

- **Node.js**: v18 ou superior.
- **Java JDK**: v17 (necessário para o build nativo do Android).
- **Android Studio**: SDK configurado e um emulador (ou dispositivo físico via USB).
- **Compatibilidade Android**: Testado em **API Level 34** (Android 14) e **API Level 35** (Android 15).
- **EAS CLI**: Caso deseje realizar builds em nuvem (`npm install -g eas-cli`).

---

## 📦 Guia de Instalação e Execução

Siga os passos abaixo para preparar e rodar o projeto localmente.

### 1. Instalação de Dependências
```bash
npm install
```

### 2. Execução (Development Client)
Como este projeto utiliza módulos nativos customizados e suporte ao Keycloak, ele requer a geração de um **Development Build**.

**Para Android:**
```bash
npx expo run:android
```
Este comando irá compilar o código nativo, instalar o APK de desenvolvimento no seu dispositivo e iniciar o Metro Bundler automaticamente.

**Para Web (Preview):**
```bash
npx expo start --web
```

---

## ⚙️ Configuração de Ambiente

O projeto utiliza variáveis de ambiente para gerenciar a integração com o Keycloak e comportamentos de desenvolvimento. Crie um arquivo `.env` na raiz da pasta `gestao-escolar` (baseado no `.env.example`):

| Variável | Descrição |
| :--- | :--- |
| `EXPO_PUBLIC_KEYCLOAK_URL` | URL base do servidor Keycloak. |
| `EXPO_PUBLIC_KEYCLOAK_REALM` | Nome do Realm no Keycloak. |
| `EXPO_PUBLIC_KEYCLOAK_CLIENT_ID` | Client ID da aplicação. |
| `EXPO_PUBLIC_SKIP_AUTH` | Se `true` (padrão), ignora o fluxo de OIDC e utiliza um usuário mock. |

> **💡 Dica de Avaliação**: Por padrão, a aplicação está configurada com `EXPO_PUBLIC_SKIP_AUTH=true` para permitir o teste imediato de todas as funcionalidades sem a necessidade de um servidor Keycloak ativo. Caso deseje testar o fluxo real de OIDC, altere esta variável para `false`.

### 🔑 Provisionamento do Keycloak
Caso deseje configurar um ambiente local ou de staging do Keycloak para testar a integração real, os arquivos de configuração do Realm (usuários, clientes e escopos) estão disponíveis em:
👉 [**etc/keycloak/realm-export.json**](./etc/keycloak/realm-export.json)

---

## 🧪 Testes e Qualidade

O projeto possui uma suíte de testes abrangente para garantir a estabilidade das regras de negócio.

### Executar Testes Unitários
```bash
npm test
```

### Relatório de Cobertura
```bash
npm test -- --coverage --coverageReporters="text-summary"
```
*Atualmente com **84% de cobertura** nas funções críticas.*

---

## 🏗️ Arquitetura e Decisões Técnicas

O projeto segue princípios de **Clean Architecture** e **S.O.L.I.D.**, garantindo manutenibilidade e escalabilidade. A organização é baseada em **Features**, onde cada funcionalidade importante tem seu próprio ecossistema.

### 📁 Estrutura de Pastas

```text
.
├── app/                  # Camada de Roteamento (Expo Router)
│   ├── (auth)/           # Fluxos de autenticação (Login)
│   ├── school/           # Rotas de Escolas (Listagem, Cadastro, Edição)
│   ├── class/            # Rotas de Turmas (Listagem, Cadastro, Edição)
│   └── _layout.tsx       # Root Layout e Injeção de Providers
├── src/                  # Core da Aplicação
│   ├── components/       # Componentes de UI genéricos e reutilizáveis
│   ├── styles/           # Estilos globais e configurações do NativeWind
│   ├── context/          # Provedores de estado (SchoolContext, ThemeContext)
│   ├── features/         # Módulos de negócio (Feature-First)
│   │   ├── schools/      # Screens e Componentes específicos de Escolas
│   │   └── classes/      # Screens e Componentes específicos de Turmas
│   ├── services/         # Integração com APIs (SchoolService, ClassService)
│   ├── types/            # Definições de Interfaces e Types TypeScript
│   ├── constants/        # Enums e configurações globais
│   ├── hooks/            # Hooks customizados compartilhados
│   ├── i18n/             # Configurações de Internacionalização
│   └── mocks/            # Configuração do MirageJS (Mock Backend)
├── etc/                  # Configurações de infraestrutura (Keycloak)
├── docs/                 # Documentação de processo e requisitos
│   └── checklist.md      # Relatório de conformidade dos requisitos
```

### Development Client vs Expo Go
A escolha pelo **Development Client** em detrimento ao Expo Go tradicional reflete uma abordagem profissional e alinhada com padrões de mercado para ambientes de produção. Esta estratégia permite lidar com requisitos customizados (como a integração nativa com Keycloak e SDKs bleeding-edge) que excedem as capacidades padrão do Expo Go, garantindo que o ambiente de desenvolvimento seja uma réplica fiel do comportamento nativo final do aplicativo.

### Mock API (MirageJS)
Utilizamos o **MirageJS** para simular um backend completo com suporte a persistência, relacionamentos entre entidades e paginação real (limit/offset), permitindo o desenvolvimento e avaliação sem dependência de uma API externa.

### Persistência Offline
O estado global é gerenciado pelo **Zustand** com persistência em **AsyncStorage**, garantindo que as alterações feitas no mock persistam mesmo após o fechamento do aplicativo.

---

## 🎨 Design e UX

- **Gluestack UI**: Utilizado para componentes de UI robustos e acessíveis.
- **NativeWind v4**: Implementação de estilos via Tailwind CSS para maior agilidade e consistência visual.
- **Temas Dinâmicos**: Suporte nativo a Light/Dark Mode com transições suaves.
- **Micro-interações**: Feedback visual em botões, modais e transições de tela.

---

## 📋 Requisitos Mínimos e Checklist

Para visualizar a lista completa de requisitos mínimos atendidos, tecnologias detalhadas e critérios de avaliação do desafio:

👉 [**Acessar Checklist Completo do Projeto**](./docs/checklist.md)

---

Desenvolvido para o Desafio Técnico Prover. Foco em excelência técnica, performance e design premium. 🚀
