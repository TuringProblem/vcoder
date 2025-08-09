package main

import (
	"log"
	"net/http"

	"backend/routes"
)

func main() {
	mux := http.NewServeMux()

	// Register application routes
	routes.RegisterRoutes(mux)

	addr := ":8080"
	log.Printf("Server listening on http://localhost%s", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
