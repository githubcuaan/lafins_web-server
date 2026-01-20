// src/pages/dashboard/IncomeOutcomeBar.tsx

import { useRef, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
  type Plugin,
  type TooltipItem,
} from "chart.js";

import useResponsiveChartSize from "@/hooks/useResponsiveChartSize";
import { createResponsiveOptions } from "@/lib/chartOptions";
import { INCOME_COLOR, OUTCOME_COLOR } from "@/lib/chartColors";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// --- Types ---
interface SummaryData {
  total_income?: number | string;
  total_outcome?: number | string;
}

interface IncomeOutcomeBarProps {
  summary?: SummaryData;
}

// --- Helper ---
const buildChartData = (summary: SummaryData = {}): ChartData<"bar"> => {
  const inc = Number(summary?.total_income) || 0;
  const out = Number(summary?.total_outcome) || 0;

  return {
    labels: ["Money"],
    datasets: [
      {
        label: "Income",
        data: [inc],
        backgroundColor: INCOME_COLOR,
        borderRadius: 4,
      },
      {
        label: "Outcome",
        data: [out],
        backgroundColor: OUTCOME_COLOR,
        borderRadius: 4,
      },
    ],
  };
};

const canvasBackgroundPlugin: Plugin<"bar"> = {
  id: "canvasBackground",
  beforeDraw: (chart) => {
    const ctx = chart.canvas.getContext("2d");
    if (!ctx) return;
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    const isDark =
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark");
    if (isDark) {
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, chart.width, chart.height);
    }
    ctx.restore();
  },
};

export function IncomeOutcomeBar({ summary = {} }: IncomeOutcomeBarProps) {
  // Hooks
  const chartData = useMemo(() => buildChartData(summary), [summary]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lấy measuredWidth từ hook (đây là state reactive, an toàn để dùng trong render)
  const { size, measuredWidth } = useResponsiveChartSize(containerRef, {
    min: 220,
    max: 720,
    scale: 0.9,
  });

  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  const options: ChartOptions<"bar"> = useMemo(() => {
    const textColor = isDark ? "#ffffff" : "#0f172a";
    const gridColor = isDark
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)";

    const baseOptions: ChartOptions<"bar"> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: { color: textColor },
        },
        title: {
          display: true,
          text: "Income vs Outcome",
          color: textColor,
          font: { size: 16, weight: "bold" },
        },
        tooltip: {
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          backgroundColor: isDark
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.8)",
          callbacks: {
            label: (context: TooltipItem<"bar">) => {
              const value = context.parsed.y || 0;
              return ` ${context.dataset.label}: ${value.toLocaleString("vi-VN")} VND`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColor,
            callback: (value) => Number(value).toLocaleString("vi-VN"),
          },
          grid: { color: gridColor },
          border: { display: false },
        },
        x: {
          ticks: { color: textColor },
          grid: { display: false },
        },
      },
    };

    // TypeScript hiểu measuredWidth là number, khớp với file helper mới sửa
    return createResponsiveOptions(
      baseOptions,
      measuredWidth ?? 0,
      640,
    ) as ChartOptions<"bar">;
  }, [isDark, measuredWidth]); // Dependency là measuredWidth

  // Render Check
  const hasData = chartData.datasets.some((d) =>
    d.data.some((v) => typeof v === "number" && v >= 0),
  );

  if (!hasData) {
    return (
      <div
        className="w-full p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center"
        style={{ height: Math.round(size * 0.6) || 300 }}
      >
        <span className="text-sm text-slate-500">No data available</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full p-4 rounded-xl shadow-sm dark:shadow-none bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-700"
    >
      <div className="flex flex-col items-center justify-center">
        <div
          style={{
            width: "100%",
            height: Math.max(300, Math.round(size * 0.6)),
          }}
          className="relative"
        >
          <Bar
            data={chartData}
            options={options}
            plugins={[canvasBackgroundPlugin]}
          />
        </div>
      </div>
    </div>
  );
}
