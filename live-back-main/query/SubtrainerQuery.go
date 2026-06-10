package query

var NewRegistrationSubtrainerUserSQL = `
INSERT INTO public.users (
  "refUserName",
  "refUserStatus",
  "refUserRTId",
  "refUserDOB",
  "refUserProfile",
  "refUserCreatedAt",
  "refUserCreatedBy",
  "refUserCustId"
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING "refUserId";
`

var NewRegistrationSubtrainerDomainSQL = `
INSERT INTO
  userdomain."userSubtrainerDomain" (
    "refUserId",
    "refSTDWorkExprience",
    "refSDTAadhar",
    "refSDTResume",
    "refSDTCreatedAt",
    "refSDTCreatedBy"
  )
VALUES
  ($1, $2, $3, $4, $5, $6)
`

var ListSubtrainerSQL = `
SELECT
  *
FROM
  public."users" u
  JOIN userdomain."userCommunication" uc ON uc."refUserId" = u."refUserId"
  JOIN userdomain."userSubtrainerDomain" usd ON usd."refUserId" = u."refUserId"
WHERE
  u."refUserRTId" = 3
  AND (
    $1 = 0
    OR u."refUserId" = $1
  )
ORDER BY
  u."refUserId" DESC
`

var UpdateSubtrainerUserSQL = `
UPDATE
  public.users
SET
  "refUserName" = $1,
  "refUserStatus" = $2,
  "refUserDOB" = $3,
  "refUserProfile" = $4,
  "refUserUpdatedAt" = $5,
  "refUserUpdatedBy" = $6
WHERE
  "refUserId" = $7;
`

var UpdateSubtrianerCommunicationSQL = `
UPDATE
  userdomain."userCommunication"
SET
  "refUCAddress" = $1,
  "refUCMobileno" = $2
WHERE
  "refUserId" = $3;
`

var UpdateSubtrainerDomainSQL = `
UPDATE
  userdomain."userSubtrainerDomain"
SET
  "refSTDWorkExprience" = $1,
  "refSDTAadhar" = $2,
  "refSDTResume" = $3
WHERE
  "refUserId" = $4;
`

var InsertReportSQL = `
insert into report.report ("refUserId", "refRTId", "refRPDate", "refRPSummary", "refRPSolutions", "refRPGoal",
                           "refRPStatus", "refRPCreatedAt", "refRPCreatedBy")
values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING "refRPId";
`

var InsertReportDocumentSQL = `
insert into report."reportDocuments" ("refUserId", "refRPId", "refRPDName", "refRPDUrl", "refRPDCreatedAt", "refRPDCreatedBy")
values ($1, $2, $3, $4, $5, $6);
`

var GetReportSQL = `
SELECT rp.*,
rpt."refRTName",
       (SELECT COALESCE(
                       json_agg(row_to_json(rpd)),
                       '[]'::json
               )
        FROM report."reportDocuments" rpd
        WHERE rpd."refRPId" = rp."refRPId") AS documents
FROM report."report" rp
         JOIN report."refReportType" rpt
              ON rpt."refRTId" = rp."refRTId"
WHERE rp."refUserId" = $1;
`