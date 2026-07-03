import { notFound } from "next/navigation";
import { getAllScraps, getScrapByDate } from "../../../lib/scraps";
import ScrapView from "../../_components/ScrapView";
import ScrapDateSelector from "../../_components/ScrapDateSelector";
import MemoBox from "../../_components/MemoBox";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllScraps().map((s) => ({ date: s.date }));
}

export function generateMetadata({ params }) {
  const s = getScrapByDate(params.date);
  return { title: s ? `AI 채용 스크랩 (${s.displayDate})` : "스크랩" };
}

export default function ScrapDatePage({ params }) {
  const scraps = getAllScraps();
  const s = getScrapByDate(params.date);
  if (!s) notFound();

  const dates = scraps.map((x) => ({ date: x.date, displayDate: x.displayDate }));
  const latestDate = scraps[0]?.date;

  return (
    <>
      <a className="back-link" href="/scrap">← 스크랩 목록으로</a>
      <section className="page-intro">
        <ScrapDateSelector
          dates={dates}
          currentDate={s.date}
          latestDate={latestDate}
        />
      </section>
      <ScrapView data={s.data} />
      <MemoBox storageKey={`memo:scrap:${s.date}`} />
    </>
  );
}
