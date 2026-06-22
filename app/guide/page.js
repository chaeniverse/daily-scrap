import Link from "next/link";
import { getAllGuides } from "../../lib/guides";

export const dynamic = "force-static";

export const metadata = {
  title: "금융상품 가이드",
};

export default function GuideIndex() {
  const guides = getAllGuides();

  return (
    <>
      <a className="back-link" href="/">← 홈으로</a>
      <section className="page-intro">
        <h1>📚 금융상품 가이드</h1>
        <p>주제별로 나눠 정리한 투자 기초 가이드입니다.</p>
      </section>

      <div className="tile-grid">
        {guides.map((g) => (
          <Link className="tile" href={`/guide/${g.slug}`} key={g.slug}>
            <span className="tile-emoji">{g.emoji}</span>
            <span className="tile-title">{g.title}</span>
            <span className="tile-sub">{g.subtitle}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
