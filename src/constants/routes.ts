export const ROUTES = {
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  DASHBOARD: "/dashboard",
  EMPLOYEES: "/employees",
  EMPLOYEE_CREATE: "/employees/create",
  EMPLOYEE_DETAIL: (id: string) => `/employees/${id}`,
} as const;
