import { SignedIn } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";

const OrganizationButton = () => {
  return (
    <Link href="/onboarding">
      <SignedIn>
        <Button className=" bg-[#333333] hover:bg-[#4d4d4d] text-white flex items-center gap-2">
          My Organizations
        </Button>
      </SignedIn>
    </Link>
  );
};

export default OrganizationButton;
