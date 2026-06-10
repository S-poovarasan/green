package main

import (
	"fmt"
	"log"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type UserComm struct {
	RefUserId int    `gorm:"column:refUserId"`
	RefUCMail string `gorm:"column:refUCMail"`
}

type UserAuth struct {
	RefUserId        int    `gorm:"column:refUserId"`
	RefUAPassword    string `gorm:"column:refUAPassword"`
	RefUAHashPassword string `gorm:"column:refUAHashPassword"`
}

func main() {
	dsn := "host=localhost user=postgres password=Cyberboy@6549 port=5432 dbname=crm sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ Connection error: ", err)
	}

	fmt.Println("🔍 Diagnosing database users...")

	var comms []UserComm
	db.Raw("SELECT \"refUserId\", \"refUCMail\" FROM userdomain.\"userCommunication\";").Scan(&comms)

	if len(comms) == 0 {
		fmt.Println("❌ No users found in userdomain.userCommunication! Did you run 'go run migrate_db.go' first?")
		return
	}

	for _, c := range comms {
		fmt.Printf("👤 Found user: ID=%d, Email=%s\n", c.RefUserId, c.RefUCMail)

		var auth UserAuth
		db.Raw("SELECT \"refUserId\", \"refUAPassword\", \"refUAHashPassword\" FROM userdomain.\"userAuth\" WHERE \"refUserId\" = ?;", c.RefUserId).Scan(&auth)

		if auth.RefUserId == 0 {
			fmt.Println("   ❌ No password entry found in userdomain.userAuth!")
			continue
		}

		fmt.Printf("   🔑 Password in DB (plain): '%s'\n", auth.RefUAPassword)
		fmt.Printf("   🔒 Hash in DB: %s\n", auth.RefUAHashPassword)

		// Test comparison manually
		err = bcrypt.CompareHashAndPassword([]byte(auth.RefUAHashPassword), []byte("admin123"))
		if err == nil {
			fmt.Println("   ✅ Password check successful for 'admin123'!")
		} else {
			fmt.Printf("   ❌ Password check FAILED for 'admin123': %v\n", err)
		}
	}
}
