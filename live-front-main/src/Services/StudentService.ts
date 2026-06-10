import { decrypt, encrypt } from "@/lib/Helper";
import axios from "axios";
import { tokenService } from "./tokenService";
import type {
  getCandidateAssignmentReponse,
  ListCourseNSubtrainerResponse,
} from "@/Interfaces/StudentInterface";

export const StudentService = {
  getCandidateAssignment: async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/v1/student/candidateassignment`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    const decryptedData: getCandidateAssignmentReponse = decrypt(
      res.data.data,
      res.data.token
    );
    tokenService.setToken(res.data.token);
    console.log('StudentService.ts / decryptedData / 27 -------------------  ', decryptedData);
    return decryptedData;
  },

  getCourseNSubtrainer: async (courseId: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      {
        courseId: courseId,
      },
      token
    );
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/v1/student/getcourseandsubtrainer`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    const decryptedData: ListCourseNSubtrainerResponse = decrypt(
      res.data.data,
      res.data.token
    );
    tokenService.setToken(res.data.token);
    return decryptedData;
  },

  assignStudent: async (GHId: number, refUCOId: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      {
        HGId: GHId,
        refUCOId: refUCOId,
      },
      token
    );
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/v1/student/assignStudent`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    const decryptedData: ListCourseNSubtrainerResponse = decrypt(
      res.data.data,
      res.data.token
    );
    tokenService.setToken(res.data.token);
    return decryptedData;
  },
};
