"use client";

import { useRouter } from "next/navigation";

// 상단의 클릭형 날짜 선택 드롭다운.
// 생성/갱신된 리포트 날짜들만 목록에 나오고, 고르면 그 날짜 리포트로 이동한다.
export default function DateSelector({ reports, currentSlug, latestSlug }) {
  const router = useRouter();

  function handleChange(e) {
    const slug = e.target.value;
    if (slug === latestSlug) router.push("/");
    else router.push(`/report/${slug}`);
  }

  return (
    <div className="date-selector">
      <span className="ds-label">리포트 날짜</span>
      <div className="ds-control">
        <select
          className="ds-select"
          value={currentSlug}
          onChange={handleChange}
          aria-label="리포트 날짜 선택"
        >
          {reports.map((r) => (
            <option key={r.slug} value={r.slug}>
              {r.displayDate}
              {r.slug === latestSlug ? " · 최신" : ""}
            </option>
          ))}
        </select>
        <span className="ds-caret" aria-hidden="true">▾</span>
      </div>
    </div>
  );
}
