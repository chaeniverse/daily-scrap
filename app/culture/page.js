import { getAllCultures } from "../../lib/cultures";
import ScrapView from "../_components/ScrapView";
import ScrapDateSelector from "../_components/ScrapDateSelector";
import MemoDock from "../_components/MemoDock";

export const dynamic = "force-static";

export const metadata = {
  title: "문화/엔터",
};

export default function CultureHome() {
  const cultures = getAllCultures();

  if (cultures.length === 0) {
    return (
      <>
        <a className="back-link" href="/">← 홈으로</a>
        <section className="page-intro">
          <h1>아직 스크랩이 없습니다</h1>
          <p>매일 자동으로 정리된 문화/엔터 뉴스 스크랩이 이곳에 표시됩니다.</p>
        </section>
      </>
    );
  }

  const [latest, ...rest] = cultures;
  const dates = cultures.map((s) => ({ date: s.date, displayDate: s.displayDate }));

  return (
    <>
      <a className="back-link" href="/">← 홈으로</a>
      <section className="page-intro">
        <h1>🎬 문화/엔터</h1>
        <ScrapDateSelector
          dates={dates}
          currentDate={latest.date}
          latestDate={latest.date}
          basePath="/culture"
        />
      </section>

      <ScrapView data={latest.data} />

      <MemoDock
        storageKey={`memo:culture:${latest.date}`}
        title={`문화/엔터 · ${latest.displayDate}`}
      />

      {rest.length > 0 && (
        <section className="archive">
          <h2>지난 스크랩</h2>
          {Object.entries(
            rest.reduce((acc, s) => {
              (acc[s.month] = acc[s.month] || []).push(s);
              return acc;
            }, {})
          ).map(([month, items]) => (
            <div className="archive-month" key={month}>
              <h3 className="archive-month-title">{month}</h3>
              <div className="date-grid">
                {items.map((s) => (
                  <a className="date-card" href={`/culture/${s.date}`} key={s.date}>
                    {s.shortDate}
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
