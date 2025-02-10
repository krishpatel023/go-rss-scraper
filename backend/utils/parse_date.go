package utils

import (
	"fmt"
	"time"
)

// Possible date formats used in RSS feeds
var dateFormats = []string{
	time.RFC1123,                // "Mon, 02 Jan 2006 15:04:05 MST"
	time.RFC1123Z,               // "Mon, 02 Jan 2006 15:04:05 -0700"
	time.RFC822,                 // "02 Jan 06 15:04 MST"
	time.RFC822Z,                // "02 Jan 06 15:04 -0700"
	time.RFC850,                 // "Monday, 02-Jan-06 15:04:05 MST"
	"2006-01-02T15:04:05Z07:00", // ISO 8601 with timezone offset
	time.RFC3339,                // "2006-01-02T15:04:05Z07:00"
}

func ParseDate(dateString string) (time.Time, error) {
	var parsedTime time.Time
	var err error

	for _, format := range dateFormats {
		parsedTime, err = time.Parse(format, dateString)
		if err == nil {
			return parsedTime, nil
		}
	}

	return time.Time{}, fmt.Errorf("unable to parse date: %s", dateString)
}
