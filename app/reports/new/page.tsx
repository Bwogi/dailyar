// app/page.tsx
import NewReportForm from "../../../components/NewReportForm";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">
        Security Officer Daily Activity Report
      </h1>
      <NewReportForm />
    </main>
  );
}
