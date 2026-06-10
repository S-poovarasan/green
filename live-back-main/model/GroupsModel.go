package model

type ReqListTopic struct {
	Name     string `json:"name" binding:"required" mapstructure:"name"`
	FromTime string `json:"fromTime" binding:"required" mapstructure:"fromTime"`
	ToTime   string `json:"toTime" binding:"required" mapstructure:"toTime"`
	Date     string `json:"date" binding:"required" mapstructure:"date"`
}

type ReqGetGroup struct {
	GroupId int `json:"handlerGroupid" mapstructure:"handlerGroupid"`
}

type ReqNewGroupModel struct {
	GroupName        string         `json:"groupname" binding:"required" mapstructure:"groupname"`
	GroupDescription string         `json:"groupdescription" binding:"required" mapstructure:"groupdescription"`
	CourseId         int            `json:"courseid" binding:"required" mapstructure:"courseid"`
	Subtrainerid     int            `json:"subtrainerid" binding:"required" mapstructure:"subtrainerid"`
	Topic            []ReqListTopic `json:"topic" binding:"required" mapstructure:"topic"`
}

type ListGroups struct {
	RefGId     int    `json:"refGId" gorm:"column:refGId"`
	RefGName   string `json:"refGName" gorm:"column:refGName"`
	RefGStatus *bool  `json:"refGStatus" gorm:"column:refGStatus"`
}

type ListAllGroups struct {
	RefGId          int          `json:"refGId" gorm:"column:refGId"`
	RefGName        string       `json:"refGName" gorm:"column:refGName"`
	RefGDescription string       `json:"refGDescription" gorm:"column:refGDescription"`
	RefGStatus      *bool        `json:"refGStatus" gorm:"column:refGStatus"`
	RefHGId         int          `json:"refHGId" gorm:"column:refHGId"`
	RefCourseId     int          `json:"refCourseId" gorm:"column:refCourseId"`
	RefUserId       int          `json:"refUserId" gorm:"column:refUserId"`
	RefCourseName   string       `json:"refCourseName" gorm:"column:refCourseName"`
	RefUserName     string       `json:"refUserName" gorm:"column:refUserName"`
	UserCourseCount int          `json:"userCourseCount" gorm:"column:userCourseCount"`
	TotalTopics     int          `json:"totalTopics" gorm:"column:totalTopics"`
	CompletedTopics int          `json:"completedTopics" gorm:"column:completedTopics"`
	ListClass       []ClassModel `json:"listclass" gorm:"-"`
}

type ClassModel struct {
	RefCLId               int    `json:"refCLId"  mapstructure:"refCLId" gorm:"column:refCLId"`
	RefCLName             string `json:"refCLName" mapstructure:"refCLName" gorm:"column:refCLName"`
	RefCLFromTime         string `json:"refCLFromTime" mapstructure:"refCLFromTime" gorm:"column:refCLFromTime"`
	RefCLToTime           string `json:"refCLToTime" mapstructure:"refCLToTime" gorm:"column:refCLToTime"`
	RefCLDate             string `json:"refCLDate" mapstructure:"refCLDate" gorm:"column:refCLDate"`
	RefCLStatus           string `json:"refCLStatus" mapstructure:"refCLStatus" gorm:"column:refCLStatus"`
	RefCLLink             string `json:"refCLLink" mapstructure:"refCLLink" gorm:"column:refCLLink"`
	RefCLRecordingLink    string `json:"refCLRecordingLink" mapstructure:"refCLRecordingLink" gorm:"column:refCLRecordingLink"`
	RefCLCompletionStatus bool   `json:"refCLCompletionStatus" mapstructure:"refCLCompletionStatus" gorm:"column:refCLCompletionStatus"`
}

type EditGroupsReq struct {
	RefGId          int          `json:"refGId" mapstructure:"refGId"`
	RefGName        string       `json:"refGName" mapstructure:"refGName"`
	RefGDescription string       `json:"refGDescription" mapstructure:"refGDescription"`
	ListClass       []ClassModel `json:"listclass" mapstructure:"listclass"`
}
