"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface SignOutButtonProps {
  redirectTo?: string;
  variant?: "outline" | "ghost" | "default";
}

const SignOutButton = ({
  redirectTo = "/",
  variant = "outline"
}: SignOutButtonProps) => {
  return (
    <Button
      onClick={() => signOut({ callbackUrl: redirectTo })}
      variant={variant}
      size="sm"
      className="gap-2"
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </Button>
  );
};

export default SignOutButton;
