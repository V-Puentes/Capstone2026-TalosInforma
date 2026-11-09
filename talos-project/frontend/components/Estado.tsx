"use client";

/* Estados comunes de las vistas: carga, demora del servidor, error y vacío */
export function Cargando({ lento, filas = 3 }: { lento?: boolean; filas?: number }) {
  return (
    <div aria-busy="true" aria-live="polite">
      {lento && (
        <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Estamos despertando el servidor; la primera carga puede tardar hasta un minuto.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: filas * 2 }).map((_, i) => (
          <div key={i} className="h-44 animate-pulse rounded-xl border border-gray-200 bg-white" />
        ))}
      </div>
    </div>
  );
}

export function ErrorCarga({ onReintentar, mensaje }: { onReintentar: () => void; mensaje?: string }) {
  return (
    <div role="alert" className="rounded-xl border border-rose-200 bg-white p-8 text-center">
      <p className="font-semibold text-gray-900">No pudimos conectar con Talos.</p>
      <p className="mt-1 text-sm text-gray-600">{mensaje ?? "El servidor no respondió. Puede estar iniciando; inténtalo de nuevo en unos segundos."}</p>
      <button
        type="button"
        onClick={onReintentar}
        className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
      >
        Reintentar
      </button>
    </div>
  );
}

export function Vacio({ texto }: { texto: string }) {
  return <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">{texto}</div>;
}
