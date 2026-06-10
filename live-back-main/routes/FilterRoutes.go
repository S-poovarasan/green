package routes

import (
	controllers "greenstech/controller"
	accesstoken "greenstech/helper/AccessToken"

	"github.com/gin-gonic/gin"
)

func InitFilterRoutes(router *gin.Engine) {
	route := router.Group("/api/v1/filter")
	route.GET("/", accesstoken.JWTMiddleware(), controllers.GetFilterController())
	route.POST("/getstudent", accesstoken.JWTMiddleware(), controllers.GetStudentController())
	route.POST("/updatestudent", accesstoken.JWTMiddleware(), controllers.UpdateStudentController())
}
