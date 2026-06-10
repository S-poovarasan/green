import type { SubtrainerListModel } from "./SubtrainerInterface";
import type { courses } from "./RegisterStudentInterface";

export interface getGroupsResponse {
  status: boolean;
  message: string;
  listcourse: courses[];
  listSubTrainer: SubtrainerListModel[];
  listallgroups: ListGroups[];
}

export interface Topic {
  name: string;
  fromTime: string;
  toTime: string;
  date: string;
}

export interface NewGroup {
  groupname: string;
  description: string;
  courseId: number;
  subtrainerId: number;
}

export interface NewGroupsResponse {
  status: boolean;
  message: string;
}

export interface ListGroups {
  refGId: number;
  refGName: string;
  refGDescription: string;
  refGStatus: boolean;
  refHGId: number;
  refCourseId: number;
  refUserId: number;
  refCourseName: string;
  refUserName: string;
  userCourseCount: number;
  totalTopics: number;
  completedTopics: number;
  listclass: EditTopic[];
}

export interface EditGroupsData {
  refGId: number;
  refGName: string;
  refGDescription: string;
  listclass: EditTopic[];
}

export interface EditTopic {
  refCLId: number;
  refCLName: string;
  refCLFromTime: string;
  refCLToTime: string;
  refCLDate: string;
  refCLLink?: string;
  refCLRecordingLink?: string;
  refCLCompletionStatus?: boolean;
  refCLStatus?: string;
}

export interface StudentListData {
  refUserId: number;
  refUserName: string;
}

export interface GetStudentGroupList {
  status: boolean;
  message: string;
  data: StudentListData[];
}

