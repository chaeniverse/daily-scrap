"use client";

import { useEffect, useRef, useState } from "react";

// 플로팅 버튼 + 패널 형태의 '한 페이지 = 하나의 메모' 자동저장 메모.
// (paper-read 스타일) 입력하면 디바운스 후 DB에 자동 저장(키별 단일 문서 upsert),
// DB가 안 되면 localStorage 로 폴백.
export default function MemoDock({ storageKey, title }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const timer = useRef(null);

  const localKey = `doc:${storageKey}`;
  function readLocal() {
    try {
      return localStorage.getItem(localKey) || "";
    } catch (e) {
      return "";
    }
  }
  function writeLocal(v) {
    try {
      localStorage.setItem(localKey, v);
    } catch (e) {
      /* 무시 */
    }
  }

  // 최초 로드: DB의 기존 내용을 하나의 문서로 합쳐 표시 (없으면 localStorage)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/memos?key=${encodeURIComponent(storageKey)}`);
        if (!res.ok) throw new Error("db");
        const data = await res.json();
        const notes = data.notes || [];
        const joined = notes
          .slice()
          .reverse()
          .map((n) => n.text)
          .join("\n")
          .trim();
        if (!alive) return;
        setText(joined || readLocal());
      } catch (e) {
        if (!alive) return;
        setText(readLocal());
      }
    })();
    return () => {
      alive = false;
    };
  }, [storageKey]);

  function handleChange(e) {
    const v = e.target.value;
    setText(v);
    writeLocal(v);
    setStatus("저장 중…");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => save(v), 600);
  }

  async function save(v) {
    try {
      const res = await fetch("/api/memos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: storageKey, text: v }),
      });
      if (!res.ok) throw new Error("save");
      setStatus("저장됨 ✓");
    } catch (e) {
      setStatus("이 기기에만 저장됨");
    }
  }

  return (
    <>
      <button
        className="memo-fab"
        onClick={() => setOpen((o) => !o)}
        aria-label="메모 열기/닫기"
        title="메모"
      >
        {open ? "✕" : "📝"}
      </button>
      {open && (
        <div className="memo-panel" role="dialog" aria-label="메모">
          <div className="memo-panel-head">
            <span className="memo-panel-title">📝 {title || "메모"}</span>
            <button
              className="memo-panel-close"
              onClick={() => setOpen(false)}
              aria-label="닫기"
            >
              ✕
            </button>
          </div>
          <textarea
            className="memo-panel-area"
            value={text}
            onChange={handleChange}
            placeholder="여기에 메모하세요… 자동 저장됩니다."
          />
          <div className="memo-panel-status">{status}</div>
        </div>
      )}
    </>
  );
}
