import { decrypt } from "@/lib/Helper";
import axios from "axios";
import { tokenService } from "./tokenService";
import type { getStudentCourseResponse } from "@/Interfaces/StudentDashboardInterface";

export const StudentDashboardService = {
    getGroups: async () => {
        const token = localStorage.getItem("token");
        const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/v1/student/getStudentCourse`,
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );

        const decryptedData: getStudentCourseResponse = decrypt(
            res.data.data,
            res.data.token
        );
        tokenService.setToken(res.data.token);
        return decryptedData;
    },
}