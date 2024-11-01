// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import // Card,
// CardContent,
// CardDescription,
// CardHeader,
// CardTitle,
"@/components/ui/card";
import {
  ClipboardList,
  Search,
  // Shield,
  // Clock,
  // FileText,
  // Users,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 border-b">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent animate-gradient">
                Security Activity Reporting System
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Streamline your security operations with our comprehensive
                activity reporting solution.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/reports/new">
                <Button
                  size="lg"
                  className="hover:scale-105 transition-transform"
                >
                  <ClipboardList className="mr-2 h-4 w-4" />
                  New Report
                </Button>
              </Link>
              <Link href="/reports">
                <Button
                  variant="outline"
                  size="lg"
                  className="hover:scale-105 transition-transform"
                >
                  <Search className="mr-2 h-4 w-4" />
                  View Reports
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      {/* <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tight mb-8">
            Quick Access
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <Link href="/reports/new">
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ClipboardList className="w-5 h-5 mr-2" />
                    New Report
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/reports">
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Search className="w-5 h-5 mr-2" />
                    Search Reports
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/locations">
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Locations
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/help">
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Help Guide
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section> */}
      {/* Features Section */}
      {/* <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Shield className="w-10 h-10 mb-2 text-primary" />
                <CardTitle>Real-Time Reporting</CardTitle>
                <CardDescription>
                  Log security activities and incidents as they happen with our
                  intuitive reporting system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Instant incident logging</li>
                  <li>Equipment tracking</li>
                  <li>Shift management</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="w-10 h-10 mb-2 text-primary" />
                <CardTitle>Time Management</CardTitle>
                <CardDescription>
                  Efficiently track duty hours and shift responsibilities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Shift tracking</li>
                  <li>Duty logging</li>
                  <li>Schedule overview</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="w-10 h-10 mb-2 text-primary" />
                <CardTitle>Comprehensive Reports</CardTitle>
                <CardDescription>
                  Generate and access detailed activity reports with ease.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Advanced search</li>
                  <li>Detailed analytics</li>
                  <li>Export capabilities</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}
    </div>
  );
}
