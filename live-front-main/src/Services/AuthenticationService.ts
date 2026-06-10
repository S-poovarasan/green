import type {
  LoginReq,
  LoginResponse,
} from "@/Interfaces/AuthenticationsInterface";
import axios from "axios";

export const AuthenticationService = {
  login: async (formData: LoginReq) => {
    const res = await axios.post<LoginResponse>(
      `${import.meta.env.VITE_API_URL}/v1/authentication/login`,
      formData
    );

    return res.data;
  },
};
