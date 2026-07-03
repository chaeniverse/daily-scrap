import { ensureTable, sql } from "../../lib/db";
import { getGuideBySlug } from "../../lib/guides";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "내 메모 모아보기",
};

// memo_key → 어느 페이지의 메모인지 라벨
function labelFor(key) {
  if (key.startsWith("memo:report:"))
    return { icon: "📈", src: "투자 브리핑", sub: key.slice("memo:report:".length) };
  if (key.startsWith("memo:scrap:"))
    return { icon: "🗞️", src: "채용 스크랩", sub: key.slice("memo:scrap:".length) };
  if (key.startsWith("memo:guide:")) {
    const slug = key.slice("memo:guide:".length);
    const g = getGuideBySlug(slug);
    return { icon: "📚", src: "금융상품 가이드", sub: g ? g.title : slug };
  }
  if (key === "memo:salary") return { icon: "💸", src: "연봉협상", sub: "" };
  return { icon: "📝", src: key, sub: "" };
}

function kstDate(ts) {
  return new Date(ts).toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
}
function kstTime(ts) {
  return new Date(ts).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function MemosPage() {
  let rows = [];
  let err = null;
  try {
    await ensureTable();
    const r = await sql`
      SELECT id, memo_key, content, created_at
      FROM memos
      ORDER BY created_at DESC;
    `;
    rows = r.rows || [];
  } catch (e) {
    err = String(e?.message || e);
  }

  // 작성일(KST) 기준으로 묶기
  const groups = {};
  rows.forEach((m) => {
    const d = kstDate(m.created_at);
    (groups[d] = groups[d] || []).push(m);
  });

  return (
    <>
      <a className="back-link" href="/">← 홈으로</a>
      <section className="page-intro">
        <h1>🧷 내 메모 모아보기</h1>
        <p>브리핑·가이드·스크랩에 적어둔 메모를 한 곳에서 모아 봅니다.</p>
      </section>

      {err && (
        <p className="empty-note">메모를 불러오지 못했습니다. (DB 연결 확인 필요)</p>
      )}
      {!err && rows.length === 0 && (
        <p className="empty-note">아직 저장된 메모가 없습니다.</p>
      )}

      {Object.entries(groups).map(([date, items]) => (
        <div className="archive-month" key={date}>
          <h3 className="archive-month-title">{date}</h3>
          <ul className="memo-list">
            {items.map((m) => {
              const l = labelFor(m.memo_key);
              return (
                <li className="memo-item" key={m.id}>
                  <div className="memo-src">
                    {l.icon} {l.src}
                    {l.sub ? ` · ${l.sub}` : ""}
                  </div>
                  <div className="memo-text">{m.content}</div>
                  <div className="memo-meta">
                    <time>{kstTime(m.created_at)}</time>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </>
  );
}
