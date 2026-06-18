import fs from "fs";
import path from "path";

const REPORTS_DIR = path.join(process.cwd(), "stock-report");

// 파일명 예: "2026-06-17 stock report.md"
function parseFile(file) {
  const raw = fs.readFileSync(path.join(REPORTS_DIR, file), "utf8");
  const dateMatch = file.match(/(\d{4}-\d{2}-\d{2})/);
  const fileDate = dateMatch ? dateMatch[1] : "";

  // 문서 상단 제목(첫 H1)과 본문에 적힌 작성일을 우선 사용
  const h1 = raw.match(/^#\s+(.+)$/m);
  const title = h1 ? h1[1].replace(/[📈]/gu, "").trim() : file.replace(/\.md$/, "");

  // 본문 둘째 줄의 "**2026년 6월 18일**" 같은 표기를 표시용 날짜로
  const displayMatch = raw.match(/\*\*(\d{4}년\s*\d{1,2}월\s*\d{1,2}일)\*\*/);
  const displayDate = displayMatch ? displayMatch[1].replace(/\s+/g, " ") : fileDate;

  return {
    slug: fileDate,           // URL용 (주 시작일, 주차별 고유)
    fileDate,                 // 정렬용 (YYYY-MM-DD)
    displayDate,              // 화면 표시용
    title,
    content: raw,
  };
}

export function getAllReports() {
  if (!fs.existsSync(REPORTS_DIR)) return [];
  const files = fs.readdirSync(REPORTS_DIR).filter((f) => f.endsWith(".md"));
  const reports = files.map(parseFile).filter((r) => r.fileDate);
  reports.sort((a, b) => b.fileDate.localeCompare(a.fileDate));
  return reports;
}

export function getReportBySlug(slug) {
  return getAllReports().find((r) => r.slug === slug) || null;
}
