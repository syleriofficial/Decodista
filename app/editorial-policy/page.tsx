import { InfoPageView, infoMetadata } from "@/components/info-page";
import { infoPages } from "@/lib/legal";
const page = infoPages["editorial-policy"];
export const metadata = infoMetadata(page, "editorial-policy");
export default function Page() { return <InfoPageView page={page} />; }
