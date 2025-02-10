-- +goose Up
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    title VARCHAR(256) NOT NULL,
    published_at TIMESTAMP NOT NULL,
    url VARCHAR(256) NOT NULL UNIQUE,
    description TEXT,
    feed_id UUID NOT NULL REFERENCES feeds (id) ON DELETE CASCADE
);

-- +goose Down
DROP TABLE posts;