"use client";

import { usePathname } from "next/navigation";
import Nav from "./Nav";

export default function NavActiva() {
  return <Nav ruta={usePathname()} />;
}
