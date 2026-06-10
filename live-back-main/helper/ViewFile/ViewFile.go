package helper

import (
	"encoding/base64"
	"greenstech/model"
	"io/ioutil"
	"mime"
	"os"
	"path/filepath"
)

func ViewFile(filePath string) (*model.FileData, error) {
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		return nil, err
	}

	data, err := ioutil.ReadFile(filePath)
	if err != nil {
		return nil, err
	}

	// Convert file bytes to base64
	base64Content := base64.StdEncoding.EncodeToString(data)

	// Get MIME type
	ext := filepath.Ext(filePath)
	contentType := mime.TypeByExtension(ext)
	if contentType == "" {
		contentType = "application/octet-stream" // fallback
	}

	return &model.FileData{
		Base64Data:  base64Content,
		ContentType: contentType,
	}, nil
}
