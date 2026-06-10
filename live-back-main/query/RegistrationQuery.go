package query

var ListCoursesSQL = `
SELECT
  *
FROM
  courses."Course"
WHERE
  "refCourseStatus" = true
`

var Checkmailphonenumber = `
SELECT
  ("refUCMail" = $1) AS "isEmailExist",
  ("refUCMobileno" = $2) AS "isphoneNumberExist",
  $1 AS "emailid",
  $2 AS "phonenumber"
FROM
  userdomain."userCommunication"
WHERE
    "refUCMail" = $1
    OR "refUCMobileno" = $2
`

var NewRegistrationUserSQL = `
INSERT INTO public.users (
  "refUserName",
  "refUserStatus",
  "refUserRTId",
  "refUserDOB",
  "refUserProfile",
  "refUserCreatedAt",
  "refUserCreatedBy",
  "refUserEnrolledDate",
  "refUserCustId"
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING "refUserId";
`

var NewRegistrationCommunicationSQL = `
INSERT INTO
  userdomain."userCommunication" (
    "refUserId",
    "refUCAddress",
    "refUCMobileno",
    "refUCWhatsAppMobileNo",
    "refUCMail"
  )
VALUES
  ($1, $2, $3, $4 , $5);
`

var NewRegistrationPasswordSQL = `
INSERT INTO userdomain."userAuth" (
  "refUserId",
  "refUAPassword",
  "refUAHashPassword",
  "refUAPasswordResetStatus"
)
VALUES
(
  $1, $2, $3, $4
);
`

var NewRegistrationStudentDomainSQL = `
INSERT INTO
  userdomain."userStudentDomain" (
    "refUserId",
    "refUSDHigherEducation",
    "refUSDFMOccupation",
    "refUSDPassedOutYear",
    "refUSDWorkExperience"
  )
VALUES
  ($1, $2, $3, $4, $5);
`

var NewRegistrationCourseSelectionSQL = `
INSERT INTO
  courses."userCourses" ("refUserId", "refCourseId", "refUCOPreference")
VALUES
  ($1, $2, $3);
`

var GetUserLatestCountSQL = `
SELECT
  COUNT(*)
FROM
  public."users"
WHERE
  "refUserRTId" = $1
`

var CourseData = `
SELECT
  *
FROM
  courses."Course"
WHERE
  "refCourseId" = $1
`
