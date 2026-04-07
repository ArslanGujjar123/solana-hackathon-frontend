"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value = "", onChange, ...props }, ref) => {
    const formatPhoneNumber = (input: string): string => {
      // Remove all non-digit characters
      const digits = input.replace(/\D/g, "");
      
      // Format as 03XX-XXXXXXX
      if (digits.length === 0) return "";
      if (digits.length <= 4) return digits;
      if (digits.length <= 11) {
        return `${digits.slice(0, 4)}-${digits.slice(4)}`;
      }
      // Limit to 11 digits total
      return `${digits.slice(0, 4)}-${digits.slice(4, 11)}`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const formatted = formatPhoneNumber(inputValue);
      onChange?.(formatted);
    };

    return (
      <Input
        ref={ref}
        type="tel"
        value={value}
        onChange={handleChange}
        placeholder="03XX-XXXXXXX"
        maxLength={12} // 4 digits + dash + 7 digits
        className={cn(className)}
        {...props}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
