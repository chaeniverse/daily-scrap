import { NextResponse } from "next/server";
import { ensureTable, sql } from "../../../lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET /api/memos?key=memo:salary  → { notes: [{id, text, ts}] }
export async function GET(request) {
  const key = new URL(request.url).searchParams.get("key");
  if (!key) return NextResponse.json({ error: "key 필요" }, { status: 400 });
  try {
    await ensureTable();
    const { rows } = await sql`
      SELECT id, content, created_at
      FROM memos
      WHERE memo_key = ${key}
      ORDER BY created_at DESC, id DESC;
    `;
    const notes = rows.map((r) => ({
      id: Number(r.id),
      text: r.content,
      ts: new Date(r.created_at).toISOString(),
    }));
    return NextResponse.json({ notes });
  } catch (e) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}

// POST /api/memos  { key, text }  → { note: {id, text, ts} }
export async function POST(request) {
  try {
    const { key, text } = await request.json();
    if (!key || !text || !String(text).trim()) {
      return NextResponse.json({ error: "key·text 필요" }, { status: 400 });
    }
    await ensureTable();
    const { rows } = await sql`
      INSERT INTO memos (memo_key, content)
      VALUES (${key}, ${String(text).trim()})
      RETURNING id, content, created_at;
    `;
    const r = rows[0];
    return NextResponse.json({
      note: {
        id: Number(r.id),
        text: r.content,
        ts: new Date(r.created_at).toISOString(),
      },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}

// DELETE /api/memos?id=123
export async function DELETE(request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id 필요" }, { status: 400 });
  try {
    await ensureTable();
    await sql`DELETE FROM memos WHERE id = ${id};`;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
