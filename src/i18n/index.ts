import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcome: "Welcome",
      schools: "Schools",
      classes: "Classes",
      add_school: "Add School",
      edit_school: "Edit School",
      delete: "Delete",
      save: "Save",
      search: "Search...",
      units_found: "{{count}} units found",
      // ... add more as needed
    },
  },
  pt: {
    translation: {
      welcome: "Bem-vindo",
      schools: "Escolas",
      classes: "Turmas",
      add_school: "Nova Unidade",
      edit_school: "Editar Unidade",
      delete: "Excluir",
      save: "Salvar",
      search: "Buscar...",
      units_found: "{{count}} unidades encontradas",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "pt", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
