import React from 'react';

interface Analisis {
  categoria?: string;
  tono_titular?: string;
  subjetividad_score?: number;
  resumen_puntos?: string[];
}

interface Noticia {
  id: number;
  titulo: string;
  url: string;
  medio_id: number;
  medio?: { nombre: string };
  analisis?: Analisis;
}

interface Evento {
  id: number;
  titulo: string;
  resumen?: string;
  noticias: Noticia[];
}

async function getEvents(): Promise<Evento[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  try {
    const res = await fetch(`${baseUrl}/events/feed`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Error conectando al backend:', error);
    return [];
  }
}

export default async function HomePage() {
  const events = await getEvents();

  return (
    <main className="min-h-screen p-8 bg-slate-900 text-white font-sans">
      <header className="max-w-5xl mx-auto mb-8 border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-bold text-blue-400">Talos Informa</h1>
        <p className="text-slate-400 text-sm mt-1">Plataforma de Análisis de Prensa e Integración NLP</p>
      </header>

      <div className="max-w-5xl mx-auto space-y-6">
        {events.length === 0 ? (
          <div className="p-6 bg-slate-800 rounded border border-slate-700 text-center text-slate-400">
            No se encontraron eventos activos en el feed o la API no está disponible.
          </div>
        ) : (
          events.map((evento) => (
            <div key={evento.id} className="p-6 bg-slate-800 rounded-lg border border-slate-700 shadow-md">
              <h2 className="text-xl font-bold text-white mb-2">{evento.titulo}</h2>
              {evento.resumen && <p className="text-sm text-slate-300 mb-4">{evento.resumen}</p>}
              
              <div className="space-y-3 mt-4">
                {evento.noticias?.map((noticia) => (
                  <div key={noticia.id} className="p-4 bg-slate-900 rounded border border-slate-700">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300">
                        {noticia.medio?.nombre || `Medio #${noticia.medio_id}`}
                      </span>
                      {noticia.analisis?.subjetividad_score !== undefined && (
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-amber-400/20">
                          Subjetividad: {noticia.analisis.subjetividad_score}/5
                        </span>
                      )}
                    </div>
                    <a href={noticia.url} target="_blank" rel="noreferrer" className="text-base font-medium text-slate-100 hover:text-blue-400 transition-colors">
                      {noticia.titulo}
                    </a>
                    {noticia.analisis?.resumen_puntos && (
                      <ul className="list-disc list-inside mt-2 text-xs text-slate-400 space-y-1">
                        {noticia.analisis.resumen_puntos.map((pt, idx) => (
                          <li key={idx}>{pt}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
