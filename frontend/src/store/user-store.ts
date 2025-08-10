import { create } from "zustand"

type UserState = {
  avatarDataUrl?: string
  setAvatar: (dataUrl?: string) => void
}

const AVATAR_KEY = "cl_user_avatar"

function readAvatar(): string | undefined {
  try {
    const v = localStorage.getItem(AVATAR_KEY)
    return v ?? undefined
  } catch {
    return undefined
  }
}

export const useUserStore = create<UserState>((set) => ({
  avatarDataUrl: typeof window !== "undefined" ? readAvatar() : undefined,
  setAvatar: (dataUrl) => {
    try {
      if (dataUrl) localStorage.setItem(AVATAR_KEY, dataUrl)
      else localStorage.removeItem(AVATAR_KEY)
    } catch {}
    set({ avatarDataUrl: dataUrl })
  },
}))


