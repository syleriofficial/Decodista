import { startDecapAuthorization } from "@/lib/decap-oauth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return startDecapAuthorization(request);
}
