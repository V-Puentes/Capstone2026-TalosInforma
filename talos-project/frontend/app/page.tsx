import React, { Suspense } from 'react';
import { connection } from 'next/server';

interface Bias {
  left: number;
  center: number;
  right: number;
}

interface Evento {
  id: string;
  titulo_neutro: string;
  categoria: string;
  fecha: string;
  n_articulos: number;
  n_medios: number;
  imagen_url?: string;
  imagen_medio?: string;
  destacado?: string;
  bias?: Bias;
  subjetividad_promedio?: number;
}

async function getEvents(): Promise<Evento[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  try {
    const res = await fetch(`${baseUrl}/events/feed`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    return [];
  }
}

async function EventFeed() {
  await connection();
  const events = await getEvents();

  if (events.length === 0) {
    return (
      <div className="p-8 bg-white border border-gray-200 rounded-xl text-center text-gray-500 shadow-sm">
        No se encontraron eventos activos en el feed o la API no está disponible.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {events.map((evento) => (
        <article key={evento.id} className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {evento.categoria || 'Noticias'}
            </span>
            <span className="text-xs text-gray-400">
              {evento.fecha ? new Date(evento.fecha).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
            </span>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-3 leading-snug">
            {evento.titulo_neutro}
          </h2>

          {evento.destacado && (
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {evento.destacado}
            </p>
          )}

          {evento.imagen_url && (
            <div className="mb-4 overflow-hidden rounded-lg border border-gray-100 max-h-80 bg-gray-50">
              <img src={evento.imagen_url} alt={evento.titulo_neutro} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-600 gap-4">
            <div className="flex items-center gap-3">
              {evento.imagen_medio && (
                <span className="font-medium text-gray-700">Medio: <strong className="text-gray-900">{evento.imagen_medio}</strong></span>
              )}
              {evento.subjetividad_promedio !== undefined && (
                <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                  Subjetividad: {evento.subjetividad_promedio} / 5
                </span>
              )}
            </div>

            {evento.bias && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium">Sesgo:</span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-100">Izq: {evento.bias.left}%</span>
                <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-semibold border border-gray-200">Centro: {evento.bias.center}%</span>
                <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 font-semibold border border-red-100">Der: {evento.bias.right}%</span>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans p-6 md:p-12">
      <header className="max-w-4xl mx-auto mb-8 pb-4 border-b border-gray-200 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Talos Informa</h1>
          <p className="text-gray-500 text-sm mt-1">Plataforma de Análisis de Prensa e Integración NLP</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        <Suspense fallback={
          <div className="p-8 bg-white border border-gray-200 rounded-xl text-center text-gray-400 animate-pulse shadow-sm">
            Cargando feed de eventos...
          </div>
        }>
          <EventFeed />
        </Suspense>
      </div>
    </main>
  );
}
