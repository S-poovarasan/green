import { decrypt, encrypt } from "@/lib/Helper";
import axios from "axios";
import { tokenService } from "./tokenService";

export interface UploadFilePayload {
  formFile: FormData;
}

interface UploadImagePayload {
  formImg: FormData;
}

export const FileHandlerService = {
  uploadImage: async ({ formImg }: UploadImagePayload) => {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/v1/filehandler/upload-profile-image`,
      formImg,
      {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(res);
    const decryptData = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);
    return decryptData;
  },

  uploadFile: async ({ formFile }: UploadFilePayload) => {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/v1/filehandler/upload-file`,
      formFile,
      {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(res);
    const decryptData = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);
    return decryptData;
  },

  viewFile: async (fileName: string) => {
    const token = localStorage.getItem("token");
    const payload = encrypt({ fileName }, token);
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/v1/filehandler/view-file`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const decryptData = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);
    console.log(decryptData);
    return decryptData;
  },
  viewProfile: async (fileName: string) => {
    const token = localStorage.getItem("token");
    const payload = encrypt({ fileName }, token);
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/v1/filehandler/view-profile`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const decryptData = decrypt(res.data.data, res.data.token);
    tokenService.setToken(res.data.token);
    console.log(decryptData);
    return decryptData;
  },
};
