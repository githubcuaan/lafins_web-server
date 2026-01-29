import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// ---- money logic ----
export const formatMoney = (value: string | number) => {
  if (!value) return "";
  // 1. Convert về string
  // 2. Xóa hết ký tự ko phải số
  // 3. Thêm dấu chấm sau mỗi 3 số
  return String(value)
    .replace(/\D/g, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const parseMoney = (value: string) => {
  // Xóa dấu chấm để lấy số nguyên (VD: "10.000" -> 10000)
  return value.replace(/\./g, "");
};

// -------------------------
