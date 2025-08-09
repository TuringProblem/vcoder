package models

// AnalyzeRequest represents the request body for code analysis.
type AnalyzeRequest struct {
	Code string `json:"code"`
}

// Feedback represents a feedback item returned by the analyzer.
type Feedback struct {
	ID       string `json:"id"`
	Severity string `json:"severity"`
	Message  string `json:"message"`
	Line     int    `json:"line"`
	Column   int    `json:"column"`
}
