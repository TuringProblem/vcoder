import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUserStore } from "@/store/user-store"

export function UserAvatarMenu() {
  const navigate = useNavigate()
  const avatar = useUserStore((s) => s.avatarDataUrl)
  const [open, setOpen] = React.useState(false)

  return (
    <div className="relative" data-testid="user-avatar-menu">
      <button
        className="rounded-full border p-0.5 hover:bg-accent"
        aria-label="Open user menu"
        onClick={() => setOpen((v) => !v)}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatar} alt="User avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </button>
      {open && (
        <div className="absolute right-0 mt-2">
          <Select onValueChange={(v) => { setOpen(false); navigate(v) }}>
            <SelectTrigger className="min-w-[220px] h-10" aria-label="User menu">
              <SelectValue placeholder="User menu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="/dashboard">Dashboard</SelectItem>
              <SelectItem value="/dashboard/profile">Customize profile</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}


