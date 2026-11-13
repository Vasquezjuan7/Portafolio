import React from 'react';

export default function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Juan Vásquez',
    jobTitle: 'Frontend Developer & Software Engineering Student',
    url: 'https://structure-portfolio.vercel.app',
    sameAs: [
      'https://github.com/Vasquezjuan7',
      'https://linkedin.com/in/juan-desarrollador',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
