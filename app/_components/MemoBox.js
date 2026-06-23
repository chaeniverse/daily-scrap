"use client";

import { useEffect, useState } from "react";

// 포스트별 메모(궁금한 점) 저장. 브라우저 localStorage에만 보관한다.
export default function MemoBox({ storageKey }) {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [loaded, setLoaded] = useState(false);

  // 최초 로드
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setNotes(JSON.parse(raw));
    } catch (e) {
      // 무시
    }
    setLoaded(true);
  }, [storageKey]);

  // 변경 시 저장 (로드 완료 후에만)
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(notes));
    } catch (e) {
      // 무시
    }
  }, [notes, loaded, storageKey]);

  function add() {
    const t = text.trim();
    if (!t) return;
    setNotes((prev) => [
      { id: Date.now(), text: t, ts: new Date().toISOString() },
      ...prev,
    ]);
    setText("");
  }

  function remove(id) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
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
        읽다가 생긴 질문을 적어두세요. 이 기기(브라우저)에만 저장됩니다.
      </p>
      <div className="memo-input">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="예) ELS 낙인이 깨지면 무조건 손해인가?"
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
