import Link from "next/link";

const ENLACES = [
  { href: "/", texto: "Feed" },
  { href: "/estadisticas", texto: "Estadísticas" },
  { href: "/como-leer", texto: "Cómo leer Talos" },
];

export default function Nav({ ruta }: { ruta: string | null }) {
  return (
    <nav aria-label="Navegación principal" className="flex gap-1 text-sm">
      {ENLACES.map((e) => {
        const activo = ruta !== null && (e.href === "/" ? ruta === "/" || ruta.startsWith("/evento") : ruta.startsWith(e.href));
        return (
          <Link
            key={e.href}
            href={e.href}
            aria-current={activo ? "page" : undefined}
            className={`rounded-lg px-3 py-1.5 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 ${
              activo ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            {e.texto}
          </Link>
        );
      })}
    </nav>
  );
}
