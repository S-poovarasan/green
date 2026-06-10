package service

import (
	"encoding/json"
	logger "greenstech/helper/Logger"
	"greenstech/model"
	"greenstech/query"

	"gorm.io/gorm"
)

func GetGroupsServices(reqVal model.ReqGetGroup, db *gorm.DB) (bool, string, []model.CourseListModel, []model.SubtrainerListModel, []model.ListAllGroups) {
	log := logger.InitLogger()

	var ListCoursesData []model.CourseListModel

	ListCoursesDataErr := db.Raw(query.ListCoursesSQL).Scan(&ListCoursesData).Error
	if ListCoursesDataErr != nil {
		log.Error(ListCoursesDataErr.Error())
		return false, "Something went wrong, Try Again", []model.CourseListModel{}, []model.SubtrainerListModel{}, []model.ListAllGroups{}
	}

	var ListSubtrainerData []model.SubtrainerListModel

	ListSubtrainerDataErr := db.Raw(query.ListActiveSubTrianerSQL).Scan(&ListSubtrainerData).Error
	if ListSubtrainerDataErr != nil {
		log.Error(ListSubtrainerDataErr.Error())
		return false, "Something went wrong, Try Again", []model.CourseListModel{}, []model.SubtrainerListModel{}, []model.ListAllGroups{}
	}

	//List the Groups
	var ListGroups []model.ListAllGroups
	ListGroupsErr := db.Raw(query.ListAllGroupSQL, reqVal.GroupId).Scan(&ListGroups).Error
	if ListGroupsErr != nil {
		log.Error(ListGroupsErr.Error())
		return false, "Something went wrong, Try Again", []model.CourseListModel{}, []model.SubtrainerListModel{}, []model.ListAllGroups{}
	}

	if reqVal.GroupId != 0 {
		for i, data := range ListGroups {
			var ListClass []model.ClassModel
			ListClassErr := db.Raw(query.ListClassesModel, data.RefGId).Scan(&ListClass).Error
			if ListClassErr != nil {
				log.Error(ListClassErr.Error())
				return false, "Something went wrong, Try Again", []model.CourseListModel{}, []model.SubtrainerListModel{}, []model.ListAllGroups{}
			}
			ListGroups[i].ListClass = ListClass
		}
	}

	return true, "Successfully data fetched", ListCoursesData, ListSubtrainerData, ListGroups
}

func NewgroupServices(db *gorm.DB, reqVal model.ReqNewGroupModel) (bool, string) {
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

	//Adding the Groups
	var AddingGroups []model.ListGroups
	AddingGroupsErr := tx.Raw(query.InsertGroupSQL, reqVal.GroupName, reqVal.GroupDescription).Scan(&AddingGroups).Error
	if AddingGroupsErr != nil {
		log.Error(AddingGroupsErr.Error())
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	//Adding the Handler Groups
	AddingHandlerGroupsErr := tx.Exec(query.InsertingSubTrainerGroupsSQL, reqVal.CourseId, AddingGroups[0].RefGId, reqVal.Subtrainerid).Error
	if AddingHandlerGroupsErr != nil {
		log.Error(AddingHandlerGroupsErr.Error())
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	//Adding the Classes
	topicsJSON, _ := json.Marshal(reqVal.Topic)
	AddingClassesErr := tx.Exec(query.InsertTopicsSQL, AddingGroups[0].RefGId, topicsJSON).Error
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

	return true, "Successfully Group Added"
}

func UpdategroupServices(db *gorm.DB, reqVal model.EditGroupsReq) (bool, string) {
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

	//Create, Update and Delete the Class Topic
	for _, data := range reqVal.ListClass {
		switch data.RefCLStatus {
		case "new":
			AddingClassesErr := tx.Exec(query.InsertNewTopicsSQL, reqVal.RefGId, data.RefCLName, data.RefCLFromTime, data.RefCLToTime, data.RefCLDate, true).Error
			if AddingClassesErr != nil {
				log.Error(AddingClassesErr.Error())
				tx.Rollback()
				return false, "Something went wrong, Try Again"

			}
		case "updated":
			var Status = true
			updateClassErr := tx.Exec(query.UpdateClassData, data.RefCLName, Status, data.RefCLFromTime, data.RefCLToTime, data.RefCLDate, data.RefCLId).Error
			if updateClassErr != nil {
				log.Error(updateClassErr.Error())
				tx.Rollback()
				return false, "Something went wrong, Try Again"
			}
		case "delete":
			deleteClassErr := tx.Exec(query.DeleteClassData, data.RefCLId).Error
			if deleteClassErr != nil {
				log.Error(deleteClassErr.Error())
				tx.Rollback()
				return false, "Something went wrong, Try Again"
			}
		}
	}

	if err := tx.Commit().Error; err != nil {
		log.Printf("ERROR: Failed to commit transaction: %v\n", err)
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	return true, "Successfully Group Added"
}
