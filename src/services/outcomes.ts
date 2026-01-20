import api from "./api";
import type { ApiResponse, Outcome, PaginatedResponse } from "@/types";

export interface OutcomeFilters {
  search?: string;
  sort?: string;
  page?: number;
}

export const outcomesService = {
  // Get all outcomes with filters
  getOutcomes: async (filters?: OutcomeFilters) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.sort) params.append("sort", filters.sort);
    if (filters?.page) params.append("page", filters.page.toString());

    const response = await api.get<ApiResponse<PaginatedResponse<Outcome>>>(
      `/outcomes?${params.toString()}`
    );
    return response.data.data;
  },

  // Create new outcome
  createOutcome: async (data: Partial<Outcome>) => {
    const response = await api.post<ApiResponse<Outcome>>("/outcomes", data);
    return response.data.data;
  },

  // Update outcome
  updateOutcome: async (id: number, data: Partial<Outcome>) => {
    const response = await api.put<ApiResponse<Outcome>>(
      `/outcomes/${id}`,
      data
    );
    return response.data.data;
  },

  // Delete outcome
  deleteOutcome: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/outcomes/${id}`);
    return response.data;
  },

  // Get single outcome
  getOutcome: async (id: number) => {
    const response = await api.get<ApiResponse<Outcome>>(`/outcomes/${id}`);
    return response.data.data;
  },
};
