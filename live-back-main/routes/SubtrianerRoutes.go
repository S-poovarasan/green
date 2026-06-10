package routes

import (
	controllers "greenstech/controller"
	accesstoken "greenstech/helper/AccessToken"

	"github.com/gin-gonic/gin"
)

func InitSubtrainerRoutes(router *gin.Engine) {
	route := router.Group("/api/v1/subtrainer")
	route.POST("/new", accesstoken.JWTMiddleware(), controllers.NewSubtrainerRegistrationController())
	route.POST("/edit", accesstoken.JWTMiddleware(), controllers.EditSubtrainerRegistrationController())
	route.POST("/", accesstoken.JWTMiddleware(), controllers.GetSubtrainerRegistrationController())
	route.GET("/getReport", accesstoken.JWTMiddleware(), controllers.GetReportController())
	route.POST("/submitReport", accesstoken.JWTMiddleware(), controllers.PostSubmitReportController())
}
