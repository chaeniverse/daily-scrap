import { notFound } from "next/navigation";
import { getAllReports, getReportBySlug } from "../../../lib/reports";
import Markdown from "../../_components/Markdown";
import DateSelector from "../../_components/DateSelector";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllReports().map((r) => ({ slug: r.slug }));
}

export function generateMetadata({ params }) {
  const report = getReportBySlug(params.slug);
  return { title: report ? `${report.title} (${report.displayDate})` : "리포트" };
}

export default function ReportPage({ params }) {
  const reports = getAllReports();
  const report = getReportBySlug(params.slug);
  if (!report) notFound();

  const dateList = reports.map((r) => ({ slug: r.slug, displayDate: r.displayDate }));
  const latestSlug = reports[0]?.slug;

  return (
    <>
      <section className="page-intro">
        <DateSelector
          reports={dateList}
          currentSlug={report.slug}
          latestSlug={latestSlug}
        />
      </section>
      <article>
        <Markdown>{report.content}</Markdown>
      </article>
      <a className="back-link" href="/">← 최신 리포트로</a>
    </>
  );
}
