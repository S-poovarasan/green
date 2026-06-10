package routes

import (
	controllers "greenstech/controller"
	accesstoken "greenstech/helper/AccessToken"

	"github.com/gin-gonic/gin"
)

func InitStudentRoutes(router *gin.Engine) {
	route := router.Group("/api/v1/student")
	route.GET("/candidateassignment", accesstoken.JWTMiddleware(), controllers.GetCandidateAssignmentController())
	route.POST("/getcourseandsubtrainer", accesstoken.JWTMiddleware(), controllers.GetCourseNSubtrainerController())
	route.POST("/assignStudent", accesstoken.JWTMiddleware(), controllers.AssignStudentController())
	route.GET("/getStudentCourse", accesstoken.JWTMiddleware(), controllers.GetStudentCourseController())
}
