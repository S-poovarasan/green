package controllers

import (
	"fmt"
	accesstoken "greenstech/helper/AccessToken"
	hashapi "greenstech/helper/HashAPI"
	logger "greenstech/helper/Logger"
	helperReq "greenstech/helper/RequestHandler"
	timeZone "greenstech/helper/TimeZone"
	helper "greenstech/helper/ViewFile"
	"greenstech/model"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func PostUploadProfileImage() gin.HandlerFunc {
	return func(c *gin.Context) {

		idValue, idExists := c.Get("id")
		roleIdValue, roleIdExists := c.Get("roleId")

		if !idExists || !roleIdExists {
			// Handle error: ID is missing from context (e.g., middleware didn't set it)
			c.JSON(http.StatusUnauthorized, gin.H{ // Or StatusInternalServerError depending on why it's missing
				"status":  false,
				"message": "User ID, RoleID, Branch ID not found in request context.",
			})
			return // Stop processing
		}

		uploadPath := "./Assets/Images/Profiles/"

		log := logger.InitLogger()

		file, err := c.FormFile("profileImage")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"status":  false,
				"message": "Error retrieving profile image from request: " + err.Error(),
			})
			return
		}

		maxFileSize := int64(5 * 1024 * 1024) // 5 MB
		if file.Size > maxFileSize {
			c.JSON(http.StatusBadRequest, gin.H{
				"status":  false,
				"message": fmt.Sprintf("Profile image size exceeds the limit of %d MB", maxFileSize/(1024*1024)),
			})
			return
		}

		ext := filepath.Ext(file.Filename)
		if ext != ".jpg" && ext != ".jpeg" && ext != ".png" {
			c.JSON(http.StatusBadRequest, gin.H{
				"status":  false,
				"message": "Invalid profile image file type. Only JPG, JPEG, PNG are allowed.",
			})
			return
		}

		uniqueFilename := fmt.Sprintf("%s_%s%s",
			uuid.New().String(),                           // Generate a random UUID
			timeZone.GetTimeWithFormate("20060102150405"), // Add timestamp (YYYYMMDDHHMMSS)
			ext) // Keep original file extension
		destinationPath := filepath.Join(uploadPath, uniqueFilename)

		if err := os.MkdirAll(uploadPath, os.ModePerm); err != nil {
			log.Printf("Error creating upload directory '%s': %v\n", uploadPath, err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"status":  false,
				"message": "Server error: Could not prepare image storage.",
			})
			return
		}

		if err := c.SaveUploadedFile(file, destinationPath); err != nil {
			log.Printf("Error saving uploaded file to '%s': %v\n", destinationPath, err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"status":  false,
				"message": "Server error: Could not save profile image.",
			})
			return
		}

		log.Printf("Successfully uploaded image: %s\n", destinationPath)

		payload := map[string]interface{}{
			"status":   true,
			"message":  "Profile image uploaded successfully!",
			"fileName": uniqueFilename,
		}

		token := accesstoken.CreateToken(idValue, roleIdValue)

		c.JSON(http.StatusOK, gin.H{
			"data":  hashapi.Encrypt(payload, true, token),
			"token": token,
		})
	}
}

func PostUploadFileController() gin.HandlerFunc {
	return func(c *gin.Context) {

		idValue, idExists := c.Get("id")
		roleIdValue, roleIdExists := c.Get("roleId")

		if !idExists || !roleIdExists {
			// Handle error: ID is missing from context (e.g., middleware didn't set it)
			c.JSON(http.StatusUnauthorized, gin.H{ // Or StatusInternalServerError depending on why it's missing
				"status":  false,
				"message": "User ID, RoleID, Branch ID not found in request context.",
			})
			return // Stop processing
		}

		uploadPath := "./Assets/Files/"

		log := logger.InitLogger()

		file, err := c.FormFile("file")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"status":  false,
				"message": "Error retrieving profile image from request: " + err.Error(),
			})
			return
		}

		maxFileSize := int64(10 * 1024 * 1024) // 10 MB
		if file.Size > maxFileSize {
			c.JSON(http.StatusBadRequest, gin.H{
				"status":  false,
				"message": fmt.Sprintf("Profile image size exceeds the limit of %d MB", maxFileSize/(1024*1024)),
			})
			return
		}

		ext := filepath.Ext(file.Filename)
		allowedExts := []string{".pdf", ".xls", ".xlsx"}
		isAllowed := false

		for _, allowedExt := range allowedExts {
			if strings.ToLower(ext) == allowedExt {
				isAllowed = true
				break
			}
		}

		if !isAllowed {
			c.JSON(http.StatusBadRequest, gin.H{
				"status":  false,
				"message": "Invalid profile image file type. Only JPG, JPEG, PNG are allowed.",
			})
			return
		}

		uniqueFilename := fmt.Sprintf("%s_%s%s",
			uuid.New().String(),                           // Generate a random UUID
			timeZone.GetTimeWithFormate("20060102150405"), // Add timestamp (YYYYMMDDHHMMSS)
			ext) // Keep original file extension
		destinationPath := filepath.Join(uploadPath, uniqueFilename)

		if err := os.MkdirAll(uploadPath, os.ModePerm); err != nil {
			log.Printf("Error creating upload directory '%s': %v\n", uploadPath, err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"status":  false,
				"message": "Server error: Could not prepare image storage.",
			})
			return
		}

		if err := c.SaveUploadedFile(file, destinationPath); err != nil {
			log.Printf("Error saving uploaded file to '%s': %v\n", destinationPath, err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"status":  false,
				"message": "Server error: Could not save profile image.",
			})
			return
		}

		log.Printf("Successfully uploaded image: %s\n", destinationPath)

		payload := map[string]interface{}{
			"status":      true,
			"message":     "File uploaded successfully!",
			"fileName":    uniqueFilename,
			"oldFilename": file.Filename,
		}

		token := accesstoken.CreateToken(idValue, roleIdValue)

		c.JSON(http.StatusOK, gin.H{
			"data":  hashapi.Encrypt(payload, true, token),
			"token": token,
		})
	}
}

func PostViewProfileImageController() gin.HandlerFunc {
	return func(c *gin.Context) {

		log := logger.InitLogger()

		idValue, idExists := c.Get("id")
		roleIdValue, roleIdExists := c.Get("roleId")

		if !idExists || !roleIdExists {
			// Handle error: ID is missing from context (e.g., middleware didn't set it)
			c.JSON(http.StatusUnauthorized, gin.H{ // Or StatusInternalServerError depending on why it's missing
				"status":  false,
				"message": "User ID, RoleID, Branch ID not found in request context.",
			})
			return // Stop processing
		}

		//Request Should Be Encrypt
		data, ok := helperReq.GetRequestBody[model.GetFileReq](c, true)
		if !ok {
			return
		}

		var FileData *model.FileData

		payload := map[string]interface{}{
			"status":  false,
			"message": "Invalid File",
			"data":    FileData,
		}

		profileImgHelperData, viewErr := helper.ViewFile("./Assets/Images/Profiles/" + data.FileName)
		if viewErr != nil {
			// Using Fatalf would crash the server. Log a warning and continue.
			log.Warnf("Failed to read profile image file: %v", viewErr)
		} else {
			payload = map[string]interface{}{
				"status":  true,
				"message": "File Sent",
				"data":    profileImgHelperData,
			}

		}

		//Create a tokens
		token := accesstoken.CreateToken(idValue, roleIdValue)

		c.JSON(http.StatusOK, gin.H{
			"data":  hashapi.Encrypt(payload, true, token),
			"token": token,
		})

	}
}

func PostViewFileController() gin.HandlerFunc {
	return func(c *gin.Context) {

		log := logger.InitLogger()

		idValue, idExists := c.Get("id")
		roleIdValue, roleIdExists := c.Get("roleId")

		if !idExists || !roleIdExists {
			// Handle error: ID is missing from context (e.g., middleware didn't set it)
			c.JSON(http.StatusUnauthorized, gin.H{ // Or StatusInternalServerError depending on why it's missing
				"status":  false,
				"message": "User ID, RoleID, Branch ID not found in request context.",
			})
			return // Stop processing
		}

		//Request Should Be Encrypt
		data, ok := helperReq.GetRequestBody[model.GetFileReq](c, true)
		if !ok {
			return
		}

		var FileData *model.FileData

		payload := map[string]interface{}{
			"status":  false,
			"message": "Invalid File",
			"data":    FileData,
		}

		profileImgHelperData, viewErr := helper.ViewFile("./Assets/Files/" + data.FileName)
		if viewErr != nil {
			// Using Fatalf would crash the server. Log a warning and continue.
			log.Warnf("Failed to read profile image file: %v", viewErr)
		} else {
			payload = map[string]interface{}{
				"status":  true,
				"message": "File Sent",
				"data":    profileImgHelperData,
			}

		}

		//Create a tokens
		token := accesstoken.CreateToken(idValue, roleIdValue)

		c.JSON(http.StatusOK, gin.H{
			"data":  hashapi.Encrypt(payload, true, token),
			"token": token,
		})

	}
}
