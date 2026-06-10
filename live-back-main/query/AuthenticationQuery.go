package query

var LoginSQL = `
SELECT
  *
FROM
  public.users u
  JOIN userdomain."userCommunication" uc ON uc."refUserId" = u."refUserId"
  JOIN userdomain."userAuth" ua ON ua."refUserId" = u."refUserId"
WHERE
  uc."refUCMail" = $1
`

var CheckPasswordSQL = `
SELECT
  u."user_Id",
  u."role_Id",
  ua."refUA_hashpass"
FROM
  public.users u
  JOIN userdomain."userCommunication" rc ON rc."user_Id" = u."user_Id"
  JOIN userdomain."userAuth" ua ON ua."user_Id" = u."user_Id"
WHERE
  u."user_Id" = $1
`

var UpdatePasswordSQL = `
UPDATE userdomain."userAuth"
SET
  "refUA_password" = $1,
  "refUA_hashpass" = $2
WHERE
  "user_Id" = $3; 
`