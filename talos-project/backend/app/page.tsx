"use client";
import { useState, useEffect } from "react";
import { Scale, Newspaper, Calendar, Layers, BarChart3, AlertCircle } from "lucide-react";

interface Bias { left: number; center: number; right: number; }
interface EventoFeed {
  id: number;
  titulo_neutro: string;
  categoria: string;
  fecha: string;
  n_articulos: number;
  imagen_url: string;
  bias: Bias;
  subjetividad_promedio: number;
}

const COLORS = { left: "#2F5D8C", center: "#8A9199", right: "#B0472F" };

export default function TalosFrontend() {
  const [eventos, setEventos] = useState<EventoFeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/events/feed")
      .then((res) => {
        if (!res.ok) throw new Error("Error en la respuesta del servidor");
        return res.json();
      })
      .then((data) => {
        setEventos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudo conectar con el Backend. Verifica que Uvicorn esté corriendo.");
        setLoading(false);
      });
  }, []);

  const BiasBar = ({ bias }: { bias: Bias }) => (
    <div className="flex w-full h-2.5 overflow-hidden rounded-sm mt-3">
      <div style={{ width: `${bias.left}%`, background: COLORS.left }} />
      <div style={{ width: `${bias.center}%`, background: COLORS.center }} />
      <div style={{ width: `${bias.right}%`, background: COLORS.right }} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
      <header className="bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <div className="flex items-center gap-2 text-white">
            <Scale size={22} />
            <span className="text-xl tracking-wide font-semibold">Talos</span>
          </div>
          <nav className="flex gap-1 ml-auto">
            <button className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm bg-white/15 text-white">
              <Layers size={15} /> Eventos
            </button>
            <button className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm text-slate-300 hover:text-white">
              <BarChart3 size={15} /> Estadísticas
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        {loading && <p className="text-center text-slate-500 mt-10">Cargando datos desde la API...</p>}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-center gap-3">
            <AlertCircle size={20} /> <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {eventos.map((e) => (
              <article key={e.id} className="rounded-md border border-slate-300 bg-white text-left overflow-hidden transition hover:border-slate-500 hover:shadow-sm">
                <div className="h-40 w-full bg-slate-200">
                  <img 
                    src={e.imagen_url || "/images/placeholder.jpg"} 
                    alt="Cobertura" 
                    className="h-full w-full object-cover" 
                    onError={(ev) => (ev.currentTarget.style.display = 'none')}
                  />
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center gap-3 text-xs text-slate-500">
                    <span className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-700">{e.categoria}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> {e.fecha}</span>
                  </div>
                  <h3 className="mb-2 font-serif text-lg leading-snug text-slate-900">{e.titulo_neutro}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                    <Newspaper size={12} /> {e.n_articulos} artículos agrupados
                  </p>
                  <BiasBar bias={e.bias} />
                  <div className="mt-1.5 flex justify-between text-[10px] text-slate-500">
                    <span>Izq {e.bias.left}%</span>
                    <span>Cen {e.bias.center}%</span>
                    <span>Der {e.bias.right}%</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}