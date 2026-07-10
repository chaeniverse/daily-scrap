import fs from "fs";
import path from "path";

const CULTURE_DIR = path.join(process.cwd(), "culture-data");

function fmtDate(d) {
  const [y, m, dd] = d.split("-");
  return `${y}년 ${Number(m)}월 ${Number(dd)}일`;
}

const WD = ["일", "월", "화", "수", "목", "금", "토"];
function fmtShort(d) {
  const [y, m, dd] = d.split("-");
  const wd = WD[new Date(`${d}T00:00:00`).getDay()];
  return `${Number(m)}월 ${Number(dd)}일 (${wd})`;
}
function fmtMonth(d) {
  const [y, m] = d.split("-");
  return `${y}년 ${Number(m)}월`;
}

// culture-data/YYYY-MM-DD.json 들을 읽어 최신순으로 반환
export function getAllCultures() {
  if (!fs.existsSync(CULTURE_DIR)) return [];
  const files = fs
    .readdirSync(CULTURE_DIR)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f));
  const cultures = files.map((f) => {
    const date = f.replace(/\.json$/, "");
    let data = {};
    try {
      data = JSON.parse(fs.readFileSync(path.join(CULTURE_DIR, f), "utf8"));
    } catch (e) {
      data = {};
    }
    return {
      date,
      displayDate: fmtDate(date),
      shortDate: fmtShort(date),
      month: fmtMonth(date),
      title: data.title || "문화/엔터 스크랩",
      data,
    };
  });
  cultures.sort((a, b) => b.date.localeCompare(a.date));
  return cultures;
}

export function getCultureByDate(date) {
  return getAllCultures().find((s) => s.date === date) || null;
}
