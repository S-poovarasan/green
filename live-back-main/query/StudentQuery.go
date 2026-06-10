package query

var ListCandidateAssignmentSQL = `
SELECT
  u."refUserName" as "StudetName",
  u."refUserStatus" as "StudentStatus",
  c."refCourseName" as "CourseName",
  hu."refUserName" as "HandlerName",
  c."refCourseId",
  uc."refUCOId",
  g."refGName"
FROM
  public."users" u
  JOIN courses."userCourses" uc ON uc."refUserId" = u."refUserId"
  JOIN courses."Course" c ON c."refCourseId" = uc."refCourseId"
  FULL JOIN groups."handlerGroups" hg ON hg."refHGId" = uc."refHGId"
  FULL JOIN public."users" hu ON hu."refUserId" = hg."refUserId"
  FULL JOIN groups."Groups" g ON g."refGId" = hg."refGId"
WHERE
  uc."refUCOPreference" = 'not1to1interested'
  AND u."refUserStatus" = true
  AND c."refCourseStatus" = true
  AND (
    hg."refHGStatus" = true
    OR true
  )
ORDER BY
  u."refUserId" DESC
`

var ListGroupsSQL = `
SELECT
  *
FROM
  groups."handlerGroups" hg
  JOIN courses."Course" c ON c."refCourseId" = hg."refCourseId"
  JOIN groups."Groups" g ON g."refGId" = hg."refGId"
  JOIN public."users" u ON u."refUserId" = hg."refUserId"
WHERE
  hg."refHGStatus" = true
  AND c."refCourseStatus" = true
  AND u."refUserStatus" = true
  AND g."refGStatus" = true
  AND hg."refCourseId" = $1
`

var ListAllGroupSQL = `
SELECT
  g.*,
  hg.*,
  c.*,
  u.*,
  (
    SELECT
      COUNT(*)
    FROM
      courses."userCourses" uc
    WHERE
      uc."refHGId" = hg."refHGId"
  ) AS "userCourseCount",
  (
    SELECT
      COUNT(*)
    FROM
      classes."Class" cla
    WHERE
      cla."refGId" = g."refGId"
      AND cla."refCLStatus" = true
  ) AS "totalTopics",
  0 AS "completedTopics"
FROM
  groups."Groups" g
  JOIN groups."handlerGroups" hg ON hg."refGId" = g."refGId"
  JOIN courses."Course" c ON c."refCourseId" = hg."refCourseId"
  JOIN public."users" u ON u."refUserId" = hg."refUserId"
WHERE
  hg."refHGStatus" = true
  AND c."refCourseStatus" = true
  AND u."refUserStatus" = true
  AND g."refGStatus" = true
  AND (
    $1 = 0
    OR hg."refHGId" = $1
  )
`

var ListClassesModel = `
SELECT
  *
FROM
  classes."Class"
WHERE
  "refGId" = $1
  AND "refCLStatus" = true
ORDER BY
  "refCLId" DESC
`

var AssignStudentSQL = `
UPDATE
  courses."userCourses"
SET
  "refHGId" = $1
WHERE
  "refUCOId" = $2
`

var StudentCourseSQL = `
SELECT uc."refHGId", C."refCourseName", G."refGName"
FROM courses."userCourses" uc
         JOIN courses."Course" C on uc."refCourseId" = C."refCourseId"
         JOIN groups."handlerGroups" hG on hG."refHGId" = uc."refHGId"
         JOIN groups."Groups" G on hG."refGId" = G."refGId"
WHERE uc."refUserId" = $1
  AND uc."refUCOPreference" = 'not1to1interested';
`