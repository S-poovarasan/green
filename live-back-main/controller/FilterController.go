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

func GetFilterController() gin.HandlerFunc {

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

		// //Request Should Be Encrypt
		// data, ok := helperReq.GetRequestBody[model.ReqGetGroup](c, true)
		// if !ok {
		// 	return
		// }

		dbConn, sqlDB := db.InitDB()
		defer sqlDB.Close()

		status, message, data := service.GetFilterService(dbConn)

		payload := map[string]interface{}{
			"status":  status,
			"message": message,
			"data":    data,
		}

		//Create a tokens
		token := accesstoken.CreateToken(idValue, roleIdValue)

		c.JSON(http.StatusOK, gin.H{
			"data":  hashapi.Encrypt(payload, true, token),
			"token": token,
		})

	}
}

func GetStudentController() gin.HandlerFunc {

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
		data, ok := helperReq.GetRequestBody[model.GetStudentReq](c, true)
		if !ok {
			return
		}

		dbConn, sqlDB := db.InitDB()
		defer sqlDB.Close()

		status, message, dataRes, ListCourses := service.GetStudentService(dbConn, data)

		payload := map[string]interface{}{
			"status":      status,
			"message":     message,
			"data":        dataRes,
			"listCourses": ListCourses,
		}

		//Create a tokens
		token := accesstoken.CreateToken(idValue, roleIdValue)

		c.JSON(http.StatusOK, gin.H{
			"data":  hashapi.Encrypt(payload, true, token),
			"token": token,
		})

	}
}

func UpdateStudentController() gin.HandlerFunc {

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
		data, ok := helperReq.GetRequestBody[model.UpdateStudentReq](c, true)
		if !ok {
			return
		}

		dbConn, sqlDB := db.InitDB()
		defer sqlDB.Close()

		status, message := service.UpdateStudentService(dbConn, data, int(idValue.(float64)))

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
