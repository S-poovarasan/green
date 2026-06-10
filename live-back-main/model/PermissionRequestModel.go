package model

type NewPermissionReq struct {
	Date      string `json:"date" mapstructure:"date"`
	StartTime string `json:"startTime" mapstructure:"startTime"`
	EndTime   string `json:"endTime" mapstructure:"endTime"`
	Type      string `json:"type" mapstructure:"type"`
	Reason    string `json:"description" mapstructure:"description"`
}

type WithdrawPermissionReq struct {
	UPId int `json:"refUPId" mapstructure:"refUPId"`
}

type PermissionModel struct {
	RefUPId             int    `gorm:"column:refUPId;primaryKey;autoIncrement" json:"refUPId"`
	RefUserId           int    `gorm:"column:refUserId" json:"refUserId"`
	RefUPDate           string `gorm:"column:refUPDate" json:"refUPDate"`
	RefUPStartTime      string `gorm:"column:refUPStartTime" json:"refUPStartTime"`
	RefUPEndTime        string `gorm:"column:refUPEndTime" json:"refUPEndTime"`
	RefUPPermissionType string `gorm:"column:refUPPermissionType" json:"refUPPermissionType"`
	RefUPReason         string `gorm:"column:refUPReason" json:"refUPReason"`
	RefUPStatus         string `gorm:"column:refUPStatus" json:"refUPStatus"`
	RefUPAccessStatus   bool   `gorm:"column:refUPAccessStatus" json:"refUPAccessStatus"`
	RefUPCreatedAt      string `gorm:"column:refUPCreatedAt" json:"refUPCreatedAt"`
	RefUPCreatedBy      int    `gorm:"column:refUPCreatedBy" json:"refUPCreatedBy"`
	RefUPUpdatedAt      string `gorm:"column:refUPUpdatedAt" json:"refUPUpdatedAt"`
	RefUPUpdatedBy      int    `gorm:"column:refUPUpdatedBy" json:"refUPUpdatedBy"`
}
