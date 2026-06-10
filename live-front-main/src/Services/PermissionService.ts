import { decrypt, encrypt } from "@/lib/Helper";
import axios from "axios";
import { tokenService } from "./tokenService";
import type { GetLeaveResponseData, GetPermissionRequestResponseData, GetResponseAttendanceData, LeaveFormData, RequestPermissionFormData } from "@/Interfaces/PermissionInterface";
import type { NewGroupsResponse } from "@/Interfaces/GroupsInterface";

export const PermissionService = {
    getAttendanceData: async () => {
        const token = localStorage.getItem("token");
        const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/v1/permission/`,
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );

        const decryptedData: GetResponseAttendanceData = decrypt(
            res.data.data,
            res.data.token
        );
        tokenService.setToken(res.data.token);
        return decryptedData;
    },

    punchIn: async () => {
        const token = localStorage.getItem("token");
        const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/v1/permission/punchIn`,
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );

        const decryptedData: GetResponseAttendanceData = decrypt(
            res.data.data,
            res.data.token
        );
        tokenService.setToken(res.data.token);
        return decryptedData;
    },

    punchOut: async () => {
        const token = localStorage.getItem("token");
        const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/v1/permission/punchOut`,
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );

        const decryptedData: GetResponseAttendanceData = decrypt(
            res.data.data,
            res.data.token
        );
        tokenService.setToken(res.data.token);
        return decryptedData;
    },

    getLeaveData: async () => {
        const token = localStorage.getItem("token");
        const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/v1/leave/`,
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );

        const decryptedData: GetLeaveResponseData = decrypt(
            res.data.data,
            res.data.token
        );
        tokenService.setToken(res.data.token);
        return decryptedData;
    },

    newLeaveRequest: async (formData: LeaveFormData) => {
        const token = localStorage.getItem("token");
        const payload = encrypt(
            {
                ...formData
            },
            token
        );
        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/v1/leave/newLeaveRequest`,
            { encryptedData: payload },
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );

        const decryptedData: NewGroupsResponse = decrypt(
            res.data.data,
            res.data.token
        );
        tokenService.setToken(res.data.token);
        return decryptedData;
    },

    withdrawLeaveRequest: async (refULId: number) => {
        const token = localStorage.getItem("token");
        const payload = encrypt(
            {
                refULId: refULId
            },
            token
        );
        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/v1/leave/withdrawLeaveRequest`,
            { encryptedData: payload },
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );

        const decryptedData: NewGroupsResponse = decrypt(
            res.data.data,
            res.data.token
        );
        tokenService.setToken(res.data.token);
        return decryptedData;
    },

    getPermissionData: async () => {
        const token = localStorage.getItem("token");
        const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/v1/permissionRequest/`,
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );

        const decryptedData: GetPermissionRequestResponseData = decrypt(
            res.data.data,
            res.data.token
        );
        tokenService.setToken(res.data.token);
        return decryptedData;
    },

    newPermissionRequest: async (formData: RequestPermissionFormData) => {
        const token = localStorage.getItem("token");
        const payload = encrypt(
            {
                ...formData
            },
            token
        );
        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/v1/permissionRequest/newPermissionRequest`,
            { encryptedData: payload },
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );

        const decryptedData: NewGroupsResponse = decrypt(
            res.data.data,
            res.data.token
        );
        tokenService.setToken(res.data.token);
        return decryptedData;
    },

    withdrawPermissionRequest: async (refUPId: number) => {
        const token = localStorage.getItem("token");
        const payload = encrypt(
            {
                refUPId: refUPId
            },
            token
        );
        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/v1/permissionRequest/withdrawPermissionRequest`,
            { encryptedData: payload },
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );

        const decryptedData: NewGroupsResponse = decrypt(
            res.data.data,
            res.data.token
        );
        tokenService.setToken(res.data.token);
        return decryptedData;
    },
}