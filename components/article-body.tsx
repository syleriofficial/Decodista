import Image from "next/image";
import { Fragment } from "react";
import Link from "@/components/app-link";
import type { ContentBlock, RichText } from "@/lib/content";

export function RichTextContent({ content }: { content: RichText }) {
  if (typeof content === "string") return content;

  return content.map((item, index) => {
    if (typeof item === "string") return <Fragment key={index}>{item}</Fragment>;

    switch (item.type) {
      case "strong":
        return <strong key={index}>{item.text}</strong>;
      case "emphasis":
        return <em key={index}>{item.text}</em>;
      case "delete":
        return <del key={index}>{item.text}</del>;
      case "code":
        return <code key={index}>{item.text}</code>;
      case "link":
        return item.href.startsWith("/")
          ? <Link key={index} href={item.href}>{item.text}</Link>
          : <a key={index} href={item.href} target="_blank" rel="noopener noreferrer">{item.text}</a>;
      case "break":
        return <br key={index} />;
    }
  });
}

export function ArticleBody({ blocks, className = "" }: { blocks: ContentBlock[]; className?: string }) {
  return (
    <div className={`article-prose ${className}`.trim()}>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return block.level === 2 ? <h2 key={block.id} id={block.id}>{block.text}</h2> : <h3 key={block.id} id={block.id}>{block.text}</h3>;
          case "paragraph":
            return <p key={index}><RichTextContent content={block.text} /></p>;
          case "list": {
            const Tag = block.style === "ordered" ? "ol" : "ul";
            return <Tag key={index}>{block.items.map((item, itemIndex) => <li key={itemIndex}><RichTextContent content={item} /></li>)}</Tag>;
          }
          case "quote":
            return <blockquote key={index}><p><RichTextContent content={block.text} /></p>{block.attribution && <cite>{block.attribution}</cite>}</blockquote>;
          case "callout":
            return <aside className="article-callout" key={index}><strong>{block.title}</strong><p><RichTextContent content={block.text} /></p></aside>;
          case "code":
            return <pre key={index} aria-label={`${block.language} code example`}><code>{block.code}</code></pre>;
          case "table":
            return <figure className="table-figure" key={index}><div className="table-scroll" role="region" aria-label="Scrollable comparison table" tabIndex={0}><table><thead><tr>{block.headers.map((header, headerIndex) => <th scope="col" key={headerIndex}><RichTextContent content={header} /></th>)}</tr></thead><tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`}><RichTextContent content={cell} /></td>)}</tr>)}</tbody></table></div>{block.caption && <figcaption>{block.caption}</figcaption>}</figure>;
          case "image":
            return <figure className="prose-image" key={index}><div className="prose-image-frame"><Image src={block.src} alt={block.alt} fill sizes="(max-width: 800px) 100vw, 760px" /></div>{block.caption && <figcaption>{block.caption}</figcaption>}</figure>;
        }
      })}
    </div>
  );
}
