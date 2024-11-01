// components/Navbar.tsx
"use client";

import { Menu, Shield } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <div className="border-b bg-white/75 backdrop-blur-lg dark:bg-gray-950/75 sticky top-0 z-50">
      <div className="flex h-16 items-center px-4 container mx-auto">
        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Security Reports
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-4">
                <Link
                  href="/"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/reports/new"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  New Report
                </Link>
                <Link
                  href="/reports"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  View Reports
                </Link>
                {/* <Link
                  href="/locations"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Locations
                </Link> */}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo/Title */}
        <div className="ml-4 lg:ml-0">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Shield className="h-6 w-6 text-primary" />
            <h2 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              Security Activity Reports
            </h2>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 mx-6">
          <Link
            href="/"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="/reports/new"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            New Report
          </Link>
          <Link
            href="/reports"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            View Reports
          </Link>
          {/* <Link
            href="/locations"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Locations
          </Link> */}
        </nav>

        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
