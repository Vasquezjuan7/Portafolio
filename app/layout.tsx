import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BOOT_SCRIPT } from "../components/game/store";
import { profile } from "../data/portfolio";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05030a",
};

export const metadata: Metadata = {
  title: `${profile.fullName} · ${profile.role}`,
  description: `Portafolio de ${profile.fullName}, ${profile.role.toLowerCase()}. Proyectos, experiencia y habilidades en una experiencia web interactiva hecha con Next.js, TypeScript y Tailwind CSS.`,
  keywords: [profile.name, "Portafolio", "Desarrollador Frontend", "Software Engineer", "Next.js", "React", "TypeScript"],
  authors: [{ name: profile.fullName }],
  openGraph: {
    title: `${profile.fullName} · Portafolio`,
    description: profile.tagline,
    type: "website",
    locale: "es_CO",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-fx="on" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        <noscript>
          <style>{`.title-screen{display:none!important}body{overflow:auto!important}.reveal{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
