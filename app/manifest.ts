import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'N&J Desk',
    short_name: 'N&J Desk',
    description: 'Pilotage premium de chantiers et suivi client pour N&J Intérieurs',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#f8f6f1',
    theme_color: '#171717',
    lang: 'fr',
    icons: [
      {
        src: '/branding/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml'
      }
    ]
  };
}
