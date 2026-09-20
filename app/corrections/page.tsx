import { InfoPageView, infoMetadata } from "@/components/info-page";
import { infoPages } from "@/lib/legal";

const page = infoPages.corrections;
export const metadata = infoMetadata(page, "corrections");
export default function Page() { return <InfoPageView page={page} />; }
