import { InfoPageView, infoMetadata } from "@/components/info-page";
import { infoPages } from "@/lib/legal";
const page = infoPages.contact;
export const metadata = infoMetadata(page, "contact");
export default function Page() { return <InfoPageView page={page} />; }
