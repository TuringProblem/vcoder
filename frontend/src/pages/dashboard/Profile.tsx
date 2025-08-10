import * as React from "react"
import { useUserStore } from "@/store/user-store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Profile() {
  const avatar = useUserStore((s) => s.avatarDataUrl)
  const setAvatar = useUserStore((s) => s.setAvatar)

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatar(typeof reader.result === "string" ? reader.result : undefined)
    reader.readAsDataURL(file)
  }

  return (
    <div className="p-6 space-y-4 max-w-xl" data-testid="profile-page">
      <h1 className="text-xl font-semibold">Customize profile</h1>
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={avatar} alt="User avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <label className="text-sm font-medium">Upload avatar</label>
          <input type="file" accept="image/*" onChange={onFile} />
          <div>
            <button className="text-xs underline" onClick={() => setAvatar(undefined)}>Remove</button>
          </div>
        </div>
      </div>
    </div>
  )
}


