import { notFound } from "next/navigation";
import { getAllReports, getReportBySlug } from "../../../lib/reports";
import Markdown from "../../_components/Markdown";

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
  const report = getReportBySlug(params.slug);
  if (!report) notFound();

  return (
    <>
      <a className="back-link" href="/">← 최신 리포트로</a>
      <article>
        <Markdown>{report.content}</Markdown>
      </article>
    </>
  );
}
