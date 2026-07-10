import "./globals.css";

export const metadata = {
  title: "채를 위한 데일리 스크랩",
  description: "매일 갱신되는 투자 브리핑 · 금융상품 가이드 · 테크/AI · 문화/엔터 스크랩",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <header className="site-header">
          <div className="container">
            <a className="brand" href="/">
              <span className="brand-mark">🗞️</span>
              <span className="brand-text">채를 위한 데일리 스크랩</span>
            </a>
            <a className="repo-link" href="https://github.com/chaeniverse/daily-scrap" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
