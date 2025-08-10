export type Badge = {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: string
  language: string
  section: string
}

export type Profile = {
  id: string
  firstName: string
  lastName: string
  email: string
  bio: string
  avatarUrl: string
  badges: Badge[]
  createdAt: string
  updatedAt: string
}

export type UpdateProfileRequest = {
  firstName: string
  lastName: string
  email: string
  bio: string
  avatarUrl: string
}
