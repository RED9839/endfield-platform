export default function HomeLoading() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto grid max-w-[1820px] grid-cols-1 gap-4 px-3 pb-24 pt-3 sm:px-4 md:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-6 lg:py-6">
        <aside className="hidden h-[calc(100vh-3rem)] animate-pulse rounded-[22px] border border-yellow-500/10 bg-[#080808] lg:block" />

        <section className="min-w-0 animate-pulse">
          <div className="grid gap-4 lg:h-[380px] lg:grid-cols-[minmax(0,1.55fr)_minmax(420px,0.9fr)] lg:gap-6">
            <div className="min-h-[330px] rounded-[22px] border border-yellow-500/10 bg-[#090909] sm:min-h-[380px] lg:min-h-0" />
            <div className="min-h-[260px] rounded-[22px] border border-yellow-500/10 bg-[#090909] sm:min-h-[320px] lg:min-h-0" />
          </div>

          <div className="mt-4 h-40 rounded-[22px] border border-yellow-500/10 bg-[#080808] lg:mt-6" />
          <div className="mt-4 h-56 rounded-[22px] border border-yellow-500/10 bg-[#080808] lg:mt-6" />
        </section>
      </div>
    </main>
  );
}
