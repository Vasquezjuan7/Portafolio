# Arquitectura del Portafolio

Este proyecto está construido con **Next.js 16 (App Router)**, **React 19**, **TypeScript** y **Tailwind CSS v4**.

## Estructura Modular
- `/app`: Rutas principales, layout raíz y estilos globales.
- `/components/sections`: Secciones del portafolio (Hero, Profile, Missions, Story, Arena, Allies, Contact, Credits).
- `/components/game`: Motor lúdico (HUD, Minimapa, SFX, Menú de Pausa, Logros).
- `/components/fx`: Efectos visuales de fondo (CodeScape, Radar, Partículas).
- `/data`: Fuentes de verdad para textos bilingües, datos de proyectos y paletas.
- `/hooks`: Custom React hooks para lógica desacoplada.
- `/types`: Definiciones de contratos e interfaces TypeScript.
- `/utils`: Funciones puras de cálculo, formateo y persistencia.
