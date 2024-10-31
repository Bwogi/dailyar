import Link from "next/link";
import { ThemeToggle } from "../components/theme-toggle";

export function Navbar() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <h2 className="text-lg">Daily Activity Reports</h2>
          </Link>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
