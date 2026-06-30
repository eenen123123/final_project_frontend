import katex from "katex";

// $...$ (인라인) 및 $$...$$ (블록) 수식을 KaTeX HTML로 변환
function renderKatex(html: string): string {
  // 블록 수식 $$...$$
  html = html.replace(/\$\$(.+?)\$\$/gs, (_match, expr) => {
    try {
      return katex.renderToString(expr.trim(), { displayMode: true, throwOnError: false });
    } catch {
      return _match;
    }
  });

  // 인라인 수식 $...$
  html = html.replace(/\$(.+?)\$/g, (_match, expr) => {
    try {
      return katex.renderToString(expr.trim(), { displayMode: false, throwOnError: false });
    } catch {
      return _match;
    }
  });

  return html;
}

export function processHtml(html: string): string {
  return renderKatex(html);
}
