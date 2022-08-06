import puppeteer from "puppeteer";

import express from "express";

const app = express();

async function initialize(req, res) {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto(
    "https://cademinhaentrega.com.br/gfl/tracking/E/26300797561493407500010001",
    {
      waitUntil: "load",
    }
  );

  await page.waitForTimeout(1000);
  await page.click(".md.accordion-group-expand-compact.hydrated");

  const items = await page.evaluate(() => {
    const items = Array.from(
      document.querySelectorAll(
        ".ion-no-padding.item.md.item-fill-none.in-list.hydrated.item-label"
      )
    );
    return items
      .map((item) => {
        return {
          info: item.querySelector("h4")?.innerText,
          date: item.querySelector("h5")?.innerText,
          hour: item.querySelector("h6")?.innerText,
        };
      })
      .reverse();
  });
  res.send(items);
  await browser.close();
}

app.get("/", initialize);

app.listen(4000, () => {
  console.log("server running on port 4000");
});
