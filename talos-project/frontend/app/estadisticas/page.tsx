"use client";

import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { FONDO, HEX, NOMBRE, ORIENTACIONES } from "@/lib/orientacion";
import { Cargando, ErrorCarga, Vacio } from "@/components/Estado";

const ORDEN = { Left: 0, Center: 1, Right: 2 } as const;

export default function EstadisticasPage() {
  const { datos, error, lento, cargando, reintentar } = useApi(() => api.medios(), "medios");
  const medios = [...(datos ?? [])].sort(
    (a, b) => ORDEN[a.sesgo_politico] - ORDEN[b.sesgo_politico] || a.nombre.localeCompare(b.nombre),
  );
  const conDatos = medios.filter((m) => m.n_noticias > 0);
  const subjetividad = conDatos
    .filter((m) => m.subjetividad_promedio !== null)
    .map((m) => ({ nombre: m.nombre, valor: Number((m.subjetividad_promedio ?? 0).toFixed(1)), sesgo: m.sesgo_politico }));
  const tonos = conDatos.map((m) => ({
    nombre: m.nombre,
    Positivo: m.tonos.Positivo ?? 0,
    Neutral: m.tonos.Neutral ?? 0,
    Negativo: m.tonos.Negativo ?? 0,
  }));
  const total = medios.reduce((s, m) => s + m.n_noticias, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Estadísticas por medio</h1>
      <p className="mt-2 max-w-2xl text-gray-600">
        Cuántas noticias aportó cada medio, qué tan subjetivos son sus textos en promedio y cómo se distribuye el tono de sus
        titulares. Los colores indican la orientación asignada a cada medio.
      </p>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-600">
        {ORIENTACIONES.map((o) => (
          <span key={o} className="inline-flex items-center gap-1">
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${FONDO[o]}`} aria-hidden="true" />
            {NOMBRE[o]}
          </span>
        ))}
      </div>

      <div className="mt-6">
        {cargando && <Cargando lento={lento} filas={1} />}
        {error && <ErrorCarga onReintentar={reintentar} />}
        {datos && total === 0 && <Vacio texto="Todavía no hay noticias analizadas." />}
      </div>

      {datos && total > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="font-bold text-gray-900">Subjetividad promedio (1 a 10)</h2>
            <p className="text-xs text-gray-500">Más alto significa más adjetivos y juicios de valor en el texto.</p>
            <div className="mt-4 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjetividad} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} />
                  <YAxis type="category" dataKey="nombre" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => [`${v} / 10`, "Subjetividad"]} />
                  <Bar dataKey="valor" radius={[0, 4, 4, 0]}>
                    {subjetividad.map((d) => (
                      <Cell key={d.nombre} fill={HEX[d.sesgo]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="font-bold text-gray-900">Tono de los titulares</h2>
            <p className="text-xs text-gray-500">Número de titulares positivos, neutrales y negativos por medio.</p>
            <div className="mt-4 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tonos} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis type="category" dataKey="nombre" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Positivo" stackId="t" fill="#059669" />
                  <Bar dataKey="Neutral" stackId="t" fill="#9ca3af" />
                  <Bar dataKey="Negativo" stackId="t" fill="#be123c" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5 lg:col-span-2">
            <h2 className="font-bold text-gray-900">Medios monitoreados</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="py-2 pr-4">Medio</th>
                    <th className="py-2 pr-4">Orientación</th>
                    <th className="py-2 pr-4 text-right">Noticias</th>
                    <th className="py-2 text-right">Subjetividad promedio</th>
                  </tr>
                </thead>
                <tbody>
                  {medios.map((m) => (
                    <tr key={m.medio_id} className="border-b border-gray-100 last:border-0">
                      <td className="py-2 pr-4 font-medium text-gray-900">{m.nombre}</td>
                      <td className="py-2 pr-4">
                        <span className="inline-flex items-center gap-1.5">
                          <span className={`inline-block h-2.5 w-2.5 rounded-full ${FONDO[m.sesgo_politico]}`} aria-hidden="true" />
                          {NOMBRE[m.sesgo_politico]}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-right tabular-nums">{m.n_noticias}</td>
                      <td className="py-2 text-right tabular-nums">
                        {m.subjetividad_promedio !== null ? m.subjetividad_promedio.toFixed(1) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
