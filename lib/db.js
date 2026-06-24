import { createPool } from "@vercel/postgres";

// 풀을 '지연 생성'한다. 모듈 로드(빌드) 시점엔 만들지 않아서
// 연결문자열이 없어도 빌드가 깨지지 않는다. 실제 쿼리 때 처음 만든다.
let pool;
function getPool() {
  if (!pool) {
    // Neon 통합/구 Vercel Postgres 등 환경변수 이름이 달라도 동작하도록 폴백.
    // (Neon 네이티브 통합은 보통 DATABASE_URL 을 넣어줍니다.)
    const connectionString =
      process.env.POSTGRES_URL ||
      process.env.DATABASE_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env.DATABASE_URL_UNPOOLED ||
      process.env.POSTGRES_URL_NON_POOLING ||
      undefined;
    pool = createPool(connectionString ? { connectionString } : {});
  }
  return pool;
}

// 태그드 템플릿(sql`...`)을 그대로 쓸 수 있도록 풀의 sql로 전달.
export function sql(strings, ...values) {
  return getPool().sql(strings, ...values);
}

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
