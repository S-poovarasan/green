export interface getGetSyllabusResponse {
    status: boolean;
    message: string;
    syllabusData: SyllabusModel[];
}

export interface SyllabusModel {
  refCourseId: number;
  refCourseName: string;
  refCourseStatus: boolean;
}