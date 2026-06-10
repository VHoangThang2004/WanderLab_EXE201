import { useMemo } from 'react';

/**
 * Lightweight markdown renderer cho AI chat messages.
 * Hỗ trợ: bold, italic, code inline, code block, lists, headers, links, tables.
 */

interface MarkdownContentProps {
  content: string;
  className?: string;
}

interface ParsedBlock {
  type: 'paragraph' | 'heading' | 'code-block' | 'list' | 'hr' | 'table';
  level?: number;
  language?: string;
  items?: string[];
  ordered?: boolean;
  content?: string;
  // Table data
  headers?: string[];
  rows?: string[][];
}

function parseBlocks(text: string): ParsedBlock[] {
  const lines = text.split('\n');
  const blocks: ParsedBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block (```)
    if (line.trim().startsWith('```')) {
      const language = line.trim().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'code-block', content: codeLines.join('\n'), language });
      i++; // skip closing ```
      continue;
    }

    // Table: detect | col | col | pattern
    if (/^\s*\|.+\|\s*$/.test(line)) {
      const tableLines: string[] = [];
      while (i < lines.length && /^\s*\|.+\|\s*$/.test(lines[i])) {
        tableLines.push(lines[i]);
        i++;
      }
      // Parse table
      if (tableLines.length >= 2) {
        const parseRow = (row: string) =>
          row.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(cell => cell.trim());

        const headers = parseRow(tableLines[0]);
        // Check if second line is separator (|---|---|)
        const isSeparator = /^\s*\|[\s\-:]+\|/.test(tableLines[1]);
        const dataStart = isSeparator ? 2 : 1;
        const rows = tableLines.slice(dataStart).map(parseRow);

        blocks.push({ type: 'table', headers, rows });
      } else {
        // Single line with pipes, treat as paragraph
        blocks.push({ type: 'paragraph', content: tableLines.join('\n') });
      }
      continue;
    }

    // Heading (# ## ###)
    const headingMatch = line.match(/^(#{1,3})\s+(.+)/);
    if (headingMatch) {
      blocks.push({ type: 'heading', level: headingMatch[1].length, content: headingMatch[2] });
      i++;
      continue;
    }

    // Horizontal rule (---, ***)
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line.trim())) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    // Unordered list (- or • or *)
    if (/^\s*[-•*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-•*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-•*]\s+/, ''));
        i++;
      }
      blocks.push({ type: 'list', items, ordered: false });
      continue;
    }

    // Ordered list (1. 2. 3.)
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+[.)]\s+/, ''));
        i++;
      }
      blocks.push({ type: 'list', items, ordered: true });
      continue;
    }

    // Empty line — skip
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Paragraph — collect consecutive non-special lines
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].match(/^#{1,3}\s+/) &&
      !/^\s*[-•*]\s+/.test(lines[i]) &&
      !/^\s*\d+[.)]\s+/.test(lines[i]) &&
      !/^(-{3,}|\*{3,}|_{3,})\s*$/.test(lines[i].trim()) &&
      !/^\s*\|.+\|\s*$/.test(lines[i])
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: 'paragraph', content: paraLines.join('\n') });
    }
  }

  return blocks;
}

/** Render inline markdown: **bold**, *italic*, `code`, [link](url) */
function renderInline(text: string): (string | JSX.Element)[] {
  const result: (string | JSX.Element)[] = [];
  const regex = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`(.+?)`)|(\[(.+?)\]\((.+?)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      result.push(<strong key={key++} className="font-semibold">{match[2]}</strong>);
    } else if (match[3]) {
      result.push(<em key={key++}>{match[4]}</em>);
    } else if (match[5]) {
      result.push(
        <code key={key++} className="px-1.5 py-0.5 bg-gray-100 text-[#ff3131] rounded text-xs font-mono">
          {match[6]}
        </code>
      );
    } else if (match[7]) {
      result.push(
        <a key={key++} href={match[9]} target="_blank" rel="noopener noreferrer" className="text-[#ff3131] underline hover:text-[#ff914d]">
          {match[8]}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result.length > 0 ? result : [text];
}

export function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  const blocks = useMemo(() => parseBlocks(content), [content]);

  return (
    <div className={`text-sm leading-relaxed space-y-2 ${className}`}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'heading':
            if (block.level === 1) return <h3 key={i} className="font-bold text-base">{renderInline(block.content!)}</h3>;
            if (block.level === 2) return <h4 key={i} className="font-bold text-sm">{renderInline(block.content!)}</h4>;
            return <h5 key={i} className="font-semibold text-sm">{renderInline(block.content!)}</h5>;

          case 'code-block':
            return (
              <div key={i} className="rounded-lg overflow-hidden border border-gray-200">
                {block.language && (
                  <div className="bg-gray-100 px-3 py-1 text-xs text-gray-500 font-mono border-b border-gray-200">
                    {block.language}
                  </div>
                )}
                <pre className="bg-gray-50 px-3 py-2 overflow-x-auto">
                  <code className="text-xs font-mono text-gray-800">{block.content}</code>
                </pre>
              </div>
            );

          case 'table':
            return (
              <div key={i} className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#ff3131]/10 to-[#ff914d]/10">
                      {block.headers!.map((header, j) => (
                        <th key={j} className="px-3 py-2 text-left font-semibold text-gray-800 border-b border-gray-200 whitespace-nowrap">
                          {renderInline(header)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows!.map((row, ri) => (
                      <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-3 py-2 text-gray-700 border-b border-gray-100 whitespace-nowrap">
                            {renderInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case 'list':
            if (block.ordered) {
              return (
                <ol key={i} className="list-decimal list-inside space-y-1 pl-1">
                  {block.items!.map((item, j) => (
                    <li key={j} className="text-sm">{renderInline(item)}</li>
                  ))}
                </ol>
              );
            }
            return (
              <ul key={i} className="space-y-1 pl-1">
                {block.items!.map((item, j) => (
                  <li key={j} className="text-sm flex items-start gap-1.5">
                    <span className="text-[#ff3131] mt-1.5 flex-shrink-0">•</span>
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ul>
            );

          case 'hr':
            return <hr key={i} className="border-gray-200" />;

          case 'paragraph':
          default:
            return <p key={i} className="whitespace-pre-line">{renderInline(block.content!)}</p>;
        }
      })}
    </div>
  );
}
