import api from "./api";
import type { ApiResponse, Jar } from "@/types";

export const jarsService = {
  getJars: async () => {
    const response = await api.get<ApiResponse<{ jars: Jar[] }>>("/jars");
    return response.data.data.jars;
  },

  bulkUpdate: async (percentages: Record<string, number>) => {
    const response = await api.post<ApiResponse<any>>("/jars/bulk-update", {
      percentages,
    });
    return response.data;
  },

  reset: async () => {
    const response = await api.post<ApiResponse<any>>("/jars/reset");
    return response.data;
  },

  deleteAll: async () => {
    const response = await api.post<ApiResponse<any>>("/jars/delete-all");
    return response.data;
  },
};
