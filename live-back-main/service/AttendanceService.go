package service

import (
	logger "greenstech/helper/Logger"
	timeZone "greenstech/helper/TimeZone"
	"greenstech/model"
	"greenstech/query"

	"gorm.io/gorm"
)

func GetPermissionService(db *gorm.DB, id int) (bool, string, []model.AttendanceStructModel) {
	log := logger.InitLogger()

	var AttendanceModel []model.AttendanceStructModel

	//Get the Last Punchs Data for the User
	AttendanceStructModelErr := db.Raw(query.GetPermissionSQL, id).Scan(&AttendanceModel).Error
	if AttendanceStructModelErr != nil {
		log.Error(AttendanceStructModelErr.Error())
		return false, "Something went wrong, Try Again", []model.AttendanceStructModel{}
	}

	return true, "Successfully Data Fetched", AttendanceModel
}

func GetPunchInPermissionService(db *gorm.DB, id int) (bool, string) {
	log := logger.InitLogger()

	tx := db.Begin()
	if tx.Error != nil {
		log.Printf("ERROR: Failed to begin transaction: %v\n", tx.Error)
		return false, "Something went wrong, Try Again"
	}

	defer func() {
		if r := recover(); r != nil {
			log.Error("ERROR: Recovered from panic, rolling back transaction:", r)
			tx.Rollback()
		}
	}()

	//Inserting the New Punch In
	PunchInErr := tx.Exec(
		query.PunchInSQL,
		id,
		timeZone.GetPacificTime(),
		timeZone.GetPacificTime(),
		id,
	).Error
	if PunchInErr != nil {
		log.Error(PunchInErr.Error())
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	if err := tx.Commit().Error; err != nil {
		log.Printf("ERROR: Failed to commit transaction: %v\n", err)
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	return true, "Successfully Data Fetched"
}

func GetPunchOutPermissionService(db *gorm.DB, id int) (bool, string) {
	log := logger.InitLogger()

	tx := db.Begin()
	if tx.Error != nil {
		log.Printf("ERROR: Failed to begin transaction: %v\n", tx.Error)
		return false, "Something went wrong, Try Again"
	}

	defer func() {
		if r := recover(); r != nil {
			log.Error("ERROR: Recovered from panic, rolling back transaction:", r)
			tx.Rollback()
		}
	}()

	//Check the last Punch In
	var CheckLastPunchIn []model.AttendanceStructModel
	CheckLastPunchInErr := tx.Raw(query.CheckLatestPunchInSQL, id).Scan(&CheckLastPunchIn).Error
	if CheckLastPunchInErr != nil {
		log.Error(CheckLastPunchInErr.Error())
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	if len(CheckLastPunchIn) == 0 || CheckLastPunchIn[0].UAPunchOutTime != "" {
		tx.Rollback()
		return false, "No active punch-in found to punch out."
	}

	// Update Punch Out
	PunchOutErr := tx.Exec(
		query.PunchOutSQL,
		timeZone.GetPacificTime(),
		id,
		CheckLastPunchIn[0].UAId,
	).Error
	if PunchOutErr != nil {
		log.Error(PunchOutErr.Error())
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	if err := tx.Commit().Error; err != nil {
		log.Printf("ERROR: Failed to commit transaction: %v\n", err)
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	return true, "Successfully Data Fetched"
}
