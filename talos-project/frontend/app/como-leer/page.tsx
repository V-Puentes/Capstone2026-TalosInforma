import type { Metadata } from "next";
import { FONDO, NOMBRE } from "@/lib/orientacion";
import type { Orientacion } from "@/lib/types";

export const metadata: Metadata = { title: "Cómo leer Talos" };

const MEDIOS: { nombre: string; o: Orientacion }[] = [
  { nombre: "El Ciudadano", o: "Left" },
  { nombre: "El Siglo", o: "Left" },
  { nombre: "Interferencia", o: "Left" },
  { nombre: "CNN Chile", o: "Center" },
  { nombre: "Publimetro", o: "Center" },
  { nombre: "Radio Cooperativa", o: "Center" },
  { nombre: "TVN", o: "Center" },
  { nombre: "El Líbero", o: "Right" },
  { nombre: "Emol", o: "Right" },
  { nombre: "Ex-Ante", o: "Right" },
];

function Bloque({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-bold text-gray-900">{titulo}</h2>
      <div className="mt-2 space-y-3 text-gray-700">{children}</div>
    </section>
  );
}

export default function ComoLeerPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Cómo leer Talos</h1>
      <p className="text-gray-600">
        Talos contrasta coberturas. No califica si un hecho es verdadero o falso, no recomienda medios y no escribe
        noticias: muestra cómo distintos medios contaron un mismo hecho para que tú formes tu propio juicio.
      </p>

      <Bloque titulo="Qué es un hecho">
        <p>
          Cada día Talos recolecta noticias públicas de diez medios nacionales y agrupa las que hablan de un mismo hecho
          comparando su vocabulario. Un hecho puede reunir noticias de uno o de varios medios.
        </p>
      </Bloque>

      <Bloque titulo="La barra de cobertura">
        <p>
          La barra de colores indica qué parte de las noticias de un hecho viene de medios de izquierda, de centro y de
          derecha. Si un color no aparece, ningún medio de esa orientación cubrió el hecho en el período recolectado: esa
          ausencia también es información.
        </p>
      </Bloque>

      <Bloque titulo="¿Quién decide la orientación de cada medio?">
        <p>
          La orientación no la calcula la inteligencia artificial. Es una asignación del equipo, respaldada por estudios
          sobre la prensa chilena (Elejalde et al., 2018; Figueroa-Bustos, 2025) y, en el caso de TVN, por la ley que le
          exige pluralismo (Ley N.º 19.132). Es una referencia para comparar, no una etiqueta definitiva.
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {MEDIOS.map((m) => (
            <li key={m.nombre} className="flex items-center gap-2 text-sm">
              <span className={`inline-block h-2.5 w-2.5 rounded-full ${FONDO[m.o]}`} aria-hidden="true" />
              <span className="font-medium text-gray-900">{m.nombre}</span>
              <span className="text-gray-500">{NOMBRE[m.o]}</span>
            </li>
          ))}
        </ul>
      </Bloque>

      <Bloque titulo="Tono, subjetividad y resumen">
        <p>
          Un modelo de lenguaje (Gemini) lee cada noticia y entrega cuatro datos con un formato fijo que se valida antes de
          guardarlo: la categoría temática, el tono del titular (positivo, neutral o negativo), un puntaje de subjetividad
          de 1 a 10 según la presencia de adjetivos y juicios de valor, y un resumen de hasta tres puntos con los datos
          duros.
        </p>
        <p>
          Es un análisis automático y puede equivocarse. Por eso cada noticia enlaza a su fuente original y puedes reportar
          un error desde la vista de comparación.
        </p>
      </Bloque>
    </div>
  );
}
