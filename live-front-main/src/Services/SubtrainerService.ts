import type { HandoverResponse } from "@/Interfaces/RegisterStudentInterface";
import { decrypt, encrypt } from "@/lib/Helper";
import axios from "axios";
import { tokenService } from "./tokenService";
import type {
  getSubtrainerResponse,
  NewSubtrainerRegistrationFormData,
} from "@/Interfaces/SubtrainerInterface";

export const SubtrainerService = {
  newSubtrainer: async (formData: NewSubtrainerRegistrationFormData) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      {
        fullname: formData.fullname,
        emailid: formData.emailid,
        dob: formData.dob,
        currentLocation: formData.currentLocation,
        workexprience: formData.workexprience,
        profileImage: formData.profile_img,
        aadhar: formData.aadhar,
        resume: formData.resume,
        phonenumber: formData.phonenumber,
      },
      token
    );

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/v1/subtrainer/new`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    const decryptedData: HandoverResponse = decrypt(
      res.data.data,
      res.data.token
    );
    tokenService.setToken(res.data.token);
    return decryptedData;
  },

  editSubtrainer: async (formData: NewSubtrainerRegistrationFormData) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      {
        id: formData?.id,
        fullname: formData.fullname,
        emailid: formData.emailid,
        dob: formData.dob,
        currentLocation: formData.currentLocation,
        workexprience: formData.workexprience,
        profileImage: formData.profile_img,
        aadhar: formData.aadhar,
        resume: formData.resume,
        phonenumber: formData.phonenumber,
        userStatus: formData.userStatus,
      },
      token
    );

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/v1/subtrainer/edit`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    const decryptedData: HandoverResponse = decrypt(
      res.data.data,
      res.data.token
    );
    tokenService.setToken(res.data.token);
    return decryptedData;
  },

  getSubtrainer: async (id: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      {
        id: id,
      },
      token
    );

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/v1/subtrainer/`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    const decryptedData: getSubtrainerResponse = decrypt(
      res.data.data,
      res.data.token
    );
    tokenService.setToken(res.data.token);
    return decryptedData;
  },
};
