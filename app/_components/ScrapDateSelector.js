"use client";

import { useRouter } from "next/navigation";

export default function ScrapDateSelector({ dates, currentDate, latestDate }) {
  const router = useRouter();
  function handleChange(e) {
    const d = e.target.value;
    if (d === latestDate) router.push("/scrap");
    else router.push(`/scrap/${d}`);
  }
  return (
    <div className="date-selector">
      <span className="ds-label">스크랩 날짜</span>
      <div className="ds-control">
        <select
          className="ds-select"
          value={currentDate}
          onChange={handleChange}
          aria-label="스크랩 날짜 선택"
        >
          {dates.map((d) => (
            <option key={d.date} value={d.date}>
              {d.displayDate}
              {d.date === latestDate ? " · 최신" : ""}
            </option>
          ))}
        </select>
        <span className="ds-caret" aria-hidden="true">▾</span>
      </div>
    </div>
  );
}
