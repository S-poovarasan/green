package model

type ListFilterModel struct {
	RefUserId            int    `json:"refUserId" gorm:"column:refUserId"`
	RefUserName          string `json:"refUserName" gorm:"column:refUserName"`
	RefUCMail            string `json:"refUCMail" gorm:"column:refUCMail"`
	RefUserEnrolledDate  string `json:"refUserEnrolledDate" gorm:"column:refUserEnrolledDate"`
	RefCourseName        string `json:"refCourseName" gorm:"column:refCourseName"`
	RefGName             string `json:"refGName" gorm:"column:refGName"`
	RefUSDWorkExperience string `json:"refUSDWorkExperience" gorm:"column:refUSDWorkExperience"`
	RefUserStatus        bool   `json:"refUserStatus" gorm:"column:refUserStatus"`
}

type GetStudentReq struct {
	StudentId int `json:"studentId" mapstructure:"studentId"`
}

type ListStudentDetailsModel struct {
	RefUserId             int    `json:"refUserId" gorm:"column:refUserId"`
	RefUserName           string `json:"refUserName" gorm:"column:refUserName"`
	RefUserStatus         bool   `json:"refUserStatus" gorm:"column:refUserStatus"`
	RefUserDOB            string `json:"refUserDOB" gorm:"column:refUserDOB"`
	RefUserProfile        string `json:"refUserProfile" gorm:"column:refUserProfile"`
	RefUserCustId         string `json:"refUserCustId" gorm:"column:refUserCustId"`
	RefUserEnrolledDate   string `json:"refUserEnrolledDate" gorm:"column:refUserEnrolledDate"`
	RefUCAddress          string `json:"refUCAddress" gorm:"column:refUCAddress"`
	RefUCMobileno         string `json:"refUCMobileno" gorm:"column:refUCMobileno"`
	RefUCWhatsAppMobileNo string `json:"refUCWhatsAppMobileNo" gorm:"column:refUCWhatsAppMobileNo"`
	RefUCMail             string `json:"refUCMail" gorm:"column:refUCMail"`
	RefUSDHigherEducation string `json:"refUSDHigherEducation" gorm:"column:refUSDHigherEducation"`
	RefUSDFMOccupation    string `json:"refUSDFMOccupation" gorm:"column:refUSDFMOccupation"`
	RefUSDPassedOutYear   string `json:"refUSDPassedOutYear" gorm:"column:refUSDPassedOutYear"`
	RefUSDWorkExperience  string `json:"refUSDWorkExperience" gorm:"column:refUSDWorkExperience"`
	RefCourseId           int    `json:"refCourseId" gorm:"column:refCourseId"`
	RefUCOPreference      string `json:"refUCOPreference" gorm:"column:refUCOPreference"`
}

type UpdateStudentReq struct {
	UserId                   int    `json:"userId"  mapstructure:"userId"`
	Fullname                 string `json:"fullname"  mapstructure:"fullname"`
	Phonenumber              string `json:"phonenumber" mapstructure:"phonenumber"`
	Whatsappnumber           string `json:"whatsappnumber" mapstructure:"whatsappnumber"`
	Emailid                  string `json:"emailid" mapstructure:"emailid"`
	DOB                      string `json:"dob" mapstructure:"dob"`
	Highesteducation         string `json:"highesteducation" mapstructure:"highesteducation"`
	CurrentLocation          string `json:"currentLocation" mapstructure:"currentLocation"`
	Fathersmothersoccupation string `json:"fathersmothersoccupation" mapstructure:"fathersmothersoccupation"`
	Passedoutyear            string `json:"passedoutyear" mapstructure:"passedoutyear"`
	Workexprience            string `json:"workexprience" mapstructure:"workexprience"`
	Courseselection          string `json:"courseselection" mapstructure:"courseselection"`
	Preference               string `json:"preference" mapstructure:"preference"`
	UserStatus               bool   `json:"userStatus" mapstructure:"userStatus"`
}

type IsMobileDuplicate struct {
	IsDuplicate bool `json:"isDuplicate" gorm:"column:isDuplicate"`
}
