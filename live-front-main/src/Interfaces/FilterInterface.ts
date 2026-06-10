import type { courses } from "./RegisterStudentInterface";

export interface ListFilterModel {
  refUserId: number;
  refUserName: string;
  refUCMail: string;
  refCourseName: string;
  refGName: string;
  refUSDWorkExperience: string;
  refUserEnrolledDate: string;
  refUserStatus: boolean;
}

export interface getFilterResponse {
  status: boolean;
  message: string;
  data: ListFilterModel[];
}

export interface ListStudentDetailsModel {
  refUserId: number;
  refUserName: string;
  refUserStatus: boolean;
  refUserDOB: string;
  refUserProfile: string;
  refUserCustId: string;
  refUserEnrolledDate: string;
  refUCAddress: string;
  refUCMobileno: string;
  refUCWhatsAppMobileNo: string;
  refUCMail: string;
  refUSDHigherEducation: string;
  refUSDFMOccupation: string;
  refUSDPassedOutYear: string;
  refUSDWorkExperience: string;
  refCourseId: number;
  refUCOPreference: string;
}


export interface getStudentResponse {
  status: boolean;
  message: string;
  data: ListStudentDetailsModel;
  listCourses: courses[];
}
