export function getPreloadFontLinks() {
  return [
    { href: 'https://fonts.googleapis.com', rel: 'preconnect' },
    { href: 'https://fonts.gstatic.com', rel: 'preconnect', crossOrigin: 'anonymous' },
  ];
}
