"use client";

import { UserCircle, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";

interface PersonalInfoSectionProps {
  firstName: string;
  lastName: string;
  studentId: string;
  email: string;
  contactNumber: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onContactNumberChange: (value: string) => void;
}

export function PersonalInfoSection({
  firstName,
  lastName,
  studentId,
  email,
  contactNumber,
  onFirstNameChange,
  onLastNameChange,
  onContactNumberChange,
}: PersonalInfoSectionProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Section Header */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <UserCircle className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold text-foreground">
          Personal Information
        </h3>
      </div>

      {/* Section Content */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* First Name */}
        <div className="space-y-1.5">
          <Label className="text-[11px] font-semibold">First Name</Label>
          <Input
            type="text"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            placeholder="e.g. Alex"
            className="h-9 text-xs"
          />
        </div>

        {/* Last Name */}
        <div className="space-y-1.5">
          <Label className="text-[11px] font-semibold">Last Name</Label>
          <Input
            type="text"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            placeholder="e.g. Johnson"
            className="h-9 text-xs"
          />
        </div>

        {/* Student ID (Read Only) */}
        <div className="space-y-1.5">
          <Label className="text-[11px] font-semibold">
            Student ID{" "}
            <span className="text-[10px] text-muted-foreground font-normal">
              (Read Only)
            </span>
          </Label>
          <div className="relative">
            <Input
              type="text"
              value={studentId}
              readOnly
              className="h-9 text-xs bg-muted cursor-not-allowed pl-8 text-muted-foreground"
            />
            <Lock className="h-3.5 w-3.5 text-muted-foreground absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* University Email (Read Only) */}
        <div className="space-y-1.5 md:col-span-2">
          <Label className="text-[11px] font-semibold">
            University Email{" "}
            <span className="text-[10px] text-muted-foreground font-normal">
              (Read Only)
            </span>
          </Label>
          <div className="relative">
            <Input
              type="email"
              value={email}
              readOnly
              className="h-9 text-xs bg-muted cursor-not-allowed pl-8 text-muted-foreground"
            />
            <Lock className="h-3.5 w-3.5 text-muted-foreground absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Contact Number */}
        <div className="space-y-1.5">
          <Label className="text-[11px] font-semibold">Contact Number</Label>
          <PhoneInput
            value={contactNumber}
            onChange={onContactNumberChange}
            className="h-9 text-xs"
          />
        </div>
      </div>
    </div>
  );
}
