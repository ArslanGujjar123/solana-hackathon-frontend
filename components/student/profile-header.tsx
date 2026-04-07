"use client";

import { useState, useRef } from "react";
import { User, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  studentId: string;
  avatarUrl?: string;
  onAvatarChange?: (file: File) => void;
}

export function ProfileHeader({
  firstName,
  lastName,
  studentId,
  avatarUrl,
  onAvatarChange,
}: ProfileHeaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(avatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Call parent's onAvatarChange if provided
      onAvatarChange?.(file);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-4">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative">
          <div className="h-20 w-20 rounded-full bg-muted border-2 border-border flex items-center justify-center overflow-hidden">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={`${firstName} ${lastName}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
          <button
            onClick={handleAvatarClick}
            type="button"
            className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center border-2 border-card transition-colors cursor-pointer"
          >
            <Camera className="h-3 w-3" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <h2 className="text-base font-bold text-foreground">
            {firstName} {lastName}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Student ID: {studentId}
          </p>
        </div>
      </div>
    </div>
  );
}
