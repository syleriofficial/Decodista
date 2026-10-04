---
title: "AI Shopping Agents and Scam Risk: What to Check Before Letting a Bot Buy for You"
slug: ai-shopping-agents-scam-fraud-privacy-risks
deck: >-
  An AI can help find a deal. Before it places an order, check who gets your
  money, what you have authorized, and where you would turn if something goes
  wrong.
primaryCategory: security
contentType: explainer
topics:
  - Scams & Fraud
  - AI Agents
  - Online Shopping
  - Payments
  - Privacy
  - Consumer Safety
  - Agentic Commerce
heroImage: /images/uploads/ai-shopping-agents-scam-fraud-privacy-risks.webp
heroImageAlt: Illustration of a shopper checking the seller and payment details before approving an AI-assisted purchase.
heroImageWidth: 1600
heroImageHeight: 900
shortAnswer: >-
  AI shopping tools can do more than recommend products: some support checkout
  or carry out purchasing steps across services. That creates additional
  opportunities for an incorrect recommendation, fake merchant, exposed payment
  information, or action outside your intended instructions to become a real
  transaction. The risk depends on the permissions you grant and how the
  platform, seller, and payment provider divide the work. Before authorizing a
  purchase, verify the seller, final order, payment method, and route for
  resolving problems.
keyTakeaways:
  - "Finding a product, filling a cart, and paying for it are different levels of authority."
  - "A recommendation is a starting point for checking a merchant, not proof that the seller is trustworthy."
  - "Check the payment method and its dispute protections before approving a charge."
  - "Prefer reviewing each purchase; background price monitoring does not necessarily authorize buying."
  - "Identify the seller and the relevant refund or payment-dispute contact before checkout."
  - "Limit connected accounts and personal information to what the task needs."
  - "Separate ordinary shopping scams, scams targeting an agent, and mistakes made by an agent."
faqs: []
publishedAt: 2026-09-26
updatedAt: 2026-10-04
informationCheckedAt: 2026-10-04
author: DECODISTA Editorial
readingTime: 17
seoTitle: "AI Shopping Agents: Scam, Fraud and Privacy Risks Explained"
metaDescription: >-
  AI shopping agents can compare products and increasingly help complete
  purchases. Here are the scam, fraud, payment and privacy risks to check before
  giving one buying authority.
editorsPick: false
featured: false
---
## What is an AI shopping agent?

An AI shopping agent is software that can take shopping-related actions for you. The useful question is what it can actually do:

1. **Recommend:** suggest a product from your description.
2. **Compare:** assess several products against your requirements.
3. **Build a cart:** select items, variants, and quantities.
4. **Initiate checkout:** request delivery options and calculate an order.
5. **Complete payment:** submit an authorized purchase.
6. **Buy autonomously:** make a purchase later within authority you granted earlier.

A tool may support only some of these steps. Calling it an “agent” does not tell you which ones.

OpenAI’s March 2026 product-discovery update emphasized comparison and merchant-operated checkout. Its current Help Center also says Instant Checkout may appear for eligible products and merchants; developer guidance limits it to approved partners. Those statements support a conditional description of availability, not a claim that every ChatGPT shopping result can be purchased in chat. [1][2][3]

Google’s Universal Commerce Protocol, or UCP, connects commerce systems. Universal Cart is a consumer shopping feature; UCP is the underlying standard that can support checkout. Neither name alone means permission to spend without further review. [5][6]

## Why banks are warning about agentic commerce

NatWest Group, ASB Bank, Bank of America, Capital One, Commonwealth Bank of Australia, and ING Group jointly published principles for trusted agentic commerce. NatWest identifies five priorities: transparency, safety, privacy and data, choice, and interoperability. This was a collaborative industry paper inviting further work, not a regulatory ruling. [9]

Reuters reported on September 22 that the banks worried about agents entering card details into websites, steering people toward weaker payment protections, and leaving consumers uncertain about recourse. They proposed disclosure of AI involvement and greater decision transparency. [10]

The practical concern is that convenience can hide decisions you would otherwise notice: which seller was selected, which payment route was used, and what the agent understood you to have approved.

## Where the scam risk enters

The following are **plausible threat paths**, not claims that these attacks have occurred in the named checkout products:

| Stage | What could go wrong | What to inspect |
| --- | --- | --- |
| Discovery | A spoofed listing or manipulated product description makes an offer appear suitable. | Compare the model number and claims with the manufacturer’s information. |
| Seller selection | An agent chooses a counterfeit seller or a business impersonating a familiar brand. | Check the actual seller and domain, not just the product logo. |
| Checkout | A redirect leads to a phishing page or a request to pay outside the expected service. | Check the destination and payment recipient before continuing. |
| Decision | A fake discount or urgency message pressures you into approving too quickly. | Recheck the full price and whether you need to act immediately. |
| Account access | Someone with a compromised connected account changes details or misuses purchasing access. | Review account activity and remove access you no longer need. |

These scenarios apply familiar fraud patterns to the additional steps an agent performs. They should not be read as measured attack rates. FTC guidance already warns about misleading reviews, implausibly cheap branded goods, and payment requests outside a marketplace. [11][12]

An agent making an honest selection error is a different problem from a scammer manipulating a listing. Likewise, criminals using AI to write scam messages does not establish that a shopping agent caused a particular loss.

## Can an AI agent choose the wrong merchant?

Yes—do not treat the first recommendation as a completed trust check. OpenAI says merchant ranking considers factors including availability, price, quality, and whether the seller is the maker or primary seller. It also warns that reviews are not verified by OpenAI and that product information can lag behind merchant updates. [1]

OpenAI currently says its product results are separate from ads and are not influenced by its partnerships. That is a statement about its product results, not a guarantee about the seller or a rule to apply to Google. [1]

For your own comparison, ask: Is the lower price attached to the same model, condition, warranty, delivery destination, and return terms? A cheaper imported or refurbished version may be legitimate but unsuitable for your needs.

## What happens to your payment data?

### ChatGPT’s documented Instant Checkout flow

OpenAI’s current ACP documentation says ChatGPT collects buyer, fulfillment, and payment information and communicates with the merchant. The merchant processes the order through its own systems and payment provider. A delegated payment request sets a maximum amount and expiry; the payment provider returns a token that OpenAI passes to the merchant. [4]

A payment token is a controlled payment credential, not permission to assume every participant holds no sensitive data. Nor does it validate the quality of the goods. The documentation reviewed does not establish one storage-and-retention rule covering every external merchant checkout and ChatGPT integration.

### Google’s documented UCP checkout

Google says UCP currently supports card credentials based on Funding Primary Account Numbers stored in Google Wallet. In the native checkout flow, the merchant or its payment provider receives a Google Pay payment credential; the exact credential format depends on the payment setup. This does not mean every checkout passes a raw card number directly to the merchant or uses the same tokenization model. [6] See Google’s [native checkout documentation](https://developers.google.com/merchant/ucp/implementation/2026-04-08/native-checkout-api).

Google’s US checkout addendum defines payment data to include billing details, card metadata, and the credit-card number. Where Google provides that data to a merchant, the terms limit its use to payment processing, support, and fraud detection, with retention tied to those purposes or legal requirements. These are contractual limits, not evidence that the AI model itself sees a raw card number. [7]

OpenAI’s commerce policy prohibits merchant impersonation, misleading product information, and hidden fees. Those requirements are safeguards, not proof that a particular order will be problem-free. [22]

**For either service, use the documented payment interface. Do not paste a card number, banking password, or one-time code into an ordinary conversation to help a bot finish a purchase.**

## Can the agent buy something without asking you?

Approval can mean either approving the exact order now or approving rules for an agent to act later. Those are different commitments.

| Platform/product | Can it initiate checkout? | Can it complete payment? | What user approval is required? | Who is responsible for the sale? |
| --- | --- | --- | --- | --- |
| ChatGPT Instant Checkout, where eligible | Yes | Yes, through merchant/payment-provider systems | Documented flow requires confirmation of order, shipping, and payment details. | Merchant is merchant of record. [3][4][14] |
| Google UCP native checkout | Yes, on eligible listings or carts | Yes, using Google Pay and merchant processing | Google’s US terms require final purchase authorization after merchant terms are presented. | Merchant remains seller of record. [6][7] |
| Google’s merchant-site agentic checkout | Yes, for supported purchases | Yes, on the merchant site using Google Pay | Google says it asks permission and confirms purchase and shipping details first. | Merchant operating the sale. [15] |

These rows describe documented flows, not guaranteed access for every country, account, or retailer.

There is also infrastructure for purchases without approval at the exact moment of payment. AP2’s specification includes a “Human Not Present” mode: the user approves constraints first, and an agent later approves a qualifying transaction within them. That is prior authorization, not no authorization. A protocol capability does not establish that every consumer product has enabled it. [16]

Google’s May Universal Cart announcement described a US rollout and future expansion. Google’s current Merchant Center help says UCP-powered checkout applies to eligible products in the United States, Canada and Australia, for participating merchants and partners. Availability remains selective by merchant, product and Google surface, and this does not establish universal rollout of every Universal Cart, UCP or agentic-checkout feature. Separately, Google says the Merchant Center UCP integration-hub onboarding experience is rolling out gradually in the US, with Australia and Canada to follow later. Product eligibility and integration-hub onboarding are therefore different rollout questions. [5][6][8][23]

## What if the agent buys the wrong thing?

Keep three questions separate:

- **AI mistake:** Did it misunderstand your size, model, quantity, budget, or preferred seller?
- **Merchant dispute:** Did the seller supply something different, defective, or nothing at all?
- **Payment dispute:** Was there a duplicate charge, an amount you did not approve, or an allegedly unauthorized transaction?

For example, an agent selecting the wrong size and a merchant sending a size different from the order are not the same event. A duplicate order is also different from charging twice for one order.

Save your instructions, approval screen, receipt, and messages. Ask the merchant promptly whether the order can be corrected or cancelled, and report the agent’s error through its platform’s support channel. Do not assume reporting a chatbot error also cancels the order.

## Who handles refunds and disputes?

For ChatGPT’s documented Instant Checkout arrangement, OpenAI says the merchant handles fulfillment, returns, and customer support. Current developer documentation confirms that OpenAI is not the merchant of record. [4][14]

For Google’s US UCP program, the merchant’s purchase terms cover returns and refunds, and the merchant is responsible for transaction and product issues. The checkout being hosted by Google does not make Google the seller. [7]

There are several routes, depending on the purchase:

| Route | What to use it for |
| --- | --- |
| Merchant support | Cancellation, delivery, return eligibility, and product problems. |
| Marketplace or platform support | Reporting a seller, a platform error, or invoking a specifically offered purchase-protection process. |
| Payment-provider dispute | Asking the service that handled payment to investigate under its rules. |
| Card-issuer dispute or chargeback | Asking your issuer about an eligible card transaction dispute and its evidence requirements. |

The FTC notes that marketplace assistance varies and that protection can depend on the seller, item, payment route, and deadlines. [12]

For a global reader, no single chargeback promise is reliable: the applicable country, payment method, reason for the dispute, and authorization evidence matter. In the US, FTC guidance describes credit-card dispute protections for specified billing and delivery problems; it does not promise reimbursement for every AI selection mistake. Contact the issuer promptly for the rules applying to your transaction. [11][20]

## What if the merchant is fake?

Before paying, investigate the business independently of the agent’s summary:

- Check the exact domain and business identity against a source you already trust.
- Find usable contact details and read the return address and policy.
- Compare prices with other sellers; an extreme discount deserves scrutiny.
- Read recent reviews from multiple places rather than relying on a star score.
- Check whether any marketplace protection covers this seller and payment route.
- Stop if you are pushed to an unfamiliar payment destination or asked to abandon the marketplace’s payment system.

An unfamiliar seller is not automatically fraudulent. Equally, HTTPS means the connection is encrypted, not that the business is honest. [11][12]

If you have already paid a suspected scammer, contact your bank, card issuer, or payment service immediately through its official app, website, or a trusted telephone number. Ask what recovery steps are available; recovery is not guaranteed. If you exposed account credentials, change them and enable two-factor authentication. [13]

## Impersonation scams matter here too

On September 24, 2026, the FTC announced it was seeking comments on whether to update its government-and-business impersonation rule or take other action concerning platforms’ advertising-optimization practices. This is rulemaking consideration, not a finding that AI shopping agents violate a new rule. [17]

The release states that, in 2025:

- The FTC received **more than 1 million reports about imposter scams**.
- Consumers reported **nearly $3.5 billion in losses** to those scams.
- Separately, **nearly 30% of consumers reporting a scam loss** said first contact occurred on social media.

**These figures are not losses caused by AI shopping agents.** They describe the wider scam environment in which people—and shopping tools acting for them—encounter offers. The social-media percentage is not limited to AI shopping or to the imposter-scam reports. [17]

## What data does a shopping agent need?

The answer should change with the task. Comparing two backpacks may need your budget and requirements. Delivering one needs an address. Charging for it needs payment authorization. Purchase history, loyalty access, browsing context, and connected accounts should each have a clear purpose rather than being treated as a standard bundle.

OpenAI says shopping results can use conversational context such as Memory and Custom Instructions. Its service terms separately explain that enabled apps may receive relevant content and information such as country and state under the app’s own terms. [1][18]

Google describes Universal Cart as using Wallet-related payment perks and loyalty information. That announcement should not be read as blanket permission to search every connected service. [5]

Ask what an integration can read, what it can change, how long access lasts, and how to disconnect it. For the related issue of assistants acting across connected services, see DECODISTA’s [Meta Muse privacy explainer](https://decodista.com/articles/meta-muse-privacy-access-memory-ai-training). Its platform-specific settings should not be assumed to apply to other assistants.

## AI shopping agent vs normal shopping assistant

This table compares functional roles, not fixed industry labels. Individual products may combine them.

| Capability | Normal shopping assistant | Transactional agent |
| --- | --- | --- |
| Find products | Suggests or retrieves options. | Can use discovery as the first step toward an order. |
| Compare | Helps assess trade-offs. | May use the comparison to choose within your instructions. |
| Add to cart | May provide a link or leave selection to you. | May populate a supported cart. |
| Fill checkout | Often hands you to the retailer. | May enter authorized delivery and order details. |
| Use payment authorization | Does not need it to give advice. | Needs a supported authorization mechanism to pay. |
| Place order | Leaves submission to you. | May submit after direct or previously delegated approval. |
| Work in background | May monitor prices without buying. | May act later if its permissions and implementation allow it. |

The distinction is what the tool is allowed to do, not how conversational it sounds. The documented checkout and AP2 examples above illustrate why the last three rows need particular attention. [4][15][16]

## Human approval is the key boundary

An approval screen is most useful when it lets you inspect the actual transaction. Check the merchant, product, variant, quantity, total including taxes and shipping, delivery address, payment method, recurring charges, and return terms.

For example, “find a good printer under $200” leaves room for interpretation. Before buying, decide whether that amount includes delivery and tax, whether refurbished stock is acceptable, and whether an ink subscription is allowed. These are choices you should resolve before the agent converts a recommendation into an order.

Approval does not eliminate counterfeit goods, misleading information, or later delivery problems. It gives you a chance to catch a mismatch before money moves. Where available, require fresh approval when the seller, item, total, or payment method changes.

## What the FTC chair said about AI-agent responsibility

Reuters reported on September 25 that FTC Chairman Andrew Ferguson rejected treating AI agents as independent beings with their own intentions. He suggested that developers instructing agents could bear responsibility for harm and discussed using existing legal tools. [19]

Those remarks indicate an enforcement perspective; they do not determine liability for every shopping error, create a worldwide compensation scheme, or establish that an AI provider must refund a particular purchase. Regulatory treatment is developing, and a consumer’s individual dispute still needs to be assessed on its facts and applicable rules.

## What consumer protections remain unclear

The reviewed sources do not provide a single answer across products and jurisdictions to several questions:

- Who pays when an agent follows a broad instruction but buys an unsuitable item?
- What evidence resolves a disagreement over whether a later purchase matched earlier permission?
- Which support team coordinates a problem spanning an assistant, overseas seller, and payment provider?
- How can a shopper independently assess all incentives affecting a particular ranking?
- What safeguards apply to repeated or recurring autonomous purchases in each implementation?
- What retention and reuse rules apply across all connected services involved in one transaction?

Some programs already specify important responsibilities, including the seller’s role. The gap is not that no rules exist; it is that those answers cannot safely be transferred to every other agent or checkout arrangement. Treat any unclear permission or recovery route as something to resolve before delegating that purchase.

## Before letting an AI agent buy for you: checklist

This review combines the distinctions above with OpenAI’s shopping-research guidance to confirm final costs, variants, and retailer terms before buying. [21]

- [ ] Confirm the merchant’s identity and actual website.
- [ ] Match the exact model, condition, variant, and quantity to your intent.
- [ ] Check the final amount, currency, taxes, delivery fees, and other charges.
- [ ] Verify the payment method and review its relevant buyer or dispute protections.
- [ ] Look for subscriptions, trials, replenishment plans, and recurring charges.
- [ ] Confirm the delivery address and expected arrival date.
- [ ] Read cancellation, return, refund, and return-shipping terms.
- [ ] Restrict connected-account permissions to the task.
- [ ] Require approval for purchases where possible; inspect any standing spending authority carefully.
- [ ] Check the receipt and payment activity afterward, including for duplicate orders.
- [ ] Revoke unnecessary access and stop any purchasing schedule when the task ends.

## FAQ

### What is an AI shopping agent?

It is an AI system able to perform shopping actions for you. Its permissions may stop at building a cart or extend to submitting an authorized order. The implementation matters more than the label. [4][16]

### Can AI shopping agents make purchases?

Some can. Google documents a merchant-site purchasing flow, while supported ChatGPT and Google native checkouts connect to merchant payment systems. Eligibility and approval requirements differ. [4][6][15]

### Can an AI agent use my credit card?

A supported checkout can use authorized card payment credentials. That should happen through its payment flow; a product recommendation alone is not card authorization. [4][6]

### Are AI shopping agents safe?

There is no blanket answer. Examine the seller, permissions, checkout controls, and payment protections. Banks’ principles are aimed at building trust and control, not certifying every available agent. [9]

### Can AI agents be used in scams?

The banks identify fraud concerns. This article’s fake-listing and checkout scenarios illustrate possible risks; they are not evidence of incidents affecting the named products. Ordinary seller fraud also remains relevant. [10][12]

### Who pays if an AI agent buys the wrong product?

Do not assume automatic reimbursement. The purchase terms, what was authorized, the type of error, and applicable rules matter. Contact the seller about correction or return and the platform about the agent error. [7][14]

### Can I charge back an AI-agent purchase?

Ask your card issuer whether the transaction qualifies. AI involvement alone does not settle eligibility; payment method, dispute reason, local rules, and deadlines still matter. [11]

### How do I know the merchant is real?

Check identity, domain, contact information, independent reviews, and return terms together. No single review, padlock, or AI recommendation proves legitimacy. [11][12]

### Does ChatGPT Instant Checkout mean OpenAI is the seller?

No. OpenAI’s ACP documentation identifies the merchant as merchant of record and places payment processing on merchant systems. [4]

### Does Google Universal Cart buy products automatically?

Its background monitoring should not be confused with permission to purchase. Google’s documented native checkout requires final authorization; AP2 separately supports prior delegation within constraints. Do not infer that every Cart has autonomous purchasing enabled. [5][7][16]

### Should I give an AI agent access to my shopping accounts?

Only when needed for a specific task and after reviewing its permissions and terms. A comparison may need no account connection. OpenAI’s app terms specifically advise reviewing the underlying app’s terms and privacy policy. [18]

## Sources & Verification

**Verified October 4, 2026.** This article is based on publicly accessible documentation and reporting. No hands-on purchase, payment, refund, or chargeback testing was performed. Availability statements are limited to the documented scope; announced rollout schedules are not treated as proof of universal access.

### Official sources

- **[1]** [OpenAI — Shopping with ChatGPT Search](https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search). Current shopping, merchant-ranking, advertising, and eligibility language.
- **[2]** [OpenAI — Powering Product Discovery in ChatGPT](https://openai.com/index/powering-product-discovery-in-chatgpt/), March 24, 2026. Merchant checkout direction.
- **[3]** [OpenAI — Plugin guidelines, Checkout](https://developers.openai.com/plugins/plugin-guidelines). Limited Instant Checkout beta and external-checkout requirements.
- **[4]** [OpenAI — ACP key concepts](https://developers.openai.com/commerce/guides/key-concepts?device=c). Delegated payment, merchant systems, and merchant-of-record roles.
- **[5]** [Google — Introducing the Universal Cart and more ways to help you shop](https://blog.google/products-and-platforms/products/shopping/google-shopping-cart/), May 19, 2026. Cart, Wallet, and announced rollout scope.
- **[6]** [Google — About UCP and UCP-powered checkout](https://support.google.com/merchants/answer/16837055?hl=en). Eligibility, Google Pay, and credential support.
- **[7]** [Google — US Checkout Addendum](https://merchants.google.com/files/tos/ucp_integration/US/1_00_tos.html), updated June 24, 2026. Authorization, merchant responsibility, and payment-data restrictions.
- **[8]** [Google — Boost your holiday sales with these agentic commerce updates](https://blog.google/products-and-platforms/products/shopping/google-shopping-updates-holiday-shopping/), September 16, 2026. Later UCP implementation and rollout update.
- **[9]** [NatWest Group — Global banks collaborate on principles for trusted agentic commerce](https://www.natwestgroup.com/news-and-insights/news-room/press-releases/2026/global-banks-collaborate-on-principles-for-trusted-agentic-comme.html). Participants and joint-paper context.
- **[11]** [FTC — Online Shopping](https://consumer.ftc.gov/articles/online-shopping). Seller, pricing, payment, and US dispute guidance.
- **[12]** [FTC — Buying From an Online Marketplace](https://consumer.ftc.gov/articles/buying-online-marketplace). Seller checks and platform-protection limits.
- **[13]** [FTC — What To Do if You Were Scammed](https://consumer.ftc.gov/articles/what-do-if-you-were-scammed). Recovery and account-security steps.
- **[14]** [OpenAI — Buy it in ChatGPT: Instant Checkout and the Agentic Commerce Protocol](https://openai.com/index/buy-it-in-chatgpt/), September 29, 2025. Original confirmation and merchant-support design; not used as a current merchant or region roster.
- **[15]** [Google — Let AI do the hard parts of your holiday shopping](https://blog.google/products-and-platforms/products/shopping/agentic-checkout-holiday-ai-shopping/), November 13, 2025. Merchant-site agentic checkout and permission requirement; linked by current Merchant Center documentation.
- **[16]** [AP2 — Specification, Modes](https://ap2-protocol.org/ap2/specification/). Direct approval versus prior constrained delegation.
- **[17]** [FTC — Public comment on platforms and impersonation scams](https://www.ftc.gov/news-events/news/press-releases/2026/09/ftc-seeks-public-comment-whether-update-rule-impersonation-government-businesses-address-platforms), September 24, 2026. Rulemaking status and 2025 scam statistics.
- **[18]** [OpenAI — Service terms, Apps](https://openai.com/policies/service-terms/). Third-party app data and terms.

- **[20]** [CFPB — How do I dispute a charge on my credit card bill?](https://www.consumerfinance.gov/ask-cfpb/how-do-i-dispute-a-charge-on-my-credit-card-bill-en-61/). US credit-card dispute procedure.
- **[21]** [OpenAI — Using shopping research in ChatGPT](https://help.openai.com/en/articles/12911370-using-shopping-research-in-chatgpt). Consumer verification of price, variants, and retailer policies.
- **[22]** [OpenAI — Commerce policies](https://openai.com/policies/commerce-policies/), updated June 24, 2026. Prohibited deceptive merchant practices.
- **[23]** [Google — How to onboard to the UCP integration hub in Merchant Center](https://support.google.com/merchants/answer/16992327?hl=en). Merchant Center onboarding rollout, distinct from checkout eligibility.

### Independent reporting

- **[10]** [Reuters — Banks warn AI shopping bots raise scam, fraud and data-privacy risks](https://www.reuters.com/legal/litigation/banks-warn-ai-shopping-bots-raise-scam-fraud-data-privacy-risks-2026-09-22/), September 22, 2026. Reviewed through the retrieved Reuters article text; direct page opening was unavailable.
- **[19]** [Reuters via CNA — FTC chair suggests AI developers should be liable for conduct of agents](https://www.channelnewsasia.com/business/ftc-chair-suggests-ai-developers-should-be-liable-conduct-agents-6411691), September 25, 2026. Syndicated Reuters report; original Reuters URL could not be opened directly.
