package routes

import (
	controllers "greenstech/controller"
	accesstoken "greenstech/helper/AccessToken"

	"github.com/gin-gonic/gin"
)

func InitRegistationRoutes(router *gin.Engine) {
	route := router.Group("/api/v1/registration")
	route.GET("", accesstoken.JWTMiddleware(), controllers.GetRegistrationController())
	route.POST("/checkId", accesstoken.JWTMiddleware(), controllers.GetUserIdRegistrationController())
	route.POST("/new", accesstoken.JWTMiddleware(), controllers.NewRegistrationController())
}
