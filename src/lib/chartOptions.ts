// src/lib/chartOptions.ts
/**
 * createResponsiveOptions
 * - baseOptions: chart.js options object
 * - containerRef: ref to measure width
 * - breakpoint: width to switch legend position
 *
 * Comments (vi):
 * Hàm này tách phần logic chuyển vị trí legend dựa trên chiều rộng wrapper.
 */

import type { ChartOptions, ChartType } from "chart.js";

/**
 * createResponsiveOptions
 * Hàm helper để xử lý responsive cho legend của Chart.js
 * Sử dụng 'as any' để bypass các check type quá gắt của TypeScript.
 */
export function createResponsiveOptions<T extends ChartType>(
  baseOptions: ChartOptions<T>,
  currentWidth: number,
  breakpoint: number = 640,
): ChartOptions<T> {
  // 👇 QUAN TRỌNG: Ép kiểu 'as any' ngay tại đây.
  // Điều này bảo TS: "Tao biết tao đang làm gì, coi nó là object thường đi, đừng check undefined nữa"
  const opts = { ...baseOptions } as any;

  if (currentWidth < breakpoint) {
    // Vì opts là 'any', ta có thể truy cập thoải mái mà không lo lỗi "possibly undefined"
    const existingPlugins = opts.plugins || {};
    const existingLegend = existingPlugins.legend || {};
    const existingLabels = existingLegend.labels || {};

    // Gán đè lại cấu hình legend cho mobile
    opts.plugins = {
      ...existingPlugins,
      legend: {
        ...existingLegend,
        position: "bottom", // Xuống dưới
        labels: {
          boxWidth: 10,
          padding: 8,
          ...existingLabels, // Giữ lại font/color cũ
        },
      },
    };
  }

  // Trả về ép kiểu lại thành ChartOptions<T> để bên ngoài dùng vẫn có gợi ý code chuẩn
  return opts as ChartOptions<T>;
}
