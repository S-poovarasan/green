package service

import (
	logger "greenstech/helper/Logger"
	timeZone "greenstech/helper/TimeZone"
	"greenstech/model"
	"greenstech/query"

	"gorm.io/gorm"
)

func GetPermissionRequestService(db *gorm.DB, id int) (bool, string, []model.PermissionModel) {
	log := logger.InitLogger()

	//Get the Leave List for the User
	var PermissionList []model.PermissionModel
	LeaveListErr := db.Raw(
		query.GetPermissionListSQL,
		id,
	).Scan(&PermissionList).Error
	if LeaveListErr != nil {
		log.Error(LeaveListErr.Error())
		return false, "Something went wrong, Try Again", []model.PermissionModel{}
	}
	return true, "Successfully Leave Request Added!", PermissionList
}

func NewPermissionRequestServices(db *gorm.DB, reqVal model.NewPermissionReq, id int) (bool, string) {
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

	//Inserting New Permission
	newPermissionErr := tx.Exec(
		query.NewPermissionReqSQL,
		id,
		reqVal.Date,
		reqVal.StartTime,
		reqVal.EndTime,
		reqVal.Type,
		reqVal.Reason,
		"pending",
		true,
		timeZone.GetPacificTime(),
		id,
	)
	if newPermissionErr.Error != nil {
		tx.Rollback()
		log.Printf("ERROR: Failed to insert new permission request: %v\n", newPermissionErr.Error)
		return false, "Failed to add new permission request"
	}

	tx.Commit()
	if tx.Error != nil {
		log.Printf("ERROR: Failed to commit transaction: %v\n", tx.Error)
		return false, "Something went wrong, Try Again"
	}

	return true, "Successfully Leave Request Added!"
}

func WithdrawPermissionRequestServices(db *gorm.DB, reqVal model.WithdrawPermissionReq, id int) (bool, string) {
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

	//Update the Withdraw Permission
	WithdrawPermissionRequestErr := tx.Exec(
		query.WithdrawPermissionRequestSQL,
		"withdraw",
		timeZone.GetPacificTime(),
		id,
		reqVal.UPId,
	).Error
	if WithdrawPermissionRequestErr != nil {
		log.Error(WithdrawPermissionRequestErr.Error())
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	if err := tx.Commit().Error; err != nil {
		log.Printf("ERROR: Failed to commit transaction: %v\n", err)
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	return true, "Successfully Leave Request Added!"
}
