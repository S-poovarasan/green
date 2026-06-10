package service

import (
	logger "greenstech/helper/Logger"
	timeZone "greenstech/helper/TimeZone"
	"greenstech/model"
	"greenstech/query"

	"gorm.io/gorm"
)

func GetFilterService(db *gorm.DB) (bool, string, []model.ListFilterModel) {
	log := logger.InitLogger()

	//Adding the Groups
	var ListFilterData []model.ListFilterModel
	ListFilterDataErr := db.Raw(query.ListFilterSQL).Scan(&ListFilterData).Error
	if ListFilterDataErr != nil {
		log.Error(ListFilterDataErr.Error())
		return false, "Something went wrong, Try Again", []model.ListFilterModel{}
	}

	return true, "Successfully Group Added", ListFilterData
}

func GetStudentService(db *gorm.DB, reqVal model.GetStudentReq) (bool, string, model.ListStudentDetailsModel, []model.CourseListModel) {
	log := logger.InitLogger()

	//Get the Student Detail
	var StudentDetail model.ListStudentDetailsModel
	StudentDetailErr := db.Raw(query.GetStudentDetailSQL, reqVal.StudentId).Scan(&StudentDetail).Error
	if StudentDetailErr != nil {
		log.Error(StudentDetailErr.Error())
		return false, "Something went wrong, Try Again", model.ListStudentDetailsModel{}, []model.CourseListModel{}
	}

	//List Courses
	var ListCoursesData []model.CourseListModel

	ListCoursesDataErr := db.Raw(query.ListCoursesSQL).Scan(&ListCoursesData).Error
	if ListCoursesDataErr != nil {
		log.Error(ListCoursesDataErr.Error())
		return false, "Something went wrong, Try Again", model.ListStudentDetailsModel{}, []model.CourseListModel{}
	}

	return true, "Successfully Group Added", StudentDetail, ListCoursesData
}

func UpdateStudentService(db *gorm.DB, reqVal model.UpdateStudentReq, idValue int) (bool, string) {
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

	var IsMobileDuplicate model.IsMobileDuplicate

	//CheckUser Id Already Exits
	CheckMobileNumberErr := tx.Raw(query.CheckStudentMobileNumberDuplicateSQL, reqVal.Phonenumber, reqVal.UserId).Scan(&IsMobileDuplicate).Error
	if CheckMobileNumberErr != nil {
		log.Error(CheckMobileNumberErr.Error())
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	if IsMobileDuplicate.IsDuplicate {
		tx.Rollback()
		return false, "Phone Number Already Exits"
	}

	//Update the User Table
	UpdateUserDataErr := tx.Exec(
		query.UpdateStudentDataSQL,
		reqVal.Fullname,
		reqVal.UserStatus,
		reqVal.DOB,
		timeZone.GetPacificTime(),
		idValue,
		reqVal.UserId,
	).Error
	if UpdateUserDataErr != nil {
		log.Error(UpdateUserDataErr.Error())
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	//Update the Student Domain Table
	UpdateStudentDomainErr := tx.Exec(
		query.UpdateStudentDomainSQL,
		reqVal.Highesteducation,
		reqVal.Fathersmothersoccupation,
		reqVal.Passedoutyear,
		reqVal.Workexprience,
		reqVal.UserId,
	).Error
	if UpdateStudentDomainErr != nil {
		log.Error(UpdateStudentDomainErr.Error())
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	//Update the Student Communication Table
	UpdateStudentCommunicationErr := tx.Exec(
		query.UpdateCommunicationSQL,
		reqVal.CurrentLocation,
		reqVal.Phonenumber,
		reqVal.Whatsappnumber,
		reqVal.UserId,
	).Error
	if UpdateStudentCommunicationErr != nil {
		log.Error(UpdateStudentCommunicationErr.Error())
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	if err := tx.Commit().Error; err != nil {
		log.Printf("ERROR: Failed to commit transaction: %v\n", err)
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	return true, "Successfully Student Updated!"
}
