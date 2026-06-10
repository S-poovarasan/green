package query

var NewLeaveRequestSQL = `
INSERT INTO leave."UserLeave" ("refUserId", "refULStartDate", "refULEndDate", "refULReason", "refULStatus",
                               "refULAccessStatus", "refULCreatedAt", "refULCreatedBy")
VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
`

var GetLeaveListSQL = `
SELECT *
FROM leave."UserLeave"
WHERE "refUserId" = $1
AND "refULAccessStatus" = TRUE
ORDER BY "refULId" DESC
`

var WithdrawLeaveRequestSQL = `
UPDATE leave."UserLeave"
SET "refULStatus"    = $1,
    "refULUpdatedAt" = $2,
    "refULUpdatedBy" = $3
WHERE "refULId" = $4;
`
