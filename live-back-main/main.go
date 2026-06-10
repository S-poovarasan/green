package main

import (
	"fmt"
	"greenstech/routes"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	r := gin.Default()

	// Load the DotENV (optional)
	_ = godotenv.Load()

	// ⚠️ Trust only localhost proxy (or none if you want)
	r.SetTrustedProxies(nil)

	// ✅ CORS configuration to allow only one origin
	// r.Use(cors.New(cors.Config{
	// 	AllowOrigins:     []string{"http://localhost:3000"}, // Change to your allowed origin
	// 	AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
	// 	AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
	// 	ExposeHeaders:    []string{"Content-Length"},
	// 	AllowCredentials: true,
	// }))
	r.Use(cors.New(cors.Config{
		AllowOriginFunc: func(origin string) bool {
			return true // allow all origins dynamically
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	//API calls 🚀

	//Authentication
	fmt.Println("=================Authentication=================")
	fmt.Println()
	routes.InitLoginRoutes(r)
	fmt.Println()

	//Profile
	fmt.Println("=================Profile=================")
	fmt.Println()
	routes.InitProfileRoutes(r)
	fmt.Println()

	//Registration
	fmt.Println("=================Registration=================")
	fmt.Println()
	routes.InitRegistationRoutes(r)
	fmt.Println()

	//File Handler
	fmt.Println("=================File Handler=================")
	fmt.Println()
	routes.InitFileHandlerRoutes(r)
	fmt.Println()

	//Sub  Trainer
	fmt.Println("=================Sub Trainer=================")
	fmt.Println()
	routes.InitSubtrainerRoutes(r)
	fmt.Println()

	//Groups
	fmt.Println("=================Groups=================")
	fmt.Println()
	routes.InitGroupsRoutes(r)
	fmt.Println()

	//Student
	fmt.Println("=================Student=================")
	fmt.Println()
	routes.InitStudentRoutes(r)
	fmt.Println()

	//Filter
	fmt.Println("=================Filter=================")
	fmt.Println()
	routes.InitFilterRoutes(r)
	fmt.Println()

	//Syllabus
	fmt.Println("=================Syllabus=================")
	fmt.Println()
	routes.InitSyllabusRoutes(r)
	fmt.Println()

	//Session
	fmt.Println("=================Session=================")
	fmt.Println()
	routes.InitSessionRoutes(r)
	fmt.Println()

	//Permission
	fmt.Println("=================Permission=================")
	fmt.Println()
	routes.InitPermissionRoutes(r)
	fmt.Println()

	//Leave
	fmt.Println("=================Leave=================")
	fmt.Println()
	routes.InitLeaveRoutes(r)
	fmt.Println()

	//Permission Request
	fmt.Println("=================Permission Request=================")
	fmt.Println()
	routes.InitPermissionRequestRoutes(r)
	fmt.Println()

	fmt.Println()
	fmt.Println()
	//Ping 🎯API
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong from Greens Tech Service",
		})
	})

	//Run the Server and Log Message
	fmt.Println("✅Server is Running at Port:" + os.Getenv("PORT"))
	r.Run("0.0.0.0:" + os.Getenv("PORT"))
}
