"use client";

import { useCallback, useEffect, useState } from "react";

/* Carga datos de la API y expone los estados de carga, error y demora
   (el plan gratuito de Render puede tardar hasta un minuto en despertar). */
export function useApi<T>(carga: () => Promise<T>, clave: string) {
  const [datos, setDatos] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [lento, setLento] = useState(false);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let vivo = true;
    setDatos(null);
    setError(null);
    setLento(false);
    const aviso = setTimeout(() => {
      if (vivo) setLento(true);
    }, 4000);
    carga()
      .then((d) => {
        if (vivo) setDatos(d);
      })
      .catch((e: unknown) => {
        if (vivo) setError(e instanceof Error ? e : new Error(String(e)));
      })
      .finally(() => clearTimeout(aviso));
    return () => {
      vivo = false;
      clearTimeout(aviso);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave, intento]);

  const reintentar = useCallback(() => setIntento((n) => n + 1), []);
  return { datos, error, lento, cargando: datos === null && error === null, reintentar };
}
