import { Suspense } from "react";
import DetalleEvento from "./DetalleEvento";

async function Contenido({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DetalleEvento id={id} />;
}

export default function EventoPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-8 text-gray-500 sm:px-6">Cargando hecho…</div>}>
      <Contenido params={params} />
    </Suspense>
  );
}
