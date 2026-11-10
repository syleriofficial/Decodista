import { InfoPageView, infoMetadata } from "@/components/info-page";
import { infoPages } from "@/lib/legal";

const page = infoPages["review-methodology"];
export const metadata = infoMetadata(page, "review-methodology");

export default function Page() {
  return <InfoPageView page={page} />;
}
