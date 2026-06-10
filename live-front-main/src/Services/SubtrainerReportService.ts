import { decrypt, encrypt } from "@/lib/Helper";
import axios from "axios";
import { tokenService } from "./tokenService";
import type { getGetSyllabusResponse } from "@/Interfaces/SyllabusInterface";
import type { SubmitReponse, SubmitReportRes, SubTrainerReportFormData } from "@/Interfaces/SubtrainerReport";

export const SubtrainerReportService = {
    getReport: async () => {
        const token = localStorage.getItem("token");

        const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/v1/subtrainer/getReport`,
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );

        const decryptedData: SubmitReportRes = decrypt(
            res.data.data,
            res.data.token
        );
        tokenService.setToken(res.data.token);
        return decryptedData;
    },

    SubmitReport: async (formData: SubTrainerReportFormData, type: number) => {
        const token = localStorage.getItem("token");

        const payload = encrypt(
            {
                ...formData,
                type,
            },
            token
        );

        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/v1/subtrainer/submitReport`,
            { encryptedData: payload },
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );

        const decryptedData: SubmitReponse = decrypt(
            res.data.data,
            res.data.token
        );
        tokenService.setToken(res.data.token);
        return decryptedData;
    },

    updateSyllabus: async (syllabusName: string, syllabusId: number) => {
        const token = localStorage.getItem("token");

        const payload = encrypt(
            {
                syllabusName: syllabusName,
                syllabusId: syllabusId,
            },
            token
        );

        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/v1/syllabus/update`,
            { encryptedData: payload },
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );

        const decryptedData: getGetSyllabusResponse = decrypt(
            res.data.data,
            res.data.token
        );
        tokenService.setToken(res.data.token);
        return decryptedData;
    },
};
