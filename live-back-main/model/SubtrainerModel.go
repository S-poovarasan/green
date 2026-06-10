package model

import "encoding/json"

type ReqnewSubtrainerRegistrationModel struct {
	Fullname        string `json:"fullname" binding:"required" mapstructure:"fullname"`
	Phonenumber     string `json:"phonenumber" binding:"required" mapstructure:"phonenumber"`
	Emailid         string `json:"emailid" binding:"required" mapstructure:"emailid"`
	Dob             string `json:"dob" binding:"required" mapstructure:"dob"`
	CurrentLocation string `json:"currentLocation" mapstructure:"currentLocation"`
	Workexprience   string `json:"workexprience" mapstructure:"workexprience"`
	Aadhar          string `json:"aadhar" mapstructure:"aadhar"`
	ProfileImage    string `json:"profileImage" mapstructure:"profileImage"`
	Resume          string `json:"resume" mapstructure:"resume"`
}

type ReqEditSubtrainerRegistrationModel struct {
	Id              int    `json:"id" binding:"required" mapstructure:"id"`
	Fullname        string `json:"fullname" binding:"required" mapstructure:"fullname"`
	Phonenumber     string `json:"phonenumber" binding:"required" mapstructure:"phonenumber"`
	Emailid         string `json:"emailid" binding:"required" mapstructure:"emailid"`
	Dob             string `json:"dob" binding:"required" mapstructure:"dob"`
	CurrentLocation string `json:"currentLocation" mapstructure:"currentLocation"`
	Workexprience   string `json:"workexprience" mapstructure:"workexprience"`
	Aadhar          string `json:"aadhar" mapstructure:"aadhar"`
	ProfileImage    string `json:"profileImage" mapstructure:"profileImage"`
	Resume          string `json:"resume" mapstructure:"resume"`
	UserStatus      bool   `json:"userStatus" mapstructure:"userStatus"`
}

type ReqGetSubtrainerRegistrationModel struct {
	Id int `json:"id" binding:"required" mapstructure:"id"`
}

type SubtrainerListModel struct {
	UserId              int    `json:"refUserId" gorm:"column:refUserId"`
	RefUserName         string `json:"refUserName" gorm:"column:refUserName"`
	RefUserStatus       bool   `json:"refUserStatus" gorm:"column:refUserStatus"`
	RefUserDOB          string `json:"refUserDOB" gorm:"column:refUserDOB"`
	RefUserProfile      string `json:"refUserProfile" gorm:"column:refUserProfile"`
	RefUserCustId       string `json:"refUserCustId" gorm:"column:refUserCustId"`
	RefUCAddress        string `json:"refUCAddress" gorm:"column:refUCAddress"`
	RefUCMobileno       string `json:"refUCMobileno" gorm:"column:refUCMobileno"`
	RefUCMail           string `json:"refUCMail" gorm:"column:refUCMail"`
	RefSTDWorkExprience string `json:"refSTDWorkExprience" gorm:"column:refSTDWorkExprience"`
	RefSDTAadhar        string `json:"refSDTAadhar" gorm:"column:refSDTAadhar"`
	RefSDTResume        string `json:"refSDTResume" gorm:"column:refSDTResume"`
}

type DoucmentsReq struct {
	Name string `json:"name" binding:"required" mapstructure:"name"`
	URL  string `json:"url" binding:"required" mapstructure:"url"`
}

type SubmitReportReq struct {
	Type      int            `json:"type" binding:"required" mapstructure:"type"`
	Date      string         `json:"date" binding:"required" mapstructure:"date"`
	Summary   string         `json:"summary" binding:"required" mapstructure:"summary"`
	Solutions string         `json:"solutions" binding:"required" mapstructure:"solutions"`
	Goals     string         `json:"goals" binding:"required" mapstructure:"goals"`
	Documents []DoucmentsReq `json:"documents" mapstructure:"documents"`
}

type SubmitReportData struct {
	RefRPId         int             `json:"refRPId" gorm:"column:refRPId"`
	RefUserId       int             `json:"refUserId" gorm:"column:refUserId"`
	RefRPDate       string          `json:"refRPDate" gorm:"column:refRPDate"`
	RefRPSummary    string          `json:"refRPSummary" gorm:"column:refRPSummary"`
	RefRPSolutions  string          `json:"refRPSolutions" gorm:"column:refRPSolutions"`
	RefRPGoal       string          `json:"refRPGoal" gorm:"column:refRPGoal"`
	RefRPStatus     string          `json:"refRPStatus" gorm:"column:refRPStatus"`
	RefRPApprovedBy string          `json:"refRPApprovedBy" gorm:"column:refRPApprovedBy"`
	RefRPCreatedAt  string          `json:"refRPCreatedAt" gorm:"column:refRPCreatedAt"`
	RefRTName       string          `json:"refRTName" gorm:"column:refRTName"`
	Documents       json.RawMessage `json:"documents" gorm:"column:documents"`
}
