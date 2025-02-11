-- name: SignUp :one
INSERT INTO auth (email, password, user_id) VALUES ($1, $2, $3) RETURNING *;

-- name: GetUserAuthByEmail :one
SELECT * FROM auth WHERE email = $1 LIMIT 1;