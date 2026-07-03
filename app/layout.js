import "./globals.css";

export const metadata = {
  title: "채를 위한 데일리 스크랩",
  description: "매일 갱신되는 투자 브리핑 · 금융상품 가이드 · AI 채용 뉴스 스크랩",
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
        <footer className="site-footer">
          <div className="container">
            매일 오전 자동 갱신 · 투자 자문이 아닌 참고용 정보입니다.
          </div>
        </footer>
      </body>
    </html>
  );
}
