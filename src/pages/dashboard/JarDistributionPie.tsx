import { useRef, useMemo } from "react";
import useResponsiveChartSize from "@/hooks/useResponsiveChartSize";
import { createResponsiveOptions } from "@/lib/chartOptions";
import { DEFAULT_PALETTE } from "@/lib/chartColors";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJs,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  SubTitle,
  type Chart,
  type ChartOptions,
  type TooltipItem,
  type Plugin,
  type ChartData,
} from "chart.js";
import type { Jar } from "@/types";

ChartJs.register(ArcElement, Tooltip, Legend, Title, SubTitle);

// --- Helper Functions ---
const buildChartData = (
  jars: Jar[] | undefined | null,
): ChartData<"doughnut"> => {
  if (!Array.isArray(jars) || jars.length === 0) {
    return { labels: [], datasets: [] };
  }

  const labels = jars.map((it) => it.label ?? it.name ?? it.key ?? "");
  const values = jars.map(
    (it) => Number(it.balance ?? it.percentage ?? 0) || 0,
  );
  const backgroundColor = DEFAULT_PALETTE;

  return {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: labels.map(
          (_, i) => backgroundColor[i % backgroundColor.length],
        ),
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };
};

const centerTextPlugin: Plugin<"doughnut"> = {
  id: "centerText",
  beforeDraw: (chart: Chart) => {
    const { ctx, chartArea } = chart;
    if (!chartArea) return;
    const { width, height, top, left } = chartArea;
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const datasets = chart.data?.datasets ?? [];
    const total = datasets[0]?.data
      ? (datasets[0].data as number[]).reduce((s, v) => s + (Number(v) || 0), 0)
      : 0;

    const base = Math.min(width, height);
    const scale = 0.5;
    const mainFontPx = Math.max(12, Math.round(base * 0.11 * scale)); // Tăng min size chút cho dễ đọc
    const subFontPx = Math.max(10, Math.round(base * 0.07 * scale));

    ctx.save();
    const isDark =
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark");
    const mainColor = isDark ? "#ffffff" : "#0f172a";
    const subColor = isDark ? "#9ca3af" : "#6b7280";

    ctx.fillStyle = mainColor;
    ctx.font = `600 ${mainFontPx}px ui-sans-serif, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const formatted = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(total);
    ctx.fillText(formatted, centerX, centerY - Math.round(subFontPx / 1.5));

    ctx.fillStyle = subColor;
    ctx.font = `400 ${subFontPx}px ui-sans-serif, system-ui, sans-serif`;
    ctx.fillText("Tổng", centerX, centerY + Math.round(mainFontPx / 2.5));
    ctx.restore();
  },
};

const canvasBackgroundPlugin: Plugin<"doughnut"> = {
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

interface JarDistributionPieProps {
  jars?: Jar[];
}

// --- Main Component ---
export function JarDistributionPie({ jars = [] }: JarDistributionPieProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { size, measuredWidth } = useResponsiveChartSize(containerRef, {
    min: 220,
    max: 420,
    scale: 0.9,
  });

  const chartData = useMemo(() => buildChartData(jars), [jars]);

  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  const options: ChartOptions<"doughnut"> = useMemo(() => {
    const textColor = isDark ? "#ffffff" : "#0f172a";
    const baseOptions: ChartOptions<"doughnut"> = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "60%",
      plugins: {
        legend: {
          position: "right",
          labels: {
            boxWidth: 10,
            padding: 16,
            color: textColor,
            font: { family: "ui-sans-serif, system-ui, sans-serif" },
          },
        },
        tooltip: {
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          backgroundColor: isDark
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.8)",
          callbacks: {
            label: function (context: TooltipItem<"doughnut">) {
              const value = (context.parsed as number) ?? 0;
              const dataset = context.chart.data.datasets[0];
              const total =
                (dataset.data as number[]).reduce(
                  (acc, curr) => acc + (Number(curr) || 0),
                  0,
                ) || 0;
              const pct =
                total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
              return ` ${context.label}: ${value.toLocaleString("vi-VN")} (${pct}%)`;
            },
          },
        },
      },
      elements: {
        arc: {
          borderRadius: 8,
          borderWidth: 2,
          borderColor: isDark ? "#0a0a0a" : "#ffffff",
          hoverOffset: 8,
        },
      },
    };

    // 👇 FIX 3: Truyền số (measuredWidth) thay vì Ref
    // TypeScript giờ hiểu measuredWidth là number, ko báo lỗi ref nữa
    return createResponsiveOptions(
      baseOptions,
      measuredWidth ?? 0,
      640,
    ) as ChartOptions<"doughnut">;
  }, [isDark, measuredWidth]); // Dependency đổi thành measuredWidth

  // --- Render Check ---
  const hasData =
    chartData.datasets?.[0]?.data?.length > 0 &&
    chartData.datasets[0].data.some((v) => v > 0);

  if (!hasData) {
    return (
      <div className="w-full p-8 text-center border border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-900/50">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Chưa có dữ liệu phân bổ hũ
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full p-4 rounded-xl shadow-sm dark:shadow-none bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-700 flex flex-col items-center"
    >
      <div className="w-full mb-4 text-center">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
          Jar Distribution
        </h3>
      </div>

      <div
        style={{ width: size, height: size }}
        className="relative flex items-center justify-center transition-all duration-300"
      >
        <Doughnut
          data={chartData}
          options={options}
          plugins={[centerTextPlugin, canvasBackgroundPlugin]}
        />
      </div>
    </div>
  );
}
