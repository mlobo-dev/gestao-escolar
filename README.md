# Gestão Escolar 🍎

Uma aplicação robusta de gestão de escolas públicas, desenvolvida como parte do desafio técnico Prover. O projeto utiliza tecnologias modernas do ecossistema React Native para entregar uma experiência fluida, offline-first e com alta fidelidade visual.

---

## 🚀 Tecnologias Utilizadas

O projeto foi construído utilizando as versões estáveis mais recentes:

- **Plataforma**: Expo SDK 55.0.19
- **Framework**: React Native (React 19.2.5 / RN 0.83.6)
- **Navegação**: Expo Router (File-based navigation)
- **UI & Styling**: Gluestack UI v2 + NativeWind v4 (Tailwind CSS)
- **Estado**: Zustand com persistência em AsyncStorage
- **Autenticação**: Keycloak (OIDC/PKCE) via Expo Auth Session
- **Internacionalização**: i18next (Suporte PT-BR / EN)
- **Mock API**: MirageJS para simulação de backend com suporte a paginação
- **Testes**: Jest + Testing Library (Suíte de testes unitários)

---

## ✨ Recursos Adicionais e Aprimoramentos

Além dos requisitos básicos, este projeto implementa funcionalidades avançadas:

- **🔐 Autenticação Segura**: Fluxo de login integrado ao Keycloak com proteção de rotas e persistência de sessão.
- **🌍 Internacionalização (i18n)**: Suporte completo a Português e Inglês com troca dinâmica de idioma.
- **🌓 Suporte a Temas Estabilizado**: Tema escuro implementado via Store manual para garantir transições suaves e evitar conflitos.
- **📈 Paginação & Infinite Scroll**: Arquitetura preparada para grandes volumes de dados nas listagens.
- **🎨 Interface de Alta Fidelidade**: UI moderna com foco em usabilidade e efeitos visuais contemporâneos.
- **📱 Layout Adaptativo**: Interface otimizada para diferentes tamanhos de tela (Mobile e Tablet).

---

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
1. Inicie o servidor Metro:
   ```bash
   npx expo start
   ```
2. Abra o app no emulador Android ou via Expo Go.

---

## 🛠️ Detalhes Técnicos & Mock API

### MirageJS (Backend Simulado)
O projeto utiliza **MirageJS** para interceptar as requisições HTTP e retornar dados simulados. Isso permite que o app funcione de forma totalmente independente de um servidor real.

- **Endpoints**:
  - `GET /api/schools`: Lista com paginação (limit/offset).
  - `POST /api/schools`: Criação de unidades.
  - `GET /api/schools/:id/classes`: Filtro contextual de turmas.
  - `POST /api/classes`: Cadastro de turmas associadas.

### Persistência Offline
Utilizamos **Zustand** com o middleware `persist` e o **AsyncStorage**. 
- Todas as alterações (Criação, Edição, Exclusão) são persistidas localmente.
- Isso garante que os dados não sejam perdidos ao fechar o app.

---

### Executar Testes
```bash
npm test
```

### Gerar Relatório de Cobertura (84%)
- **Tabela Completa**: `npm test -- --coverage`
- **Resumo no Terminal**: `npm test -- --coverage --coverageReporters="text-summary"`

---
Desenvolvido por Antigravity para o Desafio Técnico Prover. Foco em excelência técnica, performance e design premium. 🚀
