// 하루치 스크랩 렌더 (추적 직무 칩 + 카테고리별 카드)
export default function ScrapView({ data }) {
  const jobs = data?.tracked_jobs || [];
  const sections = data?.sections || [];
  return (
    <div className="scrap">
      {jobs.length > 0 && (
        <div className="scrap-jobs">
          {jobs.map((j, i) => (
            <span className="scrap-chip" key={i}>
              {j.company} · {j.role}
            </span>
          ))}
        </div>
      )}
      {sections.map((sec, si) => (
        <div key={si}>
          <div className="scrap-section-title">{sec.category}</div>
          {(sec.items || []).map((it, ii) => (
            <div className="scrap-card" key={ii}>
              <div className="scrap-co">{it.company}</div>
              {it.url ? (
                <a
                  className="scrap-t"
                  href={it.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {it.title}
                </a>
              ) : (
                <span className="scrap-t">{it.title}</span>
              )}
              <p className="scrap-s">{it.summary}</p>
              {it.source && <div className="scrap-src">출처: {it.source}</div>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
