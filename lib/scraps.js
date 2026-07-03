import fs from "fs";
import path from "path";

const SCRAP_DIR = path.join(process.cwd(), "scrap-data");

function fmtDate(d) {
  const [y, m, dd] = d.split("-");
  return `${y}년 ${Number(m)}월 ${Number(dd)}일`;
}

// scrap-data/YYYY-MM-DD.json 들을 읽어 최신순으로 반환
export function getAllScraps() {
  if (!fs.existsSync(SCRAP_DIR)) return [];
  const files = fs
    .readdirSync(SCRAP_DIR)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f));
  const scraps = files.map((f) => {
    const date = f.replace(/\.json$/, "");
    let data = {};
    try {
      data = JSON.parse(fs.readFileSync(path.join(SCRAP_DIR, f), "utf8"));
    } catch (e) {
      data = {};
    }
    return {
      date,
      displayDate: fmtDate(date),
      title: data.title || "AI 채용 뉴스 스크랩",
      data,
    };
  });
  scraps.sort((a, b) => b.date.localeCompare(a.date));
  return scraps;
}

export function getScrapByDate(date) {
  return getAllScraps().find((s) => s.date === date) || null;
}
