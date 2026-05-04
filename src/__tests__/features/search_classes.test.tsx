import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import SchoolDetailsScreen from "../../../app/school/[id]/index";
import { useSchoolStore } from "../../store/useSchoolStore";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { changeLanguage: jest.fn() }
  })
}));

jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    signOut: jest.fn(),
  }),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    canGoBack: () => true,
  }),
  useLocalSearchParams: () => ({ id: "1" }),
  Stack: {
    Screen: () => null,
  },
}));

const mockClasses = [
  { id: "c1", name: "Matemática A", shift: "Morning", academicYear: new Date().getFullYear().toString(), schoolId: "1" },
  { id: "c2", name: "Português B", shift: "Afternoon", academicYear: new Date().getFullYear().toString(), schoolId: "1" },
  { id: "c3", name: "Ciências C", shift: "Night", academicYear: (new Date().getFullYear() + 1).toString(), schoolId: "1" },
];

const mockStore = {
  schools: [{ id: "1", name: "Escola Teste", address: "Rua Teste", countClasses: 3 }],
  classes: mockClasses,
  fetchClasses: jest.fn(),
  deleteSchool: jest.fn(),
  deleteClass: jest.fn(),
  isLoading: false,
  isLoadingMore: false,
  hasMoreClasses: false,
};

jest.mock("../../store/useSchoolStore", () => ({
  useSchoolStore: jest.fn((selector) => selector(mockStore)),
}));

describe("Busca de Turmas", () => {
  it("deve renderizar o campo de busca", () => {
    const { getByPlaceholderText } = render(<SchoolDetailsScreen />);
    expect(getByPlaceholderText("search")).toBeTruthy();
  });

  it("deve filtrar turmas por nome", () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<SchoolDetailsScreen />);
    
    const input = getByPlaceholderText("search");
    fireEvent.changeText(input, "Matemática");

    expect(getByText("Matemática A")).toBeTruthy();
    expect(queryByText("Português B")).toBeNull();
  });

  it("deve filtrar turmas por turno", () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<SchoolDetailsScreen />);
    
    const input = getByPlaceholderText("search");
    fireEvent.changeText(input, "Night");

    expect(getByText("Ciências C")).toBeTruthy();
    expect(queryByText("Matemática A")).toBeNull();
  });

  it("deve filtrar turmas por ano letivo", () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<SchoolDetailsScreen />);
    
    const input = getByPlaceholderText("search");
    fireEvent.changeText(input, (new Date().getFullYear() + 1).toString());

    expect(getByText("Ciências C")).toBeTruthy();
    expect(queryByText("Matemática A")).toBeNull();
  });

  it("deve mostrar mensagem de erro quando não encontrar resultados", () => {
    const { getByPlaceholderText, getByText } = render(<SchoolDetailsScreen />);
    
    const input = getByPlaceholderText("search");
    fireEvent.changeText(input, "Inexistente");

    expect(getByText("no_results_found")).toBeTruthy();
  });
});
