package handlers

import (
	"encoding/json"
	"io"
	"net/http"

	"backend/models"
	"backend/services"
)

func AnalyzeHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	defer r.Body.Close()
	bodyBytes, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "failed to read request body", http.StatusBadRequest)
		return
	}

	var req models.AnalyzeRequest
	if err := json.Unmarshal(bodyBytes, &req); err != nil {
		http.Error(w, "invalid JSON body", http.StatusBadRequest)
		return
	}

	feedback := services.AnalyzerServiceAnalyze(req.Code)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(feedback)
}
