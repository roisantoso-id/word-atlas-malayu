// README 截图：node scripts/shot-malay.mjs [网址]，输出到 docs/assets/malay-*.jpg
import { chromium } from "playwright";
const BASE = process.argv[2] || "https://words.bahasa.cn/";
const exe = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await chromium.launch({ executablePath: exe });
const settings = JSON.stringify({ onboarded: true, splash: false, theme: "dark", sfx: false, ambience: "off", dailyNew: 10, startLevel: 0 });
async function shot(name, hash, viewport, after) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2, locale: "zh-CN" });
  await ctx.addInitScript((s) => localStorage.setItem("word-atlas:settings", s), settings);
  const page = await ctx.newPage();
  await page.goto(BASE + hash, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  if (after) await after(page);
  await page.screenshot({ path: `docs/assets/malay-${name}.jpg`, type: "jpeg", quality: 82 });
  await ctx.close();
  console.log("ok", name);
}
await shot("today-desktop", "#/today", { width: 1280, height: 800 });
await shot("atlas-desktop", "#/atlas", { width: 1280, height: 800 });
await shot("learn-mobile", "#/learn", { width: 390, height: 844 });
await shot("quiz-mobile", "#/learn", { width: 390, height: 844 }, async (p) => {
  for (let i = 0; i < 5; i++) { await p.keyboard.press("Enter"); await p.waitForTimeout(700); }
});
await browser.close();
