// GitHub Actions on push to main can race Cloudflare Workers Builds.
// Wait for the SAME commit's Cloudflare check to complete successfully before
// running public-site SEO checks or production Lighthouse measurements.
const token = process.env.GITHUB_TOKEN;
const repository = process.env.GITHUB_REPOSITORY ?? "";
const sha = process.env.GITHUB_SHA ?? "";
const expectedName = "Workers Builds: decodista";
const maxMs = 8 * 60_000;
const intervalMs = 12_000;

if (!token || !/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(repository) || !/^[0-9a-f]{40}$/.test(sha)) {
  throw new Error("Expected GITHUB_TOKEN, GITHUB_REPOSITORY and a 40-character GITHUB_SHA");
}

const api = "https://api.github.com/repos/" + repository + "/commits/" + sha + "/check-runs?per_page=100";
const deadline = Date.now() + maxMs;
let attempts = 0;

while (Date.now() < deadline) {
  attempts++;
  const response = await fetch(api, {
    headers: {
      Authorization: "Bearer " + token,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "Decodista-Production-Readiness",
    },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error("Cannot read GitHub commit checks (HTTP " + response.status + ")");
  const payload = await response.json();
  const cloudflare = (payload.check_runs ?? []).find(item => item.name === expectedName);
  if (cloudflare) {
    console.log(expectedName + ": " + cloudflare.status + "/" + (cloudflare.conclusion ?? "pending"));
    if (cloudflare.status === "completed") {
      if (cloudflare.conclusion !== "success") {
        throw new Error("Cloudflare build for " + sha + " did not succeed: " + cloudflare.conclusion);
      }
      console.log("Cloudflare Workers Build passed for " + sha + " after " + attempts + " checks.");
      // Allow edge propagation; the HTTP/Lighthouse tests verify actual content.
      await new Promise(resolve => setTimeout(resolve, 5000));
      process.exit(0);
    }
  } else {
    console.log("No Cloudflare check for " + sha + " yet; waiting...");
  }
  await new Promise(resolve => setTimeout(resolve, intervalMs));
}

throw new Error("Timed out waiting for Cloudflare Workers Build for commit " + sha);
