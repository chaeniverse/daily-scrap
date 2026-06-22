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

      <section className="archive">
        <ul className="archive-list">
          {guides.map((g) => (
            <li className="archive-item" key={g.slug}>
              <a href={`/guide/${g.slug}`}>
                <span className="ai-title">
                  {g.emoji} {g.title}
                </span>
                <span className="ai-date">{g.subtitle}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
