package model

type ListCandidateAssignmentModel struct {
	UCOId       int    `json:"refUCOId" gorm:"column:refUCOId"`
	CourseId    int    `json:"refCourseId" gorm:"column:refCourseId"`
	StudentName string `json:"StudetName" gorm:"column:StudetName"`
	CourseName  string `json:"CourseName" gorm:"column:CourseName"`
	HandlerName string `json:"HandlerName" gorm:"column:HandlerName"`
	Status      bool   `json:"StudentStatus" gorm:"column:StudentStatus"`
	GName       string `json:"refGName" gorm:"column:refGName"`
}

type ListHandlerGroups struct {
	CourseId   int    `json:"refCourseId" gorm:"column:refCourseId"`
	CourseName string `json:"refCourseName" gorm:"column:refCourseName"`
	HGId       int    `json:"refHGId" gorm:"column:refHGId"`
	GId        int    `json:"refGId" gorm:"column:refGId"`
	GroupName  string `json:"refGName" gorm:"column:refGName"`
	UserName   string `json:"refUserName" gorm:"column:refUserName"`
}

type ReqGetCourseNSubtrainerModel struct {
	CourseId int `json:"courseId" binding:"required" mapstructure:"courseId"`
}

type ReqAssignStudentModel struct {
	HGId  int `json:"HGId" binding:"required" mapstructure:"HGId"`
	UCOId int `json:"refUCOId" binding:"required" mapstructure:"refUCOId"`
}

type GetStudentCourseModel struct {
	HGId       int    `json:"refHGId" gorm:"column:refHGId"`
	CourseName string `json:"refCourseName" gorm:"column:refCourseName"`
	GName      string `json:"refGName" gorm:"column:refGName"`
}
