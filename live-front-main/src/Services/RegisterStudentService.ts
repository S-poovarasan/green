import type {
  CheckUserIdRegisterStudent,
  getRegisterStudent,
  HandoverResponse,
  NewRegisterFormData,
} from "@/Interfaces/RegisterStudentInterface";
import { decrypt, encrypt } from "@/lib/Helper";
import axios from "axios";
import { tokenService } from "./tokenService";

export const RegisterStudentService = {
  getRegisterStudent: async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/v1/registration`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    const decryptedData: getRegisterStudent = decrypt(
      res.data.data,
      res.data.token
    );
    tokenService.setToken(res.data.token);
    return decryptedData;
  },

  checkUserIdRegisterStudent: async (
    courseId: string,
    emailid: string,
    phonenumber: string
  ) => {
    const token = localStorage.getItem("token");
    const payload = encrypt({ courseId, emailid, phonenumber }, token);
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/v1/registration/checkId`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    const decryptedData: CheckUserIdRegisterStudent = decrypt(
      res.data.data,
      res.data.token
    );
    tokenService.setToken(res.data.token);
    return decryptedData;
  },

  handOverTrainer: async (formData: NewRegisterFormData) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      {
        enrolldate: formData.enrolldate,
        fullname: formData.fullname,
        emailid: formData.emailid,
        dob: formData.dob,
        highesteducation: formData.highesteducation,
        currentLocation: formData.currentLocation,
        fathersmothersoccupation: formData.fathersmothersoccupation,
        passedoutyear: formData.passedoutyear.toString(),
        workexprience: formData.workexprience.toString(),
        courseselection: formData.courseselection.toString(),
        preference: formData.preference,
        phonenumber: formData.phonenumber,
        whatsappnumber: formData.whatsappnumber,
      },
      token
    );

    console.log({
      enrolldate: formData.enrolldate,
      fullname: formData.fullname,
      emailid: formData.emailid,
      dob: formData.dob,
      highesteducation: formData.highesteducation,
      currentLocation: formData.currentLocation,
      fathersmothersoccupation: formData.fathersmothersoccupation,
      passedoutyear: formData.passedoutyear,
      workexprience: formData.workexprience,
      courseselection: formData.courseselection.toString(),
      preference: formData.preference,
      phonenumber: formData.phonenumber,
      whatsappnumber: formData.whatsappnumber,
    });
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/v1/registration/new`,
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
};
