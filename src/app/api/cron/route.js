import { NextResponse } from 'next/server';
import puppeteer from "puppeteer-core";

const runningRankingBR = async () => {
  try {
      // const browser = await puppeteer.launch({
      //     headless: "new",
      //     args: ['--no-sandbox']
      // });

      const browser = await puppeteer.connect({
          browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.NEXT_PUBLIC_BLESS_TOKEN}`,
      })

      const page = await browser.newPage();

      await page.goto(`https://topragnarok.com.br/detail/23376`);

      const sel = ".flex-grow.pl-2.overflow-hidden"

      const data = await page.evaluate((sel) => {
          let elements = Array.from(document.querySelectorAll(sel));
          let links = elements.map((element) => {
              return element.innerText
          })
          return links;
      }, sel);

      await browser.close();

      return data
  }
  catch (error) {
      console.log(error);
  }
}

export async function GET() {
  const data = await runningRankingBR()
  return NextResponse.json({ ok: true, data });
}