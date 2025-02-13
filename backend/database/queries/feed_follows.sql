-- name: CreateFeedFollow :one
INSERT INTO feed_follows (id, created_at, updated_at, feed_id, user_id)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: CheckIfUserFollowsFeed :one
SELECT EXISTS (
    SELECT 1
    FROM feed_follows
    WHERE feed_id = $1 AND user_id = $2
);

-- name: GetAllFeedUserFollows :many
SELECT feeds.* FROM feeds
INNER JOIN feed_follows ON feeds.id = feed_follows.feed_id
WHERE feed_follows.user_id = $1;

-- name: DeleteFeedFollow :exec
DELETE FROM feed_follows WHERE id = $1 AND user_id = $2;