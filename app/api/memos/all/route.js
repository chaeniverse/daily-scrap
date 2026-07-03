import { NextResponse } from "next/server";
import { ensureTable, sql } from "../../../../lib/db";
import { getGuideBySlug } from "../../../../lib/guides";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function labelFor(key) {
  if (key.startsWith("memo:report:"))
    return `📈 투자 브리핑 · ${key.slice("memo:report:".length)}`;
  if (key.startsWith("memo:scrap:"))
    return `🗞️ 채용 스크랩 · ${key.slice("memo:scrap:".length)}`;
  if (key.startsWith("memo:guide:")) {
    const slug = key.slice("memo:guide:".length);
    const g = getGuideBySlug(slug);
    return `📚 금융상품 가이드 · ${g ? g.title : slug}`;
  }
  if (key === "memo:salary") return "💸 연봉협상";
  return key;
}

// GET /api/memos/all  → 전체 메모(라벨 포함) 최신순 JSON
export async function GET() {
  try {
    await ensureTable();
    const { rows } = await sql`
      SELECT id, memo_key, content, created_at
      FROM memos
      ORDER BY created_at DESC;
    `;
    const memos = rows.map((r) => ({
      id: Number(r.id),
      key: r.memo_key,
      source: labelFor(r.memo_key),
      text: r.content,
      created_at: new Date(r.created_at).toISOString(),
    }));
    return NextResponse.json({ count: memos.length, memos });
  } catch (e) {
    return NextResponse.json(
      { error: String(e?.message || e) },
      { status: 500 }
    );
  }
}
