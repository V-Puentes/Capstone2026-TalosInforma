"use client";

import { useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import EventCard from "@/components/EventCard";
import { Cargando, ErrorCarga, Vacio } from "@/components/Estado";

const POR_PAGINA = 12;

export default function FeedPage() {
  const { datos, error, lento, cargando, reintentar } = useApi(() => api.feed(), "feed");
  const [categoria, setCategoria] = useState<string | null>(null);
  const [soloVarios, setSoloVarios] = useState(false);
  const [visibles, setVisibles] = useState(POR_PAGINA);

  const eventos = useMemo(() => datos ?? [], [datos]);
  const categorias = useMemo(
    () => Array.from(new Set(eventos.map((e) => e.categoria).filter((c): c is string => !!c))).sort(),
    [eventos],
  );
  const filtrados = useMemo(
    () => eventos.filter((e) => (!categoria || e.categoria === categoria) && (!soloVarios || e.n_medios > 1)),
    [eventos, categoria, soloVarios],
  );
  const conVarios = eventos.filter((e) => e.n_medios > 1).length;
  const noticias = eventos.reduce((s, e) => s + e.n_articulos, 0);

  function filtrar(c: string | null) {
    setCategoria(c);
    setVisibles(POR_PAGINA);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <section className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Un mismo hecho, distintas coberturas</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Talos agrupa las noticias de diez medios chilenos por hecho y muestra cómo se reparte su cobertura entre medios de
          izquierda, centro y derecha. Elige un hecho para comparar sus titulares, su tono y su subjetividad.
        </p>
        {datos && (
          <dl className="mt-5 grid grid-cols-3 gap-3 sm:max-w-lg">
            {[
              ["Hechos", eventos.length],
              ["Noticias", noticias],
              ["Con varios medios", conVarios],
            ].map(([t, v]) => (
              <div key={t} className="rounded-xl border border-gray-200 bg-white p-3">
                <dt className="text-xs text-gray-500">{t}</dt>
                <dd className="text-2xl font-bold text-gray-900">{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      {datos && eventos.length > 0 && (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
            {[null, ...categorias].map((c) => (
              <button
                key={c ?? "todas"}
                type="button"
                aria-pressed={categoria === c}
                onClick={() => filtrar(c)}
                className={`rounded-full border px-3 py-1 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 ${
                  categoria === c ? "border-gray-900 bg-gray-900 text-white" : "border-gray-300 bg-white text-gray-700 hover:border-gray-500"
                }`}
              >
                {c ?? "Todas"}
              </button>
            ))}
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={soloVarios}
              onChange={(e) => {
                setSoloVarios(e.target.checked);
                setVisibles(POR_PAGINA);
              }}
              className="h-4 w-4 accent-gray-900"
            />
            Solo hechos cubiertos por más de un medio
          </label>
        </div>
      )}

      {cargando && <Cargando lento={lento} />}
      {error && <ErrorCarga onReintentar={reintentar} />}
      {datos && eventos.length === 0 && <Vacio texto="Todavía no hay hechos recolectados en este período." />}
      {datos && eventos.length > 0 && filtrados.length === 0 && <Vacio texto="No hay hechos para este filtro." />}

      {filtrados.length > 0 && (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtrados.slice(0, visibles).map((e) => (
              <EventCard key={e.id} evento={e} />
            ))}
          </div>
          {visibles < filtrados.length && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setVisibles((v) => v + POR_PAGINA)}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-800 hover:border-gray-500"
              >
                Cargar más ({filtrados.length - visibles} restantes)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
