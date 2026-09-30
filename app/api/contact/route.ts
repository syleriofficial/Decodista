import { env } from "cloudflare:workers";
import { handleContactRequest } from "@/lib/contact.mjs";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleContactRequest(request, env);
}

export async function GET(request: Request) {
  return handleContactRequest(request, env);
}
