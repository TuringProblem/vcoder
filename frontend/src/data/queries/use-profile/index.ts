import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Profile, UpdateProfileRequest, Badge } from "../../types/profile"

const API_BASE = "http://localhost:8080"

function profileKey() {
  return ["profile"]
}

export function useProfile() {
  return useQuery<Profile>({
    queryKey: profileKey(),
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/profile`)
      if (!res.ok) throw new Error("Failed to load profile")
      return (await res.json()) as Profile
    },
    staleTime: 30_000,
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation<Profile, Error, UpdateProfileRequest>({
    mutationFn: async (body) => {
      const res = await fetch(`${API_BASE}/profile/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error("Failed to update profile")
      return (await res.json()) as Profile
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKey() })
    },
  })
}

export function useAddBadge() {
  const qc = useQueryClient()
  return useMutation<Profile, Error, Badge>({
    mutationFn: async (badge) => {
      const res = await fetch(`${API_BASE}/profile/badge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(badge),
      })
      if (!res.ok) throw new Error("Failed to add badge")
      return (await res.json()) as Profile
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKey() })
    },
  })
}
