import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const base=process.env.ARTICLE_PREVIEW_URL ?? "http://localhost:5173";
const output="artifacts/storage-article-qa";
await mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:"chrome",headless:true});
const articles=[
  {slug:"gmail-not-receiving-emails-google-storage-full",title:"Gmail Not Receiving Emails Because Google Storage Is Full? Fix It Safely"},
  {slug:"iphone-storage-full-icloud-has-space",title:"iPhone Storage Full but iCloud Has Space? What's Actually Full and How to Fix It"},
];
const viewports=[
  {name:"desktop-light",width:1440,height:900,theme:"light"},
  {name:"tablet-light",width:768,height:900,theme:"light"},
  {name:"mobile-light",width:390,height:844,theme:"light"},
  {name:"small-mobile-dark",width:320,height:720,theme:"dark"},
];
const results=[];
const failures=[];
for(const article of articles){
  for(const vp of viewports){
    const context=await browser.newContext({viewport:{width:vp.width,height:vp.height},colorScheme:vp.theme,reducedMotion:"reduce"});
    const page=await context.newPage();
    const errors=[];
    page.on("pageerror",e=>errors.push(e.message));
    const report={slug:article.slug,viewport:vp.name};
    try{
      const url=`${base}/articles/${article.slug}`;
      const resp=await page.goto(url,{waitUntil:"domcontentloaded",timeout:45000});
      assert(resp && resp.status()===200,`Article must respond 200: ${url}`);
      await page.locator("h1").first().waitFor({state:"visible",timeout:20000});
      if(vp.theme==="dark")await page.evaluate(()=>document.documentElement.dataset.theme="dark");
      assert.equal(await page.locator("h1").first().innerText(),article.title,"Article title should match approved editorial copy");
      assert.equal(await page.locator("aside.short-answer").count(),1,"Short answer required");
      assert.equal(await page.locator("#key-takeaways").count(),1,"Key takeaways required");
      assert.equal(await page.locator("#faq").count(),1,"FAQ required");
      assert.equal(await page.locator("#sources-verification").count(),1,"Source notes required");
      assert((await page.locator("nav.toc a").count())>=4,"In-page contents links expected");
      assert.equal(await page.locator("main #main-content").count(),0,"Main region must not be nested");
      const hero=page.locator("figure.article-hero img").first();
      await hero.waitFor({state:"visible",timeout:20000});
      const image=await hero.evaluate(async img=>{
        if(!img.complete) await new Promise(resolve=>{
          img.addEventListener("load",resolve,{once:true});
          img.addEventListener("error",resolve,{once:true});
          setTimeout(resolve,15000);
        });
        return {complete:img.complete,naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight,alt:img.alt,currentSrc:img.currentSrc};
      });
      assert(image.naturalWidth>0 && image.naturalHeight>0,"Hero image must load");
      assert(image.alt.length>=20,"Meaningful image alt text expected");
      const canonical=await page.locator('link[rel="canonical"]').getAttribute("href");
      assert(canonical?.endsWith(`/articles/${article.slug}`),"Article canonical URL must match slug");
      const stats=await page.evaluate(()=>({width:window.innerWidth,documentWidth:document.documentElement.scrollWidth}));
      assert(stats.documentWidth<=stats.width+1,`Unexpected horizontal overflow: ${stats.documentWidth} vs ${stats.width}`);
      assert(!errors.length,`Page runtime errors: ${errors.join(" | ")}`);
      assert(!(await page.locator("body").innerText()).includes("Publication gate:"),"No editorial staging notes may leak into live content");
      await page.screenshot({path:`${output}/${article.slug}-${vp.name}.png`,fullPage:false});
      report.status="passed";report.image=image;report.stats=stats;
    }catch(error){
      report.status="failed";report.error=String(error);report.runtimeErrors=errors;
      failures.push(`${article.slug}/${vp.name}: ${String(error)}`);
      await page.screenshot({path:`${output}/${article.slug}-${vp.name}-failure.png`,fullPage:false}).catch(()=>{});
    }finally{
      results.push(report);await context.close();
    }
  }
}
await browser.close();
await writeFile(`${output}/report.json`,JSON.stringify({base,results,failures},null,2));
console.log(JSON.stringify({base,results,failures},null,2));
if(failures.length)process.exitCode=1;
