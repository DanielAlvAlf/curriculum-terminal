/* ============================================
   CV Retro OS — data.js
   Todo el contenido del CV. Edita aquí.
   ============================================ */

const CV = {
  profile: {
    name: "Daniel Álvarez Alfonso",
    role: "Desarrollador Web en Formación",
    tagline: "De las redes LTE al código: 9+ años resolviendo problemas técnicos, ahora construyendo para la web.",
    github: "https://github.com/DanielAlvAlf",
    linkedin: "https://www.linkedin.com/in/daniel-%C3%A1lvarez-alfonso",
    email: "daniel.alvarez.3991@gmail.com",
    about:
      "Técnico de telecomunicaciones con más de 9 años instalando redes LTE, radioenlaces y cableado estructurado para Huawei, Nokia y Ericsson. " +
      "Estoy cursando el Grado Superior en Desarrollo de Aplicaciones Web (DAW) para dar el salto al desarrollo de software. " +
      "Aporto método de trabajo en campo, diagnóstico de averías bajo presión y muchas ganas de crecer en front-end y back-end. " +
      "Disponible para prácticas desde marzo de 2027, con preferencia por trabajo en remoto. Carné de conducir.",
  },

  experience: [
    {
      company: "Nodo Comunicaciones",
      role: "Técnico de Radio",
      period: "Jun 2023 — May 2026",
      achievements: [
        "Instalación de infraestructura de red para Huawei, Nokia y Ericsson",
        "Ejecución de obras LTE e integración de sistemas de telecomunicaciones",
        "Configuración de radioenlaces y montaje de cableado estructurado",
        "Gestión de incidencias y mantenimiento preventivo en campo",
      ],
    },
    {
      company: "Insyte Instalaciones",
      role: "Técnico de Radio",
      period: "Jun 2020 — Jun 2023",
      achievements: [
        "Obras LTE, integraciones y configuración de enlaces para Huawei y Nokia",
        "Montaje de cableado estructurado y sistemas de comunicaciones",
        "Coordinación con ingeniería para el despliegue de infraestructura",
      ],
    },
    {
      company: "Navegatel / Arcetel SL (FONE)",
      role: "Técnico de Telecomunicaciones",
      period: "Abr 2015 — Jun 2020",
      achievements: [
        "Instalación y mantenimiento de redes Wimax",
        "Montaje y mantenimiento de centros emisores",
        "Diagnóstico y resolución de averías en campo",
      ],
    },
  ],

  projects: [
    {
      name: "CV Retro OS",
      description: "Este mismo CV: una web estática que imita Windows 95 y Ubuntu 10.04, con tema intercambiable, sonidos retro y versión imprimible en A4.",
      stack: ["HTML", "CSS", "JavaScript", "Bootstrap 4"],
      link: "https://github.com/DanielAlvAlf/curriculum-terminal",
    },
    {
      name: "PulseRig",
      description: "Proyecto DAW: bitácora de mantenimiento y salud del hardware, con Health Score por equipo, almacén de componentes, catálogo y Outlet.",
      stack: ["HTML", "CSS", "MySQL"],
      link: "https://github.com/DanielAlvAlf/PulseRig",
    },
    {
      name: "Contribuciones open source",
      description: "Primeras contribuciones a proyectos reales con flujo fork → rama → pull request: correcciones de la traducción al español en Invoice Ninja y BookStack, y PR aceptada en first-contributions.",
      stack: ["Git", "GitHub", "Pull requests"],
      link: "https://github.com/search?q=author%3ADanielAlvAlf+type%3Apr&type=pullrequests",
    },
  ],

  // Grupos de skills: "título": [lista]
  skills: {
    "Desarrollo web": ["HTML / CSS", "JavaScript", "Bootstrap", "SQL / MySQL", "Git / GitHub"],
    "Cloud e IA": ["AWS (fundamentos)", "Desarrollo con IA y agentes"],
    "Redes y telecomunicaciones": ["LTE / 4G", "Radioenlaces", "Wimax", "CCNA (Cisco)", "Huawei / Nokia / Ericsson", "Cableado estructurado"],
  },

  education: [
    { degree: "Técnico Superior en Desarrollo de Aplicaciones Web (DAW)", institution: "IES Macià Abela", year: "2025 — En curso" },
    { degree: "Técnico Superior en Sistemas Informáticos y de Telecomunicaciones", institution: "IES La Torreta", year: "2015" },
    { degree: "Bachillerato Científico-Técnico", institution: "IES Canónigo Manchón", year: "2011" },
  ],

  // Grupos de certificaciones: "título": [lista]
  certifications: {
    "Tecnología": [
      { name: "Fundamentos de AWS: Cloud, Serverless y Operación", issuer: "Commit Academy", year: "2026" },
      { name: "Curso de IA: de 0 a Agentes (6h)", issuer: "BIG school", year: "2026" },
      { name: "Desarrollo con IA: de 0 a Producción (6h)", issuer: "BIG school", year: "2026" },
      { name: "TELCO 1 y TELCO 2", issuer: "UNITEC", year: "2020" },
      { name: "CCNA Discovery", issuer: "Cisco", year: "2014" },
    ],
    "Seguridad y PRL": [
      { name: "AVSAF Peatones", issuer: "AENA", year: "2022" },
      { name: "Operador PEMP", issuer: "UNITEC", year: "2021" },
      { name: "Rescate en alturas (8h)", issuer: "Academia Serrano", year: "2021" },
      { name: "PRL básico construcción (60h)", issuer: "AC Prevención", year: "2019" },
      { name: "Trabajos en instalaciones telecom (6h)", issuer: "AC Prevención", year: "2019" },
      { name: "Seguridad en estructuras metálicas (8h)", issuer: "—", year: "2018" },
    ],
  },
};
