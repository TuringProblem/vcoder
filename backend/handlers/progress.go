package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"backend/models"
)

var progressStore = map[string]models.Progress{}

func CompleteLessonHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.CompleteLessonRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}

	key := req.Language
	st, ok := progressStore[key]
	if !ok {
		st = models.Progress{Language: req.Language, CompletedLessons: map[string]bool{}}
	}

	// For now we trust the client. The CheckAccess endpoint provides server-side gating.
	lessonKey := req.Section + "/" + req.Lesson
	st.CompletedLessons[lessonKey] = true
	progressStore[key] = st

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(st)
}

// GetProgressHandler returns the completion state for a language.
func GetProgressHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	lang := r.URL.Query().Get("language")
	if lang == "" {
		http.Error(w, "language is required", http.StatusBadRequest)
		return
	}

	st, ok := progressStore[lang]
	if !ok {
		st = models.Progress{Language: lang, CompletedLessons: map[string]bool{}}
		progressStore[lang] = st
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(st)
}

// CheckAccessHandler validates if a lesson is unlocked based on prior completions and section order.
func CheckAccessHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	lang := r.URL.Query().Get("language")
	section := r.URL.Query().Get("section")
	lesson := r.URL.Query().Get("lesson")
	if lang == "" || section == "" || lesson == "" {
		http.Error(w, "language, section, and lesson are required", http.StatusBadRequest)
		return
	}

	st, ok := progressStore[lang]
	if !ok {
		st = models.Progress{Language: lang, CompletedLessons: map[string]bool{}}
		progressStore[lang] = st
	}

	// Define section order and within-section lesson sequencing
	sectionOrder := []string{"variables", "conditionals", "loops", "functions"}
	index := map[string]int{}
	for i, s := range sectionOrder {
		index[s] = i
	}

	// Previous section must be fully complete
	if idx, ok := index[section]; ok && idx > 0 {
		prev := sectionOrder[idx-1]
		for i := 1; i <= 9; i++ {
			key := prev + "/lesson-" + itoa(i)
			if !st.CompletedLessons[key] {
				writeAccess(w, false, "/course/"+lang+"/"+prev+"/lesson-1", "Previous section not complete")
				return
			}
		}
	}

	// Within section: enforce sequential unlocking
	if lesson != "lesson-1" {
		prevNum := parseLessonNumber(lesson) - 1
		if prevNum < 1 {
			writeAccess(w, false, "/course/"+lang+"/"+section+"/lesson-1", "Invalid lesson order")
			return
		}
		prevKey := section + "/lesson-" + itoa(prevNum)
		if !st.CompletedLessons[prevKey] {
			writeAccess(w, false, "/course/"+lang+"/"+section+"/lesson-"+itoa(prevNum), "Previous lesson not complete")
			return
		}
	}

	writeAccess(w, true, "", "")
}

func parseLessonNumber(lesson string) int {
	var n int
	_, err := fmt.Sscanf(lesson, "lesson-%d", &n)
	if err != nil {
		return 1
	}
	return n
}

func itoa(n int) string { return fmt.Sprintf("%d", n) }

func writeAccess(w http.ResponseWriter, allowed bool, redirect string, reason string) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(models.AccessCheckResponse{Allowed: allowed, RedirectPath: redirect, Reason: reason})
}
