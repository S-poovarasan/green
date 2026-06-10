package service

import (
	logger "greenstech/helper/Logger"
	"greenstech/model"
	"greenstech/query"

	"gorm.io/gorm"
)

func GetSyllabusService(db *gorm.DB) (bool, string, []model.SyllabusModel) {
	log := logger.InitLogger()

	//Get the Syllabus
	var SyllabusData []model.SyllabusModel
	SyllabusDataErr := db.Raw(query.GetCourseSQL).Scan(&SyllabusData).Error
	if SyllabusDataErr != nil {
		log.Error(SyllabusDataErr.Error())
		return false, "Something went wrong, Try Again", []model.SyllabusModel{}
	}

	return true, "Successfully data fetched", SyllabusData
}

func NewSyllabusService(db *gorm.DB, reqVal model.NewSyllabusReq) (bool, string) {
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

	//Check the Syllabus Name
	var CheckSyllabusName []model.SyllabusModel
	CheckSyllabusNameErr := tx.Raw(query.CheckSyllabusNameSQL, reqVal.SyllabusName).Scan(&CheckSyllabusName).Error
	if CheckSyllabusNameErr != nil {
		log.Error(CheckSyllabusNameErr.Error())
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	if len(CheckSyllabusName) > 0 {
		tx.Rollback()
		return false, "Syllabus Name Already Exits"
	}

	//Insert the Syllabus
	InsertSyllabusErr := tx.Exec(query.InsertSyllabusSQL, reqVal.SyllabusName).Error
	if InsertSyllabusErr != nil {
		log.Error(InsertSyllabusErr.Error())
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	if err := tx.Commit().Error; err != nil {
		log.Printf("ERROR: Failed to commit transaction: %v\n", err)
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	return true, "Successfully Syllabus Added!"
}

func UpdateSyllabusService(db *gorm.DB, reqVal model.UpdateSyllabusReq) (bool, string) {
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

	//Check the Syllabus Name
	var CheckSyllabusName []model.SyllabusModel
	CheckSyllabusNameErr := tx.Raw(query.CheckUpdateSyllabusNameSQL, reqVal.SyllabusName, reqVal.SyllabusId).Scan(&CheckSyllabusName).Error
	if CheckSyllabusNameErr != nil {
		log.Error(CheckSyllabusNameErr.Error())
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	if len(CheckSyllabusName) > 0 {
		tx.Rollback()
		return false, "Syllabus Name Already Exits"
	}

	//Update the Syllabus
	UpdateSyllabusErr := tx.Exec(query.UpdateSyllabusSQL, reqVal.SyllabusName, reqVal.SyllabusId).Error
	if UpdateSyllabusErr != nil {
		log.Error(UpdateSyllabusErr.Error())
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	if err := tx.Commit().Error; err != nil {
		log.Printf("ERROR: Failed to commit transaction: %v\n", err)
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	return true, "Successfully Syllabus Added!"
}
