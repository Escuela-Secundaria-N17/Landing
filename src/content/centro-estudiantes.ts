import type { StudentCouncilProps } from '@/sections/StudentCouncil/StudentCouncil';

/**
 * Datos del Centro de Estudiantes. Lo puede mantener el propio CE.
 * ⚠ Ejemplos: reemplazar nombres, cursos e iniciativas por los reales.
 */
export const centroEstudiantes: Omit<StudentCouncilProps, 'id' | 'title'> = {
  intro:
    'Somos la voz de las y los estudiantes de La Poeta. Organizamos actividades, llevamos propuestas a la dirección y acompañamos a los cursos. Cualquier estudiante puede sumarse.',
  period: '2026–2027',
  links: [
    { label: 'Mandanos tu propuesta', href: 'https://forms.google.com/', icon: 'megaphone' },
    { label: 'Instagram del CE', href: 'https://www.instagram.com/', icon: 'instagram' },
  ],
  members: [
    { role: 'Presidencia', name: '[Nombre Apellido]', curso: '6° A' },
    { role: 'Vicepresidencia', name: '[Nombre Apellido]', curso: '5° B' },
    { role: 'Secretaría', name: '[Nombre Apellido]', curso: '4° A' },
    { role: 'Tesorería', name: '[Nombre Apellido]', curso: '5° A' },
    { role: 'Cultura y Deporte', name: '[Nombre Apellido]', curso: '3° B' },
    { role: 'Delegados Ciclo Básico', name: '[Nombre Apellido]', curso: '2° A' },
  ],
  initiatives: [
    {
      status: 'en-curso',
      title: 'Banco de apuntes',
      text: 'Juntamos resúmenes y libros usados para que pasen de un curso al siguiente.',
    },
    {
      status: 'propuesta',
      title: 'Bicicletero techado',
      text: 'Presentamos el proyecto a la cooperadora. Estamos relevando cuántos lo usarían.',
    },
    {
      status: 'realizada',
      title: 'Semana de la primavera',
      text: 'Torneos, música y la jornada de intercambio con otras escuelas.',
    },
  ],
};
