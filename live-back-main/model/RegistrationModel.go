package model

type CourseListModel struct {
	CourseId   int    `json:"refCourseId" gorm:"column:refCourseId"`
	CourseName string `json:"refCourseName" gorm:"column:refCourseName"`
}

type CheckUserId struct {
	CourseId    int    `json:"courseId" gorm:"column:courseId" mapstructure:"courseId"`
	Phonenumber string `json:"phonenumber" binding:"required" mapstructure:"phonenumber"`
	Emailid     string `json:"emailid" binding:"required" mapstructure:"emailid"`
}

type ReqnewRegistrationModel struct {
	Enrolldate               string `json:"enrolldate" binding:"required" mapstructure:"enrolldate"`
	Fullname                 string `json:"fullname" binding:"required" mapstructure:"fullname"`
	Phonenumber              string `json:"phonenumber" binding:"required" mapstructure:"phonenumber"`
	Whatsappnumber           string `json:"whatsappnumber" binding:"required" mapstructure:"whatsappnumber"`
	Emailid                  string `json:"emailid" binding:"required" mapstructure:"emailid"`
	Dob                      string `json:"dob" binding:"required" mapstructure:"dob"`
	Highesteducation         string `json:"highesteducation" mapstructure:"highesteducation"`
	CurrentLocation          string `json:"currentLocation" mapstructure:"currentLocation"`
	Fathersmothersoccupation string `json:"fathersmothersoccupation" mapstructure:"fathersmothersoccupation"`
	Passedoutyear            string `json:"passedoutyear" mapstructure:"passedoutyear"`
	Workexprience            string `json:"workexprience" mapstructure:"workexprience"`
	Courseselection          string `json:"courseselection" mapstructure:"courseselection"`
	Preference               string `json:"preference" mapstructure:"preference"`
}

type CheckemailPhoneNumberModel struct {
	IsEmailExist       bool   `json:"isEmailExist" gorm:"column:isEmailExist"`
	IsPhoneNumberExist bool   `json:"isphoneNumberExist" gorm:"column:isphoneNumberExist"`
	Emailid            string `json:"emailid" gorm:"column:emailid"`
	Phonenumber        string `json:"phonenumber" gorm:"column:phonenumber"`
}
