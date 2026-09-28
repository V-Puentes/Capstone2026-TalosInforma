import { useState, useRef } from "react";
import {
  Scale, Info, ArrowLeft, ChevronLeft, ChevronRight, BarChart3,
  Newspaper, Layers, Gauge, Calendar,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

/* ───────────── Paleta y datos simulados ───────────── */
const COLORS = { left: "#2F5D8C", center: "#8A9199", right: "#B0472F" };
const LABELS = { left: "Izquierda", center: "Centro", right: "Derecha" };

const CATEGORIAS = ["Todas", "Política", "Economía", "Seguridad", "Sociedad"];

const EVENTOS = [
  {
    id: 1,
    titulo_neutro: "Discusión legislativa sobre la reforma de pensiones",
    categoria: "Economía",
    fecha: "2026-09-24",
    destacado: true,
    bias: { left: 45, center: 20, right: 35 },
    subjetividad: { left: 68, center: 31, right: 62 },
    n_articulos: 27,
    analisis: {
      left: {
        tono: "Crítico hacia el sistema privado",
        tono_score: -0.42,
        resumen: [
          "Enfatiza el impacto en las pensiones de mujeres y de la clase media.",
          "Cuestiona el rol de las administradoras privadas.",
          "Destaca el aporte estatal como condición para la viabilidad.",
        ],
      },
      center: {
        tono: "Descriptivo y procedimental",
        tono_score: 0.05,
        resumen: [
          "Detalla el calendario de votación y los quórums requeridos.",
          "Presenta cifras de cotización y costo fiscal sin valorarlas.",
          "Recoge posiciones de ambos bloques con extensión similar.",
        ],
      },
      right: {
        tono: "Cauteloso ante el costo fiscal",
        tono_score: -0.18,
        resumen: [
          "Advierte sobre el efecto en el empleo formal y el gasto público.",
          "Defiende la propiedad de los fondos individuales.",
          "Propone gradualidad y mayor competencia entre administradoras.",
        ],
      },
    },
  },
  {
    id: 2,
    titulo_neutro: "Operativo policial en la zona sur del país",
    categoria: "Seguridad",
    fecha: "2026-09-22",
    destacado: true,
    bias: { left: 22, center: 28, right: 50 },
    subjetividad: { left: 59, center: 27, right: 71 },
    n_articulos: 19,
    analisis: {
      left: {
        tono: "Preocupación por derechos y proporcionalidad",
        tono_score: -0.51,
        resumen: [
          "Pone el foco en comunidades afectadas y denuncias de exceso de fuerza.",
          "Pide contexto histórico y salidas políticas al conflicto.",
          "Cita organizaciones de derechos humanos como fuente principal.",
        ],
      },
      center: {
        tono: "Factual, basado en comunicados",
        tono_score: -0.04,
        resumen: [
          "Reproduce partes oficiales y declaraciones de las autoridades.",
          "Informa número de detenidos y decomisos.",
          "Incluye una reacción de la contraparte sin comentario editorial.",
        ],
      },
      right: {
        tono: "Respaldo a la acción policial",
        tono_score: 0.33,
        resumen: [
          "Presenta el operativo como restitución del orden público.",
          "Subraya el daño a víctimas civiles y a la propiedad.",
          "Exige mayor dotación y respaldo jurídico a las policías.",
        ],
      },
    },
  },
  {
    id: 3,
    titulo_neutro: "Debate presupuestario para salud y educación 2027",
    categoria: "Política",
    fecha: "2026-09-19",
    destacado: false,
    bias: { left: 38, center: 41, right: 21 },
    subjetividad: { left: 55, center: 24, right: 49 },
    n_articulos: 14,
    analisis: {
      left: {
        tono: "Favorable a mayor gasto social",
        tono_score: 0.27,
        resumen: [
          "Valora el aumento propuesto para la atención primaria.",
          "Reclama que el reajuste no cubre listas de espera.",
          "Contrasta la propuesta con demandas de gremios.",
        ],
      },
      center: {
        tono: "Informativo, orientado a cifras",
        tono_score: 0.02,
        resumen: [
          "Compara asignaciones respecto del año anterior.",
          "Explica los plazos de tramitación en comisión mixta.",
          "Sintetiza posiciones de la oposición y del oficialismo.",
        ],
      },
      right: {
        tono: "Escéptico sobre eficiencia del gasto",
        tono_score: -0.22,
        resumen: [
          "Pide evaluación de resultados antes de ampliar recursos.",
          "Cuestiona la sostenibilidad de compromisos permanentes.",
          "Sugiere priorizar inversión y gestión hospitalaria.",
        ],
      },
    },
  },
  {
    id: 4,
    titulo_neutro: "Alza en el precio de los combustibles esta semana",
    categoria: "Economía",
    fecha: "2026-09-17",
    destacado: true,
    bias: { left: 30, center: 44, right: 26 },
    subjetividad: { left: 47, center: 21, right: 44 },
    n_articulos: 22,
    analisis: {
      left: {
        tono: "Alerta por efecto en hogares",
        tono_score: -0.36,
        resumen: [
          "Vincula el alza con el costo del transporte y los alimentos.",
          "Cuestiona el mecanismo de estabilización de precios.",
          "Pide subsidios focalizados.",
        ],
      },
      center: {
        tono: "Neutro y explicativo",
        tono_score: 0.0,
        resumen: [
          "Explica la relación con el precio internacional del crudo.",
          "Entrega la variación por tipo de combustible.",
          "Resume el calendario de ajustes semanales.",
        ],
      },
      right: {
        tono: "Énfasis en factores de mercado",
        tono_score: -0.1,
        resumen: [
          "Atribuye el alza a la volatilidad externa y al tipo de cambio.",
          "Rechaza controles de precios como respuesta.",
          "Sugiere revisar la carga tributaria específica.",
        ],
      },
    },
  },
];

// Medios ficticios: solo para ilustrar la vista de estadísticas
const MEDIOS = [
  { medio: "Diario Austral", orientacion: "left", subjetividad: 66 },
  { medio: "La Crónica Sur", orientacion: "left", subjetividad: 58 },
  { medio: "Noticiero Central", orientacion: "center", subjetividad: 26 },
  { medio: "Agencia Nacional", orientacion: "center", subjetividad: 19 },
  { medio: "El Observador", orientacion: "right", subjetividad: 61 },
  { medio: "Mercurio Andino", orientacion: "right", subjetividad: 54 },
];

const fmtFecha = (iso) =>
  new Date(iso + "T12:00:00").toLocaleDateString("es-CL", {
    day: "numeric", month: "short", year: "numeric",
  });

/* ───────────── Componentes ───────────── */
function BiasBar({ bias, height = "h-2.5", showLegend = false }) {
  return (
    <div>
      <div
        className={`flex w-full overflow-hidden rounded-sm ${height}`}
        role="img"
        aria-label={`Cobertura: izquierda ${bias.left}%, centro ${bias.center}%, derecha ${bias.right}%`}
      >
        {["left", "center", "right"].map((k) => (
          <div key={k} style={{ width: `${bias[k]}%`, background: COLORS[k] }} />
        ))}
      </div>
      {showLegend && (
        <div className="mt-1.5 flex justify-between text-xs text-slate-600">
          {["left", "center", "right"].map((k) => (
            <span key={k} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: COLORS[k] }} />
              {LABELS[k]} {bias[k]}%
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function EventCard({ evento, onOpen }) {
  return (
    <button
      onClick={() => onOpen(evento.id)}
      className="group w-full rounded-md border border-slate-300 bg-white p-4 text-left transition hover:border-slate-500 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700"
    >
      <div className="mb-2 flex items-center gap-3 text-xs text-slate-500">
        <span className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
          {evento.categoria}
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={12} /> {fmtFecha(evento.fecha)}
        </span>
        <span className="ml-auto flex items-center gap-1">
          <Newspaper size={12} /> {evento.n_articulos} artículos
        </span>
      </div>
      <h3 className="mb-3 font-serif text-lg leading-snug text-slate-900 group-hover:underline">
        {evento.titulo_neutro}
      </h3>
      <BiasBar bias={evento.bias} showLegend />
    </button>
  );
}

function Carousel({ items, onOpen }) {
  const ref = useRef(null);
  const scroll = (d) => ref.current?.scrollBy({ left: d * 280, behavior: "smooth" });
  if (!items.length) return null;
  return (
    <div className="relative">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800">Hechos destacados</h2>
        <div className="flex gap-1">
          <button aria-label="Anterior" onClick={() => scroll(-1)} className="rounded border border-slate-300 p-1 hover:bg-slate-100"><ChevronLeft size={16} /></button>
          <button aria-label="Siguiente" onClick={() => scroll(1)} className="rounded border border-slate-300 p-1 hover:bg-slate-100"><ChevronRight size={16} /></button>
        </div>
      </div>
      <div ref={ref} className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "thin" }}>
        {items.map((e) => (
          <button
            key={e.id}
            onClick={() => onOpen(e.id)}
            className="w-64 shrink-0 rounded-md border border-slate-300 bg-slate-50 p-3 text-left hover:border-slate-500"
          >
            <p className="mb-2 line-clamp-2 text-sm font-medium text-slate-900">{e.titulo_neutro}</p>
            <BiasBar bias={e.bias} height="h-1.5" />
          </button>
        ))}
      </div>
    </div>
  );
}

function FilterBar({ categoria, setCategoria, destacados, onOpen }) {
  return (
    <section className="space-y-4 border-b border-slate-300 pb-5">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrar por categoría">
        {CATEGORIAS.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={categoria === c}
            onClick={() => setCategoria(c)}
            className={`rounded-full border px-3 py-1 text-sm transition ${
              categoria === c
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:border-slate-500"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <Carousel items={destacados} onOpen={onOpen} />
    </section>
  );
}

function ToneMeter({ score }) {
  const pos = ((score + 1) / 2) * 100;
  return (
    <div>
      <div className="relative h-1.5 rounded bg-gradient-to-r from-slate-300 via-slate-200 to-slate-300">
        <div className="absolute top-1/2 h-3.5 w-1 -translate-y-1/2 rounded bg-slate-900" style={{ left: `calc(${pos}% - 2px)` }} />
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-slate-500">
        <span>Negativo</span><span>Neutro</span><span>Positivo</span>
      </div>
    </div>
  );
}

function Column({ k, data, subj, className = "" }) {
  return (
    <article className={`rounded-md border border-slate-300 bg-white ${className}`}>
      <header className="flex items-center justify-between border-b-4 px-4 py-3" style={{ borderColor: COLORS[k] }}>
        <h3 className="font-semibold text-slate-900">Cobertura {LABELS[k].toLowerCase()}</h3>
        <span className="flex items-center gap-1 text-xs text-slate-600">
          <Gauge size={14} /> Subjetividad {subj}%
        </span>
      </header>
      <div className="space-y-4 p-4">
        <div>
          <p className="mb-1 text-xs text-slate-500">Tono predominante</p>
          <p className="mb-2 text-sm font-medium text-slate-900">{data.tono}</p>
          <ToneMeter score={data.tono_score} />
        </div>
        <div>
          <p className="mb-1 text-xs text-slate-500">Resumen generado por NLP</p>
          <ul className="list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-slate-800">
            {data.resumen.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      </div>
    </article>
  );
}

function Detail({ evento, onBack }) {
  const [tab, setTab] = useState("left");
  const subjData = ["left", "center", "right"].map((k) => ({
    name: LABELS[k], value: evento.subjetividad[k], k,
  }));
  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900">
        <ArrowLeft size={16} /> Volver al feed
      </button>

      <div>
        <div className="mb-2 flex items-center gap-3 text-xs text-slate-500">
          <span className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-700">{evento.categoria}</span>
          <span>{fmtFecha(evento.fecha)}</span>
          <span>{evento.n_articulos} artículos agrupados</span>
        </div>
        <h1 className="mb-4 font-serif text-2xl leading-tight text-slate-900 sm:text-3xl">{evento.titulo_neutro}</h1>
        <div className="max-w-xl"><BiasBar bias={evento.bias} height="h-3" showLegend /></div>
      </div>

      {/* Pestañas en móvil */}
      <div className="flex gap-1 border-b border-slate-300 lg:hidden" role="tablist">
        {["left", "center", "right"].map((k) => (
          <button
            key={k}
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={`-mb-px flex-1 border-b-2 px-3 py-2 text-sm ${
              tab === k ? "font-semibold text-slate-900" : "border-transparent text-slate-500"
            }`}
            style={tab === k ? { borderColor: COLORS[k] } : {}}
          >
            {LABELS[k]}
          </button>
        ))}
      </div>

      {/* Tres columnas en escritorio */}
      <div className="grid gap-4 lg:grid-cols-3">
        {["left", "center", "right"].map((k) => (
          <Column
            key={k}
            k={k}
            data={evento.analisis[k]}
            subj={evento.subjetividad[k]}
            className={tab === k ? "" : "hidden lg:block"}
          />
        ))}
      </div>

      <section className="rounded-md border border-slate-300 bg-white p-4">
        <h2 className="mb-1 text-sm font-semibold text-slate-800">Índice de subjetividad por orientación</h2>
        <p className="mb-3 text-xs text-slate-500">0% = lenguaje factual · 100% = lenguaje altamente valorativo (dato simulado)</p>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={70} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                {subjData.map((d) => <Cell key={d.k} fill={COLORS[d.k]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

function Stats() {
  const global = ["left", "center", "right"].map((k) => ({
    name: LABELS[k], k,
    value: Math.round(EVENTOS.reduce((s, e) => s + e.bias[k], 0) / EVENTOS.length),
  }));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-slate-900">Estadísticas por medio</h1>
        <p className="text-sm text-slate-600">Vista simulada con medios ficticios para ilustrar el concepto.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        <section className="rounded-md border border-slate-300 bg-white p-4 lg:col-span-3">
          <h2 className="mb-3 text-sm font-semibold text-slate-800">Subjetividad promedio por medio</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MEDIOS} margin={{ left: -10 }}>
                <CartesianGrid vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="medio" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={60} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
                <Tooltip formatter={(v) => `${v}%`} />
                <Bar dataKey="subjetividad" name="Subjetividad" radius={[3, 3, 0, 0]}>
                  {MEDIOS.map((m) => <Cell key={m.medio} fill={COLORS[m.orientacion]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="rounded-md border border-slate-300 bg-white p-4 lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold text-slate-800">Distribución global de cobertura</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={global} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {global.map((g) => <Cell key={g.k} fill={COLORS[g.k]} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ───────────── App ───────────── */
export default function Talos() {
  const [view, setView] = useState("home"); // home | detail | stats
  const [selectedId, setSelectedId] = useState(null);
  const [categoria, setCategoria] = useState("Todas");

  const abrir = (id) => { setSelectedId(id); setView("detail"); window.scrollTo?.(0, 0); };
  const filtrados = EVENTOS.filter((e) => categoria === "Todas" || e.categoria === categoria);
  const destacados = EVENTOS.filter((e) => e.destacado && (categoria === "Todas" || e.categoria === categoria));
  const seleccionado = EVENTOS.find((e) => e.id === selectedId);

  const navBtn = (id, label, Icon) => (
    <button
      onClick={() => setView(id)}
      className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-sm ${
        (view === id || (id === "home" && view === "detail")) ? "bg-white/15 text-white" : "text-slate-300 hover:text-white"
      }`}
    >
      <Icon size={15} /> {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-slate-900">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
          <button onClick={() => setView("home")} className="flex items-center gap-2 text-white">
            <Scale size={22} />
            <span className="font-serif text-xl tracking-wide">Talos</span>
          </button>
          <nav className="flex gap-1">
            {navBtn("home", "Eventos", Layers)}
            {navBtn("stats", "Estadísticas", BarChart3)}
          </nav>
        </div>
        <div className="border-t border-white/10 bg-slate-800">
          <p className="mx-auto flex max-w-6xl items-start gap-2 px-4 py-2 text-xs leading-relaxed text-slate-300">
            <Info size={14} className="mt-0.5 shrink-0" />
            Talos es una herramienta analítica: mide cómo cada línea editorial cubre un mismo hecho. No califica la veracidad de las noticias ni recomienda medios. Prototipo con datos simulados.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-5 px-4 py-6">
        {view === "home" && (
          <>
            <FilterBar categoria={categoria} setCategoria={setCategoria} destacados={destacados} onOpen={abrir} />
            <div className="grid gap-3 md:grid-cols-2">
              {filtrados.map((e) => <EventCard key={e.id} evento={e} onOpen={abrir} />)}
            </div>
            {!filtrados.length && (
              <p className="rounded border border-dashed border-slate-400 p-6 text-center text-sm text-slate-600">
                No hay eventos en esta categoría. Elige otra para ver más cobertura.
              </p>
            )}
          </>
        )}
        {view === "detail" && seleccionado && <Detail evento={seleccionado} onBack={() => setView("home")} />}
        {view === "stats" && <Stats />}
      </main>
    </div>
  );
}
