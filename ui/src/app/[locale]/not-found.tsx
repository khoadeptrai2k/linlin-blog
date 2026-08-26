import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-4 py-28 text-center">
      <p className="font-display text-6xl text-sky-300">404</p>
      <h1 className="font-display mt-3 text-3xl tracking-[-0.03em] text-sky-700">
        Lost page
      </h1>
      <Link href="/" className="btn-primary mt-10">
        Home
      </Link>
    </section>
  );
}
