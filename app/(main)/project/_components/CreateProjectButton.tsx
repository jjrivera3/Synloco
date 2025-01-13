"use client";

import { Button } from "@/components/ui/button";
import { useOrganization } from "@clerk/nextjs";
import { PenBox } from "lucide-react";
import Link from "next/link";
import React from "react";

const CreateProjectButton = () => {
  const { membership } = useOrganization();
  const isAdmin = membership?.role === "org:admin";

  // Hide the button if the user is not an admin
  if (!isAdmin) return null;

  return (
    <Link href="/project/create">
      <Button className="bg-[#0881a3] text-white hover:bg-[#066b85] flex items-center gap-2">
        <PenBox size={18} />
        <span>Create Project</span>
      </Button>
    </Link>
  );
};

export default CreateProjectButton;
