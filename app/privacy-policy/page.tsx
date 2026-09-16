import { InfoPageView, infoMetadata } from "@/components/info-page";
import { infoPages } from "@/lib/legal";
const page = infoPages["privacy-policy"];
export const metadata = infoMetadata(page, "privacy-policy");
export default function Page() { return <InfoPageView page={page} />; }
