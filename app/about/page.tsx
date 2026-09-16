import { InfoPageView, infoMetadata } from "@/components/info-page";
import { infoPages } from "@/lib/legal";
const page = infoPages.about;
export const metadata = infoMetadata(page, "about");
export default function Page() { return <InfoPageView page={page} />; }
