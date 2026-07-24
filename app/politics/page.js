import { getAllPolitics } from "../../lib/politics";
import ScrapView from "../_components/ScrapView";
import ScrapDateSelector from "../_components/ScrapDateSelector";
import MemoDock from "../_components/MemoDock";

export const dynamic = "force-static";

export const metadata = {
  title: "정치",
};

export default function PoliticsHome() {
  const items = getAllPolitics();

  if (items.length === 0) {
    return (
      <>
        <a className="back-link" href="/">← 홈으로</a>
        <section className="page-intro">
          <h1>아직 스크랩이 없습니다</h1>
          <p>매일 자동으로 정리된 국내·해외 정치 및 유학/학계 정책 스크랩이 이곳에 표시됩니다.</p>
        </section>
      </>
    );
  }

  const [latest, ...rest] = items;
  const dates = items.map((s) => ({ date: s.date, displayDate: s.displayDate }));

  return (
    <>
      <a className="back-link" href="/">← 홈으로</a>
      <section className="page-intro">
        <h1>🏛️ 정치</h1>
        <p className="page-desc">국내·해외 정치 + 미국/해외 유학·학계 정책(비자·연구비·대학)</p>
        <ScrapDateSelector
          dates={dates}
          currentDate={latest.date}
          latestDate={latest.date}
          basePath="/politics"
        />
      </section>

      <ScrapView data={latest.data} />

      <MemoDock
        storageKey={`memo:politics:${latest.date}`}
        title={`정치 · ${latest.displayDate}`}
      />

      {rest.length > 0 && (
        <section className="archive">
          <h2>지난 스크랩</h2>
          {Object.entries(
            rest.reduce((acc, s) => {
              (acc[s.month] = acc[s.month] || []).push(s);
              return acc;
            }, {})
          ).map(([month, list]) => (
            <div className="archive-month" key={month}>
              <h3 className="archive-month-title">{month}</h3>
              <div className="date-grid">
                {list.map((s) => (
                  <a className="date-card" href={`/politics/${s.date}`} key={s.date}>
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
