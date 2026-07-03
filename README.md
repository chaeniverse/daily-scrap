# daily-scrap

'채'를 위한 **매일 자동 갱신 데일리 스크랩**. 세 가지를 한 사이트에서 봅니다.

- 📈 **투자 브리핑** — 매일 테크/AI·증시 요약(날짜별 누적)
- 📚 **금융상품 가이드** — 펀드·ETF·연금·시장지표·코인 등 기초 설명(꼬꼬무 Q&A 포함)
- 🗞️ **AI 채용 뉴스 스크랩** — 카카오·CJ올리브영·넷플릭스 회사 뉴스 + 직무/기술 트렌드(날짜별 누적)

각 페이지에는 궁금한 점을 적어두는 **메모(💭)** 기능이 있습니다(서버 DB 저장, 기기 간 동기화).

---

## 동작 흐름

1. **콘텐츠 생성** — Cowork 예약 작업이 매일 원본 파일을 생성/갱신
   - `daily-stock-report-kr` → `stock-report/{날짜} stock report.md`
   - `daily-ai-job-news-scrap` → `scrap-data/{날짜}.json`
   - (금융상품 가이드는 정적 콘텐츠라 `lib/guides.js` 안에서 직접 관리)
2. **자동 push** — mac의 launchd가 매일 **오전 11:00** 변경분을 GitHub로 commit + push
   (즉시 올리려면 `publish.command` 더블클릭)
3. **자동 배포** — Vercel이 push를 감지해 사이트를 재빌드 → `*.vercel.app` 에서 최신 확인

> 콘텐츠 생성 작업은 **파일만 만들고 git은 건드리지 않습니다.** 커밋·push는 전적으로 launchd / `publish.command` 담당입니다.

---

## 구조

```
daily-scrap/
├── app/                              # Next.js (App Router) 사이트
│   ├── page.js                       # 홈 (타일 3개)
│   ├── layout.js                     # 공통 헤더/푸터
│   ├── globals.css
│   ├── icon.svg                      # 파비콘 (🗞️)
│   ├── briefing/page.js              # 📈 투자 브리핑 (최신 + 지난 리포트 그리드)
│   ├── report/[slug]/page.js         # 날짜별 리포트
│   ├── guide/
│   │   ├── page.js                   # 📚 금융상품 가이드 목록
│   │   └── [slug]/page.js            # 가이드 포스트
│   ├── scrap/
│   │   ├── page.js                   # 🗞️ 채용 스크랩 (최신 + 지난 스크랩 그리드)
│   │   └── [date]/page.js            # 날짜별 스크랩
│   ├── api/memos/route.js            # 메모 API (Vercel Postgres)
│   └── _components/
│       ├── Markdown.js               # 마크다운 렌더
│       ├── MemoBox.js                # 메모(궁금한 점) — DB 저장 + localStorage 폴백
│       ├── DateSelector.js           # 브리핑 날짜 드롭다운
│       ├── ScrapView.js              # 스크랩 카드 렌더
│       └── ScrapDateSelector.js      # 스크랩 날짜 드롭다운
├── lib/
│   ├── reports.js                    # stock-report/*.md 읽기·정리
│   ├── guides.js                     # 금융상품 가이드 포스트 데이터
│   ├── scraps.js                     # scrap-data/*.json 읽기
│   └── db.js                         # Vercel Postgres 연결 (메모)
├── stock-report/                     # 투자 브리핑 원본 (매일 .md 누적)
│   └── YYYY-MM-DD stock report.md
├── scrap-data/                       # 채용 스크랩 원본 (매일 .json 누적)
│   ├── YYYY-MM-DD.json
│   ├── index.json                    # 날짜 매니페스트
│   └── seen.json                     # 중복 방지용 URL 목록
├── scripts/                          # 자동 push(launchd) 설정
│   ├── auto-push.sh                  # 커밋+push 스크립트
│   ├── com.chaeniverse.dailyscrap-push.plist
│   ├── install-launchd.command       # launchd 설치 버튼
│   ├── SETUP.md                      # launchd 설정 가이드
│   └── VERCEL-SETUP.md               # Vercel 연결 가이드
├── publish.command                   # 수동 발행(커밋+push) 버튼
├── package.json
├── next.config.mjs
└── vercel.json
```

---

## 로컬 실행

```bash
npm install
npm run dev      # http://localhost:3000 에서 미리보기
```

## 메모 기능 (DB)

`app/api/memos` + `lib/db.js` 는 **Vercel Postgres(Neon)** 를 사용합니다.
Vercel 프로젝트에 Postgres를 연결하면 환경변수(`POSTGRES_URL` 또는 `DATABASE_URL`)를
자동으로 읽어 메모를 저장합니다. DB가 없으면 메모는 브라우저(localStorage)에만 저장됩니다.

## 문서

- `scripts/VERCEL-SETUP.md` — Vercel 연결/배포 가이드 (한 번만 설정).
- `scripts/SETUP.md` — launchd 자동 push 설정 가이드.

---

> ⚠️ 브리핑·가이드는 투자 자문이 아니라 참고용 정보입니다. 모든 투자에는 원금 손실 위험이 있습니다.
