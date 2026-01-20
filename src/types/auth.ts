export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ResetPasswordData {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface UpdatePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

// ----- Profile -----

export interface UpdateProfileData {
  name: string;
  email: string;
}

// ---- response ------
export interface AuthError {
  message: string;
  errors?: Record<string, string[]>; // {email: ['email is lolololol']}
}
