import { decrypt, encrypt } from "@/lib/Helper";
import axios from "axios";
import { tokenService } from "./tokenService";
import type { getGetSyllabusResponse } from "@/Interfaces/SyllabusInterface";

export const SyllabusService = {
    getSyllabus: async () => {
        const token = localStorage.getItem("token");

        const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/v1/syllabus/`,
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

    newFSyllabus: async (syllabusName: string) => {
        const token = localStorage.getItem("token");

        const payload = encrypt(
            {
                syllabusName: syllabusName,
            },
            token
        );

        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/v1/syllabus/new`,
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
