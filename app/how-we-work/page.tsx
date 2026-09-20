import { InfoPageView, infoMetadata } from "@/components/info-page";
import { infoPages } from "@/lib/legal";

const page = infoPages["how-we-work"];
export const metadata = infoMetadata(page, "how-we-work");
export default function Page() { return <InfoPageView page={page} />; }
