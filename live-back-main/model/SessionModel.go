package model

import "encoding/json"

type GetSessionModel struct {
	RefHGId     int             `json:"refHGId" gorm:"column:refHGId"`
	RefCourseId int             `json:"refCourseId" gorm:"column:refCourseId"`
	RefGId      int             `json:"refGId" gorm:"column:refGId"`
	CourseName  string          `json:"refCourseName" gorm:"column:refCourseName"`
	GroupName   string          `json:"refGName" gorm:"column:refGName"`
	GroupDesc   string          `json:"refGDescription" gorm:"column:refGDescription"`
	TotalClass  int             `json:"totalClass" gorm:"column:totalClass"`
	Attended    int             `json:"attendedClass" gorm:"column:attendedClass"`
	Classes     []ClassModel    `json:"classes" gorm:"-"`
	ClassesJSON json.RawMessage `json:"-" gorm:"column:classes"` // temp store
}

type UpdateGroupDetailsSessiModel struct {
	RefGId          int    `json:"refGId" binding:"required" mapstructure:"refGId"`
	RefGName        string `json:"refGName" binding:"required" mapstructure:"refGName"`
	RefGDescription string `json:"refGDescription" binding:"required" mapstructure:"refGDescription"`
}

type AddTopicSessionModel struct {
	RefGId int               `json:"refGId" binding:"required" mapstructure:"refGId"`
	Topic  []ReqNewListTopic `json:"topic" binding:"required" mapstructure:"topic"`
}

type ReqNewListTopic struct {
	Name     string `json:"refCLName" binding:"required" mapstructure:"refCLName"`
	FromTime string `json:"refCLFromTime" binding:"required" mapstructure:"refCLFromTime"`
	ToTime   string `json:"refCLToTime" binding:"required" mapstructure:"refCLToTime"`
	Date     string `json:"refCLDate" binding:"required" mapstructure:"refCLDate"`
}

type EditTopicSessionModel struct {
	Id       int    `json:"refCLId" binding:"required" mapstructure:"refCLId"`
	Name     string `json:"refCLName" binding:"required" mapstructure:"refCLName"`
	FromTime string `json:"refCLFromTime" binding:"required" mapstructure:"refCLFromTime"`
	ToTime   string `json:"refCLToTime" binding:"required" mapstructure:"refCLToTime"`
	Date     string `json:"refCLDate" binding:"required" mapstructure:"refCLDate"`
}

type DeleteTopicSessionModel struct {
	Id int `json:"refCLId" binding:"required" mapstructure:"refCLId"`
}

type UpdateMeetingLinkTopicSessionModel struct {
	Id          int    `json:"refCLId" binding:"required" mapstructure:"refCLId"`
	MeetingLink string `json:"refCLLink" binding:"required" mapstructure:"refCLLink"`
}

type ListGroupStudentSessionModel struct {
	Id int `json:"refGId" binding:"required" mapstructure:"refGId"`
}

type ListGroupStudentModel struct {
	UserId   int    `json:"refUserId" gorm:"column:refUserId"`
	UserName string `json:"refUserName" gorm:"column:refUserName"`
}

type SendMailStudentModel struct {
	Id   []int `json:"id" binding:"required" mapstructure:"id"`
	CLId int   `json:"refCLId" binding:"required" mapstructure:"refCLId"`
}

type SendMailDataModel struct {
	CLName     string `json:"refCLName" gorm:"column:refCLName"`
	CLDate     string `json:"refCLDate" gorm:"column:refCLDate"`
	CLFromTime string `json:"refCLFromTime" gorm:"column:refCLFromTime"`
	CLToTime   string `json:"refCLToTime" gorm:"column:refCLToTime"`
	CLLink     string `json:"refCLLink" gorm:"column:refCLLink"`
	GName      string `json:"refGName" gorm:"column:refGName"`
	UserName   string `json:"refUserName" gorm:"column:refUserName"`
	UCMail     string `json:"refUCMail" gorm:"column:refUCMail"`
}

type UpdateMeetingRecordLinkSessionModel struct {
	Id          int    `json:"refCLId" binding:"required" mapstructure:"refCLId"`
	MeetingLink string `json:"refCLRecordingLink" binding:"required" mapstructure:"refCLRecordingLink"`
}
