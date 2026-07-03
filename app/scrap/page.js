import { getAllScraps } from "../../lib/scraps";
import ScrapView from "../_components/ScrapView";
import ScrapDateSelector from "../_components/ScrapDateSelector";

export const dynamic = "force-static";

export const metadata = {
  title: "AI 채용 뉴스 스크랩",
};

export default function ScrapHome() {
  const scraps = getAllScraps();

  if (scraps.length === 0) {
    return (
      <>
        <a className="back-link" href="/">← 홈으로</a>
        <section className="page-intro">
          <h1>아직 스크랩이 없습니다</h1>
          <p>매일 자동으로 정리된 AI 채용 뉴스 스크랩이 이곳에 표시됩니다.</p>
        </section>
      </>
    );
  }

  const [latest, ...rest] = scraps;
  const dates = scraps.map((s) => ({ date: s.date, displayDate: s.displayDate }));

  return (
    <>
      <a className="back-link" href="/">← 홈으로</a>
      <section className="page-intro">
        <h1>🗞️ AI 채용 뉴스 스크랩</h1>
        <ScrapDateSelector
          dates={dates}
          currentDate={latest.date}
          latestDate={latest.date}
        />
      </section>

      <ScrapView data={latest.data} />

      {rest.length > 0 && (
        <section className="archive">
          <h2>지난 스크랩</h2>
          <ul className="archive-list">
            {rest.map((s) => (
              <li className="archive-item" key={s.date}>
                <a href={`/scrap/${s.date}`}>
                  <span className="ai-title">{s.title}</span>
                  <span className="ai-date">{s.displayDate}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
