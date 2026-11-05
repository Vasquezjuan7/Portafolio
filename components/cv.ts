// Genera el CV en PDF a partir de data/portfolio.ts, en el idioma pedido.
// jsPDF se carga solo cuando alguien pide el CV.
import { CONTENT, type Lang } from "../data/portfolio";
import { UI } from "../data/i18n";

type RGB = [number, number, number];

export async function buildCv(lang: Lang) {
  const { jsPDF } = await import("jspdf");
  const c = CONTENT[lang];
  const L = UI[lang].cv;
  const p = c.profile;

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 16; // margen
  const CW = W - M * 2; // ancho de contenido
  let y = 0;

  const ACCENT: RGB = [109, 40, 217];
  const ACCENT_SOFT: RGB = [237, 233, 254];
  const INK: RGB = [24, 24, 32];
  const MUTED: RGB = [90, 90, 105];

  const color = (rgb: RGB) => doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  const font = (style: "normal" | "bold" | "italic", size: number) => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
  };
  const lineH = (size: number) => size * 0.42;

  const ensure = (space: number) => {
    if (y + space > H - 16) {
      doc.addPage();
      y = 18;
    }
  };

  /** Texto con salto de línea automático. */
  const para = (text: string, opts: { size?: number; style?: "normal" | "bold" | "italic"; rgb?: RGB; x?: number; width?: number; gap?: number } = {}) => {
    const size = opts.size ?? 9.5;
    const x = opts.x ?? M;
    const width = opts.width ?? CW - (x - M);
    font(opts.style ?? "normal", size);
    color(opts.rgb ?? INK);
    const lines = doc.splitTextToSize(text, width) as string[];
    for (const line of lines) {
      ensure(lineH(size));
      doc.text(line, x, y + lineH(size) * 0.8);
      y += lineH(size);
    }
    y += opts.gap ?? 1.2;
  };

  const bullet = (text: string, x = M + 2) => {
    font("normal", 9.2);
    const lines = doc.splitTextToSize(text, CW - (x - M) - 4) as string[];
    ensure(lineH(9.2) * Math.min(2, lines.length));
    doc.setFillColor(ACCENT[0], ACCENT[1], ACCENT[2]);
    doc.circle(x + 0.6, y + lineH(9.2) * 0.5, 0.55, "F");
    para(text, { size: 9.2, x: x + 3.5, rgb: INK, gap: 0.6 });
  };

  const section = (title: string) => {
    ensure(16);
    y += 3;
    font("bold", 11.5);
    color(ACCENT);
    doc.text(title.toUpperCase(), M, y + 4);
    doc.setDrawColor(ACCENT[0], ACCENT[1], ACCENT[2]);
    doc.setLineWidth(0.4);
    doc.line(M, y + 6.2, W - M, y + 6.2);
    y += 10;
  };

  /** Título a la izquierda y dato (fecha, año) a la derecha. */
  const heading = (left: string, right?: string) => {
    ensure(14);
    font("bold", 10.5);
    color(INK);
    const rightW = right ? doc.getTextWidth(right) + 4 : 0;
    const lines = doc.splitTextToSize(left, CW - rightW) as string[];
    doc.text(lines, M, y + 4);
    if (right) {
      font("normal", 9);
      color(MUTED);
      doc.text(right, W - M, y + 4, { align: "right" });
    }
    y += lineH(10.5) * lines.length + 1.2;
  };

  const tags = (label: string, items: string[]) => {
    para(`${label}: ${items.join(" · ")}`, { size: 8.6, rgb: MUTED, gap: 2.5 });
  };

  // ---------- Cabecera ----------
  doc.setFillColor(ACCENT_SOFT[0], ACCENT_SOFT[1], ACCENT_SOFT[2]);
  doc.rect(0, 0, W, 44, "F");
  doc.setFillColor(ACCENT[0], ACCENT[1], ACCENT[2]);
  doc.rect(0, 0, 4, 44, "F");
  y = 13;
  font("bold", 22);
  color(INK);
  doc.text(p.fullName, M, y + 3);
  y += 10;
  font("normal", 12);
  color(ACCENT);
  doc.text(p.role, M, y);
  y += 6;
  font("normal", 8.8);
  color(MUTED);
  const contactLine = [p.email, p.phoneDisplay, p.location].join("   ·   ");
  doc.text(contactLine, M, y);
  y += 4.6;
  doc.text([p.linkedinLabel, p.githubLabel].join("   ·   "), M, y);
  y = 52;

  // ---------- Perfil ----------
  section(L.profile);
  para(p.tagline, { size: 10, style: "italic", rgb: INK, gap: 2.5 });
  for (const b of p.bio) para(b, { size: 9.4, rgb: INK, gap: 2 });
  para(`${p.career} · ${p.university} · ${p.availability}`, { size: 9, style: "bold", rgb: ACCENT, gap: 1 });

  // ---------- Experiencia y formación ----------
  const block = (items: typeof c.story) => {
    for (const s of items) {
      heading(s.title, s.period);
      para(s.entity, { size: 9.2, style: "bold", rgb: ACCENT, gap: 1 });
      para(s.description, { size: 9.2, rgb: INK, gap: 1.2 });
      for (const a of s.achievements) bullet(a);
      tags(L.technologies, s.skills);
    }
  };
  section(L.experience);
  block(c.story.filter((s) => s.type === "laboral"));
  section(L.education);
  block(c.story.filter((s) => s.type === "academica"));

  // ---------- Proyectos ----------
  section(L.projects);
  for (const pr of c.projects) {
    heading(`${pr.title} — ${pr.codename}`, `${pr.category} · ${pr.year}`);
    para(`${L.role}: ${pr.role}`, { size: 9, style: "bold", rgb: ACCENT, gap: 1 });
    para(pr.description, { size: 9.2, rgb: INK, gap: 1.2 });
    for (const h of pr.highlights) bullet(h);
    para(`${L.result}: ${pr.reward}`, { size: 9, style: "italic", rgb: INK, gap: 1 });
    tags(L.technologies, pr.tags);
    para(pr.demo ? `${L.code}: ${pr.github}   ·   ${L.demo}: ${pr.demo}` : `${L.code}: ${pr.github}`, { size: 8.2, rgb: MUTED, gap: 3 });
  }

  // ---------- Habilidades ----------
  section(L.skills);
  for (const br of c.skillTree) {
    ensure(12);
    para(br.branch, { size: 10, style: "bold", rgb: INK, gap: 1 });
    // Solo el nombre de la habilidad y lo que sé hacer con ella, sin niveles ni barras.
    for (const n of br.nodes) {
      ensure(10);
      font("bold", 9.2);
      color(INK);
      doc.text(n.name, M + 2, y + 3.2);
      y += 4.4;
      para(n.detail, { size: 8.4, rgb: MUTED, x: M + 2, gap: 1.4 });
    }
    y += 1.5;
  }

  // ---------- Idiomas, intereses y valores ----------
  section(L.languages);
  para(p.languages.join("   ·   "), { size: 9.4, gap: 2 });

  section(L.interests);
  for (const it of p.interests) bullet(`${it.label}: ${it.detail}`);

  section(L.values);
  for (const v of p.values) bullet(`${v.label}: ${v.detail}`);

  // ---------- Referencias ----------
  section(L.references);
  for (const a of c.allies) {
    ensure(18);
    para(`${a.name} — ${a.role}, ${a.organization}`, { size: 9.4, style: "bold", rgb: INK, gap: 0.8 });
    para(`"${a.text}"`, { size: 9, style: "italic", rgb: MUTED, gap: 3 });
  }

  // ---------- Pie de página ----------
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    font("normal", 7.5);
    color(MUTED);
    doc.text(`${p.fullName} · ${L.generated}`, M, H - 8);
    doc.text(`${L.page} ${i} / ${pages}`, W - M, H - 8, { align: "right" });
  }

  const fileName = `${p.fullName.replace(/\s+/g, "_")}_CV_${L.fileSuffix}.pdf`;
  return { doc, fileName };
}

/** Descarga el CV como archivo PDF. */
export async function downloadCv(lang: Lang) {
  const { doc, fileName } = await buildCv(lang);
  doc.save(fileName);
}

/** Abre el CV en una pestaña nueva para verlo. */
export async function openCv(lang: Lang) {
  // La pestaña se abre antes de generar el PDF para que el navegador no la bloquee.
  const tab = window.open("", "_blank");
  const { doc, fileName } = await buildCv(lang);
  const url = URL.createObjectURL(doc.output("blob"));
  if (tab) {
    tab.document.title = fileName;
    tab.location.href = url;
  } else {
    window.location.href = url;
  }
}
