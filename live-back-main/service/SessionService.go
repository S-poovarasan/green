package service

import (
	"encoding/json"
	"fmt"
	db "greenstech/helper/DB"
	logger "greenstech/helper/Logger"
	"greenstech/model"
	"greenstech/query"

	"gorm.io/gorm"
)

func GetSessionService(db *gorm.DB, idValue int) (bool, string, []model.GetSessionModel) {
	log := logger.InitLogger()

	var GetSessionData []model.GetSessionModel

	GetSessionDataErr := db.Raw(query.GetSessionSQL, idValue).Scan(&GetSessionData).Error
	if GetSessionDataErr != nil {
		log.Error(GetSessionDataErr.Error())
		return false, "Something went wrong, Try Again", []model.GetSessionModel{}
	}

	// Unmarshal JSON classes into []ClassModel
	for i := range GetSessionData {
		if len(GetSessionData[i].ClassesJSON) > 0 {
			_ = json.Unmarshal(GetSessionData[i].ClassesJSON, &GetSessionData[i].Classes)
		}
	}

	return true, "Successfully data fetched", GetSessionData
}

func UpdateGroupDetailsSessionService(db *gorm.DB, reqVal model.UpdateGroupDetailsSessiModel) (bool, string) {
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

	//Update the Group name
	UpdateGNameErr := tx.Exec(
		query.UpdateGroupData,
		reqVal.RefGName,
		reqVal.RefGDescription,
		reqVal.RefGId,
	).Error
	if UpdateGNameErr != nil {
		log.Error(UpdateGNameErr.Error())
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	if err := tx.Commit().Error; err != nil {
		log.Printf("ERROR: Failed to commit transaction: %v\n", err)
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	return true, "Successfully Group Details Updated"
}

func AddTopicSessionService(db *gorm.DB, reqVal model.AddTopicSessionModel) (bool, string) {
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

	//Adding the Classes
	topicsJSON, _ := json.Marshal(reqVal.Topic)
	AddingClassesErr := tx.Exec(query.InsertTopicsSQL, reqVal.RefGId, topicsJSON).Error
	if AddingClassesErr != nil {
		log.Error(AddingClassesErr.Error())
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	if err := tx.Commit().Error; err != nil {
		log.Printf("ERROR: Failed to commit transaction: %v\n", err)
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	return true, "Successfully Group Details Updated"
}

func EditTopicSessionService(db *gorm.DB, reqVal model.EditTopicSessionModel) (bool, string) {
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

	// Update the Edit Class Topic
	var Status = true
	updateClassErr := tx.Exec(query.UpdateClassData, reqVal.Name, Status, reqVal.FromTime, reqVal.ToTime, reqVal.Date, reqVal.Id).Error
	if updateClassErr != nil {
		log.Error(updateClassErr.Error())
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	if err := tx.Commit().Error; err != nil {
		log.Printf("ERROR: Failed to commit transaction: %v\n", err)
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	return true, "Successfully oup Details Updated"
}

func DeleteTopicSessionService(db *gorm.DB, reqVal model.DeleteTopicSessionModel) (bool, string) {
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

	//Delete the Class Topic
	deleteClassErr := tx.Exec(query.DeleteClassData, reqVal.Id).Error
	if deleteClassErr != nil {
		log.Error(deleteClassErr.Error())
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	if err := tx.Commit().Error; err != nil {
		log.Printf("ERROR: Failed to commit transaction: %v\n", err)
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	return true, "Successfully Group Details Updated"
}

func UpdateMeetingLinkTopicSessionService(db *gorm.DB, reqVal model.UpdateMeetingLinkTopicSessionModel) (bool, string) {
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

	//Update the Meeting Link in the Class
	UpdateMeetingLinkerr := tx.Exec(query.UpdateMeetingLinkSQL, reqVal.MeetingLink, reqVal.Id).Error
	if UpdateMeetingLinkerr != nil {
		log.Error(UpdateMeetingLinkerr.Error())
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	if err := tx.Commit().Error; err != nil {
		log.Printf("ERROR: Failed to commit transaction: %v\n", err)
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	return true, "Successfully Meeting Link Updated"
}

func ListGroupStudentSessionService(db *gorm.DB, reqVal model.ListGroupStudentSessionModel) (bool, string, []model.ListGroupStudentModel) {
	log := logger.InitLogger()

	var ListGroupStudent []model.ListGroupStudentModel
	ListGroupStudentErr := db.Raw(query.ListGroupStudentSQL, reqVal.Id).Scan(&ListGroupStudent).Error
	if ListGroupStudentErr != nil {
		log.Error(ListGroupStudentErr.Error())
		return false, "Something went wrong, Try Again", []model.ListGroupStudentModel{}
	}

	return true, "Successfully Data Fetched", ListGroupStudent
}

func SendMailStudentSessionService(reqVal model.SendMailStudentModel) {
	// log := logger.InitLogger()
	db, sqlDB := db.InitDB()
	defer sqlDB.Close()

	for _, data := range reqVal.Id {
		var SendMailStudent []model.SendMailDataModel
		SendMailStudentErr := db.Raw(query.GetSendMailStudentSQL, data, reqVal.CLId).Scan(&SendMailStudent).Error
		if SendMailStudentErr != nil {
			fmt.Println(SendMailStudentErr.Error())
			return
		}
		fmt.Println(SendMailStudent[0])
	}

}

func UpdateMeetingRecordLinkSessionService(db *gorm.DB, reqVal model.UpdateMeetingRecordLinkSessionModel) (bool, string) {
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

	//Update the Class Recording Link
	UpdateClassRecordErr := tx.Exec(query.UpdateMeetingRecordSQL, reqVal.MeetingLink, reqVal.Id).Error
	if UpdateClassRecordErr != nil {
		log.Error(UpdateClassRecordErr.Error())
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	if err := tx.Commit().Error; err != nil {
		log.Printf("ERROR: Failed to commit transaction: %v\n", err)
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	return true, "Successfully Group Details Updated"
}
