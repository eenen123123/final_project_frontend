import { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface Props {
  html: string;
  className?: string;
}

type KatexPattern = { regex: RegExp; display: boolean };

const PATTERNS: KatexPattern[] = [
  { regex: /\$\$([\s\S]*?)\$\$/g, display: true },
  { regex: /\\\[([\s\S]*?)\\\]/g, display: true },
  { regex: /\$([\s\S]*?)\$/g, display: false },
  { regex: /\\\(([\s\S]*?)\\\)/g, display: false },
];

function applyKatex(input: string): string {
  let result = input;
  for (const { regex, display } of PATTERNS) {
    regex.lastIndex = 0;
    result = result.replace(regex, (match, math: string) => {
      try {
        return katex.renderToString(math, { displayMode: display, throwOnError: false });
      } catch {
        return match;
      }
    });
  }
  return result;
}

export default function RichContent({ html, className }: Props) {
  const processed = useMemo(() => applyKatex(html), [html]);
  return <div className={className} dangerouslySetInnerHTML={{ __html: processed }} />;
}
