import { InfoPageView, infoMetadata } from "@/components/info-page";
import { infoPages } from "@/lib/legal";
const page = infoPages.terms;
export const metadata = infoMetadata(page, "terms");
export default function Page() { return <InfoPageView page={page} />; }
