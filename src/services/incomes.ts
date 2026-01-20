import api from "./api";
import type { ApiResponse, Income, PaginatedResponse } from "@/types";

export interface IncomeFilters {
  search?: string;
  sort?: string;
  page?: number;
}

export const incomesService = {
  // Get all incomes with filters
  getIncomes: async (filters?: IncomeFilters) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.sort) params.append("sort", filters.sort);
    if (filters?.page) params.append("page", filters.page.toString());

    const response = await api.get<ApiResponse<PaginatedResponse<Income>>>(
      `/incomes?${params.toString()}`
    );
    return response.data.data;
  },

  // Create new income
  createIncome: async (data: Partial<Income>) => {
    const response = await api.post<ApiResponse<Income>>("/incomes", data);
    return response.data.data;
  },

  // Update income
  updateIncome: async (id: number, data: Partial<Income>) => {
    const response = await api.put<ApiResponse<Income>>(
      `/incomes/${id}`,
      data
    );
    return response.data.data;
  },

  // Delete income
  deleteIncome: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/incomes/${id}`);
    return response.data;
  },

  // Get single income
  getIncome: async (id: number) => {
    const response = await api.get<ApiResponse<Income>>(`/incomes/${id}`);
    return response.data.data;
  },
};
