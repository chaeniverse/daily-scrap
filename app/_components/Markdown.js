import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Markdown({ children }) {
  // 숫자 범위(예: 13.2~16.5%)에 쓰인 물결(~)이 GFM 취소선으로 잘못 해석되지 않도록 이스케이프.
  const safe =
    typeof children === "string" ? children.replace(/~/g, "\\~") : children;
  return (
    <div className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: (props) => <a {...props} target="_blank" rel="noreferrer" />,
        }}
      >
        {safe}
      </ReactMarkdown>
    </div>
  );
}
