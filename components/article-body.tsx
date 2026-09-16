import Image from "next/image";
import type { ContentBlock } from "@/lib/content";

export function ArticleBody({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="article-prose">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return block.level === 2 ? <h2 key={block.id} id={block.id}>{block.text}</h2> : <h3 key={block.id} id={block.id}>{block.text}</h3>;
          case "paragraph":
            return <p key={index}>{block.text}</p>;
          case "list": {
            const Tag = block.style === "ordered" ? "ol" : "ul";
            return <Tag key={index}>{block.items.map((item) => <li key={item}>{item}</li>)}</Tag>;
          }
          case "quote":
            return <blockquote key={index}><p>{block.text}</p>{block.attribution && <cite>{block.attribution}</cite>}</blockquote>;
          case "callout":
            return <aside className="article-callout" key={index}><strong>{block.title}</strong><p>{block.text}</p></aside>;
          case "code":
            return <pre key={index} aria-label={`${block.language} code example`}><code>{block.code}</code></pre>;
          case "table":
            return <figure className="table-figure" key={index}><div className="table-scroll"><table><thead><tr>{block.headers.map((header) => <th scope="col" key={header}>{header}</th>)}</tr></thead><tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>)}</tr>)}</tbody></table></div>{block.caption && <figcaption>{block.caption}</figcaption>}</figure>;
          case "image":
            return <figure className="prose-image" key={index}><div className="prose-image-frame"><Image src={block.src} alt={block.alt} fill sizes="(max-width: 800px) 100vw, 760px" /></div>{block.caption && <figcaption>{block.caption}</figcaption>}</figure>;
        }
      })}
    </div>
  );
}
