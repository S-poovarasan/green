package query

var NewPermissionReqSQL = `
INSERT INTO permission."UserPermission" ("refUserId", "refUPDate", "refUPStartTime", "refUPEndTime",
                                         "refUPPermissionType", "refUPReason", "refUPStatus", "refUPAccessStatus",
                                         "refUPCreatedAt", "refUPCreatedBy")
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
`

var WithdrawPermissionRequestSQL = `
UPDATE permission."UserPermission"
SET "refUPStatus" = $1,
    "refUPUpdatedAt" = $2,
    "refUPUpdatedBy" = $3
WHERE "refUPId" = $4;
` 

var GetPermissionListSQL = `
SELECT *
FROM permission."UserPermission"
WHERE "refUserId" = $1
AND "refUPAccessStatus" = TRUE
ORDER BY "refUPId" DESC
`