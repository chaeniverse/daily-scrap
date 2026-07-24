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
    key: "테크/AI",
    href: "/scrap",
    emoji: "🗞️",
    title: "테크/AI",
    subtitle: "테크/AI 뉴스 + 카카오·CJ올리브영·넷플릭스 직무 트렌드",
  },
  {
    key: "문화/엔터",
    href: "/culture",
    emoji: "🎬",
    title: "문화/엔터",
    subtitle: "영화·음악·드라마·스포츠 화제 뉴스",
  },
  {
    key: "정치",
    href: "/politics",
    emoji: "🏛️",
    title: "정치",
    subtitle: "국내·해외 정치 + 미국/해외 유학·학계 정책(비자·연구비·대학)",
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
        <p>매일 갱신되는 투자 브리핑 · 금융상품 가이드 · 테크/AI · 문화/엔터 · 정치</p>
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
