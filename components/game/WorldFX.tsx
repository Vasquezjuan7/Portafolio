"use client";

import CodeScape from "../fx/CodeScape";

/** Fondo global: símbolos de código hechos de partículas, código flotante y grano sutil. */
export default function WorldFX() {
  return (
    <>
      <CodeScape />
      <div className="noise" aria-hidden="true" />
    </>
  );
}
