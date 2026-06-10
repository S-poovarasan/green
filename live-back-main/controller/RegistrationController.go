package controllers

import (
	accesstoken "greenstech/helper/AccessToken"
	db "greenstech/helper/DB"
	hashapi "greenstech/helper/HashAPI"
	helperReq "greenstech/helper/RequestHandler"
	"greenstech/model"
	"greenstech/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetRegistrationController() gin.HandlerFunc {

	return func(c *gin.Context) {

		//Gathering the Datas From the Token
		idValue, idExists := c.Get("id")
		roleIdValue, roleIdExists := c.Get("roleId")

		if !idExists || !roleIdExists {
			// Handle error: ID is missing from context (e.g., middleware didn't set it)
			c.JSON(http.StatusUnauthorized, gin.H{ // Or StatusInternalServerError depending on why it's missing
				"status":  false,
				"message": "User ID, RoleID, Branch ID not found in request context.",
			})
			return
		}

		dbConn, sqlDB := db.InitDB()
		defer sqlDB.Close()

		status, message, resVal := service.GetRegistrationServices(dbConn)

		payload := map[string]interface{}{
			"status":  status,
			"message": message,
			"data":    resVal,
		}

		//Create a tokens
		token := accesstoken.CreateToken(idValue, roleIdValue)

		c.JSON(http.StatusOK, gin.H{
			"data":  hashapi.Encrypt(payload, true, token),
			"token": token,
		})

	}
}

func GetUserIdRegistrationController() gin.HandlerFunc {

	return func(c *gin.Context) {

		//Gathering the Datas From the Token
		idValue, idExists := c.Get("id")
		roleIdValue, roleIdExists := c.Get("roleId")

		if !idExists || !roleIdExists {
			// Handle error: ID is missing from context (e.g., middleware didn't set it)
			c.JSON(http.StatusUnauthorized, gin.H{ // Or StatusInternalServerError depending on why it's missing
				"status":  false,
				"message": "User ID, RoleID, Branch ID not found in request context.",
			})
			return
		}

		//Request Should Be Encrypt
		data, ok := helperReq.GetRequestBody[model.CheckUserId](c, true)
		if !ok {
			return
		}

		dbConn, sqlDB := db.InitDB()
		defer sqlDB.Close()

		status, message, countId, CourseName, errorStatus := service.GetUserIdRegistrationServices(dbConn, data)

		payload := map[string]interface{}{
			"status":      status,
			"message":     message,
			"countId":     countId,
			"CourseName":  CourseName,
			"errorStatus": errorStatus,
		}

		//Create a tokens
		token := accesstoken.CreateToken(idValue, roleIdValue)

		c.JSON(http.StatusOK, gin.H{
			"data":  hashapi.Encrypt(payload, true, token),
			"token": token,
		})

	}
}

func NewRegistrationController() gin.HandlerFunc {

	return func(c *gin.Context) {

		//Gathering the Datas From the Token
		idValue, idExists := c.Get("id")
		roleIdValue, roleIdExists := c.Get("roleId")

		if !idExists || !roleIdExists {
			// Handle error: ID is missing from context (e.g., middleware didn't set it)
			c.JSON(http.StatusUnauthorized, gin.H{ // Or StatusInternalServerError depending on why it's missing
				"status":  false,
				"message": "User ID, RoleID, Branch ID not found in request context.",
			})
			return
		}

		//Request Should Be Encrypt
		data, ok := helperReq.GetRequestBody[model.ReqnewRegistrationModel](c, true)
		if !ok {
			return
		}

		dbConn, sqlDB := db.InitDB()
		defer sqlDB.Close()

		status, message := service.NewRegistrationServices(dbConn, data, int(idValue.(float64)))

		payload := map[string]interface{}{
			"status":  status,
			"message": message,
		}

		//Create a tokens
		token := accesstoken.CreateToken(idValue, roleIdValue)

		c.JSON(http.StatusOK, gin.H{
			"data":  hashapi.Encrypt(payload, true, token),
			"token": token,
		})

	}
}
