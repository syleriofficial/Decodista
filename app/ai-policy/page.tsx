import { InfoPageView, infoMetadata } from "@/components/info-page";
import { infoPages } from "@/lib/legal";

const page = infoPages["ai-policy"];
export const metadata = infoMetadata(page, "ai-policy");
export default function Page() { return <InfoPageView page={page} />; }
