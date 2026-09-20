import path from "node:path";
import type { Plugin } from "vite";
import { loadArticles } from "../scripts/content-loader.mjs";

const PUBLIC_ID = "virtual:decodista-articles";
const RESOLVED_ID = `\0${PUBLIC_ID}`;

export function articleContent(): Plugin {
  let projectRoot = process.cwd();

  return {
    name: "decodista-article-content",
    enforce: "pre",
    configResolved(config) {
      projectRoot = config.root;
    },
    resolveId(id) {
      return id === PUBLIC_ID ? RESOLVED_ID : undefined;
    },
    load(id) {
      if (id !== RESOLVED_ID) return undefined;
      const loaded = loadArticles(projectRoot);
      for (const file of loaded.files) this.addWatchFile(file);
      return `export const cmsArticles = ${JSON.stringify(loaded.articles)};`;
    },
    handleHotUpdate(context) {
      const articleRoot = `${path.join(projectRoot, "content/articles")}${path.sep}`;
      if (!context.file.startsWith(articleRoot)) return;
      const module = context.server.moduleGraph.getModuleById(RESOLVED_ID);
      if (!module) return;
      context.server.moduleGraph.invalidateModule(module);
      return [module];
    },
  };
}
