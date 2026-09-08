import type { MetadataRoute } from 'next';

/**
 * Se permite el rastreo a propósito.
 *
 * Puede parecer contradictorio en una web que no queremos indexar, pero es al
 * revés: si aquí bloqueásemos el rastreo, Google no llegaría a leer el
 * `noindex` de la página y la URL podría seguir apareciendo en resultados
 * (como enlace pelado, sin título ni descripción) en cuanto alguien la
 * enlazase. Para que una página salga del índice hay que dejar que la
 * rastreen y que vean el noindex.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
  };
}
