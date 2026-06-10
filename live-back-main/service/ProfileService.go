package service

import (
	logger "greenstech/helper/Logger"
	helper "greenstech/helper/ViewFile"
	"greenstech/model"
	"greenstech/query"

	"gorm.io/gorm"
)

func ProfileServices(db *gorm.DB, idValue int) (bool, string, model.ProfileUserResponse) {
	log := logger.InitLogger()

	var profileData model.ProfileUserResponse

	ProfileDataErr := db.Raw(query.ProfileSQL, idValue).Scan(&profileData).Error
	if ProfileDataErr != nil {
		log.Error(ProfileDataErr.Error())
		return false, "Something went wrong, Try Again", model.ProfileUserResponse{}
	}

	if profileData.ProfileImg != "" {
		profileImgHelperData, viewErr := helper.ViewFile("./Assets/Images/Profiles/" + profileData.ProfileImg)
		if viewErr != nil {
			// Using Fatalf would crash the server. Log a warning and continue.
			log.Warnf("Failed to read profile image file: %v", viewErr)
		} else {
			profileData.ProfileImgFile = profileImgHelperData
		}
	}

	return true, "Successfully data fetched", profileData

}
