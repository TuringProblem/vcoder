import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"
import { useProfile } from "../../data/queries/use-profile"

export function UserAvatarMenu() {
  const { data: profile } = useProfile()
  
  const getInitials = () => {
    if (profile?.firstName && profile?.lastName) {
      return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
    }
    if (profile?.firstName) {
      return profile.firstName[0].toUpperCase()
    }
    return "U"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild data-testid="user-avatar-menu">
        <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80">
          <AvatarImage src={profile?.avatarUrl || undefined} alt="User" />
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild data-testid="profile-menu-item">
          <Link to="/dashboard/profile" className="cursor-pointer">
            Customize Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild data-testid="dashboard-menu-item">
          <Link to="/dashboard" className="cursor-pointer">
            Dashboard
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 
