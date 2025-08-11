import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Upload } from "lucide-react";
import { useProfile, useUpdateProfile } from "../../data/queries/use-profile";

export function ProfilePage() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    avatarUrl: "",
  });

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        bio: profile.bio || "",
        avatarUrl: profile.avatarUrl || "",
      });
      setAvatarUrl(profile.avatarUrl || null);
    }
  }, [profile]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setAvatarUrl(dataUrl);
        setFormData((prev) => ({ ...prev, avatarUrl: dataUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({
        ...formData,
        avatarUrl: avatarUrl || "",
      });
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-2xl mx-auto" data-testid="profile-page">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  const pictureUploadCard = () => {
    return (
      <Card data-testid="profile-picture-card">
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Upload a new profile picture</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarUrl || undefined} alt="Profile" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button asChild variant="outline" data-testid="upload-avatar">
                <label className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </Button>
              <p className="text-sm text-muted-foreground">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const profileInfoCard = () => {
    return (
      <Card data-testid="profile-info-card">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">First Name</label>
              <input
                type="text"
                className="w-full mt-1 px-3 py-2 border rounded-md"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                data-testid="first-name-input"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Last Name</label>
              <input
                type="text"
                className="w-full mt-1 px-3 py-2 border rounded-md"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                data-testid="last-name-input"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full mt-1 px-3 py-2 border rounded-md"
              placeholder="Enter email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              data-testid="email-input"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Bio</label>
            <textarea
              className="w-full mt-1 px-3 py-2 border rounded-md"
              rows={3}
              placeholder="Tell us about yourself"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              data-testid="bio-textarea"
            />
          </div>
          <Button
            className="w-full"
            data-testid="save-profile"
            onClick={handleSave}
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6" data-testid="profile-page">
      <div>
        <h1 className="text-2xl font-semibold">Customize Profile</h1>
        <p className="text-muted-foreground">
          Update your profile information and avatar
        </p>
      </div>

      {pictureUploadCard()}
      {profileInfoCard()}

      {profile?.badges && profile.badges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Badges Earned</CardTitle>
            <CardDescription>
              Your achievements from completed lessons
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {profile.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-3 p-3 border rounded-md"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {badge.icon}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{badge.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {badge.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
