package routes

import (
	controllers "greenstech/controller"
	accesstoken "greenstech/helper/AccessToken"

	"github.com/gin-gonic/gin"
)

func InitGroupsRoutes(router *gin.Engine) {
	route := router.Group("/api/v1/groups")
	route.POST("/", accesstoken.JWTMiddleware(), controllers.GetGroupsController())
	route.POST("/new", accesstoken.JWTMiddleware(), controllers.CreateGroupsController())
	route.POST("/update", accesstoken.JWTMiddleware(), controllers.UpdateGroupsController())
}
