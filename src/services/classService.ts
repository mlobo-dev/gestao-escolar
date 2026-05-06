import { apiFetch } from "./api";
import { SchoolClass } from "../types";

export const classService = {
  getClasses: (schoolId: string, page = 1, limit = 10) =>
    apiFetch(`/classes?schoolId=${schoolId}&page=${page}&limit=${limit}`),

  createClass: (schoolClass: Omit<SchoolClass, "id">) =>
    apiFetch("/classes", {
      method: "POST",
      body: JSON.stringify(schoolClass),
    }),

  updateClass: (id: string, schoolClass: Partial<SchoolClass>) =>
    apiFetch(`/classes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(schoolClass),
    }),

  deleteClass: (id: string) => apiFetch(`/classes/${id}`, { method: "DELETE" }),
};
