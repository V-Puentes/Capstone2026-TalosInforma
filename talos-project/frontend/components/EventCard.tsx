import Link from "next/link";
import type { EventoFeed } from "@/lib/types";
import { formatoFecha } from "@/lib/orientacion";
import BiasBar from "./BiasBar";

export default function EventCard({ evento }: { evento: EventoFeed }) {
  const varios = evento.n_medios > 1;
  return (
    <Link
      href={`/evento/${evento.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
    >
      {evento.imagen_url ? (
        <div className="relative h-40 overflow-hidden bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={evento.imagen_url}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            onError={(e) => {
              (e.currentTarget.parentElement as HTMLElement).style.display = "none";
            }}
          />
          {evento.imagen_medio && (
            <span className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-0.5 text-[10px] text-white">
              Imagen: {evento.imagen_medio}
            </span>
          )}
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2 text-xs">
          <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 font-semibold text-gray-700">
            {evento.categoria ?? "Sin categoría"}
          </span>
          <span className="text-gray-500">{formatoFecha(evento.fecha)}</span>
        </div>
        <h2 className="text-lg font-bold leading-snug text-gray-900 group-hover:underline group-hover:underline-offset-2">
          {evento.titulo_neutro}
        </h2>
        {evento.destacado && <p className="mt-2 line-clamp-3 text-sm text-gray-600">{evento.destacado}</p>}
        <div className="mt-auto pt-4">
          <BiasBar bias={evento.bias} />
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className={`font-medium ${varios ? "text-gray-900" : "text-gray-500"}`}>
              {evento.n_articulos} {evento.n_articulos === 1 ? "noticia" : "noticias"} de {evento.n_medios}{" "}
              {evento.n_medios === 1 ? "medio" : "medios"}
            </span>
            <span className="font-semibold text-gray-900">{varios ? "Comparar coberturas →" : "Ver detalle →"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
