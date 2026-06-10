import { decrypt, encrypt } from "@/lib/Helper";
import axios from "axios";
import { tokenService } from "./tokenService";
import type { AddNewTopic, EditGroupsDetails, GetSessionResponse, NewTopic, UpdateLinkTopic } from "@/Interfaces/SessionManagementInterface";
import type { GetStudentGroupList, NewGroupsResponse } from "@/Interfaces/GroupsInterface";

export const SessionManagementService = {
    getSession: async () => {
        const token = localStorage.getItem("token");

        const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/v1/session/`,
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );

        const decryptedData: GetSessionResponse = decrypt(
            res.data.data,
            res.data.token
        );
        tokenService.setToken(res.data.token);
        return decryptedData;
    },

    updateGroupDetailsSession: async (formData: EditGroupsDetails) => {
        const token = localStorage.getItem("token");
        const payload = encrypt(
            formData,
            token
        );


        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/v1/session/updateGroupDetails`,
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

    addNewTopicSession: async (formData: AddNewTopic) => {
        const token = localStorage.getItem("token");
        const payload = encrypt(
            {
                refGId: formData.refGId,
                topic: formData.topic,
            },
            token
        );


        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/v1/session/addTopic`,
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

    editTopicSession: async (formData: NewTopic) => {
        const token = localStorage.getItem("token");
        const payload = encrypt(
            formData,
            token
        );

        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/v1/session/editTopic`,
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

    deleteTopicSession: async (id: number) => {
        const token = localStorage.getItem("token");
        const payload = encrypt(
            {
                refCLId: id
            },
            token
        );

        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/v1/session/deleteTopic`,
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

    updateMeetingLink: async (formData: UpdateLinkTopic) => {
        const token = localStorage.getItem("token");
        const payload = encrypt(
            formData,
            token
        );

        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/v1/session/updateMeetingLinkTopic`,
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

    getGroupStudentList: async (groupId: number) => {
        const token = localStorage.getItem("token");
        const payload = encrypt(
            { "refGId": groupId },
            token
        );

        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/v1/session/listGroupStudent`,
            { encryptedData: payload },
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            }
        );

        const decryptedData: GetStudentGroupList = decrypt(
            res.data.data,
            res.data.token
        );

        tokenService.setToken(res.data.token);
        return decryptedData;
    },

    sendMailStudentList: async (id: number[], refCLId: number) => {
        const token = localStorage.getItem("token");
        const payload = encrypt(
            {
                "id": id,
                "refCLId": refCLId
            },
            token
        );

        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/v1/session/sendMailStudent`,
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

    updateMeetingRecordLink: async (formData: UpdateLinkTopic) => {
        const token = localStorage.getItem("token");
        const payload = encrypt(
            formData,
            token
        );

        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/v1/session/updateMeetingRecordLink`,
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
};
