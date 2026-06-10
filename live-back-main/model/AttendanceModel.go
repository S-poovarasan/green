package model

type AttendanceStructModel struct {
	UAId           int    `json:"refUAId" gorm:"column:refUAId"`
	UserId         int    `json:"refUserId" gorm:"column:refUserId"`
	UAPunchInTime  string `json:"refUAPunchInTime" gorm:"column:refUAPunchInTime"`
	UAPunchOutTime string `json:"refUAPunchOutTime" gorm:"column:refUAPunchOutTime"`
}
