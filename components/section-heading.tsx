import Link from "@/components/app-link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({ eyebrow, title, href, id }: { eyebrow?: string; title: string; href?: string; id?: string }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 id={id}>{title}</h2>
      </div>
      {href && <Link href={href}>View all <ArrowRight aria-hidden="true" /></Link>}
    </div>
  );
}
