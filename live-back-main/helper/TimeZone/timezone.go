package timeZone

import (
	"time"
)

// GetPacificTimeWithFormat returns current time in Pacific timezone with the specified format
func GetTimeWithFormate(format string) string {
	loc, err := time.LoadLocation("Asia/Kolkata")
	if err != nil {
		panic(err)
	}
	return time.Now().In(loc).Format(format)
}

func MustGetPacificLocation() *time.Location {
	loc, _ := time.LoadLocation("Asia/Kolkata")
	return loc
}

func GetPacificTimeToken() time.Time {
	return time.Now().In(MustGetPacificLocation())
}

func GetPacificTime() string {
	pacificTime := time.Now().In(MustGetPacificLocation())
	return pacificTime.Format("2006-01-02 15:04:05")
}
