package query

var GetSessionSQL = `
SELECT
  hg."refHGId",
  hg."refCourseId",
  hg."refGId",
  c."refCourseName",
  g."refGName",
  g."refGDescription",
  (
    SELECT
      COUNT(*)
    FROM
      classes."Class" cl
    WHERE
      cl."refGId" = g."refGId"
  ) AS "totalClass",
  (
    SELECT
      COUNT(*)
    FROM
      classes."Class" cl
    WHERE
      cl."refGId" = g."refGId"
      AND cl."refCLRecordingLink" IS NOT NULL
      AND TRIM(cl."refCLRecordingLink") <> ''
  ) AS "attendedClass",
  (
    SELECT json_agg(cl ORDER BY cl."refCLId" ASC)
    FROM classes."Class" cl
    WHERE cl."refGId" = g."refGId"
  ) AS "classes"
FROM
  groups."handlerGroups" hg
  JOIN courses."Course" c ON c."refCourseId" = hg."refCourseId"
  JOIN public."users" u ON u."refUserId" = hg."refUserId"
  JOIN groups."Groups" g ON g."refGId" = hg."refGId"
WHERE
  u."refUserId" = $1
  AND hg."refHGStatus" = TRUE
  AND g."refGStatus" = TRUE
`

var UpdateMeetingLinkSQL = `
UPDATE
  classes."Class"
SET
  "refCLLink" = $1
WHERE
  "refCLId" = $2
`

var ListGroupStudentSQL = `
SELECT u."refUserId", u."refUserName", g."refGId", g."refGName"
FROM courses."userCourses" uc
         JOIN groups."handlerGroups" hG on uc."refHGId" = hG."refHGId"
         JOIN public.users u on uc."refUserId" = u."refUserId"
         JOIN groups."Groups" G on hG."refGId" = G."refGId"
WHERE G."refGId" = $1
`

var GetSendMailStudentSQL = `
SELECT cl."refCLName",
       cl."refCLDate",
       cl."refCLFromTime",
       cl."refCLToTime",
       cl."refCLLink",
       G."refGName",
       u."refUserName",
       uc."refUCMail"
FROM classes."Class" cl
         JOIN groups."Groups" G on cl."refGId" = G."refGId"
         JOIN public."users" u ON u."refUserId" = ?
         JOIN userdomain."userCommunication" uc ON uc."refUserId" = u."refUserId"
WHERE cl."refCLId" = ?
`

var UpdateMeetingRecordSQL = `
UPDATE classes."Class"
SET "refCLRecordingLink" = ?
WHERE "refCLId" = ?
`
