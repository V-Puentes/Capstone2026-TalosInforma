"use client";

import Link from "next/link";
import { useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import type { NoticiaDetalle, Orientacion } from "@/lib/types";
import { BORDE, FONDO, NOMBRE, ORIENTACIONES, SUAVE, TEXTO, formatoFecha } from "@/lib/orientacion";
import BiasBar from "@/components/BiasBar";
import ReportModal from "@/components/ReportModal";
import { Cargando, ErrorCarga } from "@/components/Estado";

const TONO: Record<string, string> = {
  Positivo: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Neutral: "bg-gray-50 text-gray-700 border-gray-200",
  Negativo: "bg-rose-50 text-rose-800 border-rose-200",
};

function Subjetividad({ valor }: { valor: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span>Subjetividad</span>
        <span className="font-semibold text-gray-900">{valor} / 10</span>
      </div>
      <div className="mt-1 flex gap-0.5" role="img" aria-label={`Subjetividad ${valor} de 10`}>
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className={`h-1.5 flex-1 rounded-sm ${i < valor ? "bg-gray-800" : "bg-gray-200"}`} />
        ))}
      </div>
    </div>
  );
}

function TarjetaNoticia({ n, onReportar }: { n: NoticiaDetalle; onReportar: (n: NoticiaDetalle) => void }) {
  const a = n.analisis;
  return (
    <article className={`rounded-xl border bg-white p-4 shadow-sm ${BORDE[n.sesgo_politico]}`}>
      <p className={`text-xs font-bold uppercase tracking-wide ${TEXTO[n.sesgo_politico]}`}>{n.medio_nombre}</p>
      <h3 className="mt-1 font-semibold leading-snug text-gray-900">{n.titulo_original}</h3>
      {n.autor && <p className="mt-1 text-xs text-gray-500">Por {n.autor}</p>}
      {a ? (
        <div className="mt-3 space-y-3">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className={`rounded-full border px-2 py-0.5 font-medium ${TONO[a.tono_titular] ?? TONO.Neutral}`}>
              Tono del titular: {a.tono_titular}
            </span>
            <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-gray-700">{a.categoria}</span>
          </div>
          <Subjetividad valor={a.subjetividad_score} />
          {a.resumen_puntos.length > 0 && (
            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
              {a.resumen_puntos.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <p className="mt-3 text-sm text-gray-500">Análisis pendiente.</p>
      )}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-sm">
        <a
          href={n.url_noticia}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-gray-900 underline-offset-2 hover:underline"
        >
          Leer en {n.medio_nombre} ↗
        </a>
        <button type="button" onClick={() => onReportar(n)} className="text-xs text-gray-500 hover:text-gray-900 hover:underline">
          Reportar error
        </button>
      </div>
    </article>
  );
}

export default function DetalleEvento({ id }: { id: string }) {
  const { datos, error, lento, cargando, reintentar } = useApi(() => api.evento(id), id);
  const [reportando, setReportando] = useState<NoticiaDetalle | null>(null);

  if (error instanceof ApiError && error.status === 404) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900">Este hecho no existe o ya no está disponible.</h1>
        <Link href="/" className="mt-4 inline-block font-semibold text-gray-900 underline">Volver al feed</Link>
      </div>
    );
  }

  const porOrientacion = (o: Orientacion) => (datos?.noticias ?? []).filter((n) => n.sesgo_politico === o);
  const medios = new Set((datos?.noticias ?? []).map((n) => n.medio_id)).size;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">← Volver al feed</Link>
      {cargando && <div className="mt-6"><Cargando lento={lento} filas={1} /></div>}
      {error && <div className="mt-6"><ErrorCarga onReintentar={reintentar} /></div>}
      {datos && (
        <>
          <header className="mt-4 rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">{formatoFecha(datos.fecha)}</p>
            <h1 className="mt-1 text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl">{datos.titulo_neutro}</h1>
            <p className="mt-2 text-sm text-gray-600">
              {datos.noticias.length} {datos.noticias.length === 1 ? "noticia" : "noticias"} de {medios}{" "}
              {medios === 1 ? "medio" : "medios"}
            </p>
            <div className="mt-4">
              <BiasBar bias={datos.bias} grande ayuda />
            </div>
          </header>

          <section aria-label="Comparación por orientación editorial" className="mt-6 grid gap-5 lg:grid-cols-3">
            {ORIENTACIONES.map((o) => {
              const lista = porOrientacion(o);
              return (
                <div key={o} className={`rounded-2xl p-3 ${SUAVE[o]}`}>
                  <h2 className="mb-3 flex items-center gap-2 px-1 text-sm font-bold uppercase tracking-wide text-gray-800">
                    <span className={`inline-block h-3 w-3 rounded-full ${FONDO[o]}`} aria-hidden="true" />
                    {NOMBRE[o]}
                    <span className="font-normal normal-case text-gray-500">({lista.length})</span>
                  </h2>
                  {lista.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-gray-300 bg-white/60 p-4 text-sm text-gray-600">
                      Ningún medio de {NOMBRE[o].toLowerCase()} cubrió este hecho en el período recolectado. En Talos, esta
                      ausencia también es información.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {lista.map((n) => (
                        <TarjetaNoticia key={n.id} n={n} onReportar={setReportando} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        </>
      )}
      {reportando && (
        <ReportModal noticiaId={reportando.id} titulo={reportando.titulo_original} onCerrar={() => setReportando(null)} />
      )}
    </div>
  );
}
