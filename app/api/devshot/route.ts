import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve, sep } from 'node:path';

/**
 * Ruta de desarrollo: recoge un PNG del canvas y lo escribe a disco.
 * Sirve para revisar renders fuera del navegador y, más adelante, para
 * hornear las fichas estáticas del catálogo. No existe en producción.
 */
export async function POST(req: Request) {
  if (process.env.NODE_ENV === 'production') {
    return new Response('not found', { status: 404 });
  }
  const { path, dataUrl } = (await req.json()) as { path?: string; dataUrl?: string };
  if (!path || !dataUrl?.startsWith('data:image/png;base64,')) {
    return Response.json({ ok: false, error: 'bad request' }, { status: 400 });
  }
  // Nunca fuera del árbol permitido, venga como venga la petición.
  const root = resolve(process.env.DEVSHOT_DIR || '/tmp');
  const out = resolve(root, path);
  if (out !== root && !out.startsWith(root + sep)) {
    return Response.json({ ok: false, error: 'path escapes root' }, { status: 400 });
  }
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, Buffer.from(dataUrl.slice('data:image/png;base64,'.length), 'base64'));
  return Response.json({ ok: true, out });
}
