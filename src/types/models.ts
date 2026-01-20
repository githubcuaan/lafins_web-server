export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  two_factor_enabled?: boolean;
  created_at: string;
  updated_at: string;
  [key: string]: unknown; // This allows for additional properties...
}

export interface Jar {
  id: number;
  name: string; // Jar name (NEC, FFA, EDU, LTSS, PLAY, GIVE)
  label: string;
  key: string;
  percentage: number;
  balance: number;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}

// Page props for a page that includes jars payload.
// Extend Record<string, unknown> so this type satisfies the usePage<T>() constraint
export interface Jars extends Record<string, unknown> {
  // Use lowercase 'jars' to match common backend payload naming; adjust if backend uses different key
  jars?: Jar[];
}

export interface Income {
  id: number;
  description: string;
  amount: number;
  date: string;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Outcome {
  id: number;
  description: string;
  amount: number;
  date: string;
  jar_id: number;
  jar?: Jar;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
