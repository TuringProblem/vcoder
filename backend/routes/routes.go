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
}
