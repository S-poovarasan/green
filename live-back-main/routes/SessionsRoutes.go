package routes

import (
	controllers "greenstech/controller"
	accesstoken "greenstech/helper/AccessToken"

	"github.com/gin-gonic/gin"
)

func InitSessionRoutes(router *gin.Engine) {
	route := router.Group("/api/v1/session")
	route.GET("/", accesstoken.JWTMiddleware(), controllers.GetSessionController())
	route.POST("/updateGroupDetails", accesstoken.JWTMiddleware(), controllers.UpdateGroupDetailsSessionController())
	route.POST("/addTopic", accesstoken.JWTMiddleware(), controllers.AddTopicSessionController())
	route.POST("/editTopic", accesstoken.JWTMiddleware(), controllers.EditTopicSessionController())
	route.POST("/deleteTopic", accesstoken.JWTMiddleware(), controllers.DeleteTopicSessionController())
	route.POST("/updateMeetingLinkTopic", accesstoken.JWTMiddleware(), controllers.UpdateMeetingLinkTopicSessionController())
	route.POST("/listGroupStudent", accesstoken.JWTMiddleware(), controllers.ListGroupStudentSessionController())
	route.POST("/sendMailStudent", accesstoken.JWTMiddleware(), controllers.SendMailStudentSessionController())
	route.POST("/updateMeetingRecordLink", accesstoken.JWTMiddleware(), controllers.UpdateMeetingRecordLinkSessionController())
}
