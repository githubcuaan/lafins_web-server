import api from "./api";
import type { ApiResponse } from "@/types";

export interface DashboardSummary {
  total_balance: number;
  total_income: number;
  total_outcome: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  jars: any[];
  jar_meta: any;
}

export const dashboardService = {
  getDashboardData: async (params?: { start_date?: string; end_date?: string }) => {
    const response = await api.get<ApiResponse<DashboardData>>("/dashboard", { params });
    return response.data.data;
  },
};
