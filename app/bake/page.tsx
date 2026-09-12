'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { GL_SETTINGS } from '@/components/three/Studio';
import { ProductStage } from '@/components/three/ProductStage';
import { MODELS } from '@/components/three/models';
import { PRODUCTS } from '@/data/catalog';

/**
 * El horno de fichas. Recorre producto por producto y gama por gama,
 * renderiza cada combinación y manda el PNG a /api/bake, que lo escribe
 * en public/productos/. Se ejecuta una vez, a mano, y las imágenes se
 * suben al repositorio: en producción son archivos estáticos y esta
 * ruta no existe.
 *
 * El lienzo va con fondo transparente a propósito, porque la misma
 * ficha tiene que caer sobre la estantería clara, sobre la vitrina
 * oscura y sobre el pie de página sin arrastrar un rectángulo detrás.
 */
const SIZE = 512;

const JOBS = PRODUCTS.flatMap((p) =>
  p.colorways.map((c, i) => ({ id: p.id, kind: p.kind, cw: i, c })),
).filter((j) => j.kind in MODELS);

export default function Bake() {
  const [i, setI] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const host = useRef<HTMLDivElement>(null);
  const job = JOBS[i];

  useEffect(() => {
    if (!job) return;
    let cancelled = false;

    /* Una captura no vale por el hecho de haberse hecho: si el lienzo
       todavía no tiene su tamaño o el fotograma sale vacío, la ficha
       guardada sería un PNG en blanco. Se reintenta hasta que tenga
       píxeles de verdad. */
    async function attempt(tries = 0): Promise<void> {
      if (cancelled) return;
      const canvas = host.current?.querySelector('canvas');
      const ok = canvas && canvas.width >= SIZE / 2 && hasPixels(canvas);
      if (!ok) {
        if (tries > 24) {
          setLog((l) => [...l.slice(-8), `✗ ${job!.id}-${job!.cw} (lienzo vacío)`]);
          setI((n) => n + 1);
          return;
        }
        window.setTimeout(() => attempt(tries + 1), 250);
        return;
      }
      const name = `${job!.id}-${job!.cw}.png`;
      const res = await fetch('/api/bake', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, dataUrl: canvas!.toDataURL('image/png') }),
      }).then((r) => r.json());
      if (cancelled) return;
      setLog((l) => [...l.slice(-8), `${res.ok ? '✓' : '✗'} ${name}`]);
      setI((n) => n + 1);
    }

    const t = window.setTimeout(() => attempt(), 700);
    return () => { cancelled = true; window.clearTimeout(t); };
  }, [i, job]);

  const Model = job ? MODELS[job.kind]! : null;

  return (
    <div style={{ font: '600 13px system-ui', background: '#111', color: '#eee', minHeight: '100vh' }}>
      {/* El lienzo va anclado y con medida fija: si se mueve con el
          registro que va creciendo, R3F lo redimensiona a media captura. */}
      <div
        ref={host}
        style={{ position: 'fixed', top: 0, right: 0, width: SIZE, height: SIZE, background: 'transparent' }}
      >
        <Canvas
          shadows
          dpr={1}
          resize={{ debounce: 0 }}
          style={{ width: SIZE, height: SIZE }}
          gl={{ ...GL_SETTINGS, preserveDrawingBuffer: true }}
        >
          <ProductStage bg={null} refitKey={job ? `${job.id}-${job.cw}` : 'done'}>
            {Model && job && (
              <Model body={job.c.body} accent={job.c.accent} extra={job.c.extra} spin={0} />
            )}
          </ProductStage>
        </Canvas>
      </div>

      <div style={{ padding: 16, position: 'relative', zIndex: 2 }}>
        <p>{job ? `Horneando ${i + 1} / ${JOBS.length} — ${job.id} · gama ${job.cw}` : `LISTO. ${JOBS.length} fichas horneadas.`}</p>
        <pre style={{ opacity: .7 }}>{log.join('\n')}</pre>
      </div>
    </div>
  );
}

/** ¿Ha dibujado algo el último fotograma? */
function hasPixels(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl2');
  if (!gl) return false;
  const w = 64;
  const h = 64;
  const buf = new Uint8Array(w * h * 4);
  gl.readPixels(
    Math.floor((canvas.width - w) / 2),
    Math.floor((canvas.height - h) / 2),
    w, h, gl.RGBA, gl.UNSIGNED_BYTE, buf,
  );
  for (let k = 3; k < buf.length; k += 4) if (buf[k] > 8) return true;
  return false;
}
