import Link from "next/link";
import { Suspense } from "react";
import Nav from "./Nav";
import NavActiva from "./NavActiva";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link href="/" className="group">
          <span className="block text-2xl font-extrabold tracking-tight text-gray-900 group-hover:text-gray-700">Talos Informa</span>
          <span className="block text-xs text-gray-500">Análisis comparativo de sesgo editorial en la prensa chilena</span>
        </Link>
        <Suspense fallback={<Nav ruta={null} />}>
          <NavActiva />
        </Suspense>
      </div>
    </header>
  );
}
