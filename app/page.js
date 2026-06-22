import Link from "next/link";

export const dynamic = "force-static";

const TILES = [
  {
    key: "투자 브리핑",
    href: "/briefing",
    emoji: "📈",
    title: "투자 브리핑",
    subtitle: "매일 갱신 · 테크/AI·증시 + 포트폴리오",
  },
  {
    key: "금융상품 가이드",
    href: "/guide",
    emoji: "📚",
    title: "금융상품 가이드",
    subtitle: "펀드·ETF·시장지표·코인 등 쉽게 정리",
  },
];

export default function Home() {
  return (
    <>
      <section className="home-intro">
        <h1>💰 채를 위한 투자 공간</h1>
        <p>매일 갱신되는 브리핑과 금융상품 기초 가이드</p>
      </section>

      <div className="tile-grid two">
        {TILES.map((t) => (
          <Link className="tile" href={t.href} key={t.key}>
            <span className="tile-emoji">{t.emoji}</span>
            <span className="tile-title">{t.title}</span>
            <span className="tile-sub">{t.subtitle}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
