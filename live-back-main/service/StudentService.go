package service

import (
	logger "greenstech/helper/Logger"
	"greenstech/model"
	"greenstech/query"

	"gorm.io/gorm"
)

func GetCandidateAssignmentService(db *gorm.DB) (bool, string, []model.ListCandidateAssignmentModel) {
	log := logger.InitLogger()

	var ListStudent []model.ListCandidateAssignmentModel

	ListStudentErr := db.Raw(query.ListCandidateAssignmentSQL).Scan(&ListStudent).Error
	if ListStudentErr != nil {
		log.Error(ListStudentErr.Error())
		return false, "Something went wrong, Try Again", []model.ListCandidateAssignmentModel{}
	}

	return true, "Successfully data fetched", ListStudent
}

func GetCourseNSubtrainerService(db *gorm.DB, reqVal model.ReqGetCourseNSubtrainerModel) (bool, string, []model.ListHandlerGroups) {
	log := logger.InitLogger()

	var ListGroupsSQL []model.ListHandlerGroups
	ListGroupsSQLErr := db.Raw(query.ListGroupsSQL, reqVal.CourseId).Scan(&ListGroupsSQL).Error
	if ListGroupsSQLErr != nil {
		log.Error(ListGroupsSQLErr.Error())
		return false, "Something went wrong, Try Again", []model.ListHandlerGroups{}
	}

	return true, "Successfully data fetched", ListGroupsSQL
}

func AssignStudentService(db *gorm.DB, reqVal model.ReqAssignStudentModel) (bool, string) {
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

	//assign the Course and Group for the Student
	AssignUserErr := tx.Exec(query.AssignStudentSQL, reqVal.HGId, reqVal.UCOId).Error
	if AssignUserErr != nil {
		log.Error(AssignUserErr.Error())
		return false, "Something went wrong, Try Again"
	}

	if err := tx.Commit().Error; err != nil {
		log.Printf("ERROR: Failed to commit transaction: %v\n", err)
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	return true, "Successfully Assigned"
}

func GetStudentCourseService(db *gorm.DB, idValue int) (bool, string, []model.GetStudentCourseModel) {
	log := logger.InitLogger()

	var StudentCourse []model.GetStudentCourseModel

	StudentCourseErr := db.Raw(query.StudentCourseSQL, idValue).Scan(&StudentCourse).Error
	if StudentCourseErr != nil {
		log.Error(StudentCourseErr.Error())
		return false, "Something went wrong, Try Again", []model.GetStudentCourseModel{}
	}

	return true, "Successfully data fetched", StudentCourse
}
