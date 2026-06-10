import { decrypt, encrypt } from "@/lib/Helper";
import axios from "axios";
import { tokenService } from "./tokenService";
import type {
  EditGroupsData,
  getGroupsResponse,
  NewGroup,
  NewGroupsResponse,
  Topic,
} from "@/Interfaces/GroupsInterface";

export const GroupsService = {
  getGroups: async (handlerGroupId: number) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      {
        handlerGroupid: handlerGroupId,
      },
      token
    );
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/v1/groups/`,
      { encryptedData: payload },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    const decryptedData: getGroupsResponse = decrypt(
      res.data.data,
      res.data.token
    );
    tokenService.setToken(res.data.token);
    return decryptedData;
  },

  newGroups: async (newGroupData: NewGroup, topics: Topic[]) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      {
        groupname: newGroupData.groupname,
        groupdescription: newGroupData.description,
        courseid: newGroupData.courseId,
        subtrainerid: newGroupData.subtrainerId,
        topic: topics,
      },
      token
    );

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/v1/groups/new`,
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

  updateGroups: async (viewGroupsFormData: EditGroupsData) => {
    const token = localStorage.getItem("token");
    const payload = encrypt(
      {
        refGId: viewGroupsFormData.refGId,
        refGName: viewGroupsFormData.refGName,
        refGDescription: viewGroupsFormData.refGDescription,
        listclass: viewGroupsFormData.listclass,
      },
      token
    );
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/v1/groups/update`,
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
