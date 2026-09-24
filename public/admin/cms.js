import {
  getBodySectionState,
  isBlankCmsValue,
  isEntirelyBlankCmsValue,
  normalizeCmsArticleData,
  validateCmsArticleData,
} from "/admin/content-rules.mjs?v=20260924-1";

if (window.CMS && window.createClass && window.h) {
  const h = window.h;
  const toArray = (value) => {
    if (!value) return [];
    if (typeof value.toJS === "function") return value.toJS();
    return Array.isArray(value) ? value : [];
  };

  const normalizeEntryMap = (data) => {
    const normalized = normalizeCmsArticleData(data.toJS());
    let next = data;

    for (const key of data.keySeq().toArray()) {
      if (!Object.hasOwn(normalized, key)) next = next.delete(key);
    }

    for (const field of ["topics", "keyTakeaways", "relatedArticles"]) {
      const value = next.get(field);
      if (value && typeof value.filter === "function") {
        next = next.set(field, value.filter((item) => !isBlankCmsValue(item)));
      }
    }

    const faqs = next.get("faqs");
    if (faqs && typeof faqs.filter === "function") {
      next = next.set("faqs", faqs.filter((item) => {
        const plain = item && typeof item.toJS === "function" ? item.toJS() : item;
        return !isEntirelyBlankCmsValue(plain);
      }));
    }

    return next;
  };

  window.CMS.registerEventListener({
    name: "preSave",
    handler: ({ entry }) => normalizeEntryMap(entry.get("data")),
  });

  window.CMS.registerEventListener({
    name: "prePublish",
    handler: ({ entry }) => {
      const normalized = normalizeCmsArticleData(entry.get("data").toJS());
      const errors = validateCmsArticleData(normalized);
      if (errors.length) {
        console.error("[DECODISTA CMS] Publish validation failed:", errors.join(" | "));
        throw new Error(`This article is not ready to publish:\n• ${errors.join("\n• ")}`);
      }
    },
  });

  const ArticlePreview = window.createClass({
    render() {
      const entry = this.props.entry;
      const data = entry.get("data");
      const normalized = normalizeCmsArticleData(data.toJS());
      const get = (name, fallback = "") => normalized[name] ?? fallback;
      const asset = this.props.getAsset(get("heroImage"));
      const topics = toArray(get("topics"));
      const takeaways = toArray(get("keyTakeaways"));
      const faqs = toArray(get("faqs"));
      const bodySections = getBodySectionState(String(get("body")));
      const bodyIncludesFaq = Boolean(bodySections.faq?.hasContent);
      const bodyIncludesSources = Boolean(bodySections.sources?.hasContent);

      return h("main", { className: "cms-preview" },
        h("header", { className: "cms-preview__header" },
          h("p", { className: "cms-preview__kicker" }, `${get("primaryCategory")} · ${get("contentType")}`),
          h("h1", {}, get("title", "Untitled article")),
          h("p", { className: "cms-preview__deck" }, get("deck")),
          h("p", { className: "cms-preview__meta" }, `${get("author", "DECODISTA Editorial")} · ${get("publishedAt", "Draft")}`),
        ),
        asset && h("img", { className: "cms-preview__hero", src: asset.toString(), alt: get("heroImageAlt") }),
        h("article", { className: "cms-preview__article" },
          h("aside", { className: "cms-preview__answer" },
            h("span", {}, "THE DIRECT ANSWER"),
            h("h2", {}, "Short answer"),
            this.props.widgetFor("shortAnswer"),
          ),
          get("introduction") && this.props.widgetFor("introduction"),
          h("section", { className: "cms-preview__takeaways" },
            h("h2", {}, "Key takeaways"),
            h("ul", {}, ...takeaways.map((item, index) => h("li", { key: index }, String(item)))),
          ),
          this.props.widgetFor("body"),
          bodyIncludesFaq && faqs.length > 0 && h("aside", { className: "cms-preview__answer" },
            "The published page uses the structured FAQ list in place of the FAQ section in the Main Article Body. Keep only one FAQ source for a clearer preview.",
          ),
          !bodyIncludesFaq && faqs.length > 0 && h("section", {},
            h("h2", {}, "FAQ"),
            ...faqs.map((faq, index) => h("div", { key: index }, h("h3", {}, faq.question), h("p", {}, faq.answer))),
          ),
          !bodyIncludesSources && get("sourcesVerification") && h("section", {},
            h("h2", {}, "Sources and verification"),
            this.props.widgetFor("sourcesVerification"),
          ),
          h("p", { className: "cms-preview__topics" }, topics.join(" · ")),
        ),
      );
    },
  });

  window.CMS.registerPreviewTemplate("articles", ArticlePreview);
  window.CMS.registerPreviewStyle("/admin/preview.css");
}
