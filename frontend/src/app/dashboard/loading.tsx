export default function DashboardLoading() {
  return (
    <main className="grid min-h-screen bg-[#f6f8fc] lg:grid-cols-[64px_minmax(0,1fr)]" role="status" aria-live="polite">
      <aside className="hidden border-r border-[#e5e7eb] bg-white lg:block" />
      <section className="grid content-start gap-4 p-4 sm:p-6">
        <div className="h-10 w-56 animate-pulse rounded-lg bg-slate-200" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div className="h-24 animate-pulse rounded-xl border border-slate-200 bg-white" key={index} />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-xl border border-slate-200 bg-white" />
        <span className="sr-only">Loading dashboard</span>
      </section>
    </main>
  );
}
