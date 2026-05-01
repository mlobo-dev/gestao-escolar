export interface School {
  id: string;
  name: string;
  address: string;
  countClasses: number;
}

export type Shift = "Morning" | "Afternoon" | "Night" | "Full-time";

export interface SchoolClass {
  id: string;
  schoolId: string;
  name: string;
  shift: Shift;
  academicYear: string;
}
