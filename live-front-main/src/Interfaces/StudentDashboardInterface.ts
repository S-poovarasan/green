export interface getStudentCourseResponse {
    status: boolean;
    message: string;
    data: getStudentCourseData[];
}

export interface getStudentCourseData {
    refHGId: number;
    refCourseName: string;
    refGName: string;
}