export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
  },
  EMPLOYEES: {
    LIST: "/employees",
    CREATE: "/employees",
    DETAIL: (id: string) => `/employees/${id}`,
    UPDATE: (id: string) => `/employees/${id}`,
    DELETE: (id: string) => `/employees/${id}`,
  },
} as const;
