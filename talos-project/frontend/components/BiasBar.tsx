import Link from "next/link";
import type { Bias } from "@/lib/types";
import { FONDO, NOMBRE, ORIENTACIONES } from "@/lib/orientacion";

const CLAVE = { Left: "left", Center: "center", Right: "right" } as const;

export default function BiasBar({ bias, grande = false, ayuda = false }: { bias: Bias; grande?: boolean; ayuda?: boolean }) {
  const partes = ORIENTACIONES.filter((o) => bias[CLAVE[o]] > 0);
  const descripcion = partes.map((o) => `${NOMBRE[o]} ${bias[CLAVE[o]]} %`).join(", ");
  const ausentes = ORIENTACIONES.filter((o) => bias[CLAVE[o]] === 0);
  return (
    <div>
      <div
        className={`flex w-full overflow-hidden rounded-full bg-gray-100 ${grande ? "h-4" : "h-2.5"}`}
        role="img"
        aria-label={`Cobertura por orientación: ${descripcion || "sin datos"}`}
      >
        {partes.map((o) => (
          <div key={o} className={FONDO[o]} style={{ width: `${bias[CLAVE[o]]}%` }} />
        ))}
      </div>
      <div className={`mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 ${grande ? "text-sm" : "text-xs"} text-gray-600`}>
        {ORIENTACIONES.map((o) => (
          <span key={o} className={`inline-flex items-center gap-1 ${bias[CLAVE[o]] === 0 ? "opacity-50" : ""}`}>
            <span className={`inline-block h-2 w-2 rounded-full ${FONDO[o]}`} aria-hidden="true" />
            {NOMBRE[o]} {bias[CLAVE[o]]} %
          </span>
        ))}
        {ayuda && (
          <Link href="/como-leer" className="underline underline-offset-2 hover:text-gray-900">
            ¿Cómo se lee?
          </Link>
        )}
      </div>
      {grande && partes.length === 1 && (
        <p className="mt-2 text-sm text-gray-700">
          Solo medios de {NOMBRE[partes[0]].toLowerCase()} cubrieron este hecho. Ningún medio de{" "}
          {ausentes.map((o) => NOMBRE[o].toLowerCase()).join(" ni de ")} lo publicó en el período recolectado.
        </p>
      )}
    </div>
  );
}
