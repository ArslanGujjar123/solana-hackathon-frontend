"use client";

import { GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MAJOR_OPTIONS } from "@/constants/profile";

interface AcademicDetailsSectionProps {
  major: string;
  cgpa: string;
  bio: string;
  onMajorChange: (value: string) => void;
  onCgpaChange: (value: string) => void;
  onBioChange: (value: string) => void;
}

export function AcademicDetailsSection({
  major,
  cgpa,
  bio,
  onMajorChange,
  onCgpaChange,
  onBioChange,
}: AcademicDetailsSectionProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Section Header */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <GraduationCap className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold text-foreground">Academic Details</h3>
      </div>

      {/* Section Content */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Major / Course */}
        <div className="space-y-1.5 md:col-span-2">
          <Label className="text-[11px] font-semibold">Major / Course</Label>
          <select
            value={major}
            onChange={(e) => onMajorChange(e.target.value)}
            className="w-full h-9 rounded-lg border border-input bg-background text-foreground text-xs px-3 focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {MAJOR_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Current CGPA */}
        <div className="space-y-1.5">
          <Label className="text-[11px] font-semibold">Current CGPA</Label>
          <Input
            type="number"
            value={cgpa}
            onChange={(e) => onCgpaChange(e.target.value)}
            placeholder="0.00"
            min="0"
            max="4.00"
            step="0.01"
            className="h-9 text-xs"
          />
        </div>

        {/* Bio / Objective */}
        <div className="space-y-1.5 md:col-span-3">
          <Label className="text-[11px] font-semibold">Bio / Objective</Label>
          <Textarea
            value={bio}
            onChange={(e) => onBioChange(e.target.value)}
            placeholder="Briefly describe your research interests or what you hope to achieve with your FYP."
            rows={4}
            maxLength={500}
            className="text-xs resize-none"
          />
          <p className="text-[10px] text-muted-foreground text-right">
            {bio.length} / 500 characters
          </p>
        </div>
      </div>
    </div>
  );
}
