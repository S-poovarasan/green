package routes

import (
	controllers "greenstech/controller"
	accesstoken "greenstech/helper/AccessToken"

	"github.com/gin-gonic/gin"
)

func InitSyllabusRoutes(router *gin.Engine) {
	route := router.Group("/api/v1/syllabus")
	route.GET("/", accesstoken.JWTMiddleware(), controllers.GetSyllabusController())
	route.POST("/new", accesstoken.JWTMiddleware(), controllers.AddSyllabusController())
	route.POST("/update", accesstoken.JWTMiddleware(), controllers.UpdateSyllabusController())
}
