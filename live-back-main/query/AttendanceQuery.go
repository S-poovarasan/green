package query

var GetPermissionSQL = `
SELECT *
FROM attendance."UserAttendance"
WHERE (TO_TIMESTAMP("refUAPunchOutTime", 'YYYY-MM-DD HH24:MI:SS')
          >= NOW() - INTERVAL '6 days' OR "refUAPunchOutTime" IS NULL)
AND "refUserId" = ?
ORDER BY "refUAId" DESC;
`

var PunchInSQL = `
INSERT INTO attendance."UserAttendance" ("refUserId", "refUAPunchInTime", "refUACreatedAt", "refUACreatedBy")
VALUES ($1, $2, $3, $4);
`

var CheckLatestPunchInSQL = `
SELECT *
FROM attendance."UserAttendance"
WHERE "refUserId" = $1
ORDER BY "refUAId" DESC
LIMIT 1
`

var PunchOutSQL = `
UPDATE attendance."UserAttendance"
SET "refUAPunchOutTime" = $1,
    "refUAUpdatedAt"    = $1,
    "refUAUpdatedBy"    = $2
WHERE "refUAId" = $3
`
