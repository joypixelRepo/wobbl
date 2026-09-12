import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve, sep } from 'node:path';

/**
 * Ruta de desarrollo: recibe el PNG de un modelo ya renderizado y lo
 * guarda en `public/productos/`. Es la que convierte los veintiocho
 * modelos 3D en las fichas estáticas que usa el resto de la web.
 *
 * No existe en producción: las imágenes se hornean una vez, se suben al
 * repositorio y a partir de ahí son archivos estáticos como cualquier
 * otro.
 */
export async function POST(req: Request) {
  if (process.env.NODE_ENV === 'production') {
    return new Response('not found', { status: 404 });
  }
  const { name, dataUrl } = (await req.json()) as { name?: string; dataUrl?: string };
  if (!name || !/^[a-z0-9-]+\.png$/.test(name) || !dataUrl?.startsWith('data:image/png;base64,')) {
    return Response.json({ ok: false, error: 'bad request' }, { status: 400 });
  }
  const root = resolve(process.cwd(), 'public', 'productos');
  const out = resolve(root, name);
  if (!out.startsWith(root + sep)) {
    return Response.json({ ok: false, error: 'path escapes root' }, { status: 400 });
  }
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, Buffer.from(dataUrl.slice('data:image/png;base64,'.length), 'base64'));
  return Response.json({ ok: true, name });
}
