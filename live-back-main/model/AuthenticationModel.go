package model

type LoginReq struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginModel struct {
	UserId   int    `json:"refUserId" gorm:"column:refUserId"`
	RoleId   int    `json:"refUserRTId" gorm:"column:refUserRTId"`
	Password string `json:"refUAHashPassword" gorm:"column:refUAHashPassword"`
}

type LoginResponse struct {
	Status   bool   `json:"status" binding:"required"`
	Message  string `json:"message" binding:"required"`
	RoleType int    `json:"roleType"`
	Id       int    `json:"id"`
}
