package models

// AnalyzeRequest represents the request body for code analysis.
type AnalyzeRequest struct {
	Code string `json:"code"`
}

type Feedback struct {
	ID       string `json:"id"`
	Severity string `json:"severity"`
	Message  string `json:"message"`
	Line     int    `json:"line"`
	Column   int    `json:"column"`
}

// Progress models the completion state per user (no auth for now), per language.
// It's intentionally simple and stored in-memory by the handler layer.
type Progress struct {
	Language         string          `json:"language"`
	CompletedLessons map[string]bool `json:"completedLessons"` // key format: section/lesson (e.g. "variables/lesson-1")
}

type CompleteLessonRequest struct {
	Language string `json:"language"`
	Section  string `json:"section"`
	Lesson   string `json:"lesson"`
}

type AccessCheckResponse struct {
	Allowed      bool   `json:"allowed"`
	RedirectPath string `json:"redirectPath,omitempty"`
	Reason       string `json:"reason,omitempty"`
}

type Profile struct {
	ID        string  `json:"id"`
	FirstName string  `json:"firstName"`
	LastName  string  `json:"lastName"`
	Email     string  `json:"email"`
	Bio       string  `json:"bio"`
	AvatarURL string  `json:"avatarUrl"`
	Badges    []Badge `json:"badges"`
	CreatedAt string  `json:"createdAt"`
	UpdatedAt string  `json:"updatedAt"`
}

type Badge struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Icon        string `json:"icon"`
	EarnedAt    string `json:"earnedAt"`
	Language    string `json:"language"`
	Section     string `json:"section"`
}

type UpdateProfileRequest struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Bio       string `json:"bio"`
	AvatarURL string `json:"avatarUrl"`
}
