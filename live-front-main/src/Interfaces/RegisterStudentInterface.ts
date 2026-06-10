export interface getRegisterStudent {
  status: boolean;
  message: string;
  data: courses[];
}

export interface courses {
  refCourseId: number;
  refCourseName: string;
}

export interface NewRegisterFormData {
  enrolldate: string;
  fullname: string;
  phonenumber: string | null;
  whatsappnumber: string | null;
  emailid: string;
  dob: string;
  highesteducation: string;
  currentLocation: string;
  fathersmothersoccupation: string;
  passedoutyear: string;
  workexprience: string;
  courseselection: string;
  preference: string;
}

export interface CheckUserIdRegisterStudent {
  status: boolean;
  message: string;
  countId: string;
  CourseName: string;
  errorStatus: string;
}

export interface HandoverResponse {
  status: boolean;
  message: string;
}
