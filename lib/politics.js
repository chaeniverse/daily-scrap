import fs from "fs";
import path from "path";

const POLITICS_DIR = path.join(process.cwd(), "politics-data");

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

// politics-data/YYYY-MM-DD.json 들을 읽어 최신순으로 반환
export function getAllPolitics() {
  if (!fs.existsSync(POLITICS_DIR)) return [];
  const files = fs
    .readdirSync(POLITICS_DIR)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f));
  const items = files.map((f) => {
    const date = f.replace(/\.json$/, "");
    let data = {};
    try {
      data = JSON.parse(fs.readFileSync(path.join(POLITICS_DIR, f), "utf8"));
    } catch (e) {
      data = {};
    }
    return {
      date,
      displayDate: fmtDate(date),
      shortDate: fmtShort(date),
      month: fmtMonth(date),
      title: data.title || "정치 스크랩",
      data,
    };
  });
  items.sort((a, b) => b.date.localeCompare(a.date));
  return items;
}

export function getPoliticsByDate(date) {
  return getAllPolitics().find((s) => s.date === date) || null;
}
