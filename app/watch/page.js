import { getLatestWatch } from "../../lib/reports";
import Markdown from "../_components/Markdown";

export const dynamic = "force-static";

export const metadata = {
  title: "관전 포인트",
};

export default function Watch() {
  const watch = getLatestWatch();

  return (
    <>
      <a className="back-link" href="/">← 홈으로</a>
      <section className="page-intro">
        <h1>📊 오늘의 관전 포인트</h1>
        <p>
          {watch?.displayDate
            ? `${watch.displayDate} 브리핑 기준`
            : "최신 브리핑 기준"}
        </p>
      </section>

      <blockquote className="watch-note">
        ⚠️ 단기 주가는 누구도 확실히 예측할 수 없습니다. 아래는 "이 종목이 오른다"는
        예측·매수 추천이 아니라, 그날 뉴스에서 시장이 주목하는 종목과 그 강세
        요인·리스크를 균형 있게 정리한 참고 자료입니다. 최종 판단과 책임은 본인에게
        있습니다.
      </blockquote>

      {watch?.content ? (
        <article>
          <Markdown>{watch.content}</Markdown>
        </article>
      ) : (
        <p className="empty-note">
          아직 이번 브리핑에 관전 포인트가 없습니다. 매일 오전 브리핑이 갱신되면 이곳에
          자동으로 정리됩니다.
        </p>
      )}

      <a className="back-link" href="/briefing">브리핑 전체 보기 →</a>
    </>
  );
}
