package main

import (
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// Connect to the default 'postgres' database which always exists
	dsn := "host=localhost user=postgres password=Cyberboy@6549 port=5432 dbname=postgres sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ Failed to connect to default postgres database: ", err)
	}

	fmt.Println("Connected to PostgreSQL server. Creating database 'crm'...")

	// Execute raw SQL to create the database
	err = db.Exec("CREATE DATABASE crm;").Error
	if err != nil {
		log.Fatal("❌ Failed to create database: ", err)
	}

	fmt.Println("✅ Database 'crm' created successfully!")
}
