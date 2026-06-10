package query

var GetCourseSQL = `
SELECT
  *
FROM
  courses."Course"
`

var CheckSyllabusNameSQL = `
SELECT
  *
FROM
  courses."Course"
WHERE
  "refCourseName" = $1;
` 

var InsertSyllabusSQL = `   
INSERT INTO
  courses."Course" ("refCourseName", "refCourseStatus")
VALUES
  ($1, TRUE);
`

var CheckUpdateSyllabusNameSQL = `
SELECT
  *
FROM
  courses."Course"
WHERE
  "refCourseName" = $1
  AND "refCourseId" != $2;
`

var UpdateSyllabusSQL = `
UPDATE
  courses."Course"
SET
  "refCourseName" = $1
WHERE
  "refCourseId" = $2;
`
