package routes

import (
	controllers "greenstech/controller"
	accesstoken "greenstech/helper/AccessToken"

	"github.com/gin-gonic/gin"
)

func InitPermissionRoutes(router *gin.Engine) {
	route := router.Group("/api/v1/permission")
	route.GET("/", accesstoken.JWTMiddleware(), controllers.GetPermissionController())
	route.GET("/punchIn", accesstoken.JWTMiddleware(), controllers.GetPunchInPermissionController())
	route.GET("/punchOut", accesstoken.JWTMiddleware(), controllers.GetPunchOutPermissionController())
}
