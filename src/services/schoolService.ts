import { apiFetch } from "./api";
import { School } from "../types";

export const schoolService = {
  getSchools: (page = 1, limit = 10) => 
    apiFetch(`/schools?page=${page}&limit=${limit}`),

  createSchool: (school: Omit<School, "id" | "countClasses">) => 
    apiFetch("/schools", {
      method: "POST",
      body: JSON.stringify(school),
    }),

  updateSchool: (id: string, school: Partial<School>) => 
    apiFetch(`/schools/${id}`, {
      method: "PATCH",
      body: JSON.stringify(school),
    }),

  deleteSchool: (id: string) => 
    apiFetch(`/schools/${id}`, { method: "DELETE" }),
};
