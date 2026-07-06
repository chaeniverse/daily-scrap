import { getAllReports } from "../../lib/reports";
import Markdown from "../_components/Markdown";
import DateSelector from "../_components/DateSelector";
import MemoDock from "../_components/MemoDock";

export const dynamic = "force-static";

export default function Briefing() {
  const reports = getAllReports();

  if (reports.length === 0) {
    return (
      <>
        <a className="back-link" href="/">← 홈으로</a>
        <section className="page-intro">
          <h1>아직 리포트가 없습니다</h1>
          <p>매일 오전 자동으로 생성된 투자 브리핑이 이곳에 표시됩니다.</p>
        </section>
      </>
    );
  }

  const [latest, ...rest] = reports;
  const dateList = reports.map((r) => ({ slug: r.slug, displayDate: r.displayDate }));

  return (
    <>
      <a className="back-link" href="/">← 홈으로</a>
      <section className="page-intro">
        <DateSelector
          reports={dateList}
          currentSlug={latest.slug}
          latestSlug={latest.slug}
        />
      </section>

      <article>
        <Markdown>{latest.content}</Markdown>
      </article>

      <MemoDock
        storageKey={`memo:report:${latest.slug}`}
        title={`투자 브리핑 · ${latest.displayDate}`}
      />

      {rest.length > 0 && (
        <section className="archive">
          <h2>지난 리포트</h2>
          {Object.entries(
            rest.reduce((acc, r) => {
              const key = r.month || "기타";
              (acc[key] = acc[key] || []).push(r);
              return acc;
            }, {})
          ).map(([month, items]) => (
            <div className="archive-month" key={month}>
              <h3 className="archive-month-title">{month}</h3>
              <div className="date-grid">
                {items.map((r) => (
                  <a className="date-card" href={`/report/${r.slug}`} key={r.slug}>
                    {r.shortDate}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </>
  );
}
