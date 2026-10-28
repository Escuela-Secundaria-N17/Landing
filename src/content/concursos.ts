import type { Documento, Llamado } from '@/domain/concursos';
import cge from './concursos.generated.json';
import drive from './documentos-concursos.generated.json';

/**
 * Concursos docentes.
 *
 * - `llamados`: los trae `scripts/sync-cge.mjs` en cada deploy desde el sitio del
 *   CGE, filtrando las publicaciones que mencionan a la escuela (CUE 300-1754,
 *   o "N° 17" + "Ortiz"). No editar el .generated.json a mano.
 * - `documentos`: fijos (abajo) + los archivos de la carpeta de Drive
 *   "Concursos docentes" (variable DRIVE_CONCURSOS_FOLDER), que baja `sync-drive.mjs`.
 */
export const CGE_CONCURSOS = 'https://cge.entrerios.gov.ar/';

/** Lo que piden todos los llamados (Resol. 2300/22 CGE). */
export const requisitosConcurso = [
  { texto: 'Credencial de puntaje vigente, descargada del sitio oficial' },
  { texto: 'Formulario unificado completo' },
  { texto: 'DNI original y fotocopia' },
  { texto: 'Constancia de antigüedad de SAGE' },
  { texto: 'Constancia de personal de la institución', opcional: true },
];

const documentosFijos: Documento[] = [
  {
    titulo: 'Credencial de puntaje',
    descripcion: 'Se descarga sólo desde el sistema oficial (PreGASE) con tu usuario.',
    href: 'http://www.entrerios.gov.ar/webpregase/pregase/',
    formato: 'link',
  },
  {
    titulo: 'SAGE: constancia de antigüedad',
    descripcion: 'Ingresá con tu usuario docente y descargala desde el sistema.',
    href: 'https://sage.entrerios.gov.ar/',
    formato: 'link',
  },
];

export const documentosConcurso: Documento[] = [...(drive.documentos as Documento[]), ...documentosFijos];

export const llamados: Llamado[] = cge.llamados as Llamado[];
