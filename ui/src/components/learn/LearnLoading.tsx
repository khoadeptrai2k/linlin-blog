export function LearnLoading({ label }: { label: string }) {
  return (
    <section className="learn-loading px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-xl text-center">
        <span className="learn-loading-dot" />
        <p className="font-display mt-5 text-2xl text-sky-700">{label}</p>
        <div className="mt-8 grid gap-3">
          <div className="learn-skeleton h-24" />
          <div className="learn-skeleton h-14" />
          <div className="learn-skeleton h-14" />
        </div>
      </div>
    </section>
  );
}
