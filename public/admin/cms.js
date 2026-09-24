(function () {
  "use strict";

  if (!window.CMS || !window.createClass || !window.h) return;

  const h = window.h;
  const toArray = (value) => {
    if (!value) return [];
    if (typeof value.toJS === "function") return value.toJS();
    return Array.isArray(value) ? value : [];
  };

  const ArticlePreview = window.createClass({
    render() {
      const entry = this.props.entry;
      const data = entry.get("data");
      const get = (name, fallback = "") => data.get(name) ?? fallback;
      const asset = this.props.getAsset(get("heroImage"));
      const topics = toArray(get("topics"));
      const takeaways = toArray(get("keyTakeaways"));
      const faqs = toArray(get("faqs")).filter((faq) => faq?.question && faq?.answer);
      const bodyIncludesSources = /^##\s+Sources\s+(?:&|and)\s+Verification\s*$/im.test(String(get("body")));

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
          faqs.length > 0 && h("section", {},
            h("h2", {}, "FAQ"),
            ...faqs.map((faq, index) => h("div", { key: index }, h("h3", {}, faq.question), h("p", {}, faq.answer))),
          ),
          !bodyIncludesSources && h("section", {}, h("h2", {}, "Sources and verification"), this.props.widgetFor("sourcesVerification")),
          h("p", { className: "cms-preview__topics" }, topics.join(" · ")),
        ),
      );
    },
  });

  window.CMS.registerPreviewTemplate("articles", ArticlePreview);
  window.CMS.registerPreviewStyle("/admin/preview.css");
})();
