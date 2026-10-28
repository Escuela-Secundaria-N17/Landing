/**
 * Datos de contacto institucionales. Única fuente: los usan el footer,
 * los trámites y las preguntas frecuentes.
 * Fuente: flyer de inscripciones 2027.
 */
const direccion = 'De la Yerra 576, Estación Parera, Paraná, Entre Ríos';

export const contacto = {
  direccion,
  mapa: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`,
  email: 'secundaria17.ortiz@entrerios.edu.ar',
  telefono: { texto: '(0343) 6226071', href: 'tel:+543436226071' },
} as const;
