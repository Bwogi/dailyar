// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ClipboardList,
  Search,
  Shield,
  Clock,
  FileText,
  Users,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 dark:from-gray-100 dark:via-gray-400 dark:to-gray-100 bg-clip-text text-transparent animate-gradient">
                Security Activity Reporting System
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl dark:text-gray-400">
                Streamline your security operations with our comprehensive and
                intuitive reporting solution.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/reports/new">
                <Button
                  size="lg"
                  className="hover:scale-105 transition-transform duration-200 ease-in-out"
                >
                  <ClipboardList className="mr-2 h-5 w-5" />
                  New Report
                </Button>
              </Link>
              <Link href="/reports">
                <Button
                  variant="outline"
                  size="lg"
                  className="hover:scale-105 transition-transform duration-200 ease-in-out"
                >
                  <Search className="mr-2 h-5 w-5" />
                  View Reports
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 border-t bg-gradient-to-t from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Quick Access
          </h2>
          <p className="text-muted-foreground mb-8 max-w-[600px]">
            Access key features and tools to manage security operations
            efficiently.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <Link href="/reports/new">
              <Card className="group hover:shadow-lg transition-all duration-200 ease-in-out hover:-translate-y-1 cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="w-5 h-5 text-primary" />
                      New Report
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out" />
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/reports">
              <Card className="group hover:shadow-lg transition-all duration-200 ease-in-out hover:-translate-y-1 cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Search className="w-5 h-5 text-primary" />
                      Search Reports
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out" />
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>

            <Link href="#">
              <Card className="group hover:shadow-lg transition-all duration-200 ease-in-out hover:-translate-y-1 cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Locations
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out" />
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>

            <Link href="#">
              <Card className="group hover:shadow-lg transition-all duration-200 ease-in-out hover:-translate-y-1 cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Help Guide
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out" />
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-200 ease-in-out">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 ease-in-out">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Real-Time Reporting</CardTitle>
                <CardDescription>
                  Log security activities and incidents as they happen with our
                  intuitive reporting system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                    Instant incident logging
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                    Equipment tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                    Shift management
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-200 ease-in-out">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 ease-in-out">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Time Management</CardTitle>
                <CardDescription>
                  Efficiently track duty hours and shift responsibilities with
                  precision.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                    Automated shift tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                    Duty hour monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                    Schedule optimization
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-200 ease-in-out">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 ease-in-out">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Comprehensive Reports</CardTitle>
                <CardDescription>
                  Generate and access detailed activity reports with powerful
                  search capabilities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                    Advanced filtering
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                    Detailed analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                    Export capabilities
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
