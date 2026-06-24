"use client";

import { useEffect, useState } from "react";

// 포스트별 메모(궁금한 점) 저장.
// 1순위: 서버 DB(/api/memos). DB가 아직 연결 안 됐거나 오류면 → localStorage로 폴백.
// 둘 다 항상 localStorage에 백업해 둔다.
export default function MemoBox({ storageKey }) {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [mode, setMode] = useState("local"); // "db" | "local"

  function readLocal() {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
  function writeLocal(list) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(list));
    } catch (e) {
      /* 무시 */
    }
  }

  // 최초 로드: DB 먼저, 실패하면 localStorage
  useEffect(() => {
    let alive = true;
    (async () => {
      const local = readLocal();
      const migKey = `migrated:${storageKey}`;
      let alreadyMigrated = false;
      try {
        alreadyMigrated = localStorage.getItem(migKey) === "1";
      } catch (e) {
        /* 무시 */
      }
      try {
        const res = await fetch(`/api/memos?key=${encodeURIComponent(storageKey)}`);
        if (!res.ok) throw new Error("db unavailable");
        const data = await res.json();
        let serverNotes = data.notes || [];

        // '이전 localStorage 메모'는 이 기기에서 딱 한 번만, DB가 빈 경우에만 올린다.
        // 한 번 올린 뒤엔 플래그를 세워 다시는 올리지 않는다(지운 메모가 되살아나지 않도록).
        if (!alreadyMigrated && serverNotes.length === 0 && local.length > 0) {
          for (const n of [...local].reverse()) {
            try {
              const r = await fetch("/api/memos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: storageKey, text: n.text }),
              });
              if (r.ok) {
                const { note } = await r.json();
                serverNotes.unshift(note);
              }
            } catch (e) {
              /* 무시 */
            }
          }
        }
        try {
          localStorage.setItem(migKey, "1");
        } catch (e) {
          /* 무시 */
        }
        if (!alive) return;
        setMode("db");
        setNotes(serverNotes);
        writeLocal(serverNotes);
      } catch (e) {
        if (!alive) return;
        setMode("local");
        setNotes(local);
      } finally {
        if (alive) setLoaded(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [storageKey]);

  async function add() {
    const t = text.trim();
    if (!t) return;
    setText("");
    if (mode === "db") {
      try {
        const res = await fetch("/api/memos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: storageKey, text: t }),
        });
        if (!res.ok) throw new Error("post failed");
        const { note } = await res.json();
        setNotes((prev) => {
          const next = [note, ...prev];
          writeLocal(next);
          return next;
        });
        return;
      } catch (e) {
        // 실패하면 로컬로
      }
    }
    setNotes((prev) => {
      const next = [{ id: Date.now(), text: t, ts: new Date().toISOString() }, ...prev];
      writeLocal(next);
      return next;
    });
  }

  async function remove(id) {
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== id);
      writeLocal(next);
      return next;
    });
    if (mode === "db") {
      try {
        await fetch(`/api/memos?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      } catch (e) {
        /* 무시 */
      }
    }
  }

  function fmt(ts) {
    const d = new Date(ts);
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  }

  return (
    <section className="memo-box">
      <h3>💭 메모 · 궁금한 점</h3>
      <p className="memo-hint">
        읽다가 생긴 질문을 적어두세요.{" "}
        {loaded && mode === "db"
          ? "여러 기기에서 함께 보입니다(서버 저장)."
          : "이 기기(브라우저)에 저장됩니다."}
      </p>
      <div className="memo-input">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="예) 이건 무슨 뜻이지?"
          rows={3}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") add();
          }}
        />
        <button onClick={add} disabled={!text.trim()}>
          저장
        </button>
      </div>

      {notes.length > 0 && (
        <ul className="memo-list">
          {notes.map((n) => (
            <li className="memo-item" key={n.id}>
              <div className="memo-text">{n.text}</div>
              <div className="memo-meta">
                <time>{fmt(n.ts)}</time>
                <button className="memo-del" onClick={() => remove(n.id)}>
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
