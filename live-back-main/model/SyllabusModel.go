package model

type SyllabusModel struct {
	CourseId     int    `json:"refCourseId" gorm:"column:refCourseId"`
	CourseName   string `json:"refCourseName" gorm:"column:refCourseName"`
	CourseStatus bool   `json:"refCourseStatus" gorm:"column:refCourseStatus"`
}

type NewSyllabusReq struct {
	SyllabusName string `json:"syllabusName" mapstructure:"syllabusName"`
}

type UpdateSyllabusReq struct {
	SyllabusId   int    `json:"syllabusId" mapstructure:"syllabusId"`
	SyllabusName string `json:"syllabusName" mapstructure:"syllabusName"`
}
