import { sql } from "@vercel/postgres";

let initialized = false;

// memos 테이블을 (없으면) 만든다. 첫 요청 때 한 번 실행.
// memo_key 예: "memo:salary", "memo:guide:app-menu"
export async function ensureTable() {
  if (initialized) return;
  await sql`
    CREATE TABLE IF NOT EXISTS memos (
      id          BIGSERIAL PRIMARY KEY,
      memo_key    TEXT NOT NULL,
      content     TEXT NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_memos_key ON memos (memo_key);`;
  initialized = true;
}

export { sql };
