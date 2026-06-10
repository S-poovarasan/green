package query

var ListActiveSubTrianerSQL = `
SELECT
  *
FROM
  public."users" u
  JOIN userdomain."userCommunication" uc ON uc."refUserId" = u."refUserId"
  JOIN userdomain."userSubtrainerDomain" usd ON usd."refUserId" = u."refUserId"
WHERE
  u."refUserRTId" = 3
  AND u."refUserStatus" = true
`

var InsertGroupSQL = `
INSERT INTO
  groups."Groups" ("refGName", "refGDescription", "refGStatus")
VALUES
  ($1, $2, TRUE)
RETURNING
  "refGId",
  "refGName",
  "refGStatus";
`

var InsertingSubTrainerGroupsSQL = `
INSERT INTO
  groups."handlerGroups" (
    "refCourseId",
    "refGId",
    "refUserId",
    "refHGStatus"
  )
VALUES
  ($1, $2, $3, TRUE);
`

var InsertTopicsSQL = `
INSERT INTO classes."Class" 
  ("refGId", "refCLName", "refCLFromTime", "refCLToTime", "refCLDate", "refCLStatus")
SELECT 
  $1 AS "refGId", 
  t."refCLName",
  t."refCLFromTime",
  t."refCLToTime",
  t."refCLDate",
  TRUE AS "refCLStatus"
FROM jsonb_to_recordset($2::jsonb) AS t(
    "refCLName" text,
    "refCLFromTime" text,
    "refCLToTime" text,
    "refCLDate" text
)
RETURNING "refCLId", "refGId", "refCLName", "refCLStatus";
`

var UpdateGroupData = `
UPDATE
  groups."Groups"
SET
  "refGName" = $1,
  "refGDescription" = $2
WHERE
  "refGId" = $3;
`

var UpdateClassData = `
UPDATE
  classes."Class"
SET
  "refCLName" = $1,
  "refCLStatus" = $2,
  "refCLFromTime" = $3,
  "refCLToTime" = $4,
  "refCLDate" = $5
WHERE
  "refCLId" = $6;
`

var DeleteClassData = `
DELETE FROM
  classes."Class"
WHERE
  "refCLId" = $1;
`

var InsertNewTopicsSQL = `
INSERT INTO
  classes."Class" ("refGId", "refCLName", "refCLFromTime", "refCLToTime", "refCLDate", "refCLStatus")
VALUES
  ($1, $2, $3, $4, $5, $6);
`
