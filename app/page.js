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
  {
    key: "채용 스크랩",
    href: "/scrap",
    emoji: "🗞️",
    title: "AI 채용 뉴스 스크랩",
    subtitle: "카카오·CJ올리브영·넷플릭스 + 직무 트렌드",
  },
  {
    key: "내 메모",
    href: "/memos",
    emoji: "🧷",
    title: "내 메모 모아보기",
    subtitle: "브리핑·가이드·스크랩 메모를 한 곳에",
  },
];

export default function Home() {
  return (
    <>
      <section className="home-intro">
        <h1>🗞️ 채를 위한 데일리 스크랩</h1>
        <p>매일 갱신되는 투자 브리핑 · 금융상품 가이드 · AI 채용 뉴스</p>
      </section>

      <div className="tile-grid">
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
