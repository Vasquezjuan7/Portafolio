# Guía de Internacionalización (i18n)

El sistema de traducciones se almacena en `/data/i18n.ts`.

## Cómo agregar una nueva traducción
1. Añade la clave en la interfaz `TranslationDictionary`.
2. Proporciona el valor en español (`es`) e inglés (`en`).
3. Consume la clave en el componente mediante `useTranslation()` o el prop correspondiente.
