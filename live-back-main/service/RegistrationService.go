package service

import (
	"fmt"
	becrypt "greenstech/helper/Becrypt"
	logger "greenstech/helper/Logger"
	timeZone "greenstech/helper/TimeZone"
	"greenstech/model"
	"greenstech/query"
	"strconv"

	"gorm.io/gorm"
)

func GetRegistrationServices(db *gorm.DB) (bool, string, []model.CourseListModel) {
	log := logger.InitLogger()

	var ListCoursesData []model.CourseListModel

	ListCoursesDataErr := db.Raw(query.ListCoursesSQL).Scan(&ListCoursesData).Error
	if ListCoursesDataErr != nil {
		log.Error(ListCoursesDataErr.Error())
		return false, "Something went wrong, Try Again", []model.CourseListModel{}
	}

	return true, "Successfully data fetched", ListCoursesData
}

func GetUserIdRegistrationServices(db *gorm.DB, reqVal model.CheckUserId) (bool, string, string, string, string) {
	log := logger.InitLogger()

	var count int

	countErr := db.Raw(query.GetUserLatestCountSQL, 4).Scan(&count).Error
	if countErr != nil {
		log.Error(countErr.Error())
		return false, "Something went wrong, Try Again", "", "", ""
	}

	// Format the count to a 5-digit string with leading zeros
	formattedCount := fmt.Sprintf("%05d", count+100001)

	// Generate the custom user ID
	customerID := "GTST" + formattedCount

	//Get CourseId
	var CourseData model.CourseListModel
	CourseDataErr := db.Raw(query.CourseData, reqVal.CourseId).Scan(&CourseData).Error
	if CourseDataErr != nil {
		log.Error(CourseDataErr.Error())
		return false, "Something went wrong, Try Again", "", "", ""
	}

	//checkEmail and Mobile Number is Already Registered
	var checkEmail model.CheckemailPhoneNumberModel
	checkEmailErr := db.Raw(query.Checkmailphonenumber, reqVal.Emailid, reqVal.Phonenumber).Scan(&checkEmail).Error
	if checkEmailErr != nil {
		log.Error(checkEmailErr.Error())
		return false, "Something went wrong, Try Again", "", "", ""
	}

	//Check Email Already Exits
	switch checkEmail.IsEmailExist {
	case true:
		return true, "Successfully data fetched", customerID, CourseData.CourseName, "Email Already Exits"
	case false:
		break
	}

	//Phone Number Already Exits
	switch checkEmail.IsPhoneNumberExist {
	case true:
		return true, "Successfully data fetched", customerID, CourseData.CourseName, "Phone Number Already Exits"
	case false:
		break
	}

	return true, "Successfully data fetched", customerID, CourseData.CourseName, ""
}

func NewRegistrationServices(db *gorm.DB, reqVal model.ReqnewRegistrationModel, idValue int) (bool, string) {
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

	//checkEmail and Mobile Number is Already Registered
	var checkEmail model.CheckemailPhoneNumberModel
	checkEmailErr := tx.Raw(query.Checkmailphonenumber, reqVal.Emailid, reqVal.Phonenumber).Scan(&checkEmail).Error
	if checkEmailErr != nil {
		log.Error(checkEmailErr.Error())
		return false, "Something went wrong, Try Again"
	}

	//Check Email Already Exits
	switch checkEmail.IsEmailExist {
	case true:
		return false, "Email Already Exits"
	case false:
		break
	}

	//Phone Number Already Exits
	switch checkEmail.IsPhoneNumberExist {
	case true:
		return false, "Phone Number Already Exits"
	case false:
		break
	}

	//Generating CustId
	var count int

	countErr := db.Raw(query.GetUserLatestCountSQL, 4).Scan(&count).Error
	if countErr != nil {
		log.Error(countErr.Error())
		return false, "Something went wrong, Try Again"
	}

	// Format the count to a 5-digit string with leading zeros
	formattedCount := fmt.Sprintf("%05d", count+100001)

	// Generate the custom user ID
	customerID := "GT" + formattedCount

	//Performing the Student Registration
	var userId int

	//Inserting into the User Table
	userDataErr := tx.Raw(
		query.NewRegistrationUserSQL,
		reqVal.Fullname,
		true,
		4, //student
		reqVal.Dob,
		"",
		timeZone.GetPacificTime(),
		idValue,
		reqVal.Enrolldate,
		customerID,
	).Scan(&userId).Error
	if userDataErr != nil {
		log.Error(userDataErr.Error())
		return false, "Something went wrong, Try Again"
	}

	//Inserting Communication
	communicationDataErr := tx.Exec(
		query.NewRegistrationCommunicationSQL,
		userId,
		reqVal.CurrentLocation,
		reqVal.Phonenumber,
		reqVal.Whatsappnumber,
		reqVal.Emailid,
	).Error
	if communicationDataErr != nil {
		log.Error(communicationDataErr.Error())
		return false, "Something went wrong, Try Again"
	}

	//Password Encrypt
	hashPassword, hashPassworderr := becrypt.HashPassword(reqVal.Dob)

	if hashPassworderr != nil {
		log.Printf("ERROR: Failed to hash password: %v\n", hashPassworderr)
		return false, "Something went wrong, Try Again"
	}

	//Inserting the Password
	AuthPasswordErr := tx.Exec(
		query.NewRegistrationPasswordSQL,
		userId,
		reqVal.Dob,
		hashPassword,
		true,
	).Error
	if AuthPasswordErr != nil {
		log.Error(AuthPasswordErr.Error())
		return false, "Something went wrong, Try Again"
	}

	//Insert Student Domain
	UserDomainDataErr := tx.Exec(
		query.NewRegistrationStudentDomainSQL,
		userId,
		reqVal.Highesteducation,
		reqVal.Fathersmothersoccupation,
		reqVal.Passedoutyear,
		reqVal.Workexprience,
	).Error
	if UserDomainDataErr != nil {
		log.Error(UserDomainDataErr.Error())
		return false, "Something went wrong, Try Again"
	}

	// Course Selection
	var courseID int
	if reqVal.Courseselection != "" {
		parsedID, err := strconv.Atoi(reqVal.Courseselection)
		if err != nil {
			log.Error("Invalid course selection value: ", err)
			return false, "Invalid course selection"
		}
		courseID = parsedID
	} else {
		courseID = 0 // handle appropriately if NULL
	}

	userCourseDataErr := tx.Exec(
		query.NewRegistrationCourseSelectionSQL,
		userId,
		courseID,
		reqVal.Preference,
	).Error
	if userCourseDataErr != nil {
		log.Error(userCourseDataErr.Error())
		return false, "Something went wrong, Try Again"
	}

	if err := tx.Commit().Error; err != nil {
		log.Printf("ERROR: Failed to commit transaction: %v\n", err)
		tx.Rollback()
		return false, "Something went wrong, Try Again"
	}

	return true, "Successfully Registered"

}
