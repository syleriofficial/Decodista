import { InfoPageView, infoMetadata } from "@/components/info-page";
import { infoPages } from "@/lib/legal";

const page = infoPages["editorial-team"];
export const metadata = infoMetadata(page, "editorial-team");
export default function Page() { return <InfoPageView page={page} />; }
