package model

type GetFileReq struct {
	FileName string `json:"filename" mapstructure:"filename"`
}
