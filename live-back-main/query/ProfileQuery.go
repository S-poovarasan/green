package query

var ProfileSQL = `
SELECT
  *
FROm
  public.users
WHERE
  "refUserId" = $1
`
