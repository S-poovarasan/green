package routes

import (
	controllers "greenstech/controller"
	accesstoken "greenstech/helper/AccessToken"

	"github.com/gin-gonic/gin"
)

func InitPermissionRequestRoutes(router *gin.Engine) {
	route := router.Group("/api/v1/permissionRequest")
	route.GET("/", accesstoken.JWTMiddleware(), controllers.GetPermissionRequestController())
	route.POST("/newPermissionRequest", accesstoken.JWTMiddleware(), controllers.NewPermissionRequestController())
	route.POST("/withdrawPermissionRequest", accesstoken.JWTMiddleware(), controllers.WithdrawPermissionRequestController())
}
