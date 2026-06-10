package routes

import (
	controllers "greenstech/controller"

	"github.com/gin-gonic/gin"
)

func InitLoginRoutes(router *gin.Engine) {
	route := router.Group("/api/v1/authentication")
	route.POST("/login", controllers.LoginController())
}
