package main

import (
	"fmt"
	"log"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// Connect directly to the 'crm' database
	dsn := "host=localhost user=postgres password=Cyberboy@6549 port=5432 dbname=crm sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ Failed to connect to 'crm' database: ", err)
	}

	fmt.Println("Connected to 'crm' database. Running migrations...")

	// 1. Create Schemas
	schemas := []string{"userdomain", "courses", "groups", "classes", "attendance", "leave", "permission", "report"}
	for _, schema := range schemas {
		err = db.Exec(fmt.Sprintf("CREATE SCHEMA IF NOT EXISTS %s;", schema)).Error
		if err != nil {
			log.Fatalf("❌ Failed to create schema %s: %v", schema, err)
		}
	}
	fmt.Println("✅ Schemas created.")

	// 2. Create Tables DDL
	tablesSQL := []string{
		`CREATE TABLE IF NOT EXISTS public.users (
			"refUserId" SERIAL PRIMARY KEY,
			"refUserName" VARCHAR(255) NOT NULL,
			"refUserStatus" BOOLEAN DEFAULT TRUE,
			"refUserRTId" INT NOT NULL,
			"refUserDOB" VARCHAR(100),
			"refUserProfile" VARCHAR(255),
			"refUserCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			"refUserCreatedBy" INT,
			"refUserUpdatedAt" TIMESTAMP,
			"refUserUpdatedBy" INT,
			"refUserEnrolledDate" TIMESTAMP,
			"refUserCustId" VARCHAR(100) UNIQUE
		);`,
		`CREATE TABLE IF NOT EXISTS userdomain."userCommunication" (
			"refUCId" SERIAL PRIMARY KEY,
			"refUserId" INT NOT NULL REFERENCES public.users("refUserId") ON DELETE CASCADE,
			"refUCAddress" TEXT,
			"refUCMobileno" VARCHAR(50),
			"refUCWhatsAppMobileNo" VARCHAR(50),
			"refUCMail" VARCHAR(255) UNIQUE NOT NULL
		);`,
		`CREATE TABLE IF NOT EXISTS userdomain."userAuth" (
			"refUAId" SERIAL PRIMARY KEY,
			"refUserId" INT NOT NULL REFERENCES public.users("refUserId") ON DELETE CASCADE,
			"refUAPassword" VARCHAR(255),
			"refUAHashPassword" VARCHAR(255) NOT NULL,
			"refUAPasswordResetStatus" BOOLEAN DEFAULT FALSE,
			"refUAUpdatedAt" TIMESTAMP,
			"refUAUpdatedBy" INT
		);`,
		`CREATE TABLE IF NOT EXISTS userdomain."userSubtrainerDomain" (
			"refUSTDId" SERIAL PRIMARY KEY,
			"refUserId" INT NOT NULL REFERENCES public.users("refUserId") ON DELETE CASCADE,
			"refSTDWorkExprience" VARCHAR(255),
			"refSDTAadhar" VARCHAR(100),
			"refSDTResume" VARCHAR(255),
			"refSDTCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			"refSDTCreatedBy" INT
		);`,
		`CREATE TABLE IF NOT EXISTS userdomain."userStudentDomain" (
			"refUSDId" SERIAL PRIMARY KEY,
			"refUserId" INT NOT NULL REFERENCES public.users("refUserId") ON DELETE CASCADE,
			"refUSDHigherEducation" VARCHAR(255),
			"refUSDFMOccupation" VARCHAR(255),
			"refUSDPassedOutYear" VARCHAR(50),
			"refUSDWorkExperience" VARCHAR(255)
		);`,
		`CREATE TABLE IF NOT EXISTS courses."Course" (
			"refCourseId" SERIAL PRIMARY KEY,
			"refCourseName" VARCHAR(255) UNIQUE NOT NULL,
			"refCourseStatus" BOOLEAN DEFAULT TRUE
		);`,
		`CREATE TABLE IF NOT EXISTS groups."Groups" (
			"refGId" SERIAL PRIMARY KEY,
			"refGName" VARCHAR(255) NOT NULL,
			"refGDescription" TEXT,
			"refGStatus" BOOLEAN DEFAULT TRUE
		);`,
		`CREATE TABLE IF NOT EXISTS groups."handlerGroups" (
			"refHGId" SERIAL PRIMARY KEY,
			"refUserId" INT NOT NULL REFERENCES public.users("refUserId") ON DELETE CASCADE,
			"refGId" INT NOT NULL REFERENCES groups."Groups"("refGId") ON DELETE CASCADE,
			"refCourseId" INT NOT NULL REFERENCES courses."Course"("refCourseId") ON DELETE CASCADE,
			"refHGStatus" BOOLEAN DEFAULT TRUE
		);`,
		`CREATE TABLE IF NOT EXISTS courses."userCourses" (
			"refUCOId" SERIAL PRIMARY KEY,
			"refUserId" INT NOT NULL REFERENCES public.users("refUserId") ON DELETE CASCADE,
			"refCourseId" INT NOT NULL REFERENCES courses."Course"("refCourseId") ON DELETE CASCADE,
			"refUCOPreference" VARCHAR(100),
			"refHGId" INT REFERENCES groups."handlerGroups"("refHGId") ON DELETE SET NULL
		);`,
		`CREATE TABLE IF NOT EXISTS classes."Class" (
			"refCLId" SERIAL PRIMARY KEY,
			"refGId" INT NOT NULL REFERENCES groups."Groups"("refGId") ON DELETE CASCADE,
			"refCLName" VARCHAR(255) NOT NULL,
			"refCLFromTime" VARCHAR(100),
			"refCLToTime" VARCHAR(100),
			"refCLDate" VARCHAR(100),
			"refCLStatus" BOOLEAN DEFAULT TRUE,
			"refCLLink" VARCHAR(500),
			"refCLRecordingLink" VARCHAR(500)
		);`,
		`CREATE TABLE IF NOT EXISTS attendance."UserAttendance" (
			"refUAId" SERIAL PRIMARY KEY,
			"refUserId" INT NOT NULL REFERENCES public.users("refUserId") ON DELETE CASCADE,
			"refUAPunchInTime" VARCHAR(100),
			"refUAPunchOutTime" VARCHAR(100),
			"refUACreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			"refUACreatedBy" INT,
			"refUAUpdatedAt" VARCHAR(100),
			"refUAUpdatedBy" INT
		);`,
		`CREATE TABLE IF NOT EXISTS leave."UserLeave" (
			"refULId" SERIAL PRIMARY KEY,
			"refUserId" INT NOT NULL REFERENCES public.users("refUserId") ON DELETE CASCADE,
			"refULStartDate" VARCHAR(100) NOT NULL,
			"refULEndDate" VARCHAR(100) NOT NULL,
			"refULReason" TEXT,
			"refULStatus" VARCHAR(50) DEFAULT 'Pending',
			"refULAccessStatus" BOOLEAN DEFAULT TRUE,
			"refULCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			"refULCreatedBy" INT,
			"refULUpdatedAt" TIMESTAMP,
			"refULUpdatedBy" INT
		);`,
		`CREATE TABLE IF NOT EXISTS permission."UserPermission" (
			"refUPId" SERIAL PRIMARY KEY,
			"refUserId" INT NOT NULL REFERENCES public.users("refUserId") ON DELETE CASCADE,
			"refUPDate" VARCHAR(100) NOT NULL,
			"refUPStartTime" VARCHAR(100) NOT NULL,
			"refUPEndTime" VARCHAR(100) NOT NULL,
			"refUPPermissionType" VARCHAR(100),
			"refUPReason" TEXT,
			"refUPStatus" VARCHAR(50) DEFAULT 'Pending',
			"refUPAccessStatus" BOOLEAN DEFAULT TRUE,
			"refUPCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			"refUPCreatedBy" INT,
			"refUPUpdatedAt" TIMESTAMP,
			"refUPUpdatedBy" INT
		);`,
		`CREATE TABLE IF NOT EXISTS report."refReportType" (
			"refRTId" SERIAL PRIMARY KEY,
			"refRTName" VARCHAR(255) NOT NULL
		);`,
		`CREATE TABLE IF NOT EXISTS report.report (
			"refRPId" SERIAL PRIMARY KEY,
			"refUserId" INT NOT NULL REFERENCES public.users("refUserId") ON DELETE CASCADE,
			"refRTId" INT NOT NULL REFERENCES report."refReportType"("refRTId") ON DELETE CASCADE,
			"refRPDate" TIMESTAMP,
			"refRPSummary" TEXT,
			"refRPSolutions" TEXT,
			"refRPGoal" TEXT,
			"refRPStatus" BOOLEAN DEFAULT TRUE,
			"refRPCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			"refRPCreatedBy" INT,
			"refRPUpdatedAt" TIMESTAMP,
			"refRPUpdatedBy" INT
		);`,
		`CREATE TABLE IF NOT EXISTS report."reportDocuments" (
			"refRPDId" SERIAL PRIMARY KEY,
			"refUserId" INT NOT NULL REFERENCES public.users("refUserId") ON DELETE CASCADE,
			"refRPId" INT NOT NULL REFERENCES report.report("refRPId") ON DELETE CASCADE,
			"refRPDName" VARCHAR(255),
			"refRPDUrl" VARCHAR(500),
			"refRPDCreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			"refRPDCreatedBy" INT
		);`,
	}

	for i, query := range tablesSQL {
		err = db.Exec(query).Error
		if err != nil {
			log.Fatalf("❌ Failed to execute table query #%d: %v", i+1, err)
		}
	}
	fmt.Println("✅ Tables created.")

	// 3. Seed Courses & Report Types
	db.Exec("INSERT INTO courses.\"Course\" (\"refCourseName\", \"refCourseStatus\") VALUES ('Go Backend Development', true), ('React Frontend Development', true) ON CONFLICT DO NOTHING;")
	db.Exec("INSERT INTO report.\"refReportType\" (\"refRTId\", \"refRTName\") VALUES (1, 'Daily Report'), (2, 'Weekly Report'), (3, 'Monthly Report') ON CONFLICT DO NOTHING;")
	fmt.Println("✅ Static data seeded.")

	// 4. Seed Default Users
	seedUsers := []struct {
		Name     string
		RoleId   int
		CustId   string
		Email    string
		Password string
		Hash     string
	}{
		{"System Admin", 1, "GTST100001", "admin@gmail.com", "admin123", "$2a$10$8C4kYF7/t5lA0E1P6c2k/./4z.sH0kEfe7q0K5.2u1m7p4z.eE7oG"},
		{"Head Trainer", 2, "GTST100002", "headtrainer@gmail.com", "admin123", "$2a$10$8C4kYF7/t5lA0E1P6c2k/./4z.sH0kEfe7q0K5.2u1m7p4z.eE7oG"},
		{"Sub Trainer", 3, "GTST100003", "subtrainer@gmail.com", "admin123", "$2a$10$8C4kYF7/t5lA0E1P6c2k/./4z.sH0kEfe7q0K5.2u1m7p4z.eE7oG"},
		{"Test Student", 4, "GTST100004", "student@gmail.com", "admin123", "$2a$10$8C4kYF7/t5lA0E1P6c2k/./4z.sH0kEfe7q0K5.2u1m7p4z.eE7oG"},
	}

	for _, u := range seedUsers {
		// Generate hash dynamically using Go's bcrypt package
		hashBytes, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
		if err != nil {
			log.Fatalf("❌ Failed to generate hash for %s: %v", u.Name, err)
		}
		u.Hash = string(hashBytes)

		// Check if user already exists
		var exists bool
		db.Raw("SELECT EXISTS(SELECT 1 FROM userdomain.\"userCommunication\" WHERE \"refUCMail\" = ?);", u.Email).Scan(&exists)
		if !exists {
			var userId int
			err = db.Raw(`INSERT INTO public.users ("refUserName", "refUserStatus", "refUserRTId", "refUserDOB", "refUserProfile", "refUserCreatedAt", "refUserCreatedBy", "refUserEnrolledDate", "refUserCustId")
				VALUES (?, true, ?, '2000-01-01', ?, NOW(), 1, NOW(), ?) RETURNING "refUserId";`, u.Name, u.RoleId, u.Name, u.CustId).Scan(&userId).Error
			if err != nil {
				log.Fatalf("❌ Failed to insert user %s: %v", u.Name, err)
			}

			err = db.Exec(`INSERT INTO userdomain."userCommunication" ("refUserId", "refUCAddress", "refUCMobileno", "refUCWhatsAppMobileNo", "refUCMail")
				VALUES (?, 'Office', '1234567890', '1234567890', ?);`, userId, u.Email).Error
			if err != nil {
				log.Fatalf("❌ Failed to insert communication for %s: %v", u.Name, err)
			}

			err = db.Exec(`INSERT INTO userdomain."userAuth" ("refUserId", "refUAPassword", "refUAHashPassword", "refUAPasswordResetStatus")
				VALUES (?, ?, ?, false);`, userId, u.Password, u.Hash).Error
			if err != nil {
				log.Fatalf("❌ Failed to insert auth credentials for %s: %v", u.Name, err)
			}
			fmt.Printf("✅ Seeded user: %s (%s)\n", u.Name, u.Email)
		} else {
			// Update the password and hash dynamically to ensure they match
			var userId int
			db.Raw(`SELECT "refUserId" FROM userdomain."userCommunication" WHERE "refUCMail" = ?;`, u.Email).Scan(&userId)
			if userId != 0 {
				err = db.Exec(`UPDATE userdomain."userAuth" SET "refUAPassword" = ?, "refUAHashPassword" = ? WHERE "refUserId" = ?;`, u.Password, u.Hash, userId).Error
				if err != nil {
					log.Fatalf("❌ Failed to update auth credentials for %s: %v", u.Name, err)
				}
				fmt.Printf("🔄 Updated password and hash for existing user: %s (%s)\n", u.Name, u.Email)
			}
		}
	}

	fmt.Println("🚀 Database migration and seeding completed successfully!")
}
