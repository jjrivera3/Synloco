import { checkUser } from "@/lib/checkUser";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import OrganizationButton from "./OrganizationButton";
import { Button } from "./ui/button";
import UserMenu from "./userMenu";

const Header = async () => {
  await checkUser();

  return (
    <header className="mx-auto bg-custom-bg px-10 border-b border-[#ffffff1a]">
      <nav className="py-6 px-4 flex justify-between items-center">
        <Link href="/">
          <Image
            src={"/logo.png"}
            alt="synloco logo"
            width={200}
            height={56}
            className="h-10 w-auto object-contain"
          />
        </Link>
        <div className="flex items-center gap-4">
          <OrganizationButton />

          <SignedOut>
            {/* Login Button */}
            <SignInButton forceRedirectUrl="/onboarding">
              <Button className="text-gray-300 bg-slate-600" variant="outline">
                Login
              </Button>
            </SignInButton>

            {/* Demo Button */}
            <Link href="/demo">
              <Button
                className="text-gray-300 bg-blue-600 hover:bg-blue-700"
                variant="outline"
              >
                Demo
              </Button>
            </Link>
          </SignedOut>

          <SignedIn>
            <UserMenu />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
