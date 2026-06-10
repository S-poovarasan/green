package model

type NewLeaveReq struct {
	StartDate string `json:"startDate" mapstructure:"startDate"`
	EndDate   string `json:"endDate" mapstructure:"endDate"`
	Reason    string `json:"description" mapstructure:"description"`
}

type LeaveModel struct {
	ULId           int    `json:"refULId" gorm:"column:refULId"`
	UserId         int    `json:"refUserId" gorm:"column:refUserId"`
	ULStartDate    string `json:"refULStartDate" gorm:"column:refULStartDate"`
	ULEndDate      string `json:"refULEndDate" gorm:"column:refULEndDate"`
	ULReason       string `json:"refULReason" gorm:"column:refULReason"`
	ULStatus       string `json:"refULStatus" gorm:"column:refULStatus"`
	ULAccessStatus bool   `json:"refULAccessStatus" gorm:"column:refULAccessStatus"`
	ULCreatedAt    string `json:"refULCreatedAt" gorm:"column:refULCreatedAt"`
}

type WithdrawLeaveReq struct {
	ULId int `json:"refULId" mapstructure:"refULId"`
}
