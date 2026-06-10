package routes

import (
	controllers "greenstech/controller"
	accesstoken "greenstech/helper/AccessToken"

	"github.com/gin-gonic/gin"
)

func InitLeaveRoutes(router *gin.Engine) {
	route := router.Group("/api/v1/leave")
	route.GET("/", accesstoken.JWTMiddleware(), controllers.GetLeaveRequestController())
	route.POST("/newLeaveRequest", accesstoken.JWTMiddleware(), controllers.NewLeaveRequestController())
	route.POST("/withdrawLeaveRequest", accesstoken.JWTMiddleware(), controllers.WithdrawLeaveRequestController())
}
