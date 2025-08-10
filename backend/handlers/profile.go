package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"backend/models"
)

var profileStore = map[string]models.Profile{}

func GetProfileHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	userID := "default-user"

	profile, ok := profileStore[userID]
	if !ok {
		profile = models.Profile{
			ID:        userID,
			FirstName: "",
			LastName:  "",
			Email:     "",
			Bio:       "",
			AvatarURL: "",
			Badges:    []models.Badge{},
			CreatedAt: time.Now().Format(time.RFC3339),
			UpdatedAt: time.Now().Format(time.RFC3339),
		}
		profileStore[userID] = profile
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(profile)
}

func UpdateProfileHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.UpdateProfileRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}

	userID := "default-user"

	profile, ok := profileStore[userID]
	if !ok {
		profile = models.Profile{
			ID:        userID,
			Badges:    []models.Badge{},
			CreatedAt: time.Now().Format(time.RFC3339),
		}
	}

	profile.FirstName = req.FirstName
	profile.LastName = req.LastName
	profile.Email = req.Email
	profile.Bio = req.Bio
	profile.AvatarURL = req.AvatarURL
	profile.UpdatedAt = time.Now().Format(time.RFC3339)

	profileStore[userID] = profile

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(profile)
}

func AddBadgeHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.Badge
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}

	userID := "default-user"

	profile, ok := profileStore[userID]
	if !ok {
		http.Error(w, "profile not found", http.StatusNotFound)
		return
	}

	if req.ID == "" {
		req.ID = fmt.Sprintf("badge-%s-%s-%d", req.Language, req.Section, time.Now().Unix())
	}

	req.EarnedAt = time.Now().Format(time.RFC3339)

	for _, badge := range profile.Badges {
		if badge.ID == req.ID {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(profile)
			return
		}
	}

	profile.Badges = append(profile.Badges, req)
	profile.UpdatedAt = time.Now().Format(time.RFC3339)

	profileStore[userID] = profile

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(profile)
}
