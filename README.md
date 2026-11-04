# Portafolio interactivo · Juan

Portafolio profesional presentado como un videojuego: pantalla de título, HUD, minimapa, capítulos, logros, combate por turnos y seis mundos visuales inspirados en anime y videojuegos (todo el arte es original).

Hecho con **Next.js 16**, **React 19**, **TypeScript** y **Tailwind CSS 4**. Sin imágenes ni sonidos externos: las partículas son Canvas 2D y los efectos de sonido se sintetizan con Web Audio.

## Empezar

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # compilación de producción
npm run lint
```

## Personalizar el contenido

Todo el texto vive en **`data/portfolio.ts`**: perfil, contacto, proyectos, experiencia, habilidades y testimonios. Busca los comentarios `TODO` y reemplázalos por tus datos reales. Sube tu CV a `public/cv.pdf`.

Los mundos visuales (colores, energía, partículas) están en `data/worlds.ts`, y sus estilos en `app/globals.css`.

## Formulario de contacto

Sin configuración, el formulario valida los campos y abre el cliente de correo del visitante con el mensaje ya escrito. Para recibir los mensajes directamente:

1. Crea un formulario gratuito en [formspree.io](https://formspree.io).
2. Copia `.env.example` a `.env.local` y pon tu ID en `NEXT_PUBLIC_FORMSPREE_ID`.
3. En Vercel, añade la misma variable en *Settings → Environment Variables*.

## Estructura

```
app/                  layout, página y estilos globales (mundos, modo día/noche)
components/game/      motor del juego: partida guardada, HUD, minimapa, menú de pausa,
                      notificaciones, banner, partículas, sonido y pantalla de título
components/sections/  capítulos: Inicio, Perfil, Misiones, Historia, Arena, Aliados, Contacto, Créditos
data/                 contenido del portafolio y definición de los mundos
```

## Controles

| Tecla | Acción |
| --- | --- |
| `Enter` | Empezar desde la pantalla de título |
| `Esc` | Menú de pausa (capítulos, logros, ajustes) |
| `1` `2` `3` | Técnicas en la arena de combate |
| `←` `→` | Cambiar de aliado |

La opción **Vista rápida** de la pantalla de título y el ajuste **Efectos visuales** desactivan animaciones y partículas. También se respeta `prefers-reduced-motion`.
