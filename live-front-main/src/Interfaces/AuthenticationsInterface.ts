export interface LoginReq {
  username: string;
  password: string;
}

export interface LoginResponse {
  status: boolean;
  message: string;
  roleId?: number;
  id?: number;
  token?: string;
}
