package model

type FileData struct {
	Base64Data  string `json:"base64Data"`  // base64-encoded file content
	ContentType string `json:"contentType"` // e.g., "image/jpeg"
}

type ProfileUserResponse struct {
	Id             int       `json:"refUserId" gorm:"column:refUserId"`
	Username       string    `json:"refUserName" gorm:"column:refUserName"`
	RoleId         int       `json:"refUserRTId" gorm:"column:refUserRTId"`
	ProfileImg     string    `json:"refUserProfile" gorm:"column:refUserProfile"`
	ProfileImgFile *FileData `json:"profileImgFile" gorm:"-"`
	UserCustId     string    `json:"refUserCustId" gorm:"column:refUserCustId"`
}
