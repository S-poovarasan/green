import { decrypt, encrypt } from "@/lib/Helper";
import axios from "axios";
import { tokenService } from "./tokenService";
import type { getFilterResponse, getStudentResponse } from "@/Interfaces/FilterInterface";
import type { NewRegisterFormData } from "@/Interfaces/RegisterStudentInterface";

export const FilterService = {
  getFilter: async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/v1/filter/`, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    const decryptedData: getFilterResponse = decrypt(
      res.data.data,
      res.data.token
    );
    tokenService.setToken(res.data.token);
    return decryptedData;
  },

  getPatientData: async (studentId: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      {
        studentId: studentId,
      },
      token
    );
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/v1/filter/getstudent`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

    const decryptedData: getStudentResponse = decrypt(
      res.data.data,
      res.data.token
    );
    tokenService.setToken(res.data.token);
    return decryptedData;
  },

  updatePatientData: async (formData: NewRegisterFormData, studentId: number, userActive: boolean) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      {
        userId: studentId,
        fullname: formData.fullname,
        phonenumber: formData.phonenumber,
        whatsappnumber: formData.whatsappnumber,
        emailid: formData.emailid,
        dob: formData.dob,
        highesteducation: formData.highesteducation,
        currentLocation: formData.currentLocation,
        fathersmothersoccupation: formData.fathersmothersoccupation,
        passedoutyear: formData.passedoutyear,
        workexprience: formData.workexprience.toString(),
        courseselection: formData.courseselection,
        preference: formData.preference,
        userStatus: userActive,
      },
      token
    );
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/v1/filter/updatestudent`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

    const decryptedData: getStudentResponse = decrypt(
      res.data.data,
      res.data.token
    );
    tokenService.setToken(res.data.token);
    return decryptedData;
  },
};
