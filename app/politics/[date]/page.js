import { notFound } from "next/navigation";
import { getAllPolitics, getPoliticsByDate } from "../../../lib/politics";
import ScrapView from "../../_components/ScrapView";
import ScrapDateSelector from "../../_components/ScrapDateSelector";
import MemoDock from "../../_components/MemoDock";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPolitics().map((s) => ({ date: s.date }));
}

export function generateMetadata({ params }) {
  const s = getPoliticsByDate(params.date);
  return { title: s ? `정치 (${s.displayDate})` : "스크랩" };
}

export default function PoliticsDatePage({ params }) {
  const items = getAllPolitics();
  const s = getPoliticsByDate(params.date);
  if (!s) notFound();

  const dates = items.map((x) => ({ date: x.date, displayDate: x.displayDate }));
  const latestDate = items[0]?.date;

  return (
    <>
      <a className="back-link" href="/politics">← 스크랩 목록으로</a>
      <section className="page-intro">
        <ScrapDateSelector
          dates={dates}
          currentDate={s.date}
          latestDate={latestDate}
          basePath="/politics"
        />
      </section>
      <ScrapView data={s.data} />
      <MemoDock
        storageKey={`memo:politics:${s.date}`}
        title={`정치 · ${s.displayDate}`}
      />
    </>
  );
}
