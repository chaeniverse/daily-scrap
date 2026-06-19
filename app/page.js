import { getAllReports } from "../lib/reports";
import Markdown from "./_components/Markdown";
import DateSelector from "./_components/DateSelector";

export const dynamic = "force-static";

export default function Home() {
  const reports = getAllReports();

  if (reports.length === 0) {
    return (
      <section className="page-intro">
        <h1>아직 리포트가 없습니다</h1>
        <p>매일 오전 자동으로 생성된 투자 브리핑이 이곳에 표시됩니다.</p>
      </section>
    );
  }

  const [latest, ...rest] = reports;
  const dateList = reports.map((r) => ({ slug: r.slug, displayDate: r.displayDate }));

  return (
    <>
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

      {rest.length > 0 && (
        <section className="archive">
          <h2>지난 리포트</h2>
          <ul className="archive-list">
            {rest.map((r) => (
              <li className="archive-item" key={r.slug}>
                <a href={`/report/${r.slug}`}>
                  <span className="ai-title">{r.title}</span>
                  <span className="ai-date">{r.displayDate}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
