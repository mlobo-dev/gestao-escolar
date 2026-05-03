# Gestão Escolar 🍎

Uma aplicação premium de gestão de escolas públicas, desenvolvida como parte do desafio técnico Prover. O projeto utiliza as tecnologias mais modernas do ecossistema React Native para entregar uma experiência fluida, offline-first e com alta fidelidade visual.

---

## 🚀 Tecnologias (The 200% Stack)

O projeto foi construído utilizando as versões mais recentes e estáveis das tecnologias líderes de mercado:

- **Plataforma**: Expo SDK 55.0.19
- **Framework**: React Native (React 19.2.5 / RN 0.83.6)
- **Navegação**: Expo Router (File-based navigation)
- **UI & Styling**: Gluestack UI v2 + NativeWind v4 (Tailwind CSS)
- **Estado**: Zustand com persistência em AsyncStorage
- **Autenticação**: Keycloak (OIDC/PKCE) via Expo Auth Session
- **Internacionalização**: i18next (Suporte PT-BR / EN)
- **Mock API**: MirageJS para simulação completa de backend com Paginação
- **Testes**: Jest + Testing Library (15 testes unitários)

---

## ✨ Diferenciais Premium (Entrega 200%)

Além dos requisitos básicos, este projeto implementa funcionalidades de nível Enterprise:

- **🔐 Autenticação Enterprise**: Fluxo de login integrado ao Keycloak com proteção de rotas e persistência de sessão.
- **🌍 Multi-idioma (i18n)**: Suporte completo a Português e Inglês, com troca de idioma em tempo real.
- **🌓 Dark Mode Estabilizado**: Tema escuro implementado via Store manual para evitar conflitos de navegação no Android.
- **📈 Paginação & Infinite Scroll**: Arquitetura preparada para grandes volumes de dados nas listagens de escolas e turmas.
- **🎨 Glassmorphism Design**: UI moderna com efeitos de transparência, blur e micro-animações.
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

## 🧪 Suíte de Testes
Rodamos testes unitários para garantir que a lógica de negócio e os componentes de UI estejam funcionando:
```bash
npm test
```

---
Desenvolvido por Antigravity para o Desafio Técnico Prover. Foco em excelência técnica, performance e design premium. 🚀
