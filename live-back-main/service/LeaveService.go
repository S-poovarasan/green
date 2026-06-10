package service

import (
	logger "greenstech/helper/Logger"
	timeZone "greenstech/helper/TimeZone"
	"greenstech/model"
	"greenstech/query"

	"gorm.io/gorm"
)

func GetLeaveRequestService(db *gorm.DB, id int) (bool, string, []model.LeaveModel) {
	log := logger.InitLogger()

	//Get the Leave List for the User
	var LeaveList []model.LeaveModel
	LeaveListErr := db.Raw(
		query.GetLeaveListSQL,
		id,
	).Scan(&LeaveList).Error
	if LeaveListErr != nil {
		log.Error(LeaveListErr.Error())
		return false, "Something went wrong, Try Again", []model.LeaveModel{}
	}
	return true, "Successfully Leave Request Added!", LeaveList
}

func NewLeaveRequestServices(db *gorm.DB, reqVal model.NewLeaveReq, id int) (bool, string) {
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

	//Inseting the New Leave request
	NewLeaveRequestErr := tx.Exec(
		query.NewLeaveRequestSQL,
		id,
		reqVal.StartDate,
		reqVal.EndDate,
		reqVal.Reason,
		"pending",
		true,
		timeZone.GetPacificTime(),
		id,
	).Error
	if NewLeaveRequestErr != nil {
		log.Error(NewLeaveRequestErr.Error())
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

func WithdrawLeaveRequestServices(db *gorm.DB, reqVal model.WithdrawLeaveReq, id int) (bool, string) {
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

	//Update the Withdraw Leave
	WithdrawLeaveRequestErr := tx.Exec(
		query.WithdrawLeaveRequestSQL,
		"withdraw",
		timeZone.GetPacificTime(),
		id,
		reqVal.ULId,
	).Error
	if WithdrawLeaveRequestErr != nil {
		log.Error(WithdrawLeaveRequestErr.Error())
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
