// ============================================================
//  CONTENIDO DEL PORTAFOLIO (español e inglés)
//  Todo el texto del sitio y del CV vive aquí. Reemplaza los
//  valores marcados con "TODO" por tus datos reales.
//  Si cambias algo en español, cambia también su versión en inglés.
// ============================================================

export type Lang = "es" | "en";
export const LANGS: Lang[] = ["es", "en"];

/** Datos que no cambian con el idioma. */
const base = {
  name: "Juan Diego",
  fullName: "Juan Diego Gonzalez Sanchez",
  initials: "JG",
  /** Foto de perfil para la web (no se incluye en el CV). */
  photo: "/profile/retrato.jpg",
  avatar: "/profile/avatar.jpg",
  level: 24,
  email: "juanvasquezsanchez2006@gmail.com",
  phoneDisplay: "+57 321 951 3725",
  whatsapp: "https://wa.me/573219513725",
  linkedin: "https://www.linkedin.com/in/juan-gonzalez-sanchez-72b710401/",
  linkedinLabel: "linkedin.com/in/juan-gonzalez-sanchez-72b710401",
  github: "https://github.com/Vasquezjuan7",
  githubLabel: "github.com/Vasquezjuan7",
};

export type Profile = typeof base & {
  role: string;
  playerClass: string;
  tagline: string;
  location: string;
  career: string;
  university: string;
  languages: string[];
  availability: string;
  bio: string[];
  interests: { icon: string; label: string; detail: string }[];
  values: { label: string; detail: string }[];
};

export type Project = {
  id: string;
  title: string;
  codename: string;
  category: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  year: string;
  role: string;
  description: string;
  highlights: string[];
  reward: string;
  tags: string[];
  github: string;
  /** Enlace a la demo en vivo (opcional). */
  demo?: string;
  icon: string;
  /** Video e imágenes propios del proyecto (en /public). */
  media?: { video?: string; poster?: string; images?: { src: string; alt: string }[] };
};

export type StoryItem = {
  id: string;
  type: "laboral" | "academica";
  title: string;
  entity: string;
  period: string;
  description: string;
  achievements: string[];
  skills: string[];
};

export type SkillNode = {
  name: string;
  rank: 1 | 2 | 3 | 4 | 5;
  detail: string;
};

export type Ally = {
  id: string;
  name: string;
  role: string;
  organization: string;
  initials: string;
  text: string;
};

/** Identificadores de los capítulos (secciones), en orden. */
export const CHAPTER_IDS = ["inicio", "perfil", "misiones", "historia", "arena", "aliados", "contacto"] as const;
export type ChapterId = (typeof CHAPTER_IDS)[number];

export type Content = {
  profile: Profile;
  attributes: { label: string; value: number; detail: string }[];
  quickStats: { value: string; label: string }[];
  projects: Project[];
  story: StoryItem[];
  skillTree: { branch: string; icon: string; nodes: SkillNode[] }[];
  rankLabels: Record<SkillNode["rank"], string>;
  allies: Ally[];
  chapters: { id: ChapterId; short: string; title: string; objective: string }[];
};

// ------------------------------------------------------------
//  ESPAÑOL
// ------------------------------------------------------------
const es: Content = {
  profile: {
    ...base,
    role: "Software Engineer · Frontend & Fullstack Developer · System Architect",
    playerClass: "Software Engineer",
    tagline:
      "Construyo aplicaciones web rápidas, sistemas integrales de gestión e inventario y experiencias de usuario que resuelven problemas complejos de negocio con un rendimiento excepcional.",
    location: "Pasto, Nariño, Colombia",
    career: "Ingeniería de Software",
    university: "Universidad Cooperativa de Colombia (UCC), sede Pasto",
    languages: ["Español (nativo)", "Inglés (B2)"], // TODO: confirmar nivel de inglés
    availability: "Disponible para proyectos y desarrollo de software",
    bio: [
      "Soy estudiante de Ingeniería de Software en la Universidad Cooperativa de Colombia (UCC) y un desarrollador apasionado por crear herramientas que aporten valor real. Mi enfoque principal está en el ecosistema Frontend y Fullstack: desde construir interfaces web ultrarrápidas y accesibles, hasta diseñar aplicaciones de escritorio y sistemas de control de inventario automatizados.",
      "Trabajo desarrollando todo el ciclo del producto. Por el lado visual, creo interfaces fluidas con React, Next.js y Tailwind CSS. En la lógica de negocio, construyo arquitecturas sólidas con Java Spring Boot, Node.js y PostgreSQL, integrando soluciones avanzadas como visión computacional para automatizar el stock en supermercados.",
      "Aunque también exploro el desarrollo móvil nativo y los videojuegos en Unity, mi mayor fortaleza es unir ingeniería sólida, bases de datos y diseño UI para crear plataformas administrativas, dashboards y aplicaciones de escritorio que las empresas utilizan para operar en su día a día.",
    ],
    interests: [
      { icon: "🚀", label: "Frontend & UI", detail: "Interfaces rápidas y accesibles con Next.js, React, Tailwind CSS y Vite." },
      { icon: "⚙️", label: "Arquitectura backend & cloud", detail: "Java Spring Boot, Node.js y PostgreSQL; serverless en AWS (Lambda, S3, Cognito) y Docker." },
      { icon: "📱", label: "Desarrollo móvil nativo", detail: "Kotlin, Jetpack Compose y SDKs de navegación (MapLibre)." },
      { icon: "🎮", label: "Game Dev & 3D", detail: "Desarrollo en Unity 6 con C#, Cinemachine, animaciones de estados (Mixamo) y shaders URP." },
    ],
    values: [
      { label: "Disciplina", detail: "Entregas constantes y a tiempo." },
      { label: "Curiosidad", detail: "Aprendo una tecnología nueva cada trimestre." },
      { label: "Trabajo en equipo", detail: "Code reviews, comunicación clara y documentación." },
    ],
  },

  attributes: [
    { label: "Frontend", value: 92, detail: "React, Next.js y TypeScript: interfaces animadas como este portafolio y CodeCity Nexus 3D." },
    { label: "UI / UX", value: 86, detail: "Diseño interfaces, sistemas visuales y microinteracciones pensadas en quien las usa." },
    { label: "Rendimiento", value: 80, detail: "Carga diferida, renders optimizados y animaciones fluidas a 60 fps." },
    { label: "Backend", value: 62, detail: "Node.js, Supabase y SQLite: APIs, autenticación y bases de datos con RLS." },
    { label: "Equipo", value: 88, detail: "Git, revisiones de código y comunicación clara en proyectos académicos y propios." },
    { label: "Aprendizaje", value: 95, detail: "Aprendo rápido: Kotlin, Unity, Wear OS y Electron en proyectos personales." },
  ],

  quickStats: [
    { value: "4", label: "Proyectos destacados" },
    { value: "2+", label: "Años programando" },
    { value: "15+", label: "Tecnologías" },
  ],

  projects: [
    {
      id: "dead-echo",
      title: "DEAD echo",
      codename: "Survival horror en primera persona · Unity 6",
      category: "Videojuego · UI/UX",
      difficulty: 5,
      year: "2026",
      role: "Desarrollo de juego e interfaces (equipo de 3)",
      description:
        "Juego de survival horror inspirado en las mecánicas de Resident Evil 4 Remake, hecho en Unity 6 para la materia de Diseño de Interfaces. Capítulo 1: sobrevivir en el pueblo de Valdeoscuro para rescatar a Elena.",
      highlights: [
        "Interfaces «Dead Echo» construidas por código: menú principal, modo cine, pantalla de carga, opciones con 7 pestañas, pausa y maletín.",
        "Combate táctico, inventario en cuadrícula 12×8 con fabricación, mercader y asedios por oleadas con IA de aldeanos.",
        "NPC con conversación en tiempo real usando la API de Gemini y voces con text-to-speech.",
        "Accesibilidad: modos para daltonismo, tamaño de texto, idioma ES/EN en vivo y cambio automático entre teclado y mando.",
      ],
      reward: "~116 scripts en C# y unas 23.700 líneas de código",
      tags: ["Unity 6", "C#", "UI/UX", "Gemini API", "HLSL", "TextMeshPro"],
      github: "https://github.com/Vasquezjuan7/Game-type-resident-evil-4",
      icon: "🎮",
      media: {
        video: "/projects/dead-echo/gameplay.webm",
        poster: "/projects/dead-echo/01-menu.jpg",
        images: [
          { src: "/projects/dead-echo/01-menu.jpg", alt: "Menú principal de DEAD echo" },
          { src: "/projects/dead-echo/02-capitulo-1.jpg", alt: "Inicio del Capítulo 1 en Valdeoscuro" },
          { src: "/projects/dead-echo/03-asedio.jpg", alt: "Asedio de los aldeanos" },
          { src: "/projects/dead-echo/04-combate.jpg", alt: "Combate contra un aldeano" },
          { src: "/projects/dead-echo/05-opciones.jpg", alt: "Menú de opciones gráficas" },
          { src: "/projects/dead-echo/06-nueva-partida.jpg", alt: "Pantalla de nueva partida" },
        ],
      },
    },
    {
      id: "pr-watch",
      title: "PR Watch",
      codename: "Gestor colaborativo de despliegues · Wear OS",
      category: "Wear OS · DevOps",
      difficulty: 4,
      year: "2026",
      role: "Desarrollador Android / Wear OS",
      description:
        "Herramienta DevOps de bolsillo para smartwatch: revisa, aprueba (merge) o cierra Pull Requests de GitHub desde la muñeca, con un resumen de riesgo generado por IA antes de decidir.",
      highlights: [
        "Inicio de sesión con GitHub mediante OAuth Device Flow, sin tokens en el código.",
        "Lista los PRs abiertos de todos tus repos con permiso de escritura y hace merge o close directo contra la API de GitHub.",
        "Resumen con IA (Gemini en una Edge Function de Supabase) que explica el cambio y clasifica su riesgo.",
        "Avisos en segundo plano cada 15 minutos con vibración, feedback háptico y diseño «Aurora» OLED en Jetpack Compose.",
      ],
      reward: "Un PR revisado y fusionado desde el reloj en segundos",
      tags: ["Kotlin", "Wear OS", "Jetpack Compose", "GitHub API", "Gemini API", "Supabase"],
      github: "https://github.com/Vasquezjuan7/smartwatchgithub",
      icon: "⌚",
      media: {
        video: "/projects/pr-watch/demo.webm",
        poster: "/projects/pr-watch/01-confirmar-merge.jpg",
        images: [
          { src: "/projects/pr-watch/01-confirmar-merge.jpg", alt: "Confirmar merge o cierre del PR en el reloj" },
          { src: "/projects/pr-watch/02-buscando-prs.jpg", alt: "Buscando PRs en todos los repositorios" },
          { src: "/projects/pr-watch/03-lista-prs.jpg", alt: "Pull Request pendiente en el reloj" },
          { src: "/projects/pr-watch/04-resumen-ia.jpg", alt: "Resumen del PR generado por IA con nivel de riesgo" },
          { src: "/projects/pr-watch/05-fusionando.jpg", alt: "Fusionando la rama desde el reloj" },
          { src: "/projects/pr-watch/06-pr-fusionado-github.jpg", alt: "El PR fusionado en GitHub y desplegado en Vercel" },
        ],
      },
    },
    {
      id: "codecity",
      title: "CodeCity Nexus 3D",
      codename: "Arquitectura de código en 3D con auditoría IA",
      category: "Escritorio · 3D · IA",
      difficulty: 5,
      year: "2026",
      role: "Desarrollador fullstack",
      description:
        "Aplicación de escritorio y web que convierte cualquier repositorio en una ciudad 3D navegable: cada archivo es un edificio y los distritos agrupan el código por su rol. Incluye auditoría de seguridad con IA y un escáner offline.",
      highlights: [
        "Altura = líneas reales, base = número de funciones y distrito = rol (UI, lógica, datos, infraestructura, tests…), con edificios instanciados y shader propio en Three.js.",
        "Tráfico de paquetes por las calles siguiendo el grafo real de imports del proyecto.",
        "Auditoría con Gemini u OpenAI: hallazgos con la línea exacta, diff lado a lado y archivo refactorizado que se puede aplicar en disco; escáner offline sin clave.",
        "App de escritorio con Electron para Windows, macOS y Linux, cuentas en Supabase con RLS e historial de auditorías en la nube.",
      ],
      reward: "Repositorios de hasta 1.500 archivos convertidos en una ciudad 3D",
      tags: ["React", "TypeScript", "Three.js", "Electron", "Gemini API", "Supabase", "Vite"],
      github: "https://github.com/Vasquezjuan7/Modelado3d",
      icon: "🏙️",
      media: {
        video: "/projects/codecity/demo.webm",
        poster: "/projects/codecity/01-ciudad-3d.jpg",
        images: [
          { src: "/projects/codecity/01-ciudad-3d.jpg", alt: "Repositorio convertido en una ciudad 3D por distritos" },
          { src: "/projects/codecity/02-edificio-inspeccionado.jpg", alt: "Inspección de un archivo con sus imports en arcos" },
          { src: "/projects/codecity/03-auditoria-ia.jpg", alt: "Auditoría con IA: puntuación y hallazgos con línea exacta" },
          { src: "/projects/codecity/04-codigo-refactorizado.jpg", alt: "Código refactorizado listo para aplicar en disco" },
          { src: "/projects/codecity/05-inicio-app.jpg", alt: "Pantalla de inicio de la app de escritorio" },
        ],
      },
    },
    {
      id: "georhythm",
      title: "GeoRhythm",
      codename: "Sonic Journey Navigation · Android",
      category: "Android · Mapas · Música",
      difficulty: 5,
      year: "2026",
      role: "Desarrollador Android",
      description:
        "App Android para caminar San Juan de Pasto al ritmo de tu música: mide tu velocidad con el GPS, calcula tu cadencia de pasos y adapta la música en tiempo real mientras te guía a pie por rutas históricas con audio-guía.",
      highlights: [
        "Mapa vectorial 3D con MapLibre y MapTiler, modo día/noche y lugares de Pasto con coordenadas verificadas en OpenStreetMap.",
        "Navegación peatonal paso a paso (OSRM de FOSSGIS) con recálculo si te desvías, y rutas por el centro histórico con audio-guía por voz.",
        "Ritmo al paso: la música acelera o desacelera sin cambiar el tono para igualar tu cadencia, con Audius, radios en vivo y Spotify (PKCE).",
        "Cuentas y estadísticas en Supabase con RLS, y caminatas con la pantalla apagada gracias a un servicio en primer plano.",
      ],
      reward: "La música sigue el ritmo de tus pasos mientras recorres Pasto",
      tags: ["Kotlin", "Jetpack Compose", "MapLibre", "ExoPlayer", "Supabase", "Spotify API"],
      github: "https://github.com/Vasquezjuan7/GeoRhythm",
      icon: "🎧",
      media: {
        video: "/projects/georhythm/demo.webm",
        poster: "/projects/georhythm/01-explorar-pasto.jpg",
        images: [
          { src: "/projects/georhythm/01-explorar-pasto.jpg", alt: "Mapa 3D del centro de Pasto con lugares de interés" },
          { src: "/projects/georhythm/02-rutas-historicas.jpg", alt: "Rutas recomendadas por el centro histórico con audio-guía" },
          { src: "/projects/georhythm/03-ritmo-al-paso.jpg", alt: "Ritmo al paso con radios según el BPM" },
          { src: "/projects/georhythm/04-mapa-noche-musica.jpg", alt: "Mapa en modo noche con la ruta y la música sonando" },
          { src: "/projects/georhythm/05-spotify.jpg", alt: "Playlists de Spotify conectadas a la app" },
        ],
      },
    },
  ],

  // Experiencia, de lo más reciente a lo más antiguo.
  story: [
    {
      id: "s-1",
      type: "academica",
      title: "Ingeniería de Software",
      entity: "Universidad Cooperativa de Colombia (UCC) — Campus Pasto",
      period: "2024 – Presente",
      description: "Formación avanzada en ingeniería de software, arquitectura de sistemas y estructuras de datos.",
      achievements: [
        "Desarrollo de proyectos completos de software (frontend, backend y bases de datos).",
        "Implementación de metodologías de evaluación de rendimiento de hardware (benchmarking de cachés y procesamiento).",
        "Proyectos académicos como DEAD echo, un videojuego en Unity 6 para la materia de Diseño de Interfaces.",
      ],
      skills: ["Arquitectura de sistemas", "Estructuras de datos", "Bases de datos", "Benchmarking"],
    },
    {
      id: "s-2",
      type: "laboral",
      title: "Desarrollador y Diseñador Digital",
      entity: "Proyectos freelance y colaboraciones — clientes independientes e institucionales",
      period: "2024 – Presente", // TODO: confirmar desde cuándo haces trabajos freelance
      description: "Desarrollo de propuestas digitales y piezas de diseño para negocios, instituciones y comunidades.",
      achievements: [
        "Restaurante Candela: desarrollo de propuestas digitales y gestión de eventos.",
        "Policía Metropolitana de San Juan de Pasto: diseño y maquetación de documentos de reconocimiento oficial (Coronel Andrea Carolina Cáceres Naranjo, Secretario Giovanny Albeyro Guerrero Salas).",
        "Comunidades digitales: diseño de banners, flyers y logotipos para servidores (Families Garage).",
      ],
      skills: ["Diseño gráfico", "Maquetación", "Branding", "Gestión de eventos"],
    },
  ],

  skillTree: [
    {
      branch: "Frontend & Mobile",
      icon: "⚛️",
      nodes: [
        { name: "React & Next.js", rank: 4, detail: "Creación de interfaces y Server Components." },
        { name: "Kotlin & Jetpack Compose", rank: 4, detail: "Desarrollo nativo de Android." },
        { name: "Tailwind CSS & Vite", rank: 5, detail: "Estilos de utilidad y empaquetado rápido." },
        { name: "HTML, CSS & TS/JS", rank: 5, detail: "Bases sólidas y tipado estricto." },
      ],
    },
    {
      branch: "Backend & Cloud",
      icon: "🧠",
      nodes: [
        { name: "Java Spring Boot", rank: 4, detail: "APIs robustas y arquitecturas empresariales." },
        { name: "Node.js & NestJS", rank: 4, detail: "Servidores escalables y asíncronos." },
        { name: "AWS", rank: 3, detail: "Serverless, S3, Lambda, IAM y Cognito." },
        { name: "SQL & PostgreSQL", rank: 4, detail: "Modelado relacional avanzado." },
        { name: "Python", rank: 3, detail: "Scripting, visión computacional y automatización." },
      ],
    },
    {
      branch: "Herramientas & entorno",
      icon: "🛠️",
      nodes: [
        { name: "IntelliJ IDEA, Android Studio y VS Code", rank: 5, detail: "Entornos de desarrollo del día a día." },
        { name: "Git, GitHub y Docker (WSL2)", rank: 4, detail: "Control de versiones y DevOps." },
        { name: "Unity 6", rank: 4, detail: "Motor de videojuegos con C#." },
        { name: "Claude Code y MCP", rank: 4, detail: "Herramientas de IA y Model Context Protocol." },
      ],
    },
  ],

  rankLabels: { 1: "Aprendiz", 2: "Básico", 3: "Competente", 4: "Avanzado", 5: "Experto" },

  allies: [
    {
      id: "a-1",
      name: "Ing. Ivonne Barco",
      role: "Docente de Ingeniería de Software",
      organization: "UCC",
      initials: "IB",
      text: "Juan Diego fue uno de los estudiantes más sobresalientes en mis módulos de ingeniería. Su capacidad para diseñar arquitecturas escalables y su atención al detalle en el desarrollo frontend son excepcionales. En proyectos complejos, como la creación de sistemas automatizados de inventario, siempre demostró un liderazgo técnico impecable y una gran visión de producto.",
    },
    {
      id: "a-2",
      name: "Jhonatan",
      role: "Software Engineer",
      organization: "Mercado Libre",
      initials: "JH",
      text: "He revisado el código de Juan Diego y tiene el nivel de madurez técnica que buscamos en la industria del e-commerce. Su enfoque en la optimización del rendimiento, la creación de interfaces limpias con React y su entendimiento de todo el ecosistema Fullstack lo convierten en un desarrollador que realmente sabe cómo construir software que escala.",
    },
    {
      id: "a-3",
      name: "Juan Camilo",
      role: "Software Engineer",
      organization: "Future Processing",
      initials: "JC",
      text: "Colaborar y debatir sobre arquitectura de software con Juan Diego es garantía de calidad. Tiene una visión integral del ciclo de desarrollo, desde la robustez de un backend con Spring Boot hasta la entrega de interfaces web fluidas y accesibles. Su habilidad para resolver problemas de negocio reales mediante código limpio y mantenible es su mayor fortaleza.",
    },
  ],

  chapters: [
    { id: "inicio", short: "Inicio", title: "Inicio", objective: "Presentación" },
    { id: "perfil", short: "Sobre mí", title: "Sobre mí", objective: "Quién soy y cómo trabajo" },
    { id: "misiones", short: "Proyectos", title: "Proyectos", objective: "Trabajo destacado" },
    { id: "historia", short: "Experiencia", title: "Experiencia", objective: "Trayectoria laboral y académica" },
    { id: "arena", short: "Habilidades", title: "Habilidades", objective: "Stack técnico" },
    { id: "aliados", short: "Testimonios", title: "Testimonios", objective: "Lo que dicen de mí" },
    { id: "contacto", short: "Contacto", title: "Contacto", objective: "Hablemos" },
  ],
};

// ------------------------------------------------------------
//  ENGLISH
// ------------------------------------------------------------
const en: Content = {
  profile: {
    ...base,
    role: "Software Engineer · Frontend & Fullstack Developer · System Architect",
    playerClass: "Software Engineer",
    tagline:
      "I build fast web applications, end-to-end management and inventory systems, and user experiences that solve complex business problems with outstanding performance.",
    location: "Pasto, Nariño, Colombia",
    career: "Software Engineering",
    university: "Universidad Cooperativa de Colombia (UCC), Pasto campus",
    languages: ["Spanish (native)", "English (B2)"],
    availability: "Available for projects and software development",
    bio: [
      "I'm a Software Engineering student at Universidad Cooperativa de Colombia (UCC) and a developer passionate about building tools that deliver real value. My main focus is the Frontend and Fullstack ecosystem: from building ultra-fast, accessible web interfaces to designing desktop applications and automated inventory control systems.",
      "I work across the entire product lifecycle. On the visual side, I create fluid interfaces with React, Next.js and Tailwind CSS. On the business logic side, I build solid architectures with Java Spring Boot, Node.js and PostgreSQL, integrating advanced solutions such as computer vision to automate supermarket stock.",
      "Although I also explore native mobile development and Unity games, my greatest strength is combining solid engineering, databases and UI design to create admin platforms, dashboards and desktop applications that businesses use to run their day-to-day operations.",
    ],
    interests: [
      { icon: "🚀", label: "Frontend & UI", detail: "Fast, accessible interfaces with Next.js, React, Tailwind CSS and Vite." },
      { icon: "⚙️", label: "Backend architecture & cloud", detail: "Java Spring Boot, Node.js and PostgreSQL; serverless on AWS (Lambda, S3, Cognito) and Docker." },
      { icon: "📱", label: "Native mobile development", detail: "Kotlin, Jetpack Compose and navigation SDKs (MapLibre)." },
      { icon: "🎮", label: "Game Dev & 3D", detail: "Unity 6 development with C#, Cinemachine, state-machine animation (Mixamo) and URP shaders." },
    ],
    values: [
      { label: "Discipline", detail: "Consistent, on-time delivery." },
      { label: "Curiosity", detail: "I learn a new technology every quarter." },
      { label: "Teamwork", detail: "Code reviews, clear communication and documentation." },
    ],
  },

  attributes: [
    { label: "Frontend", value: 92, detail: "React, Next.js and TypeScript: animated interfaces like this portfolio and CodeCity Nexus 3D." },
    { label: "UI / UX", value: 86, detail: "I design interfaces, visual systems and micro-interactions built around the people who use them." },
    { label: "Performance", value: 80, detail: "Lazy loading, optimized renders and smooth 60 fps animations." },
    { label: "Backend", value: 62, detail: "Node.js, Supabase and SQLite: APIs, authentication and databases with RLS." },
    { label: "Teamwork", value: 88, detail: "Git, code reviews and clear communication in academic and personal projects." },
    { label: "Learning", value: 95, detail: "I learn fast: Kotlin, Unity, Wear OS and Electron in personal projects." },
  ],

  quickStats: [
    { value: "4", label: "Featured projects" },
    { value: "2+", label: "Years coding" },
    { value: "15+", label: "Technologies" },
  ],

  projects: [
    {
      ...es.projects[0],
      codename: "First-person survival horror · Unity 6",
      category: "Video game · UI/UX",
      role: "Game and interface development (team of 3)",
      description:
        "Survival horror game inspired by Resident Evil 4 Remake's mechanics, built in Unity 6 for an Interface Design course. Chapter 1: survive the village of Valdeoscuro to rescue Elena.",
      highlights: [
        "\"Dead Echo\" interfaces built in code: main menu, cinematic mode, loading screen, 7-tab options, pause and briefcase.",
        "Tactical combat, 12×8 grid inventory with crafting, a merchant and wave-based sieges with villager AI.",
        "NPC with real-time conversation powered by the Gemini API, and text-to-speech voices.",
        "Accessibility: color-blind modes, text size, live ES/EN language switching and automatic keyboard/gamepad prompts.",
      ],
      reward: "~116 C# scripts and about 23,700 lines of code",
      media: {
        ...es.projects[0].media,
        images: [
          { src: "/projects/dead-echo/01-menu.jpg", alt: "DEAD echo main menu" },
          { src: "/projects/dead-echo/02-capitulo-1.jpg", alt: "Start of Chapter 1 in Valdeoscuro" },
          { src: "/projects/dead-echo/03-asedio.jpg", alt: "Villager siege" },
          { src: "/projects/dead-echo/04-combate.jpg", alt: "Fighting a villager" },
          { src: "/projects/dead-echo/05-opciones.jpg", alt: "Graphics options menu" },
          { src: "/projects/dead-echo/06-nueva-partida.jpg", alt: "New game screen" },
        ],
      },
    },
    {
      ...es.projects[1],
      codename: "Collaborative deployment manager · Wear OS",
      role: "Android / Wear OS developer",
      description:
        "A pocket DevOps tool for smartwatches: review, merge or close GitHub Pull Requests from your wrist, with an AI-generated risk summary before you decide.",
      highlights: [
        "GitHub sign-in via OAuth Device Flow, with no tokens in the code.",
        "Lists open PRs across every repo you can write to and merges or closes them directly through the GitHub API.",
        "AI summary (Gemini in a Supabase Edge Function) that explains the change and rates its risk.",
        "Background checks every 15 minutes with vibration, haptic feedback and an OLED \"Aurora\" design in Jetpack Compose.",
      ],
      reward: "A PR reviewed and merged from the watch in seconds",
      media: {
        ...es.projects[1].media,
        images: [
          { src: "/projects/pr-watch/01-confirmar-merge.jpg", alt: "Confirming the PR merge or close on the watch" },
          { src: "/projects/pr-watch/02-buscando-prs.jpg", alt: "Searching PRs across all repositories" },
          { src: "/projects/pr-watch/03-lista-prs.jpg", alt: "Pending Pull Request on the watch" },
          { src: "/projects/pr-watch/04-resumen-ia.jpg", alt: "AI-generated PR summary with risk level" },
          { src: "/projects/pr-watch/05-fusionando.jpg", alt: "Merging the branch from the watch" },
          { src: "/projects/pr-watch/06-pr-fusionado-github.jpg", alt: "The merged PR on GitHub, deployed to Vercel" },
        ],
      },
    },
    {
      ...es.projects[2],
      codename: "3D code architecture with AI auditing",
      category: "Desktop · 3D · AI",
      role: "Fullstack developer",
      description:
        "Desktop and web app that turns any repository into a navigable 3D city: every file is a building and districts group code by its role. Includes AI security auditing and an offline scanner.",
      highlights: [
        "Height = real lines, footprint = number of functions and district = role (UI, logic, data, infrastructure, tests…), with instanced buildings and a custom Three.js shader.",
        "Package traffic flows through the streets following the project's real import graph.",
        "Auditing with Gemini or OpenAI: findings with the exact line, side-by-side diff and a refactored file you can apply to disk; offline scanner with no key needed.",
        "Electron desktop app for Windows, macOS and Linux, Supabase accounts with RLS and cloud audit history.",
      ],
      reward: "Repositories of up to 1,500 files turned into a 3D city",
      media: {
        ...es.projects[2].media,
        images: [
          { src: "/projects/codecity/01-ciudad-3d.jpg", alt: "Repository turned into a 3D city by districts" },
          { src: "/projects/codecity/02-edificio-inspeccionado.jpg", alt: "Inspecting a file with its imports as arcs" },
          { src: "/projects/codecity/03-auditoria-ia.jpg", alt: "AI audit: score and findings with the exact line" },
          { src: "/projects/codecity/04-codigo-refactorizado.jpg", alt: "Refactored code ready to apply to disk" },
          { src: "/projects/codecity/05-inicio-app.jpg", alt: "Desktop app start screen" },
        ],
      },
    },
    {
      ...es.projects[3],
      category: "Android · Maps · Music",
      role: "Android developer",
      description:
        "Android app for walking San Juan de Pasto to the beat of your music: it measures your speed with GPS, computes your step cadence and adapts the music in real time while guiding you on foot along historic routes with an audio guide.",
      highlights: [
        "3D vector map with MapLibre and MapTiler, day/night mode and Pasto landmarks with coordinates verified on OpenStreetMap.",
        "Turn-by-turn walking navigation (FOSSGIS OSRM) that reroutes when you stray, plus historic-center routes with a spoken audio guide.",
        "Step rhythm: music speeds up or slows down without changing pitch to match your cadence, with Audius, live radio and Spotify (PKCE).",
        "Supabase accounts and stats with RLS, and screen-off walks thanks to a foreground service.",
      ],
      reward: "The music follows your steps as you walk around Pasto",
      media: {
        ...es.projects[3].media,
        images: [
          { src: "/projects/georhythm/01-explorar-pasto.jpg", alt: "3D map of downtown Pasto with points of interest" },
          { src: "/projects/georhythm/02-rutas-historicas.jpg", alt: "Recommended historic-center routes with audio guide" },
          { src: "/projects/georhythm/03-ritmo-al-paso.jpg", alt: "Step rhythm with radio stations matched by BPM" },
          { src: "/projects/georhythm/04-mapa-noche-musica.jpg", alt: "Night-mode map with the route and music playing" },
          { src: "/projects/georhythm/05-spotify.jpg", alt: "Spotify playlists connected to the app" },
        ],
      },
    },
  ],

  story: [
    {
      ...es.story[0],
      title: "Software Engineering",
      entity: "Universidad Cooperativa de Colombia (UCC) — Pasto campus",
      period: "2024 – Present",
      description: "Advanced training in software engineering, systems architecture and data structures.",
      achievements: [
        "Built complete software projects (frontend, backend and databases).",
        "Applied hardware performance evaluation methods (cache and processing benchmarking).",
        "Academic projects such as DEAD echo, a Unity 6 video game for the Interface Design course.",
      ],
      skills: ["Systems architecture", "Data structures", "Databases", "Benchmarking"],
    },
    {
      ...es.story[1],
      title: "Developer and Digital Designer",
      entity: "Freelance projects and collaborations — independent and institutional clients",
      period: "2024 – Present",
      description: "Digital proposals and design pieces for businesses, institutions and communities.",
      achievements: [
        "Restaurante Candela: digital proposals and event management.",
        "Metropolitan Police of San Juan de Pasto: design and layout of official recognition documents (Colonel Andrea Carolina Cáceres Naranjo, Secretary Giovanny Albeyro Guerrero Salas).",
        "Digital communities: banners, flyers and logos for servers (Families Garage).",
      ],
      skills: ["Graphic design", "Layout", "Branding", "Event management"],
    },
  ],

  skillTree: [
    {
      branch: "Frontend & Mobile",
      icon: "⚛️",
      nodes: [
        { name: "React & Next.js", rank: 4, detail: "Building interfaces and Server Components." },
        { name: "Kotlin & Jetpack Compose", rank: 4, detail: "Native Android development." },
        { name: "Tailwind CSS & Vite", rank: 5, detail: "Utility-first styling and fast bundling." },
        { name: "HTML, CSS & TS/JS", rank: 5, detail: "Solid fundamentals and strict typing." },
      ],
    },
    {
      branch: "Backend & Cloud",
      icon: "🧠",
      nodes: [
        { name: "Java Spring Boot", rank: 4, detail: "Robust APIs and enterprise architectures." },
        { name: "Node.js & NestJS", rank: 4, detail: "Scalable, asynchronous servers." },
        { name: "AWS", rank: 3, detail: "Serverless, S3, Lambda, IAM and Cognito." },
        { name: "SQL & PostgreSQL", rank: 4, detail: "Advanced relational modeling." },
        { name: "Python", rank: 3, detail: "Scripting, computer vision and automation." },
      ],
    },
    {
      branch: "Tools & environment",
      icon: "🛠️",
      nodes: [
        { name: "IntelliJ IDEA, Android Studio & VS Code", rank: 5, detail: "Everyday development environments." },
        { name: "Git, GitHub & Docker (WSL2)", rank: 4, detail: "Version control and DevOps." },
        { name: "Unity 6", rank: 4, detail: "Game engine with C#." },
        { name: "Claude Code & MCP", rank: 4, detail: "AI tools and the Model Context Protocol." },
      ],
    },
  ],

  rankLabels: { 1: "Apprentice", 2: "Basic", 3: "Competent", 4: "Advanced", 5: "Expert" },

  allies: [
    {
      ...es.allies[0],
      role: "Software Engineering Professor",
      text: "Juan Diego was one of the most outstanding students in my engineering modules. His ability to design scalable architectures and his attention to detail in frontend development are exceptional. In complex projects, such as building automated inventory systems, he always showed impeccable technical leadership and strong product vision.",
    },
    {
      ...es.allies[1],
      text: "I've reviewed Juan Diego's code and it has the level of technical maturity we look for in the e-commerce industry. His focus on performance optimization, clean React interfaces and his understanding of the whole Fullstack ecosystem make him a developer who truly knows how to build software that scales.",
    },
    {
      ...es.allies[2],
      text: "Collaborating and debating software architecture with Juan Diego is a guarantee of quality. He has an end-to-end view of the development cycle, from a robust Spring Boot backend to fluid, accessible web interfaces. His ability to solve real business problems with clean, maintainable code is his greatest strength.",
    },
  ],

  chapters: [
    { id: "inicio", short: "Home", title: "Home", objective: "Introduction" },
    { id: "perfil", short: "About", title: "About me", objective: "Who I am and how I work" },
    { id: "misiones", short: "Projects", title: "Projects", objective: "Featured work" },
    { id: "historia", short: "Experience", title: "Experience", objective: "Work and education" },
    { id: "arena", short: "Skills", title: "Skills", objective: "Tech stack" },
    { id: "aliados", short: "Testimonials", title: "Testimonials", objective: "What people say" },
    { id: "contacto", short: "Contact", title: "Contact", objective: "Let's talk" },
  ],
};

export const CONTENT: Record<Lang, Content> = { es, en };

/** Perfil base (en español) para metadatos del servidor. */
export const profile = es.profile;
