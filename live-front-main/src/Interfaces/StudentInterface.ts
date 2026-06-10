export interface getCandidateAssignmentReponse {
  status: boolean;
  message: string;
  data: ListStudentData[];
}

export interface ListStudentData {
  StudentName: string;
  CourseName: string;
  HandlerName: string;
  StudentStatus: boolean;
  refCourseId: number;
  refUCOId: number;
  refGName: string;
}

export interface ListCourseNSubtrainerModel {
  refCourseId: number;
  refCourseName: string;
  refHGId: number;
  refGId: number;
  refGName: string;
  refUserName: string;
}

export interface ListCourseNSubtrainerResponse {
  status: boolean;
  message: string;
  data: ListCourseNSubtrainerModel[];
}
