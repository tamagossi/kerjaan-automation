export interface ApiResponse<T = unknown> {
  status: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T = unknown> {
  status: number;
  message: string;
  data: T[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}
