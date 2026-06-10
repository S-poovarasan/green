package service

import (
	becrypt "greenstech/helper/Becrypt"
	logger "greenstech/helper/Logger"
	"greenstech/model"
	"greenstech/query"

	"gorm.io/gorm"
)

func LoginServices(db *gorm.DB, reqVal model.LoginReq) model.LoginResponse {
	log := logger.InitLogger()

	var Logindata []model.LoginModel

	//Get the User Login Data
	Loginerr := db.Raw(query.LoginSQL, reqVal.Username).Scan(&Logindata).Error
	if Loginerr != nil {
		log.Error(Loginerr.Error())
		return model.LoginResponse{
			Status:  false,
			Message: "Something went wrong, Try Again",
		}
	}

	//If the Username is Valid
	if len(Logindata) == 1 {

		//Check the Password
		if becrypt.ComparePasswords(Logindata[0].Password, reqVal.Password) {
			log.Info("Loggedin Success " + reqVal.Username)
			return model.LoginResponse{
				Status:   true,
				Message:  "Login Successful",
				RoleType: Logindata[0].RoleId,
				Id:       Logindata[0].UserId,
			}

		} else {
			log.Info("Invalid Login " + reqVal.Username)
			return model.LoginResponse{
				Status:  false,
				Message: "Invalid Username or Password",
			}
		}

	} else {
		log.Info("Invalid Login " + reqVal.Username)
		return model.LoginResponse{
			Status:  false,
			Message: "Invalid Username or Password",
		}
	}

}
