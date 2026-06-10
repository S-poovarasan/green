package routes

import (
	controllers "greenstech/controller"
	accesstoken "greenstech/helper/AccessToken"

	"github.com/gin-gonic/gin"
)

func InitProfileRoutes(router *gin.Engine) {
	route := router.Group("/api/v1/profile")
	route.GET("/user", accesstoken.JWTMiddleware(), controllers.ProfileUserController())
}
