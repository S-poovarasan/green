package query

var ListFilterSQL = `
SELECT
  u."refUserId",
  u."refUserName",
  uc."refUCMail",
  u."refUserEnrolledDate",
  c."refCourseName",
  g."refGName",
  usd."refUSDWorkExperience",
  u."refUserStatus"
FROM
  public."users" u
  JOIN userdomain."userCommunication" uc ON uc."refUserId" = u."refUserId"
  JOIN userdomain."userStudentDomain" usd ON usd."refUserId" = u."refUserId"
  JOIN courses."userCourses" usc ON usc."refUserId" = u."refUserId"
  JOIN courses."Course" c ON c."refCourseId" = usc."refCourseId"
  JOIN groups."handlerGroups" hg ON hg."refHGId" = usc."refHGId"
  JOIN groups."Groups" g ON g."refGId" = hg."refGId"
WHERE
  usc."refHGId" IS NOT NULL
  AND u."refUserRTId" = 4
ORDER BY
  u."refUserId" DESC
  `

var GetStudentDetailSQL = `
SELECT
  *
FROM
  public."users" u
  JOIN userdomain."userCommunication" uc ON uc."refUserId" = u."refUserId"
  JOIN userdomain."userStudentDomain" usd ON usd."refUserId" = u."refUserId"
  JOIN courses."userCourses" userc ON userc."refUserId" = u."refUserId"
WHERE
  u."refUserId" = $1;
  `

  var UpdateStudentDataSQL = `
  UPDATE
  public."users"
SET
  "refUserName" = $1,
  "refUserStatus" = $2,
  "refUserDOB" = $3,
  "refUserUpdatedAt" = $4,
  "refUserUpdatedBy" = $5
WHERE
  "refUserId" = $6
  `

  var UpdateStudentDomainSQL = `
  UPDATE
  userdomain."userStudentDomain"
SET
  "refUSDHigherEducation" = $1,
  "refUSDFMOccupation" = $2,
  "refUSDPassedOutYear" = $3,
  "refUSDWorkExperience" = $4
WHERE
  "refUserId" = $5
  `

  var UpdateCommunicationSQL = `
  UPDATE
  userdomain."userCommunication"
SET
  "refUCAddress" = $1,
  "refUCMobileno" = $2,
  "refUCWhatsAppMobileNo" = $3
WHERE
  "refUserId" = $4
  `

  var CheckStudentMobileNumberDuplicateSQL = `
  SELECT
  EXISTS (
    SELECT
      1
    FROM
      userdomain."userCommunication" uc
    WHERE
      uc."refUCMobileno" = $1
      AND uc."refUserId" != $2
  ) AS "isDuplicate";
  `