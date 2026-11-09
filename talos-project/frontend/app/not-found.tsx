import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-semibold text-gray-500">Error 404</p>
      <h1 className="mt-2 text-3xl font-extrabold text-gray-900">No encontramos esta página.</h1>
      <Link href="/" className="mt-6 inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700">
        Volver al feed
      </Link>
    </div>
  );
}
