import type { EditTopic } from "./GroupsInterface";

export interface GetSessionModel {
    refHGId: number;
    refCourseId: number;
    refGId: number;
    refCourseName: string;
    refGName: string;
    refGDescription: string;
    totalClass: number;
    attendedClass: number;
    classes: EditTopic[];
}

export interface GetSessionResponse {
    status: boolean;
    message: string;
    data: GetSessionModel[];
}

export interface EditGroupsDetails {
    refGId: number;
    refGName: string;
    refGDescription: string;
}

export interface NewTopic {
    refCLId?: number,
    refCLDate: string,
    refCLName: string,
    refCLFromTime: string,
    refCLToTime: string,
}

export interface AddNewTopic {
    refGId: number;
    topic: NewTopic[]
}

export interface UpdateLinkTopic {
    refCLId: number,
    refCLLink?: string,
    refCLRecordingLink?: string;
    refCLName: string
}