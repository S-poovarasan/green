export interface AttendanceData {
    refUAId: number; // refUAId
    refUserId: number; // refUserId
    refUAPunchInTime: string; // refUAPunchInTime (ISO string or datetime-local)
    refUAPunchOutTime: string; // refUAPunchOutTime
}

export interface GetResponseAttendanceData {
    status: boolean;
    message: string;
    attendanceData: AttendanceData[];
    timeStamp: string;
}

export interface LeaveFormData {
    startDate: string;
    endDate: string;
    description: string;
}

export interface LeaveResData {
    refULId: number;
    refUserId: number;
    refULStartDate: string;
    refULEndDate: string;
    refULReason: string;
    refULStatus: boolean;
    refULCreatedAt: string;
}

export interface GetLeaveResponseData {
    status: boolean;
    message: string;
    leaveData: LeaveResData[];
}

export interface RequestPermissionFormData {
    date: string;
    startTime: string;
    endTime: string;
    type: string;
    description: string;
}

export interface PermissionData {
    refUPId: number;               // serial / primary key
    refUserId: number;             // integer
    refUPDate: string;             // text (date string)
    refUPStartTime: string;        // text (time string)
    refUPEndTime: string;          // text (time string)
    refUPPermissionType: string;   // text
    refUPReason: string;           // text
    refUPStatus: string;           // text (pending/approved/rejected)
    refUPAccessStatus: boolean;    // boolean
    refUPCreatedAt: string;        // text (timestamp)
    refUPCreatedBy: number;        // integer
    refUPUpdatedAt: string;        // text
    refUPUpdatedBy: number;        // integer
}


export interface GetPermissionRequestResponseData {
    status: boolean;
    message: string;
    permissionData: PermissionData[];
}
