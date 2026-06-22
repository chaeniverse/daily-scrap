import { notFound } from "next/navigation";
import { getAllGuides, getGuideBySlug } from "../../../lib/guides";
import Markdown from "../../_components/Markdown";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllGuides().map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }) {
  const guide = getGuideBySlug(params.slug);
  return { title: guide ? guide.title : "가이드" };
}

export default function GuidePost({ params }) {
  const guide = getGuideBySlug(params.slug);
  if (!guide) notFound();

  return (
    <>
      <a className="back-link" href="/guide">← 가이드 목록으로</a>
      <article>
        <Markdown>{guide.content}</Markdown>
      </article>
    </>
  );
}
