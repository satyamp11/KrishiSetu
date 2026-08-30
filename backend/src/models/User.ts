export interface User {
  id: string;
  name: string;
  emailOrPhone: string;
  passwordHash: string;
  state: string;
  district: string;
  village?: string;
  primaryCrop?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  id: string;
  name: string;
  emailOrPhone: string;
  state: string;
  district: string;
  village?: string;
  primaryCrop?: string;
  createdAt: string;
}

export interface RegisterDTO {
  name: string;
  emailOrPhone: string;
  password: string;
  state: string;
  district: string;
  village?: string;
  primaryCrop?: string;
}

export interface LoginDTO {
  emailOrPhone: string;
  password: string;
}
