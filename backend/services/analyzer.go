package services

import "backend/models"

// AnalyzerServiceAnalyze returns hardcoded feedback for testing.
func AnalyzerServiceAnalyze(code string) []models.Feedback {
	// This returns fake feedback to validate front-back roundtrip.
	return []models.Feedback{
		{ID: "1", Severity: "info", Message: "Analysis ran successfully.", Line: 1, Column: 1},
		{ID: "2", Severity: "warning", Message: "Consider adding comments for exported functions.", Line: 3, Column: 5},
		{ID: "3", Severity: "error", Message: "Potential null pointer dereference.", Line: 10, Column: 12},
	}
}
