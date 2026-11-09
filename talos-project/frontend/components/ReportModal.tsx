"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";

const MOTIVOS = [
  "La noticia no corresponde a este hecho",
  "La categoría o el tono no son correctos",
  "El resumen contiene un error",
  "Otro motivo",
];

export default function ReportModal({ noticiaId, titulo, onCerrar }: { noticiaId: string; titulo: string; onCerrar: () => void }) {
  const [motivo, setMotivo] = useState(MOTIVOS[0]);
  const [detalle, setDetalle] = useState("");
  const [estado, setEstado] = useState<"editando" | "enviando" | "enviado" | "error">("editando");
  const primero = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    primero.current?.focus();
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [onCerrar]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEstado("enviando");
    try {
      await api.reportar(noticiaId, detalle.trim() ? `${motivo}: ${detalle.trim()}` : motivo);
      setEstado("enviado");
    } catch {
      setEstado("error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onCerrar}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-reporte"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="titulo-reporte" className="text-lg font-bold text-gray-900">Reportar un error</h2>
        <p className="mt-1 line-clamp-2 text-sm text-gray-600">{titulo}</p>
        {estado === "enviado" ? (
          <div className="mt-6">
            <p className="text-sm text-gray-800">Gracias, revisaremos tu reporte.</p>
            <button type="button" onClick={onCerrar} className="mt-4 w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700">
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={enviar} className="mt-4 space-y-3">
            <label className="block text-sm font-medium text-gray-800">
              Motivo
              <select
                ref={primero}
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                {MOTIVOS.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-gray-800">
              Detalle (opcional)
              <textarea
                value={detalle}
                onChange={(e) => setDetalle(e.target.value)}
                rows={3}
                maxLength={500}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </label>
            {estado === "error" && <p className="text-sm text-rose-700">No se pudo enviar el reporte. Inténtalo de nuevo.</p>}
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={onCerrar} className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={estado === "enviando"}
                className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-60"
              >
                {estado === "enviando" ? "Enviando…" : "Enviar reporte"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
