import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Juan Desarrollador // Portafolio Gamer',
    short_name: 'JuanDev',
    description: 'Portafolio profesional interactivo con estética gaming y arquitectura Next.js',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090f',
    theme_color: '#8b5cf6',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
