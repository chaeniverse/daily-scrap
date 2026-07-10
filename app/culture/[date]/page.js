import { notFound } from "next/navigation";
import { getAllCultures, getCultureByDate } from "../../../lib/cultures";
import ScrapView from "../../_components/ScrapView";
import ScrapDateSelector from "../../_components/ScrapDateSelector";
import MemoDock from "../../_components/MemoDock";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCultures().map((s) => ({ date: s.date }));
}

export function generateMetadata({ params }) {
  const s = getCultureByDate(params.date);
  return { title: s ? `문화/엔터 (${s.displayDate})` : "스크랩" };
}

export default function CultureDatePage({ params }) {
  const cultures = getAllCultures();
  const s = getCultureByDate(params.date);
  if (!s) notFound();

  const dates = cultures.map((x) => ({ date: x.date, displayDate: x.displayDate }));
  const latestDate = cultures[0]?.date;

  return (
    <>
      <a className="back-link" href="/culture">← 스크랩 목록으로</a>
      <section className="page-intro">
        <ScrapDateSelector
          dates={dates}
          currentDate={s.date}
          latestDate={latestDate}
          basePath="/culture"
        />
      </section>
      <ScrapView data={s.data} />
      <MemoDock
        storageKey={`memo:culture:${s.date}`}
        title={`문화/엔터 · ${s.displayDate}`}
      />
    </>
  );
}
