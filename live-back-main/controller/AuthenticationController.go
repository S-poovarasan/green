package controllers

import (
	accesstoken "greenstech/helper/AccessToken"
	db "greenstech/helper/DB"
	"greenstech/model"
	"greenstech/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

func LoginController() gin.HandlerFunc {

	return func(c *gin.Context) {

		var reqVal model.LoginReq

		if err := c.BindJSON(&reqVal); err != nil {
			c.JSON(http.StatusOK, gin.H{
				"status":  false,
				"message": "Something went wrong, Try Again " + err.Error(),
			})
			return
		}

		dbConn, sqlDB := db.InitDB()
		defer sqlDB.Close()

		resVal := service.LoginServices(dbConn, reqVal)

		//Login is Valid
		if resVal.Status {
			token := accesstoken.CreateToken(resVal.Id, resVal.RoleType)

			c.JSON(http.StatusOK, gin.H{
				"status":  resVal.Status,
				"message": resVal.Message,
				"roleId":  resVal.RoleType,
				"id":      resVal.Id,
				"token":   token,
			})
		} else { //Login is Invalid
			c.JSON(http.StatusOK, gin.H{
				"status":  resVal.Status,
				"message": resVal.Message,
			})
		}
	}
}
