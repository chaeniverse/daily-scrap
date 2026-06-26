import fs from "fs";
import path from "path";

const REPORTS_DIR = path.join(process.cwd(), "stock-report");

// 브리핑에서 숨길 문구 정리: 상단 면책 블록인용, '객관적 포인트' 안내 줄 제거,
// 그리고 '뉴스에 등장한 회사들 — 사실 정보' 제목에서 '— 사실 정보' 제거.
function cleanReportText(md) {
  const lines = md.split("\n").filter((l) => {
    if (/먼저 읽어주세요/.test(l)) return false; // 상단 면책 블록인용
    if (/객관적 포인트입니다/.test(l)) return false; // "어디를 사라가 아니라..." 줄
    return true;
  });
  let out = lines.join("\n");
  out = out.replace(/(뉴스에 등장한 회사들)\s*—\s*사실 정보/g, "$1");
  out = out.replace(/\n{3,}/g, "\n\n"); // 제거로 생긴 과도한 빈 줄 정리
  return out;
}

// 브리핑에서 숨길 섹션: 3. 포트폴리오 설계 예시 / 4. 관전 포인트 (및 그 이후).
// 해당 제목이 처음 나오는 지점부터 문서 끝까지 잘라낸다.
function stripHiddenSections(md) {
  const lines = md.split("\n");
  let cut = -1;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^#{1,6}\s+(.*)$/);
    if (m) {
      const t = m[1];
      if (/^3\.|^4\.|포트폴리오 설계 예시|관전\s*포인트/.test(t)) {
        cut = i;
        break;
      }
    }
  }
  if (cut === -1) return md;
  const out = lines.slice(0, cut);
  // 잘린 끝에 남는 빈 줄/구분선(---) 정리
  while (out.length && /^\s*(-{3,}|\s*)$/.test(out[out.length - 1])) out.pop();
  return out.join("\n").trimEnd() + "\n";
}

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
    content: stripHiddenSections(cleanReportText(raw)),
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
