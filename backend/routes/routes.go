package routes

import (
	"net/http"

	"backend/handlers"
)

// RegisterRoutes wires all HTTP routes for the application.
func RegisterRoutes(mux *http.ServeMux) {
	mux.Handle("/analyze", withCORS(http.HandlerFunc(handlers.AnalyzeHandler)))
	mux.Handle("/healthz", withCORS(http.HandlerFunc(handlers.HealthHandler)))
	mux.Handle("/progress", withCORS(http.HandlerFunc(handlers.GetProgressHandler)))
	mux.Handle("/complete", withCORS(http.HandlerFunc(handlers.CompleteLessonHandler)))
	mux.Handle("/access-check", withCORS(http.HandlerFunc(handlers.CheckAccessHandler)))
	mux.Handle("/profile", withCORS(http.HandlerFunc(handlers.GetProfileHandler)))
	mux.Handle("/profile/update", withCORS(http.HandlerFunc(handlers.UpdateProfileHandler)))
	mux.Handle("/profile/badge", withCORS(http.HandlerFunc(handlers.AddBadgeHandler)))
}
